// src/components/insights/InsightsGrid.jsx
import { motion } from 'framer-motion';
import { Brain, ChevronDown, Loader2 } from 'lucide-react';
import InsightCard from './InsightCard';

export default function InsightsGrid({ 
  insights, 
  currentPage, 
  totalPages, 
  loadingMore, 
  darkMode, 
  onInsightClick, 
  onLoadMore, 
  onCreateInsight 
}) {
  return (
    <>
      {/* Empty State or Grid */}
      {insights.length === 0 ? (
        <EmptyState 
          darkMode={darkMode}
          onCreateInsight={onCreateInsight}
        />
      ) : (
        <div className="space-y-8">
          <div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {insights.map((insight, index) => (
              <div
                key={insight._id}
              >
                <InsightCard
                  insight={insight}
                  onClick={() => onInsightClick(insight)}
                  darkMode={darkMode}
                />
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {currentPage < totalPages && (
            <LoadMoreButton 
              loadingMore={loadingMore}
              onLoadMore={onLoadMore}
              darkMode={darkMode}
            />
          )}
        </div>
      )}
    </>
  );
}

// Empty State Component
function EmptyState({ darkMode, onCreateInsight }) {
  return (
    <div 
      className="text-center py-20"
    >
      <div className={`w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center ${
        darkMode ? 'bg-slate-800' : 'bg-gray-100'
      }`}>
        <Brain className={`w-12 h-12 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
      </div>
      <h3 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
        No insights yet
      </h3>
      <p className={`text-lg mb-8 max-w-md mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Start your journey by generating your first AI-powered insight from your journal entries.
      </p>
      <button
        onClick={onCreateInsight}
        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        <Brain className="w-5 h-5 mr-2" />
        Generate Your First Insight
      </button>
    </div>
  );
}

// Load More Button Component
function LoadMoreButton({ loadingMore, onLoadMore, darkMode }) {
  return (
    <div className="flex justify-center">
      <button
        onClick={onLoadMore}
        disabled={loadingMore}
        className={`flex items-center px-8 py-3 rounded-xl font-medium transition-all duration-200 ${
          loadingMore
            ? 'cursor-not-allowed opacity-50'
            : 'hover:scale-105 active:scale-95'
        } ${
          darkMode
            ? 'bg-slate-800 hover:bg-slate-700 text-white border border-gray-600'
            : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm'
        }`}
      >
        {loadingMore ? (
          <>
            <Loader2 size={18} className="mr-2 animate-spin" />
            Loading more insights...
          </>
        ) : (
          <>
            <ChevronDown size={18} className="mr-2" />
            Load More Insights
          </>
        )}
      </button>
    </div>
  );
}