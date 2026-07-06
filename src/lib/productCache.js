import axios from "axios";

// Shared, cached fetch of the public product catalogue. Autocomplete,
// related products, and quick-view all read from the same in-memory cache
// so we hit /products/public at most once per session (5 min TTL).

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const TTL_MS = 5 * 60 * 1000;

let cache = null; // { at: number, products: [] }
let inflight = null; // Promise dedupe for concurrent callers

export async function getAllProducts() {
  if (cache && Date.now() - cache.at < TTL_MS) {
    return cache.products;
  }
  if (inflight) return inflight;

  inflight = axios
    .get(`${API}/products/public`)
    .then((res) => {
      const products = (res.data || []).filter((p) => p.status === "PUBLISHED");
      cache = { at: Date.now(), products };
      return products;
    })
    .catch((err) => {
      console.error("productCache: failed to load products", err);
      return cache?.products || [];
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

// Lowest offer price across a product's variants (0 if none).
export function getProductPrice(product) {
  const prices = (product.variants || []).flatMap(
    (v) => (v.offers || []).map((o) => o.price) || []
  );
  return prices.length ? Math.min(...prices) : 0;
}

// First usable image for a product, with a safe placeholder fallback.
export function getProductImage(product) {
  return (
    product.images?.[0] ||
    product.media?.images?.[0] ||
    "https://placehold.co/400x400?text=No+Image"
  );
}

// The variant we should link to / add to cart by default.
export function getDefaultVariant(product) {
  return (
    product.variants?.find((v) => v.offers && v.offers.length > 0) ||
    product.variants?.[0] ||
    null
  );
}

export function getProductLink(product) {
  const v = getDefaultVariant(product);
  return v ? `/product/variant/${v.variant_id}` : `/product/${product.id}`;
}
