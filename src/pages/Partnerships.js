import React from 'react';
import GenericFooterPage from './GenericFooterPage';
import { Button } from '../components/ui/button';
import { Handshake, Users, Store } from 'lucide-react';
import { Link } from 'react-router-dom';

const Partnerships = () => {
  return (
    <GenericFooterPage 
      title="Partnerships" 
      subtitle="Grow with Got-Stock"
    >
      <div className="space-y-12">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-lg text-gray-700 mb-8">
            We're always looking for strategic partners to help us innovate and improve the e-commerce experience.
            Whether you're a logistics provider, technology platform, or influencer, we want to hear from you.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white border border-gray-200 p-8 rounded-xl hover:shadow-lg transition cursor-pointer">
            <Store className="h-10 w-10 text-brand-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Retail Partners</h3>
            <p className="text-gray-600 mb-4">
              For established brands looking for a dedicated brand store experience.
            </p>
            <Link to="/contact-us" className="text-brand-600 font-medium hover:underline">
              Contact Retail Team →
            </Link>
          </div>

          <div className="bg-white border border-gray-200 p-8 rounded-xl hover:shadow-lg transition cursor-pointer">
            <Users className="h-10 w-10 text-brand-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Influencers</h3>
            <p className="text-gray-600 mb-4">
              Join our affiliate program and earn commission by promoting products you love.
            </p>
            <Link to="/contact-us" className="text-brand-600 font-medium hover:underline">
              Join Affiliate Program →
            </Link>
          </div>

          <div className="bg-white border border-gray-200 p-8 rounded-xl hover:shadow-lg transition cursor-pointer">
            <Handshake className="h-10 w-10 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Tech & Logistics</h3>
            <p className="text-gray-600 mb-4">
              Integrate your services with our platform to serve our seller community.
            </p>
            <Link to="/contact-us" className="text-blue-600 font-medium hover:underline">
              Partner With Us →
            </Link>
          </div>
        </div>
      </div>
    </GenericFooterPage>
  );
};

export default Partnerships;
