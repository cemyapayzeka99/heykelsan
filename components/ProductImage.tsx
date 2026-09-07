import Image from "next/image";
import { Gem } from "lucide-react";
import { type Product, hasLocalImage } from "@/lib/products";

interface ProductImageProps {
  product: Product;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

export default function ProductImage({
  product,
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw",
  priority = false,
  className = "",
}: ProductImageProps) {
  if (!hasLocalImage(product)) {
    return (
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center gap-2 border border-white/10 bg-panel text-bronze ${className}`}
      >
        <Gem className="h-8 w-8" strokeWidth={1} />
        <span className="text-center font-mono text-[10px] uppercase tracking-[0.2em] text-bone/40">
          Görsel Hazırlanıyor
        </span>
      </div>
    );
  }

  return (
    <Image
      src={product.image_urls[0]}
      alt={product.title}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover ${className}`}
    />
  );
}
