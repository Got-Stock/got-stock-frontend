import React, { useState, useEffect } from "react";

export default function Banner() {
  const [showFirstText, setShowFirstText] = useState(false);
  const [showSecondText, setShowSecondText] = useState(false);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setShowFirstText(true);
      setShowSecondText(true);
      return;
    }

    const timers = [];
    let cancelled = false;

    const animationLoop = () => {
      if (cancelled) return;
      setShowFirstText(false);
      setShowSecondText(false);
      timers.push(setTimeout(() => setShowFirstText(true), 300));
      timers.push(setTimeout(() => setShowSecondText(true), 1500));
      timers.push(setTimeout(() => animationLoop(), 5000));
    };

    animationLoop();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="w-full bg-[#FF3CFE] h-12 sm:h-14 md:h-14 lg:h-16 relative overflow-hidden flex items-center">
      {/* Animated Text - Roboto bold weight, marginally increased word gap */}
      <div className="flex items-center gap-4 w-full max-w-7xl mx-auto" style={{ fontFamily: 'Roboto, sans-serif', paddingLeft: 'max(calc((100vw - 1280px) / 2 + 60px), 280px)' }}>
        {/* "Big Brands" - slides in from right, B aligns under Shop All */}
        <div 
          className={`text-black font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl transition-all duration-1000 ${
            showFirstText ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
          }`}
          style={{ letterSpacing: '0.2em', whiteSpace: 'nowrap' }}
        >
          Big Brands
        </div>
        
        {/* "For Your Budget." - fades in with marginally increased word spacing */}
        <div 
          className={`text-black font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl transition-all duration-1000 ${
            showSecondText ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ letterSpacing: '0.2em', whiteSpace: 'nowrap' }}
        >
          For Your Budget.
        </div>
      </div>
    </div>
  );
}
