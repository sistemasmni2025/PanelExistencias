import React, { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import ServicesHeader from '../components/layout/ServicesHeader';
import DataGrid from '../components/services/DataGrid';
import PrimasFdnPanel from '../components/services/PrimasFdnPanel';
import CartDrawer from '../components/cart/CartDrawer';
import PromoBanner from '../components/layout/PromoBanner';
import { Menu, XCircle, Home, LogOut, FileText, Truck, Loader2 } from 'lucide-react';
import API_BASE_URL from '../services/apiConfig';

const ServicesPanel = ({ onNavigateHome, onNavigateOrders, onLogout, user }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('existencias');
  
  // State for inventory filtering
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    ancho: '',
    serie: '',
    rin: '',
    nombre: '',
    marca: 'INICIO', // Default to genexus fallback
    soloConExistencias: true,
    isGamma: false
  });

  const fetchExistencias = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.ancho) queryParams.append('ancho', filters.ancho);
      if (filters.serie) queryParams.append('serie', filters.serie);
      if (filters.rin) queryParams.append('rin', filters.rin);
      if (filters.nombre) queryParams.append('nombre', filters.nombre);
      if (filters.marca && filters.marca !== 'TODOS') queryParams.append('marca', filters.marca);
      if (filters.soloConExistencias) queryParams.append('conExistencias', 'true');
      if (filters.isGamma) queryParams.append('isGamma', 'true');

      const response = await fetch(`${API_BASE_URL}/existencias/search?${queryParams.toString()}`);
      const rawData = await response.json();
      
      const mappedProducts = rawData.map((p, index) => {
        const branchKeys = Object.keys(p).filter(k => !['Grupo','Descripcion','Clave','Status','NParte','PLista','Descuento','Promocion','PrecioFacturado', 'gruclas', 'DescPiso', 'PVentaPiso', 'IVA_Flag'].includes(k));
        const totalStock = branchKeys.reduce((acc, code) => acc + Math.max(0, Number(p[code]) || 0), 0);
        const branches = branchKeys.map(code => ({ code, stock: Math.max(0, Number(p[code]) || 0) }));

        // Transform backend fields to match ProductRow structure exactly
        const pFacturado = Number(p.PVentaPiso) || 0;
        
        // Lógica Gamma: el status (almstat) determina si es Gamma ('G')
        const isGamma = p.Status === 'G';

        return {
          id: p.Clave || index,
          g: isGamma ? 'G' : 'F',
          clave: p.Clave || '-',
          statusDetail: isGamma ? 'Gamma' : (p.Status === 'F' ? 'Fuera de Gamma' : (p.Status || 'Activo')),
          description: p.Descripcion || 'Sin Descripción',
          mspn: p.NParte || '-',
          brand: p.Grupo || 'Multi',
          stock: totalStock,
          priceList: Number(p.PLista) || 0,
          discountPercent: Number(p.Descuento) || 0,
          promotion: Number(p.Promocion) || 0,
          ncPercent: 0,
          precioFacturado: Number(p.PrecioFacturado) || 0,
          piso: {
            desc: Number(p.DescPiso) || 0,
            promo: 0,
            venta: pFacturado,
            iva: p.IVA_Flag === 'S' ? (pFacturado * 0.16) : 0,
            neto: p.IVA_Flag === 'S' ? (pFacturado * 1.16) : pFacturado
          },
          branches: branches
        };
      });

      setProducts(mappedProducts);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'existencias') {
      fetchExistencias();
    }
  }, [filters, activeTab]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };


  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans antialiased relative">
      {/* Background ambient accents for specialized look */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-red/5 rounded-full blur-[120px] pointer-events-none -z-0"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-blue/5 rounded-full blur-[100px] pointer-events-none -z-0"></div>

      {/* Sidebar - Now with mobile support */}
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
        filters={filters} 
        onFilterChange={handleFilterChange} 
      />

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
               onClick={() => setActiveTab('existencias')}
               className={`p-2 rounded-xl transition-all flex items-center gap-2 group ${
                 activeTab === 'existencias' 
                 ? 'bg-[#ffce00] text-[#003d7a]' 
                 : 'text-slate-300 hover:text-white hover:bg-white/10'
               }`}
               title="Consultar Existencias"
            >
              <Truck className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden md:inline transition-colors">Existencias</span>
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

            <div className="h-4 w-px bg-slate-700 mx-2 hidden sm:block"></div>

            <button
              onClick={() => setActiveTab(activeTab === 'primas_fdn' ? 'existencias' : 'primas_fdn')}
              className={`p-2 rounded-xl transition-all flex items-center gap-2 group ${
                activeTab === 'primas_fdn' 
                ? 'bg-[#ffce00] text-[#003d7a]' 
                : 'text-slate-300 hover:text-white hover:bg-white/10'
              }`}
              title="Ver Primas y FDN"
            >
              <FileText className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden md:inline transition-colors">Primas y FDN</span>
            </button>
          </div>

          <div className="ml-auto flex items-center gap-6">
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

        {activeTab === 'existencias' ? (
          <>
            {/* Unified Sticky Header System - No Lines, Pure Floating Info */}
            <div className="shrink-0 sticky top-0 z-30 bg-white/90 backdrop-blur-xl shadow-lg shadow-slate-200/50">
              {/* Layer 1: Promo Banner (Branding) */}
              <PromoBanner />

              {/* Layer 2: Global Search / Actions Header - Border removed */}
              <div className="">
                <ServicesHeader 
                  onCartClick={() => setCartOpen(true)} 
                  searchTerm={filters.nombre}
                  onSearchChange={(val) => handleFilterChange({ nombre: val })}
                />
              </div>

              {/* Layer 3: Filter Indicator Section - No Background/Border, just floating info */}
              <div className="px-4 sm:px-6 md:px-8 py-2 pb-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-3 px-1">
                    <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse"></span>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Resultados Filtrados: <span className="text-brand-red">{filters.marca || 'TODOS'}</span>
                      {filters.ancho && <span className="ml-2 italic text-slate-400">/ A: {filters.ancho}</span>}
                    </span>
                    <XCircle 
                      className="w-4 h-4 text-slate-300 cursor-pointer hover:text-brand-red transition-colors" 
                      onClick={() => setFilters({ ancho: '', serie: '', rin: '', nombre: '', marca: 'INICIO', soloConExistencias: true })}
                    />
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
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <Loader2 className="w-10 h-10 text-brand-red animate-spin" />
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Consultando Inventario Real...</p>
                  </div>
                ) : (
                  <DataGrid products={products} />
                )}
              </div>
            </div>
          </>
        ) : activeTab === 'primas_fdn' ? (
          <div className="flex-1 overflow-hidden">
            <PrimasFdnPanel />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-slate-50">
            <div className="text-center">
              <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <FileText className="w-10 h-10 text-slate-400" />
              </div>
              <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest">Módulo en Desarrollo</h3>
              <p className="text-xs text-slate-500 mt-2">Esta sección ({tabs.find(t => t.id === activeTab)?.label}) estará disponible próximamente.</p>
            </div>
          </div>
        )}
      </main>

      {/* Slide-over Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
};

export default ServicesPanel;
