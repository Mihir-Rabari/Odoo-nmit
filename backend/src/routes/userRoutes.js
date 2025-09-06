const express = require('express');
const User = require('../models/User');
const { protect, authorize } = require('../auth/authMiddleware');

const router = express.Router();

// Get all users (Admin only)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const users = await User.find({}).select('-firebaseUid'); // Exclude firebaseUid from response
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user profile (Logged-in user)
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-firebaseUid');
    if (user) {
      res.json({
        _id: user._id,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: user.role,
        createdAt: user.createdAt,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile (Logged-in user)
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.displayName = req.body.displayName || user.displayName;
      user.photoURL = req.body.photoURL || user.photoURL;

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        email: updatedUser.email,
        displayName: updatedUser.displayName,
        photoURL: updatedUser.photoURL,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete user (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.deleteOne();
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;