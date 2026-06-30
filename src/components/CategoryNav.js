import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronDown } from "lucide-react";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const hideTimeout = useRef(null);

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

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
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
        className="w-screen max-w-5xl bg-gradient-to-b from-[#FF3CFE] to-black border border-gray-300 rounded-lg shadow-2xl py-8 px-6"
        style={{
          zIndex: 9999, 
          position: 'fixed',
          top: '145px',
          left: '50%',
          transform: 'translateX(-50%)'
        }}
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
                      className="text-base text-white hover:text-pink-200 transition block text-left w-full hover:underline"
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
    <div className="bg-black z-30" style={{ fontFamily: 'Roboto, sans-serif' }}>
      <div className="bg-black container mx-auto px-4 pr-0">
        <div className="flex flex-col md:flex-row md:items-center gap-3 pt-2 pb-4 bg-black md:pr-4">
          {/* Spacer to push nav further right */}
          <div className="hidden md:block flex-1"></div>
          
          {/* Category Navigation + Search Bar - Aligned to far right */}
          <div className="flex items-center gap-3 md:ml-auto">
            <nav className="flex items-center space-x-1 relative overflow-x-auto md:overflow-visible scrollbar-hide">
              <button
                onClick={() => handleCategoryClick("All")}
                className="text-sm font-semibold bg-white text-black hover:bg-gray-100 transition whitespace-nowrap px-4 py-2 rounded-lg flex-shrink-0"
              >
                Shop All
              </button>

            {/* Fashion */}
            <div 
              className="relative group"
              onMouseEnter={() => handleMouseEnter("Fashion")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => handleCategoryClick("Fashion")}
                className="text-sm font-medium text-white hover:text-[#FF3CFE] transition whitespace-nowrap px-3 py-2 rounded-lg hover:bg-gray-800 flex items-center gap-1"
                style={{ textShadow: hoveredCategory === "Fashion" ? "0 0 8px #FF3CFE" : "none" }}
              >
                Fashion
                <ChevronDown className="h-3 w-3" />
              </button>
              {hoveredCategory === "Fashion" && (
                <div className="hidden md:block absolute left-0 top-full w-screen" style={{height: '20px'}}>
                  {renderMegaMenu("Fashion")}
                </div>
              )}
            </div>

            {/* Beauty */}
            <div 
              className="relative group"
              onMouseEnter={() => handleMouseEnter("Health & Beauty")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => handleCategoryClick("Health & Beauty")}
                className="text-sm font-medium text-white hover:text-[#FF3CFE] transition whitespace-nowrap px-3 py-2 rounded-lg hover:bg-gray-800 flex items-center gap-1"
                style={{ textShadow: hoveredCategory === "Health & Beauty" ? "0 0 8px #FF3CFE" : "none" }}
              >
                Beauty
                <ChevronDown className="h-3 w-3" />
              </button>
              {hoveredCategory === "Health & Beauty" && (
                <div className="hidden md:block absolute left-0 top-full w-screen" style={{height: '20px'}}>
                  {renderMegaMenu("Health & Beauty")}
                </div>
              )}
            </div>

            {/* Home */}
            <div 
              className="relative group"
              onMouseEnter={() => handleMouseEnter("Home & Living")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => handleCategoryClick("Home & Living")}
                className="text-sm font-medium text-white hover:text-[#FF3CFE] transition whitespace-nowrap px-3 py-2 rounded-lg hover:bg-gray-800 flex items-center gap-1"
                style={{ textShadow: hoveredCategory === "Home & Living" ? "0 0 8px #FF3CFE" : "none" }}
              >
                Home
                <ChevronDown className="h-3 w-3" />
              </button>
              {hoveredCategory === "Home & Living" && (
                <div className="hidden md:block absolute left-0 top-full w-screen" style={{height: '20px'}}>
                  {renderMegaMenu("Home & Living")}
                </div>
              )}
            </div>

            {/* Electronics */}
            <div 
              className="relative group"
              onMouseEnter={() => handleMouseEnter("Electronics & Tech")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => handleCategoryClick("Electronics & Tech")}
                className="text-sm font-medium text-white hover:text-[#FF3CFE] transition whitespace-nowrap px-3 py-2 rounded-lg hover:bg-gray-800 flex items-center gap-1"
                style={{ textShadow: hoveredCategory === "Electronics & Tech" ? "0 0 8px #FF3CFE" : "none" }}
              >
                Electronics
                <ChevronDown className="h-3 w-3" />
              </button>
              {hoveredCategory === "Electronics & Tech" && (
                <div className="hidden md:block absolute left-0 top-full w-screen" style={{height: '20px'}}>
                  {renderMegaMenu("Electronics & Tech")}
                </div>
              )}
            </div>

            {/* Watches */}
            <div 
              className="relative group"
              onMouseEnter={() => handleMouseEnter("Watches")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => handleCategoryClick("Watches")}
                className="text-sm font-medium text-white hover:text-[#FF3CFE] transition whitespace-nowrap px-3 py-2 rounded-lg hover:bg-gray-800 flex items-center gap-1"
                style={{ textShadow: hoveredCategory === "Watches" ? "0 0 8px #FF3CFE" : "none" }}
              >
                Watches
                <ChevronDown className="h-3 w-3" />
              </button>
              {hoveredCategory === "Watches" && (
                <div className="hidden md:block absolute left-0 top-full w-screen" style={{height: '20px'}}>
                  {renderMegaMenu("Watches")}
                </div>
              )}
            </div>

            {/* Sports */}
            <div 
              className="relative group"
              onMouseEnter={() => handleMouseEnter("Sports & Outdoors")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => handleCategoryClick("Sports & Outdoors")}
                className="text-sm font-medium text-white hover:text-[#FF3CFE] transition whitespace-nowrap px-3 py-2 rounded-lg hover:bg-gray-800 flex items-center gap-1"
                style={{ textShadow: hoveredCategory === "Sports & Outdoors" ? "0 0 8px #FF3CFE" : "none" }}
              >
                Sports
                <ChevronDown className="h-3 w-3" />
              </button>
              {hoveredCategory === "Sports & Outdoors" && (
                <div className="hidden md:block absolute left-0 top-full w-screen" style={{height: '20px'}}>
                  {renderMegaMenu("Sports & Outdoors")}
                </div>
              )}
            </div>
          </nav>
          
          {/* Search Bar - Aligned at far right edge under icons */}
          <form onSubmit={handleSearch} className="w-full md:w-56 flex-shrink-0">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-3 py-2 pl-9 bg-white text-gray-900 border border-gray-300 rounded-full focus:outline-none focus:border-[#FF3CFE] transition text-sm placeholder-gray-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </form>
          </div>
        </div>
      </div>
    </div>
  );
}
