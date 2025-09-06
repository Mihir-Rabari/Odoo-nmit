const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { registerUser, loginUser, updateUserProfile, generateAuthTokens } = require('./authController');
const { protect } = require('./authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile', protect, updateUserProfile);

module.exports = router;