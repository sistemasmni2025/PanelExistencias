import React, { useState } from 'react';
import Login from './components/auth/Login';
import DashboardLayout from './layouts/DashboardLayout';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

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
