import React from 'react';
import GenericFooterPage from './GenericFooterPage';
import { Leaf, Recycle, Heart } from 'lucide-react';

const Sustainability = () => {
  return (
    <GenericFooterPage 
      title="Sustainability" 
      subtitle="Our commitment to a greener future"
    >
      <div className="space-y-12">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-lg text-gray-700">
            We believe that e-commerce shouldn't cost the earth. That's why we're implementing strict 
            sustainability standards across our marketplace, from carbon-neutral shipping options to 
            eco-friendly packaging requirements.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-green-50 p-8 rounded-xl text-center border border-green-100">
            <Leaf className="h-10 w-10 text-green-600 mx-auto mb-4" />
            <h3 className="font-bold text-xl mb-3 text-gray-900">Eco-Packaging</h3>
            <p className="text-gray-600">
              We encourage all our sellers to use 100% recyclable or biodegradable packaging materials by 2026.
            </p>
          </div>

          <div className="bg-green-50 p-8 rounded-xl text-center border border-green-100">
            <Recycle className="h-10 w-10 text-green-600 mx-auto mb-4" />
            <h3 className="font-bold text-xl mb-3 text-gray-900">Carbon Offset</h3>
            <p className="text-gray-600">
              We offset carbon emissions for every delivery made through our premium shipping partners.
            </p>
          </div>

          <div className="bg-green-50 p-8 rounded-xl text-center border border-green-100">
            <Heart className="h-10 w-10 text-green-600 mx-auto mb-4" />
            <h3 className="font-bold text-xl mb-3 text-gray-900">Pre-Loved</h3>
            <p className="text-gray-600">
              Promoting the circular economy by giving quality items a second life through our marketplace.
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-8 rounded-2xl">
          <h2 className="text-2xl font-bold mb-4">Our 2026 Goals</h2>
          <ul className="space-y-4">
            <li className="flex items-center gap-3">
              <span className="h-2 w-2 bg-green-500 rounded-full"></span>
              <span>Eliminate single-use plastics from Got-Stock fulfillment centers</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="h-2 w-2 bg-green-500 rounded-full"></span>
              <span>Achieve 100% carbon neutrality for corporate operations</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="h-2 w-2 bg-green-500 rounded-full"></span>
              <span>Partner with 500+ sustainable brands</span>
            </li>
          </ul>
        </div>
      </div>
    </GenericFooterPage>
  );
};

export default Sustainability;
