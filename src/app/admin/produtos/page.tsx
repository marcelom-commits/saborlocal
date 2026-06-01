import { requireAdmin } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { ProductsAdmin } from "@/components/admin/products-admin";

export const dynamic = "force-dynamic";

export default async function AdminProdutosPage() {
  await requireAdmin();
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true, images: { take: 1 }, variants: true },
    }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return <ProductsAdmin products={products as any} categories={categories as any} />;
}
