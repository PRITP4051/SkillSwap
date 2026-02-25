import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import SkillDiscoveryPage from './pages/SkillDiscoveryPage';
import UserProfilePage from './pages/UserProfilePage';
import SwapRequestsPage from './pages/SwapRequestsPage';
import DashboardPage from './pages/DashboardPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import CommunityPage from './pages/CommunityPage';
import ChatPage from './pages/ChatPage';

// Simple Scroll to Top component since ScrollRestoration requires data routers in new react-router
const ScrollToTop = () => {
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [window.location.pathname]);
  return null;
};

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <ScrollToTop />
          <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />

            <main className="main-content" style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/discover" element={<SkillDiscoveryPage />} />
                {/* Real app would use /profile/:id */}
                <Route path="/profile" element={<UserProfilePage />} />
                <Route path="/profile/:id" element={<UserProfilePage />} />
                <Route path="/requests" element={<SwapRequestsPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/chat/:id" element={<ChatPage />} />

                {/* Fallbacks */}
                <Route path="*" element={
                  <div className="container section" style={{ textAlign: 'center' }}>
                    <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</h1>
                    <p style={{ color: 'var(--text-muted)' }}>The page you are looking for does not exist.</p>
                  </div>
                } />
              </Routes>
            </main>

            <Footer />
          </div>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
