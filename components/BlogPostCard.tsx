"use client";

import Link from "next/link";
import Image from "next/image";
import { CalendarDays } from "lucide-react";
import { type BlogPost, formatTrDate } from "@/lib/blog";

export default function BlogPostCard({ post }: { post: BlogPost }) {
  return (
    <Link
      href={`/blog/detay?slug=${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-white/40 transition-all duration-300 hover:-translate-y-1 hover:border-bronze/60 hover:shadow-lg hover:shadow-ink/5"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-bone-dim">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <span className="flex items-center gap-1.5 text-xs text-ink-soft/60">
          <CalendarDays className="h-3.5 w-3.5 text-bronze-dark" />
          {formatTrDate(post.publishedAt)}
        </span>
        <h3 className="font-display text-lg leading-snug text-ink">
          {post.title}
        </h3>
        <p className="line-clamp-2 text-sm text-ink-soft/80">{post.excerpt}</p>
      </div>
    </Link>
  );
}
