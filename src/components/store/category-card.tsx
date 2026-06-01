import Link from "next/link";
import Image from "next/image";

interface Props {
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
}

export function CategoryCard({ name, slug, description, imageUrl }: Props) {
  return (
    <Link
      href={`/catalogo?categoria=${slug}`}
      className="group relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-all"
    >
      <div className="aspect-[4/3] relative">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-300">
            Sem imagem
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="font-serif text-lg text-white mb-1">{name}</h3>
        {description && (
          <p className="text-sm text-white/80">{description}</p>
        )}
      </div>
    </Link>
  );
}
