// src/components/insights/CreateInsightModal.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Brain, Calendar, FileText, Loader2 } from 'lucide-react';

export default function CreateInsightModal({ onClose, onSubmit, darkMode }) {
  const [formData, setFormData] = useState({
    pastDays: 1,
    isShort: false
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 flex items-center justify-center p-4 z-50"
      >
        <div className={`w-full max-w-md rounded-2xl shadow-2xl ${
          darkMode ? 'bg-slate-800' : 'bg-white'
        }`}>
          {/* Header */}
          <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-sky-500">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Generate New Insight
                </h2>
              </div>
              <button
                onClick={onClose}
                disabled={loading}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Days Selection */}
            <div>
              <label className={`block text-sm font-medium mb-3 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <Calendar className="w-4 h-4 inline mr-2" />
                Analysis Period
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[1 , 7, 14, 30].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, pastDays: days }))}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.pastDays === days
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                        : darkMode
                          ? 'border-gray-600 hover:border-gray-500 text-gray-300'
                          : 'border-gray-300 hover:border-gray-400 text-gray-700'
                    }`}
                  >
                    <div className="text-lg font-semibold">{days}</div>
                    <div className="text-xs">days</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Summary Type */}
            <div>
              <label className={`block text-sm font-medium mb-3 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                <FileText className="w-4 h-4 inline mr-2" />
                Summary Type
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="summaryType"
                    checked={!formData.isShort}
                    onChange={() => setFormData(prev => ({ ...prev, isShort: false }))}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className={`ml-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <span className="font-medium">Detailed Analysis</span>
                    <span className={`block text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Comprehensive insights with detailed explanations
                    </span>
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="summaryType"
                    checked={formData.isShort}
                    onChange={() => setFormData(prev => ({ ...prev, isShort: true }))}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className={`ml-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    <span className="font-medium">Quick Summary</span>
                    <span className={`block text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Brief overview with key highlights
                    </span>
                  </span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 transform hover:scale-105'
              } text-white shadow-lg`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating Insight...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5 mr-2" />
                  Generate Insight
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </>
  );
}
