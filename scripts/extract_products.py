import json
import re
import sys
from urllib.parse import urlparse, unquote

TR_MAP = str.maketrans({
    "ş": "s", "Ş": "S", "ı": "i", "İ": "I", "ğ": "g", "Ğ": "G",
    "ü": "u", "Ü": "U", "ö": "o", "Ö": "O", "ç": "c", "Ç": "C",
})

FIELD_LINE_RE = re.compile(
    r"^\s*(Ürün Kodu|Boyutları|Genişlik|Yükseklik|Derinlik|Ağırlık|En|Boy)\s*:",
    re.IGNORECASE,
)

DIM_TOKEN_RE = re.compile(
    r"(Boyutları|Ebatları|Ebat|Genişlik|Yükseklik|Derinlik|Ağırlık|Çap|En|Boy)"
    r"\*{0,2}\s*:\s*\*{0,2}\s*([0-9]+(?:[.,][0-9]+)?\s*(?:cm|kg|mm|m)\.?)",
    re.IGNORECASE,
)

CATEGORY_LINK_RE = re.compile(r"/urun-kategorileri/tumu/([^/\s\)]+)/")
CATEGORY_LABEL = "Ürün Kategorisi"
CATEGORY_WINDOW_END = "Stok Durumu"
CODE_RE = re.compile(r"Ürün Kodu\s*:\s*([A-Za-z0-9\-]+)")

BOILERPLATE_IMG_MARKERS = ("/logo/", "phon.png", "etiket.png", "izmirwebtasarim", "getbutton")


def slugify(text):
    text = unquote(text)
    text = text.strip().strip("/")
    text = text.translate(TR_MAP)
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    text = re.sub(r"-+", "-", text).strip("-")
    return text


def clean_title(meta):
    title = meta.get("og:title") or meta.get("ogTitle") or meta.get("title") or ""
    title = re.sub(r"\s*-\s*Heykelsan.*$", "", title).strip()
    return title


def extract_description_and_dims(md):
    start = md.find("ÜRÜN AÇIKLAMASI")
    if start == -1:
        return "", ""
    end = md.find("Bizi Arayın", start)
    block = md[start + len("ÜRÜN AÇIKLAMASI"): end if end != -1 else None]

    dims_found = DIM_TOKEN_RE.findall(block)
    dims_parts = []
    seen = set()
    for label, value in dims_found:
        label_norm = label.capitalize()
        key = (label_norm, value.strip())
        if key in seen:
            continue
        seen.add(key)
        dims_parts.append(f"{label_norm}: {value.strip()}")
    dimensions = ", ".join(dims_parts)

    desc_lines = []
    for line in block.splitlines():
        stripped = line.strip()
        if not stripped:
            continue
        if FIELD_LINE_RE.match(stripped):
            continue
        desc_lines.append(stripped)
    description = " ".join(desc_lines).strip()
    return description, dimensions


def extract_category(md):
    start = md.find(CATEGORY_LABEL)
    if start == -1:
        return None
    end = md.find(CATEGORY_WINDOW_END, start)
    window = md[start: end if end != -1 else start + 600]
    m = CATEGORY_LINK_RE.search(window)
    if m:
        return slugify(m.group(1))
    return None


def extract_image_urls(md, page_url):
    urls = re.findall(r"!\[[^\]]*\]\((https?://[^\s\)]+)\)", md)
    cleaned = []
    seen = set()
    for u in urls:
        if any(marker in u for marker in BOILERPLATE_IMG_MARKERS):
            continue
        if "/images/urun/" not in u:
            continue
        if u in seen:
            continue
        seen.add(u)
        cleaned.append(u)
    return cleaned


def main():
    with open("heykelsan-data/crawl.json", encoding="utf-8") as f:
        data = json.load(f)

    pages = data["data"]
    products_by_key = {}
    skipped_malformed = []

    for page in pages:
        meta = page.get("metadata", {})
        source_url = meta.get("sourceURL") or meta.get("url") or ""
        parsed = urlparse(source_url)
        if "/urunler/" not in parsed.path:
            continue

        raw_slug = parsed.path.split("/urunler/", 1)[1]
        raw_slug_decoded = unquote(raw_slug).strip().strip("/")

        if not raw_slug_decoded:
            skipped_malformed.append(source_url)
            continue

        slug = slugify(raw_slug_decoded)
        if not slug:
            skipped_malformed.append(source_url)
            continue

        md = page.get("markdown", "")
        title = clean_title(meta)
        if not title:
            title = raw_slug_decoded.replace("-", " ").strip().title()

        code_match = CODE_RE.search(md)
        product_id = code_match.group(1).upper() if code_match else slug.upper()

        category = extract_category(md)
        if not category and product_id.startswith("SUT"):
            category = "sutunlar"
        description, dimensions = extract_description_and_dims(md)
        image_urls = extract_image_urls(md, source_url)

        canonical_url = f"https://heykelsan.com/urunler/{slug}"

        record = {
            "id": product_id,
            "title": title,
            "slug": slug,
            "category": category,
            "description": description,
            "dimensions": dimensions,
            "price": None,
            "image_urls": image_urls,
            "url": canonical_url,
        }

        dedup_key = slug
        if dedup_key in products_by_key:
            existing = products_by_key[dedup_key]
            if len(image_urls) > len(existing["image_urls"]) or (
                len(description) > len(existing["description"])
            ):
                products_by_key[dedup_key] = record
        else:
            products_by_key[dedup_key] = record

    products = sorted(products_by_key.values(), key=lambda p: p["slug"])

    dup_ids = {}
    for p in products:
        dup_ids.setdefault(p["id"], []).append(p["slug"])
    dup_ids = {k: v for k, v in dup_ids.items() if len(v) > 1}

    with open("data/products.json", "w", encoding="utf-8") as f:
        json.dump(products, f, ensure_ascii=False, indent=2)

    print(f"Total product pages seen: {sum(1 for p in pages if '/urunler/' in (p.get('metadata', {}).get('sourceURL') or ''))}")
    print(f"Malformed/skipped: {len(skipped_malformed)}")
    for s in skipped_malformed:
        print("  skipped:", s)
    print(f"Unique products written: {len(products)}")
    missing_category = [p["id"] for p in products if not p["category"]]
    missing_dims = [p["id"] for p in products if not p["dimensions"]]
    missing_images = [p["id"] for p in products if not p["image_urls"]]
    print(f"Missing category: {len(missing_category)} -> {missing_category[:10]}")
    print(f"Missing dimensions: {len(missing_dims)}")
    print(f"Missing images: {len(missing_images)} -> {missing_images[:10]}")
    if dup_ids:
        print(f"Note: {len(dup_ids)} product code(s) shared by multiple distinct slugs (source data typo, not deduped since URLs differ):")
        for cid, slugs in dup_ids.items():
            print(f"  {cid}: {slugs}")


if __name__ == "__main__":
    main()
