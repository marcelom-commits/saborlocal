import { requireUser } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "@/components/account/profile-form";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ContaPage() {
  const user = await requireUser();
  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      customerProfile: {
        include: { _count: { select: { addresses: true, orders: true } } },
      },
    },
  });

  const profile = fullUser?.customerProfile;
  const addrCount = profile?._count?.addresses ?? 0;
  const orderCount = profile?._count?.orders ?? 0;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-2xl text-stone-800 mb-4">Meu Perfil</h2>
        <ProfileForm
          name={fullUser?.name || ""}
          email={fullUser?.email || ""}
          phone={profile?.phone || null}
        />
      </div>
      <div className="flex gap-4">
        <Link href="/conta/enderecos" className="bg-white rounded-xl p-4 shadow-sm border border-stone-200 flex-1 hover:shadow-md transition-shadow">
          <p className="text-2xl font-bold text-amber-700">{addrCount}</p>
          <p className="text-sm text-stone-500">Endereços</p>
        </Link>
        <Link href="/conta/pedidos" className="bg-white rounded-xl p-4 shadow-sm border border-stone-200 flex-1 hover:shadow-md transition-shadow">
          <p className="text-2xl font-bold text-amber-700">{orderCount}</p>
          <p className="text-sm text-stone-500">Pedidos</p>
        </Link>
      </div>
    </div>
  );
}
