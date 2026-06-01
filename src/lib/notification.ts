export async function sendOrderStatusEmail(params: { email: string; orderNumber: number; status: string }) {
  console.log(`[EMAIL] Pedido #${params.orderNumber} atualizado para ${params.status} - enviado para ${params.email}`);
}
