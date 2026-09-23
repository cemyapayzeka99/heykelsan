"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Phone, MessageCircle, Menu, X } from "lucide-react";
import { CONTACT } from "@/lib/contact";

const NAV_LINKS = [
  { href: "/", label: "Anasayfa" },
  { href: "/urunler", label: "Ürünlerimiz" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      {/* Contact strip */}
      <div className="hidden bg-ink text-bone/80 sm:block">
        <div className="mx-auto flex max-w-6xl items-center justify-end gap-6 px-6 py-1.5 text-xs tracking-wide">
          <a
            href={`tel:${CONTACT.phonePrimaryHref}`}
            className="flex items-center gap-1.5 transition-colors hover:text-bronze-light"
          >
            <Phone className="h-3 w-3" strokeWidth={2} />
            {CONTACT.phonePrimary}
          </a>
          <a
            href={`https://wa.me/${CONTACT.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 transition-colors hover:text-whatsapp"
          >
            <MessageCircle className="h-3 w-3" strokeWidth={2} />
            WhatsApp&apos;tan Yaz
          </a>
          <span className="text-bone/40">
            {CONTACT.hoursLabel} · {CONTACT.hours}
          </span>
        </div>
      </div>

      {/* Main nav */}
      <div className="border-b border-line bg-bone/95 backdrop-blur supports-[backdrop-filter]:bg-bone/85">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="group flex flex-col leading-none">
            <Image
              src="/images/logo/heykelsan-wordmark-ink.png"
              alt="Heykelsan"
              width={220}
              height={37}
              priority
              className="h-7 w-auto"
            />
            <span className="mt-1 text-[11px] uppercase tracking-[0.25em] text-bronze-dark">
              {CONTACT.tagline}
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium tracking-wide text-ink-soft transition-colors hover:text-bronze-dark"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <a
              href={`https://wa.me/${CONTACT.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-full bg-whatsapp px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-whatsapp/30 transition-colors hover:bg-whatsapp-dark"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={2.25} />
              Sipariş Ver
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink md:hidden"
            aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile panel */}
        {open && (
          <div className="border-t border-line bg-bone px-6 py-4 md:hidden animate-rise">
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-base font-medium text-ink-soft transition-colors hover:bg-bone-dim hover:text-bronze-dark"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 flex flex-col gap-2 border-t border-line pt-4">
              <a
                href={`tel:${CONTACT.phonePrimaryHref}`}
                className="flex items-center gap-2 text-sm text-ink-soft"
              >
                <Phone className="h-4 w-4 text-bronze-dark" strokeWidth={2} />
                {CONTACT.phonePrimary}
              </a>
              <a
                href={`https://wa.me/${CONTACT.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 flex items-center justify-center gap-2 rounded-full bg-whatsapp px-4 py-2.5 text-sm font-semibold text-white"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={2.25} />
                WhatsApp&apos;tan Sipariş Ver
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
