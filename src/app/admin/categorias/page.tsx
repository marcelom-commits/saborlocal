import { requireAdmin } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { CategoriesAdmin } from "@/components/admin/categories-admin";

export const dynamic = "force-dynamic";

export default async function AdminCategoriasPage() {
  await requireAdmin();
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return <CategoriesAdmin categories={categories as any} />;
}
