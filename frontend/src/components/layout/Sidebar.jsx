import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronRight, Filter, X, Settings } from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  // Mock data for the sidebar accordion from Image 2
  const categories = [
    {
      id: 1,
      title: 'AUTO/CAM',
      isOpen: true,
      items: [
        'MICHELIN', 'BFGOODRICH', 'UNIROYAL', 'ASOCIADAS', 'OTRAS MARCAS', 
        'ROVELO', 'CONTINENTAL', 'FRONWAY', 'TOYO', 'LANVIGATOR', 'INDONESIA'
      ]
    },
    {
      id: 2,
      title: 'CAMION',
      isOpen: false,
      items: ['TAURUS', 'CONTINENTAL', 'MICHELIN']
    },
    {
      id: 3,
      title: 'CLASE',
      isOpen: false,
      items: ['Auto / Camioneta', 'Camión', 'MueveTierra', 'Industrial', 'Agrícola', 'Camaras / Corbatas', 'Motocicleta']
    }
  ];

  const [expandedCats, setExpandedCats] = useState(
    categories.reduce((acc, cat) => ({ ...acc, [cat.id]: cat.isOpen }), {})
  );
  
  const [activeItem, setActiveItem] = useState('MICHELIN');

  const toggleCat = (id) => {
    setExpandedCats(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Ref for the sidebar container to detect outside clicks
  const sidebarRef = useRef(null);

  // Effect to handle outside clicks and close the sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the sidebar is open, AND the click is completely outside our referenced aside
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Attach the listener
    document.addEventListener("mousedown", handleClickOutside);
    
    // Cleanup the listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden shadow-2xl"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container - Now fixed for all sizes to allow full-width table */}
      <aside 
        ref={sidebarRef}
        className={`
          fixed inset-y-0 left-0 z-50
          w-64 bg-[#002b5e] text-slate-300 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out shrink-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="p-4 bg-[#003d7a] border-b border-[#001f44] flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#ffce00]/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#ffce00]"></div>
          
          <div className="flex items-center gap-2 relative z-10">
            <Filter className="w-4 h-4 text-[#ffce00]" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Categorías</h2>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Advanced Technical Filters */}
        <div className="p-4 bg-[#001f44]/80 border-b border-[#001533]">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <Settings className="w-3 h-3 text-[#ffce00]" /> Filtros Técnicos
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Ancho</label>
              <input type="text" placeholder="0.00" className="w-full bg-[#001533] border border-[#003d7a] rounded-lg py-1.5 px-3 text-xs text-white focus:border-[#ffce00] focus:ring-1 focus:ring-[#ffce00] outline-none transition-all placeholder:text-slate-600" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Serie</label>
              <input type="text" placeholder="0" className="w-full bg-[#001533] border border-[#003d7a] rounded-lg py-1.5 px-3 text-xs text-white focus:border-[#ffce00] focus:ring-1 focus:ring-[#ffce00] outline-none transition-all placeholder:text-slate-600" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">Rin</label>
              <input type="text" placeholder="0.00" className="w-full bg-[#001533] border border-[#003d7a] rounded-lg py-1.5 px-3 text-xs text-white focus:border-[#ffce00] focus:ring-1 focus:ring-[#ffce00] outline-none transition-all placeholder:text-slate-600" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[9px] font-bold text-slate-400 uppercase ml-1">MSPN</label>
              <input type="text" placeholder="..." className="w-full bg-[#001533] border border-[#003d7a] rounded-lg py-1.5 px-3 text-xs text-white focus:border-[#ffce00] focus:ring-1 focus:ring-[#ffce00] outline-none transition-all placeholder:text-slate-600" />
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="w-3.5 h-3.5 rounded border-[#003d7a] bg-[#001533] text-[#ffce00] focus:ring-[#ffce00]/20" />
              <span className="text-[10px] font-bold text-slate-400 group-hover:text-amber-50 transition-colors">Solo con existencia</span>
            </label>
            <button className="text-[10px] font-black text-[#ffce00] uppercase tracking-tighter hover:text-white transition-colors">Limpiar</button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {categories.map((cat) => (
            <div key={cat.id} className="border-b border-[#001f44]">
              <button
                onClick={() => toggleCat(cat.id)}
                className="w-full flex items-center justify-between p-3 bg-[#002b5e] hover:bg-[#003d7a] transition-colors"
              >
                <span className="font-semibold text-sm text-slate-50">{cat.title}</span>
                {expandedCats[cat.id] ? (
                  <ChevronDown className="w-4 h-4 text-[#ffce00]" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                )}
              </button>
              
              {/* Expanded items */}
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${expandedCats[cat.id] ? 'max-h-[500px]' : 'max-h-0'}`}>
                <div className="bg-[#001533]/80 py-1">
                  {cat.items.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveItem(item);
                        setIsOpen(false); // Auto-hide sidebar on selection
                      }}
                      className={`w-full text-left pl-6 py-2 text-xs transition-colors ${
                        activeItem === item
                          ? 'text-[#002b5e] font-black bg-[#ffce00] border-l-4 border-[#e6ba00]'
                          : 'text-slate-300 hover:text-white hover:bg-[#003d7a] border-l-4 border-transparent'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
