import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, User, Lock, ArrowLeft, Zap, UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../utils/api';
import { useAuthStore } from '../store/authStore';

// Define components outside to prevent recreation on each render
const ClassicForm = ({
  formData,
  handleInputChange,
  handleClassicSubmit,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  setStep,
  isSubmitting
}: any) => (
  <div className="glass-effect-dark rounded-2xl p-8 shadow-2xl neon-glow">
    <div className="text-center mb-8">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-gradient-to-br from-primary-500 to-accent-purple rounded-xl">
          <Zap className="w-8 h-8 text-white" />
        </div>
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">Classic Registration</h1>
      <p className="text-gray-400">Create your KolTech account</p>
    </div>

    <form onSubmit={handleClassicSubmit} className="space-y-6">
      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            className="input-primary pl-10"
            required
          />
        </div>
      </div>

      {/* First Name */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="Enter your first name"
            className="input-primary pl-10"
            required
          />
        </div>
      </div>

      {/* Last Name */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Enter your last name"
            className="input-primary pl-10"
            required
          />
        </div>
      </div>

      {/* Username */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            placeholder="Choose a username"
            className="input-primary pl-10"
            required
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Create a password"
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

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Repeat your password"
            className="input-primary pl-10 pr-12"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Terms */}
      <div className="flex items-start space-x-3">
        <input
          type="checkbox"
          name="agreeToTerms"
          checked={formData.agreeToTerms}
          onChange={handleInputChange}
          className="w-4 h-4 text-primary-500 bg-dark-700 border-dark-600 rounded focus:ring-primary-500 focus:ring-2 mt-1"
          required
        />
        <label className="text-sm text-gray-300">
          I agree to the{' '}
          <a href="#" className="text-primary-400 hover:text-primary-300">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-primary-400 hover:text-primary-300">
            Privacy Policy
          </a>
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <div className="spinner mr-2"></div>
            Creating Account...
          </div>
        ) : (
          'Create Account'
        )}
      </button>
    </form>

    <div className="mt-6">
      <button
        onClick={() => setStep('method')}
        className="btn-ghost text-sm"
      >
        ← Back to registration methods
      </button>
    </div>
  </div>
);

const Register = () => {
  const navigate = useNavigate();
  const { login: loginUser, setLoading } = useAuthStore();
  
  const [step, setStep] = useState<'method' | 'classic' | 'verification'>('method');
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    username: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  const handleClassicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!formData.agreeToTerms) {
      toast.error('Please agree to the Terms of Service');
      return;
    }

    setIsSubmitting(true);
    setLoading(true);

    try {
      const registrationData = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        password: formData.password,
        role: 'user'
      };

      const response = await authAPI.register(registrationData);
      
      if (response.success) {
        toast.success('Registration successful! Please check your email for verification.');
        setStep('verification');
      } else {
        toast.error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const handleVerificationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await authAPI.verifyEmail(formData.email, verificationCode);
      
      if (response.success) {
        toast.success('Email verified successfully! You are now logged in.');
        
        // Auto-login after verification
        const loginResponse = await authAPI.login({
          login: formData.email,
          password: formData.password
        });
        
        if (loginResponse.success) {
          loginUser(loginResponse.data.user, loginResponse.data.token);
          navigate('/profile');
        }
      } else {
        toast.error(response.message || 'Verification failed');
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      toast.error(error.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const MethodSelection = () => (
    <div className="glass-effect-dark rounded-2xl p-8 shadow-2xl animate-scale-in neon-glow">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4 animate-float">
          <div className="p-3 bg-gradient-to-br from-primary-500 to-accent-purple rounded-xl">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2 animate-slide-down">Registration</h1>
        <p className="text-gray-400 animate-fade-in">Choose your registration method</p>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => setStep('classic')}
          className="w-full btn-primary p-6 text-left card-hover animate-scale-in"
        >
          <h3 className="font-bold text-lg mb-2">Classic Registration</h3>
          <p className="text-blue-100 text-sm">
            Registration using email and standard password
          </p>
        </button>

        <Link
          to="/anonymous-register"
          className="w-full bg-gradient-to-r from-accent-purple to-accent-pink text-white p-6 rounded-xl hover:shadow-lg transition-all duration-300 text-left block card-hover animate-scale-in"
        >
          <h3 className="font-bold text-lg mb-2">LTMROW Method</h3>
          <p className="text-purple-100 text-sm">
            Anonymous registration with unique number and code phrases
          </p>
        </Link>
      </div>

      <div className="mt-8 text-center animate-fade-in">
        <p className="text-gray-400">
          Already have an account?{' '}
          <Link
            to="/auth"
            className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );


  const VerificationForm = () => (
    <div className="glass-effect-dark rounded-2xl p-8 shadow-2xl animate-scale-in neon-glow-green">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4 animate-float">
          <div className="p-3 bg-gradient-to-br from-accent-green to-primary-500 rounded-xl">
            <Mail className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2 animate-slide-down">Email Verification</h1>
        <p className="text-gray-400 animate-fade-in">
          We sent a verification code to <br />
          <span className="text-primary-400 font-semibold">{formData.email}</span>
        </p>
      </div>

      <form onSubmit={handleVerificationSubmit} className="space-y-6">
        <div className="animate-slide-up">
          <label className="block text-sm font-medium text-gray-300 mb-2">Verification Code</label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter 6-digit code"
            maxLength={6}
            className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white text-center text-2xl font-mono tracking-widest placeholder-gray-500 focus:border-accent-green focus:outline-none focus:ring-2 focus:ring-accent-green/20 transition-all"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-accent-green to-primary-500 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 neon-glow-green animate-pulse-slow"
        >
          Verify and Enter KolTechLine
        </button>

        <div className="text-center animate-fade-in">
          <button
            type="button"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Resend verification code
          </button>
        </div>
      </form>
    </div>
  );

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

        {/* Render current step */}
        {step === 'method' && <MethodSelection />}
        {step === 'classic' && (
          <ClassicForm
            formData={formData}
            handleInputChange={handleInputChange}
            handleClassicSubmit={handleClassicSubmit}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            setStep={setStep}
            isSubmitting={isSubmitting}
          />
        )}
        {step === 'verification' && <VerificationForm />}
      </div>
    </div>
  );
};

export default Register;