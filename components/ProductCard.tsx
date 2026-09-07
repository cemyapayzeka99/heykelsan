import Link from "next/link";
import { type Product, categoryLabel, refNumber } from "@/lib/products";
import ProductImage from "@/components/ProductImage";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/urunler/${product.slug}`}
      className="group flex flex-col border border-transparent bg-panel transition-colors duration-300 hover:border-bronze/70"
    >
      <div className="relative aspect-[4/5] overflow-hidden border-b border-white/10 bg-charcoal">
        <ProductImage
          product={product}
          className="opacity-90 grayscale-[15%] transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0"
        />
        <span className="absolute left-0 top-0 border-b border-r border-white/10 bg-obsidian/85 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-bronze backdrop-blur-sm">
          {refNumber(product)}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone/40">
          {categoryLabel(product.category)}
        </span>
        <h3 className="font-display text-sm font-semibold uppercase leading-snug tracking-[0.03em] text-bone">
          {product.title}
        </h3>
        {product.dimensions ? (
          <span className="mt-auto flex items-center gap-1.5 border-t border-white/10 pt-2 font-mono text-[10px] uppercase tracking-[0.1em] text-bone/50">
            {product.dimensions}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
