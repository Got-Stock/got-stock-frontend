import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import {
  ArrowRight, ArrowUp, CheckCircle, Shield, ShieldCheck, Zap, TrendingUp,
  Package, BadgeCheck, Lock, Truck, Sparkles, Eye
} from 'lucide-react';
import axios from 'axios';
import Banner from '../components/Banner';
import CategoryNav from '../components/CategoryNav';
import Header from '../components/Header';
import WishlistButton from '../components/WishlistButton';
import PromoCarousel from '../components/PromoCarousel';
import ChatBot from '../components/ChatBot';
import { Reveal, Counter } from '../components/Reveal';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const BENEFITS = [
  { icon: BadgeCheck, title: 'Authenticated Brands', sub: '100% genuine, guaranteed' },
  { icon: Lock, title: 'Secure Checkout', sub: 'Encrypted payments via Stripe' },
  { icon: Truck, title: 'Australia-Wide Shipping', sub: 'Fast dispatch from sellers' },
  { icon: ShieldCheck, title: 'Buyer Protection', sub: 'Shop with confidence' },
];

// Floating back-to-top control (sits above the chat bubble).
const BackToTop = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className={`fixed bottom-24 right-6 z-50 h-11 w-11 rounded-full bg-[#FF3CFE] text-white grid place-items-center gs-glow-btn shadow-lg ${
        show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
};

// Standardised category tile.
const Tile = ({ img, alt, label, cta, onClick, heightClass, center = false }) => (
  <button
    type="button"
    onClick={onClick}
    className={`group relative w-full ${heightClass} overflow-hidden rounded-2xl ring-1 ring-white/10 hover:ring-2 hover:ring-[#FF3CFE] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF3CFE]`}
  >
    <img
      src={img}
      alt={alt}
      loading="lazy"
      className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
    />
    <div
      className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent flex p-6 ${
        center ? 'items-center justify-center text-center' : 'items-end'
      }`}
    >
      <div className={center ? '' : 'text-left'}>
        <h3 className={`${center ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl'} font-black text-white mb-4 drop-shadow`}>
          {label}
        </h3>
        <span className="inline-flex items-center gap-2 border border-white/70 group-hover:border-[#FF3CFE] group-hover:bg-[#FF3CFE] text-white text-sm font-semibold px-5 py-2 rounded-full transition-all">
          {cta}
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
        </span>
      </div>
    </div>
  </button>
);

const Landing = () => {
  const { loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [stats, setStats] = useState({ products: 0, brands: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API}/products/public`);
        const products = response.data || [];
        const shuffled = [...products].sort(() => 0.5 - Math.random());
        setFeaturedProducts(shuffled.slice(0, 8));
        const uniqueBrands = [...new Set(products.map((p) => p.brand).filter(Boolean))];
        setBrands(uniqueBrands);
        setStats({ products: products.length, brands: uniqueBrands.length });
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchData();
  }, []);

  const tiles = {
    womens: 'https://customer-assets.emergentagent.com/job_shop-ui-redesign/artifacts/yazg1rhe_women.png',
    mens: 'https://customer-assets.emergentagent.com/job_shop-ui-redesign/artifacts/c4zbyrl4_generated-imamge%20%284%29.png',
    kids: 'https://customer-assets.emergentagent.com/job_shop-ui-redesign/artifacts/bokpyolv_kids%20carosel.PNG',
    lifestyle: 'https://customer-assets.emergentagent.com/job_shop-ui-redesign/artifacts/gpyrgs3g_ChatGPT%20Image%20Dec%2024%2C%202025%2C%2008_21_22%20AM.png',
    beauty: 'https://customer-assets.emergentagent.com/job_shop-ui-redesign/artifacts/ww2amx9u_ChatGPT%20Image%20Dec%2024%2C%202025%2C%2008_38_29%20AM.png',
    tech: 'https://customer-assets.emergentagent.com/job_shop-ui-redesign/artifacts/tz9df488_tech%20tile.png',
    home: 'https://customer-assets.emergentagent.com/job_shop-ui-redesign/artifacts/24h4wq0e_ChatGPT%20Image%20Dec%2024%2C%202025%2C%2008_02_33%20AM.png',
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF3CFE]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col" style={{ fontFamily: 'Roboto, sans-serif' }}>
      <h1 className="sr-only">Got-Stock — Big Brands For Your Budget</h1>

      {/* Sticky Header Section - Only black strips */}
      <div className="sticky top-0 z-40 bg-black relative">
        <Header logoVisibility="mobile" />
        <CategoryNav />
        <Link
          to="/"
          aria-label="Got-Stock home"
          className="hidden md:flex absolute left-4 lg:left-6 top-1 z-[60] items-start hover:opacity-90 transition"
        >
          <img src="/got-stock-mark.png" alt="Got-Stock" className="h-20 lg:h-24 w-auto" />
        </Link>
      </div>

      {/* Banner - NOT sticky, scrolls away */}
      <Banner />

      {/* Promo Carousel - Auto-rotating banners */}
      <PromoCarousel />

      {/* Trust / benefits bar */}
      <section className="bg-black border-y border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 md:divide-x divide-white/10">
          {BENEFITS.map((b) => (
            <div key={b.title} className="group flex items-center gap-3 px-4 py-5 md:px-6 md:py-6">
              <b.icon className="h-7 w-7 text-[#FF3CFE] shrink-0 group-hover:scale-110 transition" />
              <div>
                <p className="text-white text-sm font-semibold leading-tight">{b.title}</p>
                <p className="text-gray-400 text-xs leading-tight">{b.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Animated brand marquee (real brands from the catalogue) */}
      {brands.length > 0 && (
        <section className="bg-black py-8 overflow-hidden">
          <p className="text-center text-[11px] uppercase tracking-[0.35em] text-gray-500 mb-5">
            Trusted big brands
          </p>
          <div className="gs-marquee relative">
            <div className="gs-marquee-track">
              {[...brands, ...brands].map((brand, i) => (
                <span
                  key={`${brand}-${i}`}
                  className="px-8 text-2xl md:text-3xl font-black text-white/40 hover:text-[#FF3CFE] transition-colors whitespace-nowrap"
                >
                  {brand}
                </span>
              ))}
            </div>
            <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-28 bg-gradient-to-r from-black to-transparent" />
            <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-28 bg-gradient-to-l from-black to-transparent" />
          </div>
        </section>
      )}

      {/* Stat band with aurora glow */}
      <Reveal as="section" className="relative bg-black py-14 overflow-hidden">
        <div className="gs-aurora gs-glow pointer-events-none absolute -top-24 left-1/2 h-72 w-[46rem] rounded-full bg-[#FF3CFE]/20 blur-3xl" />
        <div className="relative max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-4 text-center">
          <div>
            <div className="text-4xl md:text-5xl font-black gs-gradient-text">
              <Counter to={stats.products} suffix="+" />
            </div>
            <p className="text-gray-400 text-sm mt-1">Products in stock</p>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-black gs-gradient-text">
              <Counter to={stats.brands} suffix="+" />
            </div>
            <p className="text-gray-400 text-sm mt-1">Trusted brands</p>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-black gs-gradient-text">100%</div>
            <p className="text-gray-400 text-sm mt-1">Authenticated</p>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-black gs-gradient-text">AU</div>
            <p className="text-gray-400 text-sm mt-1">Melbourne, Australia</p>
          </div>
        </div>
      </Reveal>

      {/* Shop By Category */}
      <section className="bg-black pb-12 md:pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <Reveal className="text-center mb-8 md:mb-10">
            <span className="inline-block text-[11px] uppercase tracking-[0.35em] text-[#FF3CFE] mb-3">Explore</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-3">Shop By Category</h2>
            <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto">
              Fashion &amp; footwear for women, men and kids — plus the best of beauty, home, tech and lifestyle.
            </p>
          </Reveal>

          <Reveal className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            <div className="md:col-span-3">
              <Tile
                img={tiles.womens}
                alt="Womens Fashion"
                label="Womens"
                cta="Shop Now"
                center
                heightClass="h-56 md:h-72"
                onClick={() => navigate('/shop?category=Fashion&subcategory=Womens')}
              />
            </div>
          </Reveal>

          <Reveal className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mt-3 md:mt-4">
            <Tile
              img={tiles.mens}
              alt="Mens Fashion"
              label="Mens"
              cta="Shop Mens"
              heightClass="h-60 md:h-80"
              onClick={() => navigate('/shop?category=Fashion&subcategory=Mens')}
            />
            <Tile
              img={tiles.kids}
              alt="Kids Fashion"
              label="Kids"
              cta="Shop Kids"
              heightClass="h-60 md:h-80"
              onClick={() => navigate('/shop?category=Fashion&subcategory=Kids')}
            />
          </Reveal>

          <Reveal className="mt-3 md:mt-4">
            <Tile
              img={tiles.lifestyle}
              alt="Lifestyle"
              label="Lifestyle"
              cta="Discover More"
              center
              heightClass="h-56 md:h-72"
              onClick={() => navigate('/shop')}
            />
          </Reveal>

          <Reveal className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mt-3 md:mt-4">
            <Tile
              img={tiles.beauty}
              alt="Health & Beauty"
              label="Health & Beauty"
              cta="Shop Now"
              heightClass="h-60 md:h-80"
              onClick={() => navigate('/shop?category=Beauty')}
            />
            <Tile
              img={tiles.tech}
              alt="Tech"
              label="Tech"
              cta="Shop Now"
              heightClass="h-60 md:h-80"
              onClick={() => navigate('/shop?category=Electronics')}
            />
            <Tile
              img={tiles.home}
              alt="Home & Living"
              label="Home & Living"
              cta="Shop Now"
              heightClass="h-60 md:h-80"
              onClick={() => navigate('/shop?category=Home')}
            />
          </Reveal>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="bg-gray-50 py-12 md:py-16">
          <div className="container mx-auto px-4">
            <Reveal className="text-center mb-10 md:mb-12">
              <span className="inline-flex items-center gap-1 bg-[#FF3CFE] text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                <Sparkles className="h-3 w-3" /> TRENDING NOW
              </span>
              <h2 className="text-4xl font-black text-gray-900 mb-3">Featured Products</h2>
              <p className="text-lg text-gray-600">Handpicked by our marketplace curators from top sellers</p>
            </Reveal>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-10">
              {featuredProducts.map((product, idx) => {
                const defaultVariant = product.default_variant;
                if (!defaultVariant) return null;

                const bestOffer = defaultVariant.offers?.[0];
                const price = bestOffer?.price || 0;
                const stock = bestOffer?.stock_qty || 0;
                const variantImage = product.images?.[0] || 'https://placehold.co/400x400?text=No+Image';
                const linkPath = `/product/variant/${defaultVariant.variant_id}`;

                return (
                  <Reveal key={product.id} delay={idx * 60} className="h-full">
                    <div className="group h-full flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-[0_22px_50px_-12px_rgba(255,60,254,0.45)] hover:-translate-y-1 transition-all duration-300 overflow-hidden">
                      <Link to={linkPath} className="block">
                        <div className="aspect-square bg-gray-100 overflow-hidden relative">
                          <img
                            src={variantImage}
                            alt={product.name}
                            loading="lazy"
                            width="400"
                            height="400"
                            className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                            onError={(e) => {
                              if (e.target.src !== 'https://placehold.co/400x400?text=No+Image') {
                                e.target.src = 'https://placehold.co/400x400?text=No+Image';
                              }
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-300" />
                          <span className="absolute bottom-3 left-1/2 -translate-x-1/2 translate-y-3 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white text-gray-900 text-xs font-bold px-4 py-2 rounded-full inline-flex items-center gap-1 shadow-lg">
                            <Eye className="h-3.5 w-3.5" /> Quick view
                          </span>
                          <div className="absolute top-2 left-2 bg-[#FF3CFE] text-white text-[9px] sm:text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg inline-flex items-center gap-1">
                            <Sparkles className="h-3 w-3" /> Featured
                          </div>
                          <div className="absolute top-2 right-2">
                            <WishlistButton product={product} className="bg-white shadow-lg scale-90 sm:scale-100" />
                          </div>
                        </div>
                      </Link>

                      <div className="p-3 sm:p-4 flex flex-col flex-1">
                        <p className="text-[10px] sm:text-xs text-gray-500 mb-0.5 uppercase tracking-wide font-semibold truncate">
                          {product.brand}
                        </p>
                        <h3 className="text-xs sm:text-base font-medium text-gray-900 mb-2 line-clamp-2">
                          {product.name}
                        </h3>

                        <div className="mt-auto flex items-center justify-between">
                          <p className="text-sm sm:text-xl font-bold text-[#FF3CFE]">${price.toFixed(2)}</p>
                          {stock > 0 ? (
                            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-green-600">
                              <span className="h-1.5 w-1.5 rounded-full bg-green-500" /> In stock
                            </span>
                          ) : (
                            <span className="hidden sm:inline text-[11px] text-gray-400">Sold out</span>
                          )}
                        </div>

                        {product.total_variants > 1 && (
                          <p className="text-[9px] sm:text-xs text-[#FF3CFE] mt-1">
                            +{product.total_variants} options
                          </p>
                        )}
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            <div className="text-center">
              <Button
                onClick={() => navigate('/shop')}
                size="lg"
                className="bg-[#FF3CFE] hover:bg-[#FF3CFE]/90 text-white px-8 py-6 text-lg rounded-full gs-glow-btn"
              >
                Shop All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Become a Seller CTA Section */}
      <section className="relative bg-gradient-to-b from-[#FF3CFE]/15 to-black py-12 md:py-16 overflow-hidden">
        <div className="gs-aurora gs-glow pointer-events-none absolute -top-32 left-1/2 h-80 w-[52rem] rounded-full bg-[#FF3CFE]/20 blur-3xl" />
        <div className="relative container mx-auto px-4">
          <Reveal className="max-w-4xl mx-auto text-center">
            <div className="mb-6">
              <Package className="h-16 w-16 text-[#FF3CFE] mx-auto mb-4 gs-float" />
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Ready to <span className="gs-gradient-text">Grow Your Business?</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Join Got-Stock marketplace and reach thousands of customers across Australia
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {[
                { icon: TrendingUp, title: 'Increase Sales', sub: 'Access a growing customer base' },
                { icon: Shield, title: 'Secure Platform', sub: 'Protected transactions & payments' },
                { icon: Zap, title: 'Easy Setup', sub: 'Start selling in minutes' },
              ].map((f) => (
                <div
                  key={f.title}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#FF3CFE]/50 hover:-translate-y-1 transition-all duration-300"
                >
                  <f.icon className="h-10 w-10 text-[#FF3CFE] mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                  <p className="text-gray-300 text-sm">{f.sub}</p>
                </div>
              ))}
            </div>

            <Button
              onClick={() => navigate('/become-a-seller')}
              size="lg"
              className="bg-[#FF3CFE] text-white hover:bg-[#FF3CFE]/90 font-bold text-lg px-8 py-6 rounded-full gs-glow-btn"
            >
              Become a Seller
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <p className="text-gray-400 text-sm mt-6">
              No setup fees • Competitive commission rates • Dedicated support
            </p>
          </Reveal>
        </div>
      </section>

      {/* About, Mission & Why Got-Stock */}
      <section className="relative bg-gradient-to-b from-[#FF3CFE]/15 to-black py-10 md:py-14 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Reveal className="grid md:grid-cols-2 gap-8 mb-12 pb-12 border-b border-white/20">
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold text-white mb-3">About Got-Stock</h3>
                <p className="text-base text-gray-300 leading-relaxed">
                  Melbourne's trusted clearance marketplace connecting big-brand sellers with smart shoppers.
                  Quality shouldn't be a luxury — we make it accessible.
                </p>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold text-white mb-3">Our Mission</h3>
                <p className="text-base text-gray-300 leading-relaxed">
                  To optimise stock flow for sellers while providing consumers with quality big-brand goods at affordable prices.
                  A frictionless marketplace that feels simple, modern and efficient.
                </p>
              </div>
            </Reveal>

            <div>
              <Reveal className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Why Got-Stock Matters</h2>
                <p className="text-lg text-gray-300">Reshaping clearance retail for a sustainable future</p>
              </Reveal>

              <Reveal className="grid md:grid-cols-4 gap-6">
                {[
                  { icon: Package, title: 'Trusted Brands Only', sub: 'Genuine big-brand products from reputable sellers' },
                  { icon: CheckCircle, title: 'Circular Economy', sub: 'Reducing waste by preventing dead stock disposal' },
                  { icon: Shield, title: 'Quality First', sub: 'Well-made products over disposable fast fashion' },
                  { icon: TrendingUp, title: 'Real Value', sub: 'Luxury and quality accessible within your budget' },
                ].map((v) => (
                  <div key={v.title} className="text-center group">
                    <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-3 mx-auto shadow-xl group-hover:scale-105 transition">
                      <v.icon className="w-8 h-8 text-[#FF3CFE]" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2">{v.title}</h3>
                    <p className="text-sm text-gray-300">{v.sub}</p>
                  </div>
                ))}
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <BackToTop />
      <ChatBot />
    </div>
  );
};

export default Landing;
