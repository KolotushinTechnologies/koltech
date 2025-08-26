import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Zap, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  const navItems = [
    { path: '/', label: 'Home' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/business-accelerator', label: 'Business Accelerator' },
  ];

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    toast.success('Logged out successfully');
    navigate('/');
  };

  const getDisplayName = () => {
    if (!user) return '';
    return `${user.firstName} ${user.lastName}`;
  };

  const getUsername = () => {
    if (!user) return '';
    return user.letteraTechNumber ? user.letteraTechNumber : (user.username || user.email);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark-900/90 backdrop-blur-md border-b border-dark-700">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-br from-primary-500 to-accent-purple rounded-lg">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">KolTech</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'text-primary-400'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated && user ? (
              /* User Profile Dropdown */
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-dark-700"
                >
                  <img
                    src={user.avatar ? `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5005'}${user.avatar}` : `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=6366f1&color=ffffff&size=32`}
                    alt={getDisplayName()}
                    className="w-8 h-8 rounded-full border-2 border-primary-500/30"
                    onError={(e) => {
                      e.currentTarget.src = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=6366f1&color=ffffff&size=32`;
                    }}
                  />
                  <div className="text-left">
                    <div className="text-sm font-medium text-white">{getDisplayName()}</div>
                    <div className="text-xs text-gray-400 truncate max-w-24">
                      {user.letteraTechNumber ? `ID: ${user.letteraTechNumber}` : `@${getUsername()}`}
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-dark-800 rounded-lg shadow-lg border border-dark-600 py-2">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-dark-700 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-3" />
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-dark-700 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </Link>
                    <hr className="my-2 border-dark-600" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-dark-700 transition-colors"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Auth Buttons for non-authenticated users */
              <>
                <Link
                  to="/auth"
                  className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-primary-500 to-accent-purple text-white px-4 py-2 rounded-lg text-sm font-medium hover:shadow-lg transition-all duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-dark-700">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'text-primary-400'
                      : 'text-gray-300 hover:text-white'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
              {/* Mobile Auth Section */}
              <div className="pt-4 border-t border-dark-600">
                {isAuthenticated && user ? (
                  <div className="space-y-3">
                    {/* User Info */}
                    <div className="flex items-center space-x-3 py-2">
                      <img
                        src={user.avatar ? `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5005'}${user.avatar}` : `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=6366f1&color=ffffff&size=32`}
                        alt={getDisplayName()}
                        className="w-8 h-8 rounded-full border-2 border-primary-500/30"
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=6366f1&color=ffffff&size=32`;
                        }}
                      />
                      <div>
                        <div className="text-sm font-medium text-white">{getDisplayName()}</div>
                        <div className="text-xs text-gray-400">
                          {user.letteraTechNumber ? `ID: ${user.letteraTechNumber}` : `@${getUsername()}`}
                        </div>
                      </div>
                    </div>
                    
                    {/* Mobile User Menu */}
                    <Link
                      to="/profile"
                      className="flex items-center text-gray-300 hover:text-white text-sm font-medium py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User className="w-4 h-4 mr-3" />
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center text-gray-300 hover:text-white text-sm font-medium py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center text-red-400 hover:text-red-300 text-sm font-medium py-2"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link
                      to="/auth"
                      className="text-gray-300 hover:text-white text-sm font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="bg-gradient-to-r from-primary-500 to-accent-purple text-white px-4 py-2 rounded-lg text-sm font-medium inline-block text-center"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;