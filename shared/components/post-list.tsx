"use client";

import { POSTS_QUERYResult } from "@/sanity.types";
import { useSearchParams } from "next/navigation";
import PostCard from "@/shared/components/ui/post-card";
import { Button } from "@/shared/components/ui/button";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const POSTS_BATCH_SIZE = 20;

type PostListProps = {
  initialPosts: POSTS_QUERYResult;
  initialTotal: number;
  initialCategory?: string;
};

type PostsResponse = {
  items: POSTS_QUERYResult;
  total: number;
};

function PostList({
  initialPosts,
  initialTotal,
  initialCategory = "",
}: PostListProps) {
  const searchParams = useSearchParams();
  const hydratedInitialCategory = useRef(initialCategory);
  const isFirstSync = useRef(true);

  const [posts, setPosts] = useState<POSTS_QUERYResult>(initialPosts);
  const [total, setTotal] = useState(initialTotal);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  useEffect(() => {
    const category = searchParams?.get("category") ?? "";
    setSelectedCategory(category);
  }, [searchParams]);

  useEffect(() => {
    const syncPosts = async () => {
      if (isFirstSync.current) {
        isFirstSync.current = false;

        if (selectedCategory === hydratedInitialCategory.current) {
          return;
        }
      }

      setIsLoading(true);

      try {
        const params = new URLSearchParams({
          start: "0",
          limit: String(POSTS_BATCH_SIZE),
        });

        if (selectedCategory) {
          params.set("category", selectedCategory);
        }

        const response = await fetch(`/api/posts?${params.toString()}`);
        const data = (await response.json()) as PostsResponse;

        setPosts(data.items);
        setTotal(data.total);
      } finally {
        setIsLoading(false);
      }
    };

    void syncPosts();
  }, [selectedCategory]);

  const handleLoadMore = async () => {
    setIsLoading(true);

    try {
      const params = new URLSearchParams({
        start: String(posts.length),
        limit: String(POSTS_BATCH_SIZE),
      });

      if (selectedCategory) {
        params.set("category", selectedCategory);
      }

      const response = await fetch(`/api/posts?${params.toString()}`);
      const data = (await response.json()) as PostsResponse;

      setPosts((current) => [...current, ...data.items]);
      setTotal(data.total);
    } finally {
      setIsLoading(false);
    }
  };

  const hasMorePosts = posts.length < total;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {posts.map((post, index) => {
          const className =
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
                image={post?.image ?? undefined}
                categories={post?.categories ?? undefined}
              />
            </Link>
          );
        })}
      </div>

      <div className="flex justify-center">
        <Button
          type="button"
          variant="outline"
          size="lg"
          disabled={isLoading || !hasMorePosts}
          onClick={handleLoadMore}>
          {isLoading
            ? "Caricamento..."
            : hasMorePosts
              ? "Carica altri 20 articoli"
              : "Nessun altro articolo"}
        </Button>
      </div>
    </div>
  );
}

export default PostList;
