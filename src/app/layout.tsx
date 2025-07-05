import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ErrorBoundary } from "react-error-boundary";
import { Header } from "@/components/layout/header";
import { CartProvider } from "@/features/cart/components/cart-context";
import { UserProvider } from "@/context/user-context";
import { getCart, getUser } from "@/lib/mock-api";
import { MainErrorFallback } from "@/components/error/main-error-fallback";
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
        <ErrorBoundary FallbackComponent={MainErrorFallback}>
          <UserProvider userPromise={userPromise}>
            <CartProvider cartPromise={cartPromise}>
              <Header />
              <main>{children}</main>
            </CartProvider>
          </UserProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
