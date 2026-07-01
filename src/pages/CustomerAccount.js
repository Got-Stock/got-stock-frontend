import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/ui/button";
import Banner from "../components/Banner";
import CategoryNav from "../components/CategoryNav";
import CartBadge from "../components/CartBadge";
import { User, Package, MapPin, LogOut, ShoppingBag } from "lucide-react";
import Header from "../components/Header";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function CustomerAccount() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("orders");

  useEffect(() => {
    checkAuth();
    fetchOrders();
  }, []);

  const checkAuth = () => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      navigate("/customer-login");
      return;
    }
    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== "customer") {
      navigate("/customer-login");
      return;
    }
    setUser(parsedUser);
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/customer/orders`, {
        withCredentials: true
      });
      setOrders(response.data.orders || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      if (error.response?.status === 401) {
        localStorage.removeItem("user");
        navigate("/customer-login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
      localStorage.removeItem("user");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800";
      case "SHIPPED":
        return "bg-brand-100 text-brand-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />
      <CategoryNav />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white rounded-t-xl shadow-sm border-b border-gray-200 mb-0 overflow-x-auto">
          <div className="flex items-center px-4 min-w-max">
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-6 py-4 font-medium text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === "orders"
                  ? 'text-brand-600 border-b-2 border-brand-600'
                  : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent'
              }`}
            >
              <Package size={18} />
              My Orders
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-6 py-4 font-medium text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === "profile"
                  ? 'text-brand-600 border-b-2 border-brand-600'
                  : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent'
              }`}
            >
              <User size={18} />
              Profile
            </button>
            <button
              onClick={() => setActiveTab("addresses")}
              className={`px-6 py-4 font-medium text-sm transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === "addresses"
                  ? 'text-brand-600 border-b-2 border-brand-600'
                  : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent'
              }`}
            >
              <MapPin size={18} />
              Addresses
            </button>
            <button
              onClick={() => navigate('/customer-account/tracking')}
              className={`px-6 py-4 font-medium text-sm transition-all whitespace-nowrap flex items-center gap-2 text-gray-600 hover:text-gray-900 border-b-2 border-transparent`}
            >
              <Package size={18} />
              Track Order
            </button>
          </div>
        </div>

        {/* Tab Content Container */}
        <div className="bg-white rounded-b-xl shadow-lg">
          {activeTab === "orders" && (
            <div>
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Order History</h2>
                    <p className="text-gray-600 text-sm mt-1">View and track your orders</p>
                  </div>
                  <div className="bg-gradient-to-br from-brand-600 to-brand-600 rounded-lg px-6 py-3 text-white">
                    <div className="flex items-center gap-2">
                      <ShoppingBag size={20} />
                      <span className="text-2xl font-bold">{orders.length}</span>
                    </div>
                    <p className="text-xs text-brand-100">Total Orders</p>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600 mx-auto"></div>
                  <p className="text-gray-600 mt-4">Loading orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="p-12 text-center">
                  <Package size={48} className="text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                  <p className="text-gray-600 mb-6">Start shopping to see your orders here</p>
                  <Link to="/shop">
                    <Button className="bg-gradient-to-r from-brand-600 to-brand-600 hover:from-brand-700 hover:to-brand-700">
                      Start Shopping
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y">
                  {orders.map((order) => (
                    <div key={order.id} className="p-6 hover:bg-gray-50 transition">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-gray-900">Order #{order.id.slice(0, 8).toUpperCase()}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                              {order.status || "PENDING"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{formatDate(order.created_at)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-gray-900">${order.total?.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">{order.items?.length || 0} items</p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {order.items?.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                            {item.product_name} x{item.quantity}
                          </div>
                        ))}
                        {order.items?.length > 3 && (
                          <div className="text-sm text-gray-500 px-3 py-1">
                            +{order.items.length - 3} more
                          </div>
                        )}
                      </div>

                      {order.payment_status === "COMPLETED" && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                          <p className="text-sm text-green-800 font-medium">
                            ✓ Payment Completed
                          </p>
                          {order.tracking_number && (
                            <p className="text-xs text-green-700 mt-1">
                              Tracking: {order.tracking_number}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "profile" && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Profile Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={user?.name || ""}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={user?.email || ""}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Type</label>
                  <input
                    type="text"
                    value="Customer"
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === "addresses" && (
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Saved Addresses</h2>
              <div className="text-center py-12">
                <MapPin size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No saved addresses yet</p>
                <p className="text-sm text-gray-500">Your shipping addresses will appear here</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
