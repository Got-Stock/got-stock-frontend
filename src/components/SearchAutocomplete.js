import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Search, X } from "lucide-react";
import {
  getAllProducts,
  getProductImage,
  getProductPrice,
  getProductLink,
} from "../lib/productCache";

// Header search with live product suggestions. Filters the cached catalogue
// client-side (name / brand / category), debounced, with full keyboard support.
export default function SearchAutocomplete({ className = "" }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef(null);
  const debounceRef = useRef(null);

  // Warm the cache on first focus so the first keystroke is instant.
  const warm = useCallback(() => {
    getAllProducts();
  }, []);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const products = await getAllProducts();
      const q = query.trim().toLowerCase();
      const matches = products
        .filter(
          (p) =>
            p.name?.toLowerCase().includes(q) ||
            p.brand?.toLowerCase().includes(q) ||
            p.categories?.level_1?.toLowerCase().includes(q)
        )
        .slice(0, 6);
      setResults(matches);
      setLoading(false);
      setActive(-1);
    }, 180);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  // Close on outside click.
  useEffect(() => {
    const onClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const goToSearch = () => {
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
      setOpen(false);
      setQuery("");
    }
  };

  const goToProduct = (product) => {
    navigate(getProductLink(product));
    setOpen(false);
    setQuery("");
  };

  const onKeyDown = (e) => {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (active >= 0 && results[active]) goToProduct(results[active]);
      else goToSearch();
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={boxRef} className={`relative ${className}`}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          goToSearch();
        }}
      >
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
            }}
            onFocus={() => {
              warm();
              setOpen(true);
            }}
            onKeyDown={onKeyDown}
            placeholder="Search products..."
            aria-label="Search products"
            autoComplete="off"
            className="w-full px-3 py-2 pl-9 pr-8 bg-white text-gray-900 border border-gray-300 rounded-full focus:outline-none focus:border-[#FF3CFE] transition text-sm placeholder-gray-500"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setOpen(false);
              }}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-700"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </form>

      {open && query.trim() && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-[60] max-h-[70vh] overflow-y-auto">
          {loading && results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-500">Searching…</p>
          ) : results.length === 0 ? (
            <p className="px-4 py-3 text-sm text-gray-500">
              No matches for “{query.trim()}”
            </p>
          ) : (
            <ul>
              {results.map((p, i) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(i)}
                    onClick={() => goToProduct(p)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left transition ${
                      active === i ? "bg-brand-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <img
                      src={getProductImage(p)}
                      alt=""
                      loading="lazy"
                      className="h-11 w-11 rounded-md object-cover bg-gray-100 flex-shrink-0"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[11px] uppercase tracking-wide text-gray-400 truncate">
                        {p.brand}
                      </span>
                      <span className="block text-sm text-gray-900 truncate">
                        {p.name}
                      </span>
                    </span>
                    <span className="text-sm font-bold text-brand-600 flex-shrink-0">
                      ${getProductPrice(p).toFixed(2)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            onClick={goToSearch}
            className="w-full mt-1 border-t border-gray-100 px-4 py-2.5 text-sm font-semibold text-brand-600 hover:bg-brand-50 transition text-left"
          >
            See all results for “{query.trim()}” →
          </button>
        </div>
      )}
    </div>
  );
}
