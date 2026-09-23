"use client";

import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import { CONTACT } from "@/lib/contact";
import { useCategories } from "@/lib/categories";

export default function Footer() {
  const year = new Date().getFullYear();
  const { categories } = useCategories();

  return (
    <footer className="border-t border-line bg-ink text-bone">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image
            src="/images/logo/heykelsan-wordmark-bone.png"
            alt="Heykelsan"
            width={220}
            height={37}
            className="h-8 w-auto"
          />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-bone/60">
            15 yıllık tecrübeyle taş, bronz ve fiberglas eserler üreten heykel
            atölyesi. Sanat, ellerimizde yeniden şekilleniyor.
          </p>
          <a
            href={`https://wa.me/${CONTACT.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-whatsapp px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-whatsapp-dark"
          >
            <MessageCircle className="h-4 w-4" strokeWidth={2.25} />
            WhatsApp&apos;tan Yaz
          </a>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze-light">
            Kurumsal
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-bone/70">
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
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze-light">
            Ürün Kategorileri
          </h3>
          <ul className="mt-4 space-y-2.5 text-sm text-bone/70">
            {categories.slice(0, 6).map((cat) => (
              <li key={cat.slug}>
                <Link
                  href={`/urunler?kategori=${cat.slug}`}
                  className="transition-colors hover:text-bone"
                >
                  {cat.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-bronze-light">
            İletişim
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-bone/70">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-bronze-light" />
              <span>{CONTACT.address}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-bronze-light" />
              <a
                href={`tel:${CONTACT.phonePrimaryHref}`}
                className="transition-colors hover:text-bone"
              >
                {CONTACT.phonePrimary}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-bronze-light" />
              <a
                href={`tel:${CONTACT.phoneSecondaryHref}`}
                className="transition-colors hover:text-bone"
              >
                {CONTACT.phoneSecondary}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-bronze-light" />
              <a
                href={`mailto:${CONTACT.email}`}
                className="transition-colors hover:text-bone"
              >
                {CONTACT.email}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Clock className="h-4 w-4 shrink-0 text-bronze-light" />
              <span>
                {CONTACT.hoursLabel}, {CONTACT.hours}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-5 text-xs text-bone/40 sm:flex-row sm:items-center sm:justify-between">
          <span>© {year} Heykelsan Heykel Atölyesi. Tüm hakları saklıdır.</span>
          <span>
            Tasarım &amp; Geliştirme:{" "}
            <a
              href="https://bbwebajans.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-bronze-light/80 transition-colors hover:text-bronze-light"
            >
              BB Web Ajans
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
