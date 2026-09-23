export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  publishedAt: string;
  updatedAt?: unknown;
}

export function getPostBySlug(posts: BlogPost[], slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function sortByDateDesc(posts: BlogPost[]): BlogPost[] {
  return [...posts].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

/** publishedAt is stored as an ISO date string (YYYY-MM-DD) for reliable sorting. */
export function formatTrDate(isoDate: string): string {
  const d = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString("tr-TR", { day: "2-digit", month: "long", year: "numeric" });
}
