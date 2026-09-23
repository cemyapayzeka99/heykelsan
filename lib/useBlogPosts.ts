"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { type BlogPost } from "@/lib/blog";

interface UseBlogPostsResult {
  posts: BlogPost[];
  loading: boolean;
  error: string | null;
}

export function useBlogPosts(): UseBlogPostsResult {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "posts"), orderBy("publishedAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setPosts(
          snapshot.docs.map((d) => ({
            slug: d.id,
            ...(d.data() as Omit<BlogPost, "slug">),
          }))
        );
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  return { posts, loading, error };
}
