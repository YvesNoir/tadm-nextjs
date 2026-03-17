import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { inter, ebGaramond, sourceSans3 } from "./lib/fonts";

const gtmId = "GTM-TF78BK6";
const adsenseClient = "ca-pub-2816862233382229";

const verification = {
  ...((process.env.GOOGLE_SITE_VERIFICATION || 'dAsA-KKWhJ41MKQ8c3J6CU0zzqajQw9w-8E0q4d1GbA')
    ? { google: process.env.GOOGLE_SITE_VERIFICATION || 'dAsA-KKWhJ41MKQ8c3J6CU0zzqajQw9w-8E0q4d1GbA' }
    : {}),
  ...(process.env.YANDEX_VERIFICATION ? { yandex: process.env.YANDEX_VERIFICATION } : {}),
  ...(process.env.YAHOO_SITE_VERIFICATION ? { yahoo: process.env.YAHOO_SITE_VERIFICATION } : {}),
};

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
  verification,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`}
        </Script>
        <Script
          id="google-adsense"
          async
          strategy="afterInteractive"
          crossOrigin="anonymous"
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseClient}`}
        />
      </head>
      <body className={`${inter.className} ${inter.variable} ${ebGaramond.variable} ${sourceSans3.variable} antialiased bg-white`}>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
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
