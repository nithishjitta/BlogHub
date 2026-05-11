import axios from 'axios';

const API_BASE_URL = 'http://localhost:3100';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const blogApi = {

  getAllBlogs: async () => {
    const response = await api.get("/blogs");
    return response.data;
  },

  getBlogById: async (id) => {
    const response = await api.get(`/blogs/${id}`);
    return response.data;
  },

  createBlog: async (blog) => {
    const response = await api.post('/blogs', blog);
    return response.data;
  },
};