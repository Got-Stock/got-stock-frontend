import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Package, TrendingUp, CheckCircle, Clock, LogOut, Menu, X, XCircle } from 'lucide-react';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Redirect if not authenticated after loading completes
    if (!loading && !user) {
      navigate('/seller-login');
    }
  }, [loading, user, navigate]);

  useEffect(() => {
    if (user && !user.has_seller_profile && user.role === 'seller') {
      navigate('/seller/register');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/stats`, { withCredentials: true });
      setStats(response.data);
    } catch (e) {
      console.error('Error fetching stats:', e);
    }
  };

  const handleSubmitForReview = async () => {
    try {
      const response = await axios.put(
        `${API}/seller/profile/submit-for-review`,
        {},
        { withCredentials: true }
      );
      
      if (response.data.success) {
        toast.success('Profile submitted for review! Admin will review your application soon.');
        // Reload user context to get updated status
        window.location.reload();
      }
    } catch (error) {
      console.error('Error submitting for review:', error);
      toast.error(error.response?.data?.detail || 'Failed to submit profile for review');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FF3CFE] via-brand-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF3CFE] mx-auto mb-4"></div>
          <p className="text-white">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If not loading and no user, the useEffect above will handle redirect
  if (!user) return null;

  const isAdmin = user.role === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF3CFE] via-brand-900 to-black">
      {/* Header */}
      <header className="bg-black/90 backdrop-blur-sm border-b border-[#FF3CFE]/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Link to="/">
                <img 
                  src="https://customer-assets.emergentagent.com/job_product-gateway/artifacts/tabee7q7_GSwhiteonblack.png" 
                  alt="GOT-STOCK"
                  className="h-12 w-auto cursor-pointer hover:opacity-80 transition-opacity rounded-full"
                />
              </Link>
              <div className="border-l border-gray-300 pl-3">
                <p className="text-sm font-medium text-white/80">{isAdmin ? 'Admin Portal' : 'Seller Portal'}</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-2 mr-4">
                <div className="w-8 h-8 bg-gradient-to-br from-[#FF3CFE] to-black rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{user.name?.charAt(0) || 'U'}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-white">{user.email}</p>
                </div>
              </div>
              <Button 
                onClick={handleLogout}
                data-testid="logout-btn"
                variant="outline"
                size="sm"
                className="border-gray-300 text-white/80 hover:bg-gray-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white/70 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-[#FF3CFE]/30">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-[#FF3CFE] to-black rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{user.name?.charAt(0) || 'U'}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{user.name}</p>
                  <p className="text-xs text-white">{user.email}</p>
                </div>
              </div>
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="w-full border-[#FF3CFE] text-white hover:bg-[#FF3CFE]/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Tabs Navigation - Only for Sellers */}
        {!isAdmin && (
          <div className="bg-black/60 backdrop-blur-sm rounded-t-xl shadow-sm border-b border-[#FF3CFE]/20 mb-0 overflow-x-auto">
            <div className="flex items-center px-4 min-w-max">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-4 font-medium text-sm transition-all whitespace-nowrap ${
                  activeTab === 'overview'
                    ? 'text-[#FF3CFE] border-b-2 border-[#FF3CFE]'
                    : 'text-white/70 hover:text-white border-b-2 border-transparent'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('products')}
                className={`px-6 py-4 font-medium text-sm transition-all whitespace-nowrap ${
                  activeTab === 'products'
                    ? 'text-[#FF3CFE] border-b-2 border-[#FF3CFE]'
                    : 'text-white/70 hover:text-white border-b-2 border-transparent'
                }`}
              >
                My Products
              </button>
              <button
                onClick={() => setActiveTab('submit')}
                className={`px-6 py-4 font-medium text-sm transition-all whitespace-nowrap ${
                  activeTab === 'submit'
                    ? 'text-[#FF3CFE] border-b-2 border-[#FF3CFE]'
                    : 'text-white/70 hover:text-white border-b-2 border-transparent'
                }`}
              >
                Submit Product
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`px-6 py-4 font-medium text-sm transition-all whitespace-nowrap ${
                  activeTab === 'analytics'
                    ? 'text-[#FF3CFE] border-b-2 border-[#FF3CFE]'
                    : 'text-white/70 hover:text-white border-b-2 border-transparent'
                }`}
              >
                Analytics
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className={`px-6 py-4 font-medium text-sm transition-all whitespace-nowrap ${
                  activeTab === 'orders'
                    ? 'text-[#FF3CFE] border-b-2 border-[#FF3CFE]'
                    : 'text-white/70 hover:text-white border-b-2 border-transparent'
                }`}
              >
                Orders
              </button>
              <button
                onClick={() => navigate('/dashboard/tracking')}
                className={`px-6 py-4 font-medium text-sm transition-all whitespace-nowrap text-white/70 hover:text-white border-b-2 border-transparent`}
              >
                Tracking
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-6 py-4 font-medium text-sm transition-all whitespace-nowrap ${
                  activeTab === 'profile'
                    ? 'text-[#FF3CFE] border-b-2 border-[#FF3CFE]'
                    : 'text-white/70 hover:text-white border-b-2 border-transparent'
                }`}
              >
                Profile
              </button>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className={!isAdmin ? "bg-black/60 backdrop-blur-sm rounded-b-xl shadow-lg p-8" : ""}>
        {/* Admin Stats - No Tabs */}
        {isAdmin && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <>
              <Card className="border-[#FF3CFE]/30 bg-black/60 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardDescription className="text-white">Total Products</CardDescription>
                  <CardTitle className="text-3xl font-bold text-white">{stats?.total_products || 0}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-white">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span>Active listings</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#FF3CFE]/30 bg-black/60 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardDescription className="text-white">Pending Products</CardDescription>
                  <CardTitle className="text-3xl font-bold text-white">{stats?.pending_approval || 0}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-white">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Awaiting review</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#FF3CFE]/30 bg-black/60 backdrop-blur-sm hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/admin/sellers')}>
                <CardHeader className="pb-2">
                  <CardDescription className="text-white">Pending Sellers</CardDescription>
                  <CardTitle className="text-3xl font-bold text-white">{stats?.pending_sellers || 0}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-white">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Awaiting approval</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#FF3CFE]/30 bg-black/60 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardDescription className="text-white">Active Sellers</CardDescription>
                  <CardTitle className="text-3xl font-bold text-white">{stats?.active_sellers || 0}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-white/70">
                    <span>of {stats?.total_sellers || 0} total</span>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
        )}

        {/* Seller Stats - Overview Tab */}
        {activeTab === 'overview' && !isAdmin && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <>
              {/* Account Status - Full Width */}
              <Card className="md:col-span-3 border-2 bg-black/60 backdrop-blur-sm shadow-xl">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-white">Seller Account Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Status Display */}
                    <div className="flex items-center justify-between p-4 rounded-lg bg-white border-2 border-[#FF3CFE]/30">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {user?.seller_status === 'approved' && (
                            <>
                              <CheckCircle className="w-8 h-8 text-[#FF3CFE]" />
                              <div>
                                <h3 className="text-xl font-bold text-black">Approved</h3>
                                <p className="text-gray-700">You can now list products on the marketplace</p>
                              </div>
                            </>
                          )}
                          {user?.seller_status === 'pending_review' && (
                            <>
                              <Clock className="w-8 h-8 text-orange-500" />
                              <div>
                                <h3 className="text-xl font-bold text-black">Pending Review</h3>
                                <p className="text-gray-700">Admin is reviewing your application. You'll be notified once approved.</p>
                              </div>
                            </>
                          )}
                          {user?.seller_status === 'onboarding' && (
                            <>
                              <Clock className="w-8 h-8 text-blue-500" />
                              <div>
                                <h3 className="text-xl font-bold text-black">Onboarding</h3>
                                <p className="text-gray-700">Complete your seller profile and submit for approval to start selling</p>
                              </div>
                            </>
                          )}
                          {user?.seller_status === 'rejected' && (
                            <>
                              <XCircle className="w-8 h-8 text-red-500" />
                              <div>
                                <h3 className="text-xl font-bold text-black">Rejected</h3>
                                <p className="text-gray-700">Please update your details and resubmit for review</p>
                              </div>
                            </>
                          )}
                          {user?.seller_status === 'suspended' && (
                            <>
                              <XCircle className="w-8 h-8 text-red-600" />
                              <div>
                                <h3 className="text-xl font-bold text-black">Suspended</h3>
                                <p className="text-gray-700">Contact support for more information</p>
                              </div>
                            </>
                          )}
                          {!user?.seller_status && (
                            <>
                              <Clock className="w-8 h-8 text-blue-500" />
                              <div>
                                <h3 className="text-xl font-bold text-black">Setup Required</h3>
                                <p className="text-gray-700">Complete your seller profile to get started</p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      
                      {/* Submit for Review Button (only show for onboarding status) */}
                      {user?.seller_status === 'onboarding' && (
                        <div className="flex flex-col gap-2">
                          <Button
                            onClick={() => navigate('/seller/register')}
                            variant="outline"
                            className="border-cyan-600 text-cyan-700 hover:bg-cyan-50 px-6 py-3"
                          >
                            Complete Profile
                          </Button>
                          <Button
                            onClick={handleSubmitForReview}
                            className="bg-gradient-to-b from-[#00ffef] to-black hover:opacity-90 text-white px-6 py-3"
                          >
                            Submit for Review
                          </Button>
                        </div>
                      )}
                      
                      {/* Setup Profile Button (show when no status) */}
                      {!user?.seller_status && (
                        <Button
                          onClick={() => navigate('/seller/register')}
                          className="bg-gradient-to-b from-[#00ffef] to-black hover:opacity-90 text-white px-6 py-3"
                        >
                          Setup Profile
                        </Button>
                      )}
                      
                      {/* Edit Profile Link (show for pending_review or rejected) */}
                      {(user?.seller_status === 'pending_review' || user?.seller_status === 'rejected') && (
                        <Button
                          onClick={() => navigate('/seller/register')}
                          variant="outline"
                          className="border-cyan-600 text-cyan-700 hover:bg-cyan-50 px-6 py-3"
                        >
                          View/Edit Profile
                        </Button>
                      )}
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-between mt-6">
                      <div className={`flex-1 text-center ${user?.seller_status ? 'text-white' : 'text-white'}`}>
                        <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${user?.seller_status ? 'bg-green-100 border-2 border-green-600' : 'bg-gray-100 border-2 border-gray-300'}`}>
                          {user?.seller_status ? '✓' : '1'}
                        </div>
                        <p className="text-xs font-semibold">Profile Created</p>
                      </div>
                      <div className={`flex-1 h-1 ${user?.seller_status && user.seller_status !== 'onboarding' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                      <div className={`flex-1 text-center ${user?.seller_status === 'pending_review' || user?.seller_status === 'approved' || user?.seller_status === 'rejected' ? 'text-white' : 'text-white'}`}>
                        <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${user?.seller_status === 'pending_review' || user?.seller_status === 'approved' || user?.seller_status === 'rejected' ? 'bg-orange-100 border-2 border-orange-600' : 'bg-gray-100 border-2 border-gray-300'}`}>
                          {user?.seller_status === 'approved' ? '✓' : user?.seller_status === 'pending_review' || user?.seller_status === 'rejected' ? '⏳' : '2'}
                        </div>
                        <p className="text-xs font-semibold">Submitted for Review</p>
                      </div>
                      <div className={`flex-1 h-1 ${user?.seller_status === 'approved' ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                      <div className={`flex-1 text-center ${user?.seller_status === 'approved' ? 'text-white' : 'text-white'}`}>
                        <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center ${user?.seller_status === 'approved' ? 'bg-green-100 border-2 border-green-600' : 'bg-gray-100 border-2 border-gray-300'}`}>
                          {user?.seller_status === 'approved' ? '✓' : '3'}
                        </div>
                        <p className="text-xs font-semibold">Approved</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stats Cards */}
              <Card className="border-[#FF3CFE]/30 bg-black/60 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardDescription className="text-white">Total Products</CardDescription>
                  <CardTitle className="text-3xl font-bold text-white">{stats?.total_products || 0}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-white">
                    <Package className="w-4 h-4 mr-1" />
                    <span>Your listings</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#FF3CFE]/30 bg-black/60 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardDescription className="text-white">Approved</CardDescription>
                  <CardTitle className="text-3xl font-bold text-white">{stats?.approved_products || 0}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-white">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    <span>Live on marketplace</span>
                  </div>
                </CardContent></Card>

              <Card className="border-[#FF3CFE]/30 bg-black/60 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardDescription className="text-white">Pending Review</CardDescription>
                  <CardTitle className="text-3xl font-bold text-white">{stats?.pending_products || 0}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-white">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>Under review</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#FF3CFE]/30 bg-black/60 backdrop-blur-sm hover:shadow-lg transition-shadow">
                <CardHeader className="pb-2">
                  <CardDescription className="text-white">Rejected</CardDescription>
                  <CardTitle className="text-3xl font-bold text-white">{stats?.rejected_products || 0}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-white">
                    <X className="w-4 h-4 mr-1" />
                    <span>Needs revision</span>
                  </div>
                </CardContent>
              </Card>
            </>
          </div>

          {/* Featured Action - Product Submission */}
          <div className="mb-8 space-y-4">
            {/* Submit for Review Button - Only show for 'onboarding' status */}
            {user?.seller_status === 'onboarding' && (
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl p-6 shadow-lg">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Ready to Submit Your Profile?</h3>
                    <p className="text-white/80 text-sm mb-4">
                      Once you submit your profile for review, our admin team will review your information and approve your seller account. 
                      You'll be able to start listing products after approval.
                    </p>
                  </div>
                  <Button
                    onClick={handleSubmitForReview}
                    size="lg"
                    className="bg-gradient-to-r from-orange-600 to-amber-600 hover:opacity-90 text-white shadow-md hover:shadow-xl transition-all whitespace-nowrap"
                  >
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Submit for Review
                  </Button>
                </div>
              </div>
            )}

            {/* Product submission button - disabled for non-approved sellers */}
            {user?.seller_status === 'approved' ? (
              <Button
                onClick={() => navigate('/products/new-v3')}
                size="lg"
                className="w-full bg-gradient-to-r from-black to-[#ff3cfe] hover:opacity-90 text-white h-20 rounded-xl shadow-xl hover:shadow-2xl transition-all text-xl font-bold"
              >
                <Package className="w-8 h-8 mr-3" />
                Submit New Product
              </Button>
            ) : (
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-300 rounded-xl p-6 shadow-lg">
                <div className="flex items-center gap-4">
                  <div className="bg-gray-300 rounded-full p-3">
                    <Package className="w-8 h-8 text-white/70" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">Product Submission Locked</h3>
                    <p className="text-sm text-white/70">
                      {user?.seller_status === 'onboarding' && 'Submit your profile for review to unlock product submission.'}
                      {user?.seller_status === 'pending_review' && 'Your account is pending approval. Product submission will be available once approved.'}
                      {user?.seller_status === 'rejected' && 'Your account was rejected. Please contact support.'}
                      {user?.seller_status === 'suspended' && 'Your account is suspended. Please contact support.'}
                      {!user?.seller_status && 'Complete your seller profile to list products.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        )}

        {/* Submit Product Tab Content */}
        {activeTab === 'submit' && !isAdmin && (
          <div className="text-center py-12">
            <Package className="w-24 h-24 text-white/50 mx-auto mb-6" />
            {user?.seller_status === 'approved' ? (
              <>
                <h2 className="text-3xl font-bold text-white mb-4">Submit a New Product</h2>
                <p className="text-white/70 mb-8 max-w-xl mx-auto">
                  Fill out the product submission form to add your products to the marketplace. 
                  Your submissions will be reviewed by our team.
                </p>
                <Button
                  onClick={() => navigate('/products/new-v3')}
                  size="lg"
                  className="bg-gradient-to-r from-black to-[#00ffef] hover:opacity-90 text-white px-8 py-6 text-lg"
                >
                  <Package className="w-6 h-6 mr-3" />
                  Start Product Submission
                </Button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-white mb-4">Product Submission Locked</h2>
                <p className="text-white/70 mb-6 max-w-xl mx-auto">
                  {user?.seller_status === 'onboarding' && 'Submit your profile for review to unlock product submission.'}
                  {user?.seller_status === 'pending_review' && 'Your account is pending approval. Product submission will be available once approved.'}
                  {user?.seller_status === 'rejected' && 'Your account was rejected. Please contact support.'}
                  {user?.seller_status === 'suspended' && 'Your account is suspended. Please contact support.'}
                  {!user?.seller_status && 'Complete your seller profile to list products.'}
                </p>
                <Button
                  onClick={() => navigate('/seller/register')}
                  variant="outline"
                  size="lg"
                  className="border-[#FF3CFE] text-[#FF3CFE] hover:bg-[#00ffef]/10"
                >
                  {user?.seller_status === 'onboarding' ? 'Complete Profile' : 'View Profile'}
                </Button>
              </>
            )}
          </div>
        )}

        {/* Products Tab Content */}
        {activeTab === 'products' && !isAdmin && (
          <div className="text-center py-12">
            <Package className="w-24 h-24 text-white/50 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">My Products</h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">
              View and manage all your product listings. Check approval status, edit details, or remove products.
            </p>
            <Button
              onClick={() => navigate('/products')}
              size="lg"
              className="bg-black hover:opacity-90 text-white px-8 py-6 text-lg"
            >
              <Package className="w-6 h-6 mr-3" />
              View All My Products
            </Button>
          </div>
        )}

        {/* Analytics Tab Content */}
        {activeTab === 'analytics' && !isAdmin && (
          <div className="text-center py-12">
            <TrendingUp className="w-24 h-24 text-white/50 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Analytics Dashboard</h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">
              Track your performance with comprehensive analytics. View sales trends, popular products, and customer insights.
            </p>
            <Button
              onClick={() => navigate('/seller/analytics')}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white px-8 py-6 text-lg"
            >
              <TrendingUp className="w-6 h-6 mr-3" />
              Open Analytics Dashboard
            </Button>
          </div>
        )}

        {/* Orders Tab Content */}
        {activeTab === 'orders' && !isAdmin && (
          <div className="text-center py-12">
            <Package className="w-24 h-24 text-white/50 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">Order Management</h2>
            <p className="text-white/70 mb-8 max-w-xl mx-auto">
              View and manage customer orders. Track shipments and update order status.
            </p>
            <Button
              onClick={() => navigate('/seller/orders')}
              size="lg"
              className="bg-gradient-to-r from-brand-600 to-brand-600 hover:opacity-90 text-white px-8 py-6 text-lg"
            >
              <Package className="w-6 h-6 mr-3" />
              View Orders
            </Button>
          </div>
        )}

        {/* Profile Tab Content */}
        {activeTab === 'profile' && !isAdmin && (
          <div className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Seller Profile</h2>
              <p className="text-white">Manage your seller account information</p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white border-2 border-[#FF3CFE]/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  {user?.seller_status === 'approved' && (
                    <>
                      <CheckCircle className="w-8 h-8 text-[#FF3CFE]" />
                      <div>
                        <h3 className="text-xl font-bold text-black">Account Approved</h3>
                        <p className="text-gray-700 text-sm">You can list products on the marketplace</p>
                      </div>
                    </>
                  )}
                  {user?.seller_status === 'pending_review' && (
                    <>
                      <Clock className="w-8 h-8 text-orange-500" />
                      <div>
                        <h3 className="text-xl font-bold text-black">Pending Review</h3>
                        <p className="text-gray-700 text-sm">Admin is reviewing your application</p>
                      </div>
                    </>
                  )}
                  {user?.seller_status === 'onboarding' && (
                    <>
                      <Clock className="w-8 h-8 text-blue-500" />
                      <div>
                        <h3 className="text-xl font-bold text-black">Onboarding</h3>
                        <p className="text-gray-700 text-sm">Complete your profile to start selling</p>
                      </div>
                    </>
                  )}
                  {user?.seller_status === 'rejected' && (
                    <>
                      <XCircle className="w-8 h-8 text-red-500" />
                      <div>
                        <h3 className="text-xl font-bold text-black">Rejected</h3>
                        <p className="text-gray-700 text-sm">Please update and resubmit</p>
                      </div>
                    </>
                  )}
                </div>
                <Button
                  onClick={() => navigate('/seller/register')}
                  variant="outline"
                  className="border-[#FF3CFE] text-[#FF3CFE] hover:bg-[#FF3CFE]/20"
                >
                  {user?.seller_status === 'onboarding' ? 'Complete Profile' : 'View/Edit Profile'}
                </Button>
              </div>

              <div className="bg-white border border-[#FF3CFE]/20 rounded-xl p-6">
                <h3 className="font-semibold text-black mb-4">Account Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">Name</label>
                    <p className="font-medium text-black">{user?.name}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Email</label>
                    <p className="font-medium text-black">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Role</label>
                    <p className="font-medium text-black capitalize">{user?.role}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Admin Quick Actions - Unchanged */}
        {isAdmin && (
          <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-8 border border-[#FF3CFE]/30 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isAdmin ? (
              <>
                <Button
                  onClick={() => navigate('/admin')}
                  data-testid="review-products-btn"
                  size="lg"
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:opacity-90 text-white h-auto py-8 rounded-lg shadow-md hover:shadow-xl transition-all"
                >
                  <div className="text-left w-full">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-6 h-6" />
                      <div className="font-bold text-xl">Admin Portal</div>
                    </div>
                    <div className="text-sm text-orange-100">Review & approve pending submissions</div>
                    {stats?.pending_approval > 0 && (
                      <div className="mt-2 inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                        {stats.pending_approval} pending review
                      </div>
                    )}
                  </div>
                </Button>
                
                <Button
                  onClick={() => navigate('/products')}
                  data-testid="view-all-products-btn"
                  variant="outline"
                  size="lg"
                  className="border-2 border-blue-500 hover:bg-blue-50 h-auto py-8 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  <div className="text-left w-full">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-6 h-6 text-white" />
                      <div className="font-bold text-xl text-white">View All Products</div>
                    </div>
                    <div className="text-sm text-white/70">Browse complete product catalogue</div>
                  </div>
                </Button>

                <Button
                  onClick={() => navigate('/admin/sellers')}
                  data-testid="review-sellers-btn"
                  variant="outline"
                  size="lg"
                  className="border-2 border-brand-500 hover:bg-brand-50 h-auto py-8 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  <div className="text-left w-full">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-6 h-6 text-white" />
                      <div className="font-bold text-xl text-white">Review Sellers</div>
                    </div>
                    <div className="text-sm text-white/70">Approve pending seller applications</div>
                    {stats?.pending_sellers > 0 && (
                      <div className="mt-2 inline-block bg-brand-100 px-3 py-1 rounded-full text-xs font-semibold text-brand-700">
                        {stats.pending_sellers} pending review
                      </div>
                    )}
                  </div>
                </Button>
                
                <Button
                  onClick={() => navigate('/admin/analytics-dashboard')}
                  data-testid="analytics-dashboard-btn"
                  variant="outline"
                  size="lg"
                  className="border-2 border-indigo-500 hover:bg-indigo-50 h-auto py-8 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  <div className="text-left w-full">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-6 h-6 text-indigo-600" />
                      <div className="font-bold text-xl text-indigo-600">Analytics Dashboard</div>
                    </div>
                    <div className="text-sm text-white/70">Comprehensive platform analytics & insights</div>
                  </div>
                </Button>

                <Button
                  onClick={() => navigate('/admin/tracking')}
                  data-testid="tracking-btn"
                  variant="outline"
                  size="lg"
                  className="border-2 border-cyan-500 hover:bg-cyan-50 h-auto py-8 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  <div className="text-left w-full">
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-6 h-6 text-cyan-600" />
                      <div className="font-bold text-xl text-cyan-600">Track Shipments</div>
                    </div>
                    <div className="text-sm text-white/70">Monitor delivery status across 800+ carriers</div>
                  </div>
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => navigate('/products/new-v3')}
                  data-testid="submit-product-btn"
                  size="lg"
                  disabled={user?.seller_status !== 'approved'}
                  className="bg-gradient-to-r from-black to-[#ff3cfe] hover:opacity-90 text-white h-auto py-6 rounded-lg shadow-md hover:shadow-lg transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <div className="text-left">
                    <div className="font-bold text-lg">Submit New Product</div>
                    <div className="text-sm text-blue-100">
                      {user?.seller_status === 'approved' 
                        ? 'Add a new product to the marketplace'
                        : 'Available after account approval'}
                    </div>
                  </div>
                </Button>
              </>
            )}
          </div>
        </div>
        )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
