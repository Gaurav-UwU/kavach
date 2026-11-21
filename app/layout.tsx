import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kavach — WhatsApp Scam Checker for Family",
  description:
    "Forward a suspicious SMS, WhatsApp message or screenshot and get a calm, senior-friendly verdict in English, Hindi or Hinglish — with family alerts on WhatsApp.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="h-full font-sans">{children}</body>
    </html>
  );
}
