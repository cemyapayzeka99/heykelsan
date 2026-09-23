"use client";

import { useState } from "react";
import Image from "next/image";
import { Gem } from "lucide-react";
import { type Product, hasLocalImage } from "@/lib/products";

export default function ProductGallery({ product }: { product: Product }) {
  const images = product.image_urls;
  const [active, setActive] = useState(0);
  const localOk = hasLocalImage(product);

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-3xl border border-line bg-bone-dim">
        {localOk ? (
          <Image
            src={images[active]}
            alt={product.title}
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            priority
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-bronze-dark">
            <Gem className="h-12 w-12" strokeWidth={1.1} />
            <span className="text-sm font-medium tracking-wide text-ink-soft/70">
              Görsel Hazırlanıyor
            </span>
          </div>
        )}
      </div>

      {localOk && images.length > 1 ? (
        <div className="mt-4 flex gap-3">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${
                active === i ? "border-bronze-dark" : "border-line"
              }`}
              aria-label={`${product.title} görsel ${i + 1}`}
            >
              <Image src={src} alt="" fill sizes="80px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
