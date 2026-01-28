import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Sun, Moon, User, LogOut, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from 'react-redux';
import { auth } from '../../config/firebase';
import SearchBox from "../SearchBox";
import logoDark from "../../assets/logo.png";
import logoLight from "../../assets/logo-light.png";
import { API_BASE_URL } from "../../config/api";
import { logout, verifyToken, setAuthChecked } from '../../store/slices/authSlice';
import { toggleTheme, setTheme } from '../../store/slices/themeSlice';

export default function Navbar() {
  const dispatch = useDispatch();
  const { 
    isAuthenticated, 
    isCheckingAuth, 
    isInitialLoad,
    hasCheckedAuth
  } = useSelector((state) => state.auth);
  const { darkMode } = useSelector((state) => state.theme);

  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearchResults(false);
      setHighlightedIndex(-1);
      return;
    }

    setSearchLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/search/users?q=${encodeURIComponent(query.trim())}`);
      const data = await response.json();

      if (response.ok) {
        setSearchResults(data.users || []);
        setShowSearchResults(true);
        setHighlightedIndex(-1);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
      setHighlightedIndex(-1);
    }
    setSearchLoading(false);
  };

  const handleSearchInput = (query) => {
    setSearchQuery(query);

    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      if (query.length >= 2) {
        handleSearch(query);
      } else {
        setSearchResults([]);
        setShowSearchResults(false);
        setHighlightedIndex(-1);
      }
    }, 300);
  };

  const handleSelectUser = (user) => {
    setShowSearchResults(false);
    setSearchQuery("");
    setHighlightedIndex(-1);
    navigate(`/profile/${user.id}`);
  };

  const handleKeyDown = (e) => {
    if (!showSearchResults || searchResults.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < searchResults.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : searchResults.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < searchResults.length) {
        handleSelectUser(searchResults[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      setShowSearchResults(false);
      setHighlightedIndex(-1);
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [searchResults]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-container')) {
        setShowSearchResults(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');

    if (auth.currentUser) {
      auth.signOut().catch(console.error);
    }
    setShowDropdown(false);

    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
  };

  const handleHomeClick = () => {
    navigate("/");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const initializeApp = async () => {
      const savedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

      if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
        dispatch(setTheme(true));
      } else {
        dispatch(setTheme(false));
      }

      if (!hasCheckedAuth) {
        const token = localStorage.getItem('authToken');
        if (token) {
          try {
            await dispatch(verifyToken()).unwrap();
          } catch (error) {
            localStorage.removeItem('authToken');
            dispatch(setAuthChecked());
          }
        } else {
          dispatch(setAuthChecked());
        }
      }
    };

    initializeApp();
  }, [dispatch, hasCheckedAuth]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "authToken") {
        const token = localStorage.getItem('authToken');
        if (token) {
          dispatch(verifyToken());
        } else {
          dispatch(logout());
        }
      }
    };

    const handleAuthChange = () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        dispatch(verifyToken());
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("authChanged", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChanged", handleAuthChange);
    };
  }, [dispatch]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const isActive = (path) => location.pathname === path;
  const navBgClass = () => (darkMode ? "bg-gray-900" : "bg-white");

  if (isInitialLoad || isCheckingAuth) {
    return (
      <nav className={`${navBgClass()} fixed top-0 left-0 w-full z-50 py-2 shadow-md shadow-gray-300 dark:shadow-gray-800`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center space-x-2" aria-label="Homepage">
                <img
                  src={darkMode ? logoLight : logoDark}
                  alt="Bhav Book Logo"
                  className="h-10 w-auto transition-all duration-300"
                />
              </Link>
            </div>
            
            <div className="hidden lg:flex items-center space-x-4">
              <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
              <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>

            <div className="lg:hidden">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className={`${navBgClass()} fixed top-0 left-0 w-full z-50 py-2 shadow-md shadow-gray-300 dark:shadow-gray-800`}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center space-x-2" aria-label="Homepage">
              <img
                src={darkMode ? logoLight : logoDark}
                alt="Bhav Book Logo"
                className="h-10 w-auto transition-all duration-300"
              />
            </Link>
          </div>

          <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 search-container">
            <div className="relative w-80">
              <SearchBox
                onSearch={handleSearch}
                onInputChange={handleSearchInput}
                placeholder="Search users by name or email..."
                value={searchQuery}
                darkMode={darkMode}
                onKeyDown={handleKeyDown}
                inputRef={inputRef}
              />
              
              {showSearchResults && (
                <div className={`absolute top-full left-0 right-0 mt-1 rounded-lg shadow-lg border z-50 max-h-96 overflow-y-auto ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                  {searchLoading ? (
                    <div className="p-4 text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-sky-600 mx-auto"></div>
                      <p className={`mt-2 text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                        Searching...
                      </p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.map((user, idx) => (
                        <button
                          key={user.id}
                          onClick={() => handleSelectUser(user)}
                          onMouseEnter={() => setHighlightedIndex(idx)}
                          className={`w-full text-left px-4 py-3 flex items-center space-x-3 transition-colors ${highlightedIndex === idx ? "bg-sky-100 dark:bg-sky-700" : "hover:bg-gray-50 dark:hover:bg-gray-700"} ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                        >
                          <div className="flex-shrink-0">
                            {user.profile?.avatar ? (
                              <img
                                src={user.profile.avatar}
                                alt={user.fullName}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-900 flex items-center justify-center">
                                <span className="text-sky-600 dark:text-sky-400 text-sm font-medium">
                                  {user.fullName?.charAt(0)?.toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{user.fullName}</p>
                            <p className={`text-sm truncate ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                              {user.email}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center">
                      <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                        No users found
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-1">
            <button
              onClick={handleHomeClick}
              className={`px-3 py-2 rounded-md font-medium transition-colors duration-200 ${darkMode ? (isActive("/") ? "text-sky-400" : "text-gray-300 hover:text-sky-400") : (isActive("/") ? "text-sky-600" : "text-gray-700 hover:text-sky-600")}`}
            >
              Home 
            </button>

            {isAuthenticated && (
              <>
                <NavLink to="/journal" active={isActive("/journal")} darkMode={darkMode}>
                  Journal
                </NavLink>
                <NavLink to="/insights" active={isActive("/insights")} darkMode={darkMode}>
                  Insights
                </NavLink>
              </>
            )}

            <button
              onClick={handleThemeToggle}
              className={`cursor-pointer mx-2 p-2 rounded-full transition-colors ${darkMode ? "bg-gray-800 text-yellow-300 hover:bg-gray-700" : "bg-sky-50 text-sky-600 hover:bg-sky-100"}`}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {isAuthenticated ? (
              <div className="relative ml-2" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-1 px-4 py-2 rounded-full font-medium bg-sky-600 text-white hover:bg-sky-700 hover:shadow-md transition-all"
                  aria-expanded={showDropdown}
                >
                  <User size={16} />
                  <span>Account</span>
                  <ChevronDown size={14} className={`transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg border z-50 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
                    >
                      <div className="py-1">
                        <Link
                          to="/profile"
                          className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium transition-colors ${darkMode ? "text-gray-300 hover:bg-gray-700 hover:text-white" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"}`}
                          onClick={() => setShowDropdown(false)}
                        >
                          <User size={16} />
                          <span>Profile</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className={`flex items-center space-x-2 w-full text-left px-4 py-2 text-sm font-medium transition-colors ${darkMode ? "text-gray-300 hover:bg-gray-700 hover:text-white" : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"}`}
                        >
                          <LogOut size={16} />
                          <span>Logout</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="dark:bg-gray-600 dark:text-white ml-2 px-4 py-2 rounded-full font-medium bg-sky-50 text-sky-600 hover:bg-sky-100 dark:hover:bg-gray-700"
                  aria-current={isActive("/auth/login") ? "page" : undefined}
                >
                  Login
                </Link>
                <Link
                  to="/auth/signup"
                  className="ml-2 px-4 py-2 rounded-full font-medium bg-sky-600 text-white hover:bg-sky-700"
                  aria-current={isActive("/auth/signup") ? "page" : undefined}
                >
                  Signup
                </Link>
              </>
            )}
          </div>

          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={handleThemeToggle}
              className={`p-2 rounded-full transition-colors ${darkMode ? "bg-gray-800 text-yellow-300" : "bg-blue-100 text-sky-600"}`}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`focus:outline-none ${darkMode ? "text-white" : "text-sky-600"}`}
              aria-expanded={isOpen}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                  <motion.div
                    key="x-icon"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.25 }}
                  >
                    <X className="w-6 h-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu-icon"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.25 }}
                  >
                    <Menu className="w-6 h-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ clipPath: "circle(0% at 90% 10%)" }}
            animate={{ clipPath: "circle(150% at 50% 20%)" }}
            exit={{ clipPath: "circle(0% at 90% 10%)" }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className={`lg:hidden absolute top-full w-full shadow-lg overflow-hidden z-40 ${darkMode ? "bg-gray-800" : "bg-white"}`}
          >
            <div className="flex flex-col items-start space-y-1 py-2 px-4">
              <div className="w-full mb-4 search-container">
                <SearchBox
                  onSearch={handleSearch}
                  onInputChange={handleSearchInput}
                  placeholder="Search users..."
                  value={searchQuery}
                  darkMode={darkMode}
                  onKeyDown={handleKeyDown}
                  inputRef={inputRef}
                />
                
                {showSearchResults && (
                  <div className={`mt-2 rounded-lg shadow-lg border max-h-64 overflow-y-auto ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"}`}>
                    {searchLoading ? (
                      <div className="p-3 text-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-sky-600 mx-auto"></div>
                        <p className={`mt-2 text-xs ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                          Searching...
                        </p>
                      </div>
                    ) : searchResults.length > 0 ? (
                      <div className="py-1">
                        {searchResults.map((user, idx) => (
                          <button
                            key={user.id}
                            onClick={() => {
                              handleSelectUser(user);
                              setIsOpen(false);
                            }}
                            onMouseEnter={() => setHighlightedIndex(idx)}
                            className={`w-full text-left px-3 py-2 flex items-center space-x-2 transition-colors ${highlightedIndex === idx ? "bg-sky-100 dark:bg-sky-700" : "hover:bg-gray-50 dark:hover:bg-gray-600"} ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                          >
                            <div className="flex-shrink-0">
                              {user.profile?.avatar ? (
                                <img
                                  src={user.profile.avatar}
                                  alt={user.fullName}
                                  className="w-6 h-6 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-sky-100 dark:bg-sky-900 flex items-center justify-center">
                                  <span className="text-sky-600 dark:text-sky-400 text-xs font-medium">
                                    {user.fullName?.charAt(0)?.toUpperCase()}
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate text-sm">{user.fullName}</p>
                              <p className={`text-xs truncate ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                {user.email}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 text-center">
                        <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                          No users found
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  handleHomeClick();
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 rounded-md font-medium transition-all duration-200 ${darkMode ? (isActive("/") ? "text-sky-400 bg-gray-700" : "text-gray-300 hover:bg-gray-700") : (isActive("/") ? "text-sky-600 bg-sky-50" : "text-gray-700 hover:bg-gray-50")}`}
              >
                Home
              </button>

              {isAuthenticated && (
                <>
                  <MobileNavLink
                    to="/journal"
                    active={isActive("/journal")}
                    darkMode={darkMode}
                    onClick={() => setIsOpen(false)}
                  >
                    Journal
                  </MobileNavLink>

                  <MobileNavLink
                    to="/insights"
                    active={isActive("/insights")}
                    darkMode={darkMode}
                    onClick={() => setIsOpen(false)}
                  >
                    Insights
                  </MobileNavLink>
                </>
              )}

              <div className={`w-full h-px ${darkMode ? "bg-gray-700" : "bg-gray-200"} my-2`}></div>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className={`w-full flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-50"}`}
                    onClick={() => setIsOpen(false)}
                    aria-current={isActive("/profile") ? "page" : undefined}
                  >
                    <User size={16} />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center space-x-2 text-left px-4 py-2 rounded-lg font-medium transition-all ${darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-50"}`}
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/auth/login"
                    className="w-full text-sky-600 dark:bg-gray-600 dark:text-white bg-sky-50 px-4 py-2 rounded-md font-medium hover:bg-sky-100 dark:hover:bg-gray-700"
                    onClick={() => setIsOpen(false)}
                    aria-current={isActive("/auth/login") ? "page" : undefined}
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth/signup"
                    className="w-full text-white bg-sky-600 px-4 py-2 rounded-md font-medium hover:bg-sky-700 hover:shadow-md"
                    onClick={() => setIsOpen(false)}
                    aria-current={isActive("/auth/signup") ? "page" : undefined}
                  >
                    Signup
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

function NavLink({ to, active, darkMode, children }) {
  return (
    <Link
      to={to}
      aria-current={active ? "page" : undefined}
      className={`px-3 py-2 rounded-md font-medium transition-colors duration-200 ${darkMode ? (active ? "text-sky-400" : "text-gray-300 hover:text-sky-400") : (active ? "text-sky-600" : "text-gray-700 hover:text-sky-600")}`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ to, active, darkMode, onClick, children }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`w-full text-left px-4 py-2 rounded-md font-medium transition-all duration-200 ${darkMode ? (active ? "text-sky-400 bg-gray-700" : "text-gray-300 hover:bg-gray-700") : (active ? "text-sky-600 bg-sky-50" : "text-gray-700 hover:bg-gray-50")}`}
    >
      {children}
    </Link>
  );
}