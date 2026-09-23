import type { Metadata } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CONTACT } from "@/lib/contact";
import "./globals.css";

const SITE_URL = "https://heykelsan-80dc7.web.app";

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: CONTACT.brand,
  description:
    "Heykel, bahçe dekorları, rölyef, Atatürk heykelleri, duvar kaplamaları, sütunlar ve saksılar üreten heykel atölyesi.",
  image: `${SITE_URL}/images/logo/heykelsan-wordmark-ink.png`,
  url: SITE_URL,
  telephone: CONTACT.phonePrimaryHref,
  email: CONTACT.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: CONTACT.address,
    addressLocality: "İstanbul",
    addressCountry: "TR",
  },
  openingHours: "Mo-Sa 09:00-18:00",
};

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT", "WONK"],
  style: ["normal", "italic"],
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Heykelsan | Heykel Atölyesi, Atatürk Büstü ve Bahçe Dekorları",
    template: "%s | Heykelsan",
  },
  description:
    "Heykel, bahçe dekorları, rölyef, Atatürk heykelleri, duvar kaplamaları, sütunlar ve saksılar. 15 yıllık tecrübeyle atölyemizde el işçiliği taş, bronz ve fiberglas eserler.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Heykelsan",
    title: "Heykelsan | Heykel Atölyesi, Atatürk Büstü ve Bahçe Dekorları",
    description:
      "Heykel, bahçe dekorları, rölyef, Atatürk heykelleri, duvar kaplamaları, sütunlar ve saksılar. El işçiliği taş, bronz ve fiberglas eserler.",
    images: [`${SITE_URL}/images/logo/heykelsan-wordmark-ink.png`],
  },
  twitter: {
    card: "summary_large_image",
    title: "Heykelsan | Heykel Atölyesi, Atatürk Büstü ve Bahçe Dekorları",
    description:
      "Heykel, bahçe dekorları, rölyef, Atatürk heykelleri, duvar kaplamaları, sütunlar ve saksılar.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${fraunces.variable} ${instrumentSans.variable} antialiased flex min-h-screen flex-col`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
