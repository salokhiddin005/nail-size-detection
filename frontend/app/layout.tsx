import "./globals.css";
import type { Metadata } from "next";
import AuthGate from "@/components/AuthGate";
import Navbar from "@/components/Navbar";

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
        </AuthGate>
      </body>
    </html>
  );
}