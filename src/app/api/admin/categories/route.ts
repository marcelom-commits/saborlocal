import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return NextResponse.json(categories);
}

export async function POST(request: Request) {
  const admin = await requireAdminApi();
  if (admin instanceof NextResponse) return admin;

  try {
    const data = await request.json();
    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: slugify(data.name),
        description: data.description || null,
        isActive: data.isActive ?? true,
        sortOrder: parseInt(data.sortOrder) || 0,
      },
    });
    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erro ao criar" }, { status: 400 });
  }
}
