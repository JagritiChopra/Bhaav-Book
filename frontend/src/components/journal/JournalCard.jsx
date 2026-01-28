import { motion } from 'framer-motion';
import { Calendar, Edit, Trash2, Tag, MapPin, Activity, ArrowRight } from 'lucide-react';

export default function JournalCard({ 
  journal, 
  isSelected, 
  isSelectionMode, 
  isChecked, 
  onClick, 
  onEdit, 
  onDelete, 
  darkMode 
}) {
  const emotionEmojis = {
    happy: '😊', sad: '😢', excited: '🤩', anxious: '😰', content: '😌', stressed: '😫',
    contemplative: '🤔', grateful: '🙏', angry: '😠', peaceful: '😇', confused: '😕', motivated: '💪'
  };

  const sentimentEmojis = { positive: '😊', negative: '😔', neutral: '😐' };
  const typeIcons = { gratitude: '🙏', reflection: '🤔', dream: '💭', daily: '📅' };

  const getTypeColor = (type) => {
    switch (type) {
      case 'gratitude':
        return 'from-green-500 to-emerald-400';
      case 'reflection':
        return 'from-blue-500 to-sky-400';
      case 'dream':
        return 'from-purple-500 to-indigo-400';
      default:
        return 'from-gray-500 to-slate-400';
    }
  };

  const getBorderColor = (type) => {
    if (isSelectionMode && isChecked) {
      return 'border-red-200 dark:border-red-800';
    }
    if (isSelected && !isSelectionMode) {
      return 'border-blue-200 dark:border-blue-800';
    }
    
    switch (type) {
      case 'gratitude':
        return 'border-green-200 dark:border-green-800';
      case 'reflection':
        return 'border-blue-200 dark:border-blue-800';
      case 'dream':
        return 'border-purple-200 dark:border-purple-800';
      default:
        return darkMode ? 'border-gray-700' : 'border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const truncateContent = (content, maxLength = 120) => {
    if (!content) return 'No content available';
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  const truncateTitle = (title, maxLength = 40) => {
    if (!title) return 'Untitled Entry';
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  };

  return (
    <motion.div
      onClick={onClick}
      className={`relative group cursor-pointer p-4 transition-all duration-300 hover:shadow-xl rounded-xl border ${getBorderColor(journal.entryType)} ${
        darkMode 
          ? 'bg-slate-800 hover:bg-slate-750 hover:border-opacity-80' 
          : 'bg-white hover:bg-gray-50 hover:border-opacity-80 shadow-md'
      } h-[320px] flex flex-col`} // Reduced height from 480px to 320px
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Selection Mode Checkbox */}
      {isSelectionMode && (
        <div className="flex items-center mb-3 flex-shrink-0">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => {}} // Handled by parent onClick
            className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500 dark:focus:ring-red-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <span className={`ml-2 text-sm font-medium ${
            isChecked 
              ? (darkMode ? 'text-red-300' : 'text-red-700')
              : (darkMode ? 'text-gray-300' : 'text-gray-600')
          }`}>
            {isChecked ? 'Selected for deletion' : 'Select for deletion'}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-3 flex-shrink-0">
        <div className="flex items-center space-x-2">
          <div className={`p-1.5 rounded-lg bg-gradient-to-r ${getTypeColor(journal.entryType)} shadow-sm`}>
            <span className="text-white text-base">{typeIcons[journal.entryType] || '📅'}</span>
          </div>
          <div>
            <div className="flex items-center space-x-1 mb-1">
              <span className={`text-xs font-medium capitalize ${
                darkMode ? 'text-gray-200' : 'text-gray-700'
              }`}>
                {journal.entryType || 'daily'} Entry
              </span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className={`w-3 h-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {formatDate(journal.date || journal.createdAt)}
              </span>
            </div>
          </div>
        </div>
        
        {/* Action Buttons - Hide in selection mode */}
        {!isSelectionMode && (
          <div className="flex items-center space-x-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className={`p-1.5 rounded-lg transition-colors ${
                darkMode 
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' 
                  : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
              }`}
            >
              <Edit size={14} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className={`p-1.5 rounded-lg transition-colors ${
                darkMode 
                  ? 'hover:bg-red-900/30 text-gray-400 hover:text-red-400' 
                  : 'hover:bg-red-50 text-gray-500 hover:text-red-600'
              }`}
            >
              <Trash2 size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Title */}
      <div className="mb-3 flex-shrink-0">
        <h3 className={`font-semibold text-base mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {truncateTitle(journal.title)}
        </h3>
      </div>

      {/* Emotions - Show only 2 emotions */}
      {journal.emotions && journal.emotions.length > 0 && (
        <div className="mb-3 flex-shrink-0">
          <div className="flex flex-wrap gap-1">
            {journal.emotions.slice(0, 2).map((emotion, index) => (
              <span
                key={index}
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  darkMode 
                    ? 'bg-gray-700 text-gray-300' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {emotionEmojis[emotion] || '😐'} {emotion}
              </span>
            ))}
            {journal.emotions.length > 2 && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                darkMode 
                  ? 'bg-gray-700 text-gray-400' 
                  : 'bg-gray-100 text-gray-500'
              }`}>
                +{journal.emotions.length - 2}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Content Preview - Limited to 2 lines */}
      <div className="flex-1 mb-3 min-h-0">
        <div>
          <h4 className={`font-medium mb-1 text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Journal Entry
          </h4>
          <p className={`text-sm leading-relaxed ${
            darkMode ? 'text-gray-300' : 'text-gray-600'
          }`}
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: '1.4em',
            maxHeight: '2.8em'
          }}>
            {journal.content || 'No content available'}
          </p>
        </div>
      </div>

      {/* Activity and Location - Compact */}
      {(journal.currentActivity || journal.location) && (
        <div className="mb-3 flex-shrink-0">
          <div className="flex items-center gap-3 text-xs">
            {journal.currentActivity && (
              <div className="flex items-center space-x-1">
                <Activity size={12} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} truncate max-w-[80px]`}>
                  {journal.currentActivity}
                </span>
              </div>
            )}
            {journal.location && (
              <div className="flex items-center space-x-1">
                <MapPin size={12} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'} truncate max-w-[80px]`}>
                  {journal.location}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tags and Sentiment */}
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        {/* Tags */}
        {journal.tags && journal.tags.length > 0 ? (
          <div className="flex items-center space-x-1">
            <Tag size={12} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {journal.tags.length} tag{journal.tags.length !== 1 ? 's' : ''}
            </span>
          </div>
        ) : (
          <div></div> // Empty div to maintain layout
        )}

        {/* Sentiment */}
        {journal.sentiment && (
          <div className="flex items-center space-x-1">
            <span className="text-base">{sentimentEmojis[journal.sentiment] || '😐'}</span>
            <span className={`text-xs capitalize ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {journal.sentiment}
            </span>
          </div>
        )}
      </div>

      {/* Read More Button - Always at bottom */}
      <div className="flex justify-end flex-shrink-0">
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
      <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${getTypeColor(journal.entryType)} opacity-0 group-hover:opacity-[0.02] transition-opacity duration-300 pointer-events-none`}></div>
    </motion.div>
  );
}