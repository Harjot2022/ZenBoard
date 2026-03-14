import React, { useState } from 'react';
import { Mail, MessageSquare, MapPin } from 'lucide-react';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true); // Mock submission
  };

  return (
    <div className="min-h-screen bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16">
        
        {/* Left Side: Info */}
        <div>
          <h2 className="text-4xl font-extrabold text-gray-900 mb-6">Get in touch</h2>
          <p className="text-lg text-gray-500 mb-8">Have a question about ZenBoard? Our team is here to help you get the most out of your workflow.</p>
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-gray-600">
              <div className="bg-blue-50 p-3 rounded-full text-blue-600"><Mail size={24} /></div>
              <div><p className="font-bold text-gray-900">Email Us</p><p>support@zenboard.app</p></div>
            </div>
            <div className="flex items-center gap-4 text-gray-600">
              <div className="bg-blue-50 p-3 rounded-full text-blue-600"><MessageSquare size={24} /></div>
              <div><p className="font-bold text-gray-900">Live Chat</p><p>Available 9am - 5pm EST</p></div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="bg-green-100 text-green-600 p-4 rounded-full"><Check size={40} /></div>
              <h3 className="text-2xl font-bold text-gray-900">Message Sent!</h3>
              <p className="text-gray-500">We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="Jane Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input type="email" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="jane@example.com" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea rows="4" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" placeholder="How can we help?"></textarea>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition">Send Message</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;