import React from 'react';
import { Toaster } from 'react-hot-toast';

const ToastProvider: React.FC = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Define default options
        className: '',
        duration: 4000,
        style: {
          background: '#1e293b',
          color: '#f8fafc',
          border: '1px solid #334155',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: '500',
        },
        // Default options for specific types
        success: {
          duration: 3000,
          style: {
            background: 'linear-gradient(to right, #10b981, #059669)',
            color: '#ffffff',
          },
          iconTheme: {
            primary: '#ffffff',
            secondary: '#10b981',
          },
        },
        error: {
          duration: 4000,
          style: {
            background: 'linear-gradient(to right, #ef4444, #dc2626)',
            color: '#ffffff',
          },
          iconTheme: {
            primary: '#ffffff',
            secondary: '#ef4444',
          },
        },
        loading: {
          style: {
            background: 'linear-gradient(to right, #3b82f6, #2563eb)',
            color: '#ffffff',
          },
        },
      }}
    />
  );
};

export default ToastProvider;