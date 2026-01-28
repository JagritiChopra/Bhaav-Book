import React from 'react';
import { useSelector } from 'react-redux';

const ProfileItem = ({ icon, label, value }) => {
  const { darkMode } = useSelector((state) => state.theme);
  
  return (
    <div className="flex items-start">
      <div className={`flex-shrink-0 rounded-full p-1.5 ${darkMode ? 'bg-blue-900/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
        {icon}
      </div>
      <div className="ml-3.5">
        <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-base font-medium text-slate-900 dark:text-slate-200">{value}</p>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, unit = "", icon }) => {
  const { darkMode } = useSelector((state) => state.theme);
  
  return (
    <div className={`rounded-xl p-4 flex items-center ${darkMode ? 'bg-slate-700/30' : 'bg-slate-50'}`}>
      <div className={`flex-shrink-0 rounded-full p-2 ${darkMode ? 'bg-blue-800/30 text-blue-300' : 'bg-blue-100 text-blue-600'}`}>
        {icon}
      </div>
      <div className="ml-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
        <p className="text-md font-semibold text-slate-900 dark:text-blue-100">
          {value} {unit && <span className="text-base font-normal text-slate-500 dark:text-slate-400">{unit}</span>}
        </p>
      </div>
    </div>
  );
};

export { ProfileItem, StatCard };