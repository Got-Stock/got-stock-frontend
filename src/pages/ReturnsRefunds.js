import React from 'react';
import GenericFooterPage from './GenericFooterPage';
import { RefreshCw, Clock, Truck, Shield, AlertCircle, CheckCircle } from 'lucide-react';

export default function ReturnsRefunds() {
  return (
    <GenericFooterPage 
      title="Returns & Refunds Policy" 
      subtitle="Your rights and what to expect"
    >
      <div className="space-y-8">
        {/* Overview */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Overview</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            Got-Stock Marketplace acts as an introductory platform connecting Customers with Sellers. All transactions are directly between the Customer and the Seller.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            <strong>Sellers are solely responsible</strong> for fulfilling orders, handling returns, and processing refunds.
          </p>
        </div>

        {/* Returns Eligibility */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-b from-[#FF3CFE] to-black rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Returns Eligibility</h2>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Sellers MUST accept returns when products are:</h3>
            <ul className="space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-[#FF3CFE] mt-1">✓</span>
                <span className="text-gray-700">Faulty</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF3CFE] mt-1">✓</span>
                <span className="text-gray-700">Damaged</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF3CFE] mt-1">✓</span>
                <span className="text-gray-700">Unsafe</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF3CFE] mt-1">✓</span>
                <span className="text-gray-700">Not as described in the product listing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#FF3CFE] mt-1">✓</span>
                <span className="text-gray-700">Incorrectly delivered</span>
              </li>
            </ul>
          </div>

          <div className="bg-brand-50 rounded-lg p-4 border-2 border-[#FF3CFE]">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Change-of-Mind Returns</h3>
            <p className="text-gray-700">
              May be offered at the discretion of the Seller. Must be clearly stated on the product listing.
            </p>
          </div>
        </div>

        {/* Timeframes */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-b from-[#FF3CFE] to-black rounded-full flex items-center justify-center">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Return Timeframes</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-brand-50 rounded-lg p-4 border border-[#FF3CFE]">
              <h3 className="font-bold text-gray-900 mb-2">Acknowledgement</h3>
              <p className="text-2xl font-bold text-[#FF3CFE]">2 business days</p>
              <p className="text-sm text-gray-600 mt-1">Sellers must acknowledge return requests</p>
            </div>
            
            <div className="bg-brand-50 rounded-lg p-4 border border-[#FF3CFE]">
              <h3 className="font-bold text-gray-900 mb-2">Return Label</h3>
              <p className="text-2xl font-bold text-[#FF3CFE]">1 business day</p>
              <p className="text-sm text-gray-600 mt-1">Prepaid return labels provided</p>
            </div>
            
            <div className="bg-brand-50 rounded-lg p-4 border border-[#FF3CFE]">
              <h3 className="font-bold text-gray-900 mb-2">Inspection</h3>
              <p className="text-2xl font-bold text-[#FF3CFE]">3 business days</p>
              <p className="text-sm text-gray-600 mt-1">After return is received</p>
            </div>
            
            <div className="bg-brand-50 rounded-lg p-4 border border-[#FF3CFE]">
              <h3 className="font-bold text-gray-900 mb-2">Refund Approval</h3>
              <p className="text-2xl font-bold text-[#FF3CFE]">1 business day</p>
              <p className="text-sm text-gray-600 mt-1">After inspection complete</p>
            </div>
          </div>
        </div>

        {/* Return Shipping */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-b from-[#FF3CFE] to-black rounded-full flex items-center justify-center">
              <Truck className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Return Shipping</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Seller Responsibility:</h3>
              <p className="text-gray-700">For products that are faulty, misdescribed, damaged, or incorrectly shipped.</p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Customer Responsibility:</h3>
              <p className="text-gray-700">For change-of-mind returns (if the Seller offers them).</p>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-400">
              <p className="text-gray-900 font-bold">⚠️ Important: All return shipping must use traceable courier services.</p>
            </div>
          </div>
        </div>

        {/* Refund Method */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-b from-[#FF3CFE] to-black rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Refund Method</h2>
          </div>
          
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-[#FF3CFE] mt-1">✓</span>
              <span>Refunds <strong>must be processed via the Got-Stock payment system</strong></span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#FF3CFE] mt-1">✓</span>
              <span>Issued to the <strong>original payment method</strong> used for purchase</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-600 mt-1">✗</span>
              <span>Manual refunds outside of Got-Stock platform are <strong>not permitted</strong></span>
            </li>
          </ul>
        </div>

        {/* Customer Tips */}
        <div className="bg-gradient-to-b from-brand-50 to-white rounded-2xl p-8 border-2 border-[#FF3CFE]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-b from-[#FF3CFE] to-black rounded-full flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Customer Tips for Smooth Returns</h2>
          </div>
          
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-[#FF3CFE] mt-1">•</span>
              <span>Keep all original tags and packaging</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#FF3CFE] mt-1">•</span>
              <span>Take photos if the item is faulty or damaged</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#FF3CFE] mt-1">•</span>
              <span>Contact the Seller promptly for any issues</span>
            </li>
          </ul>
        </div>
      </div>
    </GenericFooterPage>
  );
}