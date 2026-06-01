import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function AdminPreview() {
  return (
    <div className="bg-gradient-to-br from-amber-700 to-amber-900 rounded-2xl p-8 md:p-12 text-white">
      <div className="max-w-3xl">
        <span className="text-sm font-medium text-amber-200 uppercase tracking-wider">
          backoffice pronto para operação
        </span>
        <h2 className="font-serif text-3xl md:text-4xl mt-3">
          {siteConfig.adminFeatures.title}
        </h2>
        <p className="text-amber-100 mt-4 leading-relaxed">
          {siteConfig.adminFeatures.description}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-2xl mb-2">📦</div>
            <h3 className="font-medium mb-1">Produtos</h3>
            <p className="text-sm text-amber-200">Cadastro, edição de preços, fotos e categorias.</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-2xl mb-2">📋</div>
            <h3 className="font-medium mb-1">Pedidos</h3>
            <p className="text-sm text-amber-200">Acompanhamento do fluxo, pagamento e entrega.</p>
          </div>
          <div className="bg-white/10 rounded-xl p-4">
            <div className="text-2xl mb-2">👥</div>
            <h3 className="font-medium mb-1">Clientes</h3>
            <p className="text-sm text-amber-200">Visualização de perfis, histórico e dados.</p>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/admin"
            className="bg-white text-amber-800 px-6 py-3 rounded-lg font-medium hover:bg-amber-50 transition-colors"
          >
            Acessar demonstração
          </Link>
        </div>
      </div>
    </div>
  );
}
