import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const { token } = await request.json();
  const shippingToken = await prisma.shippingToken.findUnique({ where: { token } });

  if (!shippingToken || shippingToken.isUsed) {
    return NextResponse.json({ valid: false, error: "Token inválido ou já usado" });
  }

  return NextResponse.json({ valid: true, price: shippingToken.price });
}
