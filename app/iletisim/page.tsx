import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { CONTACT } from "@/lib/contact";

export const metadata: Metadata = {
  title: "İletişim",
  description:
    "Heykelsan heykel atölyesiyle iletişime geçin. Adres, telefon, WhatsApp ve çalışma saatleri — İstanbul Beyoğlu'ndaki atölyemizi ziyaret edin.",
  alternates: { canonical: "/iletisim" },
};

export default function IletisimPage() {
  const infoItems = [
    { icon: MapPin, label: "Adres", value: CONTACT.address },
    {
      icon: Phone,
      label: "Telefon",
      value: CONTACT.phonePrimary,
      href: `tel:${CONTACT.phonePrimaryHref}`,
    },
    {
      icon: Phone,
      label: "Telefon",
      value: CONTACT.phoneSecondary,
      href: `tel:${CONTACT.phoneSecondaryHref}`,
    },
    {
      icon: Mail,
      label: "E-posta",
      value: CONTACT.email,
      href: `mailto:${CONTACT.email}`,
    },
    {
      icon: Clock,
      label: "Çalışma Saatleri",
      value: `${CONTACT.hoursLabel} · ${CONTACT.hours}`,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <span className="text-xs font-semibold uppercase tracking-[0.25em] text-bronze-dark">
        İletişim
      </span>
      <h1 className="mt-2 font-display text-4xl text-ink sm:text-5xl">
        Bize Ulaşın
      </h1>
      <p className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-ink-soft">
        Sorularınız, özel sipariş talepleriniz veya proje teklifleriniz için
        bize aşağıdaki kanallardan ulaşabilirsiniz.
      </p>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {infoItems.map((item, i) => {
          const Icon = item.icon;
          const content = (
            <div className="flex items-start gap-4 rounded-2xl border border-line bg-white/40 p-5 transition-colors hover:border-bronze/50">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bronze/10 text-bronze-dark">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft/60">
                  {item.label}
                </p>
                <p className="mt-1 text-ink">{item.value}</p>
              </div>
            </div>
          );

          return item.href ? (
            <a key={item.label + i} href={item.href}>
              {content}
            </a>
          ) : (
            <div key={item.label + i}>{content}</div>
          );
        })}
      </div>

      <div className="mt-10 flex flex-col items-start gap-4 rounded-3xl bg-ink px-8 py-10 text-bone sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-2xl italic">
            En hızlı yanıt WhatsApp&apos;tan.
          </h2>
          <p className="mt-2 text-sm text-bone/60">
            Ürün adını yazın, ekibimiz size hemen dönüş yapsın.
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
