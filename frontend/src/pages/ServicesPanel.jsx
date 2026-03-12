import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import ServicesHeader from '../components/layout/ServicesHeader';
import DataGrid from '../components/services/DataGrid';
import CartDrawer from '../components/cart/CartDrawer';
import { Menu, XCircle, Home, LogOut } from 'lucide-react';

const ServicesPanel = ({ onNavigateHome, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans antialiased relative">
      {/* Background ambient accents for specialized look */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-red/5 rounded-full blur-[120px] pointer-events-none -z-0"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-blue/5 rounded-full blur-[100px] pointer-events-none -z-0"></div>

      {/* Sidebar - Now with mobile support */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">

        {/* Universal Header Overlay to show toggle button (PC & Mobile) */}
        <div className="h-14 bg-slate-900 flex items-center px-6 border-b border-slate-700 shrink-0 z-40 shadow-xl">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all flex items-center gap-3 group"
            >
              <Menu className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden sm:inline">Filtros</span>
            </button>

            <div className="h-4 w-px bg-slate-700 mx-2 hidden sm:block"></div>

            <button
              onClick={onNavigateHome}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all flex items-center gap-2 group"
              title="Volver al Menú"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          <div className="ml-auto flex items-center gap-6">
            <div className="h-4 w-px bg-slate-700 hidden sm:block"></div>
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Bienvenido(a)</p>
                <p className="text-[10px] font-bold text-white uppercase tracking-tight leading-none">Administrador</p>
              </div>
              <button
                onClick={onLogout}
                className="p-2 bg-brand-red text-white hover:bg-red-800 rounded-xl shadow-lg shadow-brand-red/20 transition-all group"
                title="Cerrar Sesión"
              >
                <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Global sticky header with search/actions */}
        <div className="shrink-0 bg-white/80 backdrop-blur-xl border-b border-slate-200 z-30 shadow-sm">
          <ServicesHeader onCartClick={() => setCartOpen(true)} />
        </div>

        {/* Scrollable Data Area - Single Scroll System */}
        <div className="flex-1 overflow-auto custom-scrollbar bg-transparent">
          <div className="w-full mx-auto space-y-8 animate-slide-up p-4 sm:p-6 md:p-8 pt-0 sm:pt-0 md:pt-0">
            {/* Filter Indicator Section - Now with pt-8 added specifically here */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 sm:pt-6 md:pt-8">
              <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse"></span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Resultados Filtrados: <span className="text-brand-red">MICHELIN</span>
                </span>
                <XCircle className="w-4 h-4 text-slate-300 cursor-pointer hover:text-brand-red transition-colors" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic bg-slate-100 px-3 py-1 rounded-lg">
                Sincronización Cloud: 10:30 AM
              </span>
            </div>

            <DataGrid />
          </div>
        </div>
      </main>

      {/* Slide-over Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default ServicesPanel;
