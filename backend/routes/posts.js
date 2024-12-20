const express = require('express');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Vote = require('../models/Vote');

const router = express.Router();

// @route   GET /api/posts
// @desc    Get feed posts (for now, all posts)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error });
  }
});

// @route   POST /api/posts
// @desc    Create a new post
router.post('/', async (req, res) => {
  const { title, content, author, community } = req.body;
  if (!title || !content || !author || !community) return res.status(404).json({ message: "Missing one or more of required fields: 'title', 'content', 'author', 'community'" });
  try {
    const newPost = new Post({ title, content, author, community });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(400).json({ message: 'Error creating post', error: error });
  }
});

// @route   POST /api/posts/:id/comment
// @desc    Create a new comment under a post
router.post('/:id/comment', async (req, res) => {
  const { author, content } = req.body;
  if (!author || !content) return res.status(400).json({ message: "Missing one or more of required fields 'author', 'content'" });
  try {
    // update counter
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { numComments: 1 } },
      { new: true, runValidators: true }
    );
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const newComment = new Comment({ post_id: req.params.id, author, content });
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error });
  }
});

// @route   POST /api/posts/:id/vote
// @desc    Upvote or downvote a post
router.post('/:id/vote', async (req, res) => {
  const { author, isUpvote } = req.body;
  if (!author || isUpvote === undefined ) return res.status(400).json({ message: "Missing one or more of required fields 'author', 'isUpvote'" });
  try {
    const vote = await Vote.findOne({ post_id: req.params.id, author });
    if (vote) {
      // change vote
      // update counters
      if (vote.isUpvote && !isUpvote) {
        // upvote --> downvote
        const post = await Post.findByIdAndUpdate(
          req.params.id,
          { $inc: { numUpvotes: -1, numDownvotes: 1 } },
          { new: true, runValidators: true }
        );
        if (!post) res.status(404).json({ message: 'Post not found' });
      } else if (!vote.isUpvote && isUpvote) {
        // downvote --> upvote
        const post = await Post.findByIdAndUpdate(
          req.params.id,
          { $inc: { numUpvotes: 1, numDownvotes: -1 } },
          { new: true, runValidators: true }
        );
        if (!post) res.status(404).json({ message: 'Post not found' });
      } else {
        return res.json({ message: "No change required" });
      }
      // update vote
      const newVote = await Vote.findByIdAndUpdate(
        vote._id,
        { isUpvote },
        { new: true, runValidators: true }
      );
      return res.json(newVote);
    } else {
      // add vote
      // update counters
      const edit = isUpvote ? { numUpvotes: 1 } : { numDownvotes: 1 };
      const post = await Post.findByIdAndUpdate(
        req.params.id,
        { $inc: edit },
        { new: true, runValidators: true }
      );
      if (!post) res.status(404).json({ message: 'Post not found' });
      // create vote
      const newVote = new Vote({ post_id: req.params.id, author, isUpvote });
      const savedVote = await newVote.save();
      res.status(201).json(savedVote);
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error });
  }
});

// @route   GET /api/posts/:id
// @desc    Get a single post by ID with all details
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const comments = await Comment.find({ post_id: req.params.id });
    res.json({
      ...post.toObject(),
      comments
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error });
  }
});

// @route   PUT /api/posts/:id
// @desc    Update a post by ID
router.put('/:id', async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ message: "Missing one or more of required fields 'title', 'content'" });
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content, editDate: Date.now() },
      { new: true, runValidators: true }
    );
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Error updating post', error: error });
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
    res.status(500).json({ message: 'Server error', error: error });
  }
});

module.exports = router;