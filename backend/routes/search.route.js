// routes/search.js
import express from 'express';
import User from '../models/user.model.js';

const router = express.Router();

// Search users by name or email (no auth required)
router.get('/users', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.json({ users: [] });
    }

    const searchTerm = q.trim();
    
    // Check if it's an email search (contains @)
    const isEmailSearch = searchTerm.includes('@');
    
    let searchQuery;
    
    if (isEmailSearch) {
      // Exact email match
      searchQuery = {
        email: { $regex: `^${searchTerm}$`, $options: 'i' }
      };
    } else {
      // Search by name only
      searchQuery = {
        fullName: { $regex: searchTerm, $options: 'i' }
      };
    }

    const users = await User.find(searchQuery)
      .select('fullName email profile.avatar')
      .limit(10) // Limit results
      .lean();

    // Format response
    const formattedUsers = users.map(user => ({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      profile: {
        avatar: user.profile?.avatar
      }
    }));

    res.json({ users: formattedUsers });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Search failed' });
  }
});

export default router;