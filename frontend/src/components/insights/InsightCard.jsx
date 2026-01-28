// src/components/insights/InsightCard.jsx
import { 
  Calendar, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Clock,
  BookOpen,
  Lightbulb,
  ArrowRight,
  AlertCircle,
  Paperclip
} from 'lucide-react';

export default function InsightCard({ insight, onClick, darkMode }) {
  const getSentimentIcon = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'negative':
        
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-yellow-500" />;
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

  const getBorderColor = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'border-green-200 dark:border-green-800';
      case 'negative':
        return 'border-red-200 dark:border-red-800';
      default:
        return darkMode ? 'border-gray-700' : 'border-gray-200';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div
      onClick={onClick}
      className={`relative group cursor-pointer p-4 transition-all duration-300 hover:shadow-xl rounded-xl border ${getBorderColor(insight.sentiment)} ${
        darkMode 
          ? 'bg-slate-800 hover:bg-slate-750 hover:border-opacity-80' 
          : 'bg-white hover:bg-gray-50 hover:border-opacity-80 shadow-md'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className={`p-2 rounded-lg bg-gradient-to-r ${getSentimentColor(insight.sentiment)} shadow-sm`}>
            <Lightbulb className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-1 mb-1">
              {getSentimentIcon(insight.sentiment)}
              <span className={`text-sm font-semibold capitalize ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                {insight.sentiment} Insight
              </span>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <div className="flex items-center space-x-1">
                <Calendar className={`w-3 h-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {formatDate(insight.dateFrom)} - {formatDate(insight.dateTo)}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          <Clock className={`w-3 h-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {formatDate(insight.createdAt)}
          </span>
        </div>
      </div>

      {/* Emotions */}
      {insight.emotions && insight.emotions.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {insight.emotions.slice(0, 3).map((emotion, index) => (
              <span
                key={index}
                className={`px-2 py-1 rounded-md text-xs font-medium ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {emotion}
              </span>
            ))}
            {insight.emotions.length > 3 && (
              <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                darkMode 
                  ? 'bg-gray-700 text-gray-400' 
                  : 'bg-gray-100 text-gray-500'
              }`}>
                +{insight.emotions.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Content Preview */}
      <div className="space-y-3 mb-4">
        <div>
          <h3 className={`font-semibold text-sm mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Key Insight
          </h3>
          <p className={`text-xs leading-relaxed line-clamp-2 ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {insight.insight}
          </p>
        </div>

        <div>
          <h4 className={`font-medium text-sm mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Suggestion
          </h4>
          <p className={`text-xs leading-relaxed line-clamp-1 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            {insight.suggestion}
          </p>
        </div>
      </div>

      {/* Mistakes indicator */}
      {insight.Mistakes && insight.Mistakes !== "No significant mistakes identified during this period." && (
        <div className={`mb-3 p-2 rounded-md border-l-2 ${
          darkMode 
            ? 'bg-red-900/20 border-red-600' 
            : 'bg-red-50 border-red-400'
        }`}>
          <div className="flex items-center space-x-1">
            <AlertCircle className={`w-3 h-3 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />
            <p className={`text-xs font-medium ${
              darkMode ? 'text-red-300' : 'text-red-700'
            }`}>
              Areas for improvement identified
            </p>
          </div>
        </div>
      )}

      {/* Stuck indicator */}
      {insight.isUserStuck && insight.isUserStuck.startsWith("Yes") && (
        <div className={`mb-3 p-2 rounded-md border-l-2 ${
          darkMode 
            ? 'bg-orange-900/20 border-orange-600' 
            : 'bg-orange-50 border-orange-400'
        }`}>
          <p className={`text-xs font-medium ${
            darkMode ? 'text-orange-300' : 'text-orange-700'
          }`}>
            ⚠️ Feeling stuck
          </p>
        </div>
      )}

      {/* Attachment indicator */}
      {insight.Attachment && insight.Attachment !== "Attachment not provided" && (
        <div className={`mb-3 p-2 rounded-md ${
          darkMode 
            ? 'bg-blue-900/20' 
            : 'bg-blue-50'
        }`}>
          <div className="flex items-center space-x-1">
            <Paperclip className={`w-3 h-3 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <p className={`text-xs font-medium ${
              darkMode ? 'text-blue-300' : 'text-blue-700'
            }`}>
              Has attachment
            </p>
          </div>
        </div>
      )}

      {/* Read More Button */}
      <div className="flex justify-end">
        <button className={`inline-flex items-center px-3 py-1.5 text-xs font-medium transition-all duration-200 rounded-md border group-hover:shadow-sm ${
          darkMode 
            ? 'text-blue-400 border-blue-600 hover:bg-blue-900/20 hover:border-blue-500' 
            : 'text-blue-600 border-blue-300 hover:bg-blue-50 hover:border-blue-400'
        }`}>
          Read More
          <ArrowRight className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Subtle hover effect */}
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${getSentimentColor(insight.sentiment)} opacity-0 group-hover:opacity-[0.02] transition-opacity duration-300 pointer-events-none`}></div>
    </div>
  );  
}
