// src/pages/InsightsPage.jsx
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AnimatePresence } from 'framer-motion';
import InsightsHeader from '../insights/InsightsHeader';
import InsightsSort from '../insights/InsightsSort';
import InsightsGrid from '../insights/InsightsGrid';
import InsightDetail from '../insights/InsightDetail';
import CreateInsightModal from '../insights/CreateInsight';
import NotificationMessages from '../Notification';
import { API_BASE_URL } from '../../config/api';

export default function InsightsPage() {
  const { darkMode } = useSelector((state) => state.theme);
  const { token } = useSelector((state) => state.auth);
  
  // State management
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedInsight, setSelectedInsight] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // Normalize insight data to handle missing fields
  const normalizeInsightData = (insight) => {
    return {
      ...insight,
      Mistakes: insight.Mistakes || "No significant mistakes identified during this period.",
      Attachment: insight.Attachment || "Attachment not provided",
      moodInImage: insight.moodInImage || "Image not provided",
      isUserStuck: insight.isUserStuck || "No, You are not stuck with anything.",
      waysToGetUnstuck: insight.waysToGetUnstuck || "Continue maintaining your current positive state.",
      emotions: insight.emotions || [],
      insight: insight.insight || "No specific insights available for this period.",
      suggestion: insight.suggestion || "Keep up the good work and continue your current practices."
    };
  };

  // Fetch insights
  const fetchInsights = async (page = 1, append = false) => {
    try {
      if (!append) setLoading(true);
      else setLoadingMore(true);

      const response = await fetch(`${API_BASE_URL}/insights?page=${page}&limit=9`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (data.success) {
        // Normalize the insight data to handle missing fields
        const normalizedInsights = data.data.map(normalizeInsightData);
        
        if (append) {
          setInsights(prev => [...prev, ...normalizedInsights]);
        } else {
          setInsights(normalizedInsights);
        }
        setTotalPages(data.pagination?.pages || 1);
        setCurrentPage(page);
      } else {
        setError(data.message || 'Failed to fetch insights');
      }
    } catch (err) {
      setError('Failed to fetch insights');
      console.error('Fetch insights error:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load more insights
  const handleLoadMore = () => {
    if (currentPage < totalPages && !loadingMore) {
      fetchInsights(currentPage + 1, true);
    }
  };

  // Sort insights by date
  const sortedInsights = [...insights].sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    
    if (sortBy === 'newest') {
      return dateB - dateA;
    } else {
      return dateA - dateB;
    }
  });

  // Create new insight
  const handleCreateInsight = async (insightData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/insights`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(insightData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage('New insight generated successfully!');
        setShowCreateModal(false);
        fetchInsights(); // Refresh insights
      } else {
        setError(data.message || 'Failed to create insight');
      }
    } catch (err) {
      setError('Failed to create insight');
      console.error('Create insight error:', err);
    }
  };

  // Handle insight selection with normalization
  const handleInsightClick = (insight) => {
    setSelectedInsight(normalizeInsightData(insight));
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  if (loading && insights.length === 0) {
    return (
      <div className="min-h-screen pt-20 relative">
        {/* Background */}
        <div className="fixed inset-0 bg-gradient-to-b from-sky-100 via-sky-50 to-white dark:from-sky-950 dark:via-slate-900 dark:to-slate-900 z-0"></div>
        
        {/* Background decorations */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-gradient-to-r from-sky-200 to-blue-200 dark:from-sky-700/30 dark:to-blue-700/20 blur-3xl opacity-30 dark:opacity-20 animate-pulse"></div>
          <div className="absolute bottom-40 right-20 w-96 h-96 rounded-full bg-gradient-to-r from-indigo-200 to-purple-200 dark:from-indigo-700/30 dark:to-purple-700/20 blur-3xl opacity-30 dark:opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className={`ml-3 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Loading your insights...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-14 relative">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-sky-100 via-sky-50 to-white dark:from-sky-950 dark:via-slate-900 dark:to-slate-900 z-0"></div>
      
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-gradient-to-r from-sky-200 to-blue-200 dark:from-sky-700/30 dark:to-blue-700/20 blur-3xl opacity-30 dark:opacity-20 animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-96 h-96 rounded-full bg-gradient-to-r from-indigo-200 to-purple-200 dark:from-indigo-700/30 dark:to-purple-700/20 blur-3xl opacity-30 dark:opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/3 left-1/3 w-80 h-80 rounded-full bg-gradient-to-r from-sky-300 to-indigo-200 dark:from-sky-800/30 dark:to-indigo-700/20 blur-3xl opacity-20 dark:opacity-15 animate-pulse" style={{ animationDelay: "4s" }}></div>
      </div>

      <NotificationMessages
        successMessage={successMessage}
        error={error}
        onDismissSuccess={() => setSuccessMessage('')}
        onDismissError={() => setError('')}
        darkMode={darkMode}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <InsightsHeader 
          darkMode={darkMode}
          onCreateInsight={() => setShowCreateModal(true)}
        />

        <InsightsSort
          sortBy={sortBy}
          setSortBy={setSortBy}
          darkMode={darkMode}
          totalInsights={insights.length}
        />

        <InsightsGrid
          insights={sortedInsights}
          currentPage={currentPage}
          totalPages={totalPages}
          loadingMore={loadingMore}
          darkMode={darkMode}
          onInsightClick={handleInsightClick}
          onLoadMore={handleLoadMore}
          onCreateInsight={() => setShowCreateModal(true)}
        />
      </div>

      {/* Modals */}
      <AnimatePresence>
        {selectedInsight && (
          <InsightDetail
            insight={selectedInsight}
            onClose={() => setSelectedInsight(null)}
            darkMode={darkMode}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCreateModal && (
          <CreateInsightModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateInsight}
            darkMode={darkMode}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
