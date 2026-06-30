import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Auth context
export const AuthContext = React.createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API}/auth/me`, {
        withCredentials: true
      });
      const userData = response.data;
      
      // If user just logged in and there are items in localStorage wishlist, merge them
      if (userData && !user) {
        await mergeGuestWishlist(userData);
      }
      
      setUser(userData);
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const mergeGuestWishlist = async (userData) => {
    try {
      const guestWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      
      if (guestWishlist.length > 0) {
        console.log('Merging guest wishlist items:', guestWishlist.length);
        
        // Add each guest wishlist item to the authenticated user's wishlist
        for (const item of guestWishlist) {
          try {
            await axios.post(
              `${API}/wishlist/${userData.id}/add`,
              { product_id: item.id },
              {
                headers: {
                  'Authorization': `Bearer ${localStorage.getItem('token')}`,
                  'Content-Type': 'application/json'
                }
              }
            );
          } catch (error) {
            // Ignore errors for items already in wishlist
            if (error.response?.status !== 400) {
              console.error('Error merging wishlist item:', error);
            }
          }
        }
        
        // Clear guest wishlist after successful merge
        localStorage.removeItem('wishlist');
        console.log('Guest wishlist merged and cleared');
      }
    } catch (error) {
      console.error('Error merging guest wishlist:', error);
    }
  };

  const login = async (userData) => {
    // Merge guest wishlist before setting user
    await mergeGuestWishlist(userData);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
      setUser(null);
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, checkAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
