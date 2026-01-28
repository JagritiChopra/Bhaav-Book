
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Loader2 } from 'lucide-react';
import JournalCard from '../journal/JournalCard';
import JournalDetail from '../journal/JournalDetail';
import JournalForm from '../journal/JournalForm';
import MobileJournalSlider from '../journal/MobileJournalSlider';
import JournalHeader from '../journal/JournalHeader';
import SearchAndFilters from '../journal/SearchAndFilters';
import SelectionControls from '../SelectionControls';
import NotificationMessages from '../Notification';
import EmptyState from '../journal/EmptyState';
import DeleteDialog from '../DeleteDialog';
import { useJournalData } from '../../Hooks/useJournalData';

export default function JournalPage() {
  const { darkMode } = useSelector((state) => state.theme);
  const { user, token } = useSelector((state) => state.auth);

  // Custom hook for journal data management
  const {
    journals,
    loading,
    error,
    setError,
    successMessage,
    setSuccessMessage,
    createJournal,
    updateJournal,
    deleteJournals
  } = useJournalData(token);

  // UI State
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingJournal, setEditingJournal] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMood, setFilterMood] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileSlider, setShowMobileSlider] = useState(false);

  // Selection states
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedJournals, setSelectedJournals] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // New state for deletion loading
  const [isDeleting, setIsDeleting] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12); // Increased for grid layout
  const [loadingMore, setLoadingMore] = useState(false);

  // Filter and sort journals
  const filteredJournals = journals
    .filter(journal => {
      if (!journal || !(journal._id || journal.id)) return false;

      if (searchQuery) {
        const matchesSearch = (journal.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (journal.content || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (journal.currentActivity || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
          (journal.tags && Array.isArray(journal.tags) &&
            journal.tags.some(tag => (tag || '').toLowerCase().includes(searchQuery.toLowerCase())));
        if (!matchesSearch) return false;
      }

      const matchesMood = filterMood === 'all' ||
        (journal.emotions && Array.isArray(journal.emotions) &&
          journal.emotions.includes(filterMood));

      return matchesMood;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0);
        case 'oldest':
          return new Date(a.createdAt || a.date || 0) - new Date(b.createdAt || b.date || 0);
        default:
          return 0;
      }
    });

  // Calculate pagination
  const totalJournals = filteredJournals.length;
  const totalPages = Math.ceil(totalJournals / itemsPerPage);
  const displayedJournals = filteredJournals.slice(0, currentPage * itemsPerPage);
  const hasMoreJournals = currentPage < totalPages;

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterMood, sortBy]);

  // Event handlers
  const handleJournalSelect = (journal) => {
    if (isSelectionMode) {
      toggleSelection(journal._id || journal.id);
    } else {
      setSelectedJournal(journal);
      if (isMobile) setShowMobileSlider(true);
    }
  };

  const handleLoadMore = async () => {
    if (loadingMore || !hasMoreJournals) return;

    setLoadingMore(true);

    // Simulate loading delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    setCurrentPage(prev => prev + 1);
    setLoadingMore(false);
  };

  const handleCreateJournal = async (journalData) => {
    await createJournal(journalData);
    setIsFormOpen(false);
    setEditingJournal(null);
    // Reset to first page to show the new journal
    setCurrentPage(1);
  };

  const handleUpdateJournal = async (journalData) => {
    if (editingJournal && (editingJournal._id || editingJournal.id)) {
      await updateJournal(editingJournal._id || editingJournal.id, journalData);
      setEditingJournal(null);
      setIsFormOpen(false);
    }
  };

  const handleEditJournal = (journal) => {
    setEditingJournal(journal);
    setIsFormOpen(true);
  };

  const handleDeleteSelected = async () => {
    setIsDeleting(true);
    
    try {
      await deleteJournals(selectedJournals);
      
      if (selectedJournal && selectedJournals.includes(selectedJournal._id || selectedJournal.id)) {
        setSelectedJournal(null);
      }
      
      setSelectedJournals([]);
      setIsSelectionMode(false);
      setShowDeleteDialog(false);

      // Adjust current page if necessary after deletion
      const newTotalPages = Math.ceil((totalJournals - selectedJournals.length) / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    } catch (error) {
      console.error('Delete failed:', error);
      setError('Failed to delete journals. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    if (!isDeleting) {
      setShowDeleteDialog(false);
    }
  };

  const toggleSelection = (journalId) => {
    setSelectedJournals(prev =>
      prev.includes(journalId)
        ? prev.filter(id => id !== journalId)
        : [...prev, journalId]
    );
  };

  const selectAll = () => {
    setSelectedJournals(displayedJournals.map(journal => journal._id || journal.id));
  };

  const clearSelection = () => {
    setSelectedJournals([]);
    setIsSelectionMode(false);
  };

  // Mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close detail on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && selectedJournal && !isMobile) {
        setSelectedJournal(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [selectedJournal, isMobile]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 relative">
        {/* Background Elements */}
        <div className="fixed inset-0 bg-gradient-to-b from-sky-100 via-sky-50 to-white dark:from-sky-950 dark:via-slate-900 dark:to-slate-900 z-0"></div>
        
        {/* Common background decorative elements that float across the entire page */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
          {/* Large blurred circles that provide subtle background interest */}
          <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-gradient-to-r from-sky-200 to-blue-200 dark:from-sky-700/30 dark:to-blue-700/20 blur-3xl opacity-30 dark:opacity-20 animate-pulse"></div>
          <div className="absolute bottom-40 right-20 w-96 h-96 rounded-full bg-gradient-to-r from-indigo-200 to-purple-200 dark:from-indigo-700/30 dark:to-purple-700/20 blur-3xl opacity-30 dark:opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
          <div className="absolute top-1/3 left-1/3 w-80 h-80 rounded-full bg-gradient-to-r from-sky-300 to-indigo-200 dark:from-sky-800/30 dark:to-indigo-700/20 blur-3xl opacity-20 dark:opacity-15 animate-pulse" style={{ animationDelay: "4s" }}></div>
          
          {/* Subtle radial gradient overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(148,163,184,0.03)_0%,rgba(148,163,184,0)_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(148,163,184,0.05)_0%,rgba(148,163,184,0)_70%)]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className={`ml-3 text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Loading your journals...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-14 relative">
      {/* Background Elements */}
      <div className="fixed inset-0 bg-gradient-to-b from-sky-100 via-sky-50 to-white dark:from-sky-950 dark:via-slate-900 dark:to-slate-900 z-0"></div>
      
      {/* Common background decorative elements that float across the entire page */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Large blurred circles that provide subtle background interest */}
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-gradient-to-r from-sky-200 to-blue-200 dark:from-sky-700/30 dark:to-blue-700/20 blur-3xl opacity-30 dark:opacity-20 animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-96 h-96 rounded-full bg-gradient-to-r from-indigo-200 to-purple-200 dark:from-indigo-700/30 dark:to-purple-700/20 blur-3xl opacity-30 dark:opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/3 left-1/3 w-80 h-80 rounded-full bg-gradient-to-r from-sky-300 to-indigo-200 dark:from-sky-800/30 dark:to-indigo-700/20 blur-3xl opacity-20 dark:opacity-15 animate-pulse" style={{ animationDelay: "4s" }}></div>
        
        {/* Subtle radial gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(148,163,184,0.03)_0%,rgba(148,163,184,0)_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(148,163,184,0.05)_0%,rgba(148,163,184,0)_70%)]"></div>
      </div>

      <NotificationMessages
        successMessage={successMessage}
        error={error}
        onDismissSuccess={() => setSuccessMessage('')}
        onDismissError={() => setError(null)}
        darkMode={darkMode}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Header Section */}
        <JournalHeader
          user={user}
          darkMode={darkMode}
          onNewEntry={() => {
            setEditingJournal(null);
            setIsFormOpen(true);
          }}
        />

        {/* Search and Filters Section */}
        <SearchAndFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterMood={filterMood}
          setFilterMood={setFilterMood}
          sortBy={sortBy}
          setSortBy={setSortBy}
          isSelectionMode={isSelectionMode}
          setIsSelectionMode={setIsSelectionMode}
          setSelectedJournals={setSelectedJournals}
          isMobile={isMobile}
          darkMode={darkMode}
        />

        {/* Selection Controls */}
        <SelectionControls
          isSelectionMode={isSelectionMode}
          selectedJournals={selectedJournals}
          filteredJournals={displayedJournals}
          onSelectAll={selectAll}
          onClearSelection={clearSelection}
          onDeleteSelected={() => setShowDeleteDialog(true)}
          darkMode={darkMode}
        />

        {/* Results Summary */}
        {filteredJournals.length > 0 && (
          <div className={`mb-6 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Showing {displayedJournals.length} of {totalJournals} journal{totalJournals !== 1 ? 's' : ''}
            {searchQuery && ` for "${searchQuery}"`}
            {filterMood !== 'all' && ` filtered by ${filterMood}`}
          </div>
        )}

        {/* Main Content */}
        <div className="w-full">
          {filteredJournals.length === 0 ? (
            <EmptyState
              hasFilters={searchQuery || filterMood !== 'all'}
              onCreateFirst={() => {
                setEditingJournal(null);
                setIsFormOpen(true);
              }}
              darkMode={darkMode}
            />
          ) : (
            <div className="space-y-8">
              {/* Journal Cards Grid */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {displayedJournals.map((journal, index) => {
                  const journalId = journal._id || journal.id;
                  return (
                    <motion.div
                      key={journalId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <JournalCard
                        journal={journal}
                        isSelected={selectedJournal && (selectedJournal._id || selectedJournal.id) === journalId}
                        isSelectionMode={isSelectionMode}
                        isChecked={selectedJournals.includes(journalId)}
                        onClick={() => handleJournalSelect(journal)}
                        onEdit={() => handleEditJournal(journal)}
                        onDelete={() => {
                          setSelectedJournals([journalId]);
                          setShowDeleteDialog(true);
                        }}
                        darkMode={darkMode}
                      />
                    </motion.div>
                  );
                })}
              </motion.div>

              {/* Load More Button */}
              {hasMoreJournals && (
                <div className="flex justify-center">
                  <button
                    onClick={handleLoadMore}
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
                        Loading more journals...
                      </>
                    ) : (
                      <>
                        <ChevronDown size={18} className="mr-2" />
                        Load More Journals
                      </>
                    )}
                  </button>
                </div>
              )}

              {/* Pagination Info */}
              {totalJournals > itemsPerPage && !hasMoreJournals && (
                <div className={`text-center text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'} pb-8`}>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    darkMode ? 'bg-gray-800/60 text-gray-300' : 'bg-gray-100/60 text-gray-600'
                  }`}>
                    All journals loaded
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Desktop Journal Detail - Slide from Right */}
      <AnimatePresence>
        {selectedJournal && !isMobile && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              onClick={() => setSelectedJournal(null)}
            />

            {/* Detail Panel - Slide from Right */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 200,
                duration: 0.4
              }}
              className="fixed top-0 right-0 h-screen w-full sm:w-96 md:w-1/2 lg:w-2/5 xl:w-1/3 z-50 shadow-2xl"
            >
              <div className="h-full overflow-hidden">
                <JournalDetail
                  journal={selectedJournal}
                  onEdit={() => {
                    setSelectedJournal(null);
                    handleEditJournal(selectedJournal);
                  }}
                  onDelete={() => {
                    setSelectedJournals([selectedJournal._id || selectedJournal.id]);
                    setShowDeleteDialog(true);
                    setSelectedJournal(null);
                  }}
                  onClose={() => setSelectedJournal(null)}
                  darkMode={darkMode}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Modals and Overlays */}
      <DeleteDialog
        isOpen={showDeleteDialog}
        selectedCount={selectedJournals.length}
        onConfirm={handleDeleteSelected}
        onCancel={handleDeleteCancel}
        darkMode={darkMode}
        isDeleting={isDeleting}
      />

      {isMobile && selectedJournal && (
        <MobileJournalSlider
          journal={selectedJournal}
          isOpen={showMobileSlider}
          onClose={() => {
            setShowMobileSlider(false);
            setSelectedJournal(null);
          }}
          onEdit={() => {
            setShowMobileSlider(false);
            handleEditJournal(selectedJournal);
          }}
          onDelete={() => {
            setShowMobileSlider(false);
            setSelectedJournals([selectedJournal._id || selectedJournal.id]);
            setShowDeleteDialog(true);
          }}
          darkMode={darkMode}
        />
      )}

      <AnimatePresence>
        {isFormOpen && (
          <JournalForm
            journal={editingJournal}
            onSave={editingJournal ? handleUpdateJournal : handleCreateJournal}
            onClose={() => {
              setIsFormOpen(false);
              setEditingJournal(null);
            }}
            darkMode={darkMode}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
