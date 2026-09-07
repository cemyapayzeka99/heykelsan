import Link from "next/link";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { CONTACT } from "@/lib/contact";
import { PRIMARY_CATEGORIES, categoryLabel } from "@/lib/products";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-charcoal text-bone">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="font-display text-xl font-bold uppercase tracking-[0.2em] text-bone">
            Heykelsan
          </span>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-bone/50">
            15 yıllık tecrübeyle taş, bronz ve fiberglas eserler üreten heykel
            atölyesi. Sanat, ellerimizde yeniden şekilleniyor.
          </p>
          <a
            href={`https://wa.me/${CONTACT.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 border border-bronze/50 px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-bone transition-colors hover:bg-bronze hover:text-obsidian"
          >
            <MessageCircle className="h-4 w-4 text-whatsapp" strokeWidth={2.25} />
            Danışmana Yaz
          </a>
        </div>

        <div>
          <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-bronze">
            Kurumsal
          </h3>
          <ul className="mt-5 space-y-3 text-sm text-bone/60">
            <li>
              <Link href="/" className="transition-colors hover:text-bone">
                Anasayfa
              </Link>
            </li>
            <li>
              <Link
                href="/hakkimizda"
                className="transition-colors hover:text-bone"
              >
                Hakkımızda
              </Link>
            </li>
            <li>
              <Link
                href="/urunler"
                className="transition-colors hover:text-bone"
              >
                Ürünlerimiz
              </Link>
            </li>
            <li>
              <Link
                href="/iletisim"
                className="transition-colors hover:text-bone"
              >
                Bize Ulaşın
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-bronze">
            Ürün Kategorileri
          </h3>
          <ul className="mt-5 space-y-3 text-sm text-bone/60">
            {PRIMARY_CATEGORIES.slice(0, 6).map((cat) => (
              <li key={cat}>
                <Link
                  href={`/urunler?kategori=${cat}`}
                  className="transition-colors hover:text-bone"
                >
                  {categoryLabel(cat)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-bronze">
            İletişim
          </h3>
          <ul className="mt-5 space-y-3.5 text-sm text-bone/60">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-bronze" />
              <span>{CONTACT.address}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-bronze" />
              <a
                href={`tel:${CONTACT.phonePrimaryHref}`}
                className="transition-colors hover:text-bone"
              >
                {CONTACT.phonePrimary}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-bronze" />
              <a
                href={`tel:${CONTACT.phoneSecondaryHref}`}
                className="transition-colors hover:text-bone"
              >
                {CONTACT.phoneSecondary}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-bronze" />
              <a
                href={`mailto:${CONTACT.email}`}
                className="transition-colors hover:text-bone"
              >
                {CONTACT.email}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Clock className="h-4 w-4 shrink-0 text-bronze" />
              <span>
                {CONTACT.hoursLabel}, {CONTACT.hours}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-5 font-mono text-[11px] uppercase tracking-[0.08em] text-bone/35 sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} Heykelsan Heykel Atölyesi. Tüm hakları saklıdır.</span>
          <span>
            Tasarım &amp; Geliştirme:{" "}
            <a
              href="https://bbwebajans.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-bronze/70 transition-colors hover:text-bronze"
            >
              BB Web Ajans
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
