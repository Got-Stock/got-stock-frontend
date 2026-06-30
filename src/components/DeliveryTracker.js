import React from 'react';
import { Package, Truck, CheckCircle, Clock, MapPin, AlertCircle } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';

const DeliveryTracker = ({ order, variant = 'buyer' }) => {
  // variant can be 'buyer', 'seller', or 'admin'
  
  if (!order) return null;

  const getStatusSteps = () => {
    const allSteps = [
      { id: 'placed', label: 'Order Placed', icon: Package },
      { id: 'confirmed', label: 'Confirmed', icon: CheckCircle },
      { id: 'processing', label: 'Processing', icon: Clock },
      { id: 'shipped', label: 'Shipped', icon: Truck },
      { id: 'out_for_delivery', label: 'Out for Delivery', icon: MapPin },
      { id: 'delivered', label: 'Delivered', icon: CheckCircle }
    ];

    const statusMapping = {
      'pending': 0,
      'confirmed': 1,
      'processing': 2,
      'shipped': 3,
      'out_for_delivery': 4,
      'delivered': 5,
      'cancelled': -1
    };

    const currentIndex = statusMapping[order.status] || 0;
    
    return allSteps.map((step, index) => ({
      ...step,
      completed: index < currentIndex,
      active: index === currentIndex,
      upcoming: index > currentIndex
    }));
  };

  const getColorScheme = () => {
    if (variant === 'seller') {
      return {
        primary: 'cyan-500',
        secondary: 'cyan-600',
        bg: 'from-black to-[#00ffef]',
        card: 'bg-gray-900 border-cyan-500/20',
        text: 'text-cyan-400',
        textSecondary: 'text-gray-300'
      };
    } else if (variant === 'admin') {
      return {
        primary: 'blue-500',
        secondary: 'blue-600',
        bg: 'from-gray-900 to-gray-800',
        card: 'bg-white',
        text: 'text-blue-600',
        textSecondary: 'text-gray-600'
      };
    } else {
      return {
        primary: 'purple-500',
        secondary: 'purple-600',
        bg: 'from-purple-50 to-white',
        card: 'bg-white',
        text: 'text-purple-600',
        textSecondary: 'text-gray-600'
      };
    }
  };

  const colors = getColorScheme();
  const steps = getStatusSteps();
  const isCancelled = order.status === 'cancelled';

  return (
    <Card className={`${colors.card} shadow-lg`}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className={`text-lg font-bold ${variant === 'seller' ? 'text-white' : 'text-gray-900'}`}>
              Order #{order.order_id || order.id}
            </h3>
            <p className={`text-sm ${colors.textSecondary}`}>
              {order.items?.length || 0} item(s) • ${order.total_amount || '0.00'}
            </p>
          </div>
          <Badge 
            variant={isCancelled ? 'destructive' : 'default'}
            className={isCancelled ? '' : `bg-${colors.primary} hover:bg-${colors.secondary}`}
          >
            {isCancelled ? 'Cancelled' : order.status?.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>

        {/* Tracking Timeline */}
        {!isCancelled && (
          <div className="space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="relative">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step.completed
                          ? `bg-${colors.primary} text-white`
                          : step.active
                          ? `bg-${colors.primary} text-white animate-pulse`
                          : variant === 'seller'
                          ? 'bg-gray-800 text-gray-500'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    {/* Connecting Line */}
                    {index < steps.length - 1 && (
                      <div
                        className={`absolute left-5 top-10 w-0.5 h-8 ${
                          step.completed
                            ? `bg-${colors.primary}`
                            : variant === 'seller'
                            ? 'bg-gray-800'
                            : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-8">
                    <p
                      className={`font-medium ${
                        step.completed || step.active
                          ? variant === 'seller'
                            ? 'text-white'
                            : 'text-gray-900'
                          : colors.textSecondary
                      }`}
                    >
                      {step.label}
                    </p>
                    {step.active && order.tracking_details && (
                      <div className={`mt-2 text-sm ${colors.textSecondary}`}>
                        {order.tracking_details.location && (
                          <p>📍 {order.tracking_details.location}</p>
                        )}
                        {order.tracking_details.carrier && (
                          <p>🚚 {order.tracking_details.carrier}</p>
                        )}
                        {order.tracking_details.tracking_number && (
                          <p>📦 Tracking: {order.tracking_details.tracking_number}</p>
                        )}
                        {order.tracking_details.estimated_delivery && (
                          <p>📅 Est. Delivery: {new Date(order.tracking_details.estimated_delivery).toLocaleDateString()}</p>
                        )}
                      </div>
                    )}
                    {step.completed && step.id === 'delivered' && order.delivered_at && (
                      <p className={`text-xs ${colors.textSecondary} mt-1`}>
                        Delivered on {new Date(order.delivered_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Cancelled Status */}
        {isCancelled && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <div>
              <p className="font-medium text-red-900">Order Cancelled</p>
              {order.cancellation_reason && (
                <p className="text-sm text-red-700 mt-1">Reason: {order.cancellation_reason}</p>
              )}
            </div>
          </div>
        )}

        {/* Shipping Address */}
        {order.shipping_address && (
          <div className={`mt-6 p-4 rounded-lg ${
            variant === 'seller' ? 'bg-gray-800' : 'bg-gray-50'
          }`}>
            <p className={`text-sm font-medium mb-2 ${
              variant === 'seller' ? 'text-white' : 'text-gray-900'
            }`}>
              Delivery Address
            </p>
            <p className={`text-sm ${colors.textSecondary}`}>
              {order.shipping_address.street}<br />
              {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}<br />
              {order.shipping_address.country}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeliveryTracker;