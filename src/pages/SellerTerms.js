import React from 'react';
import GenericFooterPage from './GenericFooterPage';

const SellerTerms = () => {
  return (
    <GenericFooterPage 
      title="Seller Terms & Conditions" 
      subtitle="Terms governing seller activity on the Got-Stock marketplace"
    >
      <div className="space-y-8">
        <div className="bg-[#FF3CFE]/10 border border-[#FF3CFE]/30 p-6 rounded-xl">
          <p className="text-white/80">
            This page contains the complete Seller Terms & Conditions that govern how sellers operate on the Got-Stock marketplace. 
            These terms work in conjunction with our general Terms & Conditions and outline specific requirements, fees, obligations, and rights for sellers.
          </p>
        </div>
        
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">Key Seller Obligations</h2>
          <ul className="list-disc pl-6 space-y-2 text-white/70">
            <li>Provide accurate product descriptions and genuine products</li>
            <li>Supply proof of authenticity for luxury/high-value items</li>
            <li>Ship orders within agreed timeframes</li>
            <li>Comply with all marketplace policies and Australian law</li>
            <li>Pay applicable commission fees</li>
          </ul>
        </section>

        <p className="text-white/60 italic">
          For the complete Seller Terms & Conditions, please contact our seller support team or refer to your seller dashboard.
        </p>
      </div>
    </GenericFooterPage>
  );
};

export default SellerTerms;
