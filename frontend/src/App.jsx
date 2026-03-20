import React, { useState, useEffect } from 'react';
import Login from './components/auth/Login';
import DashboardLayout from './layouts/DashboardLayout';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('isAuthenticated') === 'true';
  });
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    sessionStorage.setItem('isAuthenticated', 'true');
    sessionStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('user');
  };

  // Activity Tracker for 5 minutes auto-logout
  useEffect(() => {
    if (!isAuthenticated) return;

    let timeoutId;
    const FIVE_MINUTES = 5 * 60 * 1000;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        handleLogout();
        // You can optionally add a basic alert to inform them they were logged out
        // alert("Sesión terminada por inactividad");
      }, FIVE_MINUTES);
    };

    // Attach listeners
    const events = ['load', 'mousemove', 'mousedown', 'click', 'scroll', 'keypress'];
    events.forEach(evt => window.addEventListener(evt, resetTimer));

    // Initialize timer for the first time
    resetTimer();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(evt => window.removeEventListener(evt, resetTimer));
    };
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen bg-background text-slate-800 font-sans selection:bg-brand-red selection:text-white">
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
        <DashboardLayout onLogout={handleLogout} user={user} />
      )}
    </div>
  );
}

export default App;
