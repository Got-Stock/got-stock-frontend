import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
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
        await login(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/shop");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Signup failed. Please try again.");
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
            Join the hunt for
            <br />
            <span className="gs-gradient-text">big brands, less.</span>
          </h2>
          <p className="mt-4 text-gray-400 max-w-sm">
            Create an account to save your wishlist, track orders and check out in seconds.
          </p>
        </div>

        <div className="relative z-10 hidden md:flex items-center gap-3 text-xs text-gray-500">
          <span>Easy shopping</span>
          <span className="text-[#FF3CFE]">•</span>
          <span>Order tracking</span>
          <span className="text-[#FF3CFE]">•</span>
          <span>Fast delivery</span>
        </div>
      </div>

      {/* Right form panel */}
      <div className="md:w-[55%] flex items-center justify-center p-6 py-10 md:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h1>
            <p className="text-gray-500">Join GOT-STOCK and start shopping</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
              className="w-full bg-[#FF3CFE] hover:bg-[#FF3CFE]/90 text-white py-6 text-base font-semibold rounded-full gs-glow-btn"
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

          <p className="mt-6 text-center text-gray-600 text-sm">
            Already have an account?{" "}
            <Link to="/customer-login" className="text-[#FF3CFE] hover:text-[#FF3CFE]/80 font-semibold">
              Sign In
            </Link>
          </p>

          <div className="mt-3 text-center">
            <Link to="/shop" className="text-gray-500 hover:text-gray-800 text-sm">
              Continue as Guest
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
