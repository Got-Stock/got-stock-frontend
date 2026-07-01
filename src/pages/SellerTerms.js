import React from 'react';
import GenericFooterPage from './GenericFooterPage';

const SellerTerms = () => {
  return (
    <GenericFooterPage
      title="Seller Terms & Conditions"
      subtitle="Terms governing seller activity on the Got-Stock marketplace"
    >
      <div className="space-y-8">
        <div className="bg-brand-50 border border-brand-100 p-6 rounded-xl">
          <p className="text-gray-700 leading-relaxed">
            This page contains the complete Seller Terms &amp; Conditions that govern how sellers operate on the Got-Stock marketplace.
            These terms work in conjunction with our general Terms &amp; Conditions and outline specific requirements, fees, obligations, and rights for sellers.
          </p>
        </div>

        <section className="bg-white border border-gray-200 shadow-sm p-8 rounded-xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Seller Obligations</h2>
          <ul className="space-y-3">
            {[
              'Provide accurate product descriptions and genuine products',
              'Supply proof of authenticity for luxury/high-value items',
              'Ship orders within agreed timeframes',
              'Comply with all marketplace policies and Australian law',
              'Pay applicable commission fees',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-gray-700">
                <span className="text-brand-600 mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <p className="text-gray-500 italic">
          For the complete Seller Terms &amp; Conditions, please contact our seller support team or refer to your seller dashboard.
        </p>
      </div>
    </GenericFooterPage>
  );
};

export default SellerTerms;
