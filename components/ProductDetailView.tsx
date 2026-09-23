"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronRight, Ruler, Tag, Hash } from "lucide-react";
import { getProductBySlug, getProductsByCategory, hasUsableImage } from "@/lib/products";
import { useProducts } from "@/lib/useProducts";
import { useCategories, categoryLabelFrom } from "@/lib/categories";
import ProductGallery from "@/components/ProductGallery";
import WhatsAppButton from "@/components/WhatsAppButton";
import ProductCard from "@/components/ProductCard";

const SITE_URL = "https://heykelsan-80dc7.web.app";
const JSON_LD_SCRIPT_ID = "product-jsonld";

function setMetaTag(attr: "name" | "property", key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

export default function ProductDetailView() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") ?? "";
  const { products, loading } = useProducts();
  const { categories } = useCategories();
  const product = getProductBySlug(products, slug);

  useEffect(() => {
    if (!product) return;

    const title = `${product.title} | Heykelsan`;
    const description =
      product.description?.trim() ||
      `${product.title} — ${categoryLabelFrom(categories, product.category)} kategorisinde el işçiliği Heykelsan eseri. Fiyat ve ölçü bilgisi için WhatsApp üzerinden ulaşın.`;
    const image = hasUsableImage(product)
      ? product.image_urls[0].startsWith("/")
        ? `${SITE_URL}${product.image_urls[0]}`
        : product.image_urls[0]
      : `${SITE_URL}/images/logo/heykelsan-wordmark-ink.png`;
    const pageUrl = `${SITE_URL}/urunler/detay?slug=${product.slug}`;

    document.title = title;
    setMetaTag("name", "description", description);
    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:image", image);
    setMetaTag("property", "og:url", pageUrl);
    setMetaTag("property", "og:type", "product");
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", title);
    setMetaTag("name", "twitter:description", description);

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.title,
      description,
      image,
      sku: product.id,
      category: categoryLabelFrom(categories, product.category),
      brand: { "@type": "Brand", name: "Heykelsan" },
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
        url: pageUrl,
        priceCurrency: "TRY",
        ...(product.price ? { price: product.price } : {}),
      },
    };
    const breadcrumbJsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Anasayfa", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Ürünlerimiz", item: `${SITE_URL}/urunler` },
        {
          "@type": "ListItem",
          position: 3,
          name: categoryLabelFrom(categories, product.category),
          item: `${SITE_URL}/urunler?kategori=${product.category}`,
        },
        { "@type": "ListItem", position: 4, name: product.title, item: pageUrl },
      ],
    };

    let script = document.getElementById(JSON_LD_SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = JSON_LD_SCRIPT_ID;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify([jsonLd, breadcrumbJsonLd]);

    return () => {
      script?.remove();
    };
  }, [product, categories]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-20 text-center text-sm text-ink-soft/60">
        Yükleniyor...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-20 text-center">
        <p className="text-ink-soft">Bu ürün bulunamadı.</p>
        <Link
          href="/urunler"
          className="mt-4 inline-block text-sm font-semibold text-bronze-dark hover:text-bronze"
        >
          Tüm ürünlere dön
        </Link>
      </div>
    );
  }

  const related = getProductsByCategory(products, product.category)
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
          {categoryLabelFrom(categories, product.category)}
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
            {categoryLabelFrom(categories, product.category)}
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
            {categoryLabelFrom(categories, product.category)} koleksiyonundan diğer eserler
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
