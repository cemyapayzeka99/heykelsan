import {
  Landmark,
  PawPrint,
  Columns3,
  Flag,
  Frame,
  LayoutGrid,
  Flower2,
  TreePine,
  Crown,
  type LucideIcon,
} from "lucide-react";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "heykeller": Landmark,
  "hayvan-heykelleri": PawPrint,
  "sutunlar": Columns3,
  "ataturk-heykelleri": Flag,
  "rolyefler-ve-tugralar": Frame,
  "duvar-kaplama-plakalari": LayoutGrid,
  "saksilar": Flower2,
  "bahce-aksesuarlari": TreePine,
  "osmanli-heykelleri-bustleri": Crown,
};

export function categoryIcon(slug: string): LucideIcon {
  return CATEGORY_ICONS[slug] ?? Landmark;
}
