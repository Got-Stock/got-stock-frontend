import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, ShoppingCart, CreditCard, Truck, RefreshCw, Shield, Mail } from 'lucide-react';
import Header from '../components/Header';
import CategoryNav from '../components/CategoryNav';

export default function TermsOfSale() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <CategoryNav />

      <section className="relative bg-gray-950 text-white py-20 overflow-hidden">
        <div className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 h-64 w-[40rem] rounded-full bg-brand-500/20 blur-3xl" />
        <div className="relative container mx-auto px-4 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10 mb-6">
            <FileText className="h-8 w-8 text-brand-400" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Terms of Sale</h1>
          <p className="text-lg text-gray-400">Clear terms for a transparent shopping experience</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            These Terms of Sale apply to all purchases made through Got-Stock Marketplace.
          </p>

          <div className="space-y-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-brand-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-brand-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">1. Role of Got-Stock</h2>
              </div>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Got-Stock provides a platform where approved sellers offer products for sale.</li>
                <li>When you buy a product:
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                    <li>You are purchasing from the seller, not from Got-Stock (unless otherwise stated).</li>
                    <li>Sellers are responsible for fulfilment, shipping, packaging, and after-sale service.</li>
                  </ul>
                </li>
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-brand-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-brand-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">2. Orders</h2>
              </div>
              <p className="text-gray-700 mb-3">By placing an order:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>You confirm all information provided is accurate.</li>
                <li>You agree to the seller's individual shipping & return policies.</li>
              </ul>
              <p className="text-gray-700 mt-3 mb-2">Orders may be cancelled or refused if:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>The product is unavailable</li>
                <li>There is a pricing error</li>
                <li>Fraud is suspected</li>
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-brand-100 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-brand-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">3. Payment</h2>
              </div>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>All payments must be made at checkout.</li>
                <li>We accept major debit/credit cards and other approved payment methods.</li>
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-brand-100 rounded-lg flex items-center justify-center">
                  <Truck className="h-5 w-5 text-brand-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">4. Shipping</h2>
              </div>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Shipping times & methods vary by seller.</li>
                <li>Sellers are responsible for dispatch, delivery, and tracking.</li>
                <li>Delays caused by carriers or customs are outside our control.</li>
              </ul>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-brand-100 rounded-lg flex items-center justify-center">
                  <RefreshCw className="h-5 w-5 text-brand-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">5. Returns & Refunds</h2>
              </div>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Returns are subject to the seller's own policies.</li>
                <li>You must contact the seller directly for return or refund enquiries.</li>
                <li>Got-Stock may step in to mediate disputes if necessary.</li>
              </ul>
              <Link to="/returns-refunds" className="inline-block mt-3 text-brand-600 hover:text-brand-700 font-medium">
                View our full Returns & Refunds Policy →
              </Link>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 bg-brand-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-brand-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">6. Product Authenticity</h2>
              </div>
              <p className="text-gray-700 mb-3">All sellers must provide authentic, brand-name goods.</p>
              <p className="text-gray-700">
                If you suspect counterfeit items, contact us immediately at{' '}
                <a href="mailto:admin@got-stock.com" className="text-brand-600 hover:text-brand-700 font-medium">
                  admin@got-stock.com
                </a>
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Limitation of Liability</h2>
              <p className="text-gray-700 mb-3">Got-Stock is not liable for:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Delivery issues</li>
                <li>Seller errors</li>
                <li>Product defects</li>
                <li>Losses related to third-party carriers</li>
              </ul>
            </div>

            <div className="bg-brand-50 rounded-xl p-6 border border-brand-100">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="h-6 w-6 text-brand-600" />
                <h2 className="text-2xl font-bold text-gray-900">8. Contact</h2>
              </div>
              <a href="mailto:admin@got-stock.com" className="text-brand-600 hover:text-brand-700 font-bold text-lg">
                📧 admin@got-stock.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}