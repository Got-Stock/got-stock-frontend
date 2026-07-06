import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import ChatBot from '../components/ChatBot';
import { Reveal } from '../components/Reveal';
import { usePanel } from '../context/PanelContext';

const GenericFooterPage = ({ title, subtitle, eyebrow = 'Got-Stock', children }) => {
  const navigate = useNavigate();
  const { inPanel } = usePanel();

  return (
    <div className={`${inPanel ? '' : 'min-h-screen'} bg-gray-50 flex flex-col`}>
      {!inPanel && <Header simple={true} />}

      {/* Hero band — dark, editorial, with animated brand aurora + dot texture */}
      <div className="relative bg-gray-950 overflow-hidden">
        {/* drifting aurora glows */}
        <div className="pointer-events-none absolute -top-32 left-1/3 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-brand-500/25 blur-3xl gs-aurora" />
        <div className="pointer-events-none absolute -bottom-40 right-0 h-72 w-[30rem] rounded-full bg-brand-700/20 blur-3xl gs-glow" />
        {/* subtle dot grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.35) 1px, transparent 0)',
            backgroundSize: '22px 22px',
          }}
        />

        <div className="container mx-auto px-4 relative">
          {!inPanel && (
            <div className="pt-6">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </button>
            </div>
          )}

          <Reveal className="max-w-3xl pt-10 pb-16">
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500 gs-glow" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">
                {eyebrow}
              </span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-4 text-lg leading-relaxed text-gray-400 max-w-2xl">
                {subtitle}
              </p>
            )}
            <div className="mt-7 h-1 w-16 rounded-full bg-gradient-to-r from-brand-500 to-brand-500/0" />
          </Reveal>
        </div>
      </div>

      {/* Content on a clean light canvas — fades up on load */}
      <Reveal className="container mx-auto px-4 py-14 max-w-4xl flex-grow" delay={120}>
        {children}
      </Reveal>

      {!inPanel && <ChatBot />}
    </div>
  );
};

export default GenericFooterPage;
