import React, { useEffect, useState } from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import SellerRegistration from "./pages/SellerRegistration";
import ProductSubmissionV2 from "./pages/ProductSubmissionV2";
import ProductSubmissionV3 from "./pages/ProductSubmissionV3";
import ProductList from "./pages/ProductList";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import AdminHome from "./pages/AdminHome";
import AdminProducts from "./pages/AdminProducts";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminSubmissions from "./pages/AdminSubmissions";
import TrackingPage from "./pages/TrackingPage";
import SubmissionSuccess from "./pages/SubmissionSuccess";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import CustomerSignup from "./pages/CustomerSignup";
import CustomerLogin from "./pages/CustomerLogin";
import CustomerAccount from "./pages/CustomerAccount";
import CategoryPage from "./pages/CategoryPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import TermsAndConditions from "./pages/TermsAndConditions";
import AboutUs from "./pages/AboutUs";
import HelpCentre from "./pages/HelpCentre";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import ContactUs from "./pages/ContactUs";
import ShippingInfo from "./pages/ShippingInfo";
import ReturnsRefunds from "./pages/ReturnsRefunds";
import SizeGuide from "./pages/SizeGuide";
import TrackOrder from "./pages/TrackOrder";
import BuyerOrderTracking from "./pages/BuyerOrderTracking";
import SellerOrderTracking from "./pages/SellerOrderTracking";
import AdminOrderTracking from "./pages/AdminOrderTracking";
import Mission from "./pages/Mission";
import Sustainability from "./pages/Sustainability";
import MediaKit from "./pages/MediaKit";
import BecomeSeller from "./pages/BecomeSeller";
import SellerTerms from "./pages/SellerTerms";
import SellerResources from "./pages/SellerResources";
import Partnerships from "./pages/Partnerships";
import TermsOfSale from "./pages/TermsOfSale";
import Accessibility from "./pages/Accessibility";
import Wishlist from "./pages/Wishlist";
import SellerAnalytics from "./pages/SellerAnalytics";
import AdminSettings from "./pages/AdminSettings";
import SellerLogin from "./pages/SellerLogin";
import AdminLogin from "./pages/AdminLogin";
import AdminCategoryManager from "./pages/AdminCategoryManager";
import AdminAnalyticsDashboard from "./pages/AdminAnalyticsDashboard";
import AdminSellers from "./pages/AdminSellers";
import BecomeASeller from "./pages/BecomeASeller";
import ScrollToTop from "./components/ScrollToTop";
import { Toaster } from "./components/ui/sonner";
import Footer from "./components/Footer";
import { AuthProvider, AuthContext } from "./context/AuthContext";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Protected route component
function ProtectedRoute({ children, requireAdmin, requireSeller }) {
  const { user, loading } = React.useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to appropriate login page based on route
    if (requireAdmin || location.pathname.includes('/admin')) {
      return <Navigate to="/admin-login" state={{ from: location }} replace />;
    } else if (requireSeller || location.pathname.includes('/dashboard') || location.pathname.includes('/seller') || location.pathname.includes('/products')) {
      return <Navigate to="/seller-login" state={{ from: location }} replace />;
    }
    return <Navigate to="/customer-login" state={{ from: location }} replace />;
  }

  if (requireAdmin && user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  if (requireSeller && user.role !== "seller") {
    return <Navigate to="/seller-login" replace />;
  }

  return children;
}

function App() {
  // Enable manual scroll restoration
  React.useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  return (
    <div className="App min-h-screen flex flex-col bg-black">
      <BrowserRouter>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded focus:shadow-lg focus:outline focus:outline-2 focus:outline-[#FF3CFE]"
        >
          Skip to main content
        </a>
        <ScrollToTop />
        <AuthProvider>
          <main id="main" className="flex-1 flex flex-col">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
              <Route path="/product/variant/:variantId" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success" element={<OrderSuccess />} />
              <Route path="/customer-signup" element={<CustomerSignup />} />
              <Route path="/customer-login" element={<CustomerLogin />} />
              <Route path="/account" element={<CustomerAccount />} />
              <Route path="/category/:category" element={<CategoryPage />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/verify-email" element={<VerifyEmail />} />
              <Route path="/terms" element={<TermsAndConditions />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/help-centre" element={<HelpCentre />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/shipping-info" element={<ShippingInfo />} />
              <Route path="/returns-refunds" element={<ReturnsRefunds />} />
              <Route path="/size-guide" element={<SizeGuide />} />
              <Route path="/track-order" element={<TrackOrder />} />
              <Route path="/my-orders" element={<BuyerOrderTracking />} />
              <Route
                path="/seller/orders"
                element={
                  <ProtectedRoute>
                    <SellerOrderTracking />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/orders"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminOrderTracking />
                  </ProtectedRoute>
                }
              />
              <Route path="/mission" element={<Mission />} />
              <Route path="/sustainability" element={<Sustainability />} />
              <Route path="/media-kit" element={<MediaKit />} />
              <Route path="/become-seller" element={<BecomeSeller />} />
              <Route path="/become-a-seller" element={<BecomeASeller />} />
              <Route path="/seller-terms" element={<SellerTerms />} />
              <Route path="/seller-resources" element={<SellerResources />} />
              <Route path="/partnerships" element={<Partnerships />} />
              <Route path="/terms-of-sale" element={<TermsOfSale />} />
              <Route path="/accessibility" element={<Accessibility />} />
              <Route path="/login" element={<Login />} />
              <Route path="/seller-login" element={<SellerLogin />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requireSeller={true}>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seller/register"
                element={
                  <ProtectedRoute>
                    <SellerRegistration />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products/new"
                element={
                  <ProtectedRoute>
                    <ProductSubmissionV2 />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products/new-v3"
                element={
                  <ProtectedRoute>
                    <ProductSubmissionV3 />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products"
                element={
                  <ProtectedRoute>
                    <ProductList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/seller/analytics"
                element={
                  <ProtectedRoute>
                    <SellerAnalytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/submission-success"
                element={
                  <ProtectedRoute>
                    <SubmissionSuccess />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminHome />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/home"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminHome />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminProducts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/submissions"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminSubmissions />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/tracking"
                element={
                  <ProtectedRoute requireAdmin>
                    <TrackingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/tracking"
                element={
                  <ProtectedRoute requireSeller>
                    <TrackingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/customer-account/tracking"
                element={
                  <ProtectedRoute>
                    <TrackingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/analytics"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminAnalytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminSettings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/category-manager"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminCategoryManager />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/analytics-dashboard"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminAnalyticsDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/sellers"
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminSellers />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <Toaster position="top-right" />
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
