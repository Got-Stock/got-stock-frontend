import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, FileText } from 'lucide-react';
import Header from '../components/Header';
import CategoryNav from '../components/CategoryNav';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      <CategoryNav />

      {/* Hero */}
      <section className="relative bg-gray-950 text-white py-24 overflow-hidden">
        <div className="pointer-events-none absolute -top-32 left-1/3 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-brand-500/25 blur-3xl gs-aurora" />
        <div className="pointer-events-none absolute -bottom-40 right-0 h-72 w-[30rem] rounded-full bg-brand-700/20 blur-3xl gs-glow" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.35) 1px, transparent 0)', backgroundSize: '22px 22px' }}
        />
        <div className="relative container mx-auto px-4 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 ring-1 ring-white/10 mb-6 gs-float">
            <Shield className="h-8 w-8 text-brand-400" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-400">Your privacy matters to us</p>
          <div className="mt-7 mx-auto h-1 w-16 rounded-full bg-gradient-to-r from-brand-500/0 via-brand-500 to-brand-500/0" />
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <p className="text-gray-600 mb-8"><strong>Effective Date:</strong> November 2024</p>
          
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Got-Stock Marketplace ("we", "us", "our") is committed to protecting your privacy and ensuring your personal information is handled responsibly. This Privacy Policy explains how we collect, use, and store your information when you visit our website or use our services.
          </p>

          {/* Section 1 */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-brand-100 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-brand-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">1. Information We Collect</h2>
            </div>
            <p className="text-gray-700 mb-4">We may collect the following types of information:</p>
            
            <div className="space-y-4 ml-4">
              <div>
                <h3 className="font-bold text-gray-900 mb-2">Personal Information</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                  <li>Billing and shipping addresses</li>
                  <li>Account information</li>
                  <li>Order & transaction history</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-2">Payment Information</h3>
                <p className="text-gray-700">Processed securely through third-party payment providers. We do not store full credit card details.</p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-2">Technical Information</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>IP address</li>
                  <li>Browser type</li>
                  <li>Device type</li>
                  <li>Cookies and usage analytics</li>
                </ul>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-2">Seller Information</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Business details (ABN, business name)</li>
                  <li>Contact information</li>
                  <li>Inventory and listing data</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 2 */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-brand-100 rounded-lg flex items-center justify-center">
                <Eye className="h-5 w-5 text-brand-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">2. How We Use Your Information</h2>
            </div>
            <p className="text-gray-700 mb-3">We use your information to:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Process and fulfil orders</li>
              <li>Manage your account</li>
              <li>Communicate order updates and support messages</li>
              <li>Improve platform performance and user experience</li>
              <li>Prevent fraud and maintain platform security</li>
              <li>Provide sellers with the information required to complete your order</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-brand-100 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-brand-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">3. Sharing of Information</h2>
            </div>
            <p className="text-gray-700 mb-3">We may share your information with:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
              <li>Approved sellers (for order fulfilment)</li>
              <li>Payment processors</li>
              <li>Shipping carriers</li>
              <li>Service providers such as analytics or platform tools</li>
              <li>Authorities if required by law</li>
            </ul>
            <p className="text-gray-900 font-bold mt-4">We do not sell or rent your personal information.</p>
          </div>

          {/* Additional sections continue... */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">4. Cookies & Tracking Technologies</h2>
              <p className="text-gray-700 mb-2">We use cookies to:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Improve site functionality</li>
                <li>Understand user behaviour</li>
                <li>Provide personalised content</li>
              </ul>
              <p className="text-gray-700 mt-2">You can manage cookie settings via your browser.</p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">5. Data Security</h2>
              <p className="text-gray-700">
                We use industry-standard encryption and security practices to protect your data. However, no online service is 100% secure.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">6. Your Rights</h2>
              <p className="text-gray-700 mb-2">You may:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                <li>Access your information</li>
                <li>Update or correct your information</li>
                <li>Request deletion</li>
                <li>Opt out of marketing emails</li>
              </ul>
              <p className="text-gray-700 mt-4">
                Contact us at <a href="mailto:admin@got-stock.com" className="text-brand-600 hover:text-brand-700 font-medium">admin@got-stock.com</a> to make a request.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">7. Changes to This Policy</h2>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. Updates will be posted on this page.
              </p>
            </div>

            <div className="bg-brand-50 rounded-xl p-6 border border-brand-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-3">8. Contact Us</h2>
              <p className="text-gray-700 mb-2">For privacy concerns or questions, please contact:</p>
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