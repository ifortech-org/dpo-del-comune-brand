import type { Metadata } from "next";
import CategoryFilter from "@/shared/components/category-filter";
import PostList from "@/shared/components/post-list";
import { fetchSanityPosts } from "@/shared/sanity/lib/fetch";
import { Category } from "@/shared/types";

export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const canonical = baseUrl ? `${baseUrl}/blog` : "/blog";
  const metadataBase = (() => {
    if (!baseUrl) return undefined;
    const normalizedBaseUrl = /^https?:\/\//i.test(baseUrl)
      ? baseUrl
      : `https://${baseUrl}`;

    try {
      return new URL(normalizedBaseUrl);
    } catch {
      return undefined;
    }
  })();

  return {
    metadataBase,
    title: "Blog",
    description: "Ultime notizie, approfondimenti e aggiornamenti.",
    alternates: {
      canonical,
    },
  };
}

export default async function BlogPage() {
  const posts = await fetchSanityPosts();
  const categories: Category[] = posts
    .flatMap((post) => post?.categories ?? [])
    .map((category) => ({
      title: category.title ?? "",
      slug:
        (category as { slug?: { current?: string } | null }).slug?.current ??
        "",
    }));

  return (
    <section>
      <div className="container py-16 xl:py-20">
        <div className="border-t border-b mb-4 py-2 flex justify-between items-center">
          <h1 className="font-semibold text-xl self-center">Ultime notizie</h1>
          <CategoryFilter categories={categories} />
        </div>
        <PostList posts={posts} />
      </div>
    </section>
  );
}
