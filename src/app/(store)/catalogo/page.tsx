import { ProductCard } from "@/components/store/product-card";
import { SectionHeading } from "@/components/store/section-heading";
import { getCatalogProducts, getCatalogCategories } from "@/lib/products";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ categoria?: string }>;
}

export default async function CatalogoPage({ searchParams }: Props) {
  const { categoria } = await searchParams;
  const [products, categories] = await Promise.all([
    getCatalogProducts(categoria),
    getCatalogCategories(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <SectionHeading title="Catálogo" description="Produtos artesanais preparados com ingredientes selecionados." />

      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href="/catalogo"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !categoria ? "bg-amber-700 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
        >
          Todos
        </Link>
        {categories.map((cat: any) => (
          <Link
            key={cat.id}
            href={`/catalogo?categoria=${cat.slug}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              categoria === cat.slug
                ? "bg-amber-700 text-white"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 text-stone-500">
          Nenhum produto encontrado nesta categoria.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              slug={product.slug}
              description={product.description}
              price={Number(product.price)}
              category={product.category}
              images={product.images}
            />
          ))}
        </div>
      )}
    </div>
  );
}
