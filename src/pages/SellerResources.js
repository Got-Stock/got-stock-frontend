import React from 'react';
import GenericFooterPage from './GenericFooterPage';
import { Book, HelpCircle, TrendingUp, Package, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';

const resources = [
  {
    icon: Book,
    title: 'Seller Handbook',
    description: 'Complete guide to listing products, managing orders, and maximizing your sales on Got-Stock.',
    cta: 'View Handbook',
    to: null,
  },
  {
    icon: TrendingUp,
    title: 'Best Practices',
    description: 'Learn how top sellers optimize their listings, pricing, and customer service for maximum revenue.',
    cta: 'Read Guide',
    to: null,
  },
  {
    icon: Package,
    title: 'Product Guidelines',
    description: 'Requirements for product listings, photography, descriptions, and authenticity verification.',
    cta: 'View Guidelines',
    to: null,
  },
  {
    icon: HelpCircle,
    title: 'Seller Support',
    description: "Get help from our dedicated seller support team. We're here to help you succeed.",
    cta: 'Contact Support',
    to: '/contact-us',
  },
];

const SellerResources = () => {
  return (
    <GenericFooterPage
      title="Seller Resources"
      subtitle="Tools and guides to help you succeed on Got-Stock"
    >
      <div className="space-y-8">
        <div className="grid md:grid-cols-2 gap-6">
          {resources.map(({ icon: Icon, title, description, cta, to }) => {
            const button = (
              <Button variant="outline" className="border-gray-300 text-gray-900 hover:bg-gray-50">
                {cta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            );
            return (
              <div
                key={title}
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-brand-200 transition"
              >
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600 mb-5 leading-relaxed">{description}</p>
                {to ? <Link to={to}>{button}</Link> : button}
              </div>
            );
          })}
        </div>

        <section className="bg-gray-900 rounded-xl p-8">
          <h2 className="text-xl font-bold text-white mb-5">Quick Tips for New Sellers</h2>
          <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-3">
            {[
              'Use high-quality product photos from multiple angles',
              'Write detailed, accurate product descriptions',
              'Price competitively while maintaining profitability',
              'Ship orders promptly and provide tracking information',
              'Respond to customer inquiries within 24 hours',
              'Keep your inventory updated to avoid overselling',
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-3 text-gray-300">
                <span className="text-brand-400 mt-0.5">✓</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </GenericFooterPage>
  );
};

export default SellerResources;
