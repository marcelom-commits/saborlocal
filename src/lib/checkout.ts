import { prisma } from "./prisma";
import { getShippingOptionByRegion } from "./shipping";
import { getPixSettings } from "./store-settings";

export function buildShippingQuote(zipCode: string) {
  const digit = parseInt(zipCode.replace(/\D/g, "").slice(0, 1), 10);
  if (isNaN(digit)) return null;

  if (digit >= 1 && digit <= 3) return getShippingOptionByRegion("plano-piloto");
  if (digit >= 4 && digit <= 6) return getShippingOptionByRegion("sobradinho-1");
  if (digit >= 7 && digit <= 8) return getShippingOptionByRegion("sobradinho-2");
  return getShippingOptionByRegion("outra");
}

export async function createOrderAndPayment(params: {
  userId?: string;
  customerProfileId?: string;
  cartId: string;
  items: any[];
  subtotal: number;
  shippingCost: number;
  total: number;
  address: any;
  paymentMethod: string;
  shippingTokenId?: string;
}) {
  const lastOrder = await prisma.order.findFirst({ orderBy: { orderNumber: "desc" } });
  const orderNumber = (lastOrder?.orderNumber ?? 0) + 1;

  const order = await prisma.$transaction(async (tx) => {
    const o = await tx.order.create({
      data: {
        orderNumber,
        userId: params.userId,
        customerProfileId: params.customerProfileId,
        subtotal: params.subtotal,
        shippingCost: params.shippingCost,
        total: params.total,
        recipientName: params.address.recipientName,
        street: params.address.street,
        number: params.address.number,
        complement: params.address.complement,
        district: params.address.district,
        city: params.address.city,
        state: params.address.state,
        zipCode: params.address.zipCode,
        items: {
          create: params.items.map((item: any) => ({
            productId: item.productId,
            productName: item.product.name,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: Number(item.unitPrice) * item.quantity,
          })),
        },
        shipment: {
          create: {
            shippingMethod: getShippingOptionByRegion(params.address.district)?.label || "Padrão",
            shippingCost: params.shippingCost,
            status: "PENDING",
          },
        },
      },
      include: { items: true, payment: true, shipment: true },
    });

    await tx.payment.create({
      data: {
        orderId: o.id,
        gateway: params.paymentMethod === "pix" ? "pix" : "mock",
        method: params.paymentMethod,
        amount: params.total,
        status: "PENDING",
      },
    });

    await tx.cartItem.deleteMany({ where: { cartId: params.cartId } });

    if (params.shippingTokenId) {
      await tx.shippingToken.update({
        where: { id: params.shippingTokenId },
        data: { isUsed: true, usedAt: new Date(), orderId: o.id },
      });
    }

    return o;
  });

  return order;
}
