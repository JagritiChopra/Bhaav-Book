import { motion, AnimatePresence } from 'framer-motion';
import { X, Edit, Trash2, Calendar, Tag, Clock, MapPin, Activity } from 'lucide-react';

export default function MobileJournalSlider({ journal, isOpen, onClose, onEdit, onDelete, darkMode }) {
  if (!journal) return null;

  const emotionEmojis = {
    happy: '😊', sad: '😢', excited: '🤩', anxious: '😰', content: '😌', stressed: '😫',
    contemplative: '🤔', grateful: '🙏', angry: '😠', peaceful: '😇', confused: '😕', motivated: '💪'
  };

  const sentimentEmojis = { positive: '😊', negative: '😔', neutral: '😐' };

  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return 'No time';
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            onClick={onClose}
          />

          {/* Slider */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed bottom-0 left-0 right-0 z-50 ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } rounded-t-2xl shadow-2xl max-h-[85vh] overflow-hidden`}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className={`w-12 h-1 rounded-full ${
                darkMode ? 'bg-gray-600' : 'bg-gray-300'
              }`} />
            </div>

            {/* Header */}
            <div className={`px-6 py-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1 pr-4">
                  <div className="flex items-center space-x-4 text-sm mb-2">
                    <div className="flex items-center">
                      <Calendar size={14} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                      <span className={`ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatDate(journal.date || journal.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={14} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                      <span className={`ml-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatTime(journal.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={onClose}
                  className={`p-2 rounded-lg transition-colors ${
                    darkMode 
                      ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300' 
                      : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mood and Actions */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {sentimentEmojis[journal.sentiment] || '😐'} {journal.sentiment || 'neutral'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={onEdit}
                    className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      darkMode 
                        ? 'bg-blue-900/30 text-blue-300 hover:bg-blue-900/50' 
                        : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    }`}
                  >
                    <Edit size={14} className="mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={onDelete}
                    className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      darkMode 
                        ? 'bg-red-900/30 text-red-300 hover:bg-red-900/50' 
                        : 'bg-red-50 text-red-600 hover:bg-red-100'
                    }`}
                  >
                    <Trash2 size={14} className="mr-1" />
                    Delete
                  </button>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-4 overflow-y-auto max-h-[60vh] space-y-4">
              {/* Context */}
              {(journal.currentActivity || journal.location) && (
                <div className="text-sm text-gray-500 space-y-1">
                  {journal.currentActivity && (
                    <div className="flex items-center">
                      <Activity size={12} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                      <span className={`ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {journal.currentActivity}
                      </span>
                    </div>
                  )}
                  {journal.location && (
                    <div className="flex items-center">
                      <MapPin size={12} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                      <span className={`ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {journal.location}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Emotions */}
              {journal.emotions && journal.emotions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {journal.emotions.map((emotion, index) => (
                    <span
                      key={index}
                      className={`px-2 py-1 rounded-full text-xs ${
                        darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {emotionEmojis[emotion] || '😐'} {emotion}
                    </span>
                  ))}
                </div>
              )}

              {/* Content */}
              <p className={`leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {journal.content || 'No content available'}
              </p>

              {/* Insights */}
              {journal.insights && (
                <div className={`p-3 rounded-lg border-l-4 border-blue-500 ${
                  darkMode ? 'bg-blue-900/20' : 'bg-blue-50'
                }`}>
                  <p className={`text-sm ${darkMode ? 'text-blue-200' : 'text-blue-600'}`}>
                    {journal.insights}
                  </p>
                </div>
              )}

              {/* Tags */}
              {journal.tags && journal.tags.length > 0 && (
                <div>
                  <div className="flex items-center mb-2">
                    <Tag size={14} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                    <span className={`ml-1 text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Tags
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {journal.tags.map((tag, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 rounded-md text-xs font-medium ${
                          darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom padding for safe area */}
              <div className="h-8" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}