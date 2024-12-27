const express = require('express');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Vote = require('../models/Vote');
const { requireAuth, optionalAuth } = require('../routes/auth');

const router = express.Router();

// @route   GET /api/posts
// @desc    Get feed posts (for now, all posts)
router.get('/', optionalAuth, async (req, res) => {
  try {
    if (req.username) {
      // if user is logged in, join with vote status (up, down, none)
      const posts = await Post.aggregate([
        {$lookup: {
          from: "votes",
          localField: "_id",
          foreignField: "postId",
          as: "votes"
        }}
      ]).sort({ creationDate: "descending" });
      res.json(posts);
    } else {
      const posts = await Post.find().sort({ creationDate: "descending" });
      res.json(posts);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error });
  }
});

// @route   POST /api/posts
// @desc    Create a new post
router.post('/', requireAuth, async (req, res) => {
  const { title, content, community } = req.body;
  if (!title || !content || !community) return res.status(400).json({ message: "Missing one or more of required fields: 'title', 'content', 'community'" });
  try {
    const newPost = new Post({ title, content, author: req.username, community });
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error });
  }
});

// @route   POST /api/posts/:id/comment
// @desc    Create a new comment under a post
router.post('/:id/comment', requireAuth, async (req, res) => {
  const { content, parentId } = req.body;
  if (!content) return res.status(400).json({ message: "Missing required field 'content'" });
  try {
    // update counter
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $inc: { numComments: 1 } },
      { new: true, runValidators: true }
    );
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const newComment = parentId ? new Comment({ postId: req.params.id, author: req.username, content, parentId }) : new Comment({ postId: req.params.id, author: req.username, content });
    const savedComment = await newComment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error });
  }
});

// @route   POST /api/posts/:id/vote
// @desc    Upvote or downvote a post
router.post('/:id/vote', requireAuth, async (req, res) => {
  const { isUpvote } = req.body;
  if (isUpvote === undefined) return res.status(400).json({ message: "Missing required field 'isUpvote'" });
  try {
    const vote = await Vote.findOne({ postId: req.params.id, author: req.username });
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
        
        // update vote
        const newVote = await Vote.findByIdAndUpdate(
          vote._id,
          { isUpvote },
          { new: true, runValidators: true }
        );
        return res.json(newVote);
      } else if (!vote.isUpvote && isUpvote) {
        // downvote --> upvote
        const post = await Post.findByIdAndUpdate(
          req.params.id,
          { $inc: { numUpvotes: 1, numDownvotes: -1 } },
          { new: true, runValidators: true }
        );
        if (!post) res.status(404).json({ message: 'Post not found' });

        // update vote
        const newVote = await Vote.findByIdAndUpdate(
          vote._id,
          { isUpvote },
          { new: true, runValidators: true }
        );
        return res.json(newVote);
      } else if (vote.isUpvote && isUpvote) {
        // remove upvote
        const post = await Post.findByIdAndUpdate(
          req.params.id,
          { $inc: { numUpvotes: -1 } },
          { new: true, runValidators: true }
        );
        if (!post) res.status(404).json({ message: 'Post not found' });

        // delete vote
        const deletedVote = await Vote.findByIdAndDelete(vote._id);
        return res.json(deletedVote);
      } else {
        // remove downvote
        const post = await Post.findByIdAndUpdate(
          req.params.id,
          { $inc: { numDownvotes: -1 } },
          { new: true, runValidators: true }
        );
        if (!post) res.status(404).json({ message: 'Post not found' });

        // delete vote
        const deletedVote = await Vote.findByIdAndDelete(vote._id);
        return res.json(deletedVote);
      }
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
      const newVote = new Vote({ postId: req.params.id, author: req.username, isUpvote });
      const savedVote = await newVote.save();
      res.status(201).json(savedVote);
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error });
  }
});

// @route   GET /api/posts/:id
// @desc    Get a single post by ID with all details
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    
    // get comments
    const comments = await Comment.find({ postId: req.params.id }).sort({ creationDate: "descending" });
    
    // if logged in, get upvote status
    if (req.username) {
      const vote = await Vote.find({ postId: req.params.id, author: req.username });
      res.json({
        ...post.toObject(),
        comments,
        votes: vote
      });
    } else {
      res.json({
        ...post.toObject(),
        comments
      });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error });
  }
});

// @route   PUT /api/posts/:id
// @desc    Update a post by ID
router.put('/:id', requireAuth, async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) return res.status(400).json({ message: "Missing one or more of required fields 'title', 'content'" });
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author !== req.username) return res.status(403).json({ message: "User is forbidden to edit a post created by another user " });

    const editedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content, editDate: Date.now() },
      { new: true, runValidators: true }
    );
    res.json(editedPost);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post by ID
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (post.author !== req.username) return res.status(403).json({ message: "User is forbidden to delete a post created by another user " });

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error });
  }
});

module.exports = router;