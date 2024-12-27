const express = require('express');
const jwt = require('jsonwebtoken');

const User = require("../models/User");

const JWT_SECRET = process.env.JWT_SECRET || 'mysecretdontuse';

const router = express.Router();

// authorization middleware
const requireAuth = function (req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ message: 'Unauthorized: Log in first, no token provided' });
  } else {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).json({ message: 'Unauthorized: Log in again, invalid token' });
      } else {
        req.username = decoded.username;
        next();
      }
    });
  }
}

const optionalAuth = function (req, res, next) {
  const token = req.cookies.token;
  if (!token) {
    next();
  } else {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        next();
      } else {
        req.username = decoded.username;
        next();
      }
    });
  }
}

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Missing one or more of required fields: 'username', 'password'" });
  try {
    const user = new User({ username, password });
    await user.save();
    res.status(201).json({ message: "Register success" });
  } catch (error) {
    if (error.code === 11000) {
      // user already exists
      res.status(409).json({ message: "User already exists" });
    } else {
      // some other error
      res.status(500).json({ message: 'Server error', error: error });
    }
  }
});

// @route   POST /api/auth
// @desc    Log in as existing user
router.post('/', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: "Missing one or more of required fields: 'username', 'password'" });
  try {
    const user = await User.findOne({ username });
    if (user) {
      user.isCorrectPassword(password, (err, same) => {
        if (err) {
          res.status(500).json({ message: 'Server error', error: err });
        } else if (!same) {
          res.status(401).json({ message: 'Incorrect email or password' });
        } else {
          // Issue token
          const payload = { username };
          const token = jwt.sign(payload, JWT_SECRET, {
            expiresIn: '24h'
          });
          res.cookie('token', token, { httpOnly: true }).json({ message: "Sign in successful" });
        }
      });
    } else {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error });
  }
});

// @route   GET /api/auth/validate
// @desc    Check if user's token is still valid
router.get('/checkToken', requireAuth, function (req, res) {
  res.json({ message: "Valid token" });
});

exports.router = router;
exports.requireAuth = requireAuth;
exports.optionalAuth = optionalAuth;