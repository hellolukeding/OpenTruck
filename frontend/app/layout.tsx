import type { Metadata } from "next";
import { JetBrains_Mono, Manrope, Noto_Sans_SC } from "next/font/google";
import "./globals.css";

const fontSansEn = Manrope({
  subsets: ["latin"],
  variable: "--font-sans-en",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const fontSansZh = Noto_Sans_SC({
  subsets: ["latin"],
  variable: "--font-sans-zh",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "OpenTruck — Decentralized API Protocol",
  description:
    "A high-performance conduit for intelligence distribution. Open source decentralized API transfer station.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('theme');
                  if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${fontSansEn.variable} ${fontSansZh.variable} ${fontMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
