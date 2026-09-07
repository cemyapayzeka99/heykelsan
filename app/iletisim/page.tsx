import type { Metadata } from "next";
import { MapPin, Phone, Mail, Clock, MessageCircle, ArrowUpRight } from "lucide-react";
import { CONTACT } from "@/lib/contact";

export const metadata: Metadata = {
  title: "İletişim | Heykelsan",
  description: "Heykelsan atölyesiyle iletişime geçin.",
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
      <span className="font-mono text-xs uppercase tracking-[0.25em] text-bronze">
        İletişim
      </span>
      <h1 className="mt-3 font-display text-4xl font-bold uppercase tracking-[0.05em] text-bone sm:text-5xl">
        Bize Ulaşın
      </h1>
      <p className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-bone/60">
        Sorularınız, özel sipariş talepleriniz veya proje teklifleriniz için
        bize aşağıdaki kanallardan ulaşabilirsiniz.
      </p>

      <div className="mt-12 grid gap-px border border-white/10 bg-white/10 sm:grid-cols-2">
        {infoItems.map((item, i) => {
          const Icon = item.icon;
          const content = (
            <div className="flex items-start gap-4 bg-panel p-5 transition-colors hover:bg-white/5">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-bronze/40 text-bronze">
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </span>
              <div>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-bone/40">
                  {item.label}
                </p>
                <p className="mt-1 text-bone">{item.value}</p>
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

      <div className="mt-10 flex flex-col items-start gap-6 border border-bronze/40 bg-charcoal px-8 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold uppercase tracking-[0.05em] text-bone">
            En Hızlı Yanıt WhatsApp&apos;tan
          </h2>
          <p className="mt-2 text-sm text-bone/50">
            Ürün adını yazın, ekibimiz size hemen dönüş yapsın.
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
