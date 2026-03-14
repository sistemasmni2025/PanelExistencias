import React, { useState } from 'react';
// import HomeDashboard from '../pages/HomeDashboard';
import ServicesPanel from '../pages/ServicesPanel';
import OrdersPanel from '../pages/OrdersPanel';

const DashboardLayout = ({ onLogout }) => {
  const [activeView, setActiveView] = useState('services');

  return (
    <div className="h-screen w-full relative bg-slate-50">
      
      {/* Navigation Layer - Home Disabled as per request */}
      {/* activeView === 'home' && (
        <HomeDashboard onNavigate={(id) => setActiveView(id)} />
      ) */}

      {activeView === 'services' && (
        <ServicesPanel 
          onNavigateHome={() => {/* setActiveView('home') - Disabled */}} 
          onNavigateOrders={() => setActiveView('orders')}
          onLogout={onLogout} 
        />
      )}

      {activeView === 'orders' && (
        <OrdersPanel 
          onNavigateHome={() => {/* setActiveView('home') - Disabled */}} 
          onNavigateServices={() => setActiveView('services')}
          onLogout={onLogout} 
        />
      )}
    </div>
  );
};

export default DashboardLayout;
