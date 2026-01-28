import Journal from "../models/journal.model.js";
import cloudinary from "cloudinary";
import getDataUri from "../utils/datauri.js";
import User from "../models/user.model.js";
import moment from "moment-timezone";

// =================== CREATE JOURNAL ENTRY ===================
export const createJournalEntry = async (req, res) => {
  try {
    const {
      title, // Added title field
      emotions,
      content,
      currentActivity,
      tags,
      location,
      moodRating,
      sentiment,
      entryType,
      weather,
      insights,
    } = req.body;

    const userId = req.user.id;

    // Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }

    // Validate title length
    if (title.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: "Title must be at least 3 characters long",
      });
    }

    if (title.trim().length > 200) {
      return res.status(400).json({
        success: false,
        message: "Title must not exceed 200 characters",
      });
    }

    // Parse JSON strings for arrays (from FormData)
    let parsedEmotions = [];
    let parsedTags = [];

    try {
      if (emotions && typeof emotions === 'string') {
        parsedEmotions = JSON.parse(emotions);
      } else if (Array.isArray(emotions)) {
        parsedEmotions = emotions;
      }
    } catch (e) {
      console.log('Error parsing emotions:', e);
    }

    try {
      if (tags && typeof tags === 'string') {
        parsedTags = JSON.parse(tags);
      } else if (Array.isArray(tags)) {
        parsedTags = tags;
      }
    } catch (e) {
      console.log('Error parsing tags:', e);
    }

    // Upload photo
    let photoUrl = "";
    if (req.files?.photo?.[0]) {
      const photoUri = getDataUri(req.files.photo[0]);
      const cloudRes = await cloudinary.uploader.upload(photoUri.content, {
        folder: "journal_photos",
      });
      photoUrl = cloudRes.secure_url;
    }

    // Save new journal entry
    const newEntry = new Journal({
      user: userId,
      title: title.trim(), // Added title field with trim
      emotions: parsedEmotions,
      content: content || "",
      currentActivity: currentActivity || "",
      tags: parsedTags,
      location: location || "",
      moodRating: moodRating ? parseInt(moodRating) : undefined,
      sentiment: sentiment || "neutral",
      entryType: entryType || "daily",
      weather: weather || "",
      insights: insights || "",
      photo: photoUrl,
    });

    await newEntry.save();

    // === Update user profile stats ===
    const user = await User.findById(userId);
    if (user && user.profile) {
      const timezone = user.profile?.timezone || "Asia/Kolkata";
      const today = moment().tz(timezone).startOf("day");

      const lastLogged = user.profile?.lastLoggedDate
        ? moment(user.profile.lastLoggedDate).tz(timezone).startOf("day")
        : null;

      let newStreak = 1;

      if (lastLogged) {
        const diffDays = today.diff(lastLogged, "days");

        if (diffDays === 0) {
          newStreak = user.profile.streak || 1;
        } else if (diffDays === 1) {
          newStreak = (user.profile.streak || 0) + 1;
        } else {
          newStreak = 1; // Break in streak
        }
      }

      user.profile.entryCount = (user.profile.entryCount || 0) + 1;
      user.profile.streak = newStreak;
      user.profile.lastLoggedDate = today.toDate();

      await user.save();
    }

    res.status(201).json({
      success: true,
      message: "Journal entry created successfully",
      journal: newEntry,
    });
  } catch (err) {
    console.error("Create Entry Error:", err);
    
    // Handle mongoose validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create journal entry",
      error: err.message,
    });
  }
};

// =================== GET ALL JOURNAL ENTRIES ===================
export const getJournalEntries = async (req, res) => {
  try {
    const userId = req.user.id;
    const entries = await Journal.find({ user: userId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: entries.length,
      journals: entries,
    });
  } catch (err) {
    console.error("Get Entries Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch journal entries",
      error: err.message,
    });
  }
};

// =================== GET SINGLE JOURNAL ENTRY ===================
export const getJournalEntryById = async (req, res) => {
  try {
    const userId = req.user.id;
    const entryId = req.params.id;

    const entry = await Journal.findOne({ _id: entryId, user: userId });
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Journal entry not found",
      });
    }

    res.status(200).json({
      success: true,
      journal: entry,
    });
  } catch (err) {
    console.error("Get Entry Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch journal entry",
      error: err.message,
    });
  }
};

// =================== UPDATE JOURNAL ENTRY ===================
export const updateJournalEntry = async (req, res) => {
  try {
    const userId = req.user.id;
    const entryId = req.params.id;

    const {
      title, // Added title field
      emotions,
      content,
      currentActivity,
      tags,
      location,
      moodRating,
      sentiment,
      entryType,
      weather,
      insights,
    } = req.body;

    const entry = await Journal.findOne({ _id: entryId, user: userId });
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Journal entry not found or not authorized",
      });
    }

    // Validate required fields if they are being updated
    if (title !== undefined) {
      if (!title || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Title is required",
        });
      }

      if (title.trim().length < 3) {
        return res.status(400).json({
          success: false,
          message: "Title must be at least 3 characters long",
        });
      }

      if (title.trim().length > 200) {
        return res.status(400).json({
          success: false,
          message: "Title must not exceed 200 characters",
        });
      }
    }

    if (content !== undefined && (!content || !content.trim())) {
      return res.status(400).json({
        success: false,
        message: "Content is required",
      });
    }

    // Parse JSON strings for arrays (from FormData)
    let parsedEmotions = entry.emotions;
    let parsedTags = entry.tags;

    try {
      if (emotions && typeof emotions === 'string') {
        parsedEmotions = JSON.parse(emotions);
      } else if (Array.isArray(emotions)) {
        parsedEmotions = emotions;
      }
    } catch (e) {
      console.log('Error parsing emotions:', e);
    }

    try {
      if (tags && typeof tags === 'string') {
        parsedTags = JSON.parse(tags);
      } else if (Array.isArray(tags)) {
        parsedTags = tags;
      }
    } catch (e) {
      console.log('Error parsing tags:', e);
    }

    // Update photo if uploaded
    if (req.files?.photo?.[0]) {
      const photoUri = getDataUri(req.files.photo[0]);
      const cloudRes = await cloudinary.uploader.upload(photoUri.content, {
        folder: "journal_photos",
      });
      entry.photo = cloudRes.secure_url;
    }

    // Update fields - including title
    if (title !== undefined) entry.title = title.trim();
    entry.emotions = parsedEmotions;
    entry.content = content !== undefined ? content : entry.content;
    entry.currentActivity = currentActivity !== undefined ? currentActivity : entry.currentActivity;
    entry.tags = parsedTags;
    entry.location = location !== undefined ? location : entry.location;
    entry.moodRating = moodRating !== undefined ? (moodRating ? parseInt(moodRating) : undefined) : entry.moodRating;
    entry.sentiment = sentiment !== undefined ? sentiment : entry.sentiment;
    entry.entryType = entryType !== undefined ? entryType : entry.entryType;
    entry.weather = weather !== undefined ? weather : entry.weather;
    entry.insights = insights !== undefined ? insights : entry.insights;

    await entry.save();

    res.status(200).json({
      success: true,
      message: "Journal entry updated successfully",
      journal: entry,
    });
  } catch (err) {
    console.error("Update Entry Error:", err);
    
    // Handle mongoose validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update journal entry",
      error: err.message,
    });
  }
};

// =================== DELETE JOURNAL ENTRY ===================
export const deleteJournalEntry = async (req, res) => {
  try {
    const userId = req.user.id;
    const entryId = req.params.id;

    const entry = await Journal.findOneAndDelete({ _id: entryId, user: userId });
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: "Journal entry not found or not authorized",
      });
    }

    // Update user stats after deletion
    const user = await User.findById(userId);
    if (user && user.profile && user.profile.entryCount > 0) {
      user.profile.entryCount = user.profile.entryCount - 1;
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "Journal entry deleted successfully",
    });
  } catch (err) {
    console.error("Delete Entry Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete journal entry",
      error: err.message,
    });
  }
};

// =================== MIGRATION FUNCTION FOR EXISTING ENTRIES ===================
// Run this once to add default titles to existing entries without titles
export const migrateExistingEntries = async (req, res) => {
  try {
    const result = await Journal.updateMany(
      { title: { $exists: false } },
      { 
        $set: { 
          title: function() {
            return `Entry from ${this.createdAt ? this.createdAt.toDateString() : new Date().toDateString()}`;
          }
        }
      }
    );

    res.status(200).json({
      success: true,
      message: `Migration completed. Updated ${result.modifiedCount} entries.`,
      modifiedCount: result.modifiedCount,
    });
  } catch (err) {
    console.error("Migration Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to migrate existing entries",
      error: err.message,
    });
  }
};