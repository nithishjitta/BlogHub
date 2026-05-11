const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const {signUp, signIn} = require('../controller/authController');
const Blog = require('../model/blog');

router.post('/signup', (req, res) => {
    signUp(req, res);
})

router.post('/signin', (req, res) => {
    signIn(req, res);
})

router.get('/blogs', async (req, res) => {
    const data = await Blog.find();
    return res.json(data);
})

router.get('/blogs/:id', async(req, res) => {
    const blog = await Blog.findById(req.params.id);
    return res.json(blog);
})

router.post('/blogs', async(req, res) => {
    const blog = await Blog.create(req.body);
    return res.json(blog);
})

module.exports = router;