import React from "react";
import { Link } from "react-router-dom";

/**
 * Shared brand mark. Single source of truth for the Got-Stock logo
 * across header, auth pages, and any future branding surfaces.
 *
 * To swap the logo: replace /public/got-stock-mark.png (a square, transparent
 * circular mark) and /public/favicon.ico for the browser tab icon. No code changes required.
 */
const LOGO_SRC = "/got-stock-mark.png";

const SIZE_CLASSES = {
  sm: "h-8 md:h-10",
  md: "h-12 md:h-16",
  lg: "h-16 sm:h-20 md:h-24",
  hero: "h-24 sm:h-28 md:h-32",
  header: "h-16 sm:h-20 md:h-28 lg:h-36",
};

export default function Logo({
  to = "/",
  size = "md",
  priority = false,
  className = "",
  imgClassName = "",
  ariaLabel = "Got-Stock home",
}) {
  const sizeClass = SIZE_CLASSES[size] || SIZE_CLASSES.md;

  const img = (
    <img
      src={LOGO_SRC}
      alt="Got-Stock"
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      width="512"
      height="512"
      className={`${sizeClass} w-auto object-contain ${imgClassName}`}
    />
  );

  if (!to) {
    return <span className={`inline-block ${className}`}>{img}</span>;
  }

  return (
    <Link
      to={to}
      aria-label={ariaLabel}
      className={`inline-block hover:opacity-90 transition ${className}`}
    >
      {img}
    </Link>
  );
}
