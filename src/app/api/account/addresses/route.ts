import { NextResponse } from "next/server";
import { requireUserApi } from "@/lib/access";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const user = await requireUserApi();
  if (user instanceof NextResponse) return user;

  try {
    const profile = await prisma.customerProfile.upsert({
      where: { userId: user.id },
      update: {},
      create: { userId: user.id },
    });

    const data = await request.json();
    const address = await prisma.address.create({
      data: { ...data, customerProfileId: profile.id },
    });
    return NextResponse.json(address, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro ao criar endereço" }, { status: 400 });
  }
}
