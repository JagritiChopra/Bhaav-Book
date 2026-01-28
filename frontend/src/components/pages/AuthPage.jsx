import React from "react";
import { useParams, Navigate } from "react-router-dom";
import LoginForm from "../auth/Login";
import SignupForm from "../auth/Signup";

function AuthPage() {
  const { authType } = useParams();

  if (authType !== "login" && authType !== "signup") {
    return <Navigate to="/auth/login" />;
  }

  return (
    <div className="relative min-h-screen">
      {/* Unified seamless background for the entire page */}
      <div className="fixed inset-0 bg-gradient-to-b from-sky-100 via-sky-50 to-white dark:from-sky-950 dark:via-slate-900 dark:to-slate-900 z-0"></div>
      
      {/* Common background decorative elements that float across the entire page */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {/* Large blurred circles that provide subtle background interest */}
        <div className="absolute top-20 left-10 w-96 h-96 rounded-full bg-gradient-to-r from-sky-200 to-blue-200 dark:from-sky-700/30 dark:to-blue-700/20 blur-3xl opacity-30 dark:opacity-20 animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-96 h-96 rounded-full bg-gradient-to-r from-indigo-200 to-purple-200 dark:from-indigo-700/30 dark:to-purple-700/20 blur-3xl opacity-30 dark:opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/3 left-1/3 w-80 h-80 rounded-full bg-gradient-to-r from-sky-300 to-indigo-200 dark:from-sky-800/30 dark:to-indigo-700/20 blur-3xl opacity-20 dark:opacity-15 animate-pulse" style={{ animationDelay: "4s" }}></div>
        
        {/* Subtle radial gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(148,163,184,0.03)_0%,rgba(148,163,184,0)_70%)] dark:bg-[radial-gradient(ellipse_at_center,rgba(148,163,184,0.05)_0%,rgba(148,163,184,0)_70%)]"></div>
      </div>
      {/* Bubble decorations similar to Hero section */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute rounded-full bg-sky-200 dark:bg-sky-900 opacity-30 w-64 h-64 -top-10 -left-10"></div>
        <div className="absolute rounded-full bg-sky-200 dark:bg-sky-900 opacity-30 w-96 h-96 top-1/4 right-0 transform translate-x-1/3"></div>
        <div className="absolute rounded-full bg-sky-300 dark:bg-sky-900 opacity-20 w-80 h-80 bottom-0 left-1/4"></div>
        <div className="absolute rounded-full bg-sky-200 dark:bg-sky-900 opacity-20 w-72 h-72 bottom-10 right-10"></div>
        <div className="absolute rounded-full bg-sky-300 dark:bg-sky-900 opacity-25 w-48 h-48 top-1/2 left-1/3 transform -translate-x-1/2"></div>
      </div>
      
      
      <div className="relative z-10">
        {authType === "login" ? <LoginForm /> : <SignupForm />}
      </div>
    </div>
  );
}

export default AuthPage;