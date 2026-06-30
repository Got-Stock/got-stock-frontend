import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Eye, EyeOff, ArrowLeft, Heart, ShoppingCart, User } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import Logo from "../components/Logo";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function CustomerLogin() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
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

    try {
      setLoading(true);
      const response = await axios.post(
        `${API}/customer/login`,
        formData,
        { withCredentials: true }
      );

      if (response.data.success) {
        // Use AuthContext login to handle wishlist merge
        await login(response.data.user);
        // Store user data
        localStorage.setItem("user", JSON.stringify(response.data.user));
        // Redirect to account page
        navigate("/account");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed. Please try again.");
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
            <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-200">Sign in to your account</p>
          </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <Input
                id="login-email"
                type="email"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full"
                required
              />
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
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

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-[#00ffef] hover:text-cyan-300 font-medium"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-b from-black to-[#00ffef] hover:opacity-90 text-white py-6 text-base font-semibold"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing In...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-white text-sm">
              Don't have an account?{" "}
              <Link
                to="/customer-signup"
                className="text-[#00ffef] hover:text-cyan-300 font-semibold"
              >
                Create Account
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link
              to="/shop"
              className="text-gray-300 hover:text-white text-sm"
            >
              Continue as Guest
            </Link>
          </div>
        </div>

        {/* Seller Login Link */}
        <div className="mt-6 text-center border-t border-gray-600 pt-4">
          <p className="text-black text-sm mb-2 font-medium">
            Not a customer?
          </p>
          <div className="flex justify-center text-sm">
            <Link
              to="/seller-login"
              className="text-[#007b7a] hover:text-[#005f5e] font-medium hover:underline"
            >
              Seller Login
            </Link>
          </div>
        </div>
      </div>
      </div>
      </div>
    </div>
  );
}
