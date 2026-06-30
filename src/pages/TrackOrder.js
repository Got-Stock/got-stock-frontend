import React, { useState } from 'react';
import GenericFooterPage from './GenericFooterPage';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Search, Package } from 'lucide-react';

const TrackOrder = () => {
  const [orderId, setOrderId] = useState('');
  const [email, setEmail] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = (e) => {
    e.preventDefault();
    setLoading(true);
    // Mock tracking functionality
    setTimeout(() => {
      setTrackingResult({
        status: "Processing",
        location: "Melbourne Warehouse",
        estimatedDelivery: "3-5 Business Days"
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <GenericFooterPage 
      title="Track Your Order" 
      subtitle="Enter your order details to check the status"
    >
      <div className="max-w-xl mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <form onSubmit={handleTrack} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order Number
              </label>
              <Input 
                type="text" 
                placeholder="e.g. GS-123456" 
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <Input 
                type="email" 
                placeholder="Enter the email used at checkout" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6"
            >
              {loading ? 'Tracking...' : 'Track Order'}
              {!loading && <Search className="ml-2 h-4 w-4" />}
            </Button>
          </form>

          {trackingResult && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Package className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Order Status: {trackingResult.status}</h3>
                  <p className="text-sm text-gray-600">Tracking ID: {orderId || 'GS-123456'}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Location:</span>
                  <span className="font-medium">{trackingResult.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Est. Delivery:</span>
                  <span className="font-medium">{trackingResult.estimatedDelivery}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </GenericFooterPage>
  );
};

export default TrackOrder;
