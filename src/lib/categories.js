// Shared category matching used by Shop (filtering) and CategoryNav (hiding
// empty categories). Nav/footer/landing links use labels that don't always
// equal the product's stored category value (e.g. "Beauty" vs "Health &
// Beauty", or "Women"/"Men" which live at level_2), so we alias + match across
// all three category levels.

// Top-level storefront categories. `category` is the value routed to; `label`
// is the display text. Shared by the desktop nav and the mobile menu.
export const NAV_CATEGORIES = [
  { label: "Fashion", category: "Fashion" },
  { label: "Beauty", category: "Health & Beauty" },
  { label: "Home", category: "Home & Living" },
  { label: "Electronics", category: "Electronics & Tech" },
  { label: "Watches", category: "Watches" },
  { label: "Sports", category: "Sports & Outdoors" },
];

export const CATEGORY_ALIASES = {
  beauty: "health & beauty",
  health: "health & beauty",
  "health and beauty": "health & beauty",
  home: "home & living",
  homeware: "home & living",
  "home and living": "home & living",
  electronics: "electronics & tech",
  tech: "electronics & tech",
  "electronics and tech": "electronics & tech",
  watches: "watches & jewellery",
  jewellery: "watches & jewellery",
  jewelry: "watches & jewellery",
  sports: "sports & outdoors",
  outdoors: "sports & outdoors",
  womens: "women",
  mens: "men",
};

export const normCat = (s) => (s || "").toLowerCase().trim();

// True if the (aliased) label matches any of the product's level_1/2/3 values.
export function productMatchesCategories(product, selected) {
  const cats = product.categories || {};
  const levels = [cats.level_1, cats.level_2, cats.level_3]
    .map(normCat)
    .filter(Boolean);
  return selected.some((raw) => {
    const sel = normCat(raw);
    const alias = CATEGORY_ALIASES[sel] || sel;
    return levels.includes(sel) || levels.includes(alias);
  });
}

// Given the catalogue and a list of candidate category values, returns the Set
// of candidates that have at least one product in stock-listable inventory.
export function getAvailableCategories(products, candidates) {
  const available = new Set();
  candidates.forEach((cat) => {
    if (products.some((p) => productMatchesCategories(p, [cat]))) {
      available.add(cat);
    }
  });
  return available;
}
