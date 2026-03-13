import React, { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import ServicesHeader from '../components/layout/ServicesHeader';
import DataGrid from '../components/services/DataGrid';
import CartDrawer from '../components/cart/CartDrawer';
import PromoBanner from '../components/layout/PromoBanner';
import { Menu, XCircle, Home, LogOut, FileText } from 'lucide-react';

const ServicesPanel = ({ onNavigateHome, onNavigateOrders, onLogout }) => {
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
        <div className="h-14 bg-[#003d7a] flex items-center px-6 border-b border-[#002b5e] shrink-0 z-40 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-32 h-32 bg-[#ffce00]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#ffce00]"></div>
          <div className="flex items-center gap-4 relative z-10">
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

            <div className="h-4 w-px bg-slate-700 mx-2 hidden sm:block"></div>

            <button
              onClick={onNavigateOrders}
              className="p-2 text-slate-300 hover:text-white hover:bg-[#ffce00] hover:text-[#003d7a] rounded-xl transition-all flex items-center gap-2 group"
              title="Ver Mis Pedidos"
            >
              <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden md:inline transition-colors">Mis Pedidos</span>
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

        {/* Unified Sticky Header System - No Lines, Pure Floating Info */}
        <div className="shrink-0 sticky top-0 z-30 bg-white/90 backdrop-blur-xl shadow-lg shadow-slate-200/50">
          {/* Layer 1: Promo Banner (Branding) */}
          <PromoBanner />

          {/* Layer 2: Global Search / Actions Header - Border removed */}
          <div className="">
            <ServicesHeader onCartClick={() => setCartOpen(true)} />
          </div>

          {/* Layer 3: Filter Indicator Section - No Background/Border, just floating info */}
          <div className="px-4 sm:px-6 md:px-8 py-2 pb-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3 px-1">
                <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse"></span>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Resultados Filtrados: <span className="text-brand-red">MICHELIN</span>
                </span>
                <XCircle className="w-4 h-4 text-slate-300 cursor-pointer hover:text-brand-red transition-colors" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic px-3 py-1">
                Sincronización Cloud: 10:30 AM
              </span>
            </div>
          </div>
        </div>

        {/* Scrollable Data Area - Single Scroll System */}
        <div className="flex-1 overflow-auto custom-scrollbar bg-transparent">
          <div className="w-full mx-auto animate-slide-up p-4 sm:p-6 md:p-8 pt-4">
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
