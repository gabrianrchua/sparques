const express = require('express');
const Community = require('../models/Community');

const router = express.Router();

// @route   GET /api/community
// @desc    Get list of communities
router.get('/', async (_, res) => {
  try {
    const communities = await Community.find();
    res.json(communities);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error });
  }
});

// @route   POST /api/community
// @desc    Create a new community
router.post('/', async (req, res) => {
  let { title, bannerImage, iconImage } = req.body;
  if (!title) return res.status(400).json({ message: "Missing required field 'title'" });

  if (!bannerImage || !bannerImage.mime || !bannerImage.data) bannerImage = undefined;
  if (!iconImage || !iconImage.mime || !iconImage.data) iconImage = undefined;

  try {
    const newCommunity = new Community({ title, bannerImage, iconImage });
    const savedCommunity = await newCommunity.save();
    res.status(201).json(savedCommunity);
  } catch (error) {
    if (error.code == 11000) {
      res.status(409).json({ message: "Community already exists" });
    } else {
      console.error(error);
      res.status(500).json({ message: 'Server error', error: error });
    }
  }
});

// @route   PUT /api/community/:id
// @desc    Update a community by ID
router.put('/:id', async (req, res) => {
  // title cannot be modified later
  const { bannerImage, iconImage } = req.body;
  
  if (!bannerImage || !bannerImage.mime || !bannerImage.data) bannerImage = undefined;
  if (!iconImage || !iconImage.mime || !iconImage.data) iconImage = undefined;

  try {
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ message: 'Community not found' });

    const editedCommunity = await Community.findByIdAndUpdate(
      req.params.id,
      { bannerImage, iconImage },
      { new: true, runValidators: true }
    );
    res.json(editedCommunity);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error });
  }
});

module.exports = router;