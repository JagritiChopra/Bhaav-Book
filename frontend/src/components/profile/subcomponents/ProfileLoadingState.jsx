import React from 'react';

const LoadingState = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-10 mt-16">
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
      <div className="h-40 bg-gradient-to-r from-blue-400 to-cyan-400 dark:from-blue-800 dark:to-cyan-800 animate-pulse">
        <div className="absolute -bottom-16 left-6 sm:left-10">
          <div className="w-28 h-28 bg-slate-300 dark:bg-slate-600 rounded-full animate-pulse"></div>
        </div>
      </div>
      
      <div className="pt-20 px-6 sm:px-10 pb-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-300 dark:bg-slate-600 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-1/5 mb-6"></div>
          
          <div className="space-y-4">
            <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-full"></div>
            <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-3/4"></div>
            <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default LoadingState;