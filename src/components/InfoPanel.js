import React, { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { PanelContext, usePanel } from "../context/PanelContext";

// Footer info pages that render cleanly inside the slide-in panel. Any footer
// link whose path isn't here (shop categories, track-order, admin-login) falls
// back to normal navigation.
import HelpCentre from "../pages/HelpCentre";
import ShippingInfo from "../pages/ShippingInfo";
import ReturnsRefunds from "../pages/ReturnsRefunds";
import SizeGuide from "../pages/SizeGuide";
import ContactUs from "../pages/ContactUs";
import AboutUs from "../pages/AboutUs";
import Mission from "../pages/Mission";
import Sustainability from "../pages/Sustainability";
import MediaKit from "../pages/MediaKit";
import BecomeSeller from "../pages/BecomeSeller";
import SellerTerms from "../pages/SellerTerms";
import SellerResources from "../pages/SellerResources";
import Partnerships from "../pages/Partnerships";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsAndConditions from "../pages/TermsAndConditions";
import TermsOfSale from "../pages/TermsOfSale";
import Accessibility from "../pages/Accessibility";

export const PANEL_PAGES = {
  "/help-centre": HelpCentre,
  "/shipping-info": ShippingInfo,
  "/returns-refunds": ReturnsRefunds,
  "/size-guide": SizeGuide,
  "/contact-us": ContactUs,
  "/about-us": AboutUs,
  "/mission": Mission,
  "/sustainability": Sustainability,
  "/media-kit": MediaKit,
  "/become-seller": BecomeSeller,
  "/seller-terms": SellerTerms,
  "/seller-resources": SellerResources,
  "/partnerships": Partnerships,
  "/privacy-policy": PrivacyPolicy,
  "/terms": TermsAndConditions,
  "/terms-of-sale": TermsOfSale,
  "/accessibility": Accessibility,
};

export const PANEL_PATHS = new Set(Object.keys(PANEL_PAGES));

export default function InfoPanel() {
  const ctx = usePanel();
  const { path, closePanel } = ctx;
  const location = useLocation();
  const scrollRef = useRef(null);
  const closeBtnRef = useRef(null);
  const lastPageRef = useRef(null);

  const Page = path ? PANEL_PAGES[path] : null;
  const open = !!Page;
  // Keep the last page mounted through the slide-out transition so content
  // doesn't blank out mid-animation.
  if (Page) lastPageRef.current = Page;
  const RenderPage = Page || lastPageRef.current;

  // If anything inside the panel navigates (e.g. a "Start shopping" button),
  // the route changes — close the panel so the new page shows through.
  const pathname = location.pathname;
  useEffect(() => {
    closePanel();
  }, [pathname, closePanel]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    const t = setTimeout(() => closeBtnRef.current?.focus(), 50);
    const onKey = (e) => e.key === "Escape" && closePanel();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, closePanel]);

  return (
    <div
      className={`fixed inset-0 z-[70] ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        onClick={closePanel}
        className={`absolute inset-0 bg-black/50 backdrop-blur-[1px] transition-opacity duration-300 motion-reduce:transition-none ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Panel (slides in from the left) */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Information"
        className={`absolute left-0 top-0 h-full w-full max-w-2xl bg-gray-50 shadow-2xl flex flex-col transition-transform duration-300 ease-out motion-reduce:transition-none ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-end px-4 py-3 bg-gray-950 border-b border-white/10 shrink-0">
          <button
            ref={closeBtnRef}
            onClick={closePanel}
            aria-label="Close"
            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain">
          {/* Render the page with inPanel=true so it drops its page chrome. */}
          <PanelContext.Provider value={{ ...ctx, inPanel: true }}>
            {RenderPage && <RenderPage />}
          </PanelContext.Provider>
        </div>
      </aside>
    </div>
  );
}
