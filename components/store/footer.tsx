import type { LandingLink } from "lib/landing-types";
import Link from "next/link";

const defaultFooterLinks: LandingLink[] = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/aprilcoffeecph",
    external: true,
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@palaceskateboards",
    external: true,
  },
  {
    label: "Apple Music",
    href: "https://apple.co/palace",
    external: true,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/channel/UCPlsOYZ8ZEam57EUCf3DKjg",
    external: true,
  },
  {
    label: "WeChat",
    href: "/wechat",
    external: false,
  },
  {
    label: "SMILEY",
    href: "https://www.findsmiley.dk/1347286",
    external: true,
  },
  {
    label: "CONTACT",
    href: "https://boring.palaceskateboards.com/",
    external: true,
  },
  {
    label: "Mailing List",
    href: "https://mailing-list.palaceskateboards.com",
    external: true,
  },

];

type FooterProps = {
  links?: LandingLink[];
};

export default function Footer({ links = defaultFooterLinks }: FooterProps) {
  const footerLinks = links;
  return (
    <footer
      aria-label="footer"
      className="mx-5 block max-h-44 justify-center pt-6 uppercase md:flex md:max-h-none md:pt-4"
    >
      <div className="w-full max-w-5xl pb-2 md:pb-8">
        <ul className="grid grid-cols-2 justify-center text-xs font-bold md:flex md:text-sm">
          {footerLinks.map((item, index) => (
            <li
              key={index}
              className="flex w-full justify-center p-0 pb-3 hover:underline md:w-auto md:px-3 md:pb-0"
            >
              <Link
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}

export function Footer2({ links = defaultFooterLinks }: FooterProps) {
  const footerLinks = links;

  return (
    <footer
      aria-label="footer"
      className="
        pt-72
        mt-18
        mx-5
        flex
        justify-center
        uppercase
        max-md:block
        max-md:max-h-44
        sm:pt-4
        sm:mt-7
      "
    >
      <div className="w-full max-w-5xl pb-8 max-md:block sm:pb-8">
        <ul
          className="
            flex
            justify-center
            text-sm
            font-bold
            max-md:grid
            max-md:grid-cols-2
            max-md:text-xs
          "
        >
          {footerLinks.map((item, index) => (
            <li
              key={index}
              className="
                flex
                justify-center
                px-3
                hover:underline
                max-md:w-full
                max-md:p-0
                max-md:pb-3
              "
            >
              <Link
                href={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
