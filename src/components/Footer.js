import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Linkedin, Mail } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import axios from 'axios';
import { toast } from 'sonner';
import { getAllProducts } from '../lib/productCache';
import { getAvailableCategories } from '../lib/categories';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// "Shop" column links (label === /shop?category= value). Only those with stock
// are shown.
const FOOTER_SHOP_LINKS = [
  'Women',
  'Men',
  'Kids & Baby',
  'Home & Living',
  'Health & Beauty',
  'Electronics & Tech',
  'Sports & Outdoors',
  'Watches & Jewellery',
];

const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [availableCategories, setAvailableCategories] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getAllProducts().then((products) => {
      if (cancelled) return;
      setAvailableCategories(getAvailableCategories(products, FOOTER_SHOP_LINKS));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const visibleShopLinks = availableCategories
    ? FOOTER_SHOP_LINKS.filter((c) => availableCategories.has(c))
    : FOOTER_SHOP_LINKS;

  const handleNewsletterSignup = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/api/newsletter/subscribe`, { email });
      toast.success('Successfully subscribed to our newsletter!');
      setEmail('');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Column 1: Shop */}
          <div>
            <h4 className="font-bold mb-4 text-white text-lg">Shop</h4>
            <ul className="space-y-2 text-sm">
              {visibleShopLinks.map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/shop?category=${encodeURIComponent(cat)}`}
                    className="text-gray-300 hover:text-brand-400 transition"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Customer Care */}
          <div>
            <h4 className="font-bold mb-4 text-white text-lg">Customer Care</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/help-centre" className="text-gray-300 hover:text-brand-400 transition">Help Centre</Link></li>
              <li><Link to="/shipping-info" className="text-gray-300 hover:text-brand-400 transition">Shipping Info</Link></li>
              <li><Link to="/returns-refunds" className="text-gray-300 hover:text-brand-400 transition">Returns & Refunds</Link></li>
              <li><Link to="/size-guide" className="text-gray-300 hover:text-brand-400 transition">Size Guide</Link></li>
              <li><Link to="/contact-us" className="text-gray-300 hover:text-brand-400 transition">Contact Us</Link></li>
              <li><Link to="/track-order" className="text-gray-300 hover:text-brand-400 transition">Track My Order</Link></li>
            </ul>
          </div>

          {/* Column 3: About */}
          <div>
            <h4 className="font-bold mb-4 text-white text-lg">About</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about-us" className="text-gray-300 hover:text-brand-400 transition">About Us</Link></li>
              <li><Link to="/mission" className="text-gray-300 hover:text-brand-400 transition">Mission</Link></li>
              <li><Link to="/sustainability" className="text-gray-300 hover:text-brand-400 transition">Sustainability</Link></li>
              <li><Link to="/media-kit" className="text-gray-300 hover:text-brand-400 transition">Media Kit</Link></li>
            </ul>
          </div>

          {/* Column 4: Sell With Us */}
          <div>
            <h4 className="font-bold mb-4 text-white text-lg">Sell With Us</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/become-seller" className="text-gray-300 hover:text-brand-400 transition">Become a Seller</Link></li>
              <li><Link to="/seller-terms" className="text-gray-300 hover:text-brand-400 transition">Seller T&Cs</Link></li>
              <li><Link to="/seller-resources" className="text-gray-300 hover:text-brand-400 transition">Seller Resources</Link></li>
              <li><Link to="/partnerships" className="text-gray-300 hover:text-brand-400 transition">Partnerships</Link></li>
            </ul>
          </div>

          {/* Column 5: Legal */}
          <div>
            <h4 className="font-bold mb-4 text-white text-lg">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/privacy-policy" className="text-gray-300 hover:text-brand-400 transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-300 hover:text-brand-400 transition">Terms & Conditions</Link></li>
              <li><Link to="/terms-of-sale" className="text-gray-300 hover:text-brand-400 transition">Terms of Sale</Link></li>
              <li><Link to="/accessibility" className="text-gray-300 hover:text-brand-400 transition">Accessibility</Link></li>
              <li className="pt-2 border-t border-gray-700">
                <Link to="/admin-login" className="text-brand-300 hover:text-brand-100 font-semibold transition">
                  🔐 Admin Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Signup Section */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-xl font-bold mb-2">Stay Connected</h3>
            <p className="text-gray-400 text-sm mb-4">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
            <form onSubmit={handleNewsletterSignup} className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-gray-800 border-gray-700 text-white placeholder:text-gray-500"
              />
              <Button 
                type="submit" 
                disabled={loading}
                className="bg-brand-600 hover:bg-brand-700 text-white"
              >
                <Mail className="h-4 w-4 mr-2" />
                {loading ? 'Subscribing...' : 'Subscribe'}
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar - Very Important for Branding */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Social Media Icons */}
            <div className="flex items-center gap-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-brand-400 transition"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-brand-400 transition"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-brand-400 transition"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-brand-400 transition"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>

            {/* Copyright & Business Info */}
            <div className="text-center md:text-right">
              <p className="text-sm text-gray-400">
                © Copyright 2025 Got-Stock Marketplace
              </p>
              <p className="text-xs text-gray-500 mt-1">
                ABN - 34559686240 • Melbourne, Australia
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
