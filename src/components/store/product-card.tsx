import Image from "next/image";
import { formatPrice } from "@/lib/format";
import { AddToCartButton } from "./add-to-cart-button";

interface Props {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  category: { name: string };
  images: { url: string; alt: string | null }[];
}

export function ProductCard({ id, name, description, price, category, images }: Props) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col">
      <div className="aspect-square relative">
        {images[0] ? (
          <Image src={images[0].url} alt={images[0].alt || name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-300">
            Sem imagem
          </div>
        )}
        <span className="absolute top-3 left-3 bg-white/90 text-stone-700 text-xs font-medium px-2 py-1 rounded-full">
          {category.name}
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-serif text-lg text-stone-800 mb-1">{name}</h3>
        {description && (
          <p className="text-sm text-stone-500 mb-3 flex-1">{description}</p>
        )}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-lg font-bold text-amber-700">{formatPrice(price)}</span>
          <AddToCartButton productId={id} price={price} />
        </div>
      </div>
    </div>
  );
}
