import { Trash2 } from 'lucide-react';

export default function SelectionControls({
  isSelectionMode,
  selectedJournals,
  filteredJournals,
  onSelectAll,
  onClearSelection,
  onDeleteSelected,
  darkMode
}) {
  if (!isSelectionMode) return null;

  return (
    <div className="flex mt-4 items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
      <div className="flex items-center gap-4">
        <span className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
          {selectedJournals.length} selected
        </span>
        <button
          onClick={onSelectAll}
          className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'}`}
        >
          Select All ({filteredJournals.length})
        </button>
        <button
          onClick={onClearSelection}
          className={`text-xs sm:text-sm font-medium ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-600 hover:text-gray-700'}`}
        >
          Clear Selection
        </button>
      </div>
      
      {selectedJournals.length > 0 && (
        <button
          onClick={onDeleteSelected}
          className="flex my-[-8px] items-center px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <Trash2 size={14} className="mr-1" />
          Delete Selected
        </button>
      )}
    </div>
  );
}
