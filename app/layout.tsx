import type { Metadata } from "next";
import { Geist, Inter_Tight, Montserrat } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  display: "swap",
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
      className={`${geistSans.variable}  ${montserrat.variable}`}
    >
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}