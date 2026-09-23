import type { Metadata } from "next";
import { Suspense } from "react";
import BlogPostView from "@/components/BlogPostView";

export const metadata: Metadata = {
  title: "Blog Yazısı",
  description: "Heykelsan atölyesi blog yazısı.",
};

export default function BlogDetayPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-6 py-20 text-center text-sm text-ink-soft/60">
          Yükleniyor...
        </div>
      }
    >
      <BlogPostView />
    </Suspense>
  );
}
