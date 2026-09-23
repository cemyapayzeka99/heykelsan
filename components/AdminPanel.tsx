"use client";

import { useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { LayoutDashboard, Package, Tags, LogOut } from "lucide-react";
import { auth } from "@/lib/firebase";
import { useProducts } from "@/lib/useProducts";
import { useCategories } from "@/lib/categories";
import DashboardTab from "@/components/admin/DashboardTab";
import ProductsTab from "@/components/admin/ProductsTab";
import CategoriesTab from "@/components/admin/CategoriesTab";

export default function AdminPanel() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    return onAuthStateChanged(auth, setUser);
  }, []);

  if (user === undefined) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center text-sm text-ink-soft/60">
        Yükleniyor...
      </div>
    );
  }

  return user ? <PanelShell user={user} /> : <LoginForm />;
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError("E-posta veya şifre hatalı.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6 py-16">
      <h1 className="font-display text-2xl text-ink">Yönetim Paneli</h1>
      <p className="mt-1 text-sm text-ink-soft/70">Heykelsan</p>
      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-soft/70">
            E-posta
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-soft/70">
            Şifre
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
          />
        </div>
        {error ? <p className="text-sm text-red-600">{error}</p> : null}
        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-bone transition-colors hover:bg-bronze-dark disabled:opacity-60"
        >
          {submitting ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </form>
    </div>
  );
}

type Tab = "dashboard" | "products" | "categories";

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "dashboard", label: "Panel", icon: LayoutDashboard },
  { id: "products", label: "Ürünler", icon: Package },
  { id: "categories", label: "Kategoriler", icon: Tags },
];

function PanelShell({ user }: { user: User }) {
  const [tab, setTab] = useState<Tab>("dashboard");
  const { products, loading: productsLoading } = useProducts();
  const { categories, loading: categoriesLoading } = useCategories();
  const loading = productsLoading || categoriesLoading;

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-ink">Yönetim Paneli</h1>
          <p className="text-sm text-ink-soft/70">{user.email}</p>
        </div>
        <button
          onClick={() => signOut(auth)}
          className="flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-bronze/60"
        >
          <LogOut className="h-4 w-4" /> Çıkış Yap
        </button>
      </div>

      <div className="mb-6 flex gap-1 rounded-xl border border-line bg-white/40 p-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === id
                ? "bg-ink text-bone"
                : "text-ink-soft hover:bg-bone-dim"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-ink-soft/60">Yükleniyor...</p>
      ) : (
        <>
          {tab === "dashboard" ? (
            <DashboardTab products={products} categories={categories} />
          ) : null}
          {tab === "products" ? (
            <ProductsTab products={products} categories={categories} />
          ) : null}
          {tab === "categories" ? (
            <CategoriesTab products={products} categories={categories} />
          ) : null}
        </>
      )}
    </div>
  );
}
