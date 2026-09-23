"use client";

import { useMemo, useState } from "react";
import { ArrowUp, ArrowDown, Trash2, Plus } from "lucide-react";
import {
  doc,
  setDoc,
  deleteDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { type Product, slugify } from "@/lib/products";
import { type Category } from "@/lib/categories";

interface CategoriesTabProps {
  products: Product[];
  categories: Category[];
}

export default function CategoriesTab({ products, categories }: CategoriesTabProps) {
  const [newLabel, setNewLabel] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState("");

  const productCountBySlug = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of products) {
      counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    }
    return counts;
  }, [products]);

  const sorted = useMemo(
    () => [...categories].sort((a, b) => a.order - b.order),
    [categories]
  );

  async function handleAdd() {
    const label = newLabel.trim();
    if (!label) return;
    const slug = slugify(label);
    if (categories.some((c) => c.slug === slug)) {
      setMessage("Bu isimde bir kategori zaten var.");
      return;
    }
    setSaving(true);
    try {
      const maxOrder = categories.reduce((m, c) => Math.max(m, c.order), 0);
      await setDoc(doc(db, "categories", slug), {
        label,
        order: maxOrder + 1,
      });
      setNewLabel("");
      setMessage("Kategori eklendi.");
    } catch (err) {
      setMessage(`Hata: ${(err as Error).message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleRename(slug: string) {
    const label = editingLabel.trim();
    if (!label) return;
    setSaving(true);
    try {
      await setDoc(doc(db, "categories", slug), { label }, { merge: true });
      setEditingSlug(null);
      setMessage("Kategori güncellendi.");
    } catch (err) {
      setMessage(`Hata: ${(err as Error).message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(slug: string) {
    const count = productCountBySlug.get(slug) ?? 0;
    if (count > 0) {
      setMessage(
        `Bu kategoride ${count} ürün var. Önce o ürünleri başka bir kategoriye taşıyın.`
      );
      return;
    }
    if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) return;
    setSaving(true);
    try {
      await deleteDoc(doc(db, "categories", slug));
      setMessage("Kategori silindi.");
    } catch (err) {
      setMessage(`Hata: ${(err as Error).message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleMove(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= sorted.length) return;
    const a = sorted[index];
    const b = sorted[target];
    setSaving(true);
    try {
      const batch = writeBatch(db);
      batch.set(doc(db, "categories", a.slug), { order: b.order }, { merge: true });
      batch.set(doc(db, "categories", b.slug), { order: a.order }, { merge: true });
      await batch.commit();
    } catch (err) {
      setMessage(`Hata: ${(err as Error).message}`);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="rounded-2xl border border-line bg-white/40 p-5">
        <h2 className="font-display text-lg text-ink">Yeni Kategori Ekle</h2>
        <div className="mt-3 flex gap-2">
          <input
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="Örn: Çeşmeler"
            className="input"
          />
          <button
            onClick={handleAdd}
            disabled={saving || !newLabel.trim()}
            className="flex shrink-0 items-center gap-1.5 rounded-xl bg-ink px-4 py-2 text-sm font-semibold text-bone transition-colors hover:bg-bronze-dark disabled:opacity-60"
          >
            <Plus className="h-4 w-4" /> Ekle
          </button>
        </div>
        {message ? (
          <p className="mt-2 text-sm text-bronze-dark">{message}</p>
        ) : null}
      </div>

      <div className="mt-6 flex flex-col gap-2">
        {sorted.map((cat, i) => {
          const count = productCountBySlug.get(cat.slug) ?? 0;
          const isEditing = editingSlug === cat.slug;
          return (
            <div
              key={cat.slug}
              className="flex items-center gap-3 rounded-xl border border-line bg-white/40 p-3"
            >
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => handleMove(i, -1)}
                  disabled={i === 0 || saving}
                  className="text-ink-soft/50 hover:text-ink disabled:opacity-30"
                  aria-label="Yukarı taşı"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleMove(i, 1)}
                  disabled={i === sorted.length - 1 || saving}
                  className="text-ink-soft/50 hover:text-ink disabled:opacity-30"
                  aria-label="Aşağı taşı"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1">
                {isEditing ? (
                  <div className="flex gap-2">
                    <input
                      value={editingLabel}
                      onChange={(e) => setEditingLabel(e.target.value)}
                      className="input"
                      autoFocus
                    />
                    <button
                      onClick={() => handleRename(cat.slug)}
                      className="shrink-0 rounded-xl bg-ink px-3 py-1.5 text-xs font-semibold text-bone"
                    >
                      Kaydet
                    </button>
                    <button
                      onClick={() => setEditingSlug(null)}
                      className="shrink-0 rounded-xl border border-line px-3 py-1.5 text-xs text-ink-soft"
                    >
                      Vazgeç
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setEditingSlug(cat.slug);
                      setEditingLabel(cat.label);
                    }}
                    className="text-left text-sm font-medium text-ink hover:text-bronze-dark"
                  >
                    {cat.label}
                  </button>
                )}
                <p className="text-xs text-ink-soft/50">{count} ürün</p>
              </div>

              <button
                onClick={() => handleDelete(cat.slug)}
                disabled={saving}
                className="shrink-0 rounded-lg p-2 text-red-500 transition-colors hover:bg-red-50 disabled:opacity-40"
                aria-label="Sil"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
