import type { Metadata } from "next";
import { Suspense } from "react";
import ProductDetailView from "@/components/ProductDetailView";

export const metadata: Metadata = {
  title: "Ürün Detayı | Heykelsan",
  description: "Heykelsan atölyesi eserlerinin detayları.",
};

export default function UrunDetayPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-6xl px-6 py-20 text-center text-sm text-ink-soft/60">
          Yükleniyor...
        </div>
      }
    >
      <ProductDetailView />
    </Suspense>
  );
}
