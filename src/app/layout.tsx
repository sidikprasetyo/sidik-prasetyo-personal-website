import type { Metadata } from "next";
import { Geist, Geist_Mono, Manrope, Montserrat_Alternates } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import ScrollToTop from "@/components/ScrollToTop";
import AOSProvider from "@/components/AOSProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
})

const montserratAlternates = Montserrat_Alternates({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-montserrat-alternates",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Personal Web Portfolio",
  description: "Personal Portfolio Sidik Prasetyo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${manrope.variable} ${montserratAlternates.variable} antialiased`}
      >
        <AOSProvider />
        {children}
        <Toaster richColors position="top-right" />
        <ScrollToTop />
      </body>
    </html>
  );
}
