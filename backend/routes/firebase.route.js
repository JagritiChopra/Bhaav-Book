import express from 'express';
import admin from '../utils/firebase.js';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

const router = express.Router();


router.post("/firebase-email-signup", async (req, res) => {
  const { idToken, fullName } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email } = decodedToken;

    // Check if user already exists
    let user = await User.findOne({ firebaseUID: uid });
    if (!user) {
      user = await User.create({
        firebaseUID: uid,
        email,
        fullName: fullName,
        // any other fields like createdAt, etc.
      });
    }

    res.status(200).json({ message: "User saved to DB", user });
  } catch (error) {
    console.error("Error verifying ID token:", error);
    res.status(401).json({ message: "Invalid Firebase ID token" });
  }
});

router.post('/firebase-login', async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    return res.status(400).json({ success: false, message: 'ID token is required' });
  }

  try {
    // Verify token with Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email not found in Firebase token',
      });
    }

    // Fetch user record from Firebase to get accurate emailVerified flag
    const firebaseUserRecord = await admin.auth().getUser(uid);

    if (!firebaseUserRecord.emailVerified) {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email before logging in',
      });
    }

    // Find user by firebaseUID or email fallback
    let user = (await User.findOne({ firebaseUID: uid })) || (await User.findOne({ email }));

    if (!user) {
      // Create new user with firebase details
      user = new User({
        firebaseUID: uid,
        email,
        fullName: name || email.split('@')[0],
        profile: {
          avatar: picture || undefined,
        },
        isEmailVerified: true,
      });
    } else {
      // Update user info if needed
      if (!user.firebaseUID) user.firebaseUID = uid;
      if (!user.isEmailVerified) user.isEmailVerified = true;
      if (picture && user.profile?.avatar !== picture) {
        user.profile = user.profile || {};
        user.profile.avatar = picture;
      }
      if (name && user.fullName !== name) user.fullName = name;
    }

    // Update last login timestamp
    user.lastLogin = new Date();

    await user.save();

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET not set in environment variables');
    }

    // Sign JWT with user ID
    const token = jwt.sign({ id: user._id.toString() }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // Return safe user info
    const safeUser = {
      id: user._id,
      email: user.email,
      fullName: user.fullName,
      profile: user.profile,
      isEmailVerified: user.isEmailVerified,
    };

    res.status(200).json({ success: true, token, user: safeUser });
  } catch (error) {
    console.error('Error during Firebase login:', error);
    res.status(401).json({ success: false, message: 'Unauthorized' });
  }
});



router.post('/firebase-google-auth', async (req, res) => {
  const { idToken } = req.body;
  // console.log(idToken);

  if (!idToken) {
    return res.status(400).json({ success: false, message: 'ID token is required' });
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email not found in Firebase token',
      });
    }

    let user = await User.findOne({ firebaseUID: uid });

    if (!user) {
      user = new User({
        firebaseUID: uid,
        email,
        fullName: name || email.split('@')[0],
        profile: { avatar: picture },
        isEmailVerified: true,
      });
      await user.save();
    }

    // Respond success
    res.status(200).json({ success: true, message: 'User authenticated', userId: user._id });
  } catch (error) {
    console.error('Error verifying Firebase ID token:', error);
    res.status(401).json({ success: false, message: 'Invalid ID token' });
  }
});

export default router;
