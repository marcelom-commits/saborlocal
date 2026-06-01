import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/access";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const admin = await requireAdminApi();
  if (admin instanceof NextResponse) return admin;

  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") || "all";

  let dateFilter: Date | undefined;
  const now = new Date();

  if (period === "today") {
    dateFilter = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  } else if (period === "week") {
    dateFilter = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  } else if (period === "month") {
    dateFilter = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  const where = dateFilter ? { createdAt: { gte: dateFilter } } : {};

  const [total, paid, shipped, delivered, pending, canceled] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.count({ where: { ...where, status: "PAID" } }),
    prisma.order.count({ where: { ...where, status: "SHIPPED" } }),
    prisma.order.count({ where: { ...where, status: "DELIVERED" } }),
    prisma.order.count({ where: { ...where, status: "PENDING" } }),
    prisma.order.count({ where: { ...where, status: "CANCELED" } }),
  ]);

  return NextResponse.json({ total, paid, shipped, delivered, pending, canceled });
}
