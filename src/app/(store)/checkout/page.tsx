import { CheckoutFlow } from "@/components/checkout/checkout-flow";
import { SectionHeading } from "@/components/store/section-heading";
import { getOrCreateCart, getCartTotals } from "@/lib/cart";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const session = await auth();
  const cart = await getOrCreateCart(session?.user?.id);

  if (!cart || cart.items.length === 0) {
    redirect("/carrinho");
  }

  const { subtotal } = getCartTotals(cart.items);

  let addresses: any[] = [];
  let customerProfileId: string | undefined;

  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        customerProfile: {
          include: { addresses: { orderBy: { createdAt: "desc" } } },
        },
      },
    });
    addresses = user?.customerProfile?.addresses || [];
    customerProfileId = user?.customerProfile?.id;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <SectionHeading title="Checkout" />
      <CheckoutFlow
        items={cart.items as any}
        subtotal={subtotal}
        addresses={addresses}
        userId={session?.user?.id}
        customerProfileId={customerProfileId}
      />
    </div>
  );
}
