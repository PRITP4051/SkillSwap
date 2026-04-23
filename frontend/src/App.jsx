import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import LandingPage        from './pages/LandingPage';
import LoginPage          from './pages/LoginPage';
import RegisterPage       from './pages/RegisterPage';
import CompleteProfilePage from './pages/CompleteProfilePage';
import ExplorePage        from './pages/ExplorePage';
import ProfilePage        from './pages/ProfilePage';
import MyProfilePage      from './pages/MyProfilePage';
import BookSessionPage    from './pages/BookSessionPage';
import SessionsPage       from './pages/SessionsPage';
import ChatPage           from './pages/ChatPage';
import AdminPage          from './pages/AdminPage';
import NotFoundPage       from './pages/NotFoundPage';

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/"           element={<LandingPage />} />
        <Route path="/login"      element={<LoginPage />} />
        <Route path="/register"   element={<RegisterPage />} />
        <Route path="/explore"    element={<ExplorePage />} />
        <Route path="/profile/:userId" element={<ProfilePage />} />

        {/* Auth-required routes */}
        <Route path="/complete-profile" element={
          <ProtectedRoute><CompleteProfilePage /></ProtectedRoute>
        } />
        <Route path="/my-profile" element={
          <ProtectedRoute><MyProfilePage /></ProtectedRoute>
        } />
        <Route path="/book/:teacherId" element={
          <ProtectedRoute><BookSessionPage /></ProtectedRoute>
        } />
        <Route path="/sessions" element={
          <ProtectedRoute><SessionsPage /></ProtectedRoute>
        } />
        <Route path="/chat" element={
          <ProtectedRoute><ChatPage /></ProtectedRoute>
        } />

        {/* Admin only */}
        <Route path="/admin" element={
          <ProtectedRoute adminOnly><AdminPage /></ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
};

export default App;
