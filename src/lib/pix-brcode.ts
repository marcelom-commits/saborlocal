import QRCodePix from "qrcode-pix";

export async function buildPixBRCode(params: { key: string; amount: number; receiver: string; description?: string }) {
  const pix = QRCodePix({
    version: "01",
    key: params.key,
    amount: params.amount,
    name: params.receiver,
    city: "Brasilia",
    transactionId: "SABORLOCAL",
    message: params.description || "Pedido SaborLocal",
  });

  return pix.payload();
}
