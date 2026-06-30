import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ShoppingBag, Eye, EyeOff, ArrowLeft, Heart, ShoppingCart, User } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import Logo from "../components/Logo";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function CustomerSignup() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${API}/customer/signup`,
        {
          name: formData.name,
          email: formData.email,
          password: formData.password
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Use AuthContext login to handle wishlist merge
        await login(response.data.user);
        // Store user data
        localStorage.setItem("user", JSON.stringify(response.data.user));
        // Redirect to shop
        navigate("/shop");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative py-12 px-4">
      {/* Background Image - Left half (atrium/lobby) */}
      <div 
        className="absolute inset-0 bg-cover bg-left"
        style={{ 
          backgroundImage: `url(https://customer-assets.emergentagent.com/job_shop-ui-redesign/artifacts/3rezo3gm_generated-imaxge%20%284%29.png)`,
          backgroundSize: '200% auto',
          backgroundPosition: 'left center'
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-[#00ffef]/40" />
      
      {/* Content */}
      <div className="relative z-10">
      {/* Header with Back Button and Icons */}
      <div className="container mx-auto mb-8">
        <div className="flex items-center justify-between">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-[#00ffef] hover:text-cyan-300"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          {/* Right Side: Navigation Links + Icons */}
          <div className="flex items-center gap-6">
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-4 text-[#00ffef]" style={{ fontFamily: 'Roboto, sans-serif', fontSize: '10px' }}>
              <Link to="/help-centre" className="hover:text-cyan-300 transition">
                FAQs
              </Link>
              <Link to="/shipping-info" className="hover:text-cyan-300 transition">
                Delivery
              </Link>
              <Link to="/returns-refunds" className="hover:text-cyan-300 transition">
                Returns
              </Link>
              <Link to="/contact-us" className="hover:text-cyan-300 transition">
                Contact
              </Link>
            </div>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <Link to="/wishlist" className="p-2 hover:opacity-80 transition">
                <Heart className="h-6 w-6 text-[#00ffef]" fill="none" strokeWidth={1.5} />
              </Link>
              <Link to="/cart" className="p-2 hover:opacity-80 transition">
                <ShoppingCart className="h-6 w-6 text-[#00ffef]" strokeWidth={1.5} />
              </Link>
              <Link to="/login" className="p-2 hover:opacity-80 transition">
                <User className="h-6 w-6 text-[#00ffef]" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="text-center mb-8">
            <Logo to="/" size="hero" priority className="mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-200">Join GOT-STOCK and start shopping</p>
          </div>

        {/* Signup Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="signup-name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <Input
                id="signup-name"
                type="text"
                name="name"
                autoComplete="name"
                autoFocus
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full"
                required
              />
            </div>

            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <Input
                id="signup-email"
                type="email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full"
                required
              />
            </div>

            <div>
              <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className="w-full pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Input
                  id="signup-confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-b from-black to-[#00ffef] hover:opacity-90 text-white py-6 text-base font-semibold"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white text-sm">
              Already have an account?{" "}
              <Link
                to="/customer-login"
                className="text-[#00ffef] hover:text-cyan-300 font-semibold"
              >
                Sign In
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link
              to="/shop"
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Continue as Guest
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-[#00ffef] mb-2">
              <ShoppingBag size={24} className="mx-auto" />
            </div>
            <p className="text-xs text-gray-200">Easy Shopping</p>
          </div>
          <div>
            <div className="text-[#00ffef] mb-2">
              <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xs text-gray-200">Order Tracking</p>
          </div>
          <div>
            <div className="text-[#00ffef] mb-2">
              <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
            </div>
            <p className="text-xs text-gray-200">Fast Delivery</p>
          </div>
        </div>
      </div>
      </div>
      </div>
    </div>
  );
}
