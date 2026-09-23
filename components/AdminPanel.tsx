"use client";

import { useEffect, useMemo, useState } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useProducts } from "@/lib/useProducts";
import {
  type Product,
  CATEGORY_LABELS,
  PRIMARY_CATEGORIES,
  slugify,
} from "@/lib/products";
import { cloudinaryConfigured, uploadToCloudinary } from "@/lib/cloudinary";

const EMPTY_DRAFT: Product = {
  id: "",
  title: "",
  slug: "",
  category: PRIMARY_CATEGORIES[0],
  description: "",
  dimensions: "",
  price: null,
  image_urls: [],
};

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

  return user ? <ProductManager user={user} /> : <LoginForm />;
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
            className="w-full rounded-xl border border-line bg-white/60 px-4 py-3 text-sm outline-none focus:border-bronze"
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
            className="w-full rounded-xl border border-line bg-white/60 px-4 py-3 text-sm outline-none focus:border-bronze"
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

function ProductManager({ user }: { user: User }) {
  const { products, loading } = useProducts();
  const [search, setSearch] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [draft, setDraft] = useState<Product | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
    );
  }, [products, search]);

  function selectProduct(product: Product) {
    setSelectedSlug(product.slug);
    setDraft({ ...product });
    setIsNew(false);
    setMessage(null);
  }

  function startNew() {
    setSelectedSlug(null);
    setDraft({ ...EMPTY_DRAFT });
    setIsNew(true);
    setMessage(null);
  }

  async function handleSave() {
    if (!draft) return;
    const slug = isNew ? slugify(draft.slug || draft.title) : draft.slug;
    if (!slug) {
      setMessage("Slug boş olamaz.");
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      await setDoc(doc(db, "products", slug), {
        id: draft.id || slug.toUpperCase(),
        title: draft.title,
        category: draft.category,
        description: draft.description,
        dimensions: draft.dimensions,
        price: draft.price,
        image_urls: draft.image_urls,
        updatedAt: serverTimestamp(),
      });
      setMessage("Kaydedildi.");
      setSelectedSlug(slug);
      setIsNew(false);
    } catch (err) {
      setMessage(`Kaydetme hatası: ${(err as Error).message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!selectedSlug) return;
    if (!confirm("Bu ürünü silmek istediğinize emin misiniz?")) return;
    setSaving(true);
    try {
      await deleteDoc(doc(db, "products", selectedSlug));
      setDraft(null);
      setSelectedSlug(null);
      setMessage("Silindi.");
    } catch (err) {
      setMessage(`Silme hatası: ${(err as Error).message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleImageUpload(file: File) {
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setDraft((d) => (d ? { ...d, image_urls: [url] } : d));
    } catch (err) {
      setMessage((err as Error).message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl text-ink">Yönetim Paneli</h1>
          <p className="text-sm text-ink-soft/70">{user.email}</p>
        </div>
        <button
          onClick={() => signOut(auth)}
          className="rounded-full border border-line px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-bronze/60"
        >
          Çıkış Yap
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        {/* Product list */}
        <div className="rounded-2xl border border-line bg-white/40 p-4">
          <div className="mb-3 flex items-center gap-2">
            <input
              type="text"
              placeholder="Ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-line bg-white/60 px-3 py-2 text-sm outline-none focus:border-bronze"
            />
            <button
              onClick={startNew}
              className="shrink-0 rounded-lg bg-ink px-3 py-2 text-xs font-semibold text-bone hover:bg-bronze-dark"
            >
              + Yeni
            </button>
          </div>
          <p className="mb-2 text-xs text-ink-soft/60">
            {loading ? "Yükleniyor..." : `${filtered.length} ürün`}
          </p>
          <div className="max-h-[65vh] overflow-y-auto">
            {filtered.map((p) => (
              <button
                key={p.slug}
                onClick={() => selectProduct(p)}
                className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  selectedSlug === p.slug
                    ? "bg-bronze/15 text-ink"
                    : "text-ink-soft hover:bg-bone-dim"
                }`}
              >
                {p.title} — {p.id}
              </button>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div className="rounded-2xl border border-line bg-white/40 p-6">
          {!draft ? (
            <p className="text-sm text-ink-soft/60">
              Düzenlemek için bir ürün seçin veya yeni ürün ekleyin.
            </p>
          ) : (
            <div className="flex flex-col gap-4">
              <Field label="Ürün Kodu (ID)">
                <input
                  value={draft.id}
                  onChange={(e) => setDraft({ ...draft, id: e.target.value })}
                  className="input"
                />
              </Field>

              <Field label="Başlık">
                <input
                  value={draft.title}
                  onChange={(e) =>
                    setDraft({ ...draft, title: e.target.value })
                  }
                  className="input"
                />
              </Field>

              {isNew ? (
                <Field label="Slug (URL'de kullanılır)">
                  <input
                    value={draft.slug}
                    onChange={(e) =>
                      setDraft({ ...draft, slug: e.target.value })
                    }
                    placeholder={slugify(draft.title) || "otomatik"}
                    className="input"
                  />
                </Field>
              ) : (
                <Field label="Slug">
                  <input value={draft.slug} disabled className="input opacity-60" />
                </Field>
              )}

              <Field label="Kategori">
                <select
                  value={draft.category}
                  onChange={(e) =>
                    setDraft({ ...draft, category: e.target.value })
                  }
                  className="input"
                >
                  {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Açıklama">
                <textarea
                  value={draft.description}
                  onChange={(e) =>
                    setDraft({ ...draft, description: e.target.value })
                  }
                  rows={4}
                  className="input"
                />
              </Field>

              <Field label="Ölçüler">
                <input
                  value={draft.dimensions}
                  onChange={(e) =>
                    setDraft({ ...draft, dimensions: e.target.value })
                  }
                  placeholder="Örn: Yükseklik: 70 cm"
                  className="input"
                />
              </Field>

              <Field label="Fiyat (boş bırakılırsa gösterilmez)">
                <input
                  type="number"
                  value={draft.price ?? ""}
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      price: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  className="input"
                />
              </Field>

              <Field label="Görsel">
                <input
                  value={draft.image_urls[0] ?? ""}
                  onChange={(e) =>
                    setDraft({ ...draft, image_urls: [e.target.value] })
                  }
                  placeholder="Görsel linki"
                  className="input"
                />
                <div className="mt-2 flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    disabled={!cloudinaryConfigured || uploading}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleImageUpload(file);
                    }}
                    className="text-xs"
                  />
                  {uploading ? (
                    <span className="text-xs text-ink-soft/60">
                      Yükleniyor...
                    </span>
                  ) : null}
                </div>
                {!cloudinaryConfigured ? (
                  <p className="mt-1 text-xs text-ink-soft/50">
                    Görsel yükleme henüz yapılandırılmadı — linki elle
                    yapıştırın.
                  </p>
                ) : null}
                {draft.image_urls[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={draft.image_urls[0]}
                    alt=""
                    className="mt-3 h-32 w-32 rounded-lg border border-line object-cover"
                  />
                ) : null}
              </Field>

              {message ? (
                <p className="text-sm text-bronze-dark">{message}</p>
              ) : null}

              <div className="mt-2 flex items-center gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-bone transition-colors hover:bg-bronze-dark disabled:opacity-60"
                >
                  {saving ? "Kaydediliyor..." : "Kaydet"}
                </button>
                {!isNew ? (
                  <button
                    onClick={handleDelete}
                    disabled={saving}
                    className="rounded-full border border-red-300 px-6 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                  >
                    Sil
                  </button>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-soft/70">
        {label}
      </label>
      {children}
    </div>
  );
}
