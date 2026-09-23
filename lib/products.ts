import productsData from "@/data/products.json";

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
}

// data/products.json is edited through the Decap CMS panel (public/admin),
// which requires file-collection JSON to be wrapped as { products: [...] }
// rather than a bare top-level array.
export const products = productsData.products as Product[];

export const CATEGORY_LABELS: Record<string, string> = {
  "heykeller": "Heykeller",
  "hayvan-heykelleri": "Hayvan Heykelleri",
  "sutunlar": "Sütunlar",
  "ataturk-heykelleri": "Atatürk Heykelleri",
  "rolyefler-ve-tugralar": "Rölyefler ve Tuğralar",
  "duvar-kaplama-plakalari": "Duvar Kaplama Plakaları",
  "saksilar": "Saksılar",
  "bahce-aksesuarlari": "Bahçe Aksesuarları",
  "osmanli-heykelleri-bustleri": "Osmanlı Heykelleri ve Büstleri",
};

// Primary taxonomy in the order the workshop presents it on the original site.
export const PRIMARY_CATEGORIES = [
  "heykeller",
  "hayvan-heykelleri",
  "sutunlar",
  "ataturk-heykelleri",
  "rolyefler-ve-tugralar",
  "duvar-kaplama-plakalari",
  "saksilar",
  "bahce-aksesuarlari",
];

export function categoryLabel(slug: string): string {
  return CATEGORY_LABELS[slug] ?? slug;
}

export function hasLocalImage(product: Product): boolean {
  return Boolean(product.image_urls[0]?.startsWith("/"));
}

export function getAllCategories(): string[] {
  const set = new Set(products.map((p) => p.category));
  return PRIMARY_CATEGORIES.filter((c) => set.has(c)).concat(
    [...set].filter((c) => !PRIMARY_CATEGORIES.includes(c))
  );
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((p) => p.category === category);
}

/**
 * Curated, deterministic pick spread across categories so the homepage
 * doesn't just show the first N rows of a single category.
 */
export function getFeaturedProducts(count = 8): Product[] {
  const withImages = products.filter(hasLocalImage);
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
    for (const category of PRIMARY_CATEGORIES) {
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
