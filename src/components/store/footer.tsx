import { siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-serif text-lg text-white mb-3">{siteConfig.name}</h3>
          <p className="text-sm text-stone-400 leading-relaxed">
            {siteConfig.description}
          </p>
        </div>
        <div>
          <h4 className="font-medium text-white mb-3">Atendimento</h4>
          <ul className="space-y-2 text-sm text-stone-400">
            <li>{siteConfig.phone}</li>
            <li>{siteConfig.email}</li>
            <li>Suporte via WhatsApp</li>
          </ul>
        </div>
        <div>
          <h4 className="font-medium text-white mb-3">Base do MVP</h4>
          <ul className="space-y-2 text-sm text-stone-400">
            <li>Catálogo com categorias e destaque</li>
            <li>Carrinho e checkout estruturados</li>
            <li>Painel administrativo preparado</li>
            <li>Pagamentos por Pix e cartão</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-stone-800 text-center text-xs text-stone-500 py-4">
        &copy; {new Date().getFullYear()} {siteConfig.name}. Todos os direitos reservados.
      </div>
    </footer>
  );
}
