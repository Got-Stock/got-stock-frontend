import React from 'react';
import GenericFooterPage from './GenericFooterPage';
import { Book, HelpCircle, TrendingUp, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

const SellerResources = () => {
  return (
    <GenericFooterPage 
      title="Seller Resources" 
      subtitle="Tools and guides to help you succeed on Got-Stock"
    >
      <div className="space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-[#FF3CFE]/20 via-purple-900/30 to-black/80 p-6 rounded-xl border border-[#FF3CFE]/30">
            <div className="w-12 h-12 bg-gradient-to-r from-[#FF3CFE] to-black rounded-lg flex items-center justify-center mb-4">
              <Book className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-bold text-xl text-white mb-2">Seller Handbook</h3>
            <p className="text-white/70 mb-4">
              Complete guide to listing products, managing orders, and maximizing your sales on Got-Stock.
            </p>
            <Button variant="outline" className="border-[#FF3CFE] text-white hover:bg-[#FF3CFE]/20">
              View Handbook
            </Button>
          </div>

          <div className="bg-gradient-to-br from-[#FF3CFE]/20 via-purple-900/30 to-black/80 p-6 rounded-xl border border-[#FF3CFE]/30">
            <div className="w-12 h-12 bg-gradient-to-r from-[#FF3CFE] to-black rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-bold text-xl text-white mb-2">Best Practices</h3>
            <p className="text-white/70 mb-4">
              Learn how top sellers optimize their listings, pricing, and customer service for maximum revenue.
            </p>
            <Button variant="outline" className="border-[#FF3CFE] text-white hover:bg-[#FF3CFE]/20">
              Read Guide
            </Button>
          </div>

          <div className="bg-gradient-to-br from-[#FF3CFE]/20 via-purple-900/30 to-black/80 p-6 rounded-xl border border-[#FF3CFE]/30">
            <div className="w-12 h-12 bg-gradient-to-r from-[#FF3CFE] to-black rounded-lg flex items-center justify-center mb-4">
              <Package className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-bold text-xl text-white mb-2">Product Guidelines</h3>
            <p className="text-white/70 mb-4">
              Requirements for product listings, photography, descriptions, and authenticity verification.
            </p>
            <Button variant="outline" className="border-[#FF3CFE] text-white hover:bg-[#FF3CFE]/20">
              View Guidelines
            </Button>
          </div>

          <div className="bg-gradient-to-br from-[#FF3CFE]/20 via-purple-900/30 to-black/80 p-6 rounded-xl border border-[#FF3CFE]/30">
            <div className="w-12 h-12 bg-gradient-to-r from-[#FF3CFE] to-black rounded-lg flex items-center justify-center mb-4">
              <HelpCircle className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-bold text-xl text-white mb-2">Seller Support</h3>
            <p className="text-white/70 mb-4">
              Get help from our dedicated seller support team. We're here to help you succeed.
            </p>
            <Link to="/contact-us">
              <Button variant="outline" className="border-[#FF3CFE] text-white hover:bg-[#FF3CFE]/20">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>

        <section className="bg-black/60 border border-[#FF3CFE]/30 p-6 rounded-xl">
          <h2 className="text-xl font-bold text-white mb-4">Quick Tips for New Sellers</h2>
          <ul className="space-y-2 text-white/70">
            <li>✓ Use high-quality product photos from multiple angles</li>
            <li>✓ Write detailed, accurate product descriptions</li>
            <li>✓ Price competitively while maintaining profitability</li>
            <li>✓ Ship orders promptly and provide tracking information</li>
            <li>✓ Respond to customer inquiries within 24 hours</li>
            <li>✓ Keep your inventory updated to avoid overselling</li>
          </ul>
        </section>
      </div>
    </GenericFooterPage>
  );
};

export default SellerResources;