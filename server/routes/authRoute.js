const express = require('express');
const router = express.Router();
const { signUp, signIn } = require('../controller/authController');
const Blog = require('../model/blog');
const jwt = require('jsonwebtoken');
const passport = require("passport");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'none',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

router.post('/signup', signUp);
router.post('/signin', signIn);

const normalizeBlog = (blog) => {
  if (!blog) return blog;
  const data = blog.toObject ? blog.toObject() : blog;
  data.author = data.author || {};
  data.author.name = data.author.name || 'BlogHub Author';
  data.author.email = data.author.email || '';
  data.likes = data.likes ?? (data.likedBy?.length ?? 0);
  data.saves = data.saves ?? (data.savedBy?.length ?? 0);
  data.comments = data.comments || [];
  return data;
};

const normalizeBlogs = (blogs) => blogs.map(normalizeBlog);

// Get all blogs
router.get('/blogs', async (req, res) => {
  const data = await Blog.find();
  return res.json(normalizeBlogs(data));
});

// Get blogs by user email — must come BEFORE /blogs/:id
router.get('/blogs/user/:email', async (req, res) => {
  const blogs = await Blog.find({ 'author.email': req.params.email });
  return res.json(normalizeBlogs(blogs));
});

// Get saved blogs for current user
router.get('/blogs/saved', async (req, res) => {
  const user = getUserFromToken(req.cookies.token);
  if (!user?.email) return res.status(401).json({ message: 'Not authenticated' });

  const blogs = await Blog.find({ savedBy: user.email });
  return res.json(normalizeBlogs(blogs));
});

// Get single blog by id
router.get('/blogs/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  return res.json(normalizeBlog(blog));
});

const getUserFromToken = (token) => {
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

router.patch('/blogs/:id/like', async (req, res) => {
  const user = getUserFromToken(req.cookies.token);
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: 'Blog not found' });

  if (user?.email) {
    blog.likedBy = blog.likedBy || [];
    const alreadyLiked = blog.likedBy.includes(user.email);
    if (alreadyLiked) {
      blog.likedBy = blog.likedBy.filter((email) => email !== user.email);
    } else {
      blog.likedBy.push(user.email);
    }
    blog.likes = blog.likedBy.length;
    await blog.save();
    return res.json(normalizeBlog(blog));
  }

  const updated = await Blog.findByIdAndUpdate(
    req.params.id,
    { $inc: { likes: 1 } },
    { new: true }
  );
  return res.json(normalizeBlog(updated));
});

router.patch('/blogs/:id/share', async (req, res) => {
  const blog = await Blog.findByIdAndUpdate(
    req.params.id,
    { $inc: { shares: 1 } },
    { new: true }
  );
  if (!blog) return res.status(404).json({ message: 'Blog not found' });
  return res.json(normalizeBlog(blog));
});

router.patch('/blogs/:id/save', async (req, res) => {
  const user = getUserFromToken(req.cookies.token);
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: 'Blog not found' });

  if (user?.email) {
    blog.savedBy = blog.savedBy || [];
    if (blog.savedBy.includes(user.email)) {
      blog.savedBy = blog.savedBy.filter((email) => email !== user.email);
    } else {
      blog.savedBy.push(user.email);
    }
    blog.saves = blog.savedBy.length;
    await blog.save();
    return res.json(normalizeBlog(blog));
  }

  const updated = await Blog.findByIdAndUpdate(
    req.params.id,
    { $inc: { saves: 1 } },
    { new: true }
  );
  return res.json(normalizeBlog(updated));
});

router.patch('/blogs/:id/comment', async (req, res) => {
  const { text, authorName } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ message: 'Comment text is required' });
  }

  const user = getUserFromToken(req.cookies.token);
  const author = {
    name: authorName || user?.name || 'Guest',
    email: user?.email,
  };

  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).json({ message: 'Blog not found' });

  blog.comments = blog.comments || [];
  blog.comments.push({ author, text: text.trim() });
  await blog.save();
  return res.json(normalizeBlog(blog));
});

// Create blog
router.post('/blogs', async (req, res) => {
  const payload = {
    ...req.body,
    author: {
      name: req.body.author?.name || 'BlogHub Author',
      email: req.body.author?.email || '',
    },
  };
  const blog = await Blog.create(payload);
  return res.json(normalizeBlog(blog));
});


router.get('/me', (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Not authenticated' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ user: { name: decoded.name, email: decoded.email } });
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
});

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.FRONTEND_URL,
    session: false,
  }),
  (req, res) => {
    const token = jwt.sign(
      {
        id: req.user._id,
        name: req.user.fullname,
        email: req.user.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, cookieOptions);

    res.redirect(process.env.FRONTEND_URL);
  }
);

router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    path: '/',
  });
  res.cookie('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    path: '/',
    maxAge: 0,
  });
  res.json({ success: true });
});

module.exports = router;