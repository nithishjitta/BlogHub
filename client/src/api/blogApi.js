import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
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

  likeBlog: async (id) => {
    const response = await api.patch(`/blogs/${id}/like`);
    return response.data;
  },

  shareBlog: async (id) => {
    const response = await api.patch(`/blogs/${id}/share`);
    return response.data;
  },

  saveBlog: async (id) => {
    const response = await api.patch(`/blogs/${id}/save`);
    return response.data;
  },

  getSavedBlogs: async () => {
    const response = await api.get('/blogs/saved');
    return response.data;
  },

  commentBlog: async (id, payload) => {
    const response = await api.patch(`/blogs/${id}/comment`, payload);
    return response.data;
  },
};