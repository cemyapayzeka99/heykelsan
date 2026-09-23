import Link from "next/link";
import { ArrowRight, MessageCircle, Hammer, ShieldCheck, Clock3 } from "lucide-react";
import {
  getFeaturedProducts,
  PRIMARY_CATEGORIES,
  categoryLabel,
  getProductsByCategory,
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
      <section className="relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute -left-24 top-1/2 h-[36rem] w-[36rem] -translate-y-1/2 rounded-full bg-bronze/10 blur-3xl" />
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 sm:py-24 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-bronze/30 bg-bronze/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-bronze-dark">
              1996&apos;den beri · İstanbul
            </span>
            <h1 className="mt-6 text-balance font-display text-5xl italic leading-[1.05] text-ink sm:text-6xl">
              Taş, bronz ve fiberglasa
              <span className="block not-italic text-bronze-dark">
                can veren atölye.
              </span>
            </h1>
            <p className="mt-6 max-w-lg text-balance text-lg leading-relaxed text-ink-soft">
              Atatürk büstlerinden bahçe heykellerine, sütunlardan rölyeflere;
              her eser elimizde özenle şekilleniyor. Kurumlara, belediyelere
              ve özel bahçelere kalıcı sanat eserleri üretiyoruz.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/urunler"
                className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 text-sm font-semibold text-bone transition-colors hover:bg-bronze-dark"
              >
                Ürünleri Keşfet
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href={`https://wa.me/${CONTACT.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-line px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-whatsapp hover:text-whatsapp-dark"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={2.25} />
                Hemen Bilgi Al
              </a>
            </div>

            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-8">
              <div>
                <dt className="sr-only">Yıllık tecrübe</dt>
                <dd className="font-display text-3xl text-ink">15+</dd>
                <span className="text-xs uppercase tracking-wide text-ink-soft/70">
                  Yıllık Tecrübe
                </span>
              </div>
              <div>
                <dt className="sr-only">Ürün çeşidi</dt>
                <dd className="font-display text-3xl text-ink">190+</dd>
                <span className="text-xs uppercase tracking-wide text-ink-soft/70">
                  Eser Modeli
                </span>
              </div>
              <div>
                <dt className="sr-only">Kategori</dt>
                <dd className="font-display text-3xl text-ink">8</dd>
                <span className="text-xs uppercase tracking-wide text-ink-soft/70">
                  Koleksiyon
                </span>
              </div>
            </dl>
          </div>

          <div className="relative hidden h-[28rem] sm:block">
            {heroPieces[0] ? (
              <div className="absolute right-6 top-0 h-64 w-52 -rotate-3 overflow-hidden rounded-2xl border-4 border-bone shadow-2xl shadow-ink/20">
                <ProductImage product={heroPieces[0]} priority />
              </div>
            ) : null}
            {heroPieces[1] ? (
              <div className="absolute left-0 top-24 h-72 w-56 rotate-2 overflow-hidden rounded-2xl border-4 border-bone shadow-2xl shadow-ink/20">
                <ProductImage product={heroPieces[1]} priority />
              </div>
            ) : null}
            {heroPieces[2] ? (
              <div className="absolute bottom-0 right-16 h-56 w-44 rotate-6 overflow-hidden rounded-2xl border-4 border-bone shadow-2xl shadow-ink/20">
                <ProductImage product={heroPieces[2]} priority />
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b border-line bg-bone-dim/60">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-6 py-8 sm:grid-cols-3">
          <div className="flex items-center gap-3">
            <Hammer className="h-6 w-6 text-bronze-dark" strokeWidth={1.5} />
            <span className="text-sm text-ink-soft">
              El işçiliği taş, bronz ve fiberglas üretim
            </span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-bronze-dark" strokeWidth={1.5} />
            <span className="text-sm text-ink-soft">
              Kurumsal ve belediye projelerinde referans
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Clock3 className="h-6 w-6 text-bronze-dark" strokeWidth={1.5} />
            <span className="text-sm text-ink-soft">
              Talebe özel ölçü ve renkte üretim
            </span>
          </div>
        </div>
      </section>

      {/* Category grid */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-bronze-dark">
              Koleksiyonlar
            </span>
            <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
              Kategoriye göre keşfedin
            </h2>
          </div>
          <Link
            href="/urunler"
            className="hidden items-center gap-1.5 text-sm font-semibold text-bronze-dark transition-colors hover:text-bronze sm:flex"
          >
            Tüm ürünler <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {PRIMARY_CATEGORIES.map((cat) => {
            const Icon = categoryIcon(cat);
            const count = getProductsByCategory(cat).length;
            return (
              <Link
                key={cat}
                href={`/urunler?kategori=${cat}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-line bg-white/40 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-bronze/60 hover:shadow-lg hover:shadow-ink/5"
              >
                <Icon
                  className="h-8 w-8 text-bronze-dark transition-transform duration-300 group-hover:scale-110"
                  strokeWidth={1.5}
                />
                <div className="mt-8">
                  <h3 className="font-display text-lg leading-snug text-ink">
                    {categoryLabel(cat)}
                  </h3>
                  <span className="text-xs text-ink-soft/60">
                    {count} model
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured products */}
      <section className="border-t border-line bg-bone-dim/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-bronze-dark">
                Seçkimiz
              </span>
              <h2 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
                Öne çıkan eserler
              </h2>
            </div>
            <Link
              href="/urunler"
              className="hidden items-center gap-1.5 text-sm font-semibold text-bronze-dark transition-colors hover:text-bronze sm:flex"
            >
              Tüm ürünler <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>

          <div className="mt-10 flex justify-center sm:hidden">
            <Link
              href="/urunler"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-bronze-dark"
            >
              Tüm ürünler <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-ink px-8 py-12 text-bone sm:flex-row sm:items-center sm:px-14">
          <div>
            <h2 className="font-display text-3xl italic sm:text-4xl">
              Aklınızdaki esere birlikte şekil verelim.
            </h2>
            <p className="mt-3 max-w-md text-bone/60">
              Ölçü, malzeme ve renk seçiminde size özel teklif hazırlıyoruz.
            </p>
          </div>
          <a
            href={`https://wa.me/${CONTACT.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-whatsapp px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-whatsapp-dark"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={2.25} />
            WhatsApp&apos;tan Yaz
          </a>
        </div>
      </section>
    </div>
  );
}
