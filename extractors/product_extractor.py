"""
extractors/product_extractor.py
Extracts basic product information (title, price, image, url) from HTML.
"""

from bs4 import BeautifulSoup
from utils.html_parser import make_soup
from urllib.parse import urljoin
import json

def extract_products(html: str, soup: BeautifulSoup = None, base_url: str = "") -> list:
    """Returns a list of dictionaries with product data."""
    found = []

    if soup is None:
        soup = make_soup(html)

    # Looking for Schema.org JSON-LD Products
    for script in soup.find_all("script", type="application/ld+json"):
        try:
            data = json.loads(script.string)
            if isinstance(data, dict):
                data = [data]
            for item in data:
                if item.get("@type") == "Product":
                    product = {
                        "name": item.get("name", ""),
                        "description": item.get("description", ""),
                        "price": "",
                        "url": item.get("url", base_url)
                    }
                    offers = item.get("offers", {})
                    if isinstance(offers, dict):
                        product["price"] = offers.get("price", "")
                    elif isinstance(offers, list) and offers:
                        product["price"] = offers[0].get("price", "")
                    
                    if product["name"]:
                        found.append(product)
        except Exception:
            pass

    # Fallback to common HTML elements if JSON-LD isn't found
    if not found:
        # Example generic fallback matching typical classes
        for container in soup.find_all(lambda tag: tag.name == "div" and tag.get("class") and any("product" in c.lower() or "item" in c.lower() for c in tag.get("class"))):
            name_tag = container.find(["h1", "h2", "h3"])
            price_tag = container.find(lambda t: t.name in ["span", "div", "p"] and t.get("class") and any("price" in c.lower() for c in t.get("class")))
            link_tag = container.find("a", href=True)
            
            if name_tag:
                name = name_tag.get_text(strip=True)
                price = price_tag.get_text(strip=True) if price_tag else ""
                link = urljoin(base_url, link_tag["href"]) if link_tag else base_url
                
                # Simple dedup based on name
                if name and not any(p["name"] == name for p in found):
                    found.append({
                        "name": name,
                        "price": price,
                        "description": "",
                        "url": link
                    })

    return found
