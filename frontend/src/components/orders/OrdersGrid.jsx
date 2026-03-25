import React, { useState, useEffect } from 'react';
import { Search, Calendar, ChevronDown, Filter, FileText, Download, Loader2, Printer, X, Package, Info, CheckCircle2, ArrowLeft, User, MapPin, Hash, Tag, Activity } from 'lucide-react';
import { createPortal } from 'react-dom';
import API_BASE_URL from '../../services/apiConfig';

const OrderDetailModal = ({ orderId, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/pedidos/${orderId}`);
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error fetching order detail:', error);
      } finally {
        setLoading(false);
      }
    };
    if (orderId) fetchDetail();
  }, [orderId]);

  if (!orderId) return null;

  const DetailField = ({ label, value, icon: Icon, fullWidth = false }) => (
    <div className={`p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-4 hover:border-brand-blue/30 transition-all ${fullWidth ? 'col-span-full' : ''}`}>
      <div className="p-2.5 bg-white rounded-xl shadow-sm text-brand-blue">
        {Icon ? <Icon className="w-4 h-4" /> : <Info className="w-4 h-4" />}
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{label}</span>
        <span className="text-[13px] font-bold text-slate-700 leading-tight truncate max-w-[200px]" title={value}>
          {value || '-'}
        </span>
      </div>
    </div>
  );

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 lg:p-8 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div
        className="bg-white rounded-[2rem] w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col animate-slide-up relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon - Modern System Layer */}
        <div className="bg-[#003d7a] px-6 py-4 flex items-center justify-between shadow-lg relative z-20 overflow-hidden">
          <div className="absolute top-0 right-1/4 w-32 h-32 bg-[#ffce00]/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-[#ffce00]"></div>
          
          <div className="flex items-center gap-4 relative z-10">
             <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
                <FileText className="w-6 h-6 text-white" />
             </div>
             <div>
                <h2 className="text-white font-black text-lg lg:text-xl uppercase tracking-tight flex items-center gap-3 leading-none mb-1">
                   Detalle del Registro 
                   <span className="text-[#ffce00]">#{data?.header?.id || orderId}</span>
                </h2>
                <div className="flex items-center gap-3">
                   <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">{data?.header?.fecha || 'Consultando...'}</span>
                   <div className="w-1 h-1 rounded-full bg-white/20"></div>
                   <span className="text-[10px] font-black text-[#ffce00]/80 uppercase tracking-[0.2em]">{data?.header?.status_desc || 'Procesando'}</span>
                   <div className="w-1 h-1 rounded-full bg-white/20"></div>
                   <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em]">Id C: {data?.header?.id_c || '-'}</span>
                </div>
             </div>
          </div>

          <button onClick={onClose} className="text-white/60 hover:text-white bg-white/5 hover:bg-white/10 p-2.5 rounded-2xl transition-all active:scale-90 group">
            <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Tab Navigation Layer */}
        <div className="bg-slate-50/50 px-8 py-4 border-b border-slate-100 flex items-center gap-3">
          {[
            { id: 'general', label: 'Información General', icon: Info },
            { id: 'detalle', label: 'Estructura de Venta', icon: Tag },
            { id: 'surtimiento', label: 'Logística y Surtimiento', icon: Package }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 text-[11px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 group relative overflow-hidden ${
                activeTab === tab.id 
                  ? 'bg-[#003d7a] text-white shadow-lg shadow-blue-900/20' 
                  : 'bg-white border border-slate-200 text-slate-500 hover:border-[#003d7a]/30 hover:text-[#003d7a]'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-[#ffce00]' : 'text-slate-400 group-hover:text-[#003d7a]'}`} />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#ffce00]"></div>
              )}
            </button>
          ))}
          
          <div className="ml-auto bg-[#003d7a]/5 border border-[#003d7a]/10 rounded-xl px-4 py-2 hidden md:flex items-center gap-3">
             <div className="text-right">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Monto Total Bruto</p>
                <p className="text-[15px] font-black text-[#003d7a] leading-none">{data?.header?.total || '$0.00'}</p>
             </div>
             <div className="w-px h-6 bg-[#003d7a]/10"></div>
             <Printer 
               className="w-5 h-5 text-[#003d7a] cursor-pointer hover:scale-110 transition-transform" 
               onClick={() => window.print()}
               title="Imprimir Detalle"
             />
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
          <div className="p-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <Loader2 className="w-12 h-12 text-[#003d7a] animate-spin" />
                <span className="text-sm font-black text-[#003d7a] uppercase tracking-[0.3em]">Recuperando Estructura...</span>
              </div>
            ) : data && data.header ? (
              <div className="animate-fade-in">
                {activeTab === 'general' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <DetailField label="Estatus de Venta" value={data.header.status_desc} icon={Activity} />
                    <DetailField label="Orden de Venta" value={data.header.orden_venta} icon={Hash} />
                    <DetailField label="Serie Documento" value={data.header.serie} icon={Hash} />
                    <DetailField label="Factura Fiscal" value={data.header.factura ? `${data.header.factura}` : 'Pendiente'} icon={FileText} />
                    <DetailField label="Estatus Solicitud" value={data.header.status === 'S' ? 'SOLICITADA' : data.header.status_desc} icon={CheckCircle2} />
                    
                    <div className="col-span-full h-px bg-slate-100 my-4 flex items-center justify-center">
                       <span className="bg-white px-4 text-[9px] font-black text-slate-300 uppercase tracking-widest">Identificación y Cliente</span>
                    </div>

                    <DetailField label="Nombre del Cliente/Usuario" value={data.header.usuario_nombre} icon={User} />
                    <DetailField label="ID Login" value={data.header.login} icon={Hash} />
                    <DetailField label="No. Cliente Interno" value={data.header.no_cliente} icon={Tag} />
                    <DetailField label="Sucursal" value={data.header.sucursal} icon={MapPin} />
                    <DetailField label="Perfil ID" value={data.header.perfil_id} icon={Hash} />

                    <div className="col-span-full h-px bg-slate-100 my-4 flex items-center justify-center">
                       <span className="bg-white px-4 text-[9px] font-black text-slate-300 uppercase tracking-widest">Logística y Horarios</span>
                    </div>

                    <DetailField label="Solicitud Generada" value={data.header.solicitud} icon={Calendar} />
                    <DetailField label="Facturación" value={data.header.factura_hora} icon={Calendar} />
                    <DetailField label="Almacén" value={data.header.almacen} icon={Calendar} />
                    <DetailField label="Recepción" value={data.header.recepcion} icon={Calendar} />
                    <DetailField label="En Tránsito" value={data.header.transito} icon={Calendar} />
                    <DetailField label="Entrega Realizada" value={data.header.entrega} icon={MapPin} />
                    <DetailField label="Ruta de Entrega" value={data.header.ruta} icon={MapPin} />
                    <DetailField label="Vehículo Asignado" value={data.header.vehiculo} icon={Activity} />
                    <DetailField label="Recibió Pedido" value={data.header.recibio} icon={User} />
                    <DetailField label="Nivel Surtimiento" value={data.header.surtimiento} icon={Package} />
                    
                    <div className="col-span-full h-px bg-slate-100 my-4 flex items-center justify-center">
                       <span className="bg-white px-4 text-[9px] font-black text-slate-300 uppercase tracking-widest">Resumen Financiero</span>
                    </div>

                    <div className="col-span-full lg:col-span-2 grid grid-cols-3 bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden">
                       <div className="p-4 border-r border-slate-100">
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Subtotal</p>
                          <p className="text-xl font-black text-slate-700">{data.header.subtotal}</p>
                       </div>
                       <div className="p-4 border-r border-slate-100">
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-1">IVA (16%)</p>
                          <p className="text-xl font-black text-slate-700">{data.header.iva}</p>
                       </div>
                       <div className="p-4 bg-brand-blue/5">
                          <p className="text-[9px] font-black text-brand-blue uppercase mb-1">Total Neto</p>
                          <p className="text-xl font-black text-brand-blue">{data.header.total}</p>
                       </div>
                    </div>

                    <DetailField label="Observaciones del Sistema" value={data.header.observaciones || data.header.observacion_n} icon={FileText} fullWidth={true} />
                  </div>
                )}

                {activeTab === 'detalle' && (
                  <div className="rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left text-[11px] border-collapse whitespace-nowrap">
                      <thead className="bg-[#003d7a] text-white">
                        <tr>
                          <th className="px-4 py-3 font-black uppercase tracking-widest border-r border-white/10">Clave</th>
                          <th className="px-4 py-3 font-black uppercase tracking-widest border-r border-white/10">Descripción del Artículo</th>
                          <th className="px-4 py-3 font-black uppercase tracking-widest text-center border-r border-white/10">IVA</th>
                          <th className="px-4 py-3 font-black uppercase tracking-widest text-center border-r border-white/10">Cant.</th>
                          <th className="px-4 py-3 font-black uppercase tracking-widest text-right border-r border-white/10">P. Venta</th>
                          <th className="px-4 py-3 font-black uppercase tracking-widest text-right border-r border-white/10">IVA Imp.</th>
                          <th className="px-4 py-3 font-black uppercase tracking-widest text-right border-r border-white/10">Subtotal</th>
                          <th className="px-4 py-3 font-black uppercase tracking-widest text-right border-r border-white/10">Costo</th>
                          <th className="px-4 py-3 font-black uppercase tracking-widest text-right border-r border-white/10">P. Lista</th>
                          <th className="px-4 py-3 font-black uppercase tracking-widest text-center border-r border-white/10">Orig.</th>
                          <th className="px-4 py-3 font-black uppercase tracking-widest text-right border-r border-white/10">Desc. NCP</th>
                          <th className="px-4 py-3 font-black uppercase tracking-widest text-right">PVN</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(data.items || []).map((item, i) => (
                          <tr key={i} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-4 py-2.5 text-slate-700 font-black group-hover:text-brand-blue transition-colors uppercase">{item.clave}</td>
                            <td className="px-4 py-2.5 text-slate-600 font-bold whitespace-normal min-w-[200px]">{item.descripcion}</td>
                            <td className="px-4 py-2.5 text-slate-400 text-center font-black">{item.iva}</td>
                            <td className="px-4 py-2.5 text-[#003d7a] text-center font-black">{item.cantidad}</td>
                            <td className="px-4 py-2.5 text-slate-700 text-right font-black">{item.venta?.replace('$', '') || ''}</td>
                            <td className="px-4 py-2.5 text-slate-500 text-right font-bold">{item.iva_importe?.replace('$', '') || ''}</td>
                            <td className="px-4 py-2.5 text-brand-blue text-right font-black">{item.subtotal?.replace('$', '') || ''}</td>
                            <td className="px-4 py-2.5 text-slate-400 text-right font-bold italic">{item.costo?.replace('$', '') || ''}</td>
                            <td className="px-4 py-2.5 text-slate-500 text-right font-bold">{item.p_lista?.replace('$', '') || ''}</td>
                            <td className="px-4 py-2.5 text-slate-400 text-center font-bold">{item.original}</td>
                            <td className="px-4 py-2.5 text-brand-red text-right font-bold">{item.mfdescncp?.replace('$', '') || ''}</td>
                            <td className="px-4 py-2.5 text-slate-800 text-right font-black">{item.pvn?.replace('$', '') || ''}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'surtimiento' && (
                  <div className="rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                    <table className="w-full text-left text-[11px] border-collapse whitespace-nowrap">
                      <thead className="bg-brand-red text-white">
                        <tr>
                          <th className="px-4 py-3 font-black uppercase tracking-widest border-r border-white/10">Clave</th>
                          <th className="px-4 py-3 font-black uppercase tracking-widest text-right border-r border-white/10">Actual</th>
                          <th className="px-4 py-3 font-black uppercase tracking-widest border-r border-white/10">Nombre del Producto</th>
                          <th className="px-4 py-3 font-black uppercase tracking-widest text-center border-r border-white/10">Terminado</th>
                          <th className="px-4 py-3 font-black uppercase tracking-widest text-center border-r border-white/10">Pedido</th>
                          <th className="px-4 py-3 font-black uppercase tracking-widest text-center border-r border-white/10">% Inicial</th>
                          <th className="px-4 py-3 font-black uppercase tracking-widest text-center border-r border-white/10">% Actual</th>
                          <th className="px-4 py-3 font-black uppercase tracking-widest border-r border-white/10">Marca</th>
                          <th className="px-4 py-3 font-black uppercase tracking-widest text-center border-r border-white/10">Grupo</th>
                          <th className="px-4 py-3 font-black uppercase tracking-widest text-center">Progreso</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {(data.surtimiento || []).map((st, i) => (
                          <tr key={i} className="hover:bg-slate-50 transition-colors">
                            <td className="px-4 py-2.5 text-slate-700 font-black uppercase">{st.clave}</td>
                            <td className="px-4 py-2.5 text-slate-900 text-right font-black">{st.actual}</td>
                            <td className="px-4 py-2.5 text-slate-600 font-bold whitespace-normal min-w-[150px]">{st.nombre}</td>
                            <td className="px-4 py-2.5 text-center">
                              {st.terminado ? (
                                <div className="p-1 bg-green-100 text-green-600 rounded-lg inline-flex"><CheckCircle2 className="w-4 h-4" /></div>
                              ) : (
                                <div className="p-1 bg-slate-100 text-slate-400 rounded-lg inline-flex"><Loader2 className="w-4 h-4 animate-spin-slow" /></div>
                              )}
                            </td>
                            <td className="px-4 py-2.5 text-slate-700 text-center font-black">{st.pedido}</td>
                            <td className="px-4 py-2.5 text-slate-500 text-center font-bold px-4">{st.porcentaje_inicial}%</td>
                            <td className="px-4 py-2.5 text-brand-blue text-center font-black px-4">{st.porcentaje_actual || st.porcentaje_inicial}%</td>
                            <td className="px-4 py-2.5 text-slate-500 text-center font-bold tracking-tighter">{st.marca}</td>
                            <td className="px-4 py-2.5 text-slate-400 text-center font-medium">{st.grupo}</td>
                            <td className="px-4 py-2.5 text-center">
                               <div className="flex items-center gap-2 justify-center min-w-[100px]">
                                  <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden shrink-0">
                                     <div 
                                       className={`h-full transition-all duration-1000 ${st.terminado ? 'bg-green-500' : 'bg-brand-blue'}`}
                                       style={{ width: `${st.porcentaje_actual || st.porcentaje_inicial}%` }}
                                     ></div>
                                  </div>
                               </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-24 flex flex-col items-center justify-center text-center animate-fade-in">
                <div className="p-6 bg-red-50 rounded-full text-red-600 mb-6 animate-bounce">
                   <Package className="w-16 h-16" />
                </div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight mb-2">Error de Sincronización</h3>
                <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium">
                   No pudimos recuperar la estructura técnica de este registro. El servidor respondió con el siguiente mensaje:
                </p>
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl overflow-x-auto max-w-lg w-full">
                   <code className="text-pink-400 text-sm font-mono block text-left">
                      {data?.error || 'Excepción no controlada en el núcleo del sistema.'}
                   </code>
                </div>
                <button 
                  onClick={onClose}
                  className="mt-8 px-8 py-3 bg-slate-800 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl hover:bg-slate-700 transition-all shadow-xl active:scale-95"
                >
                   Entendido
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer Area */}
        <div className="px-8 py-3 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0">
           <div className="flex items-center gap-6">
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-brand-blue"></div> Datos Certificados</span>
              <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500"></div> Conexión Segura (DB)</span>
           </div>
           <p>© 2026 Multillantas Nieto S.A de C.V</p>
        </div>

      </div>
    </div>,
    document.body
  );
};

const OrdersGrid = ({ user, onBack }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [filters, setFilters] = useState(() => {
    const today = new Date();
    const firstDay = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;
    return {
      desde: firstDay, 
      hasta: today.toISOString().split('T')[0],
      status: 'Todos'
    };
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        usuario: user?.usuariologin || 'ADMIN',
        desde: filters.desde,
        hasta: filters.hasta,
        status: filters.status
      });

      const response = await fetch(`${API_BASE_URL}/pedidos?${queryParams}`);
      if (!response.ok) throw new Error('Error al obtener pedidos');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleSearch = () => fetchOrders();

  const handlePrint = () => window.print();

  return (
    <div className="w-full relative print:p-0">
      {/* Header Section */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 print:hidden">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 bg-white border border-slate-200 text-slate-500 hover:text-[#003d7a] hover:bg-slate-50 hover:border-[#003d7a]/30 rounded-xl transition-all shadow-sm group"
              title="Regresar a Existencias"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            </button>
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#002b5e] tracking-tight mb-1">
              Mis Pedidos
            </h1>
            <p className="text-sm font-medium text-slate-500">
              Administración y seguimiento histórico de requerimientos
            </p>
          </div>
        </div>
      </div>

      {/* Filters Control Panel */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-5 lg:p-6 mb-8 relative overflow-hidden print:hidden">
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#ffce00]"></div>
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-[#003d7a]" />
          <h2 className="text-xs font-black text-[#003d7a] uppercase tracking-widest">Filtros de Búsqueda</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Fecha Inicial</label>
            <input type="date" value={filters.desde} onChange={(e) => setFilters({...filters, desde: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-medium text-slate-700 outline-none transition-all hover:bg-white" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Fecha Final</label>
            <input type="date" value={filters.hasta} onChange={(e) => setFilters({...filters, hasta: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-medium text-slate-700 outline-none transition-all hover:bg-white" />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Status</label>
            <select value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 text-sm font-medium text-slate-700 outline-none appearance-none cursor-pointer hover:bg-white">
                <option value="Todos">Todos</option>
                <option value="Solicitada">Solicitada</option>
                <option value="Facturada">Facturada</option>
                <option value="Recepcion Almacen">Recepcion Almacen</option>
                <option value="Entrega Almacen">Entrega Almacen</option>
                <option value="En Transito">En Transito</option>
                <option value="Entregada">Entregada</option>
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={handleSearch} className="w-full bg-[#003d7a] hover:bg-[#002b5e] text-white rounded-xl py-2 px-4 font-black uppercase tracking-widest text-[11px] transition-all flex items-center justify-center gap-2">
              <Search className="w-4 h-4" /> Buscar
            </button>
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-50 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 text-[#003d7a] animate-spin" />
            <span className="text-sm font-black text-[#003d7a] uppercase tracking-[0.2em]">Consultando Pedidos...</span>
          </div>
        )}

        {/* VIEW FOR DESKTOP */}
        <div className="hidden md:block bg-[#003d7a] border-b-[3px] border-[#ffce00] px-4 py-3.5 overflow-x-auto print:bg-white print:border-slate-800 print:text-black">
          <div className="min-w-[1020px] grid grid-cols-[80px_60px_80px_100px_90px_250px_90px_90px_90px_100px_1fr] gap-2 items-center">
            <div className="print:hidden"></div>
            <div className="text-[9px] font-black text-white/90 uppercase tracking-widest print:text-black">Id</div>
            <div className="text-[9px] font-black text-white/90 uppercase tracking-widest print:text-black">Fecha</div>
            <div className="text-[9px] font-black text-white/90 uppercase tracking-widest print:text-black">Status</div>
            <div className="text-[9px] font-black text-white/90 uppercase tracking-widest print:text-black">Login</div>
            <div className="text-[9px] font-black text-white/90 uppercase tracking-widest print:text-black">Cliente</div>
            <div className="text-[9px] font-black text-white/90 uppercase tracking-widest print:text-black">OV</div>
            <div className="text-[9px] font-black text-white/90 uppercase tracking-widest print:text-black text-right">Subtotal</div>
            <div className="text-[9px] font-black text-white/90 uppercase tracking-widest print:text-black text-right">IVA</div>
            <div className="text-[9px] font-black text-white/90 uppercase tracking-widest print:text-black text-right">Total</div>
            <div className="text-[9px] font-black text-white/90 uppercase tracking-widest print:text-black text-center">Imprimir</div>
          </div>
        </div>

        <div className="hidden md:block divide-y divide-slate-100 overflow-x-auto custom-scrollbar">
          <div className="min-w-[1020px]">
            {orders.map((order, idx) => {
              const fullStatus = order.status === 'C' ? 'CERRADO' : order.status === 'A' ? 'ABIERTO' : order.status === 'S' ? 'SOLICITADA' : order.status === 'F' ? 'FACTURADA' : order.status === 'E' ? 'ENTREGADA' : order.status === 'T' ? 'EN TRANSITO' : order.status === 'R' ? 'RECEPCION' : order.status;
              
              return (
              <div key={idx} className="grid grid-cols-[80px_60px_80px_100px_90px_250px_90px_90px_90px_100px_1fr] gap-2 items-center px-4 py-3 hover:bg-slate-50 transition-colors print:bg-transparent">
                <div className="print:hidden flex justify-center">
                  <button onClick={() => setSelectedOrderId(order.id)} className="px-3 py-1.5 border border-slate-300 hover:border-[#003d7a] hover:bg-[#003d7a] hover:text-white rounded transition-colors flex items-center justify-center gap-1.5 shadow-sm text-slate-600">
                    <FileText className="w-3.5 h-3.5" /> <span className="text-[9px] font-black uppercase tracking-wider">Detalle</span>
                  </button>
                </div>
                <div className="text-xs font-bold text-slate-500">#{order.id}</div>
                <div className="text-xs font-black text-slate-700">
                  {order.fecha}
                </div>
                <div className="text-[10px] font-black uppercase text-[#003d7a] truncate">{fullStatus}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">{order.login}</div>
                <div className="text-xs font-bold text-slate-700 truncate" title={order.cliente}>{order.cliente}</div>
                <div className="text-xs font-black text-[#003d7a]">{order.ordenVenta}</div>
                <div className="text-xs font-bold text-slate-600 text-right">{order.subtotal}</div>
                <div className="text-xs font-bold text-slate-400 text-right">{order.iva}</div>
                <div className="text-xs font-black text-[#003d7a] text-right">{order.total}</div>
                <div className="flex items-center justify-center print:hidden">
                  <button onClick={() => window.print()} className="p-2 text-slate-400 hover:text-[#003d7a] hover:bg-slate-200 rounded-lg transition-colors cursor-pointer" title="Imprimir Requerimiento">
                    <Printer className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )})}
          </div>
        </div>

        {/* MOBILE VIEW (Unchanged but ensuring it works) */}
        <div className="md:hidden divide-y divide-slate-100">
          {orders.map((order, idx) => (
            <div key={idx} className="p-4" onClick={() => setSelectedOrderId(order.id)}>
              <div className="flex justify-between items-start mb-3">
                <div className="flex flex-col">
                  <span className="text-sm font-black text-[#003d7a]">#{order.id}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{order.fecha}</span>
                </div>
                <span className="text-[10px] font-bold text-brand-blue bg-blue-50 px-2 py-1 rounded-md">{order.total}</span>
              </div>
              <div className="text-sm font-bold text-slate-700">{order.cliente}</div>
            </div>
          ))}
        </div>
        
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex justify-between items-center print:hidden">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            Total Registros: <span className="text-[#003d7a] text-xs ml-1">{orders.length}</span>
          </span>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedOrderId && (
        <OrderDetailModal 
          orderId={selectedOrderId} 
          onClose={() => setSelectedOrderId(null)} 
        />
      )}
    </div>
  );
};

export default OrdersGrid;
