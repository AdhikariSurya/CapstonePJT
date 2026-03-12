import type { Metadata, Viewport } from "next";
import { Header } from "@/components/Header";
import { LanguageProvider } from "@/components/LanguageProvider";
import { ProfileProvider } from "@/components/ProfileProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "ABCD AI - Teaching Assistant",
  description: "AI Teaching Assistant for Multigrade Classrooms",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-50">
        <LanguageProvider>
          <ProfileProvider>
            <main className="mx-auto max-w-md min-h-screen relative">
              <Header />
              {children}
            </main>
          </ProfileProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
