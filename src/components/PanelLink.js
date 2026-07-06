import React from "react";
import { Link } from "react-router-dom";
import { usePanel } from "../context/PanelContext";
import { PANEL_PATHS } from "./InfoPanel";

// A footer link that opens its target inside the slide-in InfoPanel when the
// path is panel-eligible. Falls back to a normal <Link> for everything else,
// and always defers to modifier/middle clicks so "open in new tab" still works.
export default function PanelLink({ to, className, children, ...rest }) {
  const { openPanel } = usePanel();

  const handleClick = (e) => {
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }
    if (PANEL_PATHS.has(to)) {
      e.preventDefault();
      openPanel(to);
    }
  };

  return (
    <Link to={to} className={className} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}
