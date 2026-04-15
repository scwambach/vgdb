import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./ThemeProvider";

export const metadata: Metadata = {
  title: "RetroVault - Your Retro Gaming Collection",
  description: "Track and discover classic games from retro gaming consoles",
  openGraph: {
    title: "RetroVault - Your Retro Gaming Collection",
    description: "Track and discover classic games from retro gaming consoles",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    siteName: "RetroVault",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RetroVault - Your Retro Gaming Collection",
    description: "Track and discover classic games from retro gaming consoles",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
