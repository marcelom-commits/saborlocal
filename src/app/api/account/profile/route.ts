import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/access";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {
  const user = await requireUserApi();
  if (user instanceof NextResponse) return user;

  try {
    const { name, phone } = await request.json();
    await prisma.user.update({
      where: { id: user.id },
      data: { name },
    });
    await prisma.customerProfile.upsert({
      where: { userId: user.id },
      update: { phone },
      create: { userId: user.id as string, phone },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 400 });
  }
}
