import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import {
  DollarSign, ShoppingCart, Package, Users, TrendingUp, TrendingDown,
  Eye, AlertTriangle, CheckCircle, Clock, RefreshCw, Calendar, ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658', '#ff7c7c'];

const AdminAnalyticsDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dateRange, setDateRange] = useState('30');
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    
    fetchAnalytics();
  }, [user, navigate, dateRange]);

  const fetchAnalytics = async (showRefresh = false) => {
    if (showRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    
    try {
      const response = await axios.get(
        `${API}/admin/analytics/comprehensive?days=${dateRange}`,
        { withCredentials: true }
      );
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-[#00ffef] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading comprehensive analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black to-[#00ffef] flex items-center justify-center">
        <p className="text-gray-600">No analytics data available</p>
      </div>
    );
  }

  const { revenue, products, orders, sellers, customers, traffic, daily_trends } = analytics;

  // Prepare chart data
  const paymentStatusData = Object.entries(orders.payment_statuses || {}).map(([name, value]) => ({
    name,
    value
  }));

  const fulfillmentStatusData = Object.entries(orders.fulfillment_statuses || {}).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#00ffef]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Link to="/">
                <img 
                  src="https://customer-assets.emergentagent.com/job_product-gateway/artifacts/tabee7q7_GSwhiteonblack.png" 
                  alt="GOT-STOCK"
                  className="h-12 w-auto cursor-pointer hover:opacity-80 transition-opacity"
                />
              </Link>
              <div className="border-l border-gray-300 pl-3">
                <p className="text-sm font-medium text-gray-700">Comprehensive Analytics</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchAnalytics(true)}
                disabled={refreshing}
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/admin')}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Title and Date Range Selector */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Platform Analytics</h1>
            <p className="text-gray-600 mt-1">Complete performance metrics and insights</p>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 days</SelectItem>
                <SelectItem value="30">Last 30 days</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="365">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* ============ REVENUE METRICS ============ */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Revenue & Financial Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-green-100 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardDescription className="text-gray-600">Total Revenue</CardDescription>
                <CardTitle className="text-3xl font-bold text-green-600">
                  ${revenue.total_revenue?.toLocaleString() || 0}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm">
                  {revenue.revenue_growth_percentage >= 0 ? (
                    <TrendingUp className="w-4 h-4 mr-1 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1 text-red-600" />
                  )}
                  <span className={revenue.revenue_growth_percentage >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {Math.abs(revenue.revenue_growth_percentage || 0).toFixed(1)}% vs previous
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-100 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardDescription className="text-gray-600">Commission Earned</CardDescription>
                <CardTitle className="text-3xl font-bold text-blue-600">
                  ${revenue.commission_earned?.toLocaleString() || 0}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  Platform earnings
                </div>
              </CardContent>
            </Card>

            <Card className="border-purple-100 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardDescription className="text-gray-600">Average Order Value</CardDescription>
                <CardTitle className="text-3xl font-bold text-purple-600">
                  ${revenue.average_order_value?.toFixed(2) || 0}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  Per transaction
                </div>
              </CardContent>
            </Card>

            <Card className="border-orange-100 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardDescription className="text-gray-600">GST Collected</CardDescription>
                <CardTitle className="text-3xl font-bold text-orange-600">
                  ${revenue.gst_collected?.toLocaleString() || 0}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  Tax collection
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ============ ORDER METRICS ============ */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-blue-100 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardDescription>Total Orders</CardDescription>
                <CardTitle className="text-3xl font-bold text-blue-600">
                  {revenue.total_orders?.toLocaleString() || 0}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  {revenue.total_items_sold || 0} items sold
                </div>
              </CardContent>
            </Card>

            <Card className="border-green-100 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardDescription>Successful Orders</CardDescription>
                <CardTitle className="text-3xl font-bold text-green-600">
                  {orders.successful_orders || 0}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  Delivered successfully
                </div>
              </CardContent>
            </Card>

            <Card className="border-yellow-100 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardDescription>Avg Fulfillment Time</CardDescription>
                <CardTitle className="text-3xl font-bold text-yellow-600">
                  {orders.average_fulfillment_days || 0} days
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  From order to delivery
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-100 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardDescription>Refunds & Cancellations</CardDescription>
                <CardTitle className="text-3xl font-bold text-red-600">
                  {(orders.refunded_orders || 0) + (orders.cancelled_orders || 0)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  {orders.refunded_orders || 0} refunded, {orders.cancelled_orders || 0} cancelled
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ============ PRODUCT METRICS ============ */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardDescription>Total Products</CardDescription>
                <CardTitle className="text-3xl font-bold text-gray-900">
                  {products.total_products || 0}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">All listings</div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardDescription>Approved</CardDescription>
                <CardTitle className="text-3xl font-bold text-green-600">
                  {products.approved_products || 0}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">Live products</div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardDescription>Pending Approval</CardDescription>
                <CardTitle className="text-3xl font-bold text-yellow-600">
                  {products.pending_approval || 0}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">Awaiting review</div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardDescription>Low Stock</CardDescription>
                <CardTitle className="text-3xl font-bold text-orange-600">
                  {products.low_stock_products || 0}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">≤10 units</div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardHeader className="pb-2">
                <CardDescription>Stock Value</CardDescription>
                <CardTitle className="text-2xl font-bold text-blue-600">
                  ${products.total_stock_value?.toLocaleString() || 0}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">Total inventory</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ============ SELLER & CUSTOMER METRICS ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Seller Metrics</h2>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardDescription>Total Sellers</CardDescription>
                  <CardTitle className="text-3xl font-bold">{sellers.total_sellers || 0}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600">{sellers.active_sellers || 0} active</div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardDescription>Pending Payouts</CardDescription>
                  <CardTitle className="text-2xl font-bold text-yellow-600">
                    ${sellers.pending_payout_amount?.toLocaleString() || 0}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600">{sellers.pending_payouts_count || 0} transactions</div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Top Performing Sellers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sellers.top_sellers?.slice(0, 5).map((seller, idx) => (
                    <div key={seller.seller_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl font-bold text-gray-400">#{idx + 1}</div>
                        <div>
                          <p className="font-semibold text-gray-900">{seller.business_name}</p>
                          <p className="text-sm text-gray-600">{seller.orders} orders</p>
                        </div>
                      </div>
                      <p className="text-lg font-bold text-green-600">${seller.revenue?.toLocaleString()}</p>
                    </div>
                  )) || <p className="text-gray-600 text-center py-4">No seller data available</p>}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Customer Metrics</h2>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardDescription>Total Customers</CardDescription>
                  <CardTitle className="text-3xl font-bold">{customers.total_customers || 0}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600">{customers.new_customers || 0} new</div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-2">
                  <CardDescription>Avg Customer LTV</CardDescription>
                  <CardTitle className="text-2xl font-bold text-purple-600">
                    ${customers.average_customer_lifetime_value?.toFixed(2) || 0}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-gray-600">Lifetime value</div>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Top States by Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {customers.top_states?.map((state, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl font-bold text-gray-400">#{idx + 1}</div>
                        <p className="font-semibold text-gray-900">{state.state}</p>
                      </div>
                      <p className="text-lg font-bold text-blue-600">{state.count} orders</p>
                    </div>
                  )) || <p className="text-gray-600 text-center py-4">No location data available</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ============ TRAFFIC METRICS ============ */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Traffic & Engagement</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardDescription>Total Product Views</CardDescription>
                <CardTitle className="text-3xl font-bold text-blue-600">
                  {traffic.total_product_views?.toLocaleString() || 0}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">{traffic.unique_products_viewed || 0} products viewed</div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardDescription>Conversion Rate</CardDescription>
                <CardTitle className="text-3xl font-bold text-green-600">
                  {traffic.conversion_rate || 0}%
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">Views to orders</div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardDescription>Engagement Rate</CardDescription>
                <CardTitle className="text-3xl font-bold text-purple-600">
                  {((traffic.unique_products_viewed / products.total_products) * 100).toFixed(1) || 0}%
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">Products viewed / total</div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Most Viewed Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {traffic.top_viewed_products?.slice(0, 5).map((product, idx) => (
                  <div key={product.product_id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-xl font-bold text-gray-400">#{idx + 1}</div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                    </div>
                    <p className="text-sm font-semibold text-blue-600">{product.views} views</p>
                  </div>
                )) || <p className="text-gray-600 text-center py-4">No view data available</p>}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* ============ DAILY TRENDS CHART ============ */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Daily Revenue & Order Trends</CardTitle>
            <CardDescription>Performance over the selected time period</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={daily_trends || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'revenue') return [`$${value.toFixed(2)}`, 'Revenue'];
                    return [value, name];
                  }}
                />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#0088FE" 
                  strokeWidth={2}
                  name="Revenue"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="orders" 
                  stroke="#00C49F" 
                  strokeWidth={2}
                  name="Orders"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="unique_customers" 
                  stroke="#FFBB28" 
                  strokeWidth={2}
                  name="Customers"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* ============ STATUS DISTRIBUTION CHARTS ============ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Order Payment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={paymentStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {paymentStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Order Fulfillment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={fulfillmentStatusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Categories */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Top Product Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={products.top_categories || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="category" type="category" width={150} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default AdminAnalyticsDashboard;
