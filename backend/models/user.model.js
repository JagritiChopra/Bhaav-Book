import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, unique: true, sparse: true },

  firebaseUID: { type: String, unique: true, sparse: true }, 

  profile: {
    avatar: String,
    bio: String,
    entryCount: { type: Number, default: 0 },
    streak: { type: Number, default: 0 },
    lastLoggedDate: Date,
    timezone: String,
    dob: { type: Date, default: null },
    gender: { type: String},
    showGender: { type: Boolean, default: false },
    showDob: { type: Boolean, default: true },
    preferredTone: { type: String, default: "neutral" },
    preferredLanguage: { type: String, default: "en" },
    emotionStyle: { type: String, default: "emoji" },
    timezone: { type: String, default: "IST (GMT+5:30)" },

    insightFrequency: { type: String, enum: ['daily', 'weekly', 'biweekly', 'monthly'], default: 'weekly' },
    lastInsightGenerated: { type: Date },
  },
  
  isEmailVerified: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },

}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;