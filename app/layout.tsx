import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartBadge } from "@/components/CartBadge";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "XYZ Restaurant | Premium Dining",
  description: "Experience the best culinary delights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-black text-white antialiased`}>
        {/* Simple Navbar */}
        <nav className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
          <div className="container mx-auto px-6 h-16 flex items-center justify-between">
            <div className="font-bold text-xl tracking-tight">XYZ Restaurant.</div>
            <div className="space-x-6 text-sm font-medium text-gray-300 flex items-center">
              <a href="/menu" className="hover:text-white transition">Menu</a>
              <a href="#" className="hover:text-white transition">Reservations</a>
              <CartBadge />
            </div>
          </div>
        </nav>
        
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
