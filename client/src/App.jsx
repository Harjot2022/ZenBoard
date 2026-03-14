import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext, { AuthProvider } from './context/AuthContext';

import Board from './components/Board';
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import MainLayout from './components/MainLayout'; 
import Pricing from './components/Pricing';
import Contact from './components/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import AboutUs from './pages/AboutUs';
import Dashboard from './components/Dashboard';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  return user ? <Navigate to="/dashboard" /> : children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          
          {/* --- ROUTES WITH NAVBAR & FOOTER --- */}
          {/* By wrapping these routes in <MainLayout />, they all share the Header and Footer */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/about" element={<AboutUs />} />
            {/* Add /terms or /careers here later */}
          </Route>

          {/* --- STANDALONE ROUTES (NO NAVBAR/FOOTER) --- */}
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/board" element={<PrivateRoute><Board /></PrivateRoute>} />

          {/* DASHBOARD ROUTE */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

          {/* UPDATED BOARD ROUTE (Notice the :id parameter) */}
          <Route path="/b/:id" element={<PrivateRoute><Board /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;