import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/access";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const admin = await requireAdminApi();
  if (admin instanceof NextResponse) return admin;

  const { searchParams } = new URL(request.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  const startDate = start ? new Date(start) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const endDate = end ? new Date(end + "T23:59:59") : new Date();

  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: startDate, lte: endDate },
      status: { notIn: ["CANCELED"] },
    },
    select: { createdAt: true, total: true },
    orderBy: { createdAt: "asc" },
  });

  const dailyMap = new Map<string, { orders: number; revenue: number }>();
  orders.forEach((order) => {
    const date = order.createdAt.toISOString().split("T")[0];
    const existing = dailyMap.get(date) || { orders: 0, revenue: 0 };
    existing.orders += 1;
    existing.revenue += Number(order.total);
    dailyMap.set(date, existing);
  });

  const data = Array.from(dailyMap.entries()).map(([date, values]) => ({
    date,
    orders: values.orders,
    revenue: values.revenue,
  }));

  const total = data.reduce((sum, d) => sum + d.revenue, 0);

  return NextResponse.json({ data, total });
}
