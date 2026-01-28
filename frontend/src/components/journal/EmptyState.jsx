import { Search, Calendar, Plus } from 'lucide-react';

export default function EmptyState({ hasFilters, onCreateFirst, darkMode }) {
  return (
    <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
      {hasFilters ? (
        <div>
          <Search size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">No journals found</p>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div>
          <Calendar size={48} className="mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">No journal entries yet</p>
          <p>Start your journaling journey by creating your first entry</p>
          <button
            onClick={onCreateFirst}
            className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Create First Entry
          </button>
        </div>
      )}
    </div>
  );
}