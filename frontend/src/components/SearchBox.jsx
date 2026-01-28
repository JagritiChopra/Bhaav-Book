import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";

const SearchBox = ({
  onSearch,
  onInputChange,
  placeholder = "Search...",
  value,
  darkMode,
  onKeyDown,
  inputRef
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleInput = (e) => {
    if (onInputChange) onInputChange(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(value);
  };

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const isActive = isFocused || (value && value.length > 0);

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-center rounded-lg shadow-sm px-3 py-2 w-full transition-all duration-200 ${
        darkMode 
          ? `bg-gray-700 border ${isActive ? 'border-white  shadow-lg' : 'border-gray-600'}` 
          : `bg-white border ${isActive ? 'border-black shadow-lg' : 'border-gray-300'}`
      }`}
      role="search"
      aria-label="User Search"
    >
      <button
        type="submit"
        className={`transition-colors ${
          darkMode 
            ? `${isActive ? 'text-sky-400' : 'text-gray-400'} hover:text-sky-400` 
            : `${isActive ? 'text-sky-600' : 'text-gray-500'} hover:text-sky-600`
        } focus:outline-none`}
        aria-label="Search"
      >
        <FaSearch size={16} />
      </button>
      <input
        ref={inputRef}
        type="text"
        className={`ml-3 flex-1 border-none outline-none bg-transparent ${
          darkMode ? "text-gray-200 placeholder-gray-300" : "text-gray-800 placeholder-gray-400"
        }`}
        placeholder={placeholder}
        value={value}
        onChange={handleInput}
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-label="Search input"
        onKeyDown={onKeyDown}
        autoComplete="off"
      />
    </form>
  );
};

export default SearchBox;
