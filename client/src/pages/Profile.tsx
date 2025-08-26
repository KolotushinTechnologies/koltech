import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Camera, Edit3, X, Settings, LogOut, Briefcase, Loader,
  DollarSign, Target, TrendingUp, MessageCircle, Plus, Heart, Share2,
  CheckCircle, Clock, Eye, ThumbsUp
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { userAPI, postsAPI } from '../utils/api';
import toast from 'react-hot-toast';

interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  username?: string;
  email?: string;
  avatar?: string;
  bio?: string;
  status?: string;
  location?: string;
  website?: string;
  createdAt?: string;
  followers?: number;
  following?: number;
  skills?: string[];
  rating?: number;
  letteraTechNumber?: string;
  role: 'user' | 'freelancer' | 'startup' | 'admin';
  twoFactorEnabled?: boolean;
  emailNotifications?: boolean;
}

const Profile = () => {
  const navigate = useNavigate();
  const { user: authUser, logout, updateUser } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'freelance' | 'social'>('dashboard');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    if (!authUser) {
      navigate('/auth');
      return;
    }
    // Только загружаем профиль при первой загрузке компонента
    fetchUserProfile();
    fetchUserPosts();
  }, [navigate]); // Убираем authUser из dependencies

  // Update local user state when authUser changes (e.g., after profile update in Settings)
  useEffect(() => {
    if (authUser) {
      setUser(authUser);
    }
  }, [authUser]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getProfile();
      if (response.success) {
        console.log('Profile data:', response.data); // Debug log
        console.log('Avatar path:', response.data.avatar); // Debug avatar
        setUser(response.data);
        // Обновляем store только если данные действительно изменились
        if (JSON.stringify(authUser) !== JSON.stringify(response.data)) {
          updateUser(response.data);
        }
      } else {
        toast.error('Failed to load profile');
      }
    } catch (error: any) {
      console.error('Profile fetch error:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await postsAPI.getPosts(1, 10, { author: authUser?._id });
      if (response.success) {
        setPosts(response.data.posts || []);
      }
    } catch (error: any) {
      console.error('Posts fetch error:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  const getDisplayName = () => {
    if (!user) return '';
    return `${user.firstName} ${user.lastName}`;
  };

  const getUsername = () => {
    if (!user) return '';
    return user.letteraTechNumber ? user.letteraTechNumber : (user.username || user.email);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'freelancer': return 'text-accent-green';
      case 'startup': return 'text-accent-purple';
      case 'admin': return 'text-accent-orange';
      default: return 'text-primary-400';
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 text-primary-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      <Header />

      <div className="pt-20 pb-12">
        <div className="container mx-auto px-6">
          <Link to="/" className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors btn-ghost">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          {/* Profile Header */}
          <motion.div 
            className="glass-effect-dark rounded-2xl p-8 mb-8 animate-scale-in"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col lg:flex-row items-start gap-8">
              <div className="relative">
                <img
                  src={user.avatar ? `${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5005'}${user.avatar}` : `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=6366f1&color=ffffff&size=128`}
                  alt={getDisplayName()}
                  className="w-32 h-32 rounded-2xl object-cover border-4 border-primary-500/30"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=6366f1&color=ffffff&size=128`;
                  }}
                />
                <button className="absolute bottom-0 right-0 bg-primary-500 p-2 rounded-xl hover:bg-primary-600 transition-colors">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{getDisplayName()}</h1>
                    <div className="flex items-center gap-4">
                      <p className="text-primary-400 font-medium">
                        {user.letteraTechNumber ? `ID: ${user.letteraTechNumber}` : `@${getUsername()}`}
                      </p>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium bg-primary-500/20 ${getRoleColor(user.role)}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button className="btn-secondary flex items-center">
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </button>
                    <button className="btn-ghost">
                      <Settings className="w-4 h-4" />
                    </button>
                    <button onClick={handleLogout} className="btn-ghost text-red-400 hover:text-red-300">
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-300 mb-6 leading-relaxed max-w-2xl">
                  {user.bio || 'Welcome to KolTechLine - your gateway to freelance opportunities, project collaboration, and startup funding.'}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">3</div>
                    <div className="text-gray-400 text-sm">Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{user.rating || 4.8}★</div>
                    <div className="text-gray-400 text-sm">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{posts.length}</div>
                    <div className="text-gray-400 text-sm">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{user.followers || 0}</div>
                    <div className="text-gray-400 text-sm">Followers</div>
                  </div>
                </div>

                {user.skills && user.skills.length > 0 && (
                  <div className="mt-6">
                    <h3 className="text-white font-semibold mb-3">Skills & Expertise</h3>
                    <div className="flex flex-wrap gap-2">
                      {user.skills.map((skill) => (
                        <span key={skill} className="bg-primary-500/20 text-primary-400 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <div className="flex justify-center mb-8 overflow-x-auto">
            <div className="glass-effect-dark rounded-2xl p-2 flex gap-2">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: TrendingUp },
                { id: 'projects', label: 'Projects', icon: Briefcase },
                { id: 'freelance', label: 'Freelance', icon: DollarSign },
                { id: 'social', label: 'Social', icon: MessageCircle }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center whitespace-nowrap ${
                    activeTab === tab.id ? 'bg-primary-500 text-white' : 'text-gray-400 hover:text-white hover:bg-dark-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-6xl mx-auto">
            {activeTab === 'dashboard' && (
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="glass-effect-dark rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Briefcase className="w-5 h-5 mr-2 text-primary-400" />
                    Active Projects
                  </h3>
                  <div className="bg-dark-800/50 p-4 rounded-xl">
                    <h4 className="font-semibold text-white mb-2">E-commerce Platform</h4>
                    <div className="flex justify-between items-center mb-2">
                      <span className="px-2 py-1 rounded text-xs bg-accent-green/20 text-accent-green">Active</span>
                      <span className="text-sm text-gray-400">75%</span>
                    </div>
                    <div className="w-full bg-dark-600 rounded-full h-2">
                      <div className="bg-primary-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="glass-effect-dark rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <DollarSign className="w-5 h-5 mr-2 text-accent-green" />
                    Earnings
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-dark-800/50 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-accent-green">$12,450</div>
                      <div className="text-sm text-gray-400">Total Earned</div>
                    </div>
                    <div className="bg-dark-800/50 p-4 rounded-xl">
                      <div className="text-2xl font-bold text-primary-400">$3,200</div>
                      <div className="text-sm text-gray-400">This Month</div>
                    </div>
                  </div>
                </div>

                <div className="glass-effect-dark rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-accent-purple" />
                    Recent Activity
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <CheckCircle className="w-4 h-4 text-accent-green mr-2" />
                      <span className="text-gray-300">Project completed</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <ThumbsUp className="w-4 h-4 text-primary-400 mr-2" />
                      <span className="text-gray-300">Received 5-star rating</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Eye className="w-4 h-4 text-accent-orange mr-2" />
                      <span className="text-gray-300">Profile viewed 23 times</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'projects' && (
              <div className="glass-effect-dark rounded-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-white">My Projects</h2>
                  <button className="btn-primary flex items-center">
                    <Plus className="w-4 h-4 mr-2" />
                    New Project
                  </button>
                </div>
                <p className="text-gray-400 text-center py-8">
                  Your projects will appear here. Start by creating freelance projects, crowdfunding campaigns, or personal development work.
                </p>
              </div>
            )}

            {activeTab === 'freelance' && (
              <div className="space-y-6">
                <div className="glass-effect-dark rounded-2xl p-6">
                  <h2 className="text-2xl font-bold text-white mb-4">Freelance Dashboard</h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-dark-800/50 p-4 rounded-xl text-center">
                      <div className="text-2xl font-bold text-accent-green">$85/hr</div>
                      <div className="text-sm text-gray-400">Hourly Rate</div>
                    </div>
                    <div className="bg-dark-800/50 p-4 rounded-xl text-center">
                      <div className="text-2xl font-bold text-primary-400">12</div>
                      <div className="text-sm text-gray-400">Completed Projects</div>
                    </div>
                    <div className="bg-dark-800/50 p-4 rounded-xl text-center">
                      <div className="text-2xl font-bold text-accent-purple">4.9★</div>
                      <div className="text-sm text-gray-400">Client Rating</div>
                    </div>
                  </div>
                </div>

                <div className="glass-effect-dark rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Available Opportunities</h3>
                  <div className="space-y-4">
                    <div className="bg-dark-800/50 p-4 rounded-xl">
                      <h4 className="font-semibold text-white mb-2">React Developer Needed</h4>
                      <p className="text-gray-300 text-sm mb-3">Build responsive web application with modern React stack</p>
                      <div className="flex justify-between items-center">
                        <span className="text-accent-green font-bold">$4,000 - $6,000</span>
                        <button className="btn-primary text-sm">Apply</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'social' && (
              <div className="glass-effect-dark rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Social Activity</h2>
                {posts.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400">No posts yet. Share your first update with the KolTech community!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {posts.slice(0, 5).map((post) => (
                      <div key={post._id} className="bg-dark-800/50 p-4 rounded-xl">
                        <p className="text-gray-300 mb-2">{post.content}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center"><Heart className="w-4 h-4 mr-1" />{post.likes}</span>
                          <span className="flex items-center"><MessageCircle className="w-4 h-4 mr-1" />{post.comments}</span>
                          <span className="flex items-center"><Share2 className="w-4 h-4 mr-1" />{post.shares}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;