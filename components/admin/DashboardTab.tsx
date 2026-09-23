"use client";

import { useMemo } from "react";
import { Package, Tags, ImageOff, Tag as TagIcon, Clock } from "lucide-react";
import { type Product, hasUsableImage } from "@/lib/products";
import { type Category, categoryLabelFrom } from "@/lib/categories";

interface DashboardTabProps {
  products: Product[];
  categories: Category[];
}

function toDate(value: unknown): Date | null {
  if (value && typeof value === "object" && "toDate" in value) {
    try {
      return (value as { toDate: () => Date }).toDate();
    } catch {
      return null;
    }
  }
  return null;
}

export default function DashboardTab({ products, categories }: DashboardTabProps) {
  const missingImage = useMemo(
    () => products.filter((p) => !hasUsableImage(p)),
    [products]
  );
  const missingPrice = useMemo(
    () => products.filter((p) => p.price === null || p.price === undefined),
    [products]
  );

  const byCategory = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of products) {
      counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    }
    return categories
      .map((c) => ({ ...c, count: counts.get(c.slug) ?? 0 }))
      .sort((a, b) => b.count - a.count);
  }, [products, categories]);

  const recentlyUpdated = useMemo(() => {
    return [...products]
      .map((p) => ({ product: p, date: toDate(p.updatedAt) }))
      .filter((p) => p.date !== null)
      .sort((a, b) => (b.date as Date).getTime() - (a.date as Date).getTime())
      .slice(0, 5);
  }, [products]);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard icon={Package} label="Toplam Ürün" value={products.length} />
        <StatCard icon={Tags} label="Kategori" value={categories.length} />
        <StatCard
          icon={ImageOff}
          label="Görseli Eksik"
          value={missingImage.length}
          tone={missingImage.length > 0 ? "warn" : "ok"}
        />
        <StatCard
          icon={TagIcon}
          label="Fiyatı Belirsiz"
          value={missingPrice.length}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-white/40 p-5">
          <h2 className="font-display text-lg text-ink">Kategoriye Göre Dağılım</h2>
          <div className="mt-4 flex flex-col gap-2.5">
            {byCategory.map((c) => {
              const max = byCategory[0]?.count || 1;
              const pct = Math.round((c.count / max) * 100);
              return (
                <div key={c.slug}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink-soft">{c.label}</span>
                    <span className="font-medium text-ink">{c.count}</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-bone-dim">
                    <div
                      className="h-full rounded-full bg-bronze"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-line bg-white/40 p-5">
          <h2 className="flex items-center gap-2 font-display text-lg text-ink">
            <Clock className="h-4 w-4 text-bronze-dark" />
            Son Güncellenenler
          </h2>
          {recentlyUpdated.length === 0 ? (
            <p className="mt-4 text-sm text-ink-soft/60">
              Henüz panel üzerinden düzenleme yapılmadı.
            </p>
          ) : (
            <ul className="mt-4 flex flex-col gap-3">
              {recentlyUpdated.map(({ product, date }) => (
                <li key={product.slug} className="flex items-center justify-between text-sm">
                  <span className="text-ink-soft">
                    {product.title}
                    <span className="ml-2 text-xs text-bronze-dark">
                      {categoryLabelFrom(categories, product.category)}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs text-ink-soft/50">
                    {date?.toLocaleDateString("tr-TR")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {missingImage.length > 0 ? (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5">
          <h2 className="font-display text-lg text-ink">
            Görseli Eksik Ürünler ({missingImage.length})
          </h2>
          <p className="mt-1 text-sm text-ink-soft/70">
            Bu ürünlerin sitede görseli görünmüyor — Ürünler sekmesinden
            düzenleyip görsel ekleyebilirsiniz.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {missingImage.slice(0, 12).map((p) => (
              <span
                key={p.slug}
                className="rounded-full bg-white px-3 py-1 text-xs text-ink-soft"
              >
                {p.title}
              </span>
            ))}
            {missingImage.length > 12 ? (
              <span className="rounded-full bg-white px-3 py-1 text-xs text-ink-soft/60">
                +{missingImage.length - 12} daha
              </span>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone = "neutral",
}: {
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: number;
  tone?: "neutral" | "warn" | "ok";
}) {
  const toneClass =
    tone === "warn" && value > 0
      ? "border-amber-300 bg-amber-50"
      : "border-line bg-white/40";
  return (
    <div className={`rounded-2xl border p-5 ${toneClass}`}>
      <Icon className="h-5 w-5 text-bronze-dark" strokeWidth={1.5} />
      <div className="mt-3 font-display text-2xl text-ink">{value}</div>
      <div className="text-xs text-ink-soft/70">{label}</div>
    </div>
  );
}
