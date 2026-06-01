import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export async function registerCustomer(data: { name: string; email: string; password: string; phone?: string }) {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new Error("Email já cadastrado");
  }

  const passwordHash = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      name: data.name,
      role: "CUSTOMER",
      customerProfile: {
        create: { phone: data.phone || null },
      },
    },
  });

  return user;
}
