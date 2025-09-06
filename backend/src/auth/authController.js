const admin = require('../config/firebase');
const User = require('../models/User');
const { generateAuthTokens } = require('./authMiddleware');

const registerUser = async (req, res) => {
  const { email, password, displayName, photoURL } = req.body;

  try {
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName,
      photoURL,
    });

    const user = await User.create({
      firebaseUid: userRecord.uid,
      email: userRecord.email,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
    });

    const { accessToken, refreshToken } = generateAuthTokens(user);

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        _id: user._id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  const { idToken } = req.body; // Firebase ID token from client-side

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const firebaseUid = decodedToken.uid;

    let user = await User.findOne({ firebaseUid });

    if (!user) {
      // If user doesn't exist in our DB, create them (e.g., first time login with Google)
      user = await User.create({
        firebaseUid: decodedToken.uid,
        email: decodedToken.email,
        displayName: decodedToken.name,
        photoURL: decodedToken.picture,
      });
    }

    const { accessToken, refreshToken } = generateAuthTokens(user);

    res.status(200).json({
      message: 'Login successful',
      user: {
        _id: user._id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
      },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(401).json({ message: 'Authentication failed', error: error.message });
  }
};

module.exports = { registerUser, loginUser };