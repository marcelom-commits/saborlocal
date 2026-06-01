export function formatOrderNumber(num: number): string {
  return `#${String(num).padStart(6, "0")}`;
}

export function formatPrice(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export const orderStatusLabels: Record<string, string> = {
  PENDING: "Pendente",
  PAID: "Pago",
  PREPARING: "Preparando",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  CANCELED: "Cancelado",
};

export const paymentStatusLabels: Record<string, string> = {
  PENDING: "Aguardando",
  APPROVED: "Aprovado",
  REJECTED: "Rejeitado",
  REFUNDED: "Reembolsado",
};

export const shipmentStatusLabels: Record<string, string> = {
  PENDING: "Pendente",
  READY_TO_SHIP: "Pronto para envio",
  SHIPPED: "Enviado",
  DELIVERED: "Entregue",
  RETURNED: "Devolvido",
};
