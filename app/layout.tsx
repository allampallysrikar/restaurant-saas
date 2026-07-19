import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "The Golden Fork | Award-Winning Fine Dining",
  description: "Experience award-winning fine dining at The Golden Fork. Exquisite cuisine, premium wines, and unforgettable ambiance. Book your table today.",
  keywords: ["fine dining", "restaurant", "luxury dining", "award winning restaurant"],
  openGraph: {
    title: "The Golden Fork | Award-Winning Fine Dining",
    description: "Experience award-winning fine dining at The Golden Fork.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} ${inter.className} min-h-screen bg-[#0A0A0A] text-[#F5F0E8] antialiased`}>
        <Navbar />
        <main className="pt-20">
          {children}
        </main>
      </body>
    </html>
  );
}
