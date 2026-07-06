import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import Banner from "../components/Banner";
import CategoryNav from "../components/CategoryNav";
import Breadcrumbs from "../components/Breadcrumbs";
import Header from "../components/Header";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Cart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    setCartItems(cart);
  };

  const updateQuantity = (variantId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const cart = [...cartItems];
    const itemIndex = cart.findIndex(item => item.variant_id === variantId);
    
    if (itemIndex >= 0) {
      const maxStock = cart[itemIndex].stock_qty || 999;
      if (newQuantity > maxStock) {
        toast.error("Not enough stock available");
        return;
      }
      
      cart[itemIndex].quantity = newQuantity;
      setCartItems(cart);
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
    }
  };

  const removeItem = (variantId) => {
    const cart = cartItems.filter(item => item.variant_id !== variantId);
    setCartItems(cart);
    localStorage.setItem("cart", JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    toast.success("Item removed from cart");
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.setItem("cart", JSON.stringify([]));
    window.dispatchEvent(new Event('cartUpdated'));
    toast.success("Cart cleared");
  };

  const getSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 0)), 0);
  };

  const getShipping = () => {
    const subtotal = getSubtotal();
    // Free shipping over $50, otherwise $5 base + $1 per item
    if (subtotal >= 50) return 0;
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    return 5 + itemCount;
  };

  const getTotal = () => {
    return getSubtotal() + getShipping();
  };

  const proceedToCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <Header />

        {/* Sticky Category Navigation with Search */}
        <CategoryNav />

        <div className="container mx-auto px-4 py-16">
          {/* Breadcrumbs */}
          <Breadcrumbs 
            items={[
              { label: "Shop", href: "/shop" },
              { label: "Shopping Cart" }
            ]} 
          />
          
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-24 h-24 bg-gradient-to-b from-[#FF3CFE] to-black rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some products to get started!</p>
            <Button
              onClick={() => navigate("/shop")}
              className="bg-gradient-to-b from-[#FF3CFE] to-black hover:opacity-90 text-white"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Sticky Category Navigation with Search */}
      <CategoryNav />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: "Shop", href: "/shop" },
            { label: "Shopping Cart" }
          ]} 
        />
        
        <Button
          variant="ghost"
          onClick={() => navigate(-1, { state: { preserveScroll: true } })}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Continue Shopping
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Shopping Cart</h2>
                <Button variant="ghost" size="sm" onClick={clearCart}>
                  Clear Cart
                </Button>
              </div>

              <div className="space-y-4">
                {cartItems.map(item => (
                  <div key={item.variant_id} className="flex gap-4 pb-4 border-b">
                    <img
                      src={item.product_image || "https://placehold.co/100x100?text=No+Image"}
                      alt={item.product_name}
                      loading="lazy"
                      width="100"
                      height="100"
                      className="w-24 h-24 object-cover rounded"
                    />
                    
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 mb-1">{item.product_name || 'Product'}</h3>
                      <p className="text-sm text-gray-500 mb-2">{item.brand || ''}</p>
                      <div className="flex gap-4 text-sm text-gray-600">
                        {item.colour && <span>Color: {item.colour}</span>}
                        {item.size && <span>Size: {item.size}</span>}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <p className="text-lg font-semibold text-[#FF3CFE]">
                        ${(item.price || 0).toFixed(2)}
                      </p>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.variant_id, (item.quantity || 1) - 1)}
                          disabled={(item.quantity || 1) <= 1}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity || 1}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.variant_id, (item.quantity || 1) + 1)}
                          disabled={(item.quantity || 1) >= (item.stock_qty || 999)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.variant_id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>${getSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>{getShipping() === 0 ? "FREE" : `$${getShipping().toFixed(2)}`}</span>
                </div>
                {getSubtotal() < 50 && getSubtotal() > 0 && (
                  <p className="text-xs text-gray-500">
                    Add ${(50 - getSubtotal()).toFixed(2)} more for free shipping!
                  </p>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>${getTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={proceedToCheckout}
                className="w-full bg-gradient-to-b from-[#FF3CFE] to-black hover:opacity-90 text-white"
                disabled={loading}
              >
                {loading ? "Processing..." : "Proceed to Checkout"}
              </Button>

              <div className="mt-6 space-y-2 text-xs text-gray-500">
                <p>✓ Secure checkout</p>
                <p>✓ Free returns within 30 days</p>
                <p>✓ Customer support available 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
