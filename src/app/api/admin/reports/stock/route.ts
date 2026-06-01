import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/access";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const admin = await requireAdminApi();
  if (admin instanceof NextResponse) return admin;

  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: { name: true, sku: true, stock: true, price: true },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ data: products });
}
