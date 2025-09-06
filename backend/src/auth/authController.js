const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateAuthTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES || '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES || '30d' }
  );
  
  return { accessToken, refreshToken };
};

const registerUser = async (req, res) => {
  try {
    console.log('Registration request received:', req.body.email);
    const { email, password, displayName, firstName, lastName, photoURL } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      displayName: displayName || email.split('@')[0],
      firstName: firstName || displayName?.split(' ')[0] || email.split('@')[0],
      lastName: lastName || displayName?.split(' ').slice(1).join(' ') || '',
      photoURL,
      role: 'user',
      location: 'Not specified',
      rating: 0,
      totalSales: 0,
      totalPurchases: 0
    });

    await user.save();
    console.log('User registered successfully:', user._id);

    // Generate tokens
    const tokens = generateAuthTokens(user);

    res.status(201).json({
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Login request received:', email);
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for user:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('User logged in successfully:', user._id);
    // Generate tokens
    const tokens = generateAuthTokens(user);

    res.json({
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const updateData = req.body;
    
    // Remove sensitive fields that shouldn't be updated via this endpoint
    delete updateData.password;
    delete updateData._id;
    delete updateData.role;
    delete updateData.createdAt;
    
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const userResponse = updatedUser.toJSON();
    delete userResponse.password;
    
    res.status(200).json({
      message: 'Profile updated successfully',
      user: userResponse,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, updateUserProfile };