import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.json({ error: "orderId é obrigatório" }, { status: 400 });
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.payment.update({
        where: { orderId },
        data: { status: "APPROVED", paidAt: new Date() },
      });
      await tx.order.update({
        where: { id: orderId },
        data: { status: "PAID" },
      });
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return NextResponse.redirect(new URL(`/checkout/sucesso?orderId=${orderId}`, baseUrl));
  } catch {
    return NextResponse.json({ error: "Erro ao processar callback" }, { status: 400 });
  }
}
