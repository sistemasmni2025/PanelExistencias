import React from 'react';
import { Search, Settings, HelpCircle, XCircle, FileSpreadsheet, PlusCircle, Download, ShoppingCart } from 'lucide-react';

const ServicesHeader = () => {
  return (
    <div className="p-4 sm:p-6 bg-white">
      
      {/* Top action row - High Impact & Compact */}
      <div className="flex items-center justify-between gap-4 mb-4">
        {/* Search Input - Main Focus Now */}
        <div className="flex-1 relative group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400 group-focus-within:text-brand-blue transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Buscar por descripción, marca o código..." 
            className="block w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-brand-blue/10 focus:border-brand-blue transition-all text-sm font-medium shadow-sm hover:bg-slate-100/50"
          />
        </div>

        {/* Global Controls & Cart */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200">
            <button className="p-2 text-slate-500 hover:text-brand-blue hover:bg-white rounded-lg transition-all">
              <Settings className="w-5 h-5" />
            </button>
            <button className="p-2 text-slate-500 hover:text-brand-blue hover:bg-white rounded-lg transition-all">
              <FileSpreadsheet className="w-5 h-5" />
            </button>
            <button className="p-2 text-slate-500 hover:text-brand-blue hover:bg-white rounded-lg transition-all">
              <HelpCircle className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-4 bg-white p-1.5 pr-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div className="relative">
              <div className="p-2.5 bg-brand-red text-white rounded-xl shadow-lg shadow-brand-red/20 group-hover:scale-105 transition-transform">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <span className="absolute -top-1.5 -right-1.5 bg-slate-900 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                0
              </span>
            </div>
            <div className="hidden md:block">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Total</p>
              <p className="text-xs font-bold text-slate-700">$0.00</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ServicesHeader;
