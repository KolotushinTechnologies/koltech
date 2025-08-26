import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';
import Register from './pages/Register';
import AnonymousRegister from './pages/AnonymousRegister';
import ForgotPassword from './pages/ForgotPassword';
import Portfolio from './pages/Portfolio';
import BusinessAccelerator from './pages/BusinessAccelerator';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import ToastProvider from './components/ui/ToastProvider';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-dark-900">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/register" element={<Register />} />
          <Route path="/anonymous-register" element={<AnonymousRegister />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/business-accelerator" element={<BusinessAccelerator />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
        <ToastProvider />
      </div>
    </Router>
  );
}

export default App;