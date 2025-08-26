import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      const { token, logout } = useAuthStore.getState();
      
      // Only logout and redirect if we have a token (meaning it's expired)
      // If no token, it's just a failed login attempt
      if (token) {
        logout();
        toast.error('Session expired. Please login again.');
        window.location.href = '/auth';
      }
      // For login failures without token, let the individual component handle the error
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    }
    // Remove automatic toast for other errors to prevent double toasts
    // Let individual components handle their specific error messages
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (credentials: {
    login: string;
    password?: string;
    codePhrase?: string;
    codePhraseIndex?: number;
  }) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },
  
  register: async (userData: {
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    role?: string;
  }) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  
  registerAnonymous: async (userData: {
    firstName: string;
    lastName: string;
    password: string;
    role?: string;
  }) => {
    const response = await api.post('/auth/register-anonymous', userData);
    return response.data;
  },
  
  verifyEmail: async (email: string, code: string) => {
    const response = await api.post('/auth/verify-email', { email, code });
    return response.data;
  },
  
  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },
  
  resetPassword: async (email: string, code: string, newPassword: string) => {
    const response = await api.post('/auth/reset-password', { email, code, newPassword });
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updatePassword: async (currentPassword: string, newPassword: string) => {
    const response = await api.put('/auth/update-password', {
      currentPassword,
      newPassword
    });
    return response.data;
  },

  resendVerification: async (email: string) => {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  
  updateProfile: async (userData: any) => {
    const response = await api.put('/users/profile', userData);
    return response.data;
  },
  
  uploadAvatar: async (formData: FormData) => {
    const response = await api.post('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  checkUsername: async (username: string) => {
    const response = await api.get(`/users/check-username/${username}`);
    return response.data;
  },

  changePassword: async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const response = await api.put('/users/change-password', passwordData);
    return response.data;
  },

  toggle2FA: async (enabled: boolean) => {
    const response = await api.put('/users/toggle-2fa', { enabled });
    return response.data;
  },
};

// Posts API
export const postsAPI = {
  getPosts: async (page = 1, limit = 10, filters?: any) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    });
    const response = await api.get(`/posts?${params}`);
    return response.data;
  },

  getFeed: async (page = 1, limit = 10) => {
    const response = await api.get(`/posts/feed/personal?page=${page}&limit=${limit}`);
    return response.data;
  },

  getPost: async (postId: string) => {
    const response = await api.get(`/posts/${postId}`);
    return response.data;
  },
  
  createPost: async (postData: {
    content: string;
    images?: string[];
    type?: string;
    tags?: string[];
    visibility?: string;
    metadata?: any;
  }) => {
    const response = await api.post('/posts', postData);
    return response.data;
  },

  updatePost: async (postId: string, postData: any) => {
    const response = await api.put(`/posts/${postId}`, postData);
    return response.data;
  },

  deletePost: async (postId: string) => {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  },
  
  likePost: async (postId: string) => {
    const response = await api.post(`/posts/${postId}/like`);
    return response.data;
  },

  getComments: async (postId: string, page = 1, limit = 10) => {
    const response = await api.get(`/posts/${postId}/comments?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  addComment: async (postId: string, content: string, parentComment?: string) => {
    const response = await api.post(`/posts/${postId}/comments`, {
      content,
      parentComment
    });
    return response.data;
  },

  searchPosts: async (query: string, filters?: any, page = 1, limit = 10) => {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
      ...filters
    });
    const response = await api.get(`/posts/search?${params}`);
    return response.data;
  },
};

export default api;