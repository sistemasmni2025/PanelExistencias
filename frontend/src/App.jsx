import React, { useState } from 'react';
import Login from './components/auth/Login';
import DashboardLayout from './layouts/DashboardLayout';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Simulated login flow
  const handleLogin = (e) => {
    e?.preventDefault();
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen bg-background text-slate-800 font-sans selection:bg-brand-red selection:text-white">
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
        <DashboardLayout onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
