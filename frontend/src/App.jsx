import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import Navbar from "./components/Navbar/Navbar.jsx";
import Home from "./components/pages/Home";
import AuthPage from "./components/pages/AuthPage";
import ProfilePage from "./components/pages/ProfilePage";
import Footer from "./components/Footer.jsx";
import AppLoader from "./components/AppLoader";
import Journal from "./components/pages/JournalPage";
import ScrollToTop from "./components/ScrollToTop";
import { refreshFirebaseToken, checkTokenExpiration, setCredentials, logout } from './store/slices/authSlice';
import { API_BASE_URL } from './config/api';
import Insight from "./components/pages/InsightPage";

function AppContent() {
  const location = useLocation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const { darkMode } = useSelector((state) => state.theme);
  const { isAuthenticated, hasCheckedAuth } = useSelector((state) => state.auth);

  const isProfilePage = location.pathname.startsWith('/profile');

  useEffect(() => {
    let unsubscribe;

    if (!hasCheckedAuth) {
      unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const token = await user.getIdToken();
            localStorage.setItem('authToken', token);

            const response = await fetch(`${API_BASE_URL}/auth/profile`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            if (response.ok) {
              const data = await response.json();
              dispatch(setCredentials({ user: data.user, token }));
            }
          } catch (error) {
            console.error('Token refresh failed:', error);
            dispatch(logout());
          }
        } else {
          dispatch(logout());
        }
      });
    }

    const refreshInterval = setInterval(() => {
      if (isAuthenticated) {
        dispatch(refreshFirebaseToken());
      }
    }, 50 * 60 * 1000);

    const checkInterval = setInterval(() => {
      if (isAuthenticated) {
        dispatch(checkTokenExpiration());
      }
    }, 5 * 60 * 1000);

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
      clearInterval(refreshInterval);
      clearInterval(checkInterval);
    };
  }, [dispatch, hasCheckedAuth, isAuthenticated]);

  useEffect(() => {
    const handleLoading = () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };

    if (document.readyState === 'complete') {
      handleLoading();
    } else {
      window.addEventListener("load", handleLoading);
    }

    return () => window.removeEventListener("load", handleLoading);
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isAuthenticated) {
        dispatch(checkTokenExpiration());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    const handleFocus = () => {
      if (isAuthenticated) {
        dispatch(checkTokenExpiration());
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [dispatch, isAuthenticated]);

  if (isLoading) {
    return <AppLoader darkMode={darkMode} />;
  }

  return (
    <div className="min-h-screen w-full transition-colors duration-500 bg-gradient-to-b from-blue-100 via-white to-purple-100 dark:from-slate-900 dark:via-gray-900 dark:to-gray-800">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/:authType" element={<AuthPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/profile/:id" element={<ProfilePage />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/insights" element={<Insight />} />
      </Routes>
      {!isProfilePage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <AppContent />
    </Router>
  );
}

export default App;