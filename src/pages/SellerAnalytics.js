import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Eye, 
  Package, 
  Users, 
  AlertTriangle,
  Settings,
  X,
  LogOut,
  Menu,
  Calendar
} from 'lucide-react';
import { toast } from 'sonner';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const SellerAnalytics = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Analytics data
  const [overview, setOverview] = useState(null);
  const [salesTrends, setSalesTrends] = useState([]);
  const [productPerformance, setProductPerformance] = useState([]);
  const [customerInsights, setCustomerInsights] = useState(null);
  const [inventoryStatus, setInventoryStatus] = useState(null);
  
  // Feature toggles and preferences
  const [featureToggles, setFeatureToggles] = useState({});
  const [visibleWidgets, setVisibleWidgets] = useState([]);
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => {
    if (!user || (user.role !== 'seller' && user.role !== 'admin')) {
      navigate('/');
      return;
    }
    
    fetchAllData();
  }, [user, navigate, dateRange]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchFeatureToggles(),
        fetchUserPreferences(),
        fetchOverview(),
        fetchSalesTrends(),
        fetchProductPerformance(),
        fetchCustomerInsights(),
        fetchInventoryStatus()
      ]);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const fetchFeatureToggles = async () => {
    try {
      const response = await axios.get(`${API}/admin/analytics/feature-toggles`, { withCredentials: true });
      const togglesMap = {};
      response.data.toggles.forEach(toggle => {
        togglesMap[toggle.feature_name] = toggle.enabled;
      });
      setFeatureToggles(togglesMap);
    } catch (error) {
      console.error('Error fetching feature toggles:', error);
    }
  };

  const fetchUserPreferences = async () => {
    try {
      const response = await axios.get(`${API}/seller/analytics/preferences`, { withCredentials: true });
      setVisibleWidgets(response.data.visible_widgets || []);
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  const fetchOverview = async () => {
    try {
      const response = await axios.get(`${API}/seller/analytics/overview?days=${dateRange}`, { withCredentials: true });
      setOverview(response.data);
    } catch (error) {
      console.error('Error fetching overview:', error);
    }
  };

  const fetchSalesTrends = async () => {
    try {
      const response = await axios.get(`${API}/seller/analytics/sales-trends?days=${dateRange}`, { withCredentials: true });
      setSalesTrends(response.data.trends || []);
    } catch (error) {
      console.error('Error fetching sales trends:', error);
    }
  };

  const fetchProductPerformance = async () => {
    try {
      const response = await axios.get(`${API}/seller/analytics/product-performance`, { withCredentials: true });
      setProductPerformance(response.data.products || []);
    } catch (error) {
      console.error('Error fetching product performance:', error);
    }
  };

  const fetchCustomerInsights = async () => {
    try {
      const response = await axios.get(`${API}/seller/analytics/customer-insights?days=${dateRange}`, { withCredentials: true });
      setCustomerInsights(response.data);
    } catch (error) {
      console.error('Error fetching customer insights:', error);
    }
  };

  const fetchInventoryStatus = async () => {
    try {
      const response = await axios.get(`${API}/seller/analytics/inventory-status`, { withCredentials: true });
      setInventoryStatus(response.data);
    } catch (error) {
      console.error('Error fetching inventory status:', error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const toggleWidget = (widgetName) => {
    const newVisibleWidgets = visibleWidgets.includes(widgetName)
      ? visibleWidgets.filter(w => w !== widgetName)
      : [...visibleWidgets, widgetName];
    
    setVisibleWidgets(newVisibleWidgets);
    
    // Save to backend
    axios.put(`${API}/seller/analytics/preferences`, 
      { visible_widgets: newVisibleWidgets },
      { withCredentials: true }
    ).catch(error => {
      console.error('Error saving preferences:', error);
      toast.error('Failed to save preferences');
    });
  };

  const isWidgetVisible = (widgetName) => {
    return featureToggles[widgetName] !== false && visibleWidgets.includes(widgetName);
  };

  const isWidgetEnabled = (widgetName) => {
    return featureToggles[widgetName] !== false;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#FF3CFE] via-brand-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#FF3CFE] mx-auto mb-4"></div>
          <p className="text-white">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const topProducts = productPerformance.slice(0, 5);
  
  const inventoryData = inventoryStatus ? [
    { name: 'In Stock', value: inventoryStatus.in_stock },
    { name: 'Low Stock', value: inventoryStatus.low_stock },
    { name: 'Out of Stock', value: inventoryStatus.out_of_stock }
  ] : [];

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
                  className="h-12 w-auto cursor-pointer hover:opacity-80 transition-opacity"
                />
              </Link>
              <div className="border-l border-[#FF3CFE] pl-3">
                <p className="text-sm font-medium text-white">Seller Analytics</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/dashboard')}
              >
                Back to Dashboard
              </Button>
              <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings className="w-4 h-4 mr-2" />
                    Customize
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Customize Your Dashboard</DialogTitle>
                    <DialogDescription>
                      Show or hide analytics widgets based on your preferences
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    {[
                      { id: 'revenue_overview', label: 'Revenue Overview' },
                      { id: 'sales_trends', label: 'Sales Trends Chart' },
                      { id: 'product_performance', label: 'Product Performance Table' },
                      { id: 'customer_insights', label: 'Customer Insights' },
                      { id: 'inventory_status', label: 'Inventory Status' },
                      { id: 'top_products', label: 'Top Products' }
                    ].map(widget => (
                      <div key={widget.id} className="flex items-center justify-between">
                        <Label htmlFor={widget.id} className="text-sm font-medium">
                          {widget.label}
                          {!isWidgetEnabled(widget.id) && (
                            <span className="ml-2 text-xs text-red-500">(Disabled by Admin)</span>
                          )}
                        </Label>
                        <Switch
                          id={widget.id}
                          checked={visibleWidgets.includes(widget.id)}
                          onCheckedChange={() => toggleWidget(widget.id)}
                          disabled={!isWidgetEnabled(widget.id)}
                        />
                      </div>
                    ))}
                  </div>
                </DialogContent>
              </Dialog>
              <div className="flex items-center space-x-2 mr-4">
                <div className="w-8 h-8 bg-gradient-to-br from-[#FF3CFE] to-black rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{user?.name?.charAt(0) || 'U'}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{user?.name}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
              </div>
              <Button 
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="border-[#FF3CFE] text-white hover:bg-[#FF3CFE]/20"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-[#FF3CFE]/20 space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate('/dashboard')}
              >
                Back to Dashboard
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setSettingsOpen(true)}
              >
                <Settings className="w-4 h-4 mr-2" />
                Customize
              </Button>
              <Button 
                onClick={handleLogout}
                variant="outline"
                className="w-full border-red-200 text-red-600 hover:bg-red-50"
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
        {/* Date Range Selector */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
            <p className="text-white/80 mt-1">Track your performance and insights</p>
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

        {/* Revenue Overview Cards */}
        {isWidgetVisible('revenue_overview') && overview && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-[#FF3CFE]/30 bg-black/60 backdrop-blur-sm hover:shadow-lg hover:shadow-[#FF3CFE]/20 transition-shadow">
              <CardHeader className="pb-2">
                <CardDescription className="text-white/60">Total Revenue</CardDescription>
                <CardTitle className="text-3xl font-bold text-white">
                  ${overview.total_revenue.toLocaleString()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm">
                  {overview.revenue_growth >= 0 ? (
                    <TrendingUp className="w-4 h-4 mr-1 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1 text-red-600" />
                  )}
                  <span className={overview.revenue_growth >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {Math.abs(overview.revenue_growth).toFixed(1)}% vs previous period
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#FF3CFE]/30 bg-black/60 backdrop-blur-sm hover:shadow-lg hover:shadow-[#FF3CFE]/20 transition-shadow">
              <CardHeader className="pb-2">
                <CardDescription className="text-white/60">Orders</CardDescription>
                <CardTitle className="text-3xl font-bold text-white">
                  {overview.total_orders}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-white/70">
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  <span>{overview.total_items_sold} items sold</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#FF3CFE]/30 bg-black/60 backdrop-blur-sm hover:shadow-lg hover:shadow-[#FF3CFE]/20 transition-shadow">
              <CardHeader className="pb-2">
                <CardDescription className="text-white/60">Average Order Value</CardDescription>
                <CardTitle className="text-3xl font-bold text-white">
                  ${overview.average_order_value.toFixed(2)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-white/70">
                  <DollarSign className="w-4 h-4 mr-1" />
                  <span>Per transaction</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#FF3CFE]/30 bg-black/60 backdrop-blur-sm hover:shadow-lg hover:shadow-[#FF3CFE]/20 transition-shadow">
              <CardHeader className="pb-2">
                <CardDescription className="text-white/60">Conversion Rate</CardDescription>
                <CardTitle className="text-3xl font-bold text-white">
                  {overview.conversion_rate}%
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-white/70">
                  <Eye className="w-4 h-4 mr-1" />
                  <span>{overview.product_views} views</span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Sales Trends Chart */}
        {isWidgetVisible('sales_trends') && salesTrends.length > 0 && (
          <Card className="mb-8 bg-black/60 backdrop-blur-sm border-[#FF3CFE]/30">
            <CardHeader>
              <CardTitle className="text-white">Sales Trends</CardTitle>
              <CardDescription className="text-white/70">Daily revenue and order volume</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesTrends}>
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
                      if (name === 'orders') return [value, 'Orders'];
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
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Customer Insights */}
          {isWidgetVisible('customer_insights') && customerInsights && (
            <Card className="bg-black/60 backdrop-blur-sm border-[#FF3CFE]/30">
              <CardHeader>
                <CardTitle className="text-white">Customer Insights</CardTitle>
                <CardDescription className="text-white/70">Understanding your customer base</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-blue-600 mr-2" />
                      <span className="text-sm font-medium">Total Customers</span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">
                      {customerInsights.total_unique_customers}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium">New Customers</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">
                      {customerInsights.new_customers}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-brand-50 rounded-lg">
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-brand-600 mr-2" />
                      <span className="text-sm font-medium">Returning Customers</span>
                    </div>
                    <span className="text-2xl font-bold text-brand-600">
                      {customerInsights.returning_customers}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center">
                      <TrendingUp className="w-5 h-5 text-orange-600 mr-2" />
                      <span className="text-sm font-medium">Return Rate</span>
                    </div>
                    <span className="text-2xl font-bold text-orange-600">
                      {customerInsights.returning_customer_rate.toFixed(1)}%
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Avg Orders per Customer</span>
                    <span className="text-xl font-bold text-gray-700">
                      {customerInsights.average_orders_per_customer.toFixed(1)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Inventory Status */}
          {isWidgetVisible('inventory_status') && inventoryStatus && (
            <Card className="bg-black/60 backdrop-blur-sm border-[#FF3CFE]/30">
              <CardHeader>
                <CardTitle className="text-white">Inventory Status</CardTitle>
                <CardDescription className="text-white/70">Stock levels overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={inventoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {inventoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm p-2 bg-blue-50 rounded">
                    <span>Total Inventory Value</span>
                    <span className="font-bold">${inventoryStatus.total_inventory_value.toLocaleString()}</span>
                  </div>
                  
                  {inventoryStatus.low_stock_products.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center text-amber-600 mb-2">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">Low Stock Alert</span>
                      </div>
                      <div className="space-y-1">
                        {inventoryStatus.low_stock_products.slice(0, 3).map((product, idx) => (
                          <div key={idx} className="text-xs text-gray-600 bg-amber-50 p-2 rounded">
                            {product.name} - {product.stock} left
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {inventoryStatus.out_of_stock_products.length > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center text-red-600 mb-2">
                        <AlertTriangle className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">Out of Stock</span>
                      </div>
                      <div className="space-y-1">
                        {inventoryStatus.out_of_stock_products.slice(0, 3).map((product, idx) => (
                          <div key={idx} className="text-xs text-gray-600 bg-red-50 p-2 rounded">
                            {product.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Top Products */}
        {isWidgetVisible('top_products') && topProducts.length > 0 && (
          <Card className="mb-8 bg-black/60 backdrop-blur-sm border-[#FF3CFE]/30">
            <CardHeader>
              <CardTitle className="text-white">Top Performing Products</CardTitle>
              <CardDescription className="text-white/70">Your best-selling products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topProducts.map((product, index) => (
                  <div key={product.product_id} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl font-bold text-gray-400">#{index + 1}</div>
                      {product.image && (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-600">{product.brand}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 text-sm">
                      <div className="text-center">
                        <p className="text-gray-500">Revenue</p>
                        <p className="font-bold text-green-600">${product.revenue.toLocaleString()}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500">Sold</p>
                        <p className="font-bold text-blue-600">{product.items_sold}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500">Views</p>
                        <p className="font-bold text-brand-600">{product.views}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500">Conv. Rate</p>
                        <p className="font-bold text-orange-600">{product.conversion_rate}%</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Product Performance Table */}
        {isWidgetVisible('product_performance') && productPerformance.length > 0 && (
          <Card className="bg-black/60 backdrop-blur-sm border-[#FF3CFE]/30">
            <CardHeader>
              <CardTitle className="text-white">All Products Performance</CardTitle>
              <CardDescription className="text-white/70">Detailed metrics for all your products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left p-3">Product</th>
                      <th className="text-right p-3">Views</th>
                      <th className="text-right p-3">Orders</th>
                      <th className="text-right p-3">Sold</th>
                      <th className="text-right p-3">Revenue</th>
                      <th className="text-right p-3">Stock</th>
                      <th className="text-right p-3">Conv. Rate</th>
                      <th className="text-center p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productPerformance.map((product) => (
                      <tr key={product.product_id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <div className="flex items-center space-x-2">
                            {product.image && (
                              <img 
                                src={product.image} 
                                alt={product.name}
                                className="w-10 h-10 object-cover rounded"
                              />
                            )}
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-xs text-gray-500">{product.brand}</p>
                            </div>
                          </div>
                        </td>
                        <td className="text-right p-3">{product.views}</td>
                        <td className="text-right p-3">{product.orders}</td>
                        <td className="text-right p-3">{product.items_sold}</td>
                        <td className="text-right p-3 font-semibold">${product.revenue.toLocaleString()}</td>
                        <td className="text-right p-3">
                          <span className={product.stock === 0 ? 'text-red-600 font-medium' : product.stock <= 10 ? 'text-amber-600 font-medium' : ''}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="text-right p-3">{product.conversion_rate}%</td>
                        <td className="text-center p-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            product.status === 'ENABLED' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {product.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default SellerAnalytics;
