import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/access";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUserApi();
  if (user instanceof NextResponse) return user;

  try {
    const { id } = await params;
    const data = await request.json();
    const address = await prisma.address.update({
      where: { id, customerProfile: { userId: user.id } },
      data,
    });
    return NextResponse.json(address);
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUserApi();
  if (user instanceof NextResponse) return user;

  try {
    const { id } = await params;
    await prisma.address.delete({
      where: { id, customerProfile: { userId: user.id } },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro ao remover" }, { status: 400 });
  }
}
