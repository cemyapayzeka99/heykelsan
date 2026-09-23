// One-time migration: seed the `categories` collection from the categories
// that used to be hardcoded in lib/products.ts.
import { initializeApp } from "firebase/app";
import { getFirestore, doc, writeBatch } from "firebase/firestore";

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

const categories = [
  { slug: "heykeller", label: "Heykeller" },
  { slug: "hayvan-heykelleri", label: "Hayvan Heykelleri" },
  { slug: "sutunlar", label: "Sütunlar" },
  { slug: "ataturk-heykelleri", label: "Atatürk Heykelleri" },
  { slug: "rolyefler-ve-tugralar", label: "Rölyefler ve Tuğralar" },
  { slug: "duvar-kaplama-plakalari", label: "Duvar Kaplama Plakaları" },
  { slug: "saksilar", label: "Saksılar" },
  { slug: "bahce-aksesuarlari", label: "Bahçe Aksesuarları" },
  { slug: "osmanli-heykelleri-bustleri", label: "Osmanlı Heykelleri ve Büstleri" },
];

const batch = writeBatch(db);
categories.forEach((c, i) => {
  batch.set(doc(db, "categories", c.slug), { label: c.label, order: i + 1 });
});
await batch.commit();

console.log(`Seeded ${categories.length} categories.`);
process.exit(0);
