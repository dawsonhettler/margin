import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MARGIN — Business Financial Intelligence",
  description: "Executive-grade financial intelligence, deterministic forecasting, and scenario simulations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-black text-[#A0A0A0] antialiased selection:bg-white selection:text-black min-h-screen">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
