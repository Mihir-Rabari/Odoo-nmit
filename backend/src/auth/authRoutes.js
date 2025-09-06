const express = require('express');
const { registerUser, loginUser, updateUserProfile } = require('./authController');
const { protect } = require('./authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile', protect, updateUserProfile);

module.exports = router;