import React, { useState, useEffect, useContext } from 'react';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const WishlistButton = ({ product, className = '' }) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    checkWishlistStatus();
  }, [product.id, user]);

  const checkWishlistStatus = () => {
    // For non-authenticated users, use localStorage
    if (!user) {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const exists = wishlist.some(item => item.id === product.id);
      setIsInWishlist(exists);
    } else {
      // For authenticated users, check backend
      fetchWishlistStatus();
    }
  };

  const fetchWishlistStatus = async () => {
    if (!user) return;
    
    try {
      const response = await axios.get(`${API}/wishlist/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const exists = response.data.items.some(item => item.product_id === product.id);
      setIsInWishlist(exists);
    } catch (error) {
      // Silently fail - user can still use localStorage
      console.error('Error fetching wishlist:', error);
    }
  };

  const toggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // For non-authenticated users, use localStorage
    if (!user) {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      
      if (isInWishlist) {
        // Remove from wishlist
        const updatedWishlist = wishlist.filter(item => item.id !== product.id);
        localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
        setIsInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        // Add to wishlist
        const wishlistItem = {
          id: product.id,
          name: product.name,
          brand: product.brand,
          price: product.variants?.[0]?.price || 0,
          image: product.media?.images?.[0] || product.image
        };
        wishlist.push(wishlistItem);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        setIsInWishlist(true);
        toast.success('Added to wishlist');
      }
      return;
    }
    
    // For authenticated users, use backend API
    try {
      if (isInWishlist) {
        await axios.delete(`${API}/wishlist/${user.id}/remove/${product.id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setIsInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        await axios.post(
          `${API}/wishlist/${user.id}/add`, 
          { product_id: product.id },
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            }
          }
        );
        setIsInWishlist(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      const errorMessage = typeof error.response?.data?.detail === 'string' 
        ? error.response.data.detail 
        : 'Failed to update wishlist';
      toast.error(errorMessage);
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      className={`p-2 rounded-full hover:bg-pink-50 transition group ${className}`}
      title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        className={`h-5 w-5 transition ${
          isInWishlist
            ? 'fill-[#FF3CFE] text-[#FF3CFE]'
            : 'text-gray-400 group-hover:text-[#FF3CFE]'
        }`}
      />
    </button>
  );
};

export default WishlistButton;
