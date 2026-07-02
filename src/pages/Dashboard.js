import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import {
  Package, TrendingUp, TrendingDown, CheckCircle, Clock, LogOut, XCircle,
  PlusCircle, ShoppingBag, ArrowRight, DollarSign, Eye, AlertTriangle,
  ClipboardList, Sparkles, Truck
} from 'lucide-react';
import { toast } from 'sonner';
import { AreaChart, Area, ResponsiveContainer, Tooltip as ReTooltip, XAxis } from 'recharts';
import Logo from '../components/Logo';
import SellerLayout from '../components/SellerLayout';

const fmtMoney = (v, dp = 0) =>
  `$${Number(v || 0).toLocaleString(undefined, { minimumFractionDigits: dp, maximumFractionDigits: dp })}`;

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
};

const ORDER_STATUS = {
  processing: { label: 'Processing', cls: 'bg-amber-100 text-amber-700' },
  paid:       { label: 'Paid',       cls: 'bg-sky-100 text-sky-700' },
  pending:    { label: 'Pending',    cls: 'bg-amber-100 text-amber-700' },
  shipped:    { label: 'Shipped',    cls: 'bg-indigo-100 text-indigo-700' },
  delivered:  { label: 'Delivered',  cls: 'bg-emerald-100 text-emerald-700' },
  cancelled:  { label: 'Cancelled',  cls: 'bg-red-100 text-red-700' },
};

const SkeletonRows = () => (
  <div className="space-y-2">
    {[0, 1, 2].map((i) => <div key={i} className="h-12 animate-pulse rounded-xl bg-gray-100" />)}
  </div>
);

const MiniStat = ({ label, value, tone }) => (
  <div className="rounded-xl bg-gray-50 p-3 text-center">
    <p className={`text-2xl font-bold ${tone}`}>{value}</p>
    <p className="text-xs text-gray-500">{label}</p>
  </div>
);

const AlertRow = ({ tone, text }) => (
  <div className={`truncate rounded-lg px-3 py-2 text-xs font-medium ${tone}`}>{text}</div>
);

const EmptyMini = ({ icon: Icon, text }) => (
  <div className="flex flex-col items-center justify-center py-8 text-center">
    <Icon className="mb-2 h-8 w-8 text-gray-300" />
    <p className="text-sm text-gray-500">{text}</p>
  </div>
);

const KpiCard = ({ loading, label, value, icon: Icon, growth, sub }) => (
  <div className="gs-lift rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <Icon className="h-4 w-4 text-[#FF3CFE]" />
    </div>
    {loading
      ? <div className="mt-2 h-8 w-24 animate-pulse rounded bg-gray-100" />
      : <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>}
    {!loading && growth != null && (
      <p className={`mt-1 flex items-center gap-1 text-xs font-medium ${growth >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
        {growth >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {Math.abs(growth).toFixed(1)}% vs prev period
      </p>
    )}
    {!loading && sub && growth == null && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
  </div>
);

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const { user, logout, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [stats, setStats] = useState(null);
  const [perf, setPerf] = useState(null);
  const [trends, setTrends] = useState([]);
  const [inventory, setInventory] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [ccLoading, setCcLoading] = useState(true);
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

  useEffect(() => {
    if (user?.seller_status === 'approved') {
      fetchCommandCenter();
    } else {
      setCcLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API}/stats`, { withCredentials: true });
      setStats(response.data);
    } catch (e) {
      console.error('Error fetching stats:', e);
    }
  };

  // Pulls the live figures that power the approved-seller command center.
  // Uses allSettled so one slow/failing endpoint never blanks the whole page.
  const fetchCommandCenter = async () => {
    setCcLoading(true);
    try {
      const [ov, tr, inv, pp, ord] = await Promise.allSettled([
        axios.get(`${API}/seller/analytics/overview?days=30`, { withCredentials: true }),
        axios.get(`${API}/seller/analytics/sales-trends?days=30`, { withCredentials: true }),
        axios.get(`${API}/seller/analytics/inventory-status`, { withCredentials: true }),
        axios.get(`${API}/seller/analytics/product-performance`, { withCredentials: true }),
        axios.get(`${API}/seller/orders`, { withCredentials: true }),
      ]);
      if (ov.status === 'fulfilled') setPerf(ov.value.data);
      if (tr.status === 'fulfilled') setTrends(tr.value.data?.trends || []);
      if (inv.status === 'fulfilled') setInventory(inv.value.data);
      if (pp.status === 'fulfilled') setTopProducts((pp.value.data?.products || []).slice(0, 4));
      if (ord.status === 'fulfilled') setRecentOrders(Array.isArray(ord.value.data) ? ord.value.data : []);
    } finally {
      setCcLoading(false);
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
  const firstName = user.name?.split(' ')[0] || 'Seller';

  // Derived signals for the approved-seller command center
  const openOrders = recentOrders.filter((o) =>
    ['processing', 'paid', 'pending'].includes(String(o.status || '').toLowerCase())
  );
  const lowStockList = inventory?.low_stock_products || [];
  const outStockList = inventory?.out_of_stock_products || [];
  const underReview = stats?.pending_products || 0;

  const tasks = [];
  if (openOrders.length) tasks.push({ icon: Truck, tone: 'bg-amber-50 text-amber-600', text: `${openOrders.length} order${openOrders.length > 1 ? 's' : ''} to fulfil`, cta: 'Fulfil', to: '/seller/orders' });
  if (outStockList.length) tasks.push({ icon: XCircle, tone: 'bg-red-50 text-red-600', text: `${outStockList.length} product${outStockList.length > 1 ? 's' : ''} out of stock`, cta: 'Restock', to: '/products' });
  if (lowStockList.length) tasks.push({ icon: AlertTriangle, tone: 'bg-orange-50 text-orange-600', text: `${lowStockList.length} product${lowStockList.length > 1 ? 's' : ''} low on stock`, cta: 'Review', to: '/products' });
  if (underReview) tasks.push({ icon: Clock, tone: 'bg-sky-50 text-sky-600', text: `${underReview} product${underReview > 1 ? 's' : ''} awaiting review`, cta: 'View', to: '/products' });

  const productStatCards = [
    { label: 'Total Products', value: stats?.total_products, icon: Package,     hint: 'Your listings' },
    { label: 'Approved',       value: stats?.approved_products, icon: CheckCircle, hint: 'Live on marketplace' },
    { label: 'Pending Review', value: stats?.pending_products, icon: Clock,      hint: 'Under review' },
    { label: 'Rejected',       value: stats?.rejected_products, icon: XCircle,    hint: 'Needs revision' },
  ];

  return (
    <SellerLayout title={activeTab === 'profile' ? 'Seller Profile' : 'Overview'}>
          {/* ---------------- OVERVIEW ---------------- */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Greeting */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{greeting()}, {firstName}</h2>
                  <p className="mt-1 text-gray-500">
                    {isApproved ? "Here's how your store is performing." : "Here's what's happening with your store."}
                  </p>
                </div>
                {isApproved && (
                  <Button onClick={() => navigate('/products/new-v3')} className="bg-[#FF3CFE] text-white hover:bg-[#FF3CFE]/90">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New Product
                  </Button>
                )}
              </div>

              {isApproved ? (
                <>
                  {/* Action center */}
                  <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                    <div className="mb-3 flex items-center gap-2">
                      <ClipboardList className="h-5 w-5 text-[#FF3CFE]" />
                      <h3 className="font-bold text-gray-900">Action center</h3>
                    </div>
                    {ccLoading ? (
                      <SkeletonRows />
                    ) : tasks.length === 0 ? (
                      <div className="flex items-center gap-3 rounded-xl bg-emerald-50 p-4">
                        <Sparkles className="h-5 w-5 text-emerald-600" />
                        <p className="text-sm font-medium text-emerald-800">You're all caught up — nothing needs your attention right now.</p>
                      </div>
                    ) : (
                      <div className="grid gap-2 sm:grid-cols-2">
                        {tasks.map((t, i) => {
                          const I = t.icon;
                          return (
                            <div key={i} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-3">
                              <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${t.tone}`}>
                                <I className="h-5 w-5" />
                              </div>
                              <p className="flex-1 text-sm font-medium text-gray-800">{t.text}</p>
                              <Button size="sm" variant="ghost" onClick={() => navigate(t.to)} className="text-[#FF3CFE] hover:bg-[#FF3CFE]/10">
                                {t.cta}<ArrowRight className="ml-1 h-4 w-4" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* KPI row */}
                  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <KpiCard loading={ccLoading} label="Revenue (30d)"    value={fmtMoney(perf?.total_revenue)}          icon={DollarSign}  growth={perf?.revenue_growth} />
                    <KpiCard loading={ccLoading} label="Orders (30d)"     value={perf?.total_orders ?? 0}               icon={ShoppingBag} sub={`${perf?.total_items_sold ?? 0} items sold`} />
                    <KpiCard loading={ccLoading} label="Avg order value"  value={fmtMoney(perf?.average_order_value, 2)} icon={TrendingUp} />
                    <KpiCard loading={ccLoading} label="Product views"    value={(perf?.product_views ?? 0).toLocaleString()} icon={Eye} sub={`${perf?.conversion_rate ?? 0}% conversion`} />
                  </div>

                  {/* Sales chart */}
                  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-gray-900">Revenue — last 30 days</h3>
                        <p className="text-sm text-gray-500">Daily sales across your listings</p>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => navigate('/seller/analytics')} className="text-[#FF3CFE] hover:bg-[#FF3CFE]/10">
                        Full analytics<ArrowRight className="ml-1 h-4 w-4" />
                      </Button>
                    </div>
                    {ccLoading ? (
                      <div className="h-52 animate-pulse rounded-xl bg-gray-100" />
                    ) : trends.length === 0 ? (
                      <div className="flex h-52 flex-col items-center justify-center text-center">
                        <TrendingUp className="mb-2 h-10 w-10 text-gray-300" />
                        <p className="text-sm text-gray-500">No sales yet in this period. Your revenue trend will appear here.</p>
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={210}>
                        <AreaChart data={trends} margin={{ top: 5, right: 5, left: 0, bottom: 0 }}>
                          <defs>
                            <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#FF3CFE" stopOpacity={0.35} />
                              <stop offset="100%" stopColor="#FF3CFE" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis
                            dataKey="date"
                            tick={{ fontSize: 11, fill: '#9ca3af' }}
                            tickFormatter={(v) => { const d = new Date(v); return `${d.getMonth() + 1}/${d.getDate()}`; }}
                            axisLine={false}
                            tickLine={false}
                            minTickGap={24}
                          />
                          <ReTooltip formatter={(v) => [fmtMoney(v, 2), 'Revenue']} labelFormatter={(v) => new Date(v).toLocaleDateString()} />
                          <Area type="monotone" dataKey="revenue" stroke="#FF3CFE" strokeWidth={2} fill="url(#revGrad)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  {/* Recent orders + Inventory health */}
                  <div className="grid gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-bold text-gray-900">Recent orders</h3>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/seller/orders')} className="text-[#FF3CFE] hover:bg-[#FF3CFE]/10">View all</Button>
                      </div>
                      {ccLoading ? (
                        <SkeletonRows />
                      ) : recentOrders.length === 0 ? (
                        <EmptyMini icon={ShoppingBag} text="No orders yet — they'll show up here as they come in." />
                      ) : (
                        <div className="divide-y divide-gray-100">
                          {recentOrders.slice(0, 5).map((o) => {
                            const s = ORDER_STATUS[String(o.status || '').toLowerCase()] || { label: o.status || '—', cls: 'bg-gray-100 text-gray-600' };
                            const total = o.total_amount ?? o.total;
                            return (
                              <div key={o.id} className="flex items-center justify-between py-3">
                                <div>
                                  <p className="text-sm font-semibold text-gray-900">Order #{String(o.id).slice(0, 8)}</p>
                                  <p className="text-xs text-gray-500">{o.created_at ? new Date(o.created_at).toLocaleDateString() : ''}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                  {total != null && <span className="text-sm font-semibold text-gray-900">{fmtMoney(total, 2)}</span>}
                                  <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${s.cls}`}>{s.label}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="font-bold text-gray-900">Inventory health</h3>
                        <Button variant="ghost" size="sm" onClick={() => navigate('/products')} className="text-[#FF3CFE] hover:bg-[#FF3CFE]/10">Manage</Button>
                      </div>
                      {ccLoading ? (
                        <SkeletonRows />
                      ) : (
                        <div className="space-y-3">
                          <div className="grid grid-cols-3 gap-3">
                            <MiniStat label="In stock" value={inventory?.in_stock ?? 0} tone="text-emerald-600" />
                            <MiniStat label="Low" value={inventory?.low_stock ?? 0} tone="text-amber-600" />
                            <MiniStat label="Out" value={inventory?.out_of_stock ?? 0} tone="text-red-600" />
                          </div>
                          {(lowStockList.length > 0 || outStockList.length > 0) ? (
                            <div className="space-y-1.5">
                              {outStockList.slice(0, 2).map((p, i) => <AlertRow key={`o${i}`} tone="bg-red-50 text-red-700" text={`${p.name} — out of stock`} />)}
                              {lowStockList.slice(0, 3).map((p, i) => <AlertRow key={`l${i}`} tone="bg-amber-50 text-amber-700" text={`${p.name} — ${p.stock} left`} />)}
                            </div>
                          ) : (
                            <p className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">All products are well stocked.</p>
                          )}
                          {inventory?.total_inventory_value != null && (
                            <div className="flex items-center justify-between border-t border-gray-100 pt-3 text-sm">
                              <span className="text-gray-500">Total inventory value</span>
                              <span className="font-bold text-gray-900">{fmtMoney(inventory.total_inventory_value)}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Top products */}
                  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="font-bold text-gray-900">Top products</h3>
                      <Button variant="ghost" size="sm" onClick={() => navigate('/seller/analytics')} className="text-[#FF3CFE] hover:bg-[#FF3CFE]/10">See all</Button>
                    </div>
                    {ccLoading ? (
                      <SkeletonRows />
                    ) : topProducts.length === 0 ? (
                      <EmptyMini icon={Package} text="No product performance data yet." />
                    ) : (
                      <div className="space-y-2">
                        {topProducts.map((p, i) => (
                          <div key={p.product_id || i} className="flex items-center gap-3 rounded-xl border border-gray-100 p-3">
                            <span className="w-5 text-center text-lg font-bold text-gray-300">{i + 1}</span>
                            {p.image
                              ? <img src={p.image} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                              : <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100"><Package className="h-5 w-5 text-gray-400" /></div>}
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-gray-900">{p.name}</p>
                              <p className="text-xs text-gray-500">{p.brand}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-emerald-600">{fmtMoney(p.revenue)}</p>
                              <p className="text-xs text-gray-500">{p.items_sold} sold</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Catalogue status */}
                  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    {productStatCards.map((s) => {
                      const Icon = s.icon;
                      return (
                        <div key={s.label} className="gs-lift rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
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
                </>
              ) : (
                <>
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
                    <div key={s.label} className="gs-lift rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
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
                      className="group gs-lift flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 text-left shadow-sm hover:border-[#FF3CFE]/40"
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
                </>
              )}
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
