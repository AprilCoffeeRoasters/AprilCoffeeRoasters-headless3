import type { AdviceArticleDetail } from "lib/advice/advice-article";
import Image from "next/image";

function articleImages(article: AdviceArticleDetail) {
  const heroUrl = article.image?.url;
  const gallery =
    article.galleryImages?.filter((img) => img.url !== heroUrl) ?? [];

  return [...(article.image ? [article.image] : []), ...gallery];
}

export function ArticleDetail({
  article,
}: {
  article: AdviceArticleDetail;
}) {
  const allImages = articleImages(article);
  const editorialImages = allImages.slice(0, 6);
  const productImages = allImages.slice(6);
  const sidebarText = article.info ?? article.excerpt;

  return (
    <main
      role="main"
      id="mainContent"
      className="flex flex-1 grow justify-center pt-0 sm:pt-12"
    >
      <div className="mx-5 flex w-full max-w-5xl">
        <div
          aria-label="advice-item-view"
          className="w-full pb-4 uppercase"
        >
          <div className="flex flex-row max-md:flex-col">
            <h1
              aria-label="advice-item-title"
              className="type-h1 w-3/4 py-2 text-[17.6px] sm:text-[18px] sm:leading-[26px] max-md:w-full"
            >
              {article.title}
            </h1>

            <div className="w-1/4 whitespace-pre text-sm max-md:w-auto max-md:text-xs md:w-auto">
              {sidebarText ? (
                <p aria-label="advice-item-description">{sidebarText}</p>
              ) : null}
            </div>
          </div>

          {article.youtubeVideoId ? (
            <div
              aria-label="youtube-video-player"
              className="relative mt-5 mx-2.5 h-0 pb-[56.25%]"
            >
              <iframe
                className="absolute left-0 top-0 h-full w-full"
                frameBorder="0"
                allowFullScreen
                title={article.title}
                src={`https://www.youtube.com/embed/${article.youtubeVideoId}?autoplay=0&rel=0&controls=0`}
              />
            </div>
          ) : null}

          {editorialImages.length ? (
            <div className="sm:mt-7.5 mt-2.5 grid grid-cols-3 gap-[20px] sm:px-2.5 px-0 max-md:grid-cols-1">
              {editorialImages.map((image, index) => (
                <div key={image.url || index}>
                  <Image
                    src={image.url}
                    alt={article.title}
                    width={800}
                    height={1000}
                    sizes="(max-width:768px) 100vw, 33vw"
                    className="block h-auto w-full"
                    priority={index < 3}
                  />
                </div>
              ))}
            </div>
          ) : null}

          {productImages.length ? (
            <div className="mt-14 grid grid-cols-3 gap-y-20 gap-x-10 px-8 max-md:grid-cols-2 max-md:gap-x-5 max-md:gap-y-10">
              {productImages.map((image, index) => (
                <div
                  key={image.url || index}
                  className="flex items-center justify-center"
                >
                  <Image
                    src={image.url}
                    alt={article.title}
                    width={420}
                    height={420}
                    sizes="(max-width:768px) 50vw, 33vw"
                    className="block h-auto w-full object-contain"
                  />
                </div>
              ))}
            </div>
          ) : null}

          {article.contentHtml ? (
            <div
              className="mt-10 normal-case"
              dangerouslySetInnerHTML={{ __html: article.contentHtml }}
            />
          ) : null}
        </div>
      </div>
    </main>
  );
}
