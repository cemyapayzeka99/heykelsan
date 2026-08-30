import json
import os
import re
import time
import urllib.request
import urllib.error
from urllib.parse import urlparse, unquote

PRODUCTS_PATH = "data/products.json"
OUT_DIR = "public/images/products"

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    ),
    "Referer": "https://heykelsan.com/",
}


def ext_from_url(url):
    path = urlparse(url).path
    ext = os.path.splitext(unquote(path))[1].lower()
    ext = re.sub(r"[^a-z0-9.]", "", ext)
    if not ext or len(ext) > 5:
        ext = ".jpg"
    return ext


def download(url, dest_path, retries=3):
    req = urllib.request.Request(url, headers=HEADERS)
    for attempt in range(1, retries + 1):
        try:
            with urllib.request.urlopen(req, timeout=20) as resp:
                content = resp.read()
                content_type = resp.headers.get("Content-Type", "")
                if "image" not in content_type and not content.startswith(b"\xff\xd8") and not content.startswith(b"\x89PNG"):
                    raise ValueError(f"non-image response ({content_type})")
                with open(dest_path, "wb") as f:
                    f.write(content)
                return True, None
        except Exception as e:
            if attempt == retries:
                return False, str(e)
            time.sleep(1)
    return False, "unknown"


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    with open(PRODUCTS_PATH, encoding="utf-8") as f:
        products = json.load(f)

    failures = []
    downloaded = 0

    for p in products:
        new_urls = []
        for i, url in enumerate(p["image_urls"], start=1):
            ext = ext_from_url(url)
            filename = f"{p['slug']}-{i}{ext}"
            dest_path = os.path.join(OUT_DIR, filename)
            local_ref = f"/images/products/{filename}"

            ok, err = download(url, dest_path)
            if ok:
                downloaded += 1
                new_urls.append(local_ref)
            else:
                failures.append((p["id"], url, err))
                new_urls.append(url)

        p["image_urls"] = new_urls

    with open(PRODUCTS_PATH, "w", encoding="utf-8") as f:
        json.dump(products, f, ensure_ascii=False, indent=2)

    print(f"Downloaded: {downloaded}")
    print(f"Failures: {len(failures)}")
    for pid, url, err in failures:
        print(f"  {pid}: {url} -> {err}")


if __name__ == "__main__":
    main()
