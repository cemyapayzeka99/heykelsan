import type { MetadataRoute } from "next";
import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

export const dynamic = "force-static";

const SITE_URL = "https://heykelsan-80dc7.web.app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/urunler`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/hakkimizda`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/iletisim`, changeFrequency: "monthly", priority: 0.5 },
  ];

  try {
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const [productsSnap, categoriesSnap, postsSnap] = await Promise.all([
      getDocs(collection(db, "products")),
      getDocs(collection(db, "categories")),
      getDocs(collection(db, "posts")),
    ]);

    const categoryRoutes: MetadataRoute.Sitemap = categoriesSnap.docs.map((d) => ({
      url: `${SITE_URL}/urunler?kategori=${d.id}`,
      changeFrequency: "weekly",
      priority: 0.7,
    }));

    const productRoutes: MetadataRoute.Sitemap = productsSnap.docs.map((d) => ({
      url: `${SITE_URL}/urunler/detay?slug=${d.id}`,
      changeFrequency: "monthly",
      priority: 0.6,
    }));

    const postRoutes: MetadataRoute.Sitemap = postsSnap.docs.map((d) => ({
      url: `${SITE_URL}/blog/detay?slug=${d.id}`,
      changeFrequency: "monthly",
      priority: 0.5,
    }));

    return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...postRoutes];
  } catch {
    return staticRoutes;
  }
}
