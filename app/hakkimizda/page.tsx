import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle, ArrowUpRight, Hammer, ShieldCheck, Palette } from "lucide-react";
import { CONTACT } from "@/lib/contact";
import { PRIMARY_CATEGORIES, categoryLabel, getProductsByCategory } from "@/lib/products";

export const metadata: Metadata = {
  title: "Hakkımızda | Heykelsan",
  description:
    "15 yıllık tecrübeyle taş, bronz ve fiberglas eserler üreten Heykelsan heykel atölyesi.",
};

export default function HakkimizdaPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <span className="font-mono text-xs uppercase tracking-[0.25em] text-bronze">
        Kurumsal
      </span>
      <h1 className="mt-3 font-display text-4xl font-bold uppercase tracking-[0.05em] text-bone sm:text-5xl">
        Hakkımızda
      </h1>
      <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-bone/60">
        Heykelsan, İstanbul Beyoğlu&apos;ndaki atölyesinde 15 yılı aşkın
        süredir taş, bronz ve fiberglas eserler üretiyor. Atatürk büstlerinden
        bahçe heykellerine, anıtsal sütunlardan duvar rölyeflerine kadar geniş
        bir yelpazede; kurumlara, belediyelere, eğitim kurumlarına ve özel
        bahçelere kalıcı sanat eserleri kazandırıyoruz.
      </p>

      <div className="mt-12 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-3">
        <div className="bg-panel p-6">
          <Hammer className="h-6 w-6 text-bronze" strokeWidth={1.25} />
          <h3 className="mt-4 font-display text-base font-semibold uppercase tracking-[0.05em] text-bone">
            El İşçiliği
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-bone/50">
            Her eser atölyemizde ustalarımızın elinden özenle şekillendirilir.
          </p>
        </div>
        <div className="bg-panel p-6">
          <Palette className="h-6 w-6 text-bronze" strokeWidth={1.25} />
          <h3 className="mt-4 font-display text-base font-semibold uppercase tracking-[0.05em] text-bone">
            Özel Üretim
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-bone/50">
            Talebe göre ölçü, malzeme ve renk seçenekleriyle üretim yapıyoruz.
          </p>
        </div>
        <div className="bg-panel p-6">
          <ShieldCheck className="h-6 w-6 text-bronze" strokeWidth={1.25} />
          <h3 className="mt-4 font-display text-base font-semibold uppercase tracking-[0.05em] text-bone">
            Kurumsal Güven
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-bone/50">
            Belediye, üniversite ve eğitim kurumu projelerinde referanslarımız
            mevcuttur.
          </p>
        </div>
      </div>

      <div className="mt-14 border-t border-white/10 pt-10">
        <h2 className="font-display text-xl font-bold uppercase tracking-[0.05em] text-bone">
          Koleksiyonlarımız
        </h2>
        <div className="mt-5 flex flex-wrap gap-px border border-white/10 bg-white/10">
          {PRIMARY_CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={`/urunler?kategori=${cat}`}
              className="border border-transparent bg-panel px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.1em] text-bone/60 transition-colors hover:border-bronze/60 hover:text-bronze"
            >
              {categoryLabel(cat)}{" "}
              <span className="text-bone/30">
                ({getProductsByCategory(cat).length})
              </span>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-14 flex flex-col items-start gap-6 border border-bronze/40 bg-charcoal px-8 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold uppercase tracking-[0.05em] text-bone">
            Projenizi Konuşalım
          </h2>
          <p className="mt-2 text-sm text-bone/50">{CONTACT.address}</p>
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
          <span className="text-sm font-semibold uppercase tracking-[0.15em] text-bone transition-colors group-hover:text-obsidian">
            Danışmana Yaz
          </span>
          <ArrowUpRight
            className="h-4 w-4 shrink-0 text-bronze transition-colors group-hover:text-obsidian"
            strokeWidth={2}
          />
        </a>
      </div>
    </div>
  );
}
