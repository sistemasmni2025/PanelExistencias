import React from 'react';

const TopTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'existencias', label: '1. Selección y Existencias' },
    { id: 'solicitud', label: '2. Sol. Compra Actual' },
    { id: 'status', label: '3. Status de Compras' },
    { id: 'primas', label: '5. Primas y FDN' },
  ];

  return (
    <div className="bg-white border-b border-slate-200 px-4 sm:px-6 overflow-x-auto custom-scrollbar-hide scroll-smooth">
      <div className="flex gap-4 sm:gap-8 min-w-max">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              relative py-3 sm:py-4 text-[10px] sm:text-xs font-bold tracking-wider uppercase transition-all duration-300 whitespace-nowrap
              ${activeTab === tab.id 
                ? 'text-brand-red' 
                : 'text-slate-400 hover:text-slate-600'
              }
            `}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-brand-red rounded-t-full animate-fadeIn" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TopTabs;
