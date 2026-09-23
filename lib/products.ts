export interface Product {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  dimensions: string;
  price: number | null;
  image_urls: string[];
  url?: string;
  updatedAt?: unknown;
}

/** A local static asset (public/images/...) or a Cloudinary-hosted upload. */
export function hasUsableImage(product: Product): boolean {
  const src = product.image_urls[0];
  if (!src) return false;
  return src.startsWith("/") || src.startsWith("https://res.cloudinary.com/");
}

export function getProductBySlug(
  products: Product[],
  slug: string
): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(
  products: Product[],
  category: string
): Product[] {
  return products.filter((p) => p.category === category);
}

/**
 * Curated, deterministic pick spread across categories (in the given order)
 * so the homepage doesn't just show the first N rows of a single category.
 */
export function getFeaturedProducts(
  products: Product[],
  categoryOrder: string[],
  count = 8
): Product[] {
  const withImages = products.filter(hasUsableImage);
  const byCategory = new Map<string, Product[]>();
  for (const p of withImages) {
    const list = byCategory.get(p.category) ?? [];
    list.push(p);
    byCategory.set(p.category, list);
  }

  const featured: Product[] = [];
  let round = 0;
  while (featured.length < count) {
    let addedThisRound = false;
    for (const category of categoryOrder) {
      const list = byCategory.get(category);
      if (list && list[round]) {
        featured.push(list[round]);
        addedThisRound = true;
        if (featured.length >= count) break;
      }
    }
    if (!addedThisRound) break;
    round += 1;
  }

  return featured.slice(0, count);
}

export const WHATSAPP_NUMBER = "905322810273";

export function whatsappOrderUrl(product: Product): string {
  const message = `Merhabalar, "${product.title}" ürünü hakkında bilgi almak / sipariş vermek istiyorum.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/** Simple ASCII slugifier for the admin panel's "new" forms. */
export function slugify(text: string): string {
  const trFold: Record<string, string> = {
    ç: "c", ğ: "g", ı: "i", ö: "o", ş: "s", ü: "u",
    Ç: "c", Ğ: "g", İ: "i", Ö: "o", Ş: "s", Ü: "u",
  };
  return text
    .split("")
    .map((ch) => trFold[ch] ?? ch)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
