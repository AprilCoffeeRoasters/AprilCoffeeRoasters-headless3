import { getAdviceDetail } from "lib/get-advice-detail";
import { getLandingPageData } from "lib/get-landing-page";
import { notFound } from "next/navigation";
import { ArticleDetail } from "../../../../components/advice/article-detail";
import Footer from "../../../../components/store/footer";
import Header from "../../../../components/store/header";

export default async function AdviceArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [article, { headerLinks, footerLinks }] = await Promise.all([
    getAdviceDetail(slug),
    getLandingPageData(),
  ]);

  if (!article) {
    notFound();
  }

  return (
    <>
      <Header navItems={headerLinks} />
      <ArticleDetail article={article} />
      <Footer links={footerLinks} />
    </>
  );
}
