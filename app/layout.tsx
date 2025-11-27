import type { Metadata } from "next";
import { Inter, Abril_Fatface } from "next/font/google";
import { Plus_Jakarta_Sans, Source_Sans_3 } from "next/font/google";
import "./globals.css";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });
const abrilFatface = Abril_Fatface({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-abril-fatface"
});
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans"
});
const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-source-sans-3"
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.tuasesordemoda.com'),
  title: {
    default: "TuAsesorDeModa - Moda, Estilo y Tendencias",
    template: "%s | TuAsesorDeModa"
  },
  description: "Tu guía completa de moda, estilo y tendencias. Descubre las últimas novedades en moda masculina y femenina, belleza, calzado y mucho más.",
  keywords: ["moda", "estilo", "tendencias", "ropa", "belleza", "zapatos", "perfumes", "outfits", "moda mujer", "moda hombre"],
  authors: [{ name: "TuAsesorDeModa" }],
  creator: "TuAsesorDeModa",
  publisher: "TuAsesorDeModa",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: '/images/favi-tadm.png',
    shortcut: '/images/favi-tadm.png',
    apple: '/images/favi-tadm.png',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://www.tuasesordemoda.com',
    title: 'TuAsesorDeModa - Moda, Estilo y Tendencias',
    description: 'Tu guía completa de moda, estilo y tendencias. Descubre las últimas novedades en moda masculina y femenina, belleza, calzado y mucho más.',
    siteName: 'TuAsesorDeModa',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TuAsesorDeModa - Tu guía de moda y estilo',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TuAsesorDeModa - Moda, Estilo y Tendencias',
    description: 'Tu guía completa de moda, estilo y tendencias.',
    creator: '@tuasesordemoda',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'add-your-google-verification-code-here',
    yandex: 'add-your-yandex-verification-code-here',
    yahoo: 'add-your-yahoo-verification-code-here',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} ${abrilFatface.variable} ${plusJakartaSans.variable} ${sourceSans3.variable} antialiased bg-white`}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
