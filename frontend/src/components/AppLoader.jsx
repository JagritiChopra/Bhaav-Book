import React from 'react';
import logoDark from "../assets/logo.png";
import logoLight from "../assets/logo-light.png";

const AppLoader = ({ darkMode }) => {
  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-sky-50'
    }`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 left-20 w-32 h-32 ${
          darkMode ? 'bg-sky-500/8' : 'bg-sky-500/4'
        } rounded-full blur-lg animate-pulse`}></div>
        <div className={`absolute bottom-20 right-20 w-40 h-40 ${
          darkMode ? 'bg-purple-500/8' : 'bg-purple-500/4'
        } rounded-full blur-lg animate-pulse`} style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative text-center">
        <div className="mb-8">
          <img
            src={darkMode ? logoLight : logoDark}
            alt="Bhav Book Logo"
            className="h-16 w-auto mx-auto animate-pulse"
          />
        </div>

        <div className="relative">
          <div className="w-12 h-12 border-4 border-sky-200 dark:border-sky-800 rounded-full animate-spin-slow mx-auto">
            <div className="absolute top-0 left-0 w-12 h-12 border-4 border-transparent border-t-sky-600 rounded-full animate-spin-slow"></div>
          </div>
        </div>

        <p className={`mt-6 text-lg font-medium ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        } animate-pulse`}>
          Please wait a minute ...
        </p>

        <div className="flex justify-center space-x-1 mt-4">
          <div className="w-2 h-2 bg-sky-600 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-sky-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-sky-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default AppLoader;
