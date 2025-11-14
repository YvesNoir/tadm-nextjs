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
  title: "TuAsesorDeModa - Moda, Estilo y Tendencias",
  description: "Tu guía completa de moda, estilo y tendencias. Descubre las últimas novedades en moda masculina y femenina, belleza, calzado y mucho más.",
  keywords: "moda, estilo, tendencias, ropa, belleza, zapatos, perfumes",
  icons: {
    icon: '/images/favi-tadm.png',
    shortcut: '/images/favi-tadm.png',
    apple: '/images/favi-tadm.png',
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
