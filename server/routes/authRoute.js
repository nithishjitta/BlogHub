const express = require('express');
const router = express.Router();
const { signUp, signIn } = require('../controller/authController');
const Blog = require('../model/blog');
const jwt = require('jsonwebtoken');
const passport = require("passport");

router.post('/signup', signUp);
router.post('/signin', signIn);

// Get all blogs
router.get('/blogs', async (req, res) => {
  const data = await Blog.find();
  return res.json(data);
});

// Get blogs by user email — must come BEFORE /blogs/:id
router.get('/blogs/user/:email', async (req, res) => {
  const blogs = await Blog.find({ 'author.email': req.params.email });
  return res.json(blogs);
});

// Get single blog by id
router.get('/blogs/:id', async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  return res.json(blog);
});

// Create blog
router.post('/blogs', async (req, res) => {
  const blog = await Blog.create(req.body);
  return res.json(blog);
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

    res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

    res.redirect(process.env.FRONTEND_URL);
  }
);

router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ success: true });
})

module.exports = router;