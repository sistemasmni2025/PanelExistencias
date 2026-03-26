import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronRight, Filter, X, Settings, Search, Check } from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen, filters, onFilterChange }) => {
  // categories according to user screenshots and missing brands
  const categories = [
    {
      id: 1,
      name: 'marca',
      title: 'MARCAS (AUTO/CAM)',
      isOpen: true,
      items: [
        'MICHELIN', 'BFGOODRICH', 'UNIROYAL', 'BFGOODRICH / UNIROYAL (MTO)', 'OTRAS MARCAS',
        'ROVELO', 'CONTINENTAL', 'FRONWAY', 'TOYO', 'LANVIGATOR', 'BRIDGESTONE', 'FIRESTONE', 'INDONESIA'
      ]
    },
    {
      id: 2,
      name: 'marca',
      title: 'MARCAS (CAMIÓN)',
      isOpen: false,
      items: ['TAURUS', 'CONTINENTAL', 'MICHELIN', 'BFGOODRICH', 'UNIROYAL', 'OTRAS MARCAS']
    },
    {
      id: 3,
      name: 'clase',
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
                  onFilterChange({ ancho: '', serie: '', rin: '', nombre: '', marca: ['INICIO'], clase: '' });
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
              }}
              className={`flex items-center gap-3 cursor-pointer group p-2 rounded-lg transition-colors mb-2 border ${
                filters.soloConExistencias ? 'bg-yellow-101 border-yellow-400 font-bold' : 'hover:bg-slate-50 border-transparent'
              }`}
            >
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.soloConExistencias ? 'bg-[#003d7a] border-[#003d7a]' : 'bg-white border-slate-300'}`}>
                {filters.soloConExistencias && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
              <span className={`text-[13px] text-slate-700 transition-colors ${filters.soloConExistencias ? 'text-[#003d7a]' : 'group-hover:text-[#003d7a]'}`}>Solo con stock disponible</span>
            </label>

            <label 
               onClick={(e) => {
                 e.preventDefault();
                 onFilterChange({ isGamma: !filters.isGamma });
               }}
               className={`flex items-center gap-3 cursor-pointer group p-2 rounded-lg transition-colors border ${
                 filters.isGamma ? 'bg-yellow-101 border-yellow-400 font-bold' : 'hover:bg-slate-50 border-transparent'
               }`}
            >
              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filters.isGamma ? 'bg-green-600 border-green-600' : 'bg-white border-slate-300'}`}>
                {filters.isGamma && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
              <span className={`text-[13px] text-slate-700 transition-colors ${filters.isGamma ? 'text-green-700' : 'group-hover:text-green-700'}`}>Solo productos Gamma</span>
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
                  className={`w-full border rounded-xl py-2.5 px-3 text-[13px] font-bold text-slate-800 focus:ring-1 focus:ring-brand-blue outline-none transition-all placeholder:text-slate-300 placeholder:font-normal ${
                    filters.ancho ? 'bg-yellow-100 border-yellow-400' : 'bg-slate-50 border-slate-200 focus:bg-white focus:border-brand-blue'
                  }`}
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
                    className={`w-full border rounded-xl py-2.5 px-3 text-[13px] font-bold text-slate-800 focus:ring-1 focus:ring-brand-blue outline-none transition-all placeholder:text-slate-300 placeholder:font-normal ${
                      filters.serie ? 'bg-yellow-100 border-yellow-400' : 'bg-slate-50 border-slate-200 focus:bg-white focus:border-brand-blue'
                    }`}
                    value={filters.serie}
                    onChange={(e) => onFilterChange({ serie: e.target.value })}
                  />
                </div>
                <div className="relative flex-1">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider absolute -top-2 left-2 bg-white px-1">Rin</label>
                  <input
                    type="text"
                    placeholder="Ej. 22.5"
                    className={`w-full border rounded-xl py-2.5 px-3 text-[13px] font-bold text-slate-800 focus:ring-1 focus:ring-brand-blue outline-none transition-all placeholder:text-slate-300 placeholder:font-normal ${
                      filters.rin ? 'bg-yellow-100 border-yellow-400' : 'bg-slate-50 border-slate-200 focus:bg-white focus:border-brand-blue'
                    }`}
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
                <div className={`overflow-hidden transition-all duration-[400ms] ease-in-out px-2 ${expandedCats[cat.id] ? 'max-h-[1200px] mt-1' : 'max-h-0'}`}>
                  <div className="space-y-1 pb-4">
                    {cat.items.map((item, idx) => {
                      const activeMarca = Array.isArray(filters.marca) ? filters.marca : [filters.marca];
                      const isActive = cat.name === 'marca' 
                        ? activeMarca.includes(item)
                        : filters[cat.name] === item;

                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            if (cat.name === 'marca') {
                                let newBrands;
                                if (activeMarca.includes(item)) {
                                    newBrands = activeMarca.filter(b => b !== item);
                                    if (newBrands.length === 0) newBrands = ['INICIO'];
                                } else {
                                    newBrands = activeMarca.filter(b => b !== 'INICIO');
                                    newBrands.push(item);
                                }
                                onFilterChange({ marca: newBrands });
                            } else {
                                onFilterChange({ [cat.name]: isActive ? '' : item });
                            }
                          }}
                          className={`w-full flex items-center gap-3 text-left px-4 py-2.5 rounded-xl text-[13px] transition-all border mb-1 ${
                            isActive
                              ? 'bg-[#FFC107] text-slate-950 font-black border-yellow-600 shadow-sm'
                              : 'bg-white text-slate-600 font-bold border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                            isActive ? 'bg-white border-yellow-600' : 'bg-white border-slate-300'
                          }`}>
                            {isActive && <div className="w-2.5 h-2.5 rounded-full bg-[#FFC107]"></div>}
                          </div>
                          <span className="uppercase tracking-tight">{item}</span>
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
