import json
import os
import yaml

PAGES = {
    "hakkimizda": "https://heykelsan.com/hakkimizda.html",
    "iletisim": "https://heykelsan.com/iletisim.html",
    "blog": "https://heykelsan.com/blog.html",
    "katalog": "https://heykelsan.com/katalog.html",
}

OUT_DIR = "data/pages"


def main():
    with open("heykelsan-data/crawl.json", encoding="utf-8") as f:
        data = json.load(f)
    pages = data["data"]

    by_url = {}
    for p in pages:
        url = p.get("metadata", {}).get("sourceURL") or ""
        by_url[url] = p

    os.makedirs(OUT_DIR, exist_ok=True)

    for slug, url in PAGES.items():
        page = by_url.get(url)
        if not page:
            print(f"MISSING: {slug} ({url})")
            continue

        meta = page.get("metadata", {})
        header = {
            "title": meta.get("title"),
            "description": meta.get("description") or meta.get("ogDescription"),
            "url": meta.get("sourceURL") or meta.get("url"),
            "language": meta.get("language"),
            "statusCode": meta.get("statusCode"),
        }

        frontmatter = yaml.safe_dump(header, allow_unicode=True, sort_keys=False).strip()
        content = f"---\n{frontmatter}\n---\n\n{page.get('markdown', '')}"

        out_path = os.path.join(OUT_DIR, f"{slug}.md")
        with open(out_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"wrote {out_path}")


if __name__ == "__main__":
    main()
