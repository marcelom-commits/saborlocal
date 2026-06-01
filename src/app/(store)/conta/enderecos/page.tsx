import { requireUser } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { AddressesManager } from "@/components/account/addresses-manager";

export const dynamic = "force-dynamic";

export default async function EnderecosPage() {
  const user = await requireUser();
  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { customerProfile: { include: { addresses: true } } },
  });

  const addresses = fullUser?.customerProfile?.addresses || [];

  return (
    <div>
      <h2 className="font-serif text-2xl text-stone-800 mb-4">Meus Endereços</h2>
      <AddressesManager addresses={addresses as any} />
    </div>
  );
}
