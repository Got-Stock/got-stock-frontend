import React, { useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Shield, User, ShoppingBag, ArrowLeft } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Auto-redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else if (user.role === 'seller') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/account', { replace: true });
      }
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-black">
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
          <div className="w-full max-w-4xl">
            <div className="text-center mb-8">
              <Link to="/">
                <img 
                  src="https://customer-assets.emergentagent.com/job_product-gateway/artifacts/afb5g78w_gotstocktextonly.jpg" 
                  alt="GOT-STOCK - Brands for Hustlers"
                  className="w-full max-w-[400px] h-auto mx-auto mb-6 cursor-pointer hover:opacity-80 transition-opacity"
                />
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to GOT-STOCK</h1>
              <p className="text-gray-600">Please select your login type</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
              {/* Customer Login */}
              <Card 
                className="border-blue-200 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => navigate('/customer-login')}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 p-4 rounded-full w-fit group-hover:scale-110 transition-transform">
                    <ShoppingBag className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-xl">Customer</CardTitle>
                  <CardDescription>Shop and manage your orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/customer-login');
                    }}
                  >
                    Customer Login
                  </Button>
                  <p className="text-center text-sm text-gray-600 mt-3">
                    Browse products, track orders, manage your account
                  </p>
                </CardContent>
              </Card>

              {/* Seller Login */}
              <Card 
                className="border-brand-200 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all cursor-pointer group"
                onClick={() => navigate('/seller-login')}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 bg-gradient-to-br from-black to-[#00ffef] p-4 rounded-full w-fit group-hover:scale-110 transition-transform">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-xl">Seller</CardTitle>
                  <CardDescription>Manage your store and products</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full bg-gradient-to-b from-black to-[#00ffef] hover:opacity-90"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate('/seller-login');
                    }}
                  >
                    Seller Login
                  </Button>
                  <p className="text-center text-sm text-gray-600 mt-3">
                    Submit products, track sales, view analytics
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">New to GOT-STOCK?</p>
              <div className="flex justify-center gap-4">
                <Link to="/customer-signup" className="text-blue-600 hover:underline font-medium">
                  Create Customer Account
                </Link>
                <span className="text-gray-400">•</span>
                <Link to="/become-seller" className="text-brand-600 hover:underline font-medium">
                  Become a Seller
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
