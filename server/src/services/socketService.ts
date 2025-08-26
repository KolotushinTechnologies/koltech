import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { IUser } from '../types/index.js';

interface AuthenticatedSocket extends Socket {
  user?: IUser;
}

export const setupSocketIO = (io: Server): void => {
  // Authentication middleware for Socket.IO
  io.use(async (socket: any, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      // Here you would fetch the user from database
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    console.log(`🔌 User connected: ${socket.user?.username || 'Unknown'}`);

    // Join user to their personal room
    if (socket.user) {
      socket.join(`user_${socket.user._id}`);
    }

    // Handle real-time chat
    socket.on('join_chat', (chatId: string) => {
      socket.join(`chat_${chatId}`);
      console.log(`💬 User joined chat: ${chatId}`);
    });

    socket.on('send_message', (data: any) => {
      socket.to(`chat_${data.chatId}`).emit('new_message', {
        ...data,
        sender: socket.user,
        timestamp: new Date()
      });
    });

    // Handle typing indicators
    socket.on('typing_start', (chatId: string) => {
      socket.to(`chat_${chatId}`).emit('user_typing', {
        user: socket.user,
        isTyping: true
      });
    });

    socket.on('typing_stop', (chatId: string) => {
      socket.to(`chat_${chatId}`).emit('user_typing', {
        user: socket.user,
        isTyping: false
      });
    });

    // Handle notifications
    socket.on('join_notifications', () => {
      if (socket.user) {
        socket.join(`notifications_${socket.user._id}`);
      }
    });

    // Handle project updates
    socket.on('join_project', (projectId: string) => {
      socket.join(`project_${projectId}`);
      console.log(`📋 User joined project: ${projectId}`);
    });

    socket.on('project_update', (data: any) => {
      socket.to(`project_${data.projectId}`).emit('project_updated', {
        ...data,
        timestamp: new Date()
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`🔌 User disconnected: ${socket.user?.username || 'Unknown'}`);
    });
  });

  console.log('🚀 Socket.IO server initialized');
};

// Helper function to send notification to specific user
export const sendNotificationToUser = (io: Server, userId: string, notification: any): void => {
  io.to(`notifications_${userId}`).emit('new_notification', notification);
};

// Helper function to send update to project participants
export const sendProjectUpdate = (io: Server, projectId: string, update: any): void => {
  io.to(`project_${projectId}`).emit('project_updated', update);
};