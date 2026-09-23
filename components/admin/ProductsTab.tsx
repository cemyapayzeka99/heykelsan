"use client";

import { useMemo, useState } from "react";
import { Search, Plus, Trash2 } from "lucide-react";
import { doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { type Product, slugify } from "@/lib/products";
import { type Category } from "@/lib/categories";
import { cloudinaryConfigured, uploadToCloudinary } from "@/lib/cloudinary";

interface ProductsTabProps {
  products: Product[];
  categories: Category[];
}

function emptyDraft(defaultCategory: string): Product {
  return {
    id: "",
    title: "",
    slug: "",
    category: defaultCategory,
    description: "",
    dimensions: "",
    price: null,
    image_urls: [],
  };
}

export default function ProductsTab({ products, categories }: ProductsTabProps) {
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
      (p) => p.title.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
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
    setDraft(emptyDraft(categories[0]?.slug ?? ""));
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
    <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
      {/* Product list */}
      <div className="rounded-2xl border border-line bg-white/40 p-4">
        <div className="mb-3 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft/40" />
            <input
              type="text"
              placeholder="Ürün ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input pl-9"
            />
          </div>
          <button
            onClick={startNew}
            className="flex shrink-0 items-center gap-1.5 rounded-xl bg-ink px-3 py-2 text-xs font-semibold text-bone hover:bg-bronze-dark"
          >
            <Plus className="h-4 w-4" /> Yeni
          </button>
        </div>
        <p className="mb-2 text-xs text-ink-soft/60">{filtered.length} ürün</p>
        <div className="max-h-[60vh] overflow-y-auto">
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
              {p.title} <span className="text-ink-soft/50">— {p.id}</span>
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
                onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                className="input"
              />
            </Field>

            {isNew ? (
              <Field label="Slug (URL'de kullanılır)">
                <input
                  value={draft.slug}
                  onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
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
                onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                className="input"
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Açıklama">
              <textarea
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                rows={4}
                className="input"
              />
            </Field>

            <Field label="Ölçüler">
              <input
                value={draft.dimensions}
                onChange={(e) => setDraft({ ...draft, dimensions: e.target.value })}
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
                onChange={(e) => setDraft({ ...draft, image_urls: [e.target.value] })}
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
                  <span className="text-xs text-ink-soft/60">Yükleniyor...</span>
                ) : null}
              </div>
              {!cloudinaryConfigured ? (
                <p className="mt-1 text-xs text-ink-soft/50">
                  Görsel yükleme henüz yapılandırılmadı — linki elle yapıştırın.
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

            {message ? <p className="text-sm text-bronze-dark">{message}</p> : null}

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
                  className="flex items-center gap-1.5 rounded-full border border-red-300 px-5 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" /> Sil
                </button>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-ink-soft/70">
        {label}
      </label>
      {children}
    </div>
  );
}
