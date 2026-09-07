import type { Metadata } from "next";
import { products, getAllCategories } from "@/lib/products";
import CatalogClient from "@/components/CatalogClient";

export const metadata: Metadata = {
  title: "Ürünlerimiz | Heykelsan",
  description:
    "Heykel, Atatürk büstü, sütun, rölyef, saksı ve bahçe aksesuarı koleksiyonumuzun tamamını inceleyin.",
};

interface UrunlerPageProps {
  searchParams: Promise<{ kategori?: string }>;
}

export default async function UrunlerPage({ searchParams }: UrunlerPageProps) {
  const params = await searchParams;
  const categories = getAllCategories();

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <div className="mb-10 max-w-2xl">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-bronze">
          Katalog
        </span>
        <h1 className="mt-3 font-display text-4xl font-bold uppercase tracking-[0.08em] text-bone sm:text-5xl">
          Tüm Eserlerimiz
        </h1>
        <p className="mt-4 text-bone/60">
          {products.length} modelden oluşan koleksiyonumuzda arama yapın veya
          kategoriye göre filtreleyin.
        </p>
      </div>

      <CatalogClient
        products={products}
        categories={categories}
        initialCategory={params.kategori ?? null}
      />
    </div>
  );
}
