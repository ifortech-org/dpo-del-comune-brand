import { urlFor } from "@/shared/sanity/lib/image";
import { PAGE_QUERYResult, POST_QUERYResult } from "@/sanity.types";
const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === "production";

export function generatePageMetadata({
  page,
  slug,
}: {
  page: PAGE_QUERYResult | POST_QUERYResult;
  slug: string;
}) {
  const pageData = page as Record<string, unknown> | null;
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const normalizedSlug = slug === "index" ? "" : slug.replace(/^\/+/, "");
  const canonicalPath = normalizedSlug ? `/${normalizedSlug}` : "/";
  const canonicalOverride =
    typeof pageData?.canonicalUrl === "string"
      ? pageData.canonicalUrl.trim()
      : "";
  const canonical =
    canonicalOverride ||
    (baseUrl ? `${baseUrl}${canonicalPath}` : canonicalPath);
  const title =
    page?.meta_title ||
    (typeof pageData?.title === "string" ? pageData.title : undefined) ||
    "DPO Del Comune";
  const description =
    page?.meta_description ||
    (typeof pageData?.excerpt === "string" ? pageData.excerpt : undefined) ||
    "DPO Del Comune";
  const isArticle = normalizedSlug.startsWith("blog/");

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: page?.ogImage
            ? urlFor(page?.ogImage).quality(100).url()
            : `${process.env.NEXT_PUBLIC_SITE_URL}/images/og-image.jpg`,
          width: page?.ogImage?.asset?.metadata?.dimensions?.width || 1200,
          height: page?.ogImage?.asset?.metadata?.dimensions?.height || 630,
        },
      ],
      locale: "en_US",
      type: isArticle ? "article" : "website",
    },
    robots: !isProduction
      ? "noindex, nofollow"
      : page?.noindex
        ? "noindex"
        : "index, follow",
    alternates: {
      canonical,
    },
  };
}
