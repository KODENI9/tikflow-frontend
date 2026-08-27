import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { NotificationPrompt } from "@/components/pwa/NotificationPrompt";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

import { PWARegistrar } from "@/components/pwa/PWARegistrar";
import type { Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#0f172a",
};

export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: {
    default: 'TikFlow | Achetez vos Pièces TikTok en Afrique',
    template: '%s | TikFlow'
  },
  description: 'Rechargez vos TikTok Coins (Pièces TikTok) rapidement et en toute sécurité en Afrique (Flooz, TMoney, Wave, Mobile Money). Service 100% fiable et livraison rapide.',
  keywords: ['TikTok Coins', 'Pièces TikTok', 'Acheter TikTok Coins Afrique', 'Recharge TikTok', 'Mobile Money', 'Flooz', 'TMoney', 'TikFlow'],
  authors: [{ name: 'TikFlow' }],
  creator: 'TikFlow',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://tikflowaf.online',
    title: 'TikFlow | Achetez vos Pièces TikTok en Afrique',
    description: 'Rechargez vos TikTok Coins (Pièces TikTok) rapidement et en toute sécurité en Afrique avec Mobile Money.',
    siteName: 'TikFlow',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TikFlow | Achetez vos Pièces TikTok en Afrique',
    description: 'Rechargez vos TikTok Coins rapidement et en toute sécurité en Afrique.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TikFlow",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider dynamic>
      <html lang="fr" className="dark" suppressHydrationWarning>
        <body
          className={`${plusJakartaSans.variable} font-sans antialiased bg-background text-foreground`}
        >
          <PWARegistrar />
          <NotificationPrompt />
          <Toaster position="top-right" richColors theme="dark" />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
