import { notFound } from "next/navigation";
import Breadcrumbs from "@/shared/components/ui/breadcrumbs";
import PostHero from "@/shared/components/blocks/post-hero";
import { BreadcrumbLink } from "@/shared/types";
import PortableTextRenderer from "@/shared/components/portable-text-renderer";
import {
  fetchSanityPostBySlug,
  fetchSanityPostsStaticParams,
} from "@/shared/sanity/lib/fetch";
import { generatePageMetadata } from "@/shared/sanity/lib/metadata";
import BlogContactForm from "@/shared/components/blog/blog-contact-form";
import { urlFor } from "@/shared/sanity/lib/image";

export const revalidate = 300;

export async function generateStaticParams() {
  const posts = await fetchSanityPostsStaticParams();

  return posts.map((post) => ({
    slug: post.slug?.current,
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const post = await fetchSanityPostBySlug({ slug: params.slug });

  if (!post) {
    notFound();
  }

  return generatePageMetadata({ page: post, slug: `blog/${params.slug}` });
}

export default async function PostPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const post = await fetchSanityPostBySlug(params);

  if (!post) {
    notFound();
  }

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const articlePath = `/blog/${post.slug?.current}`;
  const canonicalOverride = (post as { canonicalUrl?: string }).canonicalUrl;
  const articleUrl =
    canonicalOverride || (baseUrl ? `${baseUrl}${articlePath}` : articlePath);
  const imageUrl = post.image ? urlFor(post.image).quality(85).url() : undefined;
  const publishedAt =
    (post as { publishedAt?: string }).publishedAt || post._createdAt;
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description:
      post.meta_description ||
      (post as { excerpt?: string }).excerpt ||
      undefined,
    image: imageUrl ? [imageUrl] : undefined,
    author: post.author?.name
      ? [{ "@type": "Person", name: post.author.name }]
      : undefined,
    datePublished: publishedAt || undefined,
    dateModified: post._updatedAt || undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl || "/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: baseUrl ? `${baseUrl}/blog` : "/blog",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: articleUrl,
      },
    ],
  };

  const links: BreadcrumbLink[] = post
    ? [
        {
          label: "Home",
          href: "/",
        },
        {
          label: "Blog",
          href: "/blog",
        },
        {
          label: post.title as string,
          href: "#",
        },
      ]
    : [];

  return (
    <section>
      <div className="container py-16 xl:py-20">
        <article className="max-w-3xl mx-auto">
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(breadcrumbJsonLd),
            }}
          />
          <Breadcrumbs links={links} />
          <PostHero {...post} />
          {post.body && <PortableTextRenderer value={post.body} />}
          <BlogContactForm image={post.image} />
        </article>
      </div>
    </section>
  );
}
