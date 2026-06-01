import { prisma } from "./prisma";

export async function getCatalogProducts(categoryName?: string) {
  const where: any = { isActive: true };
  if (categoryName) {
    where.category = { name: categoryName };
  }
  return prisma.product.findMany({
    where,
    include: { category: true, images: { take: 1, orderBy: { sortOrder: "asc" } } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCatalogCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });
}
