import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getOrCreateCart, getCartTotals } from "@/lib/cart";
import { createOrderAndPayment } from "@/lib/checkout";

export async function POST(request: Request) {
  try {
    const session = await auth();
    const cart = await getOrCreateCart(session?.user?.id);

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Carrinho vazio" }, { status: 400 });
    }

    const { subtotal } = getCartTotals(cart.items);
    const body = await request.json();
    const { address, paymentMethod, shippingCost, total, shippingToken } = body;

    let userId = session?.user?.id;
    let customerProfileId: string | undefined;

    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { customerProfile: true },
      });
      customerProfileId = user?.customerProfile?.id;

      if (!customerProfileId) {
        const profile = await prisma.customerProfile.create({
          data: { userId },
        });
        customerProfileId = profile.id;
      }
    }

    const order = await createOrderAndPayment({
      userId,
      customerProfileId,
      cartId: cart.id,
      items: cart.items,
      subtotal,
      shippingCost: shippingCost || 0,
      total: total || subtotal + (shippingCost || 0),
      address: address || {},
      paymentMethod: paymentMethod || "pix",
    });

    return NextResponse.json({ orderId: order.id, orderNumber: order.orderNumber }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Erro ao processar pedido" }, { status: 400 });
  }
}
