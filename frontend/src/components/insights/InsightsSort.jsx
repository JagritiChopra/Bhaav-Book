// src/components/insights/InsightsSort.jsx
import { motion } from 'framer-motion';
import { ArrowUpDown, Calendar } from 'lucide-react';

export default function InsightsSort({ 
  sortBy, 
  setSortBy, 
  darkMode,
  totalInsights
}) {
  return (
    <div 
      className="mb-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Total Count */}
        <div className={`mt-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <Calendar className="w-4 h-4 inline mr-2" />
          {totalInsights} insight{totalInsights !== 1 ? 's' : ''} total
        </div>

        {/* Sort Options */}
        <div className="flex my-[-6px] items-center space-x-3">
          <ArrowUpDown className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Sort by:
          </span>
          <div className="flex rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
            <button
              onClick={() => setSortBy('newest')}
              className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                sortBy === 'newest'
                  ? darkMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-600 text-white'
                  : darkMode
                    ? 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Newest
            </button>
            <button
              onClick={() => setSortBy('oldest')}
              className={`px-4 py-2 text-sm font-medium transition-all duration-200 border-l border-gray-300 dark:border-gray-600 ${
                sortBy === 'oldest'
                  ? darkMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-600 text-white'
                  : darkMode
                    ? 'bg-slate-800 text-gray-300 hover:bg-slate-700'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Oldest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}   