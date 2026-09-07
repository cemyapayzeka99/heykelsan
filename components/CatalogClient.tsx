"use client";

import { useMemo, useState } from "react";
import { Search, X, PackageSearch } from "lucide-react";
import { type Product, categoryLabel } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

const TR_FOLD: Record<string, string> = {
  ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u",
  Ç: "c", Ğ: "g", İ: "i", Ö: "o", Ş: "s", Ü: "u",
};

function normalize(text: string): string {
  return text
    .split("")
    .map((ch) => TR_FOLD[ch] ?? ch)
    .join("")
    .toLowerCase();
}

interface CatalogClientProps {
  products: Product[];
  categories: string[];
  initialCategory: string | null;
}

export default function CatalogClient({
  products,
  categories,
  initialCategory,
}: CatalogClientProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(
    initialCategory && categories.includes(initialCategory)
      ? initialCategory
      : null
  );

  const filtered = useMemo(() => {
    const normalizedQuery = normalize(query.trim());
    return products.filter((p) => {
      const matchesCategory = activeCategory ? p.category === activeCategory : true;
      const matchesQuery = normalizedQuery
        ? normalize(p.title).includes(normalizedQuery) ||
          normalize(p.id).includes(normalizedQuery)
        : true;
      return matchesCategory && matchesQuery;
    });
  }, [products, activeCategory, query]);

  return (
    <div>
      <div className="flex flex-col gap-6">
        <div className="relative border border-white/15 bg-panel transition-colors focus-within:border-bronze">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-bone/40" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ESER ADI YA DA ÜRÜN KODUYLA ARA"
            className="w-full bg-transparent py-4 pl-12 pr-11 font-mono text-xs uppercase tracking-[0.1em] text-bone placeholder:text-bone/30 outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Aramayı temizle"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-bone/40 transition-colors hover:text-bone"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <div className="-mx-6 flex gap-px overflow-x-auto bg-white/10 px-6 sm:mx-0 sm:flex-wrap sm:px-0 sm:border sm:border-white/10">
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className={`shrink-0 border border-white/10 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors sm:border-0 ${
              activeCategory === null
                ? "bg-bronze text-obsidian"
                : "bg-panel text-bone/60 hover:bg-white/5 hover:text-bone"
            }`}
          >
            Tümü
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 border border-white/10 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors sm:border-0 ${
                activeCategory === cat
                  ? "bg-bronze text-obsidian"
                  : "bg-panel text-bone/60 hover:bg-white/5 hover:text-bone"
              }`}
            >
              {categoryLabel(cat)}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.15em] text-bone/40">
        {filtered.length} eser bulundu
      </p>

      {filtered.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-px border border-white/10 bg-white/10 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-16 flex flex-col items-center gap-3 border border-white/10 py-16 text-center">
          <PackageSearch className="h-10 w-10 text-bronze/60" strokeWidth={1} />
          <p className="text-bone/60">
            Aramanızla eşleşen bir eser bulamadık.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setActiveCategory(null);
            }}
            className="font-mono text-xs uppercase tracking-[0.15em] text-bronze hover:text-bronze-bright"
          >
            Filtreleri temizle
          </button>
        </div>
      )}
    </div>
  );
}
