import axiosInstance from '../services/api/axios';

export const testBackendConnection = async () => {
  try {
    console.log('Testing backend connection...');
    const response = await axiosInstance.get('/health');
    console.log('✅ Backend connection successful:', response.data);
    return true;
  } catch (error) {
    console.error('❌ Backend connection failed:', error);
    return false;
  }
};

// Run this in browser console to test connection
// import { testBackendConnection } from './utils/test-api'; testBackendConnection();
