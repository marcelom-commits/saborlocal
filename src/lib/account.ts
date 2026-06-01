import { prisma } from "./prisma";

export async function getCustomerAccountData(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      customerProfile: {
        include: {
          addresses: { orderBy: { createdAt: "desc" } },
          orders: { orderBy: { createdAt: "desc" }, include: { items: true, payment: true } },
        },
      },
    },
  });
}
