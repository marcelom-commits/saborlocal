import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-amber-50 via-white to-orange-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-sm font-medium text-amber-700 uppercase tracking-wider">
              Plataforma white-label
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-stone-800 mt-4 leading-tight">
              {siteConfig.hero.title}
            </h1>
            <p className="text-lg text-stone-600 mt-6 leading-relaxed max-w-lg">
              {siteConfig.hero.subtitle}
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link
                href="/#destaques"
                className="bg-amber-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-800 transition-colors"
              >
                Ver demonstração
              </Link>
              <Link
                href="/#funcionalidades"
                className="border border-stone-300 text-stone-700 px-6 py-3 rounded-lg font-medium hover:border-amber-700 hover:text-amber-700 transition-colors"
              >
                Funcionalidades
              </Link>
            </div>
            <div className="flex items-center gap-6 mt-8 text-sm text-stone-500">
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Pix e cartão
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Entrega por CEP
              </span>
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Admin operacional
              </span>
            </div>
          </div>
          <div className="hidden md:flex items-center justify-center">
            <div className="relative w-full max-w-md">
              <div className="bg-white rounded-2xl shadow-xl p-8 border border-stone-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-lg">🍽️</div>
                  <div>
                    <div className="font-serif font-bold text-stone-800">{siteConfig.name}</div>
                    <div className="text-xs text-stone-500">{siteConfig.tagline}</div>
                  </div>
                </div>
                <div className="space-y-3">
                  {["Catálogo com fotos e categorias", "Carrinho e checkout completo", "Painel administrativo", "Pagamentos Pix e cartão", "Gestão de pedidos e clientes"].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-stone-600">
                      <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-xs text-amber-700 font-bold">✓</div>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-amber-200/50 rounded-full blur-xl" />
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-orange-200/30 rounded-full blur-xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
