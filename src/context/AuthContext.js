import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [signupData, setSignupData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    civilId: '',
    gender: '',
    dateOfBirth: null,
    bankAccountUsername: '',
    bankAccountNumber: '',
    subscription: 'Premium', // Default value
  });

  const updateSignupData = (newData) => {
    console.log('🔄 Updating signup data:', newData);
    setSignupData((prev) => ({ ...prev, ...newData }));
  };

  const resetSignupData = () => {
    console.log('🧹 Resetting signup data');
    setSignupData({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '',
      civilId: '',
      gender: '',
      dateOfBirth: null,
      bankAccountUsername: '',
      bankAccountNumber: '',
      subscription: 'Premium',
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
