import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';

export default function NotificationMessages({ successMessage, error, onDismissSuccess, onDismissError, darkMode }) {
  return (
    <div className="fixed top-20 left-0 right-0 z-40 px-4 pointer-events-none">
      <div className="max-w-xl mx-auto">
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="mb-4 p-4 bg-green-100 dark:bg-green-900 border border-green-300 dark:border-green-700 rounded-lg flex items-center shadow-lg pointer-events-auto"
            >
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
              <p className="text-green-700 dark:text-green-300 font-medium">{successMessage}</p>
              <button
                onClick={onDismissSuccess}
                className="ml-auto text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
              >
                ×
              </button>
            </motion.div>
          )}
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="mb-4 p-4 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg shadow-lg pointer-events-auto"
            >
              <p className="text-red-700 dark:text-red-300">{error}</p>
              <button
                onClick={onDismissError}
                className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
