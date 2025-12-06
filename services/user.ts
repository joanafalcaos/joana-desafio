import api from './api';

export interface User {
  _id: string;
  name: string;
  email: string;
  birthday?: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

interface UserMeResponse {
  user: User;
}

interface UpdateUserData {
  name?: string;
  email?: string;
  birthday?: string;
}

export const userService = {
  async getMe(): Promise<User> {
    const response = await api.get<UserMeResponse>('/users/me');
    return response.data.user;
  },

  async updateMe(data: UpdateUserData): Promise<User> {
    const response = await api.put<UserMeResponse>('/users/me', data);
    return response.data.user;
  },

  async uploadAvatar(uri: string, fileName: string, mimeType: string): Promise<User> {
    const formData = new FormData();

    // Adicionar o arquivo ao FormData
    formData.append('avatar', {
      uri,
      name: fileName,
      type: mimeType,
    } as any);

    const response = await api.post<UserMeResponse>('/users/me/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.user;
  },
};
