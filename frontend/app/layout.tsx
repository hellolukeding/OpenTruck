import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OpenTruck Dispatch Ledger",
  description: "Operational dashboard for the OpenTruck AI gateway",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
