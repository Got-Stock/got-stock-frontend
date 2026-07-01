import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import ChatBot from '../components/ChatBot';

const GenericFooterPage = ({ title, subtitle, children }) => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FF3CFE] to-black flex flex-col">
      <Header simple={true} />

      <div className="py-16 relative">
        <div className="container mx-auto px-4 text-center">
          {/* Back Button - Top Right */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 right-4 bg-white text-black hover:bg-gray-200 transition px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xl text-white max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl flex-grow">
        {children}
      </div>

      {/* ChatBot */}
      <ChatBot />
    </div>
  );
};

export default GenericFooterPage;
