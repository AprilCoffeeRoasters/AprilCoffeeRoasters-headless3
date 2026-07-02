import Footer from "components/store/footer";
import Header from "components/store/header";
import { TriFergSvg } from "components/store/tri-ferg-svg";
import { getLandingPageData } from "lib/get-landing-page";
import Link from "next/link";

export default async function PalaceLandingPage() {
  const { triFergNav, headerLinks, footerLinks } = await getLandingPageData();

  return (
    <>
      <Header navItems={headerLinks} landing />
      <main
        role="main"
        id="mainContent"
        className="flex flex-1 grow justify-center"
      >
        <div className="mx-5 flex w-full max-w-5xl">
          <div
            className="relative flex w-full flex-1 grow flex-col justify-center px-0 md:px-5"
            aria-label="index-view"
          >
            <nav className="flex flex-col items-center space-x-0 space-y-2 pt-0 font-bold uppercase justify-center md:flex-row md:space-x-10 md:space-y-0 md:pt-5">
              {triFergNav.map((item) => (
                <Link
                  key={item.ariaLabel}
                  href={item.href}
                  aria-label={item.ariaLabel}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className={`group relative block w-24 md:w-56 ${item.fillClass}`}
                >
                  <div
                    className="w-full transition-opacity duration-150 ease-in-out lg:group-hover:opacity-20"
                    aria-label="tri-ferg"
                  >
                    <TriFergSvg />
                  </div>
                  <h2 className="mt-2 text-center text-xs md:mt-0 md:text-md lg:absolute lg:inset-0 lg:flex lg:w-full lg:items-center lg:justify-center lg:text-xl lg:opacity-0 lg:transition-opacity lg:duration-150 lg:ease-in-out lg:group-hover:opacity-100">
                    {item.title}
                  </h2>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </main>
      <Footer links={footerLinks} />
    </>
  );
}