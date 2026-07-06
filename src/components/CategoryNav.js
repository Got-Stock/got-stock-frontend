import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import SearchAutocomplete from "./SearchAutocomplete";
import { getAllProducts } from "../lib/productCache";
import { getAvailableCategories, NAV_CATEGORIES } from "../lib/categories";

// Mega Menu structure with multiple columns
const MEGA_MENU = {
  "Fashion": {
    columns: [
      {
        title: "All Fashion",
        links: [
          "Women's Clothing",
          "Men's Clothing",
          "Kids' Fashion",
          "Shoes & Footwear",
          "Activewear",
          "Swimwear",
          "Loungewear"
        ]
      },
      {
        title: "Accessories",
        links: [
          "Bags & Luggage",
          "Jewelry",
          "Watches",
          "Belts",
          "Hats & Caps",
          "Scarves",
          "Sunglasses"
        ]
      },
      {
        title: "Shop By Style",
        links: [
          "Casual",
          "Formal",
          "Streetwear",
          "Vintage",
          "Bohemian",
          "Minimalist",
          "Luxury"
        ]
      },
      {
        title: "Featured Brands",
        links: [
          "Premium Brands",
          "Designer Collection",
          "Sustainable Fashion",
          "Local Brands",
          "New Arrivals"
        ]
      }
    ]
  },
  "Health & Beauty": {
    columns: [
      {
        title: "All Beauty",
        links: [
          "Skincare",
          "Makeup",
          "Haircare",
          "Body Care",
          "Nail Care",
          "Oral Care",
          "Sun Care"
        ]
      },
      {
        title: "Fragrance",
        links: [
          "Perfume",
          "Cologne",
          "Body Mist",
          "Essential Oils",
          "Candles",
          "Diffusers"
        ]
      },
      {
        title: "Tools & Accessories",
        links: [
          "Makeup Tools",
          "Hair Tools",
          "Beauty Devices",
          "Skincare Tools",
          "Nail Tools"
        ]
      },
      {
        title: "Shop By Brand",
        links: [
          "Luxury Brands",
          "Natural & Organic",
          "Dermatologist-Tested",
          "Cruelty-Free",
          "Best Sellers"
        ]
      }
    ]
  },
  "Home & Living": {
    columns: [
      {
        title: "Furniture",
        links: [
          "Living Room",
          "Bedroom",
          "Dining Room",
          "Office",
          "Outdoor",
          "Storage"
        ]
      },
      {
        title: "Home Decor",
        links: [
          "Wall Art",
          "Mirrors",
          "Vases",
          "Cushions",
          "Rugs",
          "Lighting",
          "Candles"
        ]
      },
      {
        title: "Kitchen & Dining",
        links: [
          "Cookware",
          "Bakeware",
          "Dinnerware",
          "Glassware",
          "Cutlery",
          "Kitchen Tools",
          "Storage"
        ]
      },
      {
        title: "Bedding & Bath",
        links: [
          "Bed Sheets",
          "Duvet Covers",
          "Pillows",
          "Towels",
          "Bath Mats",
          "Shower Curtains"
        ]
      }
    ]
  },
  "Electronics & Tech": {
    columns: [
      {
        title: "Computers",
        links: [
          "Laptops",
          "Desktops",
          "Tablets",
          "Monitors",
          "Keyboards",
          "Mice",
          "Accessories"
        ]
      },
      {
        title: "Mobile & Audio",
        links: [
          "Smartphones",
          "Headphones",
          "Earbuds",
          "Speakers",
          "Phone Cases",
          "Chargers"
        ]
      },
      {
        title: "Smart Home",
        links: [
          "Smart Speakers",
          "Security Cameras",
          "Smart Lights",
          "Thermostats",
          "Smart Plugs",
          "Doorbells"
        ]
      },
      {
        title: "Photography & Gaming",
        links: [
          "Cameras",
          "Lenses",
          "Gaming Consoles",
          "Controllers",
          "Gaming PCs",
          "VR Headsets"
        ]
      }
    ]
  },
  "Watches": {
    columns: [
      {
        title: "All Watches",
        links: [
          "Luxury Watches",
          "Sport Watches",
          "Smart Watches",
          "Fashion Watches",
          "Dress Watches",
          "Dive Watches"
        ]
      },
      {
        title: "By Brand",
        links: [
          "Designer Brands",
          "Swiss Made",
          "Japanese Watches",
          "Smart Watch Brands",
          "Fashion Brands"
        ]
      },
      {
        title: "By Feature",
        links: [
          "Chronograph",
          "Automatic",
          "Solar Powered",
          "Water Resistant",
          "GPS Enabled"
        ]
      },
      {
        title: "Accessories",
        links: [
          "Watch Straps",
          "Watch Boxes",
          "Watch Tools",
          "Watch Winders",
          "Replacement Parts"
        ]
      }
    ]
  },
  "Sports & Outdoors": {
    columns: [
      {
        title: "Sports Equipment",
        links: [
          "Fitness Equipment",
          "Yoga & Pilates",
          "Weights",
          "Cardio Machines",
          "Team Sports",
          "Racquet Sports"
        ]
      },
      {
        title: "Outdoor Gear",
        links: [
          "Camping",
          "Hiking",
          "Climbing",
          "Cycling",
          "Water Sports",
          "Winter Sports"
        ]
      },
      {
        title: "Sports Apparel",
        links: [
          "Activewear",
          "Sports Shoes",
          "Running Gear",
          "Gym Wear",
          "Outdoor Clothing",
          "Sports Accessories"
        ]
      },
      {
        title: "Shop By Activity",
        links: [
          "Running",
          "Swimming",
          "Cycling",
          "Yoga",
          "CrossFit",
          "Adventure Sports"
        ]
      }
    ]
  }
};

export default function CategoryNav() {
  const navigate = useNavigate();
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [availableCategories, setAvailableCategories] = useState(null); // null until loaded
  const hideTimeout = useRef(null);

  // Hide top-level categories that currently have no products in stock.
  useEffect(() => {
    let cancelled = false;
    getAllProducts().then((products) => {
      if (cancelled) return;
      setAvailableCategories(
        getAvailableCategories(products, NAV_CATEGORIES.map((c) => c.category))
      );
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Until the catalogue loads, show all so the nav isn't empty on first paint.
  const visibleCategories = availableCategories
    ? NAV_CATEGORIES.filter((c) => availableCategories.has(c.category))
    : NAV_CATEGORIES;

  const handleMouseEnter = (category) => {
    // Clear any pending hide timeout
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
    }
    setHoveredCategory(category);
  };

  const handleMouseLeave = () => {
    // Delay hiding the menu by 300ms to allow mouse to reach dropdown
    hideTimeout.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 300);
  };

  const handleCategoryClick = (category) => {
    if (category === "All") {
      navigate("/shop");
    } else {
      navigate(`/category/${encodeURIComponent(category)}`);
    }
  };

  const handleSubcategoryClick = (category, subcategory) => {
    navigate(`/shop?category=${encodeURIComponent(category)}&subcategory=${encodeURIComponent(subcategory)}`);
  };

  const renderMegaMenu = (categoryName) => {
    const menu = MEGA_MENU[categoryName];
    if (!menu) return null;

    return (
      <div
        className="w-full max-w-5xl mx-auto bg-gradient-to-b from-[#FF3CFE] to-black border border-gray-300 rounded-lg shadow-2xl py-8 px-6"
        onMouseEnter={() => handleMouseEnter(categoryName)}
        onMouseLeave={handleMouseLeave}
      >
        <div className="grid grid-cols-4 gap-8">
          {menu.columns.map((column, idx) => (
            <div key={idx}>
              <h3 className="text-base font-bold text-white uppercase tracking-wide mb-4 border-b border-white/30 pb-2">
                {column.title}
              </h3>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link}>
                    <button
                      onClick={() => {
                        handleSubcategoryClick(categoryName, link);
                        setHoveredCategory(null);
                      }}
                      className="text-base text-white hover:text-brand-200 transition block text-left w-full hover:underline"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-black z-30 relative" style={{ fontFamily: 'Roboto, sans-serif' }}>
      <div className="bg-black container mx-auto px-4 pr-0">
        <div className="flex flex-col md:flex-row md:items-center gap-3 pt-2 pb-4 bg-black md:pr-4">
          {/* Left reserve so the centered nav clears the homepage brand logo (absolutely positioned) */}
          <div className="hidden md:block w-24 lg:w-32 flex-shrink-0" aria-hidden="true"></div>

          {/* Category Navigation (mega menu) — centered between the logo and the search box */}
          <nav className="flex items-center justify-start md:justify-center md:flex-1 space-x-1 relative overflow-x-auto md:overflow-visible scrollbar-hide">
              <button
                onClick={() => handleCategoryClick("All")}
                className="text-sm font-semibold bg-white text-black hover:bg-gray-100 transition whitespace-nowrap px-4 py-2 rounded-lg flex-shrink-0"
              >
                Shop All
              </button>

            {visibleCategories.map(({ label, category }) => (
              <div
                key={category}
                className="relative group"
                onMouseEnter={() => handleMouseEnter(category)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  onClick={() => handleCategoryClick(category)}
                  className="text-sm font-medium text-white hover:text-[#FF3CFE] transition whitespace-nowrap px-3 py-2 rounded-lg hover:bg-gray-800 flex items-center gap-1"
                  style={{ textShadow: hoveredCategory === category ? "0 0 8px #FF3CFE" : "none" }}
                >
                  {label}
                  <ChevronDown className="h-3 w-3" />
                </button>
              </div>
            ))}
          </nav>
          
          {/* Search Bar with live autocomplete - Aligned at far right edge under icons */}
          <SearchAutocomplete className="w-full md:w-56 flex-shrink-0" />
        </div>
      </div>

      {/* Mega menu — anchored directly below the nav bar (no magic offsets) */}
      {hoveredCategory && MEGA_MENU[hoveredCategory] && (
        <div
          className="hidden md:block absolute left-0 right-0 top-full px-4 z-[9999]"
          onMouseEnter={() => handleMouseEnter(hoveredCategory)}
          onMouseLeave={handleMouseLeave}
        >
          {renderMegaMenu(hoveredCategory)}
        </div>
      )}
    </div>
  );
}
