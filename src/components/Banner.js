import React, { useState, useEffect } from "react";

export default function Banner() {
  // Single, gentle entrance — the text rises + fades in once and then stays put.
  // (The old version re-hid and re-slid both lines every 5s, which read as a flicker.)
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setShown(true);
      return;
    }

    const t = setTimeout(() => setShown(true), 150);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="w-full bg-[#FF3CFE] h-11 sm:h-14 lg:h-16 relative overflow-hidden flex items-center justify-center px-4">
      <div
        className={`flex items-baseline justify-center gap-x-2 sm:gap-x-3 whitespace-nowrap transition-all duration-700 ease-out ${
          shown ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
        style={{ fontFamily: "Roboto, sans-serif" }}
      >
        <span className="text-black font-extrabold text-sm sm:text-xl md:text-2xl lg:text-3xl tracking-[0.1em] sm:tracking-[0.2em]">
          Big Brands
        </span>
        <span className="text-black font-extrabold text-sm sm:text-xl md:text-2xl lg:text-3xl tracking-[0.1em] sm:tracking-[0.2em]">
          For Your Budget.
        </span>
      </div>
    </div>
  );
}
