"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X, PackageSearch } from "lucide-react";
import { categoryLabel, getAllCategories } from "@/lib/products";
import { useProducts } from "@/lib/useProducts";
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

export default function CatalogClient() {
  const { products, loading } = useProducts();
  const categories = useMemo(() => getAllCategories(products), [products]);

  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("kategori");

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(
    initialCategory
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
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-soft/50" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Eser adı ya da ürün koduyla ara..."
            className="w-full rounded-full border border-line bg-white/60 py-3.5 pl-12 pr-11 text-sm text-ink placeholder:text-ink-soft/50 outline-none transition-colors focus:border-bronze focus:bg-white"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Aramayı temizle"
              className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-soft/50 transition-colors hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>

        <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          <button
            type="button"
            onClick={() => setActiveCategory(null)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              activeCategory === null
                ? "border-ink bg-ink text-bone"
                : "border-line bg-white/40 text-ink-soft hover:border-bronze/50"
            }`}
          >
            Tümü
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "border-bronze-dark bg-bronze-dark text-bone"
                  : "border-line bg-white/40 text-ink-soft hover:border-bronze/50"
              }`}
            >
              {categoryLabel(cat)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-ink-soft/60">Yükleniyor...</p>
      ) : (
        <>
          <p className="mt-6 text-sm text-ink-soft/70">
            {filtered.length} eser bulundu
          </p>

          {filtered.length > 0 ? (
            <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {filtered.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
          ) : (
            <div className="mt-16 flex flex-col items-center gap-3 py-16 text-center">
              <PackageSearch className="h-10 w-10 text-bronze/60" strokeWidth={1.25} />
              <p className="text-ink-soft">
                Aramanızla eşleşen bir eser bulamadık.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setActiveCategory(null);
                }}
                className="text-sm font-semibold text-bronze-dark hover:text-bronze"
              >
                Filtreleri temizle
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
