import React from 'react';
import { useSelector } from 'react-redux';

const StatusAlert = ({ status }) => {
  if (!status.message) return null;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[9999] max-w-md w-full mx-4">
      <div className={`p-4 rounded-lg shadow-2xl border-l-4 backdrop-blur-sm ${
        status.type === 'success' 
          ? 'bg-green-50/95 dark:bg-green-900/90 border-green-400 text-green-700 dark:text-green-300' 
          : 'bg-red-50/95 dark:bg-red-900/90 border-red-400 text-red-700 dark:text-red-300'
      }`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            {status.type === 'success' ? (
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">{status.message}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ErrorState = ({ error }) => {
  const { darkMode } = useSelector((state) => state.theme);
  
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-10 mt-16">
      <div className={`border rounded-lg p-6 text-center ${
        darkMode 
          ? 'bg-red-900/20 border-red-800' 
          : 'bg-red-50 border-red-200'
      }`}>
        <svg className={`mx-auto h-12 w-12 mb-4 ${
          darkMode ? 'text-red-300' : 'text-red-400'
        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <h3 className={`text-lg font-medium mb-2 ${
          darkMode ? 'text-red-200' : 'text-red-800'
        }`}>Error Loading Profile</h3>
        <p className={darkMode ? 'text-red-300' : 'text-red-600'}>{error}</p>
      </div>
    </div>
  );
};

export { StatusAlert, ErrorState };