"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { type BlogPost, sortByDateDesc } from "@/lib/blog";
import { slugify } from "@/lib/products";
import { cloudinaryConfigured, uploadToCloudinary } from "@/lib/cloudinary";

interface BlogTabProps {
  posts: BlogPost[];
}

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function emptyDraft(): BlogPost {
  return {
    slug: "",
    title: "",
    excerpt: "",
    content: "",
    coverImage: "",
    publishedAt: todayIso(),
  };
}

export default function BlogTab({ posts }: BlogTabProps) {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [draft, setDraft] = useState<BlogPost | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const sorted = useMemo(() => sortByDateDesc(posts), [posts]);

  function selectPost(post: BlogPost) {
    setSelectedSlug(post.slug);
    setDraft({ ...post });
    setIsNew(false);
    setMessage(null);
  }

  function startNew() {
    setSelectedSlug(null);
    setDraft(emptyDraft());
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
      await setDoc(doc(db, "posts", slug), {
        title: draft.title,
        excerpt: draft.excerpt,
        content: draft.content,
        coverImage: draft.coverImage,
        publishedAt: draft.publishedAt,
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
    if (!confirm("Bu yazıyı silmek istediğinize emin misiniz?")) return;
    setSaving(true);
    try {
      await deleteDoc(doc(db, "posts", selectedSlug));
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
      setDraft((d) => (d ? { ...d, coverImage: url } : d));
    } catch (err) {
      setMessage((err as Error).message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
      <div className="rounded-2xl border border-line bg-white/40 p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-sm text-ink-soft/70">{sorted.length} yazı</p>
          <button
            onClick={startNew}
            className="flex shrink-0 items-center gap-1.5 rounded-xl bg-ink px-3 py-2 text-xs font-semibold text-bone hover:bg-bronze-dark"
          >
            <Plus className="h-4 w-4" /> Yeni
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto">
          {sorted.map((p) => (
            <button
              key={p.slug}
              onClick={() => selectPost(p)}
              className={`block w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                selectedSlug === p.slug
                  ? "bg-bronze/15 text-ink"
                  : "text-ink-soft hover:bg-bone-dim"
              }`}
            >
              {p.title} <span className="text-ink-soft/50">— {p.publishedAt}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-white/40 p-6">
        {!draft ? (
          <p className="text-sm text-ink-soft/60">
            Düzenlemek için bir yazı seçin veya yeni yazı ekleyin.
          </p>
        ) : (
          <div className="flex flex-col gap-4">
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

            <Field label="Yayın Tarihi">
              <input
                type="date"
                value={draft.publishedAt}
                onChange={(e) => setDraft({ ...draft, publishedAt: e.target.value })}
                className="input"
              />
            </Field>

            <Field label="Özet (liste ve meta açıklama için)">
              <textarea
                value={draft.excerpt}
                onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
                rows={2}
                className="input"
              />
            </Field>

            <Field label="İçerik">
              <textarea
                value={draft.content}
                onChange={(e) => setDraft({ ...draft, content: e.target.value })}
                rows={10}
                className="input"
              />
            </Field>

            <Field label="Kapak Görseli">
              <input
                value={draft.coverImage}
                onChange={(e) => setDraft({ ...draft, coverImage: e.target.value })}
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
              {draft.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={draft.coverImage}
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
