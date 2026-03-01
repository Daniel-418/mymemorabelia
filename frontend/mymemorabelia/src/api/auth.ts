import client from './client';
import { User } from '../store/authStore';

interface AuthResponse {
  token: string;
  user: User;
}

export const authApi = {
  register: async (data: any): Promise<AuthResponse> => {
    const response = await client.post('/register/', data);
    return response.data;
  },

  login: async (data: any): Promise<AuthResponse> => {
    const response = await client.post('/login/', data);
    return response.data;
  },
};
