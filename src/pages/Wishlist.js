import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import CategoryNav from '../components/CategoryNav';
import Header from '../components/Header';
import axios from 'axios';
import { toast } from 'sonner';
import { AuthContext } from '../context/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Wishlist = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  const fetchWishlist = async () => {
    setLoading(true);
    
    // For non-authenticated users, use localStorage
    if (!user) {
      const savedWishlist = localStorage.getItem('wishlist');
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist));
      }
      setLoading(false);
      return;
    }
    
    // For authenticated users, fetch from backend
    try {
      const response = await axios.get(`${API}/wishlist/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      // Map backend data to frontend format
      const products = response.data.products || [];
      const mappedItems = products.map(product => ({
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.variants?.[0]?.price || 0,
        image: product.media?.images?.[0]
      }));
      
      setWishlistItems(mappedItems);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    // For non-authenticated users, use localStorage
    if (!user) {
      const updatedWishlist = wishlistItems.filter(item => item.id !== productId);
      setWishlistItems(updatedWishlist);
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
      toast.success('Removed from wishlist');
      return;
    }
    
    // For authenticated users, use backend API
    try {
      await axios.delete(`${API}/wishlist/${user.id}/remove/${productId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      const updatedWishlist = wishlistItems.filter(item => item.id !== productId);
      setWishlistItems(updatedWishlist);
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove item');
    }
  };

  const addToCart = (product) => {
    // Add to cart logic
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      toast.info('Item already in cart');
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        image: product.image
      });
      localStorage.setItem('cart', JSON.stringify(cart));
      toast.success('Added to cart');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF3CFE]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <Header />

      {/* Sticky Category Navigation with Search */}
      <CategoryNav />

      <div className="container mx-auto px-4 py-12 flex-grow">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center">
              <Heart className="h-8 w-8 text-[#FF3CFE]" fill="#FF3CFE" />
            </div>
            <h1 className="text-4xl font-bold text-white">My Wishlist</h1>
            <span className="text-gray-300">({wishlistItems.length} items)</span>
          </div>

          {wishlistItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gradient-to-b from-[#FF3CFE] to-black rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-12 w-12 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Your Wishlist is Empty</h2>
              <p className="text-gray-300 mb-8">
                Save your favorite items for later by clicking the heart icon
              </p>
              <Button 
                onClick={() => navigate('/shop')}
                className="bg-gradient-to-b from-[#FF3CFE] to-black hover:opacity-90 text-white px-8 py-6 text-lg"
              >
                Start Shopping
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlistItems.map((item) => (
                <div key={item.id} className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-[#FF3CFE] transition group">
                  <div className="relative aspect-square bg-gray-100">
                    <img
                      src={item.image || "https://placehold.co/400x400?text=No+Image"}
                      alt={item.name}
                      loading="lazy"
                      width="400"
                      height="400"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-red-50 transition"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-semibold">
                      {item.brand || 'Brand'}
                    </p>
                    <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
                      {item.name}
                    </h3>
                    <p className="text-xl font-bold text-[#FF3CFE] mb-4">
                      ${item.price?.toFixed(2) || '0.00'}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => navigate(`/product/${item.id}`)}
                        variant="outline"
                        className="flex-1 border-[#FF3CFE] text-[#FF3CFE] hover:bg-pink-50"
                        size="sm"
                      >
                        View
                      </Button>
                      <Button
                        onClick={() => addToCart(item)}
                        className="flex-1 bg-gradient-to-b from-[#FF3CFE] to-black hover:opacity-90 text-white"
                        size="sm"
                      >
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
