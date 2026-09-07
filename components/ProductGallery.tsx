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
      <div className="relative aspect-square overflow-hidden border border-white/10 bg-panel">
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
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-bronze">
            <Gem className="h-12 w-12" strokeWidth={1} />
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-bone/40">
              Görsel Hazırlanıyor
            </span>
          </div>
        )}
        <span className="absolute left-0 top-0 border-b border-r border-white/10 bg-obsidian/85 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-bronze backdrop-blur-sm">
          Plate {String(active + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
        </span>
      </div>

      {localOk && images.length > 1 ? (
        <div className="mt-3 flex gap-3">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActive(i)}
              className={`relative h-20 w-20 shrink-0 overflow-hidden border transition-colors ${
                active === i ? "border-bronze" : "border-white/10 hover:border-white/30"
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
