import Link from "next/link";
import { Hero } from "@/components/store/hero";
import { CategoryCard } from "@/components/store/category-card";
import { ProductCard } from "@/components/store/product-card";
import { SectionHeading } from "@/components/store/section-heading";
import { HighlightGrid } from "@/components/store/highlight-grid";
import { AdminPreview } from "@/components/store/admin-preview";
import { formatPrice } from "@/lib/format";
import { getCatalogCategories, getCatalogProducts } from "@/lib/products";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [categories, featuredProducts, orderCount] = await Promise.all([
    getCatalogCategories(),
    getCatalogProducts(),
    prisma.order.count(),
  ]);

  return (
    <>
      <Hero />

      {/* Funcionalidades */}
      <section id="funcionalidades" className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <SectionHeading
          title="Tudo que você precisa para vender online"
          description="Catálogo, checkout, pagamentos e gestão em uma plataforma completa e white-label."
        />
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {[
            { icon: "🛍️", title: "Catálogo profissional", desc: "Produtos com fotos, categorias e busca para destacar seu cardápio." },
            { icon: "🛒", title: "Carrinho e checkout", desc: "Fluxo de compra completo com cálculo de frete por CEP." },
            { icon: "💳", title: "Pagamentos nacionais", desc: "Pix, cartão de crédito e boleto integrados." },
            { icon: "📊", title: "Painel administrativo", desc: "Gestão de produtos, pedidos, clientes e relatórios." },
          ].map((feat, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
              <div className="text-3xl mb-3">{feat.icon}</div>
              <h3 className="font-serif text-lg text-stone-800 mb-2">{feat.title}</h3>
              <p className="text-sm text-stone-500">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Demonstração - Catálogo */}
      <section id="destaques" className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeading
            eyebrow="Demonstração"
            title="Catálogo em ação"
            description="Veja como funciona a vitrine de produtos. Totalmente customizável para seu negócio."
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 4).map((product: any) => (
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
          <div className="text-center mt-8">
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-2 text-amber-700 font-medium hover:text-amber-800"
            >
              Ver catálogo completo
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section id="categorias" className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <SectionHeading
          title="Organização por categorias"
          description="Estrutura simples para destacar seus produtos com filtros e páginas por categoria."
        />
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((cat: any) => (
            <CategoryCard
              key={cat.id}
              name={cat.name}
              slug={cat.slug}
              description={cat.description}
              imageUrl={cat.imageUrl}
            />
          ))}
        </div>
      </section>

      {/* Como funciona */}
      <section id="como-funciona" className="bg-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <SectionHeading
            eyebrow="Para seu negócio"
            title="Como funciona"
            description="Em poucos passos você tem sua loja online funcionando."
          />
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: "1", title: "Configuramos", desc: "Personalizamos a plataforma com sua marca, produtos e categorias." },
              { step: "2", title: "Você gerencia", desc: "Painel admin simples para gerenciar pedidos e produtos." },
              { step: "3", title: "Clientes compram", desc: "Catálogo online, carrinho e checkout funcionando 24h." },
              { step: "4", title: "Você recebe", desc: "Pagamentos via Pix e cartão. Acompanhe tudo pelo painel." },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-serif text-lg text-stone-800 mb-2">{item.title}</h3>
                <p className="text-sm text-stone-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-amber-700">{orderCount}+</div>
            <div className="text-sm text-stone-500 mt-1">Pedidos processados</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-amber-700">{categories.length}</div>
            <div className="text-sm text-stone-500 mt-1">Categorias ativas</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-amber-700">{featuredProducts.length}</div>
            <div className="text-sm text-stone-500 mt-1">Produtos no catálogo</div>
          </div>
        </div>
      </section>

      {/* Admin Preview */}
      <section className="max-w-7xl mx-auto px-4 pb-16 md:pb-24">
        <AdminPreview />
      </section>
    </>
  );
}
