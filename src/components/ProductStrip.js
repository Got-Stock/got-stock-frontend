import React from "react";
import { Link } from "react-router-dom";

// Horizontal scrollable row of compact product cards. Takes already-normalized
// items ({ id, name, brand, image, price, link }) so it can render both related
// products and recently-viewed snapshots without extra fetching.
export default function ProductStrip({ title, items }) {
  if (!items || items.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-xl font-bold text-gray-900 mb-4">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-3 -mx-1 px-1 snap-x">
        {items.map((p) => (
          <Link
            key={p.id}
            to={p.link}
            className="group flex-shrink-0 w-40 sm:w-48 snap-start bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition overflow-hidden"
          >
            <div className="aspect-square bg-gray-100 overflow-hidden">
              <img
                src={p.image}
                alt={p.name}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                onError={(e) => {
                  if (e.target.src.indexOf("placehold") === -1)
                    e.target.src = "https://placehold.co/300x300?text=No+Image";
                }}
              />
            </div>
            <div className="p-3">
              <p className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold truncate">
                {p.brand}
              </p>
              <h3 className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[2.5rem]">
                {p.name}
              </h3>
              <p className="text-sm font-bold text-brand-600 mt-1">
                ${Number(p.price || 0).toFixed(2)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
