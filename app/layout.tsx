import { CartProvider } from "components/cart/cart-context";
// import { WelcomeToast } from "components/welcome-toast";
import { GeistSans } from "geist/font/sans";
import { getCart } from "lib/shopify";
import { baseUrl } from "lib/utils";
import { ReactNode } from "react";
import { Toaster } from "sonner";
import "./globals.css";

const { SITE_NAME } = process.env;

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`,
  },
  robots: {
    follow: true,
    index: true,
  },
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cart = getCart();

  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="bg-white text-black selection:bg-teal-300">
        <CartProvider cartPromise={cart}>
          {children}
          <Toaster closeButton />
          {/* <WelcomeToast /> */}
        </CartProvider>
      </body>
    </html>
  );
}
