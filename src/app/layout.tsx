import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import AppLayout from "@/components/AppLayout";

export const metadata: Metadata = {
  title: "Shopno Buni - Exquisite Jewelry Collection",
  description: "Discover our unique collection of necklaces, rings, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <AppLayout>
              {children}
            </AppLayout>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
