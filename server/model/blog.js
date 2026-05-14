const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: [String], required: true },
  description: { type: String },
  coverImage: { type: String },
  content: { type: String, required: true },
  date: { type: Date, default: Date.now },
  author: {
    name: { type: String },
    email: { type: String }, // ← used to fetch user's blogs
  },
});

const Blog = mongoose.model('blog', blogSchema);
module.exports = Blog;