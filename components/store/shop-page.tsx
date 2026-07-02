import type { ShopGalleryImage } from "lib/cms/shops";
import Footer from "./footer";
import Header from "./header";
import ShopGalleryCarousel from "./shop-gallery-carousel";

interface ShopPageProps {
  name: string;
  images: ShopGalleryImage[];
  address: string[];
  phone?: string;
  timing?: string;
  miscInformationHtml?: string;
}

export default function ShopPage({
  name,
  images,
  address,
  phone,
  timing,
  miscInformationHtml,
}: ShopPageProps) {
  return (
    <main className="flex min-h-screen flex-col bg-white text-black">
      <Header />

      <div className="flex flex-1 grow justify-center">
        <div className="mx-5 flex w-full max-w-5xl">
          <div className="w-full font-bold uppercase" aria-label="shop-view">
            <div className="flex justify-between px-16 pb-6 max-md:px-0">
              <div className="text-[17.6px] md:text-[20px]">{name}</div>

              <div className="text-sm max-md:text-xs">
                <div>
                  {address.map((line, lineIndex) => (
                    <p key={lineIndex}>{line || <span>&nbsp;</span>}</p>
                  ))}
                </div>

                {phone ? <p>{phone}</p> : null}

                {timing ? <div>{timing}</div> : null}

                {miscInformationHtml ? (
                  <div
                
                    dangerouslySetInnerHTML={{ __html: miscInformationHtml }}
                  />
                ) : null}
              </div>
            </div>

            <ShopGalleryCarousel images={images} alt={name} />
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
