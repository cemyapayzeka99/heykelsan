import type { Metadata } from "next";
import { MessageCircle, Hammer, ShieldCheck, Palette } from "lucide-react";
import { CONTACT } from "@/lib/contact";
import CategoryLinks from "@/components/CategoryLinks";

export const metadata: Metadata = {
  title: "Hakkımızda | Heykelsan",
  description:
    "15 yıllık tecrübeyle taş, bronz ve fiberglas eserler üreten Heykelsan heykel atölyesi.",
};

export default function HakkimizdaPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <span className="text-xs font-semibold uppercase tracking-[0.25em] text-bronze-dark">
        Kurumsal
      </span>
      <h1 className="mt-2 font-display text-4xl text-ink sm:text-5xl">
        Hakkımızda
      </h1>
      <p className="mt-6 max-w-2xl text-balance text-lg leading-relaxed text-ink-soft">
        Heykelsan, İstanbul Beyoğlu&apos;ndaki atölyesinde 15 yılı aşkın
        süredir taş, bronz ve fiberglas eserler üretiyor. Atatürk büstlerinden
        bahçe heykellerine, anıtsal sütunlardan duvar rölyeflerine kadar geniş
        bir yelpazede; kurumlara, belediyelere, eğitim kurumlarına ve özel
        bahçelere kalıcı sanat eserleri kazandırıyoruz.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-line bg-bone-dim/40 p-6">
          <Hammer className="h-7 w-7 text-bronze-dark" strokeWidth={1.5} />
          <h3 className="mt-4 font-display text-lg text-ink">El İşçiliği</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft/80">
            Her eser atölyemizde ustalarımızın elinden özenle şekillendirilir.
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-bone-dim/40 p-6">
          <Palette className="h-7 w-7 text-bronze-dark" strokeWidth={1.5} />
          <h3 className="mt-4 font-display text-lg text-ink">Özel Üretim</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft/80">
            Talebe göre ölçü, malzeme ve renk seçenekleriyle üretim yapıyoruz.
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-bone-dim/40 p-6">
          <ShieldCheck className="h-7 w-7 text-bronze-dark" strokeWidth={1.5} />
          <h3 className="mt-4 font-display text-lg text-ink">Kurumsal Güven</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft/80">
            Belediye, üniversite ve eğitim kurumu projelerinde referanslarımız
            mevcuttur.
          </p>
        </div>
      </div>

      <div className="mt-14 border-t border-line pt-10">
        <h2 className="font-display text-2xl text-ink">Koleksiyonlarımız</h2>
        <CategoryLinks />
      </div>

      <div className="mt-14 flex flex-col items-start gap-4 rounded-3xl bg-ink px-8 py-10 text-bone sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl italic">
            Projenizi konuşalım.
          </h2>
          <p className="mt-2 text-sm text-bone/60">
            {CONTACT.address}
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
    </div>
  );
}
