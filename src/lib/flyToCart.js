// Flies a small image clone from a source element to the cart icon in the
// header. Purely cosmetic — safe to call anywhere, no-ops if it can't find
// the pieces it needs or the user prefers reduced motion.

export function flyToCart(sourceEl, imageSrc) {
  try {
    if (
      typeof window === "undefined" ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const target = document.getElementById("cart-icon-target");
    if (!sourceEl || !target) return;

    const src = sourceEl.getBoundingClientRect();
    const dst = target.getBoundingClientRect();
    if (!src.width || !dst.width) return;

    const fly = document.createElement("img");
    fly.src = imageSrc || "https://placehold.co/80x80?text=%20";
    fly.setAttribute("aria-hidden", "true");
    Object.assign(fly.style, {
      position: "fixed",
      left: `${src.left + src.width / 2 - 32}px`,
      top: `${src.top + src.height / 2 - 32}px`,
      width: "64px",
      height: "64px",
      objectFit: "cover",
      borderRadius: "9999px",
      boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
      border: "2px solid #FF3CFE",
      zIndex: "9999",
      pointerEvents: "none",
      willChange: "transform, opacity",
    });
    document.body.appendChild(fly);

    const dx = dst.left + dst.width / 2 - (src.left + src.width / 2);
    const dy = dst.top + dst.height / 2 - (src.top + src.height / 2);

    const anim = fly.animate(
      [
        { transform: "translate(0,0) scale(1)", opacity: 1 },
        {
          transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 60}px) scale(0.9)`,
          opacity: 0.95,
          offset: 0.5,
        },
        {
          transform: `translate(${dx}px, ${dy}px) scale(0.15)`,
          opacity: 0.4,
        },
      ],
      { duration: 750, easing: "cubic-bezier(0.5, -0.2, 0.5, 1)" }
    );

    anim.onfinish = () => {
      fly.remove();
      // small pulse on the cart icon
      target.animate(
        [
          { transform: "scale(1)" },
          { transform: "scale(1.3)" },
          { transform: "scale(1)" },
        ],
        { duration: 300, easing: "ease-out" }
      );
    };
    anim.oncancel = () => fly.remove();
  } catch {
    // never let a cosmetic flourish break add-to-cart
  }
}
