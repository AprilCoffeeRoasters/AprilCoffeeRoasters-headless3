import { FaqAccordion } from "components/contact/faq-accordion";
import Footer from "components/store/layout/footer";
import Header from "components/store/layout/header";
import { getAllCoffeeInfoFarms } from "lib/cms/coffee-info";
import {
  coffeeInfoBrewingSection,
  coffeeInfoPageIntro,
} from "lib/coffee-info/content";
import type { FaqSection } from "lib/contact/faq-content";
import { getLandingPageData } from "lib/get-landing-page";
import Link from "next/link";
import { connection } from "next/server";

export const metadata = {
  title: "Coffee Info & Recipes",
  description:
    "Brewing guides, farm information, and recipes for April Coffee Roasters coffees.",
};

export default async function CoffeeInfRecipesPage() {
  await connection();

  const { headerLinks, footerLinks } = await getLandingPageData();

  let farms: Awaited<ReturnType<typeof getAllCoffeeInfoFarms>> = [];
  try {
    farms = await getAllCoffeeInfoFarms();
  } catch (error) {
    console.error("Failed to load coffee info farms:", error);
  }

  const brewingSections: FaqSection[] = [
    {
      title: coffeeInfoBrewingSection.title,
      description: coffeeInfoBrewingSection.description,
      items: coffeeInfoBrewingSection.items.map((item) => ({
        question: item.question,
        answer: item.answer,
      })),
    },
  ];

  return (
    <>
      <Header navItems={headerLinks} />

      <main
        role="main"
        id="mainContent"
        className="flex w-full min-w-0 flex-1 grow justify-center overflow-x-hidden"
      >
        <div className="mx-5 flex w-full min-w-0 max-w-3xl flex-col py-10 md:py-14">
          <header className="mb-10 text-center">
            <h1 className="type-h1 text-2xl uppercase md:text-3xl">
              Coffee Info
              <br />
              &amp; Recipes
            </h1>
            <p className="type-text mx-auto mt-5 max-w-xl text-[13px] leading-[18px]">
              {coffeeInfoPageIntro}
            </p>
          </header>

          <FaqAccordion sections={brewingSections} />

          <section id="farms" className="mt-12 scroll-mt-8" aria-label="Farms">
            {/* <h2 className="type-h2 mb-1 text-sm uppercase">Farm Name</h2>
            <p className="type-text mb-3 text-[13px] leading-[18px]">
            On this page you can find information and brewing guides to all coffees that we are currently working with and that are available on our shop, along with informations on the farm with are partnering with.
            We believe in diversifying the brewing approach to get the best out of each coffee.
            </p> */}

            {farms.length === 0 ? (
              <p className="type-text py-6 text-[13px] uppercase leading-[18px]">
                No data
              </p>
            ) : (
              <ul>
                {farms.map((farm) => (
                  <li key={farm.slug} className="border-b border-[#d7d7d7]">
                    <Link
                      href={`/coffee-inf-recipes/${farm.slug}`}
                      className="type-text flex w-full items-start gap-3 py-3.5 text-left text-[13px] uppercase leading-[18px] outline outline-[2pt] outline-transparent outline-offset-2 transition duration-150 ease-in-out hover:outline-hover-frame active:text-active"
                    >
                      <svg
                        aria-hidden
                        viewBox="0 0 320 512"
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 fill-current"
                      >
                        <path d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z" />
                      </svg>
                      <span>{farm.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </main>

      <Footer links={footerLinks} />
    </>
  );
}
