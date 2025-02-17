import { useMutation } from '@tanstack/react-query';
import { register, login } from '@/api/auth';
import { useAuthContext } from '@/context/AuthContext';
import Toast from 'react-native-toast-message';

export function useSignup() {
  return useMutation({
    mutationFn: async (userData) => {
      console.log('🚀 Starting API registration call with data:', userData);
      const response = await register(userData);
      console.log('📥 API registration response:', response);
      return response;
    },
    onSuccess: (data) => {
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Account created successfully!',
      });
    },
    onError: (error) => {
      console.log('💥 Registration error:', error.response?.data || error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to create account',
      });
    },
  });
}

export function useLogin() {
  const { setUser } = useAuthContext();

  return useMutation({
    mutationFn: async (credentials) => {
      console.log('🔑 Starting login API call with:', credentials);
      const response = await login(credentials);
      console.log('📥 Login API response:', response);
      return response;
    },
    onSuccess: (data) => {
      console.log('✨ Setting user data in context:', data);
      setUser(data);
      Toast.show({
        type: 'success',
        text1: 'Welcome back!',
        text2: 'Login successful',
      });
    },
    onError: (error) => {
      console.log('💥 Login error:', error.response?.data || error);
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error.response?.data?.message || 'Invalid email or password',
      });
    },
  });
}
