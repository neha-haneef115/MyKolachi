import type { Metadata } from "next";
import { Geist, Montserrat, Alumni_Sans_SC } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
});

const alumni = Alumni_Sans_SC({
  subsets: ["latin"],
  weight: "900",
  variable: "--font-alumni",
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "MyKolachi",
  description: "Explore the rich heritage of Karachi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      className={`${geistSans.variable}  ${alumni.variable} ${montserrat.variable}`}
    >
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}