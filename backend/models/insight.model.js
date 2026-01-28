import mongoose from 'mongoose';

const insightSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sentiment: {
    type: String,
    enum: ['positive', 'neutral', 'negative'],
    required: true,
    trim: true,
  },
  summaryType: {
    type: String,
    enum: ['short', 'descriptive'],
    default: 'descriptive',
  },
  emotions: {
    type: [String],
    default: [],
  },
  insight: {
    type: String,
    required: true,
    trim: true,
  },
  Mistakes: {
    type: String,
    default: "No significant mistakes identified during this period.",
    trim: true,
  },
  suggestion: {
    type: String,
    required: true,
    trim: true,
  },
  isUserStuck: {
    type: String,
    default: "No, You are not stuck with anything.",
    trim: true,
  },
  waysToGetUnstuck: {
    type: String,
    default: "Continue maintaining your current positive state.",
    trim: true,
  },
  journalCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  daysAnalyzed: {
    type: Number,
    default: 7,
  },
  dateFrom: {
    type: Date,
    required: true,
  },
  dateTo: {
    type: Date,
    required: true,
  },
  relatedJournals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Journal',
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  moodInImage: {
    type: String,
    default: "Image not provided",
    trim: true,
  },
  Attachment: {
    type: String,
    default: "Attachment not provided",
    trim: true,
  },
});

const Insight = mongoose.model('Insight', insightSchema);
export default Insight;