import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Header } from "@/components/layout/header";
import { CartProvider } from "@/components/cart/cart-context";
import { UserProvider } from "@/context/user-context";
import { getCart, getUser } from "@/lib/mock-api";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "Shopping cart",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cartPromise = getCart();
  const userPromise = getUser();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <UserProvider userPromise={userPromise}>
          <CartProvider cartPromise={cartPromise}>
            <Header />
            <main>{children}</main>
          </CartProvider>
        </UserProvider>
      </body>
    </html>
  );
}
