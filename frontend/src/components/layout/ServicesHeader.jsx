import React from 'react';
import { Search, ShoppingCart, XCircle } from 'lucide-react';

const ServicesHeader = ({ 
  onCartClick, 
  searchTerm, 
  onSearchChange, 
  cartCount = 0, 
  cartTotal = 0,
  filters = {},
  lastSync,
  onClearFilters 
}) => {
  return (
    <div className="py-2.5 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-200 shadow-sm relative z-20">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 xl:gap-6">
        
        {/* Search Input */}
        <div className={`w-full flex-1 relative flex shadow-sm rounded-lg overflow-hidden border transition-all min-w-[200px] ${
          searchTerm ? 'bg-yellow-50 border-yellow-400 focus-within:ring-yellow-400' : 'bg-white border-slate-300 focus-within:border-brand-blue focus-within:ring-brand-blue'
        }`}>
          <input 
            type="text" 
            placeholder="Buscar llantas, descripciones o códigos..." 
            className="block w-full px-4 py-2 bg-transparent text-slate-800 focus:outline-none text-[14px] font-medium placeholder:text-slate-400"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <button className={`px-5 flex items-center justify-center border-l transition-colors ${
            searchTerm ? 'bg-yellow-100 border-yellow-400 hover:bg-yellow-200' : 'bg-slate-50 border-slate-300 hover:bg-slate-100'
          }`}>
             <Search className={`h-4 w-4 ${searchTerm ? 'text-[#003d7a]' : 'text-slate-500'}`} />
          </button>
        </div>

        {/* Dynamic Center Space: Filters & Sync */}
        <div className="flex shrink-0 flex-col sm:flex-row items-start sm:items-center justify-end gap-4">
           
           {/* Active Filters */}
           {(() => {
             const brands = Array.isArray(filters.marca) ? filters.marca : [filters.marca];
             const isInicio = brands.length === 1 && brands[0] === 'INICIO';
             const hasActiveFilters = !isInicio || filters.clase || filters.ancho || filters.serie || filters.rin;
             const marcasDisplay = isInicio ? 'INICIO' : (brands.length > 2 ? `${brands.length} MARCAS` : brands.join(', '));

             return (
               <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border flex-1 sm:flex-none transition-colors ${
                 hasActiveFilters ? 'bg-yellow-400 border-yellow-500 shadow-md' : 'bg-slate-50 border-slate-100'
               }`}>
                  <span className={`w-2 h-2 rounded-full shrink-0 ${
                    hasActiveFilters ? 'bg-[#003d7a]' : 'bg-brand-red animate-pulse'
                  }`}></span>
                  <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 flex-wrap ${
                    hasActiveFilters ? 'text-slate-900' : 'text-slate-600'
                  }`}>
                    FILTRO: <span className={hasActiveFilters ? 'text-[#003d7a]' : 'text-brand-red'}>{marcasDisplay}</span>
                    {filters.clase && <span className="text-[#003d7a] opacity-70">/ {filters.clase}</span>}
                    {filters.ancho && <span className="bg-white/40 px-1 rounded">/ A: {filters.ancho}</span>}
                  </span>
                  {onClearFilters && (
                    <XCircle 
                      className="w-4 h-4 text-slate-400 hover:text-brand-red cursor-pointer transition-colors ml-1" 
                      onClick={onClearFilters}
                      title="Limpiar Filtros"
                    />
                  )}
               </div>
             );
           })()}

           {/* Sync Indicator */}
           {lastSync && (
             <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic whitespace-nowrap hidden md:block">
               Sincronización: {lastSync}
             </div>
           )}
        </div>

        {/* Global Controls & Cart */}
        <div className="flex items-center shrink-0 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <div 
            onClick={onCartClick}
            className="flex items-center gap-3 bg-white p-2 rounded-xl transition-all cursor-pointer group hover:bg-slate-50 border border-transparent hover:border-slate-200 w-full sm:w-auto justify-between sm:justify-start"
          >
            <div className="relative shrink-0">
              <div className="p-2 sm:p-2.5 bg-[#ffce00] text-[#002b5e] rounded-lg group-hover:scale-105 transition-transform flex items-center justify-center shadow-sm">
                <ShoppingCart className="w-5 h-5" />
              </div>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-red text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-[2px] border-white shadow-sm">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </div>
            <div className="text-right sm:text-left">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5 hidden sm:block">Mi Carrito</p>
               <p className="text-[15px] sm:text-[14px] font-black text-[#003d7a] leading-none">${cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ServicesHeader;
