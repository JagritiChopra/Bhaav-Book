import Journal from "../models/journal.model.js";
import User from "../models/user.model.js";
import moment from "moment";
import { analyzeJournalWithGemini } from "../utils/geminiAi.js";

const frequencyToDays = {
  daily: 1,
  weekly: 7,
  biweekly: 14,
  monthly: 30,
};

console.log("Heyy there")

export const generateCombinedUserInsight = async (userId, pastDaysInput, isShort = false) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  let pastDays;
  if (pastDaysInput) {
    pastDays = Math.min(pastDaysInput, 30);
  } else {
    const frequency = user.profile?.insightFrequency || 'weekly';
    pastDays = frequencyToDays[frequency] || 7;
  }
  let journals;

if (pastDaysInput) {
  const fromDate = moment().subtract(pastDays, "days").toDate();
  journals = await Journal.find({
    user: userId,
    date: { $gte: fromDate },
  }).sort({ date: 1 });
} else {
  // If no days provided → just take the latest journals
  journals = await Journal.find({ user: userId })
    .sort({ date: -1 })
    .limit(30)
    .sort({ date: 1 });
}


  // const fromDate = moment().subtract(pastDays, "days").toDate();

  // const journals = await Journal.find({
  //   user: userId,
  //   date: { $gte: fromDate },
  // }).sort({ date: 1 });

  if (journals.length === 0) {
    throw new Error("No journal entries found.");
  }
  //   if (journals.length >= 0 && journals.length <= 7  ) {
  //   throw new Error("Ohhhhhhhhhhhhhhh GODDDDDDDD.");
  // }

  const combinedText = journals
    .map(j =>
      `Date: ${j.date.toDateString()}
        User: ${j.user?.name || 'Anonymous'}

        Content: ${j.content}

        Mood Rating: ${j.moodRating ?? 'N/A'}
        Emotions: ${j.emotions?.join(", ") || 'None'}
        Sentiment: ${j.sentiment || 'Not analyzed'}
        Activity: ${j.currentActivity || 'Not specified'}
        Tags: ${j.tags?.join(", ") || 'None'}
        Location: ${j.location || 'Not specified'}
        Weather: ${j.weather || 'Not recorded'}
        Entry Type: ${j.entryType || 'Not labeled'}
        Photo URL: ${j.photo || 'None'}
        Attachment: ${j.attachment || 'None'}
        Insights: ${j.insights || 'No additional insights'}`
    )
    .join("\n\n");

  const fullInput = combinedText;

  const imageUrls = journals.flatMap(j => Array.isArray(j.photo) ? j.photo : j.photo ? [j.photo] : []);
  const attachments = journals.flatMap(j => Array.isArray(j.attachment) ? j.attachment : j.attachment ? [j.attachment] : []);

  const responseText = await analyzeJournalWithGemini(fullInput, imageUrls, attachments, isShort);

  const geminiRawResponse = responseText.trim()
  .replace(/^```json/, '')  // Remove starting ```json
  .replace(/```$/, '');      // Remove ending ```
  let geminiInsight;

  console.log("Gemini response:", geminiRawResponse);
  try {
    geminiInsight = typeof geminiRawResponse === "string"
      ? JSON.parse(geminiRawResponse)
      : geminiRawResponse;
  } catch (e) {
    throw new Error("Failed to parse Gemini response as JSON");
  }

  if (
    !geminiInsight ||
    typeof geminiInsight !== "object" ||
    typeof geminiInsight.insight !== "string" ||
    !geminiInsight.insight.trim()
  ) {
    throw new Error("Gemini insight generation failed.");
  }

  user.profile.lastInsightGenerated = new Date();
  await user.save();

  return {
    geminiInsight,
    journalCount: journals.length,
    daysAnalyzed: pastDays,
    journals,
  };
};
