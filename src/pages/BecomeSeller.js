import React from 'react';
import GenericFooterPage from './GenericFooterPage';
import { Button } from '../components/ui/button';
import { CheckCircle, TrendingUp, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const BecomeSeller = () => {
  return (
    <GenericFooterPage 
      title="Become a Seller" 
      subtitle="Join thousands of successful businesses on Got-Stock"
    >
      <div className="space-y-16">
        {/* Hero Stats */}
        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="p-6">
            <div className="text-4xl font-bold text-brand-600 mb-2">100k+</div>
            <div className="text-gray-600">Active Monthly Shoppers</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-brand-600 mb-2">$50M+</div>
            <div className="text-gray-600">Seller Revenue Generated</div>
          </div>
          <div className="p-6">
            <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
            <div className="text-gray-600">Seller Support</div>
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-gray-50 rounded-3xl p-12">
          <h2 className="text-3xl font-bold text-center mb-12">Why Sell With Us?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <TrendingUp className="h-10 w-10 text-brand-600 mb-6" />
              <h3 className="font-bold text-xl mb-4">Reach More Customers</h3>
              <p className="text-gray-600">
                Access a massive audience of engaged shoppers looking for products just like yours.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <Shield className="h-10 w-10 text-brand-600 mb-6" />
              <h3 className="font-bold text-xl mb-4">Secure Payments</h3>
              <p className="text-gray-600">
                Get paid fast and securely. We handle fraud protection so you can focus on selling.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <CheckCircle className="h-10 w-10 text-blue-600 mb-6" />
              <h3 className="font-bold text-xl mb-4">Easy Management</h3>
              <p className="text-gray-600">
                Powerful dashboard to track sales, manage inventory, and analyze performance.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to start selling?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Setup is free and takes less than 10 minutes. No credit card required to start.
          </p>
          <Link to="/seller/register">
            <Button size="lg" className="bg-brand-600 hover:bg-brand-700 text-white text-lg px-12 py-6">
              Register Now
            </Button>
          </Link>
        </div>
      </div>
    </GenericFooterPage>
  );
};

export default BecomeSeller;
