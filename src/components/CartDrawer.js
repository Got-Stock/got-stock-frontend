import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Truck } from "lucide-react";
import { Button } from "./ui/button";

// Storefront charges free shipping over this amount (matches Cart.js getShipping()).
const FREE_SHIP_THRESHOLD = 50;

// Cart items come from two call sites with slightly different shapes
// (ProductDetail uses variant_id/product_name/product_image; the legacy
// Wishlist path used productId/name/image). Normalise defensively so the
// drawer renders either one.
const keyOf = (it) =>
  it.variant_id ?? it.product_id ?? it.productId ?? it.id;
const nameOf = (it) => it.product_name || it.name || "Product";
const imageOf = (it) =>
  it.product_image || it.image || "https://placehold.co/100x100?text=No+Image";

const readCart = () => {
  try {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  } catch {
    return [];
  }
};

export default function CartDrawer() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const closeBtnRef = useRef(null);

  const refresh = useCallback(() => setItems(readCart()), []);

  const writeCart = useCallback((next) => {
    localStorage.setItem("cart", JSON.stringify(next));
    setItems(next);
    window.dispatchEvent(new Event("cartUpdated"));
  }, []);

  useEffect(() => {
    refresh();
    const onOpen = () => {
      refresh();
      setOpen(true);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("openCart", onOpen);
    window.addEventListener("cartUpdated", refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("openCart", onOpen);
      window.removeEventListener("cartUpdated", refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("keydown", onKey);
    };
  }, [refresh]);

  // Lock body scroll + move focus to close button while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => closeBtnRef.current?.focus(), 50);
    return () => {
      document.body.style.overflow = prev;
      clearTimeout(t);
    };
  }, [open]);

  const close = () => setOpen(false);

  const updateQty = (key, nextQty) => {
    if (nextQty < 1) return;
    const next = items.map((it) => {
      if (keyOf(it) !== key) return it;
      const max = it.stock_qty || 999;
      return { ...it, quantity: Math.min(nextQty, max) };
    });
    writeCart(next);
  };

  const removeItem = (key) => writeCart(items.filter((it) => keyOf(it) !== key));

  const subtotal = items.reduce(
    (sum, it) => sum + (it.price || 0) * (it.quantity || 0),
    0
  );
  const count = items.reduce((sum, it) => sum + (it.quantity || 0), 0);
  const remaining = Math.max(0, FREE_SHIP_THRESHOLD - subtotal);
  const pct = Math.min(100, (subtotal / FREE_SHIP_THRESHOLD) * 100);
  const freeUnlocked = subtotal >= FREE_SHIP_THRESHOLD;

  const goCheckout = () => {
    close();
    navigate("/checkout");
  };
  const goCart = () => {
    close();
    navigate("/cart");
  };

  return (
    <div
      className={`fixed inset-0 z-[70] ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        onClick={close}
        className={`absolute inset-0 bg-black/50 backdrop-blur-[1px] transition-opacity duration-300 motion-reduce:transition-none ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-gray-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out motion-reduce:transition-none ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-brand-500" />
            Your Cart
            {count > 0 && (
              <span className="text-sm font-semibold text-gray-400">({count})</span>
            )}
          </h2>
          <button
            ref={closeBtnRef}
            onClick={close}
            aria-label="Close cart"
            className="p-2 -mr-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <div className="w-20 h-20 rounded-full bg-brand-50 flex items-center justify-center mb-5">
              <ShoppingBag className="h-9 w-9 text-brand-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Your cart is empty</h3>
            <p className="text-gray-500 mb-6">Add something you love to get started.</p>
            <Button
              onClick={() => {
                close();
                navigate("/shop");
              }}
              className="bg-brand-600 hover:bg-brand-700 text-white"
            >
              Start shopping
            </Button>
          </div>
        ) : (
          <>
            {/* Free-shipping progress */}
            <div className="px-5 pt-4 pb-3 bg-white border-b border-gray-100">
              <div className="flex items-center gap-2 text-sm mb-2">
                <Truck className={`h-4 w-4 ${freeUnlocked ? "text-emerald-500" : "text-brand-500"}`} />
                {freeUnlocked ? (
                  <span className="font-medium text-emerald-600">
                    You've unlocked <strong>FREE shipping</strong> 🎉
                  </span>
                ) : (
                  <span className="text-gray-600">
                    You're{" "}
                    <strong className="text-gray-900">${remaining.toFixed(2)}</strong>{" "}
                    away from <strong>free shipping</strong>
                  </span>
                )}
              </div>
              <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 motion-reduce:transition-none ${
                    freeUnlocked ? "bg-emerald-500" : "bg-brand-500"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.map((it) => {
                const key = keyOf(it);
                const qty = it.quantity || 1;
                const max = it.stock_qty || 999;
                return (
                  <div key={key} className="flex gap-3 bg-white rounded-xl p-3 shadow-sm">
                    <img
                      src={imageOf(it)}
                      alt={nameOf(it)}
                      loading="lazy"
                      width="72"
                      height="72"
                      className="min-w-[72px] w-[72px] h-[72px] object-cover rounded-lg bg-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <h3 className="font-medium text-gray-900 text-sm truncate">
                            {nameOf(it)}
                          </h3>
                          {it.brand && (
                            <p className="text-xs text-gray-400 truncate">{it.brand}</p>
                          )}
                          <div className="flex gap-2 mt-0.5 text-xs text-gray-500">
                            {it.colour && <span>{it.colour}</span>}
                            {it.colour && it.size && <span>·</span>}
                            {it.size && <span>{it.size}</span>}
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(key)}
                          aria-label={`Remove ${nameOf(it)}`}
                          className="p-1 text-gray-300 hover:text-red-500 transition shrink-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Qty stepper */}
                        <div className="flex items-center rounded-full border border-gray-200">
                          <button
                            onClick={() => updateQty(key, qty - 1)}
                            disabled={qty <= 1}
                            aria-label="Decrease quantity"
                            className="p-1.5 text-gray-600 hover:text-brand-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-7 text-center text-sm font-medium text-gray-900">
                            {qty}
                          </span>
                          <button
                            onClick={() => updateQty(key, qty + 1)}
                            disabled={qty >= max}
                            aria-label="Increase quantity"
                            className="p-1.5 text-gray-600 hover:text-brand-600 disabled:opacity-30 disabled:cursor-not-allowed transition"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <p className="font-semibold text-gray-900">
                          ${((it.price || 0) * qty).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer / summary */}
            <div className="px-5 py-4 bg-white border-t border-gray-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-lg font-bold text-gray-900">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-gray-400 -mt-1">
                Shipping &amp; taxes calculated at checkout.
              </p>
              <Button
                onClick={goCheckout}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white h-11 text-base font-semibold group"
              >
                Checkout
                <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-0.5" />
              </Button>
              <button
                onClick={goCart}
                className="w-full text-center text-sm text-gray-500 hover:text-brand-600 transition"
              >
                View full cart
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
