import { requireAdmin } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { CustomersAdmin } from "@/components/admin/customers-admin";

export const dynamic = "force-dynamic";

export default async function AdminClientesPage() {
  await requireAdmin();
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    include: {
      customerProfile: { include: { _count: { select: { orders: true } } } },
    },
  });

  return <CustomersAdmin customers={customers as any} />;
}
