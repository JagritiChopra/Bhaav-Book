import { Calendar, Edit, Trash2, Tag, X, Clock, MapPin, Activity, Cloud } from 'lucide-react';

export default function JournalDetail({ journal, onEdit, onDelete, onClose, darkMode }) {
  const emotionEmojis = {
    happy: '😊', sad: '😢', excited: '🤩', anxious: '😰', content: '😌', stressed: '😫',
    contemplative: '🤔', grateful: '🙏', angry: '😠', peaceful: '😇', confused: '😕', motivated: '💪'
  };

  const getSentimentColor = (sentiment) => {
    const colors = {
      positive: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800',
      negative: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800',
      neutral: 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700'
    };
    return colors[sentiment] || colors.neutral;
  };

  const getSentimentEmoji = (sentiment) => {
    switch (sentiment) {
      case 'positive': return '😊';
      case 'negative': return '😔';
      default: return '😐';
    }
  };

  const getEntryTypeIcon = (entryType) => {
    switch (entryType) {
      case 'gratitude': return '🙏';
      case 'reflection': return '🤔';
      case 'dream': return '💭';
      default: return '📝';
    }
  };

  const getWeatherEmoji = (weather) => {
    const weatherEmojis = {
      sunny: '☀️', cloudy: '☁️', rainy: '🌧️', stormy: '⛈️',
      snowy: '❄️', windy: '💨', foggy: '🌫️'
    };
    return weatherEmojis[weather] || '';
  };

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
    <div className={`h-screen w-full ${
      darkMode 
        ? 'bg-gray-900 border-l border-gray-700' 
        : 'bg-white border-l border-gray-200'
    } flex flex-col`}>
      
      {/* Header - Fixed */}
      <div className={`flex-shrink-0 p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        {/* Close Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors hover:scale-110 ${
              darkMode 
                ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-200' 
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
            }`}
          >
            <X size={24} />
          </button>
        </div>

        {/* Header Content */}
        <div className="space-y-4">
          {/* Title Section - Prominent Display */}
          <div>
            <h1 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              {journal.title || 'Untitled Entry'}
            </h1>
            
            {/* Entry Type and Sentiment - Smaller */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-lg">{getEntryTypeIcon(journal.entryType)}</span>
                <span className={`px-2 py-1 rounded-md text-xs font-medium capitalize ${
                  darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'
                }`}>
                  {journal.entryType || 'daily'}
                </span>
              </div>
              
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getSentimentColor(journal.sentiment)}`}>
                {getSentimentEmoji(journal.sentiment)} {journal.sentiment || 'neutral'}
              </span>
            </div>
          </div>
          
          {/* Date and Time */}
          <div className="flex flex-wrap items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                {formatDate(journal.date || journal.createdAt)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
              <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                {formatTime(journal.createdAt)}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onEdit}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${
                darkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              } shadow-lg hover:shadow-xl`}
            >
              <Edit size={16} />
              Edit
            </button>
            <button
              onClick={onDelete}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:scale-105 ${
                darkMode 
                  ? 'bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-600/30' 
                  : 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'
              }`}
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="p-6 space-y-6">
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`p-3 rounded-lg text-center ${
              darkMode ? 'bg-gray-800/50' : 'bg-gray-50'
            } border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="text-xl mb-1">🏷️</div>
              <div className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {journal.tags?.length || 0} tags
              </div>
            </div>
            <div className={`p-3 rounded-lg text-center ${
              darkMode ? 'bg-gray-800/50' : 'bg-gray-50'
            } border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="text-xl mb-1">😊</div>
              <div className={`text-xs font-medium ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {journal.emotions?.length || 0} emotions
              </div>
            </div>
          </div>

          {/* Context Information */}
          {(journal.currentActivity || journal.location || journal.weather) && (
            <div className={`p-4 rounded-lg ${
              darkMode ? 'bg-gradient-to-r from-gray-800/50 to-gray-700/30' : 'bg-gradient-to-r from-gray-50 to-gray-100/50'
            } border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Context
              </h3>
              <div className="space-y-3">
                {journal.currentActivity && (
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                      <Activity size={16} className="text-blue-500" />
                    </div>
                    <div>
                      <div className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Activity
                      </div>
                      <div className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        {journal.currentActivity}
                      </div>
                    </div>
                  </div>
                )}
                {journal.location && (
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                      <MapPin size={16} className="text-green-500" />
                    </div>
                    <div>
                      <div className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Location
                      </div>
                      <div className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        {journal.location}
                      </div>
                    </div>
                  </div>
                )}
                {journal.weather && (
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
                      <Cloud size={16} className="text-purple-500" />
                    </div>
                    <div>
                      <div className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Weather
                      </div>
                      <div className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                        {getWeatherEmoji(journal.weather)} {journal.weather}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Emotions */}
          {journal.emotions && journal.emotions.length > 0 && (
            <div>
              <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Emotions
              </h3>
              <div className="flex flex-wrap gap-2">
                {journal.emotions.map((emotion, index) => (
                  <span
                    key={index}
                    className={`px-3 py-2 rounded-full text-sm font-medium border transition-transform hover:scale-105 cursor-default ${
                      darkMode 
                        ? 'bg-gray-800/50 text-gray-300 border-gray-700' 
                        : 'bg-white text-gray-700 border-gray-200'
                    }`}
                  >
                    {emotionEmojis[emotion] || '😐'} {emotion}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Main Content */}
          <div>
            <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Journal Entry
            </h3>
            <div className={`p-4 rounded-lg ${
              darkMode ? 'bg-gray-800/30' : 'bg-gray-50/50'
            } border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className={`prose max-w-none ${darkMode ? 'prose-invert' : ''}`}>
                <p className={`text-sm leading-relaxed whitespace-pre-wrap ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {journal.content || 'No content available'}
                </p>
              </div>
            </div>
          </div>

          {/* Insights */}
          {journal.insights && (
            <div className={`p-4 rounded-lg border-l-4 border-blue-500 ${
              darkMode ? 'bg-blue-900/20' : 'bg-blue-50'
            }`}>
              <h3 className={`text-sm font-semibold mb-2 ${
                darkMode ? 'text-blue-300' : 'text-blue-700'
              }`}>
                💡 Insights & Reflections
              </h3>
              <p className={`text-sm leading-relaxed ${
                darkMode ? 'text-blue-200' : 'text-blue-600'
              }`}>
                {journal.insights}
              </p>
            </div>
          )}

          {/* Media */}
          {(journal.attachment || journal.photo) && (
            <div>
              <h3 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Attachments
              </h3>
              <div className="space-y-3">
                {journal.attachment && (
                  <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    {journal.attachment.includes('video') ? (
                      <video src={journal.attachment} className="w-full h-48 object-cover" controls />
                    ) : (
                      <img src={journal.attachment} alt="Journal attachment" className="w-full h-48 object-cover" />
                    )}
                  </div>
                )}
                {journal.photo && (
                  <div className="rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                    <img src={journal.photo} alt="Journal photo" className="w-full h-48 object-cover" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          {journal.tags && journal.tags.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Tag size={16} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
                <h3 className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Tags
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {journal.tags.map((tag, index) => (
                  <span
                    key={index}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-transform hover:scale-105 cursor-default ${
                      darkMode 
                        ? 'bg-gray-700 text-gray-300' 
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          {journal.updatedAt && journal.updatedAt !== journal.createdAt && (
            <div className={`pt-4 border-t text-sm ${
              darkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'
            }`}>
              <div className="flex items-center gap-2">
                <Clock size={14} />
                Last updated: {formatDate(journal.updatedAt)} at {formatTime(journal.updatedAt)}
              </div>
            </div>
          )}

          {/* Bottom Padding for better scrolling */}
          <div className="h-8"></div>
        </div>
      </div>
    </div>
  );
}