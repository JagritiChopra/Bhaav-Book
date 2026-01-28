import mongoose from "mongoose";

const journalSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true, minlength: 3, maxlength: 200 }, // Added mandatory title field
    date: { type: Date, default: Date.now },
    emotions: { type: [String], default: [] }, // Emotions like "happy", "sad", etc.
    content: { type: String, required: true }, // The main journal content
    currentActivity: {
        type: String,
        trim: true,
        default: "", // e.g., "Studying", "Walking", "Having coffee", etc.
    },      
    tags: [{ type: String }], // Tags for categorizing the entry
    location: { type: String }, // Location where the entry was created
    moodRating: { type: Number, min: 1, max: 10 }, // Mood rating from 1 to 10
    sentiment: { type: String, enum: ['positive', 'neutral', 'negative'] }, // Sentiment analysis
    entryType: { type: String, enum: ['gratitude', 'reflection', 'dream', 'daily'] }, // Type of entry
    attachment: { type: String }, // URL of attachment (media, file)
    weather: { type: String }, // Weather at the time of entry
    insights: { type: String }, // Additional reflections or insights about the entry
    photo: { type: String }, // URL of the user's photo (to check emotions)
  },
  { timestamps: true }
);

const Journal = mongoose.model("Journal", journalSchema);
export default Journal;