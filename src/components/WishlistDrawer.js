import React, { useState, useEffect, useCallback, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { X, Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { flyToCart } from "../lib/flyToCart";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const readLocalWishlist = () => {
  try {
    return JSON.parse(localStorage.getItem("wishlist") || "[]");
  } catch {
    return [];
  }
};

// Slide-in wishlist drawer (mirrors CartDrawer). Opens on the `openWishlist`
// event; stays in sync via `wishlistUpdated`. Guests read localStorage,
// signed-in users read the backend.
export default function WishlistDrawer() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const closeBtnRef = useRef(null);
  const addRefs = useRef({});

  const refresh = useCallback(async () => {
    if (!user) {
      setItems(readLocalWishlist());
      return;
    }
    try {
      const res = await axios.get(`${API}/wishlist/${user.id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const products = res.data.products || [];
      setItems(
        products.map((p) => ({
          id: p.id,
          name: p.name,
          brand: p.brand,
          price: p.variants?.[0]?.price || 0,
          image: p.media?.images?.[0],
        }))
      );
    } catch (e) {
      console.error("WishlistDrawer: failed to load", e);
    }
  }, [user]);

  useEffect(() => {
    refresh();
    const onOpen = () => {
      refresh();
      setOpen(true);
    };
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("openWishlist", onOpen);
    window.addEventListener("wishlistUpdated", refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("openWishlist", onOpen);
      window.removeEventListener("wishlistUpdated", refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("keydown", onKey);
    };
  }, [refresh]);

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

  const removeItem = async (id) => {
    if (!user) {
      const next = readLocalWishlist().filter((it) => it.id !== id);
      localStorage.setItem("wishlist", JSON.stringify(next));
      setItems(next);
      window.dispatchEvent(new Event("wishlistUpdated"));
      toast.success("Removed from wishlist");
      return;
    }
    try {
      await axios.delete(`${API}/wishlist/${user.id}/remove/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setItems((prev) => prev.filter((it) => it.id !== id));
      window.dispatchEvent(new Event("wishlistUpdated"));
      toast.success("Removed from wishlist");
    } catch (e) {
      toast.error("Failed to remove item");
    }
  };

  const pushToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find(
      (it) => (it.variant_id ?? it.product_id ?? it.productId) === product.id
    );
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
    } else {
      cart.push({
        product_id: product.id,
        variant_id: product.id,
        product_name: product.name,
        product_image: product.image,
        brand: product.brand,
        price: product.price,
        quantity: 1,
        stock_qty: 999,
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const addToCart = (product) => {
    pushToCart(product);
    window.dispatchEvent(new Event("cartUpdated"));
    flyToCart(addRefs.current[product.id], product.image);
    toast.success("Added to cart");
    close();
    setTimeout(() => window.dispatchEvent(new Event("openCart")), 500);
  };

  const addAllToCart = () => {
    if (items.length === 0) return;
    items.forEach(pushToCart);
    window.dispatchEvent(new Event("cartUpdated"));
    toast.success(`Added ${items.length} item${items.length > 1 ? "s" : ""} to cart`);
    close();
    setTimeout(() => window.dispatchEvent(new Event("openCart")), 200);
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

      {/* Panel (slides in from the right) */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Wishlist"
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-gray-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out motion-reduce:transition-none ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 bg-white border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Heart className="h-5 w-5 text-[#FF3CFE]" fill="#FF3CFE" />
            Your Wishlist
            {items.length > 0 && (
              <span className="text-sm font-semibold text-gray-400">
                ({items.length})
              </span>
            )}
          </h2>
          <button
            ref={closeBtnRef}
            onClick={close}
            aria-label="Close wishlist"
            className="p-2 -mr-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-6 text-center">
            <div className="w-20 h-20 rounded-full bg-brand-50 flex items-center justify-center mb-5">
              <Heart className="h-9 w-9 text-[#FF3CFE]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              Your wishlist is empty
            </h3>
            <p className="text-gray-500 mb-6">
              Tap the heart on any product to save it here.
            </p>
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
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.map((it) => (
                <div key={it.id} className="flex gap-3 bg-white rounded-xl p-3 shadow-sm">
                  <button
                    type="button"
                    aria-label={`View ${it.name}`}
                    onClick={() => {
                      close();
                      navigate(`/product/${it.id}`);
                    }}
                    className="shrink-0"
                  >
                    <img
                      src={it.image || "https://placehold.co/100x100?text=No+Image"}
                      alt={it.name}
                      loading="lazy"
                      width="72"
                      height="72"
                      className="min-w-[72px] w-[72px] h-[72px] object-cover rounded-lg bg-gray-100"
                    />
                  </button>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        {it.brand && (
                          <p className="text-xs text-gray-400 truncate uppercase tracking-wide">
                            {it.brand}
                          </p>
                        )}
                        <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
                          {it.name}
                        </h3>
                      </div>
                      <button
                        onClick={() => removeItem(it.id)}
                        aria-label={`Remove ${it.name}`}
                        className="p-1 text-gray-300 hover:text-red-500 transition shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <p className="font-semibold text-brand-600">
                        ${(it.price || 0).toFixed(2)}
                      </p>
                      <Button
                        ref={(el) => (addRefs.current[it.id] = el)}
                        onClick={() => addToCart(it)}
                        size="sm"
                        className="bg-brand-600 hover:bg-brand-700 text-white h-8"
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-5 py-4 bg-white border-t border-gray-100 space-y-3">
              <Button
                onClick={addAllToCart}
                className="w-full bg-brand-600 hover:bg-brand-700 text-white h-11 text-base font-semibold"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add all to cart
              </Button>
              <button
                onClick={() => {
                  close();
                  navigate("/wishlist");
                }}
                className="w-full text-center text-sm text-gray-500 hover:text-brand-600 transition"
              >
                View full wishlist
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
