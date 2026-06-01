interface Props {
  eyebrow?: string;
  title: string;
  description?: string;
}

export function SectionHeading({ eyebrow, title, description }: Props) {
  return (
    <div className="text-center mb-12">
      {eyebrow && (
        <span className="text-sm font-medium text-amber-700 uppercase tracking-wider">
          {eyebrow}
        </span>
      )}
      <h2 className="font-serif text-3xl md:text-4xl text-stone-800 mt-2">{title}</h2>
      {description && (
        <p className="text-stone-500 mt-3 max-w-2xl mx-auto">{description}</p>
      )}
    </div>
  );
}
