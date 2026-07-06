import React from 'react';
import GenericFooterPage from './GenericFooterPage';
import { Truck, Globe, Clock } from 'lucide-react';

const ShippingInfo = () => {
  return (
    <GenericFooterPage 
      title="Shipping Information" 
      subtitle="Everything you need to know about delivery"
    >
      <div className="space-y-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300">
            <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-2">Standard Delivery</h3>
            <p className="text-gray-600 text-sm">3-5 Business Days</p>
            <p className="text-brand-600 font-bold mt-2">Free over $50</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300">
            <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-2">Express Delivery</h3>
            <p className="text-gray-600 text-sm">1-2 Business Days</p>
            <p className="text-brand-600 font-bold mt-2">Flat rate $14.95</p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-200 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition duration-300">
            <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-2">International</h3>
            <p className="text-gray-600 text-sm">7-14 Business Days</p>
            <p className="text-brand-600 font-bold mt-2">Calculated at checkout</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Order Processing</h3>
          <p className="text-gray-700 leading-relaxed">
            All orders are processed within 1-2 business days. Orders are not shipped or delivered on weekends or holidays.
            If we are experiencing a high volume of orders, shipments may be delayed by a few days.
          </p>

          <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">Shipping Rates & Delivery Estimates</h3>
          <p className="text-gray-700 leading-relaxed">
            Shipping charges for your order will be calculated and displayed at checkout. Delivery delays can occasionally occur.
          </p>
          
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full bg-white border border-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-3 px-4 border-b text-left">Shipping Method</th>
                  <th className="py-3 px-4 border-b text-left">Estimated Delivery Time</th>
                  <th className="py-3 px-4 border-b text-left">Cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-3 px-4 border-b">Standard Shipping</td>
                  <td className="py-3 px-4 border-b">3-5 business days</td>
                  <td className="py-3 px-4 border-b">$9.95 (Free over $50)</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 border-b">Express Shipping</td>
                  <td className="py-3 px-4 border-b">1-2 business days</td>
                  <td className="py-3 px-4 border-b">$14.95</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </GenericFooterPage>
  );
};

export default ShippingInfo;
