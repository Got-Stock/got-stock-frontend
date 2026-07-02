import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Shield, ArrowLeft, Lock } from 'lucide-react';
import { toast } from 'sonner';
import Logo from '../components/Logo';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const AdminLogin = () => {
  const { user, setUser, checkAuth } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  useEffect(() => {
    if (user && user.role === 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(`${API}/auth/login`, {
        email: formData.email,
        password: formData.password
      }, { withCredentials: true });

      // Check if user is an admin
      if (response.data.user && response.data.user.role !== 'admin') {
        toast.error('This login is for administrators only. Please use the appropriate login page.');
        await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
        setLoading(false);
        return;
      }

      toast.success('Login successful! Redirecting to admin dashboard...');

      // Update auth context immediately with user data from login response
      if (response.data.user) {
        setUser(response.data.user);
      }

      // Refresh auth state then navigate using React Router
      await checkAuth();
      navigate('/admin/home');
      setLoading(false);
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.detail || 'Authentication failed');
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
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-400 mb-5">
            <Shield className="h-3.5 w-3.5" />
            Control Centre
          </div>
          <h2 className="text-3xl md:text-4xl font-black leading-tight">
            Run the
            <br />
            <span className="gs-gradient-text">marketplace.</span>
          </h2>
          <p className="mt-4 text-gray-400 max-w-sm">
            Manage products, sellers, orders and analytics from the Got-Stock administrator portal.
          </p>
        </div>

        <div className="relative z-10 hidden md:flex items-center gap-3 text-xs text-gray-500">
          <span>Restricted access</span>
          <span className="text-[#FF3CFE]">•</span>
          <span>Encrypted session</span>
          <span className="text-[#FF3CFE]">•</span>
          <span>Audit logged</span>
        </div>
      </div>

      {/* Right form panel */}
      <div className="md:w-[55%] flex items-center justify-center p-6 py-10 md:p-12">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Sign In</h1>
            <p className="text-gray-500">Secure administrator portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="admin@got-stock.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Admin Password</label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF3CFE] hover:bg-[#FF3CFE]/90 text-white py-6 text-base font-semibold rounded-full gs-glow-btn"
            >
              {loading ? 'Authenticating...' : 'Sign In as Admin'}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-center gap-2 rounded-lg bg-brand-50 border border-brand-100 p-3 text-xs text-brand-900">
            <Lock className="h-3.5 w-3.5" />
            Authorized personnel only. Activity is monitored.
          </div>

          <div className="mt-6 border-t border-gray-200 pt-4 text-center text-sm text-gray-500">
            <Link to="/customer-login" className="text-[#FF3CFE] hover:underline font-medium">
              Customer Login
            </Link>
            <span className="mx-2">•</span>
            <Link to="/seller-login" className="text-[#FF3CFE] hover:underline font-medium">
              Seller Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
