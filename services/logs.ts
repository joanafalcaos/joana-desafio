import api from './api';

export interface LogItem {
  _id: string;
  userId: string;
  action: string;
  details?: string;
  createdAt: string;
  updatedAt: string;
}

interface LogsResponse {
  logs: LogItem[];
}

export const logsService = {
  async getLogs(): Promise<LogItem[]> {
    const response = await api.get<LogsResponse>('/logs');
    return response.data.logs;
  },
};
