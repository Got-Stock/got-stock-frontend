import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircle, Loader2, Package } from "lucide-react";
import { Button } from "../components/ui/button";
import { fireConfetti } from "../lib/confetti";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const sessionId = searchParams.get("session_id");
  
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  const [pollAttempts, setPollAttempts] = useState(0);

  useEffect(() => {
    if (sessionId) {
      pollPaymentStatus();
    } else {
      setError("Invalid session");
      setLoading(false);
    }
  }, [sessionId]);

  const pollPaymentStatus = async (attempts = 0) => {
    const maxAttempts = 10;
    const pollInterval = 2000;

    if (attempts >= maxAttempts) {
      setError("Payment verification timed out. Please check your email for confirmation.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${API}/checkout/status/${sessionId}`);
      const data = response.data;

      if (data.payment_status === "paid") {
        // Clear cart
        localStorage.setItem("cart", JSON.stringify([]));
        window.dispatchEvent(new Event("cartUpdated"));

        // Fetch order details
        const orderResponse = await axios.get(`${API}/orders`);
        setOrder(data);
        setLoading(false);
        // Celebrate the completed purchase
        setTimeout(() => fireConfetti(), 250);
        return;
      } else if (data.status === "expired") {
        setError("Payment session expired. Please try again.");
        setLoading(false);
        return;
      }

      // Continue polling
      setPollAttempts(attempts + 1);
      setTimeout(() => pollPaymentStatus(attempts + 1), pollInterval);
    } catch (error) {
      console.error("Error checking payment status:", error);
      setError("Error verifying payment. Please contact support.");
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 text-brand-600 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Payment...</h2>
          <p className="text-gray-600">Please wait while we confirm your order</p>
          {pollAttempts > 0 && (
            <p className="text-sm text-gray-500 mt-2">Attempt {pollAttempts}/10</p>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white p-8 rounded-lg shadow-sm">
          <div className="text-red-500 mb-4">
            <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Verification Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-2">
            <Button onClick={() => navigate("/shop")} className="w-full bg-brand-600 hover:bg-brand-700">
              Continue Shopping
            </Button>
            <Button variant="outline" onClick={() => navigate("/cart")} className="w-full">
              Return to Cart
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-50 to-gray-50 py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="mb-6">
            <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">Thank you for your purchase</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <p className="text-sm text-gray-600 mb-2">Order Details</p>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              ${order?.amount_total ? (order.amount_total / 100).toFixed(2) : "0.00"}
            </p>
            <p className="text-sm text-gray-500">
              Status: {order?.payment_status}
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3 text-left">
              <Package className="h-5 w-5 text-brand-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Order Confirmation</p>
                <p className="text-sm text-gray-600">
                  We've sent a confirmation email to {order?.metadata?.customer_email || "your email"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 text-left">
              <Package className="h-5 w-5 text-brand-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Next Steps</p>
                <p className="text-sm text-gray-600">
                  Your order is being processed and will be shipped within 2-3 business days
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Button onClick={() => navigate("/shop")} className="w-full bg-brand-600 hover:bg-brand-700">
              Continue Shopping
            </Button>
            <Button variant="outline" onClick={() => navigate("/")} className="w-full">
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
