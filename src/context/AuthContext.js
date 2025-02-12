import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken } from '@/api/storage';
import { useNotifications } from '@/hooks/useNotifications';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    civilId: '',
    dateOfBirth: new Date(),
    gender: '',
  });

  const notifications = useNotifications(user?.token);

  // Initialize notifications when user logs in
  useEffect(() => {
    if (user) {
      // Register notification handlers
      const cleanup = notifications.registerNotificationHandlers(
        (notification) => {
          // Handle foreground notification
          console.log('Received notification in foreground:', notification);
        },
        (response) => {
          // Handle notification response (when user taps notification)
          console.log('User interacted with notification:', response);
          // TODO: Add navigation logic based on notification type
        }
      );

      return cleanup;
    }
  }, [user, notifications]);

  const updateSignupData = (updates) => {
    setSignupData((prev) => ({ ...prev, ...updates }));
  };

  const resetSignupData = () => {
    setSignupData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '',
      civilId: '',
      dateOfBirth: new Date(),
      gender: '',
    });
  };

  const logout = () => {
    console.log('🚪 Logging out user');
    setUser(null);
    resetSignupData();
  };

  return (
    <AuthContext.Provider value={{ user, setUser, signupData, updateSignupData, resetSignupData, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
