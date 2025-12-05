import api from './api';

export interface User {
  _id: string;
  name: string;
  email: string;
  birthday?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface UserMeResponse {
  user: User;
}

export const userService = {
  async getMe(): Promise<User> {
    const response = await api.get<UserMeResponse>('/users/me');
    return response.data.user;
  },
};
