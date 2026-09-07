"use client";

import Link from "next/link";
import { useState } from "react";
import { Phone, MessageCircle, Menu, X } from "lucide-react";
import { CONTACT } from "@/lib/contact";

const NAV_LINKS = [
  { href: "/", label: "Anasayfa" },
  { href: "/urunler", label: "Katalog" },
  { href: "/hakkimizda", label: "Atölye" },
  { href: "/iletisim", label: "İletişim" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50">
      {/* Contact strip */}
      <div className="hidden border-b border-white/10 bg-obsidian text-bone/60 sm:block">
        <div className="mx-auto flex max-w-6xl items-center justify-end gap-6 px-6 py-2 font-mono text-[11px] uppercase tracking-[0.12em]">
          <a
            href={`tel:${CONTACT.phonePrimaryHref}`}
            className="flex items-center gap-1.5 transition-colors hover:text-bronze"
          >
            <Phone className="h-3 w-3" strokeWidth={2} />
            {CONTACT.phonePrimary}
          </a>
          <a
            href={`https://wa.me/${CONTACT.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 transition-colors hover:text-bronze"
          >
            <MessageCircle className="h-3 w-3" strokeWidth={2} />
            Danışmana Yaz
          </a>
          <span className="text-bone/30">
            {CONTACT.hoursLabel} · {CONTACT.hours}
          </span>
        </div>
      </div>

      {/* Main nav */}
      <div className="border-b border-white/10 bg-obsidian/95 backdrop-blur supports-[backdrop-filter]:bg-obsidian/85">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="group flex flex-col leading-none">
            <span className="font-display text-xl font-bold uppercase tracking-[0.2em] text-bone">
              Heykelsan
            </span>
            <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.3em] text-bronze">
              {CONTACT.tagline}
            </span>
          </Link>

          <nav className="hidden items-center gap-10 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-semibold uppercase tracking-[0.18em] text-bone/60 transition-colors hover:text-bronze"
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
              className="group flex items-center gap-2 border border-bronze/60 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-bone transition-colors hover:bg-bronze hover:text-obsidian"
            >
              <MessageCircle
                className="h-3.5 w-3.5 text-whatsapp transition-colors group-hover:text-obsidian"
                strokeWidth={2.25}
              />
              Danışmana Sor
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center border border-white/15 text-bone md:hidden"
            aria-label={open ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile panel */}
        {open && (
          <div className="border-t border-white/10 bg-obsidian px-6 py-4 md:hidden animate-rise">
            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2.5 text-sm font-semibold uppercase tracking-[0.15em] text-bone/70 transition-colors hover:bg-white/5 hover:text-bronze"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4">
              <a
                href={`tel:${CONTACT.phonePrimaryHref}`}
                className="flex items-center gap-2 font-mono text-sm text-bone/70"
              >
                <Phone className="h-4 w-4 text-bronze" strokeWidth={2} />
                {CONTACT.phonePrimary}
              </a>
              <a
                href={`https://wa.me/${CONTACT.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 flex items-center justify-center gap-2 border border-bronze/60 px-4 py-3 text-xs font-semibold uppercase tracking-[0.15em] text-bone transition-colors hover:bg-bronze hover:text-obsidian"
              >
                <MessageCircle className="h-4 w-4 text-whatsapp" strokeWidth={2.25} />
                Danışmana Yaz
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
