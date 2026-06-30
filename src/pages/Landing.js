import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { ArrowRight, CheckCircle, Shield, Zap, ShoppingBag, TrendingUp, Package, Heart, HelpCircle, Truck, RefreshCw, Search, User } from 'lucide-react';
import axios from 'axios';
import Banner from '../components/Banner';
import CartBadge from '../components/CartBadge';
import CategoryNav from '../components/CategoryNav';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WishlistButton from '../components/WishlistButton';
import PromoCarousel from '../components/PromoCarousel';
import ChatBot from '../components/ChatBot';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Landing = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      setProductsLoading(true);
      const response = await axios.get(`${API}/products/public`);
      const products = response.data;
      
      // Get 8 random featured products
      const shuffled = products.sort(() => 0.5 - Math.random());
      setFeaturedProducts(shuffled.slice(0, 8));
      
      // Extract unique categories
      const uniqueCategories = [...new Set(products.map(p => p.categories?.level_1).filter(Boolean))];
      setCategories(uniqueCategories.slice(0, 6));
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setProductsLoading(false);
    }
  };

  const handleLogin = () => {
    navigate('/customer-login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col" style={{ fontFamily: 'Roboto, sans-serif' }}>
      <h1 className="sr-only">Got-Stock — Big Brands For Your Budget</h1>
      {/* Sticky Header Section - Only black strips */}
      <div className="sticky top-0 z-40 bg-black relative">
        {/* Header icons. Logo hidden at md+ — the big logo below covers it. */}
        <Header logoVisibility="mobile" />

        {/* Sticky Category Navigation with Search */}
        <CategoryNav />

        {/* Big brand logo (desktop): fills the full height of the black header
            block on the left, scaled as large as possible via object-contain so
            it never spills onto the pink banner below. */}
        <Link
          to="/"
          aria-label="Got-Stock home"
          className="hidden md:flex absolute left-4 lg:left-6 top-0 bottom-0 z-[60] items-center hover:opacity-90 transition"
        >
          <img
            src="/got-stock-logo.jpg"
            alt="Got-Stock"
            className="h-full w-auto object-contain py-1.5"
          />
        </Link>
      </div>

      {/* Banner - NOT sticky, scrolls away */}
      <Banner />

      {/* Promo Carousel - Auto-rotating banners */}
      <PromoCarousel />

      {/* 5 Category Images Section - Moved Up */}
      <section className="py-0 bg-black">
        <div className="w-full px-0">
          <div className="text-center mb-3 md:mb-4">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-2" style={{ letterSpacing: '0.2em' }}>Shop By Category</h2>
            <p className="text-xs md:text-sm text-gray-200">Explore a huge range of fashion and footwear for women, men and kids, plus the best of beauty, home, tech and lifestyle.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-0">
            {/* Womens - Full Width Top */}
            <div className="md:col-span-3">
              <button
                onClick={() => navigate('/shop?category=Fashion&subcategory=Womens')}
                className="relative w-full h-80 overflow-hidden group hover:shadow-2xl transition-all"
              >
                <img
                  src="https://customer-assets.emergentagent.com/job_shop-ui-redesign/artifacts/yazg1rhe_women.png"
                  alt="Womens Fashion Banner"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 via-33% to-transparent flex items-center justify-center">
                  <div className="text-center">
                    <h3 className="text-5xl font-black text-white mb-6">Womens</h3>
                    <div className="inline-flex items-center text-white font-semibold">
                      <span>Shop Now</span>
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition" />
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-0">
            {/* Mens - Left Block */}
            <button
              onClick={() => navigate('/shop?category=Fashion&subcategory=Mens')}
              className="relative h-96 overflow-hidden group hover:shadow-2xl transition-all"
            >
              <img
                src="https://customer-assets.emergentagent.com/job_shop-ui-redesign/artifacts/c4zbyrl4_generated-imamge%20%284%29.png"
                alt="Mens Fashion Banner"
                loading="lazy"
                width="800"
                height="600"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end p-8">
                <div className="text-left">
                  <h3 className="text-3xl font-black text-white mb-4">Mens</h3>
                  <div className="inline-flex items-center text-white font-semibold text-sm">
                    <span>Shop Mens</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition" />
                  </div>
                </div>
              </div>
            </button>

            {/* Kids - Right Block */}
            <button
              onClick={() => navigate('/shop?category=Fashion&subcategory=Kids')}
              className="relative h-96 overflow-hidden group hover:shadow-2xl transition-all"
            >
              <img
                src="https://customer-assets.emergentagent.com/job_shop-ui-redesign/artifacts/bokpyolv_kids%20carosel.PNG"
                alt="Kids Fashion Banner"
                loading="lazy"
                width="800"
                height="600"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/90 via-pink-900/50 to-transparent flex items-end p-8">
                <div className="text-left">
                  <h3 className="text-3xl font-black text-white mb-4">Kids</h3>
                  <div className="inline-flex items-center text-white font-semibold text-sm">
                    <span>Shop Kids</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition" />
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* Lifestyle - Full Width Bottom */}
          <div className="mt-6">
            <button
              onClick={() => navigate('/shop')}
              className="relative w-full h-80 overflow-hidden group hover:shadow-2xl transition-all"
            >
              <img
                src="https://customer-assets.emergentagent.com/job_shop-ui-redesign/artifacts/gpyrgs3g_ChatGPT%20Image%20Dec%2024%2C%202025%2C%2008_21_22%20AM.png"
                alt="Lifestyle Banner"
                loading="lazy"
                width="1600"
                height="600"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 via-33% to-transparent flex items-center justify-center">
                <div className="text-center">
                  <h3 className="text-5xl font-black text-white mb-6">Lifestyle</h3>
                  <div className="inline-flex items-center text-white font-semibold">
                    <span>Discover More</span>
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition" />
                  </div>
                </div>
              </div>
            </button>
          </div>

          {/* 3-up Categories: Health & Beauty, Tech, Home & Living */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-0 mt-0">
            {/* Health & Beauty */}
            <button
              onClick={() => navigate('/shop?category=Beauty')}
              className="relative h-96 overflow-hidden group hover:shadow-2xl transition-all"
            >
              <img
                src="https://customer-assets.emergentagent.com/job_shop-ui-redesign/artifacts/ww2amx9u_ChatGPT%20Image%20Dec%2024%2C%202025%2C%2008_38_29%20AM.png"
                alt="Health & Beauty Banner"
                loading="lazy"
                width="800"
                height="600"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end p-8">
                <div className="text-left">
                  <h3 className="text-3xl font-black text-white mb-4">Health & Beauty</h3>
                  <div className="inline-flex items-center text-white font-semibold text-sm">
                    <span>Shop Now</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition" />
                  </div>
                </div>
              </div>
            </button>

            {/* Tech */}
            <button
              onClick={() => navigate('/shop?category=Electronics')}
              className="relative h-96 overflow-hidden group hover:shadow-2xl transition-all"
            >
              <img
                src="https://customer-assets.emergentagent.com/job_shop-ui-redesign/artifacts/tz9df488_tech%20tile.png"
                alt="Tech Banner"
                loading="lazy"
                width="800"
                height="600"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end p-8">
                <div className="text-left">
                  <h3 className="text-3xl font-black text-white mb-4">Tech</h3>
                  <div className="inline-flex items-center text-white font-semibold text-sm">
                    <span>Shop Now</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition" />
                  </div>
                </div>
              </div>
            </button>

            {/* Home & Living */}
            <button
              onClick={() => navigate('/shop?category=Home')}
              className="relative h-96 overflow-hidden group hover:shadow-2xl transition-all"
            >
              <img
                src="https://customer-assets.emergentagent.com/job_shop-ui-redesign/artifacts/24h4wq0e_ChatGPT%20Image%20Dec%2024%2C%202025%2C%2008_02_33%20AM.png"
                alt="Home & Living Banner"
                loading="lazy"
                width="800"
                height="600"
                className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-end p-8">
                <div className="text-left">
                  <h3 className="text-3xl font-black text-white mb-4">Home & Living</h3>
                  <div className="inline-flex items-center text-white font-semibold text-sm">
                    <span>Shop Now</span>
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-2 transition" />
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* Become a Seller CTA Section */}
      <section className="bg-gradient-to-b from-[#FF3CFE] to-black py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <Package className="h-16 w-16 text-white mx-auto mb-4" />
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Ready to Grow Your Business?
              </h2>
              <p className="text-xl text-purple-100 mb-8">
                Join Got-Stock marketplace and reach thousands of customers across Australia
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white/10 backdrop-blur-sm p-6">
                <TrendingUp className="h-10 w-10 text-white mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">Increase Sales</h3>
                <p className="text-purple-100 text-sm">Access a growing customer base</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6">
                <Shield className="h-10 w-10 text-white mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">Secure Platform</h3>
                <p className="text-purple-100 text-sm">Protected transactions & payments</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6">
                <Zap className="h-10 w-10 text-white mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-white mb-2">Easy Setup</h3>
                <p className="text-purple-100 text-sm">Start selling in minutes</p>
              </div>
            </div>
            
            <Button
              onClick={() => navigate('/become-a-seller')}
              size="lg"
              className="bg-white text-purple-900 hover:bg-gray-100 font-bold text-lg px-8 py-6 rounded-full shadow-2xl hover:shadow-3xl transition-all"
            >
              Become a Seller
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <p className="text-purple-200 text-sm mt-6">
              No setup fees • Competitive commission rates • Dedicated support
            </p>
          </div>
        </div>
      </section>


      {/* Featured Products - Just Below the Fold */}
      {featuredProducts.length > 0 && (
        <section className="bg-gradient-to-br from-purple-50 via-pink-50 to-purple-50 py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-block bg-gradient-to-b from-[#FF3CFE] to-black text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                TRENDING NOW
              </span>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Products</h2>
              <p className="text-lg text-gray-600">Handpicked by our marketplace curators from top sellers</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8">
              {featuredProducts.map(product => {
                const defaultVariant = product.default_variant;
                if (!defaultVariant) return null;
                
                const bestOffer = defaultVariant.offers?.[0];
                const price = bestOffer?.price || 0;
                const stock = bestOffer?.stock_qty || 0;
                const variantImage = product.images?.[0] || "https://placehold.co/400x400?text=No+Image";
                const linkPath = `/product/variant/${defaultVariant.variant_id}`;
                
                return (
                  <div key={product.id} className="relative bg-white shadow-sm hover:shadow-2xl transition-all overflow-hidden border-2 border-transparent hover:border-purple-200">
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
                        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2 bg-gradient-to-b from-[#FF3CFE] to-black text-white text-[9px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-lg">
                          Featured
                        </div>
                        <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2">
                          <WishlistButton product={product} className="bg-white shadow-lg scale-90 sm:scale-100" />
                        </div>
                      </div>
                    </Link>
                    
                    <div className="p-2 sm:p-4">
                      <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 sm:mb-1 uppercase tracking-wide font-semibold truncate">
                        {product.brand}
                      </p>
                      <h3 className="text-xs sm:text-base font-medium text-gray-900 mb-1 sm:mb-2 line-clamp-2">
                        {product.name}
                      </h3>
                      
                      {defaultVariant.variant_attributes && (
                        <div className="text-[9px] sm:text-xs text-gray-600 mb-1">
                          {defaultVariant.variant_attributes.primary_colour && (
                            <span>Color: {defaultVariant.variant_attributes.primary_colour}</span>
                          )}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm sm:text-xl font-bold text-[#FF3CFE]">
                          ${price.toFixed(2)}
                        </p>
                        <span className="hidden sm:inline text-xs text-gray-500">
                          {stock > 0 ? `${stock} in stock` : 'Out of stock'}
                        </span>
                      </div>
                      
                      {product.total_variants > 1 && (
                        <p className="text-[9px] sm:text-xs text-purple-600 mt-1">
                          Available in {product.total_variants} options
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center">
              <Button 
                onClick={() => navigate('/shop')}
                size="lg"
                className="bg-gradient-to-b from-[#FF3CFE] to-black hover:opacity-90 text-white px-8 py-6 text-lg"
              >
                Shop All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* About, Mission & Why Got-Stock - Combined Single Section */}
      <section className="bg-gradient-to-b from-[#FF3CFE] to-black py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Top Row - About & Mission */}
            <div className="grid md:grid-cols-2 gap-8 mb-12 pb-12 border-b border-white/20">
              {/* About */}
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold text-white mb-3">About Got-Stock</h3>
                <p className="text-base text-purple-50 leading-relaxed">
                  Melbourne's trusted clearance marketplace connecting big-brand sellers with smart shoppers. 
                  Quality shouldn't be a luxury — we make it accessible.
                </p>
              </div>
              
              {/* Mission Statement */}
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold text-white mb-3">Our Mission</h3>
                <p className="text-base text-purple-50 leading-relaxed">
                  To optimise stock flow for sellers while providing consumers with quality big-brand goods at affordable prices. 
                  A frictionless marketplace that feels simple, modern and efficient.
                </p>
              </div>
            </div>

            {/* Bottom Section - Why Got-Stock Matters */}
            <div>
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Why Got-Stock Matters</h2>
                <p className="text-lg text-purple-100">Reshaping clearance retail for a sustainable future</p>
              </div>
              
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white flex items-center justify-center mb-3 mx-auto shadow-xl">
                    <Package className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">Trusted Brands Only</h3>
                  <p className="text-sm text-purple-100">Genuine big-brand products from reputable sellers</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-white flex items-center justify-center mb-3 mx-auto shadow-xl">
                    <CheckCircle className="w-8 h-8 text-pink-600" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">Circular Economy</h3>
                  <p className="text-sm text-purple-100">Reducing waste by preventing dead stock disposal</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-white flex items-center justify-center mb-3 mx-auto shadow-xl">
                    <Shield className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">Quality First</h3>
                  <p className="text-sm text-purple-100">Well-made products over disposable fast fashion</p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-white flex items-center justify-center mb-3 mx-auto shadow-xl">
                    <TrendingUp className="w-8 h-8 text-pink-600" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">Real Value</h3>
                  <p className="text-sm text-purple-100">Luxury and quality accessible within your budget</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      {/* ChatBot */}
      <ChatBot />
    </div>
  );
};

export default Landing;
