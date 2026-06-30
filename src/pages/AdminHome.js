import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  Search,
  Eye,
  DollarSign,
  BarChart3,
  Settings,
  Edit,
  ArrowLeft,
  Tag
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AdminHome() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    pendingSubmissions: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalSellers: 0,
    totalCustomers: 0
  });
  const [analytics, setAnalytics] = useState({
    topSearches: [],
    recentClicks: [],
    trendingProducts: [],
    conversionRate: 0,
    bounceRate: 0,
    avgSessionDuration: 0
  });
  const [recentSubmissions, setRecentSubmissions] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats from the unified endpoint
      const statsResponse = await axios.get(`${API}/stats`, {
        withCredentials: true
      });
      
      // Map the response to our state structure
      const statsData = statsResponse.data;
      setStats({
        totalProducts: statsData.total_products || 0,
        pendingSubmissions: statsData.pending_approval || 0,
        totalOrders: 0, // TODO: Add to backend
        totalRevenue: 0, // TODO: Add to backend
        totalSellers: statsData.total_sellers || 0,
        activeSellers: statsData.active_sellers || 0,
        pendingSellers: statsData.pending_sellers || 0,
        onboardingSellers: statsData.onboarding_sellers || 0,
        totalCustomers: 0 // TODO: Add to backend
      });

      // Fetch analytics (optional - skip if endpoint doesn't exist)
      try {
        const analyticsResponse = await axios.get(`${API}/admin/analytics`, {
          withCredentials: true
        });
        setAnalytics(analyticsResponse.data);
      } catch (err) {
        console.log('Analytics endpoint not available');
      }

      // Fetch recent submissions (optional)
      try {
        const submissionsResponse = await axios.get(`${API}/admin/products/pending`, {
          withCredentials: true
        });
        setRecentSubmissions(submissionsResponse.data.slice(0, 5));
      } catch (err) {
        console.log('Submissions endpoint not available');
      }

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        toast.error("Admin access required");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-[#00ffef]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#00ffef]">
      {/* Header */}
      <header className="bg-black shadow-sm border-b border-cyan-600">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button onClick={() => navigate("/")} variant="ghost" className="text-white hover:text-cyan-300">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back
              </Button>
              <img 
                src="https://customer-assets.emergentagent.com/job_estore-fixes/artifacts/j6vnm434_Screenshot%202025-12-01%20060725.jpg" 
                alt="GOT-STOCK" 
                className="h-12 w-auto animate-spin-y rounded-full" 
              />
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-sm text-gray-300">Manage your marketplace</p>
              </div>
            </div>
            <Button onClick={() => navigate("/")} variant="outline" className="border-cyan-600 text-cyan-300 hover:bg-cyan-900">
              View Site
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <Package className="h-8 w-8 text-purple-600" />
              <span className="text-2xl font-bold text-gray-900">{stats.totalProducts}</span>
            </div>
            <p className="text-sm text-gray-600">Total Products</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate("/admin/sellers")}>
            <div className="flex items-center justify-between mb-2">
              <Users className="h-8 w-8 text-orange-600" />
              <span className="text-2xl font-bold text-orange-600">{stats.pendingSellers || 0}</span>
            </div>
            <p className="text-sm text-gray-600">Pending Sellers</p>
            {stats.pendingSellers > 0 && (
              <Badge className="mt-2 bg-orange-100 text-orange-800">Click to Review</Badge>
            )}
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <ShoppingCart className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">{stats.totalOrders}</span>
            </div>
            <p className="text-sm text-gray-600">Total Orders</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <DollarSign className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">${stats.totalRevenue?.toFixed(2) || '0.00'}</span>
            </div>
            <p className="text-sm text-gray-600">Total Revenue</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <button
            onClick={() => navigate("/admin/products")}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg p-6 text-left transition-all shadow-lg hover:shadow-xl"
          >
            <Edit className="h-8 w-8 mb-3" />
            <h3 className="text-xl font-bold mb-2">Manage Products</h3>
            <p className="text-sm text-purple-100">Edit products, add sale pricing, manage inventory</p>
          </button>

          <button
            onClick={() => navigate("/admin/submissions")}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg p-6 text-left transition-all shadow-lg hover:shadow-xl"
          >
            <LayoutDashboard className="h-8 w-8 mb-3" />
            <h3 className="text-xl font-bold mb-2">Review Submissions</h3>
            <p className="text-sm text-blue-100">
              {stats.pendingSubmissions} pending approval
            </p>
          </button>

          <button
            onClick={() => navigate("/admin/analytics-dashboard")}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg p-6 text-left transition-all shadow-lg hover:shadow-xl"
          >
            <BarChart3 className="h-8 w-8 mb-3" />
            <h3 className="text-xl font-bold mb-2">Analytics Dashboard</h3>
            <p className="text-sm text-green-100">Comprehensive platform metrics & insights</p>
          </button>

          <button
            onClick={() => navigate("/admin/settings")}
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-lg p-6 text-left transition-all shadow-lg hover:shadow-xl"
          >
            <Settings className="h-8 w-8 mb-3" />
            <h3 className="text-xl font-bold mb-2">Settings</h3>
            <p className="text-sm text-orange-100">Manage feature toggles & system config</p>
          </button>

          <button
            onClick={() => navigate("/admin/sellers")}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-lg p-6 text-left transition-all shadow-lg hover:shadow-xl"
          >
            <Users className="h-8 w-8 mb-3" />
            <h3 className="text-xl font-bold mb-2">Seller Approvals</h3>
            <p className="text-sm text-indigo-100">
              {stats.pendingSellers > 0 
                ? `${stats.pendingSellers} pending review` 
                : 'Review and approve new seller applications'}
            </p>
          </button>

          <button
            onClick={() => navigate("/admin/category-manager")}
            className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-lg p-6 text-left transition-all shadow-lg hover:shadow-xl"
          >
            <Tag className="h-8 w-8 mb-3" />
            <h3 className="text-xl font-bold mb-2">Category Manager</h3>
            <p className="text-sm text-teal-100">Product attributes & validation rules</p>
          </button>
        </div>

        {/* Analytics Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Trending Searches */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Top Searches</h3>
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {analytics.topSearches?.length > 0 ? (
                analytics.topSearches.map((search, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-gray-700">{search.query}</span>
                    <Badge variant="secondary">{search.count} searches</Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No search data available yet</p>
              )}
            </div>
          </div>

          {/* Trending Products */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Trending Products</h3>
              <TrendingUp className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-3">
              {analytics.trendingProducts?.length > 0 ? (
                analytics.trendingProducts.map((product, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="text-gray-700">{product.name}</span>
                    <Badge variant="secondary">{product.views} views</Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No trending data available yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent Submissions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Recent Submissions</h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/admin/submissions")}
            >
              View All
            </Button>
          </div>
          <div className="space-y-4">
            {recentSubmissions.length > 0 ? (
              recentSubmissions.map((submission) => (
                <div key={submission.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition">
                  <img
                    src={submission.media?.images?.[0] || "https://via.placeholder.com/80"}
                    alt={submission.name}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{submission.name}</h4>
                    <p className="text-sm text-gray-500">{submission.brand}</p>
                  </div>
                  <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                    Pending
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No pending submissions</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
