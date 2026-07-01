import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import Logo from '../components/Logo';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const SellerLogin = () => {
  const { user, setUser, checkAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });

  // Don't redirect on page load - let them log in first
  // Redirect happens after successful login in handleSubmit

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const response = await axios.post(`${API}/auth/login`, {
          email: formData.email,
          password: formData.password
        }, { withCredentials: true });
        
        // Check if user is a seller
        if (response.data.user && response.data.user.role !== 'seller') {
          toast.error('This login is for sellers only. Please use the appropriate login page.');
          await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
          setLoading(false);
          return;
        }

        toast.success('Login successful!');
        
        // Update auth context immediately with user data from login response
        setUser(response.data.user);
        
        // Then navigate using React Router (no page reload)
        if (response.data.user.has_seller_profile) {
          navigate('/dashboard');
        } else {
          navigate('/seller/register');
        }
        
        setLoading(false);
      } else {
        // Signup
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          setLoading(false);
          return;
        }

        if (formData.password.length < 8) {
          toast.error('Password must be at least 8 characters');
          setLoading(false);
          return;
        }

        const signupResponse = await axios.post(`${API}/auth/signup`, {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          role: 'seller'
        }, { withCredentials: true });
        
        toast.success('Account created successfully! Redirecting...');
        
        // Update auth context immediately with user data from signup response
        if (signupResponse.data && signupResponse.data.user) {
          setUser(signupResponse.data.user);
        }
        
        // Use window.location to force a full page load with cookies
        // This ensures the session cookie is available on the next page
        window.location.href = '/seller/register';
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Left brand panel */}
      <div className="relative md:w-[45%] bg-black text-white flex flex-col justify-between overflow-hidden p-8 md:p-12">
        <div className="gs-aurora gs-glow pointer-events-none absolute -top-24 -left-16 h-80 w-80 rounded-full bg-[#FF3CFE]/25 blur-3xl" />
        <div className="gs-aurora gs-glow pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-[#FF3CFE]/15 blur-3xl" />

        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <div className="relative z-10 py-10 md:py-0">
          <Logo to="/" size="lg" priority className="mb-6" />
          <h2 className="text-3xl md:text-4xl font-black leading-tight">
            Turn dead stock
            <br />
            <span className="gs-gradient-text">into revenue.</span>
          </h2>
          <p className="mt-4 text-gray-400 max-w-sm">
            Reach thousands of Australian shoppers. List your big-brand overstock and start selling in minutes.
          </p>
        </div>

        <div className="relative z-10 hidden md:flex items-center gap-3 text-xs text-gray-500">
          <span>No setup fees</span>
          <span className="text-[#FF3CFE]">•</span>
          <span>Secure payments</span>
          <span className="text-[#FF3CFE]">•</span>
          <span>Dedicated support</span>
        </div>
      </div>

      {/* Right form panel */}
      <div className="md:w-[55%] flex items-center justify-center p-6 py-10 md:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Seller Sign In' : 'Create Seller Account'}
            </h1>
            <p className="text-gray-500">
              {isLogin ? 'Access your seller dashboard' : 'Join GOT-STOCK as a seller'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder={isLogin ? 'Enter your password' : 'Minimum 8 characters'}
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full"
                />
              </div>
            )}

            {!isLogin && (
              <div className="bg-[#FF3CFE]/10 border border-[#FF3CFE]/30 rounded-lg p-3 text-sm">
                <div className="flex items-start">
                  <AlertCircle className="w-4 h-4 text-[#FF3CFE] mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Password Requirements:</p>
                    <ul className="list-disc list-inside mt-1 text-gray-600">
                      <li>At least 8 characters long</li>
                      <li>Mix of letters and numbers recommended</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF3CFE] hover:bg-[#FF3CFE]/90 text-white py-6 text-base font-semibold rounded-full gs-glow-btn"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>
          </form>

          <div className="mt-6 space-y-3">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setFormData({ email: '', password: '', name: '', confirmPassword: '' });
              }}
              className="text-sm text-gray-600 hover:text-gray-900 w-full text-center"
            >
              {isLogin ? (
                <>
                  Don't have an account? <span className="text-[#FF3CFE] font-semibold hover:underline">Sign up</span>
                </>
              ) : (
                <>
                  Already have an account? <span className="text-[#FF3CFE] font-semibold hover:underline">Sign in</span>
                </>
              )}
            </button>

            <div className="border-t border-gray-200 pt-3 mt-3 text-center text-sm text-gray-500">
              <Link to="/customer-login" className="text-[#FF3CFE] hover:underline font-medium">
                Are you a customer? Login here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerLogin;
