import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  ArrowLeft,
  TrendingUp,
  Search,
  Eye,
  MousePointer,
  Clock,
  Users,
  ShoppingCart,
  BarChart3,
  Globe
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function AdminAnalytics() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    topSearches: [],
    recentClicks: [],
    trendingProducts: [],
    pageViews: {},
    seoMetrics: {},
    conversionRate: 0,
    bounceRate: 0,
    avgSessionDuration: 0,
    totalVisitors: 0
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/admin/analytics/detailed`, {
        withCredentials: true
      });
      setAnalytics(response.data);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-[#00ffef]">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={() => navigate("/admin/home")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-sm text-gray-600">SEO, Clicks, Trends & Google Analytics</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <Eye className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">{analytics.pageViews?.total || 0}</span>
            </div>
            <p className="text-sm text-gray-600">Total Page Views</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <Users className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">{analytics.totalVisitors || 0}</span>
            </div>
            <p className="text-sm text-gray-600">Total Visitors</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <ShoppingCart className="h-8 w-8 text-brand-600" />
              <span className="text-2xl font-bold text-gray-900">{analytics.conversionRate?.toFixed(2) || 0}%</span>
            </div>
            <p className="text-sm text-gray-600">Conversion Rate</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <Clock className="h-8 w-8 text-orange-600" />
              <span className="text-2xl font-bold text-gray-900">{analytics.avgSessionDuration || 0}s</span>
            </div>
            <p className="text-sm text-gray-600">Avg Session</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Searches */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Search className="h-5 w-5 text-brand-600" />
                Top Searches
              </h3>
            </div>
            <div className="space-y-4">
              {analytics.topSearches && analytics.topSearches.length > 0 ? (
                analytics.topSearches.map((search, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-gray-300">#{idx + 1}</span>
                      <div>
                        <div className="font-medium text-gray-900">{search.query}</div>
                        <div className="text-xs text-gray-500">{search.count} searches</div>
                      </div>
                    </div>
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-brand-600 to-brand-600 h-2 rounded-full"
                        style={{ width: `${(search.count / analytics.topSearches[0].count) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No search data available yet</p>
              )}
            </div>
          </div>

          {/* Trending Products */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Trending Products
              </h3>
            </div>
            <div className="space-y-4">
              {analytics.trendingProducts && analytics.trendingProducts.length > 0 ? (
                analytics.trendingProducts.map((product, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <img
                      src={product.image || "https://via.placeholder.com/60"}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900 text-sm">{product.name}</div>
                      <div className="text-xs text-gray-500">{product.views} views • {product.clicks} clicks</div>
                    </div>
                    <Badge variant="secondary">{product.clicks} clicks</Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No trending data available yet</p>
              )}
            </div>
          </div>
        </div>

        {/* SEO Metrics */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              SEO Performance
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Organic Traffic</div>
              <div className="text-2xl font-bold text-gray-900">{analytics.seoMetrics?.organicTraffic || 0}</div>
              <div className="text-xs text-green-600 mt-1">↑ {analytics.seoMetrics?.organicGrowth || 0}% vs last month</div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Bounce Rate</div>
              <div className="text-2xl font-bold text-gray-900">{analytics.bounceRate?.toFixed(2) || 0}%</div>
              <div className="text-xs text-gray-500 mt-1">Industry avg: 40-60%</div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-1">Avg Time on Page</div>
              <div className="text-2xl font-bold text-gray-900">{Math.floor((analytics.avgSessionDuration || 0) / 60)}m {(analytics.avgSessionDuration || 0) % 60}s</div>
              <div className="text-xs text-gray-500 mt-1">Quality engagement metric</div>
            </div>
          </div>
        </div>

        {/* Recent Clicks */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <MousePointer className="h-5 w-5 text-brand-600" />
              Recent Product Clicks
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Product</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Time</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">Page</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {analytics.recentClicks && analytics.recentClicks.length > 0 ? (
                  analytics.recentClicks.map((click, idx) => (
                    <tr key={idx}>
                      <td className="py-3 px-4 text-sm text-gray-900">{click.product_name}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{click.timestamp}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{click.page || 'Shop'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-8 text-center text-gray-500">No click data available yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Google Analytics Integration Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <div className="flex items-start gap-3">
            <BarChart3 className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h4 className="font-bold text-blue-900 mb-2">Google Analytics Integration</h4>
              <p className="text-sm text-blue-800 mb-3">
                For comprehensive analytics including real-time data, user demographics, acquisition channels, and more, 
                integrate Google Analytics 4 (GA4) with your tracking ID.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                Configure Google Analytics
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
