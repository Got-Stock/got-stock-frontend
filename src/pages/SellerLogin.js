import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

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
    <div className="min-h-screen relative">
      {/* Background Image - Right half (retail stores) */}
      <div 
        className="absolute inset-0 bg-cover bg-right"
        style={{ 
          backgroundImage: `url(https://customer-assets.emergentagent.com/job_shop-ui-redesign/artifacts/3rezo3gm_generated-imaxge%20%284%29.png)`,
          backgroundSize: '200% auto',
          backgroundPosition: 'right center'
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-purple-900/60 to-[#FF3CFE]/40" />
      
      {/* Content */}
      <div className="relative z-10">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4 text-white hover:text-[#FF3CFE]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <div className="flex items-center justify-center min-h-[80vh]">
          <Card className="w-full max-w-md border-[#FF3CFE]/30 bg-black/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-center mb-4">
                <Link to="/">
                  <img 
                    src="https://customer-assets.emergentagent.com/job_product-gateway/artifacts/tabee7q7_GSwhiteonblack.png" 
                    alt="GOT-STOCK - Brands for Hustlers"
                    className="w-full max-w-[300px] h-auto cursor-pointer hover:opacity-80 transition-opacity"
                  />
                </Link>
              </div>
              <CardTitle className="text-2xl text-white">{isLogin ? 'Seller Sign In' : 'Create Seller Account'}</CardTitle>
              <CardDescription className="text-white/70">
                {isLogin ? 'Access your seller dashboard' : 'Join GOT-STOCK as a seller'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-black/40 border-[#FF3CFE]/30 text-white placeholder:text-white/50"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="bg-black/40 border-[#FF3CFE]/30 text-white placeholder:text-white/50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder={isLogin ? 'Enter your password' : 'Minimum 8 characters'}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="bg-black/40 border-[#FF3CFE]/30 text-white placeholder:text-white/50"
                  />
                </div>

                {!isLogin && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Re-enter your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className="bg-black/40 border-[#FF3CFE]/30 text-white placeholder:text-white/50"
                    />
                  </div>
                )}

                {!isLogin && (
                  <div className="bg-[#FF3CFE]/10 border border-[#FF3CFE]/30 rounded-lg p-3 text-sm">
                    <div className="flex items-start">
                      <AlertCircle className="w-4 h-4 text-[#FF3CFE] mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-white">Password Requirements:</p>
                        <ul className="list-disc list-inside mt-1 text-white/70">
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
                  className="w-full bg-gradient-to-r from-[#FF3CFE] to-black hover:opacity-90 text-white py-6 text-base rounded-lg transition-opacity"
                >
                  {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                </Button>
              </form>

              <div className="mt-6 space-y-3">
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setFormData({ email: '', password: '', name: '', confirmPassword: '' });
                  }}
                  className="text-sm text-white/70 hover:text-white w-full text-center"
                >
                  {isLogin ? (
                    <>
                      Don't have an account? <span className="text-[#FF3CFE] font-medium hover:underline">Sign up</span>
                    </>
                  ) : (
                    <>
                      Already have an account? <span className="text-[#FF3CFE] font-medium hover:underline">Sign in</span>
                    </>
                  )}
                </button>

                <div className="border-t border-white/20 pt-3 mt-3 text-center text-sm text-white/70">
                  <Link to="/customer-login" className="text-[#FF3CFE] hover:underline">
                    Are you a customer? Login here
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </div>
  );
};

export default SellerLogin;
