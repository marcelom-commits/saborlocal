import { NextResponse } from "next/server";
import { addToCart } from "@/lib/cart";

export async function POST(request: Request) {
  try {
    const { productId, quantity, unitPrice } = await request.json();
    await addToCart(productId, quantity || 1, unitPrice);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao adicionar" }, { status: 400 });
  }
}
