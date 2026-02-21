import React from 'react';

// Reusable component for text-heavy pages
const TextPage = ({ title, lastUpdated, children }) => {
  return (
    <div className="min-h-screen bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{title}</h1>
        {lastUpdated && <p className="text-gray-500 mb-8 border-b pb-8">Last updated: {lastUpdated}</p>}
        
        {/* The 'prose' class assumes you are using @tailwindcss/typography plugin, 
            but standard Tailwind classes work fine too for a simple layout. */}
        <div className="text-gray-700 space-y-6 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};

export default TextPage;