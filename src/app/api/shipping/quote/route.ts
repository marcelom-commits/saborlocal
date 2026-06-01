import { NextResponse } from "next/server";
import { buildShippingQuote } from "@/lib/checkout";

export async function POST(request: Request) {
  const { zipCode } = await request.json();
  const option = buildShippingQuote(zipCode);

  if (!option) {
    return NextResponse.json({ error: "Região não encontrada" }, { status: 404 });
  }

  return NextResponse.json({
    region: option.label,
    shippingCost: option.price,
    estimatedDays: option.days,
  });
}
