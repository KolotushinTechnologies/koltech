import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, ArrowLeft, Zap } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../utils/api';
import { useAuthStore } from '../store/authStore';

const Auth = () => {
  const navigate = useNavigate();
  const { login: loginUser, setLoading } = useAuthStore();
  
  const [formData, setFormData] = useState({
    login: '',
    password: '',
    codePhrase: '',
    codePhraseIndex: 0,
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loginType, setLoginType] = useState<'email' | 'username' | 'number'>('email');
  const [ltmrowMethod, setLtmrowMethod] = useState<'password' | 'codePhrase'>('password');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const detectLoginType = useCallback((value: string) => {
    if (value.startsWith('+11111')) {
      setLoginType('number');
    } else if (value.includes('@')) {
      setLoginType('email');
    } else {
      setLoginType('username');
    }
  }, []);

  const handleLoginChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, login: value }));
    detectLoginType(value);
  }, [detectLoginType]);

  const getLoginPlaceholder = () => {
    switch (loginType) {
      case 'email': return 'Enter your email';
      case 'username': return 'Enter your username';
      case 'number': return 'LetteraTech number';
      default: return 'Email, Username or LetteraTech number';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLoading(true);

    try {
      const loginData: any = {
        login: formData.login,
      };

      // For LetteraTech number login - can use password OR code phrase
      if (loginType === 'number') {
        if (ltmrowMethod === 'password') {
          if (!formData.password) {
            toast.error('Password is required for LetteraTech login');
            return;
          }
          loginData.password = formData.password;
        } else {
          if (!formData.codePhrase) {
            toast.error('Code phrase is required for LetteraTech login');
            return;
          }
          loginData.codePhrase = formData.codePhrase;
          loginData.codePhraseIndex = formData.codePhraseIndex;
        }
      } else {
        // For email/username login
        if (!formData.password) {
          toast.error('Password is required');
          return;
        }
        loginData.password = formData.password;
      }

      const response = await authAPI.login(loginData);
      
      if (response.success) {
        loginUser(response.data.user, response.data.token);
        toast.success('Login successful!');
        navigate('/profile'); // Redirect to profile page
      } else {
        toast.error(response.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Back button */}
        <Link
          to="/"
          className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors btn-ghost"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Auth Card */}
        <div className="glass-effect-dark rounded-2xl p-8 shadow-2xl animate-scale-in neon-glow">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4 animate-float">
              <div className="p-3 bg-gradient-to-br from-primary-500 to-accent-purple rounded-xl">
                <Zap className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2 animate-slide-down">Welcome Back</h1>
            <p className="text-gray-400 animate-fade-in">Sign in to your KolTech account</p>
            
            {/* Login Instructions */}
            <div className="mt-4 p-3 bg-dark-800/50 rounded-lg border border-primary-500/20">
              <h3 className="text-sm font-medium text-primary-400 mb-2">Login Methods:</h3>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• <span className="text-primary-300">Email/Username</span>: Use your password</li>
                <li>• <span className="text-accent-purple">LTMROW Method</span>: Use LetteraTech number (+11111...) with password OR code phrase</li>
              </ul>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Login Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {loginType === 'email' ? 'Email' :
                 loginType === 'username' ? 'Username' :
                 'LetteraTech Number'}
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="login"
                  value={formData.login}
                  onChange={handleLoginChange}
                  placeholder={getLoginPlaceholder()}
                  className="input-primary pl-10"
                  required
                />
              </div>
              {loginType === 'number' && (
                <p className="text-xs text-gray-500 mt-1">
                  Format: +11111XXXXXXXXXXX
                </p>
              )}
            </div>

            {/* Authentication Method Selection for LTMROW */}
            {loginType === 'number' && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  LTMROW Authentication Method
                </label>
                <div className="flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setLtmrowMethod('password')}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      ltmrowMethod === 'password'
                        ? 'bg-primary-500 text-white'
                        : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                    }`}
                  >
                    Password
                  </button>
                  <button
                    type="button"
                    onClick={() => setLtmrowMethod('codePhrase')}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      ltmrowMethod === 'codePhrase'
                        ? 'bg-accent-purple text-white'
                        : 'bg-dark-700 text-gray-300 hover:bg-dark-600'
                    }`}
                  >
                    Code Phrase
                  </button>
                </div>
              </div>
            )}

            {/* Password Field for email/username OR LTMROW password method */}
            {(loginType !== 'number' || ltmrowMethod === 'password') && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="input-primary pl-10 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}

            {/* Code Phrase Fields for LTMROW code phrase method */}
            {loginType === 'number' && ltmrowMethod === 'codePhrase' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Code Phrase
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      name="codePhrase"
                      value={formData.codePhrase}
                      onChange={handleInputChange}
                      placeholder="Enter code phrase (e.g., swift-wolf-42)"
                      className="input-primary pl-10"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Code Phrase Index (0-11)
                  </label>
                  <input
                    type="number"
                    name="codePhraseIndex"
                    value={formData.codePhraseIndex}
                    onChange={handleInputChange}
                    min="0"
                    max="11"
                    className="input-primary"
                    required
                  />
                </div>
              </>
            )}

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary-500 bg-dark-700 border-dark-600 rounded focus:ring-primary-500 focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-300">Remember me</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary neon-glow animate-glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="spinner mr-2"></div>
                  Signing In...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-8 text-center animate-fade-in">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;