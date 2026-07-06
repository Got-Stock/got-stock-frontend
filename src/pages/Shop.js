import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Search, SlidersHorizontal, X, ChevronDown, Grid3x3, LayoutGrid, Eye } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Slider } from "../components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { Badge } from "../components/ui/badge";
import Banner from "../components/Banner";
import CartBadge from "../components/CartBadge";
import CategoryNav from "../components/CategoryNav";
import Breadcrumbs from "../components/Breadcrumbs";
import WishlistButton from "../components/WishlistButton";
import Header from "../components/Header";
import { ProductGridSkeleton } from "../components/ProductCardSkeleton";
import QuickViewModal from "../components/QuickViewModal";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Shop() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [viewMode, setViewMode] = useState("2-col"); // "1-col", "2-col", or "3-col"
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  
  // Available filter options
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [maxPriceLimit, setMaxPriceLimit] = useState(1000);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Monitor URL parameters using searchParams
  useEffect(() => {
    const searchParam = searchParams.get('search');
    const categoryParam = searchParams.get('category');
    const sortParam = searchParams.get('sort');
    
    if (searchParam) {
      setSearchQuery(searchParam);
    } else {
      setSearchQuery("");
    }
    
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    } else {
      setSelectedCategories([]);
    }

    if (sortParam === 'newest') {
      setSortBy('newest');
    }
  }, [searchParams]);

  useEffect(() => {
    applyFilters();
  }, [products, searchQuery, selectedCategories, selectedBrands, priceRange, inStockOnly, sortBy]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/products/public`);
      const publishedProducts = response.data.filter(p => p.status === "PUBLISHED");
      setProducts(publishedProducts);
      
      // Extract unique categories and brands
      const uniqueCategories = [...new Set(publishedProducts.map(p => p.categories?.level_1).filter(Boolean))];
      const uniqueBrands = [...new Set(publishedProducts.map(p => p.brand).filter(Boolean))];
      
      setCategories(uniqueCategories.sort());
      setBrands(uniqueBrands.sort());
      
      // Set max price range based on actual variant offers
      const allPrices = publishedProducts.flatMap(p => 
        p.variants?.flatMap(v => v.offers?.map(o => o.price) || []) || []
      );
      const maxPrice = Math.max(...allPrices, 0);
      const ceilMax = Math.ceil(maxPrice);
      setMaxPriceLimit(ceilMax);
      setPriceRange([0, ceilMax]);
      
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(p =>
        selectedCategories.includes(p.categories?.level_1)
      );
    }

    // Brand filter
    if (selectedBrands.length > 0) {
      filtered = filtered.filter(p =>
        selectedBrands.includes(p.brand)
      );
    }

    // Price filter
    filtered = filtered.filter(p => {
      const prices = p.variants?.flatMap(v => v.offers?.map(o => o.price) || []) || [];
      if (prices.length === 0) return false;
      const minPrice = Math.min(...prices);
      return minPrice >= priceRange[0] && minPrice <= priceRange[1];
    });

    // Stock filter
    if (inStockOnly) {
      filtered = filtered.filter(p =>
        p.variants?.some(v => v.offers?.some(o => o.stock_qty > 0))
      );
    }

    // Sort
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => {
          const aMin = Math.min(...(a.variants?.flatMap(v => v.offers?.map(o => o.price) || []) || [Infinity]));
          const bMin = Math.min(...(b.variants?.flatMap(v => v.offers?.map(o => o.price) || []) || [Infinity]));
          return aMin - bMin;
        });
        break;
      case "price-high":
        filtered.sort((a, b) => {
          const aMin = Math.min(...(a.variants?.flatMap(v => v.offers?.map(o => o.price) || []) || [0]));
          const bMin = Math.min(...(b.variants?.flatMap(v => v.offers?.map(o => o.price) || []) || [0]));
          return bMin - aMin;
        });
        break;
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // newest
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    setFilteredProducts(filtered);
  };

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const toggleBrand = (brand) => {
    setSelectedBrands(prev =>
      prev.includes(brand)
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange([0, 500]);
    setInStockOnly(false);
    setSortBy("newest");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <CategoryNav />
        <div className="container mx-auto px-4 py-8">
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-6" />
          <div className="flex gap-6">
            <aside className="hidden md:block w-64 flex-shrink-0">
              <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 space-y-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                ))}
              </div>
            </aside>
            <main className="flex-1">
              <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mb-4" />
              <ProductGridSkeleton count={9} />
            </main>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      {/* Sticky Category Navigation with Search */}
      <CategoryNav />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: "Shop" }
          ]} 
        />
        
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            {selectedCategories.length > 0 ? `${selectedCategories[0]}` : searchQuery ? `Search: "${searchQuery}"` : "All Products"}
          </h1>

          <div className="flex gap-2 md:gap-4 flex-wrap items-center">
            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>

            {/* View Mode Toggle - Mobile only */}
            <div className="flex gap-1 md:hidden border rounded-md p-0.5">
              <Button
                variant={viewMode === "1-col" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("1-col")}
                className="px-2 h-8"
                title="Large - 1 column"
              >
                <span className="text-xs font-semibold">1</span>
              </Button>
              <Button
                variant={viewMode === "2-col" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("2-col")}
                className="px-2 h-8"
                title="Medium - 2 columns"
              >
                <span className="text-xs font-semibold">2</span>
              </Button>
              <Button
                variant={viewMode === "3-col" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("3-col")}
                className="px-2 h-8"
                title="Small - 3 columns (9 visible)"
              >
                <span className="text-xs font-semibold">3</span>
              </Button>
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-48 bg-white text-gray-900 border-gray-300">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-white text-gray-900">
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters */}
        {(selectedCategories.length > 0 || selectedBrands.length > 0 || inStockOnly) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedCategories.map(cat => (
              <Badge key={cat} variant="secondary" className="px-3 py-1">
                {cat}
                <X
                  className="h-3 w-3 ml-2 cursor-pointer"
                  onClick={() => toggleCategory(cat)}
                />
              </Badge>
            ))}
            {selectedBrands.map(brand => (
              <Badge key={brand} variant="secondary" className="px-3 py-1">
                {brand}
                <X
                  className="h-3 w-3 ml-2 cursor-pointer"
                  onClick={() => toggleBrand(brand)}
                />
              </Badge>
            ))}
            {inStockOnly && (
              <Badge variant="secondary" className="px-3 py-1">
                In Stock Only
                <X
                  className="h-3 w-3 ml-2 cursor-pointer"
                  onClick={() => setInStockOnly(false)}
                />
              </Badge>
            )}
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear All
            </Button>
          </div>
        )}

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Sidebar Filters */}
          <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 bg-white border border-gray-200 rounded-xl shadow-sm p-6 h-[calc(100vh-8rem)] overflow-y-auto sticky top-24`}>
            <h3 className="font-semibold text-lg mb-4 text-gray-900">Filters</h3>

            {/* Categories */}
            <div className="mb-6">
              <h4 className="font-medium text-sm mb-3 text-gray-900">Categories</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {categories.map(cat => (
                  <label key={cat} className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox
                      checked={selectedCategories.includes(cat)}
                      onCheckedChange={() => toggleCategory(cat)}
                      className="border-gray-300 data-[state=checked]:bg-brand-600 data-[state=checked]:text-white"
                    />
                    <span className="text-sm text-gray-700">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div className="mb-6">
              <h4 className="font-medium text-sm mb-3 text-gray-900">Brands</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                {brands.map(brand => (
                  <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                    <Checkbox
                      checked={selectedBrands.includes(brand)}
                      onCheckedChange={() => toggleBrand(brand)}
                      className="border-gray-300 data-[state=checked]:bg-brand-600 data-[state=checked]:text-white"
                    />
                    <span className="text-sm text-gray-700">{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <h4 className="font-medium text-sm mb-3 text-gray-900">Price Range</h4>
              <div className="px-2">
                <Slider
                  value={priceRange}
                  onValueChange={setPriceRange}
                  max={maxPriceLimit}
                  step={10}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Stock Availability */}
            <div className="mb-6">
              <label className="flex items-center space-x-2 cursor-pointer">
                <Checkbox
                  checked={inStockOnly}
                  onCheckedChange={setInStockOnly}
                  className="border-gray-300 data-[state=checked]:bg-brand-600 data-[state=checked]:text-white"
                />
                <span className="text-sm text-gray-700">In Stock Only</span>
              </label>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            <div className="mb-4 text-gray-600" aria-live="polite">
              Showing {filteredProducts.length} of {products.length} products
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found</p>
                <Button variant="outline" onClick={clearFilters} className="mt-4">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className={`grid ${
                viewMode === "1-col" ? "grid-cols-1 gap-4" : 
                viewMode === "2-col" ? "grid-cols-2 gap-3" : 
                "grid-cols-3 gap-2"
              } sm:grid-cols-2 sm:gap-6 lg:grid-cols-3`}>
                {filteredProducts.map(product => {
                  const defaultVariant = product.variants?.find(v => v.offers && v.offers.length > 0) || product.variants?.[0];
                  if (!defaultVariant) return null;
                  
                  const bestOffer = defaultVariant.offers?.[0];
                  const price = bestOffer?.price || 0;
                  const stock = bestOffer?.stock_qty || 0;
                  const variantImage = product.images?.[0] || "https://placehold.co/400x400?text=No+Image";
                  const linkPath = `/product/variant/${defaultVariant.variant_id}`;
                  
                  return (
                    <div key={product.id} className="group relative bg-white rounded-lg shadow-sm hover:shadow-2xl transition-all overflow-hidden border-2 border-transparent hover:border-brand-200">
                      <button
                        type="button"
                        onClick={() => setQuickViewProduct(product)}
                        aria-label={`Quick view ${product.name}`}
                        className="absolute top-2 left-2 z-10 flex items-center gap-1 rounded-full bg-white/90 backdrop-blur px-2.5 py-1.5 text-[11px] font-semibold text-gray-800 shadow-md transition hover:bg-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 focus-visible:opacity-100"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">Quick view</span>
                      </button>
                      <Link to={linkPath}>
                        <div className="aspect-square bg-gray-100 overflow-hidden relative">
                          <img
                            src={variantImage}
                            alt={product.name}
                            loading="lazy"
                            width="400"
                            height="400"
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                            style={{ aspectRatio: '1/1', objectFit: 'cover' }}
                            onError={(e) => {
                              if (e.target.src !== "https://placehold.co/400x400?text=No+Image") {
                                e.target.src = "https://placehold.co/400x400?text=No+Image";
                              }
                            }}
                          />
                          <div className={`absolute ${viewMode === "3-col" ? "top-1 right-1" : "top-2 right-2"} sm:top-2 sm:right-2 z-10`}>
                            <WishlistButton product={product} className={viewMode === "3-col" ? "scale-75" : ""} />
                          </div>
                        </div>
                      </Link>
                      
                      <div className={`${
                        viewMode === "1-col" ? "p-4" : 
                        viewMode === "2-col" ? "p-3" : 
                        "p-2"
                      } sm:p-4`}>
                        <p className={`${
                          viewMode === "3-col" ? "text-[8px]" : "text-xs"
                        } sm:text-xs text-gray-500 mb-1 uppercase tracking-wide font-semibold truncate`}>
                          {product.brand}
                        </p>
                        <h3 className={`${
                          viewMode === "1-col" ? "text-base" :
                          viewMode === "2-col" ? "text-sm" :
                          "text-[10px]"
                        } sm:text-base font-medium text-gray-900 mb-2 line-clamp-2`}>
                          {product.name}
                        </h3>
                        
                        {defaultVariant.variant_attributes && viewMode !== "3-col" && (
                          <div className="text-[9px] sm:text-xs text-gray-600 mb-1">
                            {defaultVariant.variant_attributes.primary_colour && (
                              <span>Color: {defaultVariant.variant_attributes.primary_colour}</span>
                            )}
                          </div>
                        )}
                        
                        <div className={`flex items-center ${viewMode === "3-col" ? "flex-col items-start gap-1" : "justify-between"} sm:justify-between mb-2`}>
                          <p className={`${
                            viewMode === "1-col" ? "text-lg" :
                            viewMode === "2-col" ? "text-sm" :
                            "text-xs"
                          } sm:text-lg font-bold text-brand-600`}>
                            ${price.toFixed(2)}
                          </p>
                          {stock > 0 ? (
                            <Badge variant="outline" className={`${viewMode === "3-col" ? "text-[8px] px-1 py-0" : "text-xs"} sm:text-xs border-brand-600 text-brand-600`}>
                              In Stock
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className={`${viewMode === "3-col" ? "text-[8px] px-1 py-0" : "text-xs"} sm:text-xs`}>
                              Out of Stock
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      <QuickViewModal
        product={quickViewProduct}
        open={!!quickViewProduct}
        onOpenChange={(o) => !o && setQuickViewProduct(null)}
      />
    </div>
  );
}
