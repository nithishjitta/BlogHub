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
  likes: { type: Number, default: 0 },
  likedBy: { type: [String], default: [] },
  shares: { type: Number, default: 0 },
  saves: { type: Number, default: 0 },
  savedBy: { type: [String], default: [] },
  comments: [
    {
      author: {
        name: { type: String },
        email: { type: String },
      },
      text: { type: String, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
});

const Blog = mongoose.model('blog', blogSchema);
module.exports = Blog;