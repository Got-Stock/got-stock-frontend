import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, User, Menu, X, Search, Package, LogOut, ChevronDown } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import CartBadge from './CartBadge';
import Logo from './Logo';
import { getAllProducts } from '../lib/productCache';
import { getAvailableCategories, NAV_CATEGORIES } from '../lib/categories';

const Header = ({ simple = false, logoVisibility = 'all' }) => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [availableCategories, setAvailableCategories] = useState(null);

  // Hide mobile-menu categories that currently have no products.
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

  const visibleCategories = availableCategories
    ? NAV_CATEGORIES.filter((c) => availableCategories.has(c.category))
    : NAV_CATEGORIES;

  // Dual auth: cookie session (AuthContext) OR localStorage user (CustomerAccount flow).
  let storedUser = null;
  try {
    storedUser = user || JSON.parse(localStorage.getItem('user') || 'null');
  } catch (e) {
    storedUser = user;
  }
  const isLoggedIn = Boolean(storedUser);
  const displayName = storedUser?.name || storedUser?.email || 'My Account';

  const handleAccountClick = () => {
    if (isLoggedIn) {
      setAccountMenuOpen((o) => !o);
    } else {
      navigate('/customer-login');
    }
  };

  const handleLogout = async () => {
    setAccountMenuOpen(false);
    try {
      await logout();
    } catch (e) {
      // ignore — clear client state regardless
    }
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className="bg-black">
        <div className="px-4 py-2">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center">
              {/* Logo. Hidden on the homepage at md+ (it renders one large logo
                  spanning the whole sticky header block instead). */}
              {logoVisibility !== 'none' && (
                <Logo
                  to="/"
                  size="md"
                  priority
                  className={logoVisibility === 'mobile' ? 'md:hidden' : ''}
                />
              )}

              {/* Right cluster: account/cart icons, pinned right. Hidden in simple mode. */}
              {!simple && (
                <div className="flex items-center ml-auto">
                {/* Right Side - Icons - Pink color */}
                <div className="flex items-center space-x-3 md:space-x-4">
                  {/* Wishlist Icon */}
                  <Link 
                    to="/wishlist" 
                    className="p-1 hover:opacity-80 transition"
                    title="Wishlist"
                  >
                    <Heart className="h-5 w-5 md:h-6 md:w-6" stroke="#FF3CFE" fill="none" strokeWidth={1.5} />
                  </Link>

                  {/* Cart Icon with Badge */}
                  <CartBadge />

                  {/* Account: dropdown when logged in, else go to sign-in */}
                  <div className="relative">
                    <button
                      onClick={handleAccountClick}
                      className="p-1 hover:opacity-80 transition flex items-center gap-1"
                      title={isLoggedIn ? "My Account" : "Sign In"}
                      aria-haspopup="true"
                      aria-expanded={accountMenuOpen}
                    >
                      <User className="h-5 w-5 md:h-6 md:w-6" stroke="#FF3CFE" strokeWidth={1.5} />
                      {isLoggedIn && (
                        <ChevronDown
                          className={`h-3 w-3 hidden md:block transition-transform ${accountMenuOpen ? 'rotate-180' : ''}`}
                          stroke="#FF3CFE"
                          strokeWidth={2}
                        />
                      )}
                    </button>

                    {isLoggedIn && accountMenuOpen && (
                      <>
                        {/* click-outside backdrop */}
                        <button
                          type="button"
                          aria-label="Close menu"
                          className="fixed inset-0 z-40 cursor-default"
                          onClick={() => setAccountMenuOpen(false)}
                        />
                        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
                          <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
                            {storedUser?.email && storedUser?.name && (
                              <p className="text-xs text-gray-500 truncate">{storedUser.email}</p>
                            )}
                          </div>
                          <Link
                            to="/account"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-600 transition"
                          >
                            <User className="h-4 w-4" />
                            My Account
                          </Link>
                          <Link
                            to="/my-orders"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-600 transition"
                          >
                            <Package className="h-4 w-4" />
                            My Orders
                          </Link>
                          <Link
                            to="/wishlist"
                            onClick={() => setAccountMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-600 transition"
                          >
                            <Heart className="h-4 w-4" />
                            Wishlist
                          </Link>
                          <div className="border-t border-gray-100 mt-1 pt-1">
                            <button
                              onClick={handleLogout}
                              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition"
                            >
                              <LogOut className="h-4 w-4" />
                              Logout
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Mobile Menu Button */}
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-1 hover:opacity-80 transition"
                    aria-label="Toggle menu"
                  >
                    {mobileMenuOpen ? <X className="h-5 w-5" stroke="#FF3CFE" strokeWidth={1.5} /> : <Menu className="h-5 w-5" stroke="#FF3CFE" strokeWidth={1.5} />}
                  </button>
                </div>
                </div>
              )}
            </div>
          </div>
        </div>

      {/* Mobile Menu */}
      {!simple && mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-black border-t border-[#FF3CFE] shadow-lg z-40">
          <nav className="px-4 py-4 space-y-3">
            <Link
              to="/shop"
              className="block text-white hover:text-[#FF3CFE] transition text-base font-semibold uppercase py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Shop All
            </Link>
            {visibleCategories.map(({ label, category }) => (
              <Link
                key={category}
                to={`/category/${category}`}
                className="block text-white hover:text-[#FF3CFE] transition text-base font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="pt-3 border-t border-gray-700">
              <div className="flex items-center bg-white rounded-full px-4 py-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-500 outline-none"
                />
                <button type="submit" className="text-gray-600 hover:text-[#FF3CFE] transition">
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>
          </nav>
        </div>
      )}
    </header>
    </>
  );
};

export default Header;
