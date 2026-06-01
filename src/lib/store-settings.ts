import { prisma } from "./prisma";

async function getSetting(key: string): Promise<string | null> {
  const setting = await prisma.storeSetting.findUnique({ where: { key } });
  return setting?.value ?? null;
}

async function upsertSetting(key: string, value: string) {
  await prisma.storeSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

export async function getPixSettings() {
  const [pixKey, pixKeyType, pixReceiver] = await Promise.all([
    getSetting("pixKey"),
    getSetting("pixKeyType"),
    getSetting("pixReceiver"),
  ]);
  return {
    pixKey: pixKey || process.env.NEXT_PUBLIC_PIX_KEY || "",
    pixKeyType: pixKeyType || "telefone",
    pixReceiver: pixReceiver || "SaborLocal",
  };
}

export async function upsertPixSettings(data: { pixKey: string; pixKeyType: string; pixReceiver: string }) {
  await Promise.all([
    upsertSetting("pixKey", data.pixKey),
    upsertSetting("pixKeyType", data.pixKeyType),
    upsertSetting("pixReceiver", data.pixReceiver),
  ]);
}

export async function getWhatsAppSettings() {
  const phone = await getSetting("whatsappPhone");
  const message = await getSetting("whatsappMessage");
  return {
    phone: phone || process.env.NEXT_PUBLIC_WHATSAPP || "5561999990000",
    message: message || "Ola! Gostaria de saber mais sobre os produtos.",
  };
}

export async function upsertWhatsAppSettings(data: { phone: string; message: string }) {
  await Promise.all([
    upsertSetting("whatsappPhone", data.phone),
    upsertSetting("whatsappMessage", data.message),
  ]);
}

export async function getMercadoPagoToken() {
  return getSetting("mercadoPagoAccessToken");
}

export async function upsertMercadoPagoToken(token: string) {
  await upsertSetting("mercadoPagoAccessToken", token);
}
