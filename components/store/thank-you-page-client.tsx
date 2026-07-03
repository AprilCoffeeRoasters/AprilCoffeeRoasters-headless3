"use client";

import CategoryNav from "components/store/category-nav";
import Footer from "components/store/collections/footer";
import Logo from "components/store/logo";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const REDIRECT_MS = 3000;

export default function ThankYouPageClient() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      router.replace("/");
    }, REDIRECT_MS);

    return () => window.clearTimeout(timeoutId);
  }, [router]);

  return (
    <>
      <Logo onMenuOpenChange={setMenuOpen} />

      <div className="mx-auto w-full max-w-352 min-h-0">
        <CategoryNav menuOpen={menuOpen} />

        <main
          role="main"
          id="mainContent"
          className="sm:mt-3 mt-5 min-h-0 w-9/12 max-md:float-none max-md:mt-0 max-md:w-full"
        >
          <div className="mx-auto mt-5 w-full max-w-150 px-2.5 py-16 text-center">
            <h1 className="text-sm font-bold uppercase">Thank you</h1>
            <p className="mt-4 text-sm uppercase">
              Your order has been placed successfully.
            </p>
            <p className="mt-2 text-sm text-gray-400">
              Returning to the homepage in a few seconds…
            </p>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}
