import { prisma } from "./prisma";
import { getPixSettings } from "./store-settings";

export async function createMercadoPagoPreference(order: any, paymentMethod: string) {
  if (paymentMethod === "pix") {
    const pixSettings = await getPixSettings();
    return {
      id: `mock-pix-${order.id}`,
      payment_method: "pix",
      pix_key: pixSettings?.pixKey || "61993762268",
      pix_key_type: pixSettings?.pixKeyType || "telefone",
      pix_receiver: pixSettings?.pixReceiver || "SaborLocal",
      amount: Number(order.total),
      status: "pending",
      qr_code: "000201010212261060014br.gov.bcb.pix2558pix.example.com/qr/v2/1234",
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/payments/mock-callback?orderId=${order.id}`,
    };
  }

  return {
    id: `mock-card-${order.id}`,
    payment_method: "card",
    amount: Number(order.total),
    status: "approved",
    callback_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/payments/mock-callback?orderId=${order.id}`,
  };
}

export function normalizePaymentMethod(method: string): string {
  const map: Record<string, string> = {
    pix: "pix",
    credit_card: "credit_card",
    debit_card: "debit_card",
    boleto: "boleto",
  };
  return map[method] || "pix";
}
