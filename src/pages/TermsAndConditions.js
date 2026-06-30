import React from 'react';
import GenericFooterPage from './GenericFooterPage';

const TermsAndConditions = () => {
  return (
    <GenericFooterPage 
      title="Terms & Conditions" 
      subtitle="User Agreement"
    >
      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
          <p>
            Welcome to Got-Stock. By accessing our website, you agree to these Terms and Conditions.
            Please read them carefully.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Use of Platform</h2>
          <p className="mb-2">You must be at least 18 years old to use this website.</p>
          <p>
            You agree not to use the platform for any illegal or unauthorized purpose.
            We reserve the right to refuse service to anyone for any reason at any time.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Products and Services</h2>
          <p>
            Prices for our products are subject to change without notice.
            We reserve the right to modify or discontinue the Service (or any part or content thereof) without notice at any time.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Accuracy of Billing</h2>
          <p>
            We reserve the right to refuse any order you place with us. We may, in our sole discretion, limit or cancel quantities purchased per person, per household or per order.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Governing Law</h2>
          <p>
            These Terms of Service and any separate agreements whereby we provide you Services shall be governed by and construed in accordance with the laws of Australia.
          </p>
        </section>

        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mt-8">
          <p className="text-sm text-gray-600">
            Last updated: November 2025. These terms are subject to change. Please check back regularly for updates.
          </p>
        </div>
      </div>
    </GenericFooterPage>
  );
};

export default TermsAndConditions;
