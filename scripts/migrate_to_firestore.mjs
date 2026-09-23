// One-time migration: data/products.json -> Firestore `products` collection.
// Requires temporarily permissive Firestore write rules (see firestore.rules).
import { readFileSync } from "node:fs";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, writeBatch } from "firebase/firestore";
// Env vars are sourced from .env by the shell before running this script.

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const raw = JSON.parse(readFileSync("data/products.json", "utf-8"));
const products = raw.products;

console.log(`Migrating ${products.length} products...`);

const BATCH_SIZE = 400; // Firestore batch limit is 500 writes
for (let i = 0; i < products.length; i += BATCH_SIZE) {
  const batch = writeBatch(db);
  const chunk = products.slice(i, i + BATCH_SIZE);
  for (const p of chunk) {
    const ref = doc(db, "products", p.slug);
    batch.set(ref, {
      id: p.id,
      title: p.title,
      category: p.category,
      description: p.description ?? "",
      dimensions: p.dimensions ?? "",
      price: p.price ?? null,
      image_urls: p.image_urls ?? [],
      url: p.url ?? "",
    });
  }
  await batch.commit();
  console.log(`Committed ${Math.min(i + BATCH_SIZE, products.length)}/${products.length}`);
}

console.log("Done.");
process.exit(0);
