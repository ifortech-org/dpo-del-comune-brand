import SectionContainer from "@/shared/components/ui/section-container";

import { stegaClean } from "next-sanity";
import {
  fetchSanityCategories,
  fetchSanityPostsPage,
} from "@/shared/sanity/lib/fetch";
import { PAGE_QUERYResult } from "@/sanity.types";
import CategoryFilter from "@/shared/components/category-filter";

import PostList from "../post-list";
import React from "react";

type AllPostsProps = Extract<
  NonNullable<NonNullable<PAGE_QUERYResult>["blocks"]>[number],
  { _type: "all-posts" }
>;

export default async function AllPosts({
  padding,
  colorVariant,
}: AllPostsProps) {
  const color = stegaClean(colorVariant);
  const [categories, paginatedPosts] = await Promise.all([
    fetchSanityCategories(),
    fetchSanityPostsPage({}),
  ]);

  return (
    <SectionContainer color={color} padding={padding}>
      <React.Suspense fallback={<div>Loading...</div>}>
        <div className="border-t border-b mb-4 py-2 flex justify-between items-center">
          <h1 className="font-semibold text-xl self-center">Ultime notizie</h1>

          <CategoryFilter categories={categories} />
        </div>

        <PostList
          initialPosts={paginatedPosts.items}
          initialTotal={paginatedPosts.total}
        />
      </React.Suspense>
    </SectionContainer>
  );
}
