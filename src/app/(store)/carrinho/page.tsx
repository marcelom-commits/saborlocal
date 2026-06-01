import { CartContent } from "@/components/store/cart-content";
import { SectionHeading } from "@/components/store/section-heading";
import { getOrCreateCart, getCartTotals } from "@/lib/cart";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function CarrinhoPage() {
  const session = await auth();
  const cart = await getOrCreateCart(session?.user?.id);
  const { subtotal } = getCartTotals(cart.items);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <SectionHeading title="Carrinho" />
      <CartContent items={cart.items as any} subtotal={subtotal} />
    </div>
  );
}
