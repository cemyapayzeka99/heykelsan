"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Product } from "@/lib/products";

interface UseProductsResult {
  products: Product[];
  loading: boolean;
  error: string | null;
}

/**
 * Live subscription to the `products` collection. Any change made in the
 * admin panel (by this browser or anyone else's) is reflected immediately,
 * with no rebuild/redeploy step in between.
 */
export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        const list = snapshot.docs.map((doc) => {
          const data = doc.data() as Omit<Product, "slug">;
          return { ...data, slug: doc.id } as Product;
        });
        setProducts(list);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  return { products, loading, error };
}
