import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Loader2 } from 'lucide-react';

export default function DeleteDialog({ 
  isOpen, 
  selectedCount, 
  onConfirm, 
  onCancel, 
  darkMode,
  isDeleting = false // Add isDeleting prop
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className={`w-full max-w-md rounded-xl ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } shadow-2xl p-6`}
          >
            <div className="flex items-center mb-4">
              {isDeleting ? (
                <Loader2 className="h-6 w-6 text-red-600 mr-3 animate-spin" />
              ) : (
                <Trash2 className="h-6 w-6 text-red-600 mr-3" />
              )}
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {isDeleting ? 'Deleting...' : `Delete Journal${selectedCount > 1 ? 's' : ''}`}
              </h3>
            </div>
            
            <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {isDeleting 
                ? `Deleting ${selectedCount} journal${selectedCount > 1 ? 's' : ''}...`
                : `Are you sure you want to delete ${selectedCount} journal${selectedCount > 1 ? 's' : ''}? This action cannot be undone.`
              }
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                disabled={isDeleting}
                className={`flex-1 px-4 py-2 border rounded-lg font-medium transition-colors ${
                  isDeleting 
                    ? 'opacity-50 cursor-not-allowed' 
                    : ''
                } ${
                  darkMode 
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={isDeleting}
                className={`flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                  isDeleting 
                    ? 'opacity-75 cursor-not-allowed' 
                    : 'hover:bg-red-700'
                }`}
              >
                {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
