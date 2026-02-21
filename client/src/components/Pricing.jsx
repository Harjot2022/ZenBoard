import React from 'react';
import { Check } from 'lucide-react';

const Pricing = () => {
  const tiers = [
    { name: 'Free', price: '$0', features: ['Up to 3 boards', 'Basic team collaboration', 'Community support'] },
    { name: 'Pro', price: '$12', popular: true, features: ['Unlimited boards', 'Advanced reporting', 'Priority email support', 'Custom backgrounds'] },
    { name: 'Enterprise', price: '$49', features: ['Everything in Pro', 'SSO authentication', 'Dedicated success manager', '24/7 phone support'] }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-gray-900 mb-4">Simple, transparent pricing</h2>
        <p className="text-xl text-gray-500 mb-16">No hidden fees. Cancel anytime.</p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
          {tiers.map((tier) => (
            <div key={tier.name} className={`bg-white rounded-2xl shadow-sm border ${tier.popular ? 'border-blue-500 ring-2 ring-blue-500 shadow-xl relative' : 'border-gray-200'} p-8 flex flex-col`}>
              {tier.popular && <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold tracking-wide">MOST POPULAR</span>}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-extrabold text-gray-900">{tier.price}</span>
                <span className="text-gray-500">/user/month</span>
              </div>
              <ul className="space-y-4 mb-8 flex-1">
                {tier.features.map(feature => (
                  <li key={feature} className="flex items-center gap-3 text-gray-600">
                    <Check size={18} className="text-blue-500 flex-shrink-0" /> {feature}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-lg font-bold transition ${tier.popular ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'}`}>
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;