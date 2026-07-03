// const footerLinks = [
//   "INSTAGRAM",
//   "TIKTOK",
//   "APPLE MUSIC",
//   "YOUTUBE",
//   "WECHAT",
//   "WEIBO",
//   "MAILING LIST",
//   "BORING STUFF",
// ];

// export default function Footer() {
//   return (
//     // <footer className="pb-10 pt-6">
//     //   <div className="mx-auto max-w-[1200px] px-6">
//     //     <div className="grid grid-cols-2 gap-y-4 text-center md:flex md:flex-wrap md:justify-center md:gap-8">
//     //       {footerLinks.map((item) => (
//     //         <Link
//     //           key={item}
//     //           href="/"
//     //           className="text-[13px] font-black uppercase hover:underline"
//     //         >
//     //           {item}
//     //         </Link>
//     //       ))}
//     //     </div>
//     //   </div>
//     // </footer>
//     <footer className="w-full mt-0 px-6 pb-7 sm:mt-28 md:mt-20">
//       <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-center uppercase md:flex md:flex-wrap md:justify-center md:gap-x-5 md:gap-y-3">
//         {footerLinks.map((item, index) => (
//           <button
//             key={index}
//             className="
//           whitespace-nowrap
//           font-bold
//           text-[9px]
//           tracking-[-0.05em]
//           transition-opacity
//           duration-200
//           hover:opacity-50
//           sm:text-[10px]
//           md:text-[11.7px]
//           lg:text-[11.7px]
//         "
//           >
//             {item}
//           </button>
//         ))}
//       </div>
//     </footer>
//   );
// }

// components/store/footer.tsx

import Link from "next/link";
import type { LandingLink } from "lib/landing-types";

const defaultFooterLinks: LandingLink[] = [
  {
    label: "Instagram",
    href: "https://instagram.com/palaceskateboards",
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
    href: "https://www.youtube.com/channel/UCADVAEBl9ZZ9gFOwURmm2kA",
    external: true,
  },
  {
    label: "WeChat",
    href: "/wechat",
    external: false,
  },
  {
    label: "Weibo",
    href: "https://weibo.com/u/7322458413",
    external: true,
  },
  {
    label: "Mailing List",
    href: "https://mailing-list.palaceskateboards.com",
    external: true,
  },
  {
    label: "Boring Stuff",
    href: "https://boring.palaceskateboards.com/",
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
