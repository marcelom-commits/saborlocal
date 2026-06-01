import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { sendOrderStatusEmail } from "@/lib/notification";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdminApi();
  if (admin instanceof NextResponse) return admin;

  try {
    const { id } = await params;
    const { status } = await request.json();

    const order = await prisma.order.update({
      where: { id },
      data: { status },
      include: { user: true },
    });

    if (order.user?.email) {
      await sendOrderStatusEmail({
        email: order.user.email,
        orderNumber: order.orderNumber,
        status,
      });
    }

    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar status" }, { status: 400 });
  }
}
