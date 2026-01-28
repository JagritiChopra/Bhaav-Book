// src/components/insights/InsightDetail.jsx
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { 
  X, 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
  AlertCircle,
  Paperclip,
  Image as ImageIcon
} from 'lucide-react';

export default function InsightDetail({ insight, onClose, darkMode }) {
  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="w-6 h-6 text-green-500" />;
      case 'negative':
        return <TrendingDown className="w-6 h-6 text-red-500" />;
      default:
        return <Minus className="w-6 h-6 text-yellow-500" />;
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'from-green-500 to-emerald-400';
      case 'negative':
        return 'from-red-500 to-rose-400';
      default:
        return 'from-yellow-500 to-amber-400';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div 
          className={`w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden ${
            darkMode ? 'bg-slate-800' : 'bg-white'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} flex-shrink-0`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${getSentimentColor(insight.sentiment)}`}>
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    {getSentimentIcon(insight.sentiment)}
                    <h2 className={`text-xl font-bold capitalize ${
                      darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      {insight.sentiment} Insight
                    </h2>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0">
                    <div className="flex items-center space-x-1">
                      <Calendar className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatDate(insight.dateFrom)} - {formatDate(insight.dateTo)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {insight.journalCount} entries analyzed
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                }`}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="space-y-8">
              {/* Emotions */}
              {insight.emotions && insight.emotions.length > 0 && (
                <div>
                  <h3 className={`text-lg font-semibold mb-4 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Detected Emotions
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {insight.emotions.map((emotion, index) => (
                      <span
                        key={index}
                        className={`px-4 py-2 rounded-full text-sm font-medium ${
                          darkMode 
                            ? 'bg-gray-700 text-gray-300' 
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {emotion}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Main Insight */}
              <div>
                <h3 className={`text-lg font-semibold mb-4 flex items-center ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <Lightbulb className="w-5 h-5 mr-2 text-blue-500" />
                  Key Insight
                </h3>
                <div className={`p-6 rounded-xl ${
                  darkMode ? 'bg-slate-700/50' : 'bg-gray-50'
                }`}>
                  <p className={`text-base leading-relaxed ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {insight.insight}
                  </p>
                </div>
              </div>

              {/* Mistakes Section */}
              {insight.Mistakes && insight.Mistakes !== "No significant mistakes identified during this period." && (
                <div>
                  <h3 className={`text-lg font-semibold mb-4 flex items-center ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                    Areas for Improvement
                  </h3>
                  <div className="p-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                    <p className={`text-base leading-relaxed ${
                      darkMode ? 'text-red-200' : 'text-red-800'
                    }`}>
                      {insight.Mistakes}
                    </p>
                  </div>
                </div>
              )}

              {/* Suggestion */}
              <div>
                <h3 className={`text-lg font-semibold mb-4 flex items-center ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                  Personalized Suggestion
                </h3>
                <div className={`p-6 rounded-xl ${
                  darkMode ? 'bg-slate-700/50' : 'bg-gray-50'
                }`}>
                  <p className={`text-base leading-relaxed ${
                    darkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {insight.suggestion}
                  </p>
                </div>
              </div>

              {/* Stuck Section */}
              {insight.isUserStuck && insight.isUserStuck.startsWith("Yes") && insight.waysToGetUnstuck && (
                <div>
                  <h3 className={`text-lg font-semibold mb-4 flex items-center ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                    Ways to Get Unstuck
                  </h3>
                  <div className="p-6 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                    <p className={`text-base leading-relaxed ${
                      darkMode ? 'text-orange-200' : 'text-orange-800'
                    }`}>
                      {insight.waysToGetUnstuck}
                    </p>
                  </div>
                </div>
              )}

              {/* Mood Image */}
              {insight.moodInImage && insight.moodInImage !== "Image not provided" && (
                <div>
                  <h3 className={`text-lg font-semibold mb-4 flex items-center ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    <ImageIcon className="w-5 h-5 mr-2 text-purple-500" />
                    Mood Visualization
                  </h3>
                  <div className={`p-6 rounded-xl text-center ${
                    darkMode ? 'bg-slate-700/50' : 'bg-gray-50'
                  }`}>
                    <p className={`text-2xl mb-2`}>{insight.moodInImage}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Visual representation of your overall mood
                    </p>
                  </div>
                </div>
              )}

              {/* Attachment Section */}
              {insight.Attachment && insight.Attachment !== "Attachment not provided" && (
                <div>
                  <h3 className={`text-lg font-semibold mb-4 flex items-center ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    <Paperclip className="w-5 h-5 mr-2 text-blue-500" />
                    Attachment Analysis
                  </h3>
                  <div className={`p-6 rounded-xl ${
                    darkMode ? 'bg-slate-700/50' : 'bg-gray-50'
                  }`}>
                    <p className={`text-base leading-relaxed ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {insight.Attachment}
                    </p>
                  </div>
                </div>
              )}

              {/* Analysis Summary */}
              <div className={`p-6 rounded-xl border ${
                darkMode 
                  ? 'bg-slate-700/30 border-gray-600' 
                  : 'bg-blue-50 border-blue-200'
              }`}>
                <h3 className={`text-lg font-semibold mb-4 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Analysis Summary
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${
                      darkMode ? 'text-blue-400' : 'text-blue-600'
                    }`}>
                      {insight.daysAnalyzed}
                    </div>
                    <div className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Days Analyzed
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${
                      darkMode ? 'text-green-400' : 'text-green-600'
                    }`}>
                      {insight.journalCount}
                    </div>
                    <div className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Journal Entries
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${
                      darkMode ? 'text-purple-400' : 'text-purple-600'
                    }`}>
                      {insight.emotions?.length || 0}
                    </div>
                    <div className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Emotions Detected
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold capitalize ${
                      insight.sentiment === 'positive' ? 'text-green-500' :
                      insight.sentiment === 'negative' ? 'text-red-500' :
                      'text-yellow-500'
                    }`}>
                      {insight.sentiment}
                    </div>
                    <div className={`text-sm ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      Overall Sentiment
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}