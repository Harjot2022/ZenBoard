import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, Users, Zap, CheckCircle, ArrowRight, Kanban } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-gray-900">
      

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
          
          {/* Left Content */}
          <div className="lg:w-1/2 text-center lg:text-left z-10">
            <div className="inline-block bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-6 border border-blue-100">
              🚀 Version 2.0 is live
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-gray-900">
              Organize your work.<br />
              <span className="text-blue-600">Boost your productivity.</span>
            </h1>
            <p className="text-xl text-gray-500 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Simplify project management with our intuitive Kanban boards. Collaborate with your team, track progress, and hit your deadlines effortlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/login" className="flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-3.5 rounded-full text-lg font-semibold hover:bg-blue-700 transition shadow-xl shadow-blue-600/20">
                Start for Free <ArrowRight size={20} />
              </Link>
              <button className="flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-8 py-3.5 rounded-full text-lg font-semibold hover:bg-gray-200 transition">
                Watch Demo
              </button>
            </div>
            <p className="mt-6 text-sm text-gray-400">No credit card required · Free for teams up to 10</p>
          </div>

          {/* Right Visual (CSS Mockup of Board) */}
          <div className="lg:w-1/2 w-full relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl -z-10"></div>
            <div className="relative bg-gray-100 p-4 rounded-xl shadow-2xl border border-gray-200 transform rotate-1 hover:rotate-0 transition duration-500">
              {/* Fake Browser Header */}
              <div className="flex items-center gap-2 mb-4 px-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="bg-white flex-1 mx-4 h-6 rounded-md text-[10px] flex items-center px-2 text-gray-400">taskflow.app/board/marketing-launch</div>
              </div>

              {/* Mockup Board Area */}
              <div className="flex gap-4 overflow-hidden h-80">
                {/* Column 1 */}
                <div className="w-1/3 bg-gray-200/50 rounded-lg p-3 flex flex-col gap-3">
                  <div className="font-bold text-gray-700 text-sm flex justify-between">To Do <span className="bg-gray-300 text-xs px-2 py-0.5 rounded-full">3</span></div>
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                    <div className="h-2 w-12 bg-red-100 rounded-full mb-2"></div>
                    <div className="text-xs font-medium text-gray-800">Research competitors</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
                     <div className="h-2 w-12 bg-blue-100 rounded-full mb-2"></div>
                     <div className="text-xs font-medium text-gray-800">Draft initial copy</div>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="w-1/3 bg-gray-200/50 rounded-lg p-3 flex flex-col gap-3">
                  <div className="font-bold text-gray-700 text-sm flex justify-between">In Progress <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">1</span></div>
                  <div className="bg-white p-3 rounded-lg shadow-md border-l-4 border-blue-500">
                    <div className="flex justify-between mb-2">
                       <div className="h-2 w-16 bg-purple-100 rounded-full"></div>
                    </div>
                    <div className="text-xs font-medium text-gray-800 mb-2">Design Homepage UI</div>
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-gray-300 border-2 border-white"></div>
                      <div className="w-6 h-6 rounded-full bg-gray-400 border-2 border-white"></div>
                    </div>
                  </div>
                </div>

                {/* Column 3 */}
                <div className="w-1/3 bg-gray-200/50 rounded-lg p-3 flex flex-col gap-3 opacity-80">
                  <div className="font-bold text-gray-700 text-sm flex justify-between">Done <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">5</span></div>
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 opacity-60">
                    <div className="text-xs font-medium text-gray-800 line-through text-gray-400">Setup Project Repo</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 opacity-60">
                    <div className="text-xs font-medium text-gray-800 line-through text-gray-400">Configure Database</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- FEATURES SECTION --- */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to ship faster</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">TaskFlow gives you the power of a complex project management tool with the simplicity of a whiteboard.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-6">
                <Layout size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Drag & Drop Boards</h3>
              <p className="text-gray-500 leading-relaxed">
                Visualise your workflow with our intuitive drag-and-drop interface. Moving tasks feels natural and fluid.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 mb-6">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Team Collaboration</h3>
              <p className="text-gray-500 leading-relaxed">
                Invite your team, assign tasks, and leave comments in real-time. Keep everyone on the same page.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-green-600 mb-6">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Real-time Updates</h3>
              <p className="text-gray-500 leading-relaxed">
                Changes happen instantly. No refreshing required. See tasks move as your team completes them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- HOW IT WORKS --- */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Get organized in minutes</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12 text-center relative">
            <div className="hidden md:block absolute top-12 left-1/6 w-2/3 h-0.5 bg-gray-200 -z-10"></div>
            
            <div>
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg shadow-blue-200">1</div>
              <h3 className="text-xl font-bold mb-2">Create a Board</h3>
              <p className="text-gray-500">Sign up and create your first project board in seconds.</p>
            </div>
            
            <div>
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg shadow-blue-200">2</div>
              <h3 className="text-xl font-bold mb-2">Add Tasks</h3>
              <p className="text-gray-500">Break down your project into manageable cards and lists.</p>
            </div>
            
            <div>
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6 shadow-lg shadow-blue-200">3</div>
              <h3 className="text-xl font-bold mb-2">Track Progress</h3>
              <p className="text-gray-500">Drag cards to "Done" and celebrate your team's wins.</p>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default LandingPage;