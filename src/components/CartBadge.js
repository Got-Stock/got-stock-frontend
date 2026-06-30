import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";

export default function CartBadge() {
  const [itemCount, setItemCount] = useState(0);

  useEffect(() => {
    updateCartCount();
    
    // Listen for storage changes (when cart is updated in other tabs/windows)
    window.addEventListener('storage', updateCartCount);
    
    // Custom event for same-tab updates
    window.addEventListener('cartUpdated', updateCartCount);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', updateCartCount);
    };
  }, []);

  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    setItemCount(count);
  };

  return (
    <Link to="/cart" className="relative p-1 hover:opacity-80 transition" title="Shopping Cart">
      <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" stroke="#FF3CFE" strokeWidth={1.5} />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#FF3CFE] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  );
}
