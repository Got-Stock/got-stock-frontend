import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import WishlistButton from "./WishlistButton";
import { flyToCart } from "../lib/flyToCart";
import { getProductImage } from "../lib/productCache";

// Lightweight product preview shown in a modal from the Shop grid — image,
// price, colour options and add-to-cart, without leaving the listing page.
export default function QuickViewModal({ product, open, onOpenChange }) {
  const navigate = useNavigate();
  const [variant, setVariant] = useState(null);
  const addBtnRef = useRef(null);

  const variants = product?.variants || [];

  useEffect(() => {
    if (!product) return;
    const withStock =
      variants.find((v) => v.offers?.some((o) => o.stock_qty > 0)) ||
      variants[0] ||
      null;
    setVariant(withStock);
  }, [product]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!product) return null;

  const image = getProductImage(product);
  const offer = variant?.offers?.[0];
  const price = offer?.price || 0;
  const stock = offer?.stock_qty || 0;
  const colours = [
    ...new Set(
      variants.map((v) => v.variant_attributes?.primary_colour).filter(Boolean)
    ),
  ];

  const addToCart = () => {
    if (!variant || !offer) {
      toast.error("This product is not available");
      return;
    }
    if (stock < 1) {
      toast.error("Out of stock");
      return;
    }
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const idx = cart.findIndex((i) => i.variant_id === variant.variant_id);
    if (idx >= 0) {
      cart[idx].quantity += 1;
    } else {
      cart.push({
        product_id: product.id,
        product_name: product.name,
        product_image: image,
        brand: product.brand,
        variant_id: variant.variant_id,
        size: variant.variant_attributes?.pack_size || "",
        colour: variant.variant_attributes?.primary_colour || "",
        price: offer.price,
        quantity: 1,
        stock_qty: stock,
      });
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    flyToCart(addBtnRef.current, image);
    toast.success("Added to cart!");
    onOpenChange(false);
    // open drawer just after the fly animation reaches the cart
    setTimeout(() => window.dispatchEvent(new Event("openCart")), 650);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <div className="grid sm:grid-cols-2">
          <div className="aspect-square bg-gray-100">
            <img
              src={image}
              alt={product.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                if (e.target.src.indexOf("placehold") === -1)
                  e.target.src = "https://placehold.co/600x600?text=No+Image";
              }}
            />
          </div>

          <div className="p-6 flex flex-col">
            <DialogHeader className="text-left space-y-1">
              <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                {product.brand}
              </p>
              <DialogTitle className="text-xl font-bold text-gray-900 leading-snug">
                {product.name}
              </DialogTitle>
            </DialogHeader>

            <div className="flex items-center gap-3 mt-3">
              <p className="text-2xl font-bold text-brand-600">
                ${price.toFixed(2)}
              </p>
              {stock > 0 ? (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  In Stock
                </Badge>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>

            {product.description && (
              <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                {product.description}
              </p>
            )}

            {colours.length > 1 && (
              <div className="mt-4">
                <p className="text-sm font-medium mb-2">Colour</p>
                <div className="flex gap-2 flex-wrap">
                  {colours.map((c) => {
                    const match = variants.find(
                      (v) => v.variant_attributes?.primary_colour === c
                    );
                    const selected =
                      variant?.variant_attributes?.primary_colour === c;
                    return (
                      <button
                        key={c}
                        onClick={() => match && setVariant(match)}
                        className={`px-3 py-1.5 rounded-lg border-2 text-sm transition ${
                          selected
                            ? "border-brand-600 bg-brand-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-auto pt-6">
              <Button
                ref={addBtnRef}
                onClick={addToCart}
                disabled={stock < 1}
                className="flex-1 bg-brand-600 hover:bg-brand-700"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Add to Cart
              </Button>
              <div className="border border-gray-200 rounded-md flex items-center justify-center w-12 hover:bg-gray-50 transition">
                <WishlistButton product={product} />
              </div>
            </div>

            <button
              onClick={() => {
                onOpenChange(false);
                navigate(
                  variant
                    ? `/product/variant/${variant.variant_id}`
                    : `/product/${product.id}`
                );
              }}
              className="mt-3 text-sm font-semibold text-brand-600 hover:underline"
            >
              View full details →
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
