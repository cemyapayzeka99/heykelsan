import Image from "next/image";
import { Gem } from "lucide-react";
import { type Product, hasUsableImage } from "@/lib/products";

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
  if (!hasUsableImage(product)) {
    return (
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center gap-2 bg-bone-dim text-bronze-dark ${className}`}
      >
        <Gem className="h-8 w-8" strokeWidth={1.25} />
        <span className="text-center text-xs font-medium tracking-wide text-ink-soft/70">
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
