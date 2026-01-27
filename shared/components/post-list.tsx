"use client";

import { POSTS_QUERYResult } from "@/sanity.types";
import { useSearchParams } from "next/navigation";
import PostCard from "@/shared/components/ui/post-card";
import Link from "next/link";
import { useEffect, useState } from "react";

function PostList({ posts }: { posts: POSTS_QUERYResult }) {
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filteredPosts, setFilteredPosts] = useState<POSTS_QUERYResult>(posts);
  const validCategoryNames = posts.map((post) =>
    post.categories?.map((category) => category.title)
  );

  // Effetto per aggiornare la categoria selezionata quando cambia il parametro di ricerca
  useEffect(() => {
    const category = searchParams?.get("category") ?? null;
    setSelectedCategory(category);
  }, [searchParams]);

  // Effetto per filtrare i post quando cambia la categoria selezionata
  useEffect(() => {
    if (selectedCategory && selectedCategory !== "0") {
      // Controlla se la categoria selezionata è valida
      const isValidCategory = validCategoryNames.some((category) =>
        category?.includes(selectedCategory)
      );

      if (!isValidCategory) {
        setSelectedCategory(null); // Reimposta la categoria se non è valida
        setFilteredPosts(posts);
        return;
      }

      const fp: POSTS_QUERYResult = posts.filter((post) =>
        post.categories?.some((category) => category.title === selectedCategory)
      );
      setFilteredPosts(fp);
    } else {
      setFilteredPosts(posts); // Mostra tutti i post se non c'è una categoria selezionata
    }
  }, [selectedCategory, posts]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {filteredPosts.map((post, index) => {
        let className =
          index === 0 || index % 5 === 0
            ? "flex w-full lg:col-span-2"
            : "flex w-full";

        return (
          <Link
            key={post?.slug?.current}
            className={className}
            href={`/blog/${post?.slug?.current}`}>
            <PostCard
              title={post?.title ?? ""}
              excerpt={post?.excerpt ?? ""}
              image={post?.image ?? null}
              categories={post?.categories ?? null}
            />
          </Link>
        );
      })}
    </div>
  );
}

export default PostList;
