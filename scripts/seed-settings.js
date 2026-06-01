const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const settings = [
    { key: "pixKey", value: "61993762268" },
    { key: "pixKeyType", value: "telefone" },
    { key: "pixReceiver", value: "SaborLocal Plataforma" },
  ];
  for (const s of settings) {
    await prisma.storeSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s,
    });
  }
  console.log("Settings seeded successfully");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
