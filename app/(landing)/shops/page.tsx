// import Link from "next/link";
// import Footer from "../../../components/store/layout/footer";
// import Header from "../../../components/store/layout/header";
// const navItems = [
//   "SUMMER 2026 RANGE",
//   "SUMMER 2026 LOOKBOOK",
//   "SHOPS",
//   "WEB SHOP",
//   "ADVICE",
//   "MANOR PLACE",
// ];

// const shops = [
//   {
//     title: "London Shop",
//     image: "/images/london-1.avif",
//     link: "/shops/shop1",
//   },
//   {
//     title: "New York Shop",
//     image: "/images/new-york-1.avif",
//     link: "/shops/shop2",
//   },
//   {
//     title: "Tokyo Shop",
//     image: "/images/tokyo-1.avif",
//     link: "/shops/shop3",
//   },
//   {
//     title: "Los Angeles Shop",
//     image: "/images/los-angeles-10.avif",
//     link: "/shops/shop4",
//   },
//   {
//     title: "Apgujeong Shop",
//     image: "/images/apgujeong-2.avif",
//     link: "/shops/shop5",
//   },
//   {
//     title: "Hongdae Shop",
//     image: "/images/hongdae-4.avif",
//     link: "/shops/shop6",
//   },
//   {
//     title: "Osaka Shop",
//     image: "/images/osaka-6.avif",
//     link: "/shops/shop7",
//   },
//   {
//     title: "Fukuoka Shop",
//     image: "/images/fukuoka.avif",
//     link: "/shops/shop8",
//   },
//   {
//     title: "Manor Place Shop",
//     image: "/images/manorplace.avif",
//     link: "/shops/shop9",
//   },
//   {
//     title: "Hong Kong Shop",
//     image: "/images/hongkong.avif",
//     link: "/shops/shop10",
//   },
//   {
//     title: "DSM London Concession",
//     image: "/images/london.avif",
//     link: "/shops/shop11",
//   },
//   {
//     title: "DSM LA Concession",
//     image: "/images/dsmla.avif",
//     link: "/shops/shop12",
//   },
//   {
//     title: "DSM Ginza Concession",
//     image: "/images/dsmginza.avif",
//     link: "/shops/shop13",
//   },
// ];

// const footerLinks = [
//   "Instagram",
//   "TikTok",
//   "Apple Music",
//   "YouTube",
//   "WeChat",
//   "Weibo",
//   "Mailing List",
//   "Boring Stuff",
// ];

// export default function Page() {
//   return (
//     // <main className=" mt-0 pt-0 bg-white text-black">
//     <main className="flex flex-col bg-white text-black">
//       <Header />
//       {/* Shops Grid */}
//       <section className="mx-auto max-w-[1052px] px-6 pt-0 ">
//         {" "}
//         <div className="grid grid-cols-1 gap-x-4.5 gap-y-5 md:grid-cols-2">
//           {shops.map((shop) => (
//             <div key={shop.title} className="group">
//               <div className="overflow-hidden bg-[#e9e9e9]">
//                 <Link href={shop.link}>
//                   <img
//                     src={shop.image}
//                     alt={shop.title}
//                     className="h-[260px] w-full object-cover duration-75 ease-in hover:opacity-30 md:h-[320px]"
//                   />
//                 </Link>
//               </div>

//               <h2 className="mt-3 text-center text-[14px] font-black uppercase tracking-tight">
//                 {shop.title}
//               </h2>
//             </div>
//           ))}
//         </div>
//         <div className="-mt-10 pt-0">
//           <Footer />
//         </div>
//       </section>
//       {/* Footer */}
//     </main>
//   );
// }

import { getAllShops, isDatoCmsConfigured } from "lib/cms/datocms";
import { shopCoverSrc } from "lib/cms/shops";
import { getLandingPageData } from "lib/get-landing-page";
import Link from "next/link";
import Footer from "../../../components/store/layout/footer";
import Header from "../../../components/store/layout/header";

export default async function Page() {
  const { headerLinks, footerLinks } = await getLandingPageData();

  let emptyMessage: string | null = null;
  let records: Awaited<ReturnType<typeof getAllShops>> = [];

  if (!isDatoCmsConfigured()) {
    emptyMessage =
      "Shops are not configured. Add DATOCMS_API_TOKEN to your .env.local file.";
  } else {
    try {
      records = await getAllShops();
    } catch (error) {
      console.error("Failed to fetch shops from DatoCMS:", error);
      const detail =
        error instanceof Error ? error.message : "Unknown error";
      emptyMessage =
        process.env.NODE_ENV === "development"
          ? `Failed to load shops: ${detail}`
          : "Unable to load shops right now.";
    }
  }

  if (!emptyMessage && records.length === 0) {
    emptyMessage =
      "Currently no shop added. Publish at least one shop in DatoCMS.";
  }

  const shops = records.map((shop) => ({
    title: shop.title,
    image: shopCoverSrc(shop),
    link: `/shops/${shop.slug}`,
  }));
  return (
    <>
      <Header navItems={headerLinks} />
      <main
        role="main"
        id="mainContent"
        className="flex min-h-screen flex-col bg-white text-black"
      >
        <div className="flex flex-1 grow justify-center">
        <div className="mx-5 flex w-full max-w-5xl">
          <div
            className="flex w-full flex-wrap max-md:flex-col"
            aria-label="shops-view"
          >
            {emptyMessage ? (
              <p className="w-full py-16 text-center text-sm font-bold uppercase tracking-tight">
                {emptyMessage}
              </p>
            ) : null}
            {shops.map((shop) => (
              <Link
                key={shop.link}
                href={shop.link}
                aria-label={shop.title}
                className="mb-2.5 px-2.5 max-md:mb-5 w-1/2 max-md:w-full"
              >
                {/* <div
                  className="
                    relative
                    h-80
                    overflow-hidden
                    bg-[#e9e9e9]
                    duration-75
                    ease-in
                    hover:opacity-30
                    max-md:h-60
                  "
                >
                  <img
                    src={shop.image}
                    alt={shop.title}
                    className="object-cover "
                    // sizes="(max-width:768px) 100vw, 50vw"

                    // className="absolute inset-0 h-full w-full object-cover"
                  />
                </div> */}

                <div
                  className="
    relative
    h-80
    w-full
    overflow-hidden
    bg-[#e9e9e9]
    duration-75
    ease-in
    hover:opacity-30
    max-md:h-60
  "
                >
                  {shop.image ? (
                    <img
                      src={shop.image}
                      alt={shop.title}
                      className="
      absolute
      inset-0
      h-full
      w-full
      object-cover
      opacity-100
      transition-opacity
      duration-500
    "
                    />
                  ) : null}
                </div>

                {/* <div
                  className="
    relative
    h-80
    overflow-hidden
    bg-[#e9e9e9]
    duration-75
    ease-in
    hover:opacity-30
    max-md:h-60
  "
                >
                  <img
                    src={shop.image}
                    alt={shop.title}
                    className="
      absolute
      left-0
      top-0
      h-full
      w-full
      max-w-none
      max-h-none
      object-cover
      opacity-100
      transition-opacity
      duration-500
    "
                  />
                </div> */}

                <h2
                  className="
                    my-2.5
                    text-center
                    text-sm
                    font-bold
                    uppercase
                    tracking-tight
                  "
                >
                  {shop.title}
                </h2>
              </Link>
            ))}
          </div>
        </div>
        </div>

        <Footer links={footerLinks} />
      </main>
    </>
  );
}
