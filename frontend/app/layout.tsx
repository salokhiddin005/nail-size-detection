import "./globals.css";
import type { Metadata } from "next";
import AuthGate from "@/components/AuthGate";

export const metadata: Metadata = {
  title: "Nailytics",
  description: "AI nail size detection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthGate>{children}</AuthGate>
      </body>
    </html>
  );
}