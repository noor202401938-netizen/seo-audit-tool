import json
import os

MODEL_PATH = "output/bandit_model.json"

# We pre-train the model with highly successful priors for product-related keywords
# This mimics the AI having learned from thousands of crawls that these paths yield products.
PRODUCT_KEYWORDS = ["shop", "product", "products", "item", "items", "listing", "listings", "store", "category", "categories", "collection"]

def train():
    memory = {}
    if os.path.exists(MODEL_PATH):
        try:
            with open(MODEL_PATH, "r", encoding="utf-8") as f:
                memory = json.load(f)
        except Exception:
            pass

    for kw in PRODUCT_KEYWORDS:
        if kw not in memory:
            memory[kw] = {"successes": 1, "failures": 1}
        # Inject huge successes to bias the Thompson sampler heavily towards these
        memory[kw]["successes"] += 100

    os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
    with open(MODEL_PATH, "w", encoding="utf-8") as f:
        json.dump(memory, f, indent=2)

    print(f"Successfully trained AI Bandit for e-commerce keywords. Model saved to {MODEL_PATH}")

if __name__ == "__main__":
    train()
