import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Lock, 
  Mail, 
  Camera, 
  Shield,
  Eye,
  EyeOff,
  Save,
  Check,
  X,
  AlertTriangle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';
import { userAPI } from '../utils/api';

interface SettingsData {
  firstName: string;
  lastName: string;
  username: string;
  email?: string;
  bio: string;
  status: string;
  avatar?: string;
  twoFactorEnabled: boolean;
  emailNotifications: boolean;
}

interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Settings = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  
  const [settingsData, setSettingsData] = useState<SettingsData>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    bio: '',
    status: '',
    avatar: '',
    twoFactorEnabled: false,
    emailNotifications: true
  });

  const [passwordData, setPasswordData] = useState<PasswordChangeData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState(false);

  // Load user data on component mount
  useEffect(() => {
    if (user) {
      console.log('User data in Settings:', user); // Debug log
      setSettingsData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        status: user.status || '',
        avatar: user.avatar || '',
        twoFactorEnabled: user.twoFactorEnabled || false,
        emailNotifications: user.emailNotifications || true
      });
    }
  }, [user]);

  // Check username availability
  const checkUsernameAvailability = async (username: string) => {
    if (username === user?.username || username.length < 3) {
      setUsernameAvailable(null);
      return;
    }

    setCheckingUsername(true);
    try {
      const response = await userAPI.checkUsername(username);
      setUsernameAvailable(response.data.available);
    } catch (error) {
      console.error('Username check error:', error);
      setUsernameAvailable(null);
    } finally {
      setCheckingUsername(false);
    }
  };

  // Handle settings input changes
  const handleSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setSettingsData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Check username availability when username changes
    if (name === 'username') {
      const debounceTimer = setTimeout(() => {
        checkUsernameAvailability(value);
      }, 500);
      return () => clearTimeout(debounceTimer);
    }
  };

  // Handle password input changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Handle avatar upload
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Image size must be less than 5MB');
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await userAPI.uploadAvatar(formData);
      if (response.success) {
        setSettingsData(prev => ({ ...prev, avatar: response.data.avatar }));
        toast.success('Avatar updated successfully');
      }
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload avatar');
    } finally {
      setIsLoading(false);
    }
  };

  // Save profile settings
  const handleSaveProfile = async () => {
    if (usernameAvailable === false) {
      toast.error('Username is not available');
      return;
    }

    setIsLoading(true);
    try {
      const response = await userAPI.updateProfile({
        firstName: settingsData.firstName,
        lastName: settingsData.lastName,
        username: settingsData.username,
        bio: settingsData.bio,
        status: settingsData.status
      });

      if (response.success) {
        updateUser(response.data.user);
        toast.success('Profile updated successfully');
      }
    } catch (error: any) {
      console.error('Profile update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Change password
  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    try {
      const response = await userAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (response.success) {
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        toast.success('Password changed successfully');
      }
    } catch (error: any) {
      console.error('Password change error:', error);
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle 2FA
  const handleToggle2FA = async () => {
    setIsLoading(true);
    try {
      const response = await userAPI.toggle2FA(!settingsData.twoFactorEnabled);
      
      if (response.success) {
        setSettingsData(prev => ({ ...prev, twoFactorEnabled: !prev.twoFactorEnabled }));
        updateUser({ ...user!, twoFactorEnabled: !settingsData.twoFactorEnabled });
        toast.success(`Two-factor authentication ${!settingsData.twoFactorEnabled ? 'enabled' : 'disabled'}`);
      }
    } catch (error: any) {
      console.error('2FA toggle error:', error);
      toast.error(error.response?.data?.message || 'Failed to update 2FA settings');
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Mail }
  ] as const;

  return (
    <div className="min-h-screen bg-dark-900 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* Back button */}
        <Link
          to="/profile"
          className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors btn-ghost"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Profile
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-400">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-effect-dark rounded-xl p-4 space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-500 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-dark-700'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <div className="glass-effect-dark rounded-xl p-6">
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Profile Information</h2>

                  {/* Avatar Section */}
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center text-white text-2xl font-bold overflow-hidden">
                        {settingsData.avatar ? (
                          <img
                            src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5005'}${settingsData.avatar}`}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.parentElement!.innerHTML = `${settingsData.firstName.charAt(0)}${settingsData.lastName.charAt(0)}`;
                            }}
                          />
                        ) : (
                          `${settingsData.firstName.charAt(0)}${settingsData.lastName.charAt(0)}`
                        )}
                      </div>
                      <label className="absolute bottom-0 right-0 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-primary-600 transition-colors">
                        <Camera className="w-3 h-3 text-white" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-white">Profile Picture</h3>
                      <p className="text-sm text-gray-400">Upload a new avatar (max 5MB)</p>
                    </div>
                  </div>

                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={settingsData.firstName}
                        onChange={handleSettingsChange}
                        className="input-primary"
                        placeholder="Enter first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={settingsData.lastName}
                        onChange={handleSettingsChange}
                        className="input-primary"
                        placeholder="Enter last name"
                      />
                    </div>
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="username"
                        value={settingsData.username}
                        onChange={handleSettingsChange}
                        className={`input-primary pr-10 ${
                          usernameAvailable === false ? 'border-red-500' : 
                          usernameAvailable === true ? 'border-green-500' : ''
                        }`}
                        placeholder="Enter username"
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        {checkingUsername ? (
                          <div className="spinner w-4 h-4"></div>
                        ) : usernameAvailable === true ? (
                          <Check className="w-4 h-4 text-green-500" />
                        ) : usernameAvailable === false ? (
                          <X className="w-4 h-4 text-red-500" />
                        ) : null}
                      </div>
                    </div>
                    {usernameAvailable === false && (
                      <p className="text-xs text-red-400 mt-1">Username is not available</p>
                    )}
                  </div>

                  {/* Email (read-only for regular users) */}
                  {settingsData.email && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={settingsData.email}
                        className="input-primary opacity-50 cursor-not-allowed"
                        readOnly
                      />
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>
                  )}

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={settingsData.bio}
                      onChange={handleSettingsChange}
                      rows={3}
                      className="input-primary resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Status
                    </label>
                    <input
                      type="text"
                      name="status"
                      value={settingsData.status}
                      onChange={handleSettingsChange}
                      className="input-primary"
                      placeholder="What's on your mind?"
                    />
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={handleSaveProfile}
                    disabled={isLoading || usernameAvailable === false}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="spinner mr-2"></div>
                        Saving...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Save className="w-4 h-4 mr-2" />
                        Save Changes
                      </div>
                    )}
                  </button>
                </div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Security Settings</h2>

                  {/* Password Change Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Change Password</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPasswords.current ? 'text' : 'password'}
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className="input-primary pl-10 pr-12"
                          placeholder="Enter current password"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('current')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                          {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPasswords.new ? 'text' : 'password'}
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="input-primary pl-10 pr-12"
                          placeholder="Enter new password"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('new')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                          {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type={showPasswords.confirm ? 'text' : 'password'}
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="input-primary pl-10 pr-12"
                          placeholder="Confirm new password"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('confirm')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        >
                          {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleChangePassword}
                      disabled={isLoading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center">
                          <div className="spinner mr-2"></div>
                          Changing...
                        </div>
                      ) : (
                        'Change Password'
                      )}
                    </button>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="border-t border-dark-600 pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-white">Two-Factor Authentication</h3>
                        <p className="text-sm text-gray-400">
                          {user?.email ? 
                            'Add an extra layer of security with email verification codes' :
                            'Add an extra layer of security with random code phrase challenges'
                          }
                        </p>
                      </div>
                      <div className="flex items-center">
                        <button
                          onClick={handleToggle2FA}
                          disabled={isLoading}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800 ${
                            settingsData.twoFactorEnabled ? 'bg-primary-500' : 'bg-gray-600'
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              settingsData.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </div>
                    </div>
                    
                    {settingsData.twoFactorEnabled && (
                      <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                        <div className="flex items-start">
                          <AlertTriangle className="w-5 h-5 text-amber-400 mr-3 mt-0.5 flex-shrink-0" />
                          <div>
                            <h4 className="text-sm font-medium text-amber-400">Two-Factor Authentication Enabled</h4>
                            <p className="text-xs text-amber-300 mt-1">
                              {user?.email ? 
                                'You will receive verification codes via email when logging in.' :
                                'You will be challenged with random code phrases when logging in.'
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Notification Preferences</h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <h3 className="text-white font-medium">Email Notifications</h3>
                        <p className="text-sm text-gray-400">Receive notifications via email</p>
                      </div>
                      <button
                        onClick={() => setSettingsData(prev => ({ ...prev, emailNotifications: !prev.emailNotifications }))}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-dark-800 ${
                          settingsData.emailNotifications ? 'bg-primary-500' : 'bg-gray-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            settingsData.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;