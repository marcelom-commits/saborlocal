"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/format";

interface CartItem {
  id: string;
  quantity: number;
  unitPrice: number;
  product: { id: string; name: string; images: { url: string }[] };
}

interface Address {
  id: string;
  recipientName: string;
  street: string;
  number: string;
  complement: string | null;
  district: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

interface Props {
  items: CartItem[];
  subtotal: number;
  addresses: Address[];
  userId?: string;
  customerProfileId?: string;
}

export function CheckoutFlow({ items, subtotal, addresses, userId, customerProfileId }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedAddressId, setSelectedAddressId] = useState(
    addresses.find((a) => a.isDefault)?.id || addresses[0]?.id || ""
  );
  const [shippingCost, setShippingCost] = useState(0);
  const [shippingRegion, setShippingRegion] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("pix");
  const [shippingToken, setShippingToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [addressForm, setAddressForm] = useState({
    recipientName: "", street: "", number: "", complement: "",
    district: "", city: "", state: "", zipCode: "",
  });

  const total = subtotal + shippingCost;

  async function handleShippingQuote() {
    const zip = addresses.find(a => a.id === selectedAddressId)?.zipCode || addressForm.zipCode;
    if (!zip) return;
    const res = await fetch("/api/shipping/quote", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ zipCode: zip }),
    });
    const data = await res.json();
    if (data.shippingCost !== undefined) {
      setShippingCost(data.shippingCost);
      setShippingRegion(data.region || "");
      setStep(3);
    }
  }

  async function handleValidateToken() {
    const res = await fetch("/api/shipping/validate-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: shippingToken }),
    });
    const data = await res.json();
    if (data.valid) {
      setShippingCost(Number(data.price));
      setStep(3);
    } else {
      setError("Token inválido");
    }
  }

  async function handlePlaceOrder() {
    setLoading(true);
    setError("");

    const address = addresses.find(a => a.id === selectedAddressId);
    const addressData: any = {};
    if (address) {
      addressData.recipientName = address.recipientName;
      addressData.street = address.street;
      addressData.number = address.number;
      addressData.complement = address.complement;
      addressData.district = address.district;
      addressData.city = address.city;
      addressData.state = address.state;
      addressData.zipCode = address.zipCode;
    }

    const res = await fetch("/api/checkout/place-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address: addressData,
        paymentMethod,
        shippingCost,
        subtotal,
        total,
        shippingToken: shippingToken || undefined,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      if (paymentMethod === "pix") {
        router.push(`/checkout/pendente?orderId=${data.orderId}`);
      } else {
        router.push(`/checkout/sucesso?orderId=${data.orderId}`);
      }
    } else {
      setError(data.error || "Erro ao processar pedido");
      setLoading(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        {step === 1 && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-serif text-lg text-stone-800 mb-4">Endereço de entrega</h3>
            {addresses.length > 0 ? (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <label key={addr.id} className={`block p-4 rounded-lg border cursor-pointer transition-colors ${selectedAddressId === addr.id ? "border-amber-700 bg-amber-50" : "border-stone-200 hover:border-stone-300"}`}>
                    <input type="radio" name="address" value={addr.id} checked={selectedAddressId === addr.id} onChange={(e) => setSelectedAddressId(e.target.value)} className="sr-only" />
                    <p className="font-medium text-stone-800">{addr.recipientName}</p>
                    <p className="text-sm text-stone-500">{addr.street}, {addr.number} - {addr.district}</p>
                    <p className="text-sm text-stone-500">{addr.city}/{addr.state}</p>
                  </label>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(addressForm).map(([key, val]) => (
                  <div key={key} className={key === "complement" ? "" : (key === "recipientName" || key === "street" ? "col-span-2" : "")}>
                    <label className="block text-xs font-medium text-stone-700 mb-1 capitalize">{key === "recipientName" ? "Nome do recebedor" : key}</label>
                    <input value={val} onChange={(e) => setAddressForm({ ...addressForm, [key]: e.target.value })} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setStep(2)} className="mt-4 bg-amber-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-amber-800">
              Continuar
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-serif text-lg text-stone-800 mb-4">Frete</h3>
            <div className="space-y-3">
              <button onClick={handleShippingQuote} className="w-full bg-amber-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-amber-800">
                Calcular frete por CEP
              </button>
              <div className="border-t border-stone-200 pt-3">
                <p className="text-xs text-stone-500 mb-2">Ou use um token de frete:</p>
                <div className="flex gap-2">
                  <input value={shippingToken} onChange={(e) => setShippingToken(e.target.value)} placeholder="Token" className="flex-1 border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                  <button onClick={handleValidateToken} className="bg-stone-800 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-stone-900">
                    Validar
                  </button>
                </div>
              </div>
            </div>
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </div>
        )}

        {step === 3 && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-serif text-lg text-stone-800 mb-4">Pagamento</h3>
            <div className="space-y-3">
              {[
                { value: "pix", label: "Pix", desc: "Pagamento instantâneo" },
                { value: "credit_card", label: "Cartão de crédito", desc: "Pagamento simulado" },
              ].map((opt) => (
                <label key={opt.value} className={`block p-4 rounded-lg border cursor-pointer transition-colors ${paymentMethod === opt.value ? "border-amber-700 bg-amber-50" : "border-stone-200 hover:border-stone-300"}`}>
                  <input type="radio" name="payment" value={opt.value} checked={paymentMethod === opt.value} onChange={(e) => setPaymentMethod(e.target.value)} className="sr-only" />
                  <p className="font-medium text-stone-800">{opt.label}</p>
                  <p className="text-sm text-stone-500">{opt.desc}</p>
                </label>
              ))}
            </div>
            <button onClick={() => setStep(4)} className="mt-4 bg-amber-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-amber-800">
              Revisar pedido
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="font-serif text-lg text-stone-800 mb-4">Revisão do pedido</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-stone-500">Pagamento:</span> {paymentMethod === "pix" ? "Pix" : "Cartão de crédito"}</p>
              <p><span className="text-stone-500">Frete:</span> {shippingRegion || "Definido"} - {formatPrice(shippingCost)}</p>
            </div>
            <button onClick={handlePlaceOrder} disabled={loading} className="mt-4 w-full bg-amber-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-800 disabled:opacity-50">
              {loading ? "Processando..." : `Confirmar pedido - ${formatPrice(total)}`}
            </button>
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm h-fit sticky top-24">
        <h3 className="font-serif text-lg text-stone-800 mb-4">Itens</h3>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-stone-600">{item.product.name} x{item.quantity}</span>
              <span className="font-medium">{formatPrice(Number(item.unitPrice) * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-stone-200 mt-4 pt-4 space-y-2 text-sm">
          <div className="flex justify-between text-stone-600">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-stone-600">
            <span>Frete</span>
            <span>{shippingCost > 0 ? formatPrice(shippingCost) : "A calcular"}</span>
          </div>
          <div className="flex justify-between font-bold text-stone-800 border-t border-stone-200 pt-2">
            <span>Total</span>
            <span>{shippingCost > 0 ? formatPrice(total) : formatPrice(subtotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
