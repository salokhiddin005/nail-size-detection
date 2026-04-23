import "./globals.css";
import type { Metadata } from "next";
import AuthGate from "@/components/AuthGate";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";

const siteUrl = "https://nail-size-detection-y5ms.vercel.app";
const siteTitle = "Nailytics — AI nail size detection";
const siteDescription =
  "Upload a photo and get precise nail measurements in seconds. AI-powered nail size detection for salons, artists, and customers.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s · Nailytics",
  },
  description: siteDescription,
  applicationName: "Nailytics",
  keywords: [
    "nail size detection",
    "AI nail measurement",
    "nail length",
    "nail shape",
    "manicure tools",
    "nail salon app",
  ],
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Nailytics",
    title: siteTitle,
    description: siteDescription,
    images: [
      {
        url: "/bg.jpg",
        width: 1200,
        height: 630,
        alt: "Nailytics — AI nail size detection",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: ["/bg.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-15"
            style={{ backgroundImage: 'url("/bg.jpg")' }}
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        <AuthGate>
          <Navbar />
          <div className="relative z-10">{children}</div>
          <Footer />
        </AuthGate>
        <Analytics />
      </body>
    </html>
  );
}