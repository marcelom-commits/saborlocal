import { siteConfig } from "@/lib/site-config";

export function HighlightGrid() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {siteConfig.highlights.map((item, index) => (
        <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="font-serif text-lg text-stone-800 mb-2">{item.title}</h3>
          <p className="text-sm text-stone-500 leading-relaxed">{item.description}</p>
        </div>
      ))}
    </div>
  );
}
