const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.storeSetting.upsert({
    where: { key: "pixKey" },
    update: { value: "+5561993762268" },
    create: { key: "pixKey", value: "+5561993762268" },
  });
  console.log("PIX key updated");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
