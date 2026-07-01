import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import ChatBot from '../components/ChatBot';

const GenericFooterPage = ({ title, subtitle, children }) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header simple={true} />

      {/* Hero band — dark, editorial, with a single magenta accent */}
      <div className="relative bg-gray-950 overflow-hidden">
        {/* subtle brand glow */}
        <div className="pointer-events-none absolute -top-28 left-1/2 -translate-x-1/2 h-64 w-[40rem] rounded-full bg-brand-500/20 blur-3xl" />
        <div className="container mx-auto px-4 relative">
          <div className="pt-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          </div>
          <div className="max-w-3xl pt-8 pb-14">
            <div className="h-1 w-12 rounded-full bg-brand-500 mb-6" />
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-4 text-lg leading-relaxed text-gray-400">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Content on a clean light canvas */}
      <div className="container mx-auto px-4 py-14 max-w-4xl flex-grow">
        {children}
      </div>

      <ChatBot />
    </div>
  );
};

export default GenericFooterPage;
