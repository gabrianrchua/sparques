const express = require('express');
const Post = require('../models/Post');

const router = express.Router();

// @route   GET /api/posts
// @desc    Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/posts
// @desc    Create a new post
router.post('/', async (req, res) => {
  const { title, content, author, community } = req.body;
  try {
    const newPost = new Post({ title, content, author, community });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ message: 'Error creating post' });
  }
});

// @route   GET /api/posts/:id
// @desc    Get a single post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/posts/:id
// @desc    Update a post by ID
router.put('/:id', async (req, res) => {
  const { title, content, author } = req.body;
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content, author, editDate: Date.now() },
      { new: true, runValidators: true }
    );
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: 'Error updating post' });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post by ID
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;