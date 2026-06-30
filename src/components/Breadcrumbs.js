import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

const Breadcrumbs = ({ items }) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className="mb-6 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
      <ol className="flex items-center space-x-2 text-sm font-medium">
        {/* Home link */}
        <li>
          <Link 
            to="/" 
            className="flex items-center text-gray-700 hover:text-purple-600 transition-colors p-1 hover:bg-purple-50 rounded"
            aria-label="Home"
          >
            <Home className="w-5 h-5" />
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={index} className="flex items-center">
              <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
              {isLast ? (
                <span className="text-gray-900 font-semibold px-2 py-1 bg-purple-50 rounded" aria-current="page">
                  {item.label}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="text-gray-700 hover:text-purple-600 transition-colors px-2 py-1 hover:bg-purple-50 rounded"
                >
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
