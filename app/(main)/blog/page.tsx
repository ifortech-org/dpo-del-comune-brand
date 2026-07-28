import type { Metadata } from "next";
import CategoryFilter from "@/shared/components/category-filter";
import PostList from "@/shared/components/post-list";
import {
  fetchSanityCategories,
  fetchSanityPostsPage,
} from "@/shared/sanity/lib/fetch";

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

export default async function BlogPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string | string[] }>;
}) {
  const resolvedSearchParams = await searchParams;
  const categoryParam = resolvedSearchParams?.category;
  const category =
    typeof categoryParam === "string"
      ? categoryParam
      : categoryParam?.[0] ?? "";

  const [categories, paginatedPosts] = await Promise.all([
    fetchSanityCategories(),
    fetchSanityPostsPage({ category }),
  ]);

  return (
    <section>
      <div className="container py-16 xl:py-20">
        <div className="border-t border-b mb-4 py-2 flex justify-between items-center">
          <h1 className="font-semibold text-xl self-center">Ultime notizie</h1>
          <CategoryFilter categories={categories} />
        </div>
        <PostList
          initialPosts={paginatedPosts.items}
          initialTotal={paginatedPosts.total}
          initialCategory={category}
        />
      </div>
    </section>
  );
}
