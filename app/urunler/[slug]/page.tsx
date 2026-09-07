import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Ruler, Tag } from "lucide-react";
import {
  products,
  getProductBySlug,
  getProductsByCategory,
  categoryLabel,
  refNumber,
} from "@/lib/products";
import ProductGallery from "@/components/ProductGallery";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProductCard from "@/components/ProductCard";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};

  return {
    title: `${product.title} | Heykelsan`,
    description:
      product.description ||
      `${product.title} - ${categoryLabel(product.category)} koleksiyonundan, Heykelsan atölyesi üretimi.`,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const related = getProductsByCategory(product.category)
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <nav className="mb-8 flex flex-wrap items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-bone/40">
        <Link href="/" className="transition-colors hover:text-bronze">
          Anasayfa
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/urunler" className="transition-colors hover:text-bronze">
          Ürünlerimiz
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link
          href={`/urunler?kategori=${product.category}`}
          className="transition-colors hover:text-bronze"
        >
          {categoryLabel(product.category)}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-bone/70">{product.title}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        <ProductGallery product={product} />

        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-bronze">
              {refNumber(product)}
            </span>
            <Link
              href={`/urunler?kategori=${product.category}`}
              className="inline-flex w-fit items-center gap-1.5 border border-white/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-bone/60 transition-colors hover:border-bronze/60 hover:text-bronze"
            >
              <Tag className="h-3 w-3" />
              {categoryLabel(product.category)}
            </Link>
          </div>

          <h1 className="mt-4 font-display text-3xl font-bold uppercase leading-tight tracking-[0.03em] text-bone sm:text-4xl">
            {product.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 border border-white/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-bone/50">
              Ürün Kodu: {product.id}
            </span>
            {product.dimensions ? (
              <span className="inline-flex items-center gap-1.5 border border-bronze/40 bg-bronze/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] text-bronze-bright">
                <Ruler className="h-3.5 w-3.5" />
                {product.dimensions}
              </span>
            ) : null}
          </div>

          {product.description ? (
            <p className="mt-6 max-w-xl whitespace-pre-line text-balance leading-relaxed text-bone/60">
              {product.description}
            </p>
          ) : (
            <p className="mt-6 max-w-xl leading-relaxed text-bone/40">
              Bu eser hakkında ölçü, malzeme ve renk seçenekleri için bizimle
              iletişime geçebilirsiniz.
            </p>
          )}

          <div className="mt-8 border border-white/10 bg-charcoal p-6">
            <p className="text-sm text-bone/50">
              Fiyat, teslimat süresi ve özel ölçü/renk seçenekleri için
              WhatsApp üzerinden bize ulaşın — ürün adını otomatik ilettik.
            </p>
            <div className="mt-4">
              <WhatsAppButton product={product} />
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 ? (
        <section className="mt-20 border-t border-white/10 pt-12">
          <span className="font-mono text-xs uppercase tracking-[0.25em] text-bronze">
            Aynı Koleksiyon
          </span>
          <h2 className="mt-3 font-display text-2xl font-bold uppercase tracking-[0.05em] text-bone">
            {categoryLabel(product.category)}
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-px border border-white/10 bg-white/10 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
