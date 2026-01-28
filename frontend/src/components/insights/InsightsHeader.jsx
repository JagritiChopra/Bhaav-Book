// src/components/insights/InsightsHeader.jsx
import { motion } from 'framer-motion';
import { Brain, Plus } from 'lucide-react';

export default function InsightsHeader({ darkMode, onCreateInsight }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between ">
      <div>
        <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Your Insights
        </h1>
        <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          AI-powered analysis of your emotional journey
        </p>
      </div>

      <button
        onClick={onCreateInsight}
        className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
      >
        <Plus size={20} className="mr-2" />
        Generate Insight
      </button>
    </div>
  );
}