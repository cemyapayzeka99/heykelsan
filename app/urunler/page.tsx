import type { Metadata } from "next";
import { Suspense } from "react";
import CatalogClient from "@/components/CatalogClient";

export const metadata: Metadata = {
  title: "Ürünlerimiz | Heykelsan",
  description:
    "Heykel, Atatürk büstü, sütun, rölyef, saksı ve bahçe aksesuarı koleksiyonumuzun tamamını inceleyin.",
};

export default function UrunlerPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <div className="mb-10 max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-bronze-dark">
          Katalog
        </span>
        <h1 className="mt-2 font-display text-4xl text-ink sm:text-5xl">
          Tüm Eserlerimiz
        </h1>
        <p className="mt-4 text-ink-soft">
          Koleksiyonumuzda arama yapın veya kategoriye göre filtreleyin.
        </p>
      </div>

      <Suspense fallback={<p className="text-sm text-ink-soft/60">Yükleniyor...</p>}>
        <CatalogClient />
      </Suspense>
    </div>
  );
}
