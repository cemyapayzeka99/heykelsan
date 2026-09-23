import Link from "next/link";
import { Ruler } from "lucide-react";
import { type Product, categoryLabel } from "@/lib/products";
import ProductImage from "@/components/ProductImage";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/urunler/detay?slug=${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white/40 transition-all duration-300 hover:-translate-y-1 hover:border-bronze/60 hover:shadow-lg hover:shadow-ink/5"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-bone-dim">
        <ProductImage
          product={product}
          className="transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-ink/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-bone backdrop-blur-sm">
          {categoryLabel(product.category)}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="font-display text-base leading-snug text-ink">
          {product.title}
        </h3>
        {product.dimensions ? (
          <span className="mt-auto flex items-center gap-1.5 pt-1 text-xs text-ink-soft/70">
            <Ruler className="h-3.5 w-3.5 text-bronze-dark" strokeWidth={2} />
            {product.dimensions}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
