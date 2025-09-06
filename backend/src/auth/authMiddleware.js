const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateAuthTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES }
  );
  const refreshToken = jwt.sign(
    { userId: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES }
  );
  return { accessToken, refreshToken };
};

const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token received:', token ? 'Present' : 'Missing');
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('Token decoded, user ID:', decoded.userId);
      
      req.user = await User.findById(decoded.userId).select('-password');
      
      if (!req.user) {
        console.log('User not found in database for ID:', decoded.userId);
        return res.status(401).json({ message: 'User not found' });
      }
      
      console.log('User authenticated:', req.user.email);
      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    console.log('No authorization header or invalid format');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `User role ${req.user.role} is not authorized to access this route` });
    }
    next();
  };
};

module.exports = { generateAuthTokens, protect, authorize };