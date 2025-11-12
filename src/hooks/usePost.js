// src/hooks/usePosts.js
import { useApi } from './useApi';
import { apiService } from '../services/apiService';

export const usePosts = () => {
  return useApi(() => apiService.get('/posts'));
};

export const usePost = (postId) => {
  return useApi(() => apiService.get(`/posts/${postId}`), [postId]);
};

export const useCreatePost = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createPost = async (postData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiService.post('/posts', postData);
      return response.data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createPost, loading, error };
};