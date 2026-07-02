import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import {
  Package, TrendingUp, CheckCircle, Clock, LogOut, XCircle,
  PlusCircle, ShoppingBag, ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import Logo from '../components/Logo';
import SellerLayout from '../components/SellerLayout';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [stats, setStats] = useState(null);
  const activeTab = searchParams.get('tab') === 'profile' ? 'profile' : 'overview';

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF3CFE] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If not loading and no user, the useEffect above will handle redirect
  if (!user) return null;

  const isAdmin = user.role === 'admin';

  /* =========================================================
     ADMIN VIEW — kept on the existing layout (out of scope for
     the seller-portal redesign; preserved so admins are unaffected).
     ========================================================= */
  if (isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FF3CFE] via-brand-900 to-black">
        <header className="bg-black/90 backdrop-blur-sm border-b border-[#FF3CFE]/20 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <Logo to="/" size="sm" />
                <div className="border-l border-gray-300 pl-3">
                  <p className="text-sm font-medium text-white/80">Admin Portal</p>
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
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
          </div>

          <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-8 border border-[#FF3CFE]/30 shadow-lg">
            <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            </div>
          </div>
        </main>
      </div>
    );
  }

  /* =========================================================
     SELLER PORTAL — content rendered inside the shared shell.
     ========================================================= */
  const statusMeta = {
    approved:       { icon: CheckCircle, tone: 'text-emerald-600', bg: 'bg-emerald-50', ring: 'ring-emerald-200', title: 'Approved',        blurb: 'You can list products on the marketplace.' },
    pending_review: { icon: Clock,       tone: 'text-amber-600',   bg: 'bg-amber-50',   ring: 'ring-amber-200',   title: 'Pending Review',   blurb: "Admin is reviewing your application. You'll be notified once approved." },
    onboarding:     { icon: Clock,       tone: 'text-sky-600',     bg: 'bg-sky-50',     ring: 'ring-sky-200',     title: 'Onboarding',       blurb: 'Complete your seller profile and submit for approval to start selling.' },
    rejected:       { icon: XCircle,     tone: 'text-red-600',     bg: 'bg-red-50',     ring: 'ring-red-200',     title: 'Rejected',         blurb: 'Please update your details and resubmit for review.' },
    suspended:      { icon: XCircle,     tone: 'text-red-600',     bg: 'bg-red-50',     ring: 'ring-red-200',     title: 'Suspended',        blurb: 'Contact support for more information.' },
  };
  const status = user?.seller_status;
  const meta = statusMeta[status] || { icon: Clock, tone: 'text-sky-600', bg: 'bg-sky-50', ring: 'ring-sky-200', title: 'Setup Required', blurb: 'Complete your seller profile to get started.' };
  const StatusIcon = meta.icon;
  const isApproved = status === 'approved';

  return (
    <SellerLayout title={activeTab === 'profile' ? 'Seller Profile' : 'Overview'}>
          {/* ---------------- OVERVIEW ---------------- */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Welcome back, {user.name?.split(' ')[0] || 'Seller'}</h2>
                <p className="mt-1 text-gray-500">Here's what's happening with your store.</p>
              </div>

              {/* Account status */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${meta.bg} ring-1 ${meta.ring}`}>
                      <StatusIcon className={`h-6 w-6 ${meta.tone}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-gray-900">{meta.title}</h3>
                      </div>
                      <p className="mt-0.5 max-w-md text-sm text-gray-500">{meta.blurb}</p>
                    </div>
                  </div>

                  <div className="flex flex-shrink-0 flex-col gap-2 sm:items-end">
                    {status === 'onboarding' && (
                      <>
                        <Button
                          onClick={handleSubmitForReview}
                          className="bg-[#FF3CFE] text-white hover:bg-[#FF3CFE]/90"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Submit for Review
                        </Button>
                        <Button
                          onClick={() => navigate('/seller/register')}
                          variant="outline"
                          className="border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          Complete Profile
                        </Button>
                      </>
                    )}
                    {!status && (
                      <Button
                        onClick={() => navigate('/seller/register')}
                        className="bg-[#FF3CFE] text-white hover:bg-[#FF3CFE]/90"
                      >
                        Setup Profile
                      </Button>
                    )}
                    {(status === 'pending_review' || status === 'rejected') && (
                      <Button
                        onClick={() => navigate('/seller/register')}
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        View / Edit Profile
                      </Button>
                    )}
                  </div>
                </div>

                {/* Progress steps */}
                <div className="mt-6 flex items-center">
                  {[
                    { label: 'Profile Created', done: !!status },
                    { label: 'Submitted for Review', done: status === 'pending_review' || status === 'approved' || status === 'rejected' },
                    { label: 'Approved', done: status === 'approved' },
                  ].map((step, i, arr) => (
                    <React.Fragment key={step.label}>
                      <div className="flex flex-col items-center text-center">
                        <div className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold ${
                          step.done
                            ? 'border-[#FF3CFE] bg-[#FF3CFE] text-white'
                            : 'border-gray-300 bg-white text-gray-400'
                        }`}>
                          {step.done ? '✓' : i + 1}
                        </div>
                        <p className="mt-1.5 text-xs font-medium text-gray-600">{step.label}</p>
                      </div>
                      {i < arr.length - 1 && (
                        <div className={`mx-2 h-0.5 flex-1 ${arr[i + 1].done ? 'bg-[#FF3CFE]' : 'bg-gray-200'}`} />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {[
                  { label: 'Total Products', value: stats?.total_products, icon: Package,     hint: 'Your listings' },
                  { label: 'Approved',       value: stats?.approved_products, icon: CheckCircle, hint: 'Live on marketplace' },
                  { label: 'Pending Review', value: stats?.pending_products, icon: Clock,      hint: 'Under review' },
                  { label: 'Rejected',       value: stats?.rejected_products, icon: XCircle,    hint: 'Needs revision' },
                ].map((s) => {
                  const Icon = s.icon;
                  return (
                    <div key={s.label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-500">{s.label}</p>
                        <Icon className="h-4 w-4 text-[#FF3CFE]" />
                      </div>
                      <p className="mt-2 text-3xl font-bold text-gray-900">{s.value || 0}</p>
                      <p className="mt-1 text-xs text-gray-400">{s.hint}</p>
                    </div>
                  );
                })}
              </div>

              {/* Onboarding submit prompt */}
              {status === 'onboarding' && (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Ready to submit your profile?</h3>
                      <p className="mt-1 max-w-xl text-sm text-gray-600">
                        Once you submit, our team reviews your information and approves your seller account.
                        You can start listing products right after approval.
                      </p>
                    </div>
                    <Button
                      onClick={handleSubmitForReview}
                      size="lg"
                      className="whitespace-nowrap bg-amber-600 text-white hover:bg-amber-700"
                    >
                      <CheckCircle className="mr-2 h-5 w-5" />
                      Submit for Review
                    </Button>
                  </div>
                </div>
              )}

              {/* Primary action */}
              {isApproved ? (
                <button
                  onClick={() => navigate('/products/new-v3')}
                  className="group flex w-full items-center justify-between rounded-2xl bg-gradient-to-r from-black to-[#FF3CFE] p-6 text-left text-white shadow-lg transition-all hover:shadow-2xl"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/15">
                      <PlusCircle className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="text-xl font-bold">Submit a New Product</p>
                      <p className="text-sm text-white/80">Add your overstock to the marketplace in minutes.</p>
                    </div>
                  </div>
                  <ArrowRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
                </button>
              ) : (
                <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-6">
                  <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-xl bg-gray-100">
                    <Package className="h-8 w-8 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Product Submission Locked</h3>
                    <p className="text-sm text-gray-500">
                      {status === 'onboarding' && 'Submit your profile for review to unlock product submission.'}
                      {status === 'pending_review' && 'Your account is pending approval. Submission unlocks once approved.'}
                      {status === 'rejected' && 'Your account was rejected. Please contact support.'}
                      {status === 'suspended' && 'Your account is suspended. Please contact support.'}
                      {!status && 'Complete your seller profile to list products.'}
                    </p>
                  </div>
                </div>
              )}

              {/* Quick links */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { label: 'My Products', desc: 'View & manage listings', icon: Package,     to: '/products' },
                  { label: 'Orders',      desc: 'Track & fulfil orders',  icon: ShoppingBag, to: '/seller/orders' },
                  { label: 'Analytics',   desc: 'Sales & performance',    icon: TrendingUp,  to: '/seller/analytics' },
                ].map((q) => {
                  const Icon = q.icon;
                  return (
                    <button
                      key={q.label}
                      onClick={() => navigate(q.to)}
                      className="group flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm transition-all hover:border-[#FF3CFE]/40 hover:shadow-md"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FF3CFE]/10 text-[#FF3CFE]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{q.label}</p>
                        <p className="text-sm text-gray-500">{q.desc}</p>
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-[#FF3CFE]" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ---------------- PROFILE ---------------- */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Seller Profile</h2>
                <p className="mt-1 text-gray-500">Manage your seller account information.</p>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl ${meta.bg} ring-1 ${meta.ring}`}>
                    <StatusIcon className={`h-6 w-6 ${meta.tone}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{meta.title}</h3>
                    <p className="text-sm text-gray-500">{meta.blurb}</p>
                  </div>
                </div>
                <Button
                  onClick={() => navigate('/seller/register')}
                  variant="outline"
                  className="mt-4 border-[#FF3CFE] text-[#FF3CFE] hover:bg-[#FF3CFE]/10"
                >
                  {status === 'onboarding' ? 'Complete Profile' : 'View / Edit Profile'}
                </Button>
              </div>

              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="mb-4 font-semibold text-gray-900">Account Information</h3>
                <dl className="space-y-4">
                  <div>
                    <dt className="text-sm text-gray-500">Name</dt>
                    <dd className="font-medium text-gray-900">{user?.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Email</dt>
                    <dd className="font-medium text-gray-900">{user?.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Role</dt>
                    <dd className="font-medium capitalize text-gray-900">{user?.role}</dd>
                  </div>
                </dl>
              </div>
            </div>
          )}
    </SellerLayout>
  );
};

export default Dashboard;
