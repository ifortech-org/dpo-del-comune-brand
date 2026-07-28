import { sanityFetch } from "@/shared/sanity/lib/live";
import { PAGE_QUERY, PAGES_SLUGS_QUERY } from "@/shared/sanity/queries/page";
import {
  CATEGORIES_QUERY,
  POST_QUERY,
  POSTS_PAGE_QUERY,
  POSTS_QUERY,
  POSTS_SLUGS_QUERY,
} from "@/shared/sanity/queries/post";
import {
  PAGE_QUERYResult,
  PAGES_SLUGS_QUERYResult,
  POST_QUERYResult,
  POSTS_QUERYResult,
  POSTS_SLUGS_QUERYResult,
} from "@/sanity.types";
import { Category } from "@/shared/types";

type PaginatedPostsResult = {
  items: POSTS_QUERYResult;
  total: number;
};

export const fetchSanityPageBySlug = async ({
  slug,
}: {
  slug: string;
}): Promise<PAGE_QUERYResult> => {
  const { data } = await sanityFetch({
    query: PAGE_QUERY,
    params: { slug },
    tags: ["page"],
    perspective: "published",
    stega: false,
  });

  return data;
};

export const fetchSanityPagesStaticParams =
  async (): Promise<PAGES_SLUGS_QUERYResult> => {
    const { data } = await sanityFetch({
      query: PAGES_SLUGS_QUERY,
      tags: ["page"],
      perspective: "published",
      stega: false,
    });

    return data;
  };

export const fetchSanityPosts = async (): Promise<POSTS_QUERYResult> => {
  const { data } = await sanityFetch({
    query: POSTS_QUERY,
    tags: ["post", "author", "category"],
    perspective: "published",
    stega: false,
  });

  return data;
};

export const fetchSanityPostsPage = async ({
  start = 0,
  limit = 20,
  category = "",
}: {
  start?: number;
  limit?: number;
  category?: string;
}): Promise<PaginatedPostsResult> => {
  const { data } = await sanityFetch({
    query: POSTS_PAGE_QUERY,
    params: {
      start,
      end: start + limit,
      category,
    },
    tags: ["post", "author", "category"],
    perspective: "published",
    stega: false,
  });

  return data as PaginatedPostsResult;
};

export const fetchSanityCategories = async (): Promise<Category[]> => {
  const { data } = await sanityFetch({
    query: CATEGORIES_QUERY,
    tags: ["category"],
    perspective: "published",
    stega: false,
  });

  return (data as Array<{ title?: string; slug?: { current?: string } | null }>)
    .map((category) => ({
      title: category.title ?? "",
      slug: category.slug?.current ?? "",
    }))
    .filter((category) => category.title);
};

export const fetchSanityPostBySlug = async ({
  slug,
}: {
  slug: string;
}): Promise<POST_QUERYResult> => {
  const { data } = await sanityFetch({
    query: POST_QUERY,
    params: { slug },
    tags: ["post", "author", "category"],
    perspective: "published",
    stega: false,
  });

  return data;
};

export const fetchSanityPostsStaticParams =
  async (): Promise<POSTS_SLUGS_QUERYResult> => {
    const { data } = await sanityFetch({
      query: POSTS_SLUGS_QUERY,
      tags: ["post"],
      perspective: "published",
      stega: false,
    });

    return data;
  };
