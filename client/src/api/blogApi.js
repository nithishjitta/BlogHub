import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

export const blogApi = {
  getAllBlogs: async () => {
    const response = await api.get('/blogs');
    return response.data;
  },

  getBlogById: async (id) => {
    const response = await api.get(`/blogs/${id}`);
    return response.data;
  },

  getBlogsByUser: async (email) => {
    const response = await api.get(`/blogs/user/${email}`);
    return response.data;
  },

  createBlog: async (blog) => {
    const response = await api.post('/blogs', blog);
    return response.data;
  },
};