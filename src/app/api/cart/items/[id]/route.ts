import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { quantity } = await request.json();
    await prisma.cartItem.update({ where: { id }, data: { quantity } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro" }, { status: 400 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.cartItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro" }, { status: 400 });
  }
}
