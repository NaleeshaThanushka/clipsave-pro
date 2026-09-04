import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 30000
});

// Normalize error messages so components can just read err.message
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message =
      err.response?.data?.error ||
      err.message ||
      'Something went wrong. Please try again.';
    return Promise.reject(new Error(message));
  }
);


export const fetchVideoInfo = async (url) => {
  const { data } = await api.post('/info', { url });
  return data;
};

export const startDownload = async ({ url, urls, format, startTime, endTime }) => {
  const payload = { format, startTime: startTime || undefined, endTime: endTime || undefined };
  if (urls) payload.urls = urls;
  else payload.url = url;

  const { data } = await api.post('/download', payload);
  return data;
};

export const getQueueSnapshot = async () => {
  const { data } = await api.get('/download/queue');
  return data;
};

export const getFileUrl = (id) => `${API_URL}/api/file/${id}`;

export { API_URL };
export default api;