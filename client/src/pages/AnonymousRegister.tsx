import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ArrowLeft, Shield, Copy, CheckCircle, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../utils/api';
import { useAuthStore } from '../store/authStore';

// Define form component outside to prevent recreation on each render
const FormStep = ({
  formData,
  handleInputChange,
  handleSubmit,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  isSubmitting
}: any) => (
  <div className="glass-effect-dark rounded-2xl p-8 shadow-2xl animate-scale-in neon-glow">
    {/* Header */}
    <div className="text-center mb-8">
      <div className="flex justify-center mb-4 animate-float">
        <div className="p-3 bg-gradient-to-br from-accent-purple to-accent-pink rounded-xl">
          <Shield className="w-8 h-8 text-white" />
        </div>
      </div>
      <h1 className="text-2xl font-bold text-white mb-2 animate-slide-down">LTMROW Method</h1>
      <p className="text-gray-400 animate-fade-in">Lettera Tech Method Registration Of World</p>
    </div>

    {/* Info Section */}
    <div className="mb-8">
      <div className="glass-effect p-6 rounded-xl mb-6">
        <h3 className="text-white font-semibold mb-3">What is LTMROW?</h3>
        <p className="text-gray-300 text-sm leading-relaxed">
          This is a revolutionary anonymous registration method that ensures maximum
          security and confidentiality. The system generates a unique number and set
          of code phrases to protect your account.
        </p>
      </div>

      <div className="bg-gradient-to-r from-accent-purple/10 to-accent-pink/10 p-6 rounded-xl border border-accent-purple/30">
        <h3 className="text-white font-semibold mb-3">LTMROW Features:</h3>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex items-center">
            <div className="w-2 h-2 bg-accent-purple rounded-full mr-3"></div>
            Complete anonymity - no personal data required
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 bg-accent-pink rounded-full mr-3"></div>
            Unique 16-character number
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 bg-accent-purple rounded-full mr-3"></div>
            12 code phrases for authentication
          </li>
          <li className="flex items-center">
            <div className="w-2 h-2 bg-accent-pink rounded-full mr-3"></div>
            Maximum data security
          </li>
        </ul>
      </div>
    </div>

    {/* Form */}
    <form onSubmit={handleSubmit} className="space-y-6">
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
            placeholder="Confirm your password"
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

      {/* Role */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleInputChange}
          className="input-primary"
        >
          <option value="user">User</option>
          <option value="freelancer">Freelancer</option>
          <option value="startup">Startup</option>
        </select>
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
          'Generate Credentials'
        )}
      </button>
    </form>

    {/* Back Button */}
    <div className="mt-6">
      <Link
        to="/register"
        className="w-full btn-secondary block text-center"
      >
        Back to Registration Methods
      </Link>
    </div>
  </div>
);

const AnonymousRegister = () => {
  const navigate = useNavigate();
  const { login: loginUser, setLoading } = useAuthStore();
  
  const [step, setStep] = useState<'form' | 'credentials'>('form');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [credentials, setCredentials] = useState({
    letteraTechNumber: '',
    codePhrases: [] as string[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedStates, setCopiedStates] = useState<{[key: string]: boolean}>({});

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setIsSubmitting(true);
    setLoading(true);

    try {
      const registrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
        role: formData.role
      };

      const response = await authAPI.registerAnonymous(registrationData);
      
      if (response.success) {
        setCredentials({
          letteraTechNumber: response.data.letteraTechNumber,
          codePhrases: response.data.codePhrases
        });
        
        // Auto-login the user
        loginUser(response.data.user, response.data.token);
        
        toast.success('Anonymous registration successful!');
        setStep('credentials');
      } else {
        toast.error(response.message || 'Registration failed');
      }
    } catch (error: any) {
      console.error('Anonymous registration error:', error);
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  }, [formData.password, formData.confirmPassword, formData.firstName, formData.lastName, formData.role, setLoading, loginUser]);

  const copyToClipboard = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedStates({ ...copiedStates, [key]: true });
      toast.success('Copied to clipboard!');
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopiedStates({ ...copiedStates, [key]: false });
      }, 2000);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const downloadCredentials = () => {
    const content = `KolTech LTMROW Credentials
    
LetteraTech Number: ${credentials.letteraTechNumber}
Password: [Your chosen password - not shown for security]

Code Phrases:
${credentials.codePhrases.map((phrase, index) => `${index}: ${phrase}`).join('\n')}

IMPORTANT: Save these credentials safely. You will need them to log in.
- Use your LetteraTech Number + Password for standard login
- Code phrases are used for additional security verification
Generated on: ${new Date().toLocaleString()}`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'koltech-credentials.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Credentials downloaded!');
  };

  const handleContinue = () => {
    toast.success('Welcome to KolTech! You are now logged in.');
    navigate('/profile');
  };

  // Empty placeholder since FormStep is now moved outside

  const CredentialsStep = () => (
    <div className="glass-effect-dark rounded-2xl p-8 shadow-2xl animate-scale-in neon-glow-green">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4 animate-float">
          <div className="p-3 bg-gradient-to-br from-accent-green to-primary-500 rounded-xl">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Your LTMROW Credentials</h1>
        <p className="text-gray-400">Save these credentials securely - you'll need them to login</p>
        <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/30 mt-4">
          <p className="text-blue-300 text-sm">
            <strong>Login Instructions:</strong> Use your LetteraTech Number + Password for standard login. Code phrases are for additional security verification when enabled.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* LetteraTech Number */}
        <div className="bg-gradient-to-r from-primary-500/20 to-accent-purple/20 p-6 rounded-xl border border-primary-500/30">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white font-semibold">Your LetteraTech Number</h3>
            <button
              onClick={() => copyToClipboard(credentials.letteraTechNumber, 'number')}
              className="btn-secondary text-xs p-2"
              title="Copy to clipboard"
            >
              {copiedStates.number ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xl font-mono font-bold text-white tracking-wider">
            {credentials.letteraTechNumber}
          </p>
        </div>

        {/* Code Phrases */}
        <div className="bg-gradient-to-r from-accent-purple/10 to-accent-pink/10 p-6 rounded-xl border border-accent-purple/30">
          <h3 className="text-white font-semibold mb-4">Your Code Phrases</h3>
          <div className="grid grid-cols-1 gap-2">
            {credentials.codePhrases.map((phrase, index) => (
              <div key={index} className="flex items-center justify-between bg-dark-800/50 p-3 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="bg-primary-500/20 text-primary-400 px-2 py-1 rounded text-xs font-mono">
                    #{index}
                  </span>
                  <span className="font-mono text-white">{phrase}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(phrase, `phrase-${index}`)}
                  className="btn-secondary text-xs p-1"
                  title="Copy phrase"
                >
                  {copiedStates[`phrase-${index}`] ? <CheckCircle className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Warning */}
        <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/30">
          <p className="text-red-300 text-sm">
            <strong>Important:</strong> Save these credentials in a secure place. 
            Without them, account recovery will be impossible.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={downloadCredentials}
            className="w-full btn-secondary"
          >
            Download Credentials File
          </button>

          <button
            onClick={handleContinue}
            className="w-full btn-primary"
          >
            Continue to KolTech
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Back button */}
        <Link
          to="/register"
          className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors btn-ghost"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Registration
        </Link>

        {/* Render current step */}
        {step === 'form' && (
          <FormStep
            formData={formData}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            isSubmitting={isSubmitting}
          />
        )}
        {step === 'credentials' && <CredentialsStep />}
      </div>
    </div>
  );
};

export default AnonymousRegister;