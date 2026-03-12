import React from 'react';
import { Truck, ShoppingCart, BarChart3, Settings, ShieldCheck, FileText, ArrowRight } from 'lucide-react';

const HomeDashboard = ({ onNavigate }) => {
  const panels = [
    { 
      id: 'services', 
      title: 'Servicios Automotrices', 
      description: 'Gestión de llantas, rines, y servicios rápidos en piso.', 
      icon: Truck, 
      color: 'bg-brand-red' 
    },
    { 
      id: 'orders', 
      title: 'Mis Pedidos', 
      description: 'Consultar status, facturas y detalle de todos los pedidos realizados.', 
      icon: ShoppingCart, 
      color: 'bg-[#ffce00] text-[#002b5e]' 
    },
    { 
      id: 'reports', 
      title: 'Reportería e Inventario', 
      description: 'Manejo de existencias masivas e inteligencia de negocio.', 
      icon: BarChart3, 
      color: 'bg-purple-600' 
    },
    { 
      id: 'admin', 
      title: 'Administración del Sistema', 
      description: 'Gestión de sucursales, usuarios, y configuraciones globales.', 
      icon: Settings, 
      color: 'bg-slate-700' 
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 md:p-12 animate-fade-in relative z-0">
      
      {/* Background ambient accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-3xl pointer-events-none -z-10"></div>
      
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            Bienvenido al <span className="text-brand-red">Sistema Nieto</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-500 mt-2">
            Selecciona un panel para comenzar a trabajar.
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
          {panels
            .filter(panel => panel.id === 'services' || panel.id === 'orders')
            .map((panel, idx) => {
            const Icon = panel.icon;
            return (
              <div 
                key={panel.id}
                onClick={() => onNavigate(panel.id)}
                className="group relative bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 cursor-pointer overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}
              >
                {/* Hover gradient background mask */}
                <div className="absolute inset-0 bg-gradient-to-br from-white to-slate-50 opacity-100 group-hover:opacity-0 transition-opacity duration-500 z-0"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white to-brand-lightblue/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
                
                <div className="relative z-10 flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                  <div className={`${panel.color.includes('text') ? panel.color : panel.color + ' text-white'} p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg shadow-black/10 group-hover:scale-110 transition-transform duration-500 flex-shrink-0`}>
                    <Icon className="w-6 h-6 sm:w-8 sm:h-8" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-800 mb-2 group-hover:text-brand-blue transition-colors">
                      {panel.title}
                    </h3>
                    <p className="text-sm sm:text-base text-slate-500 leading-relaxed mb-4 sm:mb-6">
                      {panel.description}
                    </p>
                    <div className="flex items-center text-xs sm:text-sm font-semibold text-brand-red uppercase tracking-wider group-hover:translate-x-2 transition-transform duration-300">
                      Entrar al Módulo <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
