import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Shield, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

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
      
      console.log('Login response:', response.data);
      
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
    <div className="min-h-screen bg-gradient-to-b from-black to-[#00ffef]">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4 text-white hover:text-[#00ffef]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="flex items-center justify-center min-h-[80vh]">
          <Card className="w-full max-w-md border-purple-200 bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="bg-gradient-to-br from-black to-[#00ffef] p-4 rounded-full">
                  <Shield className="w-12 h-12 text-white" />
                </div>
              </div>
              <div className="flex items-center justify-center mb-4">
                <Link to="/">
                  <img 
                    src="https://customer-assets.emergentagent.com/job_product-gateway/artifacts/afb5g78w_gotstocktextonly.jpg" 
                    alt="GOT-STOCK - Brands for Hustlers"
                    className="w-full max-w-[300px] h-auto cursor-pointer hover:opacity-80 transition-opacity"
                  />
                </Link>
              </div>
              <CardTitle className="text-2xl text-center">Admin Access</CardTitle>
              <CardDescription className="text-center">
                Secure administrator portal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Admin Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="admin@got-stock.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Admin Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-b from-black to-[#00ffef] hover:opacity-90 text-white py-6 text-base rounded-lg transition-opacity"
                >
                  {loading ? 'Authenticating...' : 'Sign In as Admin'}
                </Button>
              </form>

              <div className="mt-6 border-t pt-4 text-center text-sm text-gray-600">
                <Link to="/customer-login" className="text-blue-600 hover:underline">
                  Customer Login
                </Link>
                <span className="mx-2">•</span>
                <Link to="/seller-login" className="text-blue-600 hover:underline">
                  Seller Login
                </Link>
              </div>

              <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-900 text-center">
                <Shield className="w-4 h-4 inline mr-1" />
                Authorized personnel only
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
