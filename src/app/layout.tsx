import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'TikFlow - Achetez vos TikTok Coins',
  description: 'Recharge sécurisée en Afrique',
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
          <Toaster position="top-right" richColors theme="dark" />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
