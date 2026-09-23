import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Ruler, Tag, Hash } from "lucide-react";
import {
  products,
  getProductBySlug,
  getProductsByCategory,
  categoryLabel,
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
      <nav className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-ink-soft/70">
        <Link href="/" className="transition-colors hover:text-bronze-dark">
          Anasayfa
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link
          href="/urunler"
          className="transition-colors hover:text-bronze-dark"
        >
          Ürünlerimiz
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link
          href={`/urunler?kategori=${product.category}`}
          className="transition-colors hover:text-bronze-dark"
        >
          {categoryLabel(product.category)}
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-ink">{product.title}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        <ProductGallery product={product} />

        <div className="flex flex-col">
          <Link
            href={`/urunler?kategori=${product.category}`}
            className="inline-flex w-fit items-center gap-1.5 rounded-full bg-patina/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-patina-dark transition-colors hover:bg-patina/20"
          >
            <Tag className="h-3.5 w-3.5" />
            {categoryLabel(product.category)}
          </Link>

          <h1 className="mt-4 font-display text-3xl leading-tight text-ink sm:text-4xl">
            {product.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs font-medium text-ink-soft">
              <Hash className="h-3.5 w-3.5 text-bronze-dark" />
              {product.id}
            </span>
            {product.dimensions ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-bronze/30 bg-bronze/10 px-3 py-1.5 text-xs font-semibold text-bronze-dark">
                <Ruler className="h-3.5 w-3.5" />
                {product.dimensions}
              </span>
            ) : null}
          </div>

          {product.description ? (
            <p className="mt-6 max-w-xl whitespace-pre-line text-balance leading-relaxed text-ink-soft">
              {product.description}
            </p>
          ) : (
            <p className="mt-6 max-w-xl leading-relaxed text-ink-soft/60">
              Bu eser hakkında ölçü, malzeme ve renk seçenekleri için bizimle
              iletişime geçebilirsiniz.
            </p>
          )}

          <div className="mt-8 rounded-2xl border border-line bg-bone-dim/50 p-6">
            <p className="text-sm text-ink-soft">
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
        <section className="mt-20 border-t border-line pt-12">
          <h2 className="font-display text-2xl text-ink">
            {categoryLabel(product.category)} koleksiyonundan diğer eserler
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
