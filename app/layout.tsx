import type { Metadata } from "next";
import { Fraunces, Instrument_Sans, IBM_Plex_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["opsz", "SOFT", "WONK"],
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

const catalogMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-catalog-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Heykelsan | Heykel Atölyesi, Atatürk Büstü ve Bahçe Dekorları",
  description:
    "Heykel, bahçe dekorları, rölyef, Atatürk heykelleri, duvar kaplamaları, sütunlar ve saksılar. 15 yıllık tecrübeyle atölyemizde el işçiliği taş, bronz ve fiberglas eserler.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={`${fraunces.variable} ${instrumentSans.variable} ${catalogMono.variable} antialiased flex min-h-screen flex-col`}
      >
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
