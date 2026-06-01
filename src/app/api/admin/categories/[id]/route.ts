import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/access";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminApi();
  if (admin instanceof NextResponse) return admin;

  try {
    const { id } = await params;
    const data = await request.json();
    const category = await prisma.category.update({ where: { id }, data });
    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminApi();
  if (admin instanceof NextResponse) return admin;

  try {
    const { id } = await params;
    await prisma.category.update({ where: { id }, data: { isActive: false } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro ao remover" }, { status: 400 });
  }
}
