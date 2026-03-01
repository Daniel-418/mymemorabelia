import client from './client';

export interface ApiCapsule {
  id: number;
  title: string;
  description: string;
  delivery_date: string;
  delivery_email: string;
  status: 'pending' | 'delivered' | 'failed';
  created_at: string;
  item_count: number;
}

export interface ApiCapsuleItem {
  id: number;
  content_type: 'text' | 'image' | 'video' | 'audio' | 'spotify';
  text_content?: string;
  file?: string;
  spotify_link?: string;
  created_at: string;
}

export const capsulesApi = {
  listCapsules: async (): Promise<ApiCapsule[]> => {
    const response = await client.get('/capsules/');
    return response.data;
  },

  createCapsule: async (data: any): Promise<ApiCapsule> => {
    const response = await client.post('/capsules/create/', data);
    return response.data;
  },

  listCapsuleItems: async (id: number): Promise<ApiCapsuleItem[]> => {
    const response = await client.get(`/capsules/${id}/items/`);
    return response.data;
  },

  createCapsuleItem: async (id: number, formData: FormData): Promise<ApiCapsuleItem> => {
    const response = await client.post(`/capsules/${id}/items/create/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};
