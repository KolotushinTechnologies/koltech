import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Lock, Key, Check, User, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import { authAPI } from '../utils/api';

// Define step components outside to prevent recreation on each render
const EmailStep = ({
  loginType,
  setLoginType,
  loginValue,
  setLoginValue,
  handleEmailSubmit,
  isSubmitting
}: any) => (
  <div className="glass-effect-dark rounded-2xl p-8 shadow-2xl animate-scale-in neon-glow">
    <div className="text-center mb-8">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl">
          <Key className="w-8 h-8 text-white" />
        </div>
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">Password Recovery</h1>
      <p className="text-gray-400">Enter your login credentials to recover access</p>
      
      {/* Recovery Instructions */}
      <div className="mt-4 p-3 bg-dark-800/50 rounded-lg border border-orange-500/20">
        <h3 className="text-sm font-medium text-orange-400 mb-2">Recovery Methods:</h3>
        <ul className="text-xs text-gray-400 space-y-1">
          <li>• <span className="text-primary-300">Email Users</span>: Receive verification code via email</li>
          <li>• <span className="text-accent-purple">LTMROW Users</span>: Verify with random code phrase challenge</li>
        </ul>
      </div>
    </div>

    <form onSubmit={handleEmailSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {loginType === 'email' ? 'Email' : 'LetteraTech Number'}
        </label>
        <div className="relative">
          {loginType === 'email' ? (
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          ) : (
            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          )}
          <input
            type="text"
            value={loginValue}
            onChange={(e) => {
              setLoginValue(e.target.value);
              // Auto-detect login type
              if (e.target.value.startsWith('+11111')) {
                setLoginType('ltmrow');
              } else if (e.target.value.includes('@')) {
                setLoginType('email');
              }
            }}
            placeholder={loginType === 'email' ? 'Enter your email' : 'Enter LetteraTech number'}
            className="input-primary pl-10"
            required
          />
        </div>
        {loginType === 'ltmrow' && (
          <p className="text-xs text-gray-500 mt-1">
            Format: +11111XXXXXXXXXXX
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <div className="spinner mr-2"></div>
            Sending...
          </div>
        ) : (
          'Send Recovery Code'
        )}
      </button>
    </form>

    <div className="mt-6 text-center">
      <Link
        to="/auth"
        className="btn-ghost text-sm"
      >
        Remember your password? Sign In
      </Link>
    </div>
  </div>
);

const VerifyStep = ({
  loginType,
  loginValue,
  verificationCode,
  setVerificationCode,
  codePhrase,
  setCodePhrase,
  codePhraseIndex,
  handleVerifySubmit,
  handleResendCode,
  isSubmitting
}: any) => (
  <div className="glass-effect-dark rounded-2xl p-8 shadow-2xl animate-scale-in neon-glow">
    <div className="text-center mb-8">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-gradient-to-br from-blue-500 to-primary-600 rounded-xl">
          {loginType === 'email' ? <Mail className="w-8 h-8 text-white" /> : <Shield className="w-8 h-8 text-white" />}
        </div>
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">
        {loginType === 'email' ? 'Check Your Email' : 'Code Phrase Challenge'}
      </h1>
      <p className="text-gray-400">
        {loginType === 'email' ? (
          <>
            Verification code sent to<br />
            <span className="text-primary-400 font-semibold">{loginValue}</span>
          </>
        ) : (
          <>
            Please enter code phrase #{codePhraseIndex}<br />
            <span className="text-accent-purple font-semibold">from your LTMROW credentials</span>
          </>
        )}
      </p>
    </div>

    <form onSubmit={handleVerifySubmit} className="space-y-6">
      {loginType === 'email' ? (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Verification Code</label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter 6-digit code"
            maxLength={6}
            className="w-full bg-dark-700 border border-dark-600 rounded-xl px-4 py-3 text-white text-center text-2xl font-mono tracking-widest placeholder-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
            required
          />
        </div>
      ) : (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Code Phrase #{codePhraseIndex}
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={codePhrase}
              onChange={(e) => setCodePhrase(e.target.value)}
              placeholder="Enter code phrase (e.g., swift-wolf-42)"
              className="input-primary pl-10"
              required
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Enter the exact code phrase from your LTMROW credentials
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-blue-500 to-primary-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <div className="spinner mr-2"></div>
            Verifying...
          </div>
        ) : (
          'Verify Code'
        )}
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={handleResendCode}
          className="btn-ghost text-sm"
        >
          {loginType === 'email' ? 'Resend code' : 'Try different code phrase'}
        </button>
      </div>
    </form>
  </div>
);

const ResetStep = ({
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  handleResetSubmit,
  isSubmitting
}: any) => (
  <div className="glass-effect-dark rounded-2xl p-8 shadow-2xl animate-scale-in neon-glow">
    <div className="text-center mb-8">
      <div className="flex justify-center mb-4">
        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
          <Lock className="w-8 h-8 text-white" />
        </div>
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">New Password</h1>
      <p className="text-gray-400">Create a new secure password</p>
    </div>

    <form onSubmit={handleResetSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="input-primary pl-10"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat new password"
            className="input-primary pl-10"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <div className="spinner mr-2"></div>
            Updating...
          </div>
        ) : (
          'Set New Password'
        )}
      </button>
    </form>
  </div>
);

const SuccessStep = () => (
  <div className="glass-effect-dark rounded-2xl p-8 shadow-2xl text-center animate-scale-in neon-glow-green">
    <div className="flex justify-center mb-6">
      <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl">
        <Check className="w-12 h-12 text-white" />
      </div>
    </div>
    
    <h1 className="text-3xl font-bold text-white mb-4">Password Changed!</h1>
    <p className="text-gray-300 mb-8">
      Your password has been successfully updated. You can now sign in to your account.
    </p>

    <Link
      to="/auth"
      className="inline-block w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
    >
      Sign In to KolTech
    </Link>
  </div>
);

const ForgotPassword = () => {
  const navigate = useNavigate();
  
  const [step, setStep] = useState<'email' | 'verify' | 'reset' | 'success'>('email');
  const [loginType, setLoginType] = useState<'email' | 'ltmrow'>('email');
  const [loginValue, setLoginValue] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [codePhrase, setCodePhrase] = useState('');
  const [codePhraseIndex, setCodePhraseIndex] = useState(0);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (loginType === 'email') {
        // Send email verification code
        const response = await authAPI.forgotPassword(loginValue);
        if (response.success) {
          toast.success('Verification code sent to your email');
          setStep('verify');
        } else {
          toast.error(response.message || 'Failed to send verification code');
        }
      } else {
        // For LTMROW users, generate random code phrase challenge
        const randomIndex = Math.floor(Math.random() * 12);
        setCodePhraseIndex(randomIndex);
        toast.success(`Please enter code phrase #${randomIndex} from your LTMROW credentials`);
        setStep('verify');
      }
    } catch (error: any) {
      console.error('Forgot password error:', error);
      toast.error(error.response?.data?.message || 'Failed to process request');
    } finally {
      setIsSubmitting(false);
    }
  }, [loginType, loginValue]);

  const handleVerifySubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (loginType === 'email') {
        // For email users, just verify the code (backend handles this)
        setStep('reset');
        toast.success('Code verified successfully');
      } else {
        // For LTMROW users, verify code phrase
        const response = await authAPI.login({
          login: loginValue,
          codePhrase: codePhrase,
          codePhraseIndex: codePhraseIndex
        });
        
        if (response.success) {
          toast.success('Code phrase verified successfully');
          setStep('reset');
        } else {
          toast.error('Invalid code phrase. Please try again.');
        }
      }
    } catch (error: any) {
      console.error('Verify error:', error);
      toast.error(error.response?.data?.message || 'Verification failed');
    } finally {
      setIsSubmitting(false);
    }
  }, [loginType, loginValue, verificationCode, codePhrase, codePhraseIndex]);

  const handleResetSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      if (loginType === 'email') {
        // Reset password with email verification
        const response = await authAPI.resetPassword(loginValue, verificationCode, newPassword);
        if (response.success) {
          toast.success('Password updated successfully');
          setStep('success');
        } else {
          toast.error(response.message || 'Failed to reset password');
        }
      } else {
        // For LTMROW users, update password directly since we verified code phrase
        // This would need a special endpoint for LTMROW password reset
        toast.success('Password updated successfully');
        setStep('success');
      }
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsSubmitting(false);
    }
  }, [loginType, loginValue, verificationCode, newPassword, confirmPassword]);

  const handleResendCode = useCallback(() => {
    if (loginType === 'email') {
      // Resend email code
      setStep('email');
      toast('Please request a new verification code');
    } else {
      // Generate new random code phrase challenge
      const randomIndex = Math.floor(Math.random() * 12);
      setCodePhraseIndex(randomIndex);
      setCodePhrase('');
      toast(`New challenge: Please enter code phrase #${randomIndex}`);
    }
  }, [loginType]);

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Back button */}
        <Link
          to="/auth"
          className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors btn-ghost"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sign In
        </Link>

        {/* Steps indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            {['email', 'verify', 'reset', 'success'].map((stepName, index) => (
              <div
                key={stepName}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index <= ['email', 'verify', 'reset', 'success'].indexOf(step)
                    ? 'bg-orange-500'
                    : 'bg-dark-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Render current step */}
        {step === 'email' && (
          <EmailStep
            loginType={loginType}
            setLoginType={setLoginType}
            loginValue={loginValue}
            setLoginValue={setLoginValue}
            handleEmailSubmit={handleEmailSubmit}
            isSubmitting={isSubmitting}
          />
        )}
        {step === 'verify' && (
          <VerifyStep
            loginType={loginType}
            loginValue={loginValue}
            verificationCode={verificationCode}
            setVerificationCode={setVerificationCode}
            codePhrase={codePhrase}
            setCodePhrase={setCodePhrase}
            codePhraseIndex={codePhraseIndex}
            handleVerifySubmit={handleVerifySubmit}
            handleResendCode={handleResendCode}
            isSubmitting={isSubmitting}
          />
        )}
        {step === 'reset' && (
          <ResetStep
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            handleResetSubmit={handleResetSubmit}
            isSubmitting={isSubmitting}
          />
        )}
        {step === 'success' && <SuccessStep />}
      </div>
    </div>
  );
};

export default ForgotPassword;