import { cookies } from "next/headers";
import { prisma } from "./prisma";
import crypto from "crypto";

function getCartToken(): string | undefined {
  const cookieStore = cookies();
  return cookieStore.get("cart_token")?.value;
}

function setCartToken(token: string) {
  const cookieStore = cookies();
  cookieStore.set("cart_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
}

export async function getOrCreateCart(userId?: string) {
  let token = getCartToken();
  let cart = null;

  if (token) {
    cart = await prisma.cart.findUnique({
      where: { cartToken: token },
      include: { items: { include: { product: { include: { images: { take: 1 } } } } } },
    });
  }

  if (!cart) {
    token = crypto.randomUUID();
    setCartToken(token);
    cart = await prisma.cart.create({
      data: { cartToken: token, userId },
      include: { items: { include: { product: { include: { images: { take: 1 } } } } } },
    });
  }

  if (userId && !cart.userId) {
    cart = await prisma.cart.update({
      where: { id: cart.id },
      data: { userId },
      include: { items: { include: { product: { include: { images: { take: 1 } } } } } },
    });
  }

  return cart;
}

export async function addToCart(productId: string, quantity: number, unitPrice: number) {
  const cart = await getOrCreateCart();
  const existing = cart.items.find((item) => item.productId === productId);

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId, quantity, unitPrice },
    });
  }
}

export async function getCartByToken() {
  const token = getCartToken();
  if (!token) return null;
  return prisma.cart.findUnique({
    where: { cartToken: token },
    include: { items: { include: { product: { include: { images: { take: 1 } } } } } },
  });
}

export async function clearCart(cartId: string) {
  await prisma.cartItem.deleteMany({ where: { cartId } });
}

export function getCartTotals(items: { unitPrice: any; quantity: number }[]) {
  const subtotal = items.reduce((sum, item) => sum + Number(item.unitPrice) * item.quantity, 0);
  return { subtotal };
}
