import { Search, MoreVertical, X } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SearchAndFilters({
  searchQuery,
  setSearchQuery,
  filterMood,
  setFilterMood,
  sortBy,
  setSortBy,
  isSelectionMode,
  setIsSelectionMode,
  setSelectedJournals,
  isMobile,
  darkMode
}) {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const moodOptions = [
    { value: 'all', label: 'All Emotions' },
    { value: 'happy', label: 'Happy' },
    { value: 'sad', label: 'Sad' },
    { value: 'excited', label: 'Excited' },
    { value: 'anxious', label: 'Anxious' },
    { value: 'content', label: 'Content' },
    { value: 'stressed', label: 'Stressed' },
    { value: 'contemplative', label: 'Contemplative' },
    { value: 'grateful', label: 'Grateful' },
    { value: 'angry', label: 'Angry' },
    { value: 'peaceful', label: 'Peaceful' },
    { value: 'confused', label: 'Confused' },
    { value: 'motivated', label: 'Motivated' }
  ];

  return (
    <div className="w-full space-y-4">
      {/* Mobile Layout - Search takes full width */}
      <div className="block md:hidden">
        {/* Search Bar - Full width on mobile */}
        <div className="relative flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search size={20} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder="Search journals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
            />
          </div>

          {/* Mobile Menu Button */}
          <div className="relative">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className={`p-3 rounded-lg border transition-colors ${
                darkMode 
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <MoreVertical size={20} />
            </button>

            {/* Mobile Dropdown */}
            <AnimatePresence>
              {showMobileMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-30"
                    onClick={() => setShowMobileMenu(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className={`absolute right-0 top-full mt-2 w-64 rounded-lg border shadow-lg z-40 ${
                      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          Filters & Options
                        </h3>
                        <button
                          onClick={() => setShowMobileMenu(false)}
                          className={`p-1 rounded ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                        >
                          <X size={16} />
                        </button>
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Filter by Emotion
                        </label>
                        <select
                          value={filterMood}
                          onChange={(e) => setFilterMood(e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border ${
                            darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                          } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        >
                          {moodOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          Sort by
                        </label>
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className={`w-full px-3 py-2 rounded-lg border ${
                            darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
                          } focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                        >
                          <option value="newest">Newest First</option>
                          <option value="oldest">Oldest First</option>
                        </select>
                      </div>

                      <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={() => {
                            setIsSelectionMode(!isSelectionMode);
                            if (isSelectionMode) setSelectedJournals([]);
                            setShowMobileMenu(false);
                          }}
                          className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                            isSelectionMode
                              ? 'bg-blue-600 text-white'
                              : darkMode
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {isSelectionMode ? 'Cancel Selection' : 'Select Journals'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Grid with 4 columns */}
      <div className="hidden md:grid md:grid-cols-4 w-full gap-4">
        {/* Search Bar - Takes 2 columns (50% width) on desktop */}
        <div className=" col-span-2 relative">
          <div className="relative ">
            <Search size={20} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              placeholder="Search journals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${
                darkMode 
                  ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
            />
          </div>
        </div>

        {/* Desktop Emotion Filter - Takes 1 column (25% width) */}
        <div className="flex items-center">
          <select
            value={filterMood}
            onChange={(e) => setFilterMood(e.target.value)}
            className={`w-full px-4 py-2 rounded-lg border ${
              darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
          >
            {moodOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop Sort and Select - Takes 1 column (25% width) */}
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`flex-1 px-4 py-2 rounded-lg border ${
              darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
            } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>

          <button
            onClick={() => {
              setIsSelectionMode(!isSelectionMode);
              if (isSelectionMode) setSelectedJournals([]);
            }}
            className={`px-3 py-2 rounded-lg border font-medium transition-colors whitespace-nowrap text-sm ${
              isSelectionMode
                ? 'bg-blue-600 text-white border-blue-600'
                : darkMode
                  ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {isSelectionMode ? 'Cancel' : 'Select'}
          </button>
        </div>
      </div>
    </div>
  );
}