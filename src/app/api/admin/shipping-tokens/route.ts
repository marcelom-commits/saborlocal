import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function GET() {
  const admin = await requireAdminApi();
  if (admin instanceof NextResponse) return admin;

  const tokens = await prisma.shippingToken.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(tokens);
}

export async function POST(request: Request) {
  const admin = await requireAdminApi();
  if (admin instanceof NextResponse) return admin;

  try {
    const { price } = await request.json();
    const token = crypto.randomBytes(16).toString("hex");
    const shippingToken = await prisma.shippingToken.create({
      data: { token, price: parseFloat(price) },
    });
    return NextResponse.json(shippingToken, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erro ao gerar token" }, { status: 400 });
  }
}
