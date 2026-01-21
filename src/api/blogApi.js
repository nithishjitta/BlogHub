import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

export const blogApi = {

  getAllBlogs: async () => {
    const response = await axios.get(`${API_BASE_URL}/blogs`);
    return response.data;
  },

  getBlogById: async (id) => {
    const response = await axios.get(`${API_BASE_URL}/blogs/${id}`);
    return response.data;
  },

  createBlog: async (blog) => {
    const response = await axios.post(`${API_BASE_URL}/blogs`, blog);
    return response.data;
  },
};