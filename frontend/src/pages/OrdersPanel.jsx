import React from 'react';
import { Home, LogOut, Truck } from 'lucide-react';
import OrdersGrid from '../components/orders/OrdersGrid';

const OrdersPanel = ({ onNavigateHome, onNavigateServices, onLogout, user }) => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans antialiased relative">
      {/* Background ambient accents for specialized look */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-red/5 rounded-full blur-[120px] pointer-events-none -z-0"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-blue/5 rounded-full blur-[100px] pointer-events-none -z-0"></div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">

        {/* Universal Header Overlay (PC & Mobile) */}
        <div className="h-14 bg-[#003d7a] flex items-center px-6 border-b border-[#002b5e] shrink-0 z-40 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-32 h-32 bg-[#ffce00]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#ffce00]"></div>
          
          <div className="flex items-center gap-4 relative z-10">
            {/* Home button commented out as per request */}
            {/* 
            <button
              onClick={onNavigateHome}
              className="p-2 -ml-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all flex items-center gap-2 group"
              title="Volver al Menú"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden sm:inline">Menú Principal</span>
            </button>

            <div className="h-4 w-px bg-slate-400 mx-2 hidden sm:block"></div>
            */}

            <button
              onClick={onNavigateServices}
              className="p-2 text-slate-300 hover:text-white hover:bg-[#ffce00] hover:text-[#003d7a] rounded-xl transition-all flex items-center gap-2 group"
              title="Consultar Existencias"
            >
              <Truck className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden sm:inline transition-colors">Consultar Existencias</span>
            </button>
          </div>

          <div className="ml-auto flex items-center gap-6 relative z-10">
            <div className="h-4 w-px bg-slate-700 hidden sm:block"></div>
            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right">
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none mb-1">Bienvenido(a)</p>
                <p className="text-[10px] font-bold text-white uppercase tracking-tight leading-none">{user?.UsuarioNombre || 'Consultor'}</p>
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

        {/* Scrollable Data Area - Single Scroll System */}
        <div className="flex-1 overflow-auto custom-scrollbar bg-transparent">
          <div className="w-full mx-auto space-y-8 animate-slide-up p-4 sm:p-6 md:p-8 pt-6 sm:pt-8 md:pt-10">
            <OrdersGrid user={user} onBack={onNavigateServices} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrdersPanel;
