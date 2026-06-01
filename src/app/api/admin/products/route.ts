import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true, images: { take: 1 }, variants: true },
  });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const admin = await requireAdminApi();
  if (admin instanceof NextResponse) return admin;

  try {
    const data = await request.json();
    const product = await prisma.product.create({
      data: {
        ...data,
        slug: slugify(data.name),
        price: parseFloat(data.price),
        stock: parseInt(data.stock) || 0,
        isActive: data.isActive ?? true,
        isFeatured: data.isFeatured ?? false,
      },
    });
    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erro ao criar" }, { status: 400 });
  }
}
