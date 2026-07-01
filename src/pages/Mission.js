import React from 'react';
import GenericFooterPage from './GenericFooterPage';

const Mission = () => {
  return (
    <GenericFooterPage 
      title="Our Mission" 
      subtitle="Empowering sellers and delighting customers worldwide"
    >
      <div className="space-y-12 text-gray-700 leading-relaxed">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Connecting The World Through Commerce</h2>
            <p className="mb-4">
              At Got-Stock, we believe that commerce is more than just transactions—it's about connection. 
              Our mission is to create a borderless marketplace where quality products find their perfect owners, 
              regardless of geography.
            </p>
            <p>
              We started with a simple idea: to build a platform that puts trust and transparency first. 
              Today, we're proud to connect thousands of independent sellers with millions of shoppers 
              looking for something special.
            </p>
          </div>
          <div className="bg-gray-100 rounded-2xl h-64 flex items-center justify-center text-gray-400">
            [Mission Image Placeholder]
          </div>
        </div>

        <div className="bg-brand-50 p-8 rounded-2xl my-12">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🤝</div>
              <h3 className="font-bold mb-2">Trust First</h3>
              <p className="text-sm">We verify every seller and guarantee every purchase.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🚀</div>
              <h3 className="font-bold mb-2">Innovation</h3>
              <p className="text-sm">Constantly improving the shopping experience through technology.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🌍</div>
              <h3 className="font-bold mb-2">Community</h3>
              <p className="text-sm">Building a supportive ecosystem for sellers to thrive.</p>
            </div>
          </div>
        </div>
      </div>
    </GenericFooterPage>
  );
};

export default Mission;
