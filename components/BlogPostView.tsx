"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { ChevronRight, CalendarDays } from "lucide-react";
import { getPostBySlug, sortByDateDesc, formatTrDate } from "@/lib/blog";
import { useBlogPosts } from "@/lib/useBlogPosts";
import BlogPostCard from "@/components/BlogPostCard";

const SITE_URL = "https://heykelsan-80dc7.web.app";
const JSON_LD_SCRIPT_ID = "blogpost-jsonld";

function setMetaTag(attr: "name" | "property", key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

export default function BlogPostView() {
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug") ?? "";
  const { posts, loading } = useBlogPosts();
  const post = getPostBySlug(posts, slug);
  const others = sortByDateDesc(posts)
    .filter((p) => p.slug !== slug)
    .slice(0, 3);

  useEffect(() => {
    if (!post) return;

    const title = `${post.title} | Heykelsan`;
    const description = post.excerpt || post.content.slice(0, 160);
    const image = post.coverImage
      ? post.coverImage.startsWith("/")
        ? `${SITE_URL}${post.coverImage}`
        : post.coverImage
      : `${SITE_URL}/images/logo/heykelsan-wordmark-ink.png`;
    const pageUrl = `${SITE_URL}/blog/detay?slug=${post.slug}`;

    document.title = title;
    setMetaTag("name", "description", description);
    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:image", image);
    setMetaTag("property", "og:url", pageUrl);
    setMetaTag("property", "og:type", "article");
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", title);
    setMetaTag("name", "twitter:description", description);

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description,
      image,
      datePublished: post.publishedAt,
      author: { "@type": "Organization", name: "Heykelsan" },
      publisher: { "@type": "Organization", name: "Heykelsan" },
      mainEntityOfPage: pageUrl,
    };
    const breadcrumbJsonLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Anasayfa", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: pageUrl },
      ],
    };

    let script = document.getElementById(JSON_LD_SCRIPT_ID) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = JSON_LD_SCRIPT_ID;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify([jsonLd, breadcrumbJsonLd]);

    return () => {
      script?.remove();
    };
  }, [post]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center text-sm text-ink-soft/60">
        Yükleniyor...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20 text-center">
        <p className="text-ink-soft">Bu yazı bulunamadı.</p>
        <Link
          href="/blog"
          className="mt-4 inline-block text-sm font-semibold text-bronze-dark hover:text-bronze"
        >
          Tüm yazılara dön
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <nav className="mb-8 flex flex-wrap items-center gap-1.5 text-sm text-ink-soft/70">
        <Link href="/" className="transition-colors hover:text-bronze-dark">
          Anasayfa
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/blog" className="transition-colors hover:text-bronze-dark">
          Blog
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-ink">{post.title}</span>
      </nav>

      <span className="flex items-center gap-1.5 text-xs text-ink-soft/60">
        <CalendarDays className="h-3.5 w-3.5 text-bronze-dark" />
        {formatTrDate(post.publishedAt)}
      </span>
      <h1 className="mt-3 font-display text-3xl leading-tight text-ink sm:text-4xl">
        {post.title}
      </h1>

      {post.coverImage ? (
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-bone-dim">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            sizes="(min-width: 1024px) 768px, 100vw"
            className="object-cover"
            priority
          />
        </div>
      ) : null}

      <div className="mt-8 whitespace-pre-line text-balance leading-relaxed text-ink-soft">
        {post.content}
      </div>

      {others.length > 0 ? (
        <section className="mt-20 border-t border-line pt-12">
          <h2 className="font-display text-2xl text-ink">Diğer Yazılar</h2>
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {others.map((p) => (
              <BlogPostCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
