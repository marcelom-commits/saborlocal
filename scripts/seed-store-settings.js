const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const envMappings = {
  NEXT_PUBLIC_PIX_KEY: "pixKey",
  NEXT_PUBLIC_WHATSAPP: "whatsappPhone",
};

async function main() {
  for (const [envVar, settingKey] of Object.entries(envMappings)) {
    const value = process.env[envVar];
    if (value) {
      await prisma.storeSetting.upsert({
        where: { key: settingKey },
        update: { value },
        create: { key: settingKey, value },
      });
    }
  }
  console.log("Store settings synced from env");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
