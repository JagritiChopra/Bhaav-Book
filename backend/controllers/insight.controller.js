// controllers/insight.controller.js
import Insight from '../models/insight.model.js';
import { generateCombinedUserInsight } from '../services/combinedInsight.service.js';

export const createInsight = async (req, res) => {
  try {
    const userId = req.user._id;
    const { pastDays, isShort } = req.body;

    const { geminiInsight = {}, journalCount, daysAnalyzed, journals } =
      await generateCombinedUserInsight(userId, pastDays, isShort);

    const today = new Date();
    const fromDate = new Date(today.getTime() - daysAnalyzed * 24 * 60 * 60 * 1000);

    // Normalize the geminiInsight data to ensure all fields are present
    const normalizedInsight = {
      sentiment: geminiInsight.sentiment || 'neutral',
      emotions: geminiInsight.emotions || [],
      insight: geminiInsight.insight || "No specific insights available for this period.",
      Mistakes: geminiInsight.Mistakes || "No significant mistakes identified during this period.",
      suggestion: geminiInsight.suggestion || "Keep up the good work and continue your current practices.",
      isUserStuck: geminiInsight.isUserStuck || "No, You are not stuck with anything.",
      waysToGetUnstuck: geminiInsight.waysToGetUnstuck || "Continue maintaining your current positive state.",
      moodInImage: geminiInsight.moodInImage || "Image not provided",
      Attachment: geminiInsight.Attachment || "Attachment not provided"
    };

    const savedInsight = await Insight.create({
      user: userId,
      sentiment: normalizedInsight.sentiment,
      summaryType: isShort ? 'short' : 'descriptive',
      emotions: normalizedInsight.emotions,
      insight: normalizedInsight.insight,
      Mistakes: normalizedInsight.Mistakes,
      suggestion: normalizedInsight.suggestion,
      isUserStuck: normalizedInsight.isUserStuck,
      waysToGetUnstuck: normalizedInsight.waysToGetUnstuck,
      journalCount,
      daysAnalyzed,
      dateFrom: fromDate,
      dateTo: today,
      relatedJournals: journals,
      createdAt: today,
      moodInImage: normalizedInsight.moodInImage,
      Attachment: normalizedInsight.Attachment,
    });

    return res.status(201).json({
      success: true,
      data: savedInsight,
    });
  } catch (error) {
    console.error("Error creating insight:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create insight",
    });
  }
};

export const getAllInsights = async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 10 } = req.query;

    const insights = await Insight.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('relatedJournals', 'title createdAt');

    const total = await Insight.countDocuments({ user: userId });

    // Normalize insights data to ensure all fields are present
    const normalizedInsights = insights.map(insight => {
      const insightObj = insight.toObject();
      return {
        ...insightObj,
        Mistakes: insightObj.Mistakes || "No significant mistakes identified during this period.",
        Attachment: insightObj.Attachment || "Attachment not provided",
        moodInImage: insightObj.moodInImage || "Image not provided",
        isUserStuck: insightObj.isUserStuck || "No, You are not stuck with anything.",
        waysToGetUnstuck: insightObj.waysToGetUnstuck || "Continue maintaining your current positive state.",
        emotions: insightObj.emotions || [],
        insight: insightObj.insight || "No specific insights available for this period.",
        suggestion: insightObj.suggestion || "Keep up the good work and continue your current practices."
      };
    });

    return res.status(200).json({
      success: true,
      data: normalizedInsights,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      } 
    });
  } catch (error) {
    console.error("Error fetching insights:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch insights",
    });
  }
};

export const getInsightById = async (req, res) => {
  try {
    const userId = req.user._id;
    const insightId = req.params.id;

    const insight = await Insight.findOne({ _id: insightId, user: userId });

    if (!insight) {
      return res.status(404).json({
        success: false,
        message: "Insight not found",
      });
    }

    // Normalize insight data to ensure all fields are present
    const insightObj = insight.toObject();
    const normalizedInsight = {
      ...insightObj,
      Mistakes: insightObj.Mistakes || "No significant mistakes identified during this period.",
      Attachment: insightObj.Attachment || "Attachment not provided",
      moodInImage: insightObj.moodInImage || "Image not provided",
      isUserStuck: insightObj.isUserStuck || "No, You are not stuck with anything.",
      waysToGetUnstuck: insightObj.waysToGetUnstuck || "Continue maintaining your current positive state.",
      emotions: insightObj.emotions || [],
      insight: insightObj.insight || "No specific insights available for this period.",
      suggestion: insightObj.suggestion || "Keep up the good work and continue your current practices."
    };

    return res.status(200).json({
      success: true,
      data: normalizedInsight,
    });
  } catch (error) {
    console.error("Error fetching insight by id:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch insight",
    });
  }
};

export default {
  createInsight,
  getAllInsights,
  getInsightById
};
