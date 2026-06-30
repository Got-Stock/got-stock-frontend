import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { ArrowRight, ArrowLeft } from "lucide-react";
import Banner from "../components/Banner";
import CartBadge from "../components/CartBadge";
import CategoryNav from "../components/CategoryNav";
import Breadcrumbs from "../components/Breadcrumbs";
import WishlistButton from "../components/WishlistButton";
import Header from "../components/Header";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Category-specific images and descriptions
const CATEGORY_DATA = {
  "Fashion": {
    image: "/grids/shoes-grid.png",
    title: "Fashion",
    subtitle: "Curated Style Collections",
    description: "Discover premium fashion brands at unbeatable prices. From casual wear to elegant evening pieces.",
    color: "from-purple-900/90 to-pink-900/80"
  },
  "Health & Beauty": {
    image: "/grids/beauty-grid.png",
    title: "Health & Beauty",
    subtitle: "Premium Beauty Products",
    description: "Quality skincare, cosmetics, and wellness products from trusted brands.",
    color: "from-pink-900/90 to-purple-900/80"
  },
  "Home & Living": {
    image: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    title: "Home & Living",
    subtitle: "Elevate Your Space",
    description: "Transform your home with premium decor, furniture, and living essentials.",
    color: "from-blue-900/90 to-purple-900/80"
  },
  "Electronics & Tech": {
    image: "/grids/electronics-grid.png",
    title: "Electronics & Tech",
    subtitle: "Latest Technology",
    description: "Cutting-edge electronics and gadgets from leading tech brands.",
    color: "from-gray-900/90 to-blue-900/80"
  },
  "Watches": {
    image: "/grids/watches-grid.png",
    title: "Watches",
    subtitle: "Timeless Elegance",
    description: "Luxury and designer watches at exceptional prices.",
    color: "from-amber-900/90 to-orange-900/80"
  },
  "Sports & Outdoors": {
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    title: "Sports & Outdoors",
    subtitle: "Active Lifestyle",
    description: "Premium sports gear, fitness equipment, and outdoor essentials.",
    color: "from-green-900/90 to-teal-900/80"
  }
};

export default function CategoryPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryData = CATEGORY_DATA[category] || CATEGORY_DATA["Fashion"];

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/products/public`);
      const filtered = response.data.filter(
        p => p.status === "APPROVED" && p.categories?.level_1 === category
      );
      setProducts(filtered);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const getProductPrice = (product) => {
    if (!product.variants || product.variants.length === 0) return null;
    const prices = product.variants.map(v => v.price);
    const minPrice = Math.min(...prices);
    return `$${minPrice.toFixed(2)}`;
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <Header />
      
      {/* Sticky Category Navigation with Search */}
      <CategoryNav />

      {/* Category Hero Section */}
      <section className="relative h-96 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={categoryData.image}
            alt={categoryData.title}
            className="w-full h-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${categoryData.color}`}></div>
        </div>
        
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl text-white">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="text-white hover:text-white hover:bg-white/10 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            
            <h1 className="text-5xl sm:text-6xl font-bold mb-4 leading-tight">
              {categoryData.title}
            </h1>
            <p className="text-2xl text-gray-100 mb-2">{categoryData.subtitle}</p>
            <p className="text-lg text-gray-200 mb-6 max-w-xl">
              {categoryData.description}
            </p>
            
            <Button 
              onClick={() => navigate('/shop?category=' + encodeURIComponent(category))}
              size="lg"
              className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-6 text-lg"
            >
              Browse All {categoryData.title}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Breadcrumbs */}
          <Breadcrumbs 
            items={[
              { label: "Shop", href: "/shop" },
              { label: category }
            ]} 
          />
          
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Featured {categoryData.title}
            </h2>
            <p className="text-lg text-gray-200">
              {products.length} products available
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-6">
                No products available in this category yet.
              </p>
              <Button onClick={() => navigate('/shop')} variant="outline">
                Browse All Categories
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 8).map(product => (
                <div key={product.id} className="relative">
                  <Link
                    to={`/product/${product.id}`}
                    className="bg-white rounded-lg shadow-sm hover:shadow-2xl transition-all overflow-hidden group border-2 border-transparent hover:border-purple-200 block"
                  >
                    <div className="aspect-square bg-gray-100 overflow-hidden relative">
                      <img
                        src={product.media?.images?.[0] || "https://placehold.co/400x400?text=No+Image"}
                        alt={product.name}
                        loading="lazy"
                        width="400"
                        height="400"
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                        onError={(e) => {
                          if (e.target.src !== "https://placehold.co/400x400?text=No+Image") {
                            e.target.src = "https://placehold.co/400x400?text=No+Image";
                          }
                        }}
                      />
                      {/* Wishlist Button */}
                      <div className="absolute top-2 right-2 z-10">
                        <WishlistButton product={product} />
                      </div>
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-semibold">
                        {product.brand}
                      </p>
                      <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <p className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          {getProductPrice(product)}
                        </p>
                        <Badge variant="outline" className="text-xs border-purple-600 text-purple-600">
                          View Details
                        </Badge>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button
              onClick={() => navigate('/shop?category=' + encodeURIComponent(category))}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-10 py-6"
            >
              View All {categoryData.title}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
