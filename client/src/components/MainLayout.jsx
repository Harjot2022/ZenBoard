import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { Kanban } from 'lucide-react';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-gray-900">
      
      {/* --- SHARED HEADER --- */}
      <nav className="fixed w-full bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <Kanban className="text-white w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight">ZenBoard</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
              <Link to="/#features" className="text-gray-600 hover:text-blue-600 transition">Features</Link>
              <Link to="/pricing" className="text-gray-600 hover:text-blue-600 transition">Pricing</Link>
              <Link to="/contact" className="text-gray-600 hover:text-blue-600 transition">Contact</Link>
            </div>

            <div className="flex items-center gap-4">
              <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium hidden sm:block">Log In</Link>
              <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-medium transition shadow-lg shadow-blue-600/20">Get Started</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* --- DYNAMIC PAGE CONTENT GOES HERE --- */}
      <main className="flex-grow pt-16"> 
        {/* pt-16 adds padding so the fixed navbar doesn't cover the top of your pages */}
        <Outlet /> 
      </main>

      {/* --- SHARED FOOTER --- */}
      <footer className="bg-gray-900 text-white py-12 border-t border-gray-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-blue-600 p-1.5 rounded-lg"><Kanban className="text-white w-5 h-5" /></div>
                <span className="text-xl font-bold tracking-tight">ZenBoard</span>
              </div>
              <p className="text-gray-400 text-sm">Making project management simple, visual, and effective for teams of all sizes.</p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/#features" className="hover:text-white transition">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white transition">Pricing</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
                {/* <li><Link to="/careers" className="hover:text-white transition">Careers</Link></li> */}
                <li><Link to="/contact" className="hover:text-white transition">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                {/* <li><Link to="/terms" className="hover:text-white transition">Terms of Service</Link></li> */}
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex justify-between items-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} ZenBoard Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
      
    </div>
  );
};

export default MainLayout;