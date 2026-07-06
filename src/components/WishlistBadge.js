import React, { useState, useEffect, useContext } from "react";
import { Heart } from "lucide-react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Heart icon in the header. Opens the WishlistDrawer and shows a live count.
// Guests read localStorage; signed-in users read the backend.
export default function WishlistBadge() {
  const { user } = useContext(AuthContext);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = async () => {
      if (!user) {
        try {
          setCount(JSON.parse(localStorage.getItem("wishlist") || "[]").length);
        } catch {
          setCount(0);
        }
        return;
      }
      try {
        const res = await axios.get(`${API}/wishlist/${user.id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setCount((res.data.products || res.data.items || []).length);
      } catch {
        /* silently ignore — badge just stays put */
      }
    };
    update();
    window.addEventListener("storage", update);
    window.addEventListener("wishlistUpdated", update);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("wishlistUpdated", update);
    };
  }, [user]);

  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("openWishlist"))}
      className="relative p-1 hover:opacity-80 transition"
      title="Wishlist"
      aria-label="Open wishlist"
    >
      <Heart className="h-5 w-5 md:h-6 md:w-6" stroke="#FF3CFE" fill="none" strokeWidth={1.5} />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 bg-[#FF3CFE] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
