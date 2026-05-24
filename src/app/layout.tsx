import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { buildMetadata, musicGroupJsonLd } from "@/lib/seo";
import { getSiteSettings } from "@/lib/data/settings";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const dkLemonYellowSun = localFont({
  src: "./fonts/DK Lemon Yellow Sun.otf",
  variable: "--font-dk-lemon-yellow-sun",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({});
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();
  const jsonLd = musicGroupJsonLd(settings);

  return (
    <html
      lang="en"
      className={`${inter.variable} ${oswald.variable} ${dkLemonYellowSun.variable} h-full`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
