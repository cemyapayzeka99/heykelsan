import Link from "next/link";
import { ArrowRight, ArrowUpRight, MessageCircle, Hammer, ShieldCheck, Clock3 } from "lucide-react";
import {
  getFeaturedProducts,
  PRIMARY_CATEGORIES,
  categoryLabel,
  getProductsByCategory,
  refNumber,
} from "@/lib/products";
import { categoryIcon } from "@/lib/categoryIcons";
import { CONTACT } from "@/lib/contact";
import ProductCard from "@/components/ProductCard";
import ProductImage from "@/components/ProductImage";

export default function Home() {
  const featured = getFeaturedProducts(8);
  const heroPieces = featured.slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute -left-24 top-1/2 h-[36rem] w-[36rem] -translate-y-1/2 bg-bronze/10 blur-3xl" />
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 border border-bronze/40 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-bronze">
              1996&apos;den beri · İstanbul
            </span>
            <h1 className="mt-6 text-balance font-display text-4xl font-bold uppercase leading-[1.15] tracking-[0.03em] text-bone sm:text-5xl">
              Taş, bronz ve fiberglasa
              <span className="block text-bronze">can veren atölye.</span>
            </h1>
            <p className="mt-6 max-w-lg text-balance text-lg leading-relaxed text-bone/60">
              Atatürk büstlerinden bahçe heykellerine, sütunlardan rölyeflere;
              her eser elimizde özenle şekilleniyor. Kurumlara, belediyelere
              ve özel bahçelere kalıcı sanat eserleri üretiyoruz.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/urunler"
                className="group inline-flex items-center gap-2 border border-bone bg-bone px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-obsidian transition-colors hover:bg-bronze hover:border-bronze"
              >
                Katalogu İncele
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href={`https://wa.me/${CONTACT.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-white/20 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-bone transition-colors hover:border-whatsapp hover:text-whatsapp"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={2.25} />
                Hemen Bilgi Al
              </a>
            </div>

            <dl className="mt-12 grid max-w-md grid-cols-3 gap-px border border-white/10 bg-white/10">
              <div className="bg-obsidian px-4 py-5">
                <dt className="sr-only">Yıllık tecrübe</dt>
                <dd className="font-display text-3xl font-bold text-bone">15+</dd>
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-bone/40">
                  Yıllık Tecrübe
                </span>
              </div>
              <div className="bg-obsidian px-4 py-5">
                <dt className="sr-only">Ürün çeşidi</dt>
                <dd className="font-display text-3xl font-bold text-bone">190+</dd>
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-bone/40">
                  Eser Modeli
                </span>
              </div>
              <div className="bg-obsidian px-4 py-5">
                <dt className="sr-only">Kategori</dt>
                <dd className="font-display text-3xl font-bold text-bone">8</dd>
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-bone/40">
                  Koleksiyon
                </span>
              </div>
            </dl>
          </div>

          <div className="relative hidden h-[30rem] gap-px bg-white/10 sm:grid sm:grid-cols-2 sm:border sm:border-white/10">
            {heroPieces[0] ? (
              <div className="relative col-span-2 overflow-hidden bg-charcoal">
                <ProductImage product={heroPieces[0]} priority />
                <span className="absolute left-0 top-0 border-b border-r border-white/10 bg-obsidian/85 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-bronze backdrop-blur-sm">
                  Plate 01 — {refNumber(heroPieces[0])}
                </span>
              </div>
            ) : null}
            {heroPieces[1] ? (
              <div className="relative overflow-hidden bg-charcoal">
                <ProductImage product={heroPieces[1]} priority />
                <span className="absolute left-0 top-0 border-b border-r border-white/10 bg-obsidian/85 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-bronze backdrop-blur-sm">
                  Plate 02
                </span>
              </div>
            ) : null}
            {heroPieces[2] ? (
              <div className="relative overflow-hidden bg-charcoal">
                <ProductImage product={heroPieces[2]} priority />
                <span className="absolute left-0 top-0 border-b border-r border-white/10 bg-obsidian/85 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-bronze backdrop-blur-sm">
                  Plate 03
                </span>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-white/10 bg-charcoal">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-px bg-white/10 sm:grid-cols-3">
          <div className="flex items-center gap-3 bg-charcoal px-6 py-6">
            <Hammer className="h-5 w-5 shrink-0 text-bronze" strokeWidth={1.5} />
            <span className="text-sm text-bone/60">
              El işçiliği taş, bronz ve fiberglas üretim
            </span>
          </div>
          <div className="flex items-center gap-3 bg-charcoal px-6 py-6">
            <ShieldCheck className="h-5 w-5 shrink-0 text-bronze" strokeWidth={1.5} />
            <span className="text-sm text-bone/60">
              Kurumsal ve belediye projelerinde referans
            </span>
          </div>
          <div className="flex items-center gap-3 bg-charcoal px-6 py-6">
            <Clock3 className="h-5 w-5 shrink-0 text-bronze" strokeWidth={1.5} />
            <span className="text-sm text-bone/60">
              Talebe özel ölçü ve renkte üretim
            </span>
          </div>
        </div>
      </section>

      {/* Category grid */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.25em] text-bronze">
              Koleksiyonlar
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-[0.05em] text-bone sm:text-4xl">
              Kategoriye Göre Keşfedin
            </h2>
          </div>
          <Link
            href="/urunler"
            className="hidden items-center gap-1.5 font-mono text-xs uppercase tracking-[0.15em] text-bronze transition-colors hover:text-bronze-bright sm:flex"
          >
            Tüm Ürünler <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-px border border-white/10 bg-white/10 sm:grid-cols-3 lg:grid-cols-4">
          {PRIMARY_CATEGORIES.map((cat) => {
            const Icon = categoryIcon(cat);
            const count = getProductsByCategory(cat).length;
            return (
              <Link
                key={cat}
                href={`/urunler?kategori=${cat}`}
                className="group relative flex flex-col justify-between border border-transparent bg-panel p-5 transition-colors duration-300 hover:border-bronze/70"
              >
                <Icon
                  className="h-7 w-7 text-bronze transition-colors duration-300"
                  strokeWidth={1.25}
                />
                <div className="mt-8">
                  <h3 className="font-display text-base font-semibold uppercase tracking-[0.05em] text-bone">
                    {categoryLabel(cat)}
                  </h3>
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-bone/40">
                    {count} Model
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured products */}
      <section className="border-t border-white/10 bg-charcoal/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.25em] text-bronze">
                Seçkimiz
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold uppercase tracking-[0.05em] text-bone sm:text-4xl">
                Öne Çıkan Eserler
              </h2>
            </div>
            <Link
              href="/urunler"
              className="hidden items-center gap-1.5 font-mono text-xs uppercase tracking-[0.15em] text-bronze transition-colors hover:text-bronze-bright sm:flex"
            >
              Tüm Ürünler <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-px border border-white/10 bg-white/10 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>

          <div className="mt-10 flex justify-center sm:hidden">
            <Link
              href="/urunler"
              className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.15em] text-bronze"
            >
              Tüm Ürünler <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-col items-start justify-between gap-8 border border-bronze/40 bg-charcoal px-8 py-12 sm:flex-row sm:items-center sm:px-14">
          <div>
            <h2 className="font-display text-2xl font-bold uppercase tracking-[0.05em] text-bone sm:text-3xl">
              Aklınızdaki Esere Birlikte Şekil Verelim
            </h2>
            <p className="mt-3 max-w-md text-bone/50">
              Ölçü, malzeme ve renk seçiminde size özel teklif hazırlıyoruz.
            </p>
          </div>
          <a
            href={`https://wa.me/${CONTACT.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex shrink-0 items-center gap-3.5 border border-bronze bg-obsidian px-6 py-4 transition-colors duration-300 hover:bg-bronze"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-whatsapp/40 text-whatsapp transition-colors group-hover:border-obsidian/30 group-hover:text-obsidian">
              <MessageCircle className="h-4 w-4" strokeWidth={2.25} />
            </span>
            <span className="flex flex-col text-left">
              <span className="text-sm font-semibold uppercase tracking-[0.15em] text-bone transition-colors group-hover:text-obsidian">
                Danışmana Yaz
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-bone/40 transition-colors group-hover:text-obsidian/60">
                Kişiye Özel Danışmanlık
              </span>
            </span>
            <ArrowUpRight
              className="h-4 w-4 shrink-0 text-bronze transition-colors group-hover:text-obsidian"
              strokeWidth={2}
            />
          </a>
        </div>
      </section>
    </div>
  );
}
