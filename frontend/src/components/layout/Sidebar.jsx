import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronRight, Filter, X, Settings, Search, Check } from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen, filters, onFilterChange }) => {
  // Mock data for the sidebar accordion from Image 2
  const categories = [
    {
      id: 1,
      title: 'MARCAS (AUTO/CAM)',
      isOpen: true,
      items: [
        'MICHELIN', 'BFGOODRICH', 'UNIROYAL', 'ASOCIADAS', 'OTRAS MARCAS',
        'ROVELO', 'CONTINENTAL', 'FRONWAY', 'TOYO', 'LANVIGATOR', 'INDONESIA'
      ]
    },
    {
      id: 2,
      title: 'MARCAS (CAMIÓN)',
      isOpen: false,
      items: ['TAURUS', 'CONTINENTAL', 'MICHELIN']
    },
    {
      id: 3,
      title: 'CLASE DE LLANTA',
      isOpen: false,
      items: ['Auto / Camioneta', 'Camión', 'MueveTierra', 'Industrial', 'Agrícola', 'Camaras / Corbatas', 'Motocicleta']
    }
  ];

  const [expandedCats, setExpandedCats] = useState(
    categories.reduce((acc, cat) => ({ ...acc, [cat.id]: cat.isOpen }), {})
  );

  const toggleCat = (id) => {
    setExpandedCats(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (isOpen && (event.key === 'Enter' || event.key === 'Escape')) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, setIsOpen]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container - Light E-commerce style */}
      <aside
        ref={sidebarRef}
        className={`
          fixed inset-y-0 left-0 z-50
          w-[280px] bg-white text-slate-800 flex flex-col border-r border-slate-200 shadow-2xl transition-transform duration-300 ease-in-out shrink-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Header mobile */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 lg:hidden">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#003d7a]" />
            <h2 className="text-sm font-black text-[#003d7a] uppercase tracking-wider">Filtros</h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-slate-500 hover:text-brand-red bg-white p-1 rounded-md shadow-sm border border-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">

          {/* Active Filters Summary */}
          <div className="p-5 border-b border-slate-100 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[12px] font-black text-slate-800 uppercase tracking-widest">Filtros Activos</h3>
              <button
                onClick={() => {
                  onFilterChange({ ancho: '', serie: '', rin: '', nombre: '', marca: 'INICIO' });
                  setIsOpen(false);
                }}
                className="text-[10px] font-black text-brand-blue uppercase tracking-wider hover:underline"
              >
                Limpiar Todo
              </button>
            </div>

            <label 
              onClick={(e) => {
                e.preventDefault();
                onFilterChange({ soloConExistencias: !filters.soloConExistencias });
                setIsOpen(false);
              }}
              className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-slate-50 border border-transparent transition-colors mb-2"
            >
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.soloConExistencias ? 'bg-[#003d7a] border-[#003d7a]' : 'bg-white border-slate-300'}`}>
                {filters.soloConExistencias && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
              <span className="text-[13px] font-bold text-slate-700 group-hover:text-[#003d7a] transition-colors">Solo con stock disponible</span>
            </label>

            <label 
               onClick={(e) => {
                 e.preventDefault();
                 onFilterChange({ isGamma: !filters.isGamma });
                 setIsOpen(false);
               }}
               className="flex items-center gap-3 cursor-pointer group p-2 rounded-lg hover:bg-slate-50 border border-transparent transition-colors"
            >
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.isGamma ? 'bg-green-600 border-green-600' : 'bg-white border-slate-300'}`}>
                {filters.isGamma && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
              <span className="text-[13px] font-bold text-slate-700 group-hover:text-green-700 transition-colors">Solo productos Gamma</span>
            </label>
          </div>

          {/* Medidas (Technical Filters) */}
          <div className="p-5 border-b border-slate-100">
            <h3 className="text-[12px] font-black text-slate-800 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Settings className="w-4 h-4 text-slate-400" /> Búsqueda por Medida
            </h3>
            <div className="space-y-4">
              <div className="relative">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider absolute -top-2 left-2 bg-white px-1">Ancho</label>
                <input
                  type="text"
                  placeholder="Ej. 275"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-[13px] font-bold text-slate-800 focus:bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-all placeholder:text-slate-300 placeholder:font-normal"
                  value={filters.ancho}
                  onChange={(e) => onFilterChange({ ancho: e.target.value })}
                />
              </div>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider absolute -top-2 left-2 bg-white px-1">Serie</label>
                  <input
                    type="text"
                    placeholder="Ej. 80"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-[13px] font-bold text-slate-800 focus:bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-all placeholder:text-slate-300 placeholder:font-normal"
                    value={filters.serie}
                    onChange={(e) => onFilterChange({ serie: e.target.value })}
                  />
                </div>
                <div className="relative flex-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider absolute -top-2 left-2 bg-white px-1">Rin</label>
                  <input
                    type="text"
                    placeholder="Ej. 22.5"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 px-3 text-[13px] font-bold text-slate-800 focus:bg-white focus:border-brand-blue focus:ring-1 focus:ring-brand-blue outline-none transition-all placeholder:text-slate-300 placeholder:font-normal"
                    value={filters.rin}
                    onChange={(e) => onFilterChange({ rin: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Categories Accordion */}
          <div className="p-2">
            {categories.map((cat) => (
              <div key={cat.id} className="mb-2">
                <button
                  onClick={() => toggleCat(cat.id)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  <span className="font-black text-[12px] text-slate-700 tracking-wider">{cat.title}</span>
                  {expandedCats[cat.id] ? (
                    <ChevronDown className="w-4 h-4 text-brand-blue" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {/* Expanded items as Radio-style buttons */}
                <div className={`overflow-hidden transition-all duration-300 ease-in-out px-2 ${expandedCats[cat.id] ? 'max-h-[500px] mt-1' : 'max-h-0'}`}>
                  <div className="space-y-1">
                    {cat.items.map((item, idx) => {
                      const isActive = filters.marca === item;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            onFilterChange({ marca: isActive ? 'INICIO' : item });
                            setIsOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 text-left px-3 py-2 rounded-lg text-[13px] transition-all ${isActive
                              ? 'bg-blue-50 text-[#003d7a] font-black'
                              : 'text-slate-600 font-medium hover:bg-slate-50 hover:text-slate-900'
                            }`}
                        >
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${isActive ? 'border-[#003d7a]' : 'border-slate-300'}`}>
                            {isActive && <div className="w-2 h-2 rounded-full bg-[#003d7a]"></div>}
                          </div>
                          {item}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;
