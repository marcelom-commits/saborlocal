import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/access";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const admin = await requireAdminApi();
  if (admin instanceof NextResponse) return admin;

  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    include: {
      customerProfile: {
        include: {
          _count: { select: { orders: true } },
          addresses: true,
        },
      },
    },
  });

  return NextResponse.json(customers);
}
