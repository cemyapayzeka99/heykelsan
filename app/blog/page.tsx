import type { Metadata } from "next";
import BlogListClient from "@/components/BlogListClient";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Heykelsan atölyesinden haberler, tamamlanan projeler ve heykel/büst seçimi hakkında rehberler. Atatürk büstü, bahçe heykeli ve daha fazlası.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <div className="mb-10 max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-bronze-dark">
          Blog
        </span>
        <h1 className="mt-2 font-display text-4xl text-ink sm:text-5xl">
          Haberler ve Rehberler
        </h1>
        <p className="mt-4 text-ink-soft">
          Atölyemizden tamamlanan projeler, teslim haberleri ve heykel/büst
          seçimi hakkında bilmeniz gerekenler.
        </p>
      </div>

      <BlogListClient />
    </div>
  );
}
