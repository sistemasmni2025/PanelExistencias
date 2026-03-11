import React, { useState } from 'react';
import HomeDashboard from '../pages/HomeDashboard';
import ServicesPanel from '../pages/ServicesPanel';

const DashboardLayout = ({ onLogout }) => {
  const [activeView, setActiveView] = useState('services');

  return (
    <div className="h-screen w-full relative bg-slate-50">
      
      {/* Navigation Layer */}
      {activeView === 'home' && (
        <HomeDashboard onNavigate={(id) => setActiveView(id)} />
      )}

      {activeView === 'services' && (
        <ServicesPanel 
          onNavigateHome={() => setActiveView('home')} 
          onLogout={onLogout} 
        />
      )}
    </div>
  );
};

export default DashboardLayout;
