import { requireUser } from "@/lib/access";
import Link from "next/link";

export default async function ContaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid md:grid-cols-4 gap-8">
        <aside className="space-y-1">
          <Link
            href="/conta"
            className="block px-4 py-2 rounded-lg text-sm text-stone-600 hover:bg-stone-100"
          >
            Perfil
          </Link>
          <Link
            href="/conta/enderecos"
            className="block px-4 py-2 rounded-lg text-sm text-stone-600 hover:bg-stone-100"
          >
            Endereços
          </Link>
          <Link
            href="/conta/pedidos"
            className="block px-4 py-2 rounded-lg text-sm text-stone-600 hover:bg-stone-100"
          >
            Pedidos
          </Link>
        </aside>
        <main className="md:col-span-3">{children}</main>
      </div>
    </div>
  );
}
