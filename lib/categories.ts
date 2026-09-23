"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface Category {
  slug: string;
  label: string;
  order: number;
}

interface UseCategoriesResult {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

export function useCategories(): UseCategoriesResult {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "categories"), orderBy("order", "asc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setCategories(
          snapshot.docs.map((d) => ({
            slug: d.id,
            label: (d.data().label as string) ?? d.id,
            order: (d.data().order as number) ?? 0,
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

  return { categories, loading, error };
}

export function categoryLabelFrom(categories: Category[], slug: string): string {
  return categories.find((c) => c.slug === slug)?.label ?? slug;
}
