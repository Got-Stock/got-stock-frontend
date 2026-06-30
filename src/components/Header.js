import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, User, Menu, X, ShoppingCart, Search } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import CartBadge from './CartBadge';
import Logo from './Logo';

const Header = ({ simple = false, logoVisibility = 'all' }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogin = () => {
    if (user) {
      navigate('/account');
    } else {
      navigate('/customer-login');
    }
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

                  {/* User Icon */}
                  <button 
                    onClick={handleLogin}
                    className="p-1 hover:opacity-80 transition"
                    title={user ? "My Account" : "Sign In"}
                  >
                    <User className="h-5 w-5 md:h-6 md:w-6" stroke="#FF3CFE" strokeWidth={1.5} />
                  </button>

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
            <Link 
              to="/fashion" 
              className="block text-white hover:text-[#FF3CFE] transition text-base font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Fashion
            </Link>
            <Link 
              to="/beauty" 
              className="block text-white hover:text-[#FF3CFE] transition text-base font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Beauty
            </Link>
            <Link 
              to="/home" 
              className="block text-white hover:text-[#FF3CFE] transition text-base font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/electronics" 
              className="block text-white hover:text-[#FF3CFE] transition text-base font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Electronics
            </Link>
            <Link 
              to="/watches" 
              className="block text-white hover:text-[#FF3CFE] transition text-base font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Watches
            </Link>
            <Link 
              to="/sports" 
              className="block text-white hover:text-[#FF3CFE] transition text-base font-medium py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sports
            </Link>
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
