"use client";

import { useBlogPosts } from "@/lib/useBlogPosts";
import { sortByDateDesc } from "@/lib/blog";
import BlogPostCard from "@/components/BlogPostCard";

export default function BlogListClient() {
  const { posts, loading } = useBlogPosts();
  const sorted = sortByDateDesc(posts);

  if (loading) {
    return <p className="text-sm text-ink-soft/60">Yükleniyor...</p>;
  }

  if (sorted.length === 0) {
    return (
      <p className="text-sm text-ink-soft/60">
        Henüz yayınlanmış bir yazı yok.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {sorted.map((post) => (
        <BlogPostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
