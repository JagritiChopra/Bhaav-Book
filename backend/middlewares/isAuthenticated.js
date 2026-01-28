import User from '../models/user.model.js';
import admin from '../utils/firebase.js'; // your initialized Firebase Admin SDK

const isAuthenticated = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No token provided in Authorization header');
    return res.status(401).json({
      message: 'No token provided',
      success: false,
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(token);
    const firebaseUid = decodedToken.uid;
    // Find user in DB by Firebase UID
    const user = await User.findOne({ firebaseUID: firebaseUid.trim() });
    if (!user) {
      return res.status(401).json({
        message: 'User not found',
        success: false,
      });
    }

    req.user = user; // attach full user object for downstream use
    next();

  } catch (error) {
    console.error('Firebase Auth Middleware Error:', error);
    return res.status(401).json({
      message: 'Invalid or expired token',
      success: false,
    });
  }
};

export default isAuthenticated;