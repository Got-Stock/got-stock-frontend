import React from 'react';
import GenericFooterPage from './GenericFooterPage';
import { ChevronRight } from 'lucide-react';

const HelpCentre = () => {
  const faqs = [
    {
      category: "Orders & Shipping",
      questions: [
        "Where is my order?",
        "How do I track my package?",
        "Do you ship internationally?",
        "Can I change my shipping address?"
      ]
    },
    {
      category: "Returns & Refunds",
      questions: [
        "What is your return policy?",
        "How do I request a refund?",
        "Can I exchange an item?",
        "Who pays for return shipping?"
      ]
    },
    {
      category: "Account & Payment",
      questions: [
        "How do I create an account?",
        "What payment methods do you accept?",
        "Is my payment information secure?",
        "I forgot my password"
      ]
    }
  ];

  return (
    <GenericFooterPage 
      title="Help Centre" 
      subtitle="Find answers to frequently asked questions"
    >
      <div className="space-y-12">
        <div className="bg-purple-50 p-8 rounded-xl text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Need immediate assistance?</h2>
          <p className="text-gray-700 mb-6">
            Our support team is available 24/7 to help you with any issues.
          </p>
          <a href="/contact-us" className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition">
            Contact Support
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {faqs.map((section, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-900 mb-4 text-purple-600">
                {section.category}
              </h3>
              <ul className="space-y-3">
                {section.questions.map((q, qIdx) => (
                  <li key={qIdx}>
                    <a href="#" className="flex items-center justify-between text-gray-600 hover:text-purple-600 transition group">
                      <span className="text-sm">{q}</span>
                      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </GenericFooterPage>
  );
};

export default HelpCentre;
