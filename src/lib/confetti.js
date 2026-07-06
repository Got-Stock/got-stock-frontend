// Tiny dependency-free confetti burst. Draws to a throwaway full-screen
// canvas and cleans itself up. Respects prefers-reduced-motion.

const COLORS = ["#FF3CFE", "#FB50FE", "#F77DFF", "#FACC15", "#34D399", "#60A5FA"];

export function fireConfetti({ particleCount = 140, duration = 2600 } = {}) {
  if (
    typeof window === "undefined" ||
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
  ) {
    return;
  }

  const canvas = document.createElement("canvas");
  Object.assign(canvas.style, {
    position: "fixed",
    inset: "0",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: "9998",
  });
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const resize = () => {
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize();

  const W = window.innerWidth;
  const H = window.innerHeight;

  // Two launch points (bottom-left and bottom-right) angled inward.
  const particles = Array.from({ length: particleCount }).map((_, i) => {
    const fromLeft = i % 2 === 0;
    const angle = (fromLeft ? -60 : -120) + (Math.random() * 40 - 20);
    const speed = 8 + Math.random() * 8;
    const rad = (angle * Math.PI) / 180;
    return {
      x: fromLeft ? W * 0.15 : W * 0.85,
      y: H * 0.6,
      vx: Math.cos(rad) * speed,
      vy: Math.sin(rad) * speed,
      size: 5 + Math.random() * 6,
      color: COLORS[(Math.random() * COLORS.length) | 0],
      rot: Math.random() * Math.PI,
      vrot: (Math.random() - 0.5) * 0.3,
      shape: Math.random() > 0.5 ? "rect" : "circle",
    };
  });

  const gravity = 0.28;
  const drag = 0.995;
  const start = performance.now();
  let raf;

  const frame = (now) => {
    const elapsed = now - start;
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p) => {
      p.vy += gravity;
      p.vx *= drag;
      p.vy *= drag;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vrot;

      const fade = Math.max(0, 1 - elapsed / duration);
      ctx.save();
      ctx.globalAlpha = fade;
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.shape === "rect") {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });

    if (elapsed < duration) {
      raf = requestAnimationFrame(frame);
    } else {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.remove();
    }
  };

  window.addEventListener("resize", resize);
  raf = requestAnimationFrame(frame);
}
