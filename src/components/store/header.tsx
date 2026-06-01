import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { HeaderUserMenu } from "./header-user-menu";
import { siteConfig } from "@/lib/site-config";

export async function Header() {
  const session = await auth();
  let cartCount = 0;

  if (session?.user?.id) {
    const cart = await prisma.cart.findFirst({
      where: { userId: session.user.id },
      include: { _count: { select: { items: true } } },
    });
    cartCount = cart?._count.items ?? 0;
  }

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">🍽️</span>
          <span className="font-serif text-xl font-bold text-stone-800">{siteConfig.name}</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-600">
          <Link href="/#categorias" className="hover:text-amber-700 transition-colors">Funcionalidades</Link>
          <Link href="/#destaques" className="hover:text-amber-700 transition-colors">Demonstração</Link>
          <Link href="/#como-funciona" className="hover:text-amber-700 transition-colors">Como funciona</Link>
          <Link href="/catalogo" className="hover:text-amber-700 transition-colors">Catálogo</Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/carrinho"
            className="relative p-2 text-stone-600 hover:text-amber-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
          <HeaderUserMenu />
        </div>
      </div>
    </header>
  );
}
