import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Banner from "../components/Banner";
import CategoryNav from "../components/CategoryNav";
import Breadcrumbs from "../components/Breadcrumbs";
import Header from "../components/Header";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export default function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [shippingCost, setShippingCost] = useState(null);
  const [shippingDetails, setShippingDetails] = useState(null);
  const [calculatingShipping, setCalculatingShipping] = useState(false);
  
  const [shippingInfo, setShippingInfo] = useState({
    full_name: "",
    email: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "Australia"
  });

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    if (cart.length === 0) {
      navigate("/cart");
    }
    setCartItems(cart);
  }, [navigate]);

  const getSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const getShipping = () => {
    // Use calculated shipping or fallback
    if (shippingCost !== null) return shippingCost;
    
    const subtotal = getSubtotal();
    if (subtotal >= 50) return 0;
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    return 5 + itemCount;
  };

  const getTotal = () => {
    return getSubtotal() + getShipping();
  };

  const handleInputChange = (e) => {
    const updatedInfo = {
      ...shippingInfo,
      [e.target.name]: e.target.value
    };
    setShippingInfo(updatedInfo);
    
    // Auto-calculate shipping when key fields are filled
    if (updatedInfo.city && updatedInfo.state && updatedInfo.postal_code && updatedInfo.country) {
      calculateShipping(updatedInfo);
    }
  };

  const calculateShipping = async (shippingData) => {
    setCalculatingShipping(true);
    
    try {
      const response = await axios.post(`${API}/shipping/calculate`, {
        items: cartItems,  // Changed from cart_items to items
        shipping_address: shippingData,  // Changed from shipping_info to shipping_address
        subtotal: getSubtotal()
      }, {
        timeout: 10000  // 10 second timeout
      });
      
      setShippingCost(response.data.shipping_cost || 0);
      setShippingDetails(response.data);
      
      if (response.data.free_shipping_applied) {
        toast.success('🎉 Free shipping applied!');
      }
    } catch (error) {
      console.error('Error calculating shipping:', error);
      // Use fallback calculation if API fails
      const fallbackShipping = getSubtotal() >= 50 ? 0 : 6.00;
      setShippingCost(fallbackShipping);
      toast.info('Using standard shipping rate');
    } finally {
      setCalculatingShipping(false);
    }
  };

  const handleCheckout = async () => {
    // Validate shipping info
    if (!shippingInfo.full_name || !shippingInfo.email || !shippingInfo.address_line1 || 
        !shippingInfo.city || !shippingInfo.postal_code || !shippingInfo.country) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);

    try {
      // Create checkout session
      const response = await axios.post(`${API}/checkout/create-session`, {
        cart_items: cartItems,
        shipping_info: shippingInfo,
        origin_url: window.location.origin
      }, {
        timeout: 15000  // 15 second timeout for checkout
      });

      if (response.data.url) {
        // Redirect to Stripe checkout
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error("Checkout error:", error);
      
      // Handle different error formats
      let errorMessage = "Failed to initiate checkout";
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // Handle FastAPI validation errors (array of objects)
        if (Array.isArray(errorData.detail)) {
          errorMessage = errorData.detail.map(err => err.msg || err).join(", ");
        } 
        // Handle string error
        else if (typeof errorData.detail === 'string') {
          errorMessage = errorData.detail;
        }
        // Handle object error
        else if (typeof errorData.detail === 'object') {
          errorMessage = JSON.stringify(errorData.detail);
        }
      }
      
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <Header />

      {/* Sticky Category Navigation with Search */}
      <CategoryNav />

      <div className="container mx-auto px-4 max-w-6xl py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs 
          items={[
            { label: "Shop", href: "/shop" },
            { label: "Cart", href: "/cart" },
            { label: "Checkout" }
          ]} 
        />
        
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Shipping Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Shipping Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="full_name">Full Name *</Label>
                  <Input
                    id="full_name"
                    name="full_name"
                    autoComplete="name"
                    value={shippingInfo.full_name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={shippingInfo.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="address_line1">Address Line 1 *</Label>
                  <Input
                    id="address_line1"
                    name="address_line1"
                    autoComplete="address-line1"
                    value={shippingInfo.address_line1}
                    onChange={handleInputChange}
                    placeholder="123 Main St"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="address_line2">Address Line 2</Label>
                  <Input
                    id="address_line2"
                    name="address_line2"
                    autoComplete="address-line2"
                    value={shippingInfo.address_line2}
                    onChange={handleInputChange}
                    placeholder="Apt 4B"
                  />
                </div>

                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    autoComplete="address-level2"
                    value={shippingInfo.city}
                    onChange={handleInputChange}
                    placeholder="New York"
                  />
                </div>

                <div>
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    name="state"
                    autoComplete="address-level1"
                    value={shippingInfo.state}
                    onChange={handleInputChange}
                    placeholder="State or Province"
                  />
                </div>

                <div>
                  <Label htmlFor="postal_code">Postal/Zip Code *</Label>
                  <Input
                    id="postal_code"
                    name="postal_code"
                    autoComplete="postal-code"
                    value={shippingInfo.postal_code}
                    onChange={handleInputChange}
                    placeholder="Postal or Zip Code"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    name="country"
                    autoComplete="country-name"
                    value={shippingInfo.country}
                    onChange={handleInputChange}
                    placeholder="Country"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                {cartItems.map(item => (
                  <div key={item.variant_id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.product_name} × {item.quantity}
                    </span>
                    <span className="text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                
                <div className="border-t pt-3 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>${getSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <div className="flex items-center gap-2">
                      <span>Shipping</span>
                      {calculatingShipping && (
                        <Loader2 className="h-3 w-3 animate-spin text-purple-600" />
                      )}
                    </div>
                    <span>{getShipping() === 0 ? "FREE" : `$${getShipping().toFixed(2)}`}</span>
                  </div>
                  
                  {/* Shipping details */}
                  {shippingDetails && (
                    <div className="text-xs text-gray-500 space-y-1">
                      {shippingDetails.free_shipping_applied && (
                        <p className="text-green-600 font-medium">✓ Free shipping applied!</p>
                      )}
                      {shippingDetails.free_shipping_remaining > 0 && (
                        <p className="text-purple-600">
                          Add ${shippingDetails.free_shipping_remaining.toFixed(2)} more for free shipping
                        </p>
                      )}
                      {shippingDetails.estimated_delivery && (
                        <p>Estimated delivery: {shippingDetails.estimated_delivery}</p>
                      )}
                      {shippingDetails.shipping_method && (
                        <p>{shippingDetails.shipping_method}</p>
                      )}
                    </div>
                  )}
                  
                  <div className="flex justify-between text-lg font-bold text-gray-900 border-t pt-2">
                    <span>Total</span>
                    <span>${getTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Continue to Payment"
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                You will be redirected to Stripe for secure payment
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
