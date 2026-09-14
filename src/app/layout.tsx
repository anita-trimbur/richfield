import type { Metadata } from "next";
import { DM_Mono, DM_Sans } from "next/font/google";

import { SiteHeader } from "@/components/site-header/SiteHeader";
import { site } from "@/content/site";

import "./globals.css";

// Self-hosted at build time; exposed as CSS variables consumed by the
// font-sans / font-mono tokens in globals.css.
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-dm-mono",
});

export const metadata: Metadata = {
  // Pages that set their own title render as "Title | anita trimbur".
  title: { default: site.name, template: `%s | ${site.name}` },
  description: `${site.name}, ${site.role}`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmMono.variable}`}>
      <body className="bg-surface text-base text-ink antialiased">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
