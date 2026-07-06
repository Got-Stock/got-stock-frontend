// Tracks recently viewed products in localStorage. We store a lightweight
// snapshot (id, name, brand, image, price, link) so the strip can render
// without another fetch. Most-recent first, capped at 12, de-duped by id.

const KEY = "recentlyViewed";
const MAX = 12;

export function getRecentlyViewed() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function pushRecentlyViewed(item) {
  if (!item || !item.id) return;
  try {
    const list = getRecentlyViewed().filter((p) => p.id !== item.id);
    list.unshift(item);
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
  } catch {
    // storage full / unavailable — non-critical
  }
}
