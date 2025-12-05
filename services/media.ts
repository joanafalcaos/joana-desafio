import api from './api';

export interface MediaItem {
  id: string;
  url: string;
  thumbnailUrl: string;
  originalName: string;
  mimeType: string;
  size: number;
  width: number;
  height: number;
  duration: number;
  createdAt: string;
}

interface MediaResponse {
  items: MediaItem[];
}

export const mediaService = {
  async getMedia(): Promise<MediaItem[]> {
    const response = await api.get<MediaResponse>('/media');
    return response.data.items;
  },

  /**
   * Calcula o tamanho total de armazenamento usado em bytes
   */
  calculateTotalSize(items: MediaItem[]): number {
    return items.reduce((total, item) => total + item.size, 0);
  },

  /**
   * Formata bytes para uma string legível (B, KB, MB, GB)
   */
  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  },

  /**
   * Calcula a porcentagem de uso do armazenamento
   * @param usedBytes bytes usados
   * @param totalBytes total de bytes disponíveis (padrão: 5GB)
   */
  calculateStoragePercentage(usedBytes: number, totalBytes: number = 5 * 1024 * 1024 * 1024): number {
    if (totalBytes === 0) return 0;
    return (usedBytes / totalBytes) * 100;
  },
};
