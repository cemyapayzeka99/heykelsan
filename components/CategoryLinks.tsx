"use client";

import Link from "next/link";
import { useCategories } from "@/lib/categories";

export default function CategoryLinks() {
  const { categories } = useCategories();

  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {categories.map((cat) => (
        <Link
          key={cat.slug}
          href={`/urunler?kategori=${cat.slug}`}
          className="rounded-full border border-line bg-white/40 px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-bronze/60 hover:text-bronze-dark"
        >
          {cat.label}
        </Link>
      ))}
    </div>
  );
}
