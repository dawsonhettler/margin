import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MARGIN — Business Financial Intelligence",
  description: "Executive-grade financial intelligence, forecasting, and simulation.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body className="bg-black text-[#A0A0A0] antialiased selection:bg-white selection:text-black min-h-screen">
        {children}
      </body>
    </html>
  );
}
