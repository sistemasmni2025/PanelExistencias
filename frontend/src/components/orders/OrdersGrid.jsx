import React, { useState, useEffect } from 'react';
import { Search, Calendar, ChevronDown, Filter, FileText, Download, Loader2, Printer, X, Package, Info, CheckCircle2 } from 'lucide-react';
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh] animate-in slide-in-from-bottom-4 duration-300">
        {/* Modal Header */}
        <div className="bg-[#003d7a] p-4 sm:p-6 text-white flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight">Venta Information</h2>
            <p className="text-xs font-bold text-[#ffce00] mt-1 tracking-widest">Id C: {data?.header?.id_c || orderId}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 flex items-center gap-1 shrink-0 overflow-x-auto hide-scrollbar">
          {[
            { id: 'general', label: 'General', icon: Info },
            { id: 'detalle', label: 'Detalle', icon: Package },
            { id: 'surtimiento', label: 'Surtimiento', icon: CheckCircle2 }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all relative whitespace-nowrap ${
                activeTab === tab.id ? 'text-[#003d7a]' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'animate-pulse' : ''}`} />
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#8B0000] rounded-t-full"></div>
              )}
            </button>
          ))}
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-8 bg-white">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center gap-4 py-20">
              <Loader2 className="w-10 h-10 text-[#003d7a] animate-spin" />
              <span className="text-sm font-black text-[#003d7a] uppercase tracking-widest">Consultando Detalle...</span>
            </div>
          ) : data ? (
            <div className="animate-in fade-in slide-in-from-top-2 duration-500">
              {activeTab === 'general' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4">
                  {[
                    { label: 'Id', value: data.header.id },
                    { label: 'Fecha', value: data.header.fecha },
                    { label: 'Status', value: data.header.status_desc },
                    { label: 'Login', value: data.header.login },
                    { label: 'No.Cliente', value: data.header.no_cliente },
                    { label: 'Orden de Venta', value: data.header.orden_venta },
                    { label: 'Subtotal', value: data.header.subtotal, highlight: true },
                    { label: 'Iva', value: data.header.iva, highlight: true },
                    { label: 'Total', value: data.header.total, highlight: true, bold: true },
                    { label: 'Tipo', value: data.header.tipo },
                    { label: 'Tipo (Auto)', value: data.header.tipo_bool },
                    { label: 'Observaciones', value: data.header.observaciones, full: true },
                    { label: 'Id C', value: data.header.id_c },
                    { label: 'Serie', value: data.header.serie || 'N/A' },
                    { label: 'Factura', value: data.header.factura || '0' },
                    { label: 'Solicitud', value: data.header.solicitud },
                    { label: 'Factura Hora', value: data.header.factura_hora },
                    { label: 'Almacén', value: data.header.almacen },
                    { label: 'Entrega', value: data.header.entrega },
                    { label: 'Recepción', value: data.header.recepcion },
                    { label: 'Tránsito', value: data.header.transito },
                    { label: 'Ruta', value: data.header.ruta },
                    { label: 'Vehiculo', value: data.header.vehiculo },
                    { label: 'Usuario', value: data.header.usuario_nombre, full: true },
                    { label: 'Observacion N', value: data.header.observacion_n, full: true },
                    { label: 'Sucursal', value: data.header.sucursal },
                    { label: 'Recibio', value: data.header.recibio },
                    { label: 'Surtimiento', value: data.header.surtimiento }
                  ].map((field, i) => (
                    <div key={i} className={`flex flex-col py-2 border-b border-slate-50 ${field.full ? 'md:col-span-2 lg:col-span-4' : ''}`}>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-0.5">{field.label}</span>
                      <span className={`text-xs font-bold ${field.highlight ? 'text-[#003d7a]' : 'text-slate-700'} ${field.bold ? 'text-sm font-black' : ''}`}>
                        {field.value || '-'}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'detalle' && (
                <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-sm">
                  <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead className="bg-[#8B0000] text-white">
                      <tr>
                        <th className="px-4 py-3 text-[10px] font-black uppercase">Clave</th>
                        <th className="px-4 py-3 text-[10px] font-black uppercase">Descripción</th>
                        <th className="px-4 py-3 text-[10px] font-black uppercase text-center">Iva</th>
                        <th className="px-4 py-3 text-[10px] font-black uppercase text-center">Cantidad</th>
                        <th className="px-4 py-3 text-[10px] font-black uppercase text-right">Venta</th>
                        <th className="px-4 py-3 text-[10px] font-black uppercase text-right">Iva Importe</th>
                        <th className="px-4 py-3 text-[10px] font-black uppercase text-right">Detalle Subtotal</th>
                        <th className="px-4 py-3 text-[10px) font-black uppercase text-right">Costo</th>
                        <th className="px-4 py-3 text-[10px] font-black uppercase text-right">P. Lista</th>
                        <th className="px-4 py-3 text-[10px] font-black uppercase text-center">Detalle Original</th>
                        <th className="px-4 py-3 text-[10px] font-black uppercase text-right">Detalle PVN</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 italic">
                      {data.items.map((item, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 text-xs font-bold text-[#003d7a]">{item.clave}</td>
                          <td className="px-4 py-3 text-[11px] font-medium text-slate-600">{item.descripcion}</td>
                          <td className="px-4 py-3 text-xs font-bold text-center text-slate-500">{item.iva}</td>
                          <td className="px-4 py-3 text-xs font-black text-slate-700 text-center">{item.cantidad}</td>
                          <td className="px-4 py-3 text-xs font-bold text-slate-600 text-right">{item.venta}</td>
                          <td className="px-4 py-3 text-xs font-bold text-slate-400 text-right">{item.iva_importe}</td>
                          <td className="px-4 py-3 text-xs font-black text-[#003d7a] text-right">{item.subtotal}</td>
                          <td className="px-4 py-3 text-xs font-medium text-slate-400 text-right">{item.costo}</td>
                          <td className="px-4 py-3 text-xs font-medium text-slate-400 text-right">{item.p_lista}</td>
                          <td className="px-4 py-3 text-xs font-medium text-slate-400 text-center">{item.original}</td>
                          <td className="px-4 py-3 text-xs font-bold text-[#003d7a] text-right">{item.pvn}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'surtimiento' && (
                <div className="overflow-x-auto border border-slate-200 rounded-2xl shadow-sm">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead className="bg-[#8B0000] text-white">
                      <tr>
                        <th className="px-4 py-3 text-[10px] font-black uppercase">Clave</th>
                        <th className="px-4 py-3 text-[10px] font-black uppercase text-center">Actual</th>
                        <th className="px-4 py-3 text-[10px] font-black uppercase">Nombre</th>
                        <th className="px-4 py-3 text-[10px] font-black uppercase text-center">Terminado</th>
                        <th className="px-4 py-3 text-[10px] font-black uppercase text-center">Pedido</th>
                        <th className="px-4 py-3 text-[10px] font-black uppercase text-center">Porcentaje Inicial</th>
                        <th className="px-4 py-3 text-[10px] font-black uppercase text-center">Marca</th>
                        <th className="px-4 py-3 text-[10px) font-black uppercase text-center">Grupo</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 italic">
                      {data.surtimiento.map((st, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-3 text-xs font-bold text-[#003d7a] text-center">{st.clave}</td>
                          <td className="px-4 py-3 text-xs font-black text-slate-700 text-center">{st.actual}</td>
                          <td className="px-4 py-3 text-[11px] font-medium text-slate-600">{st.nombre}</td>
                          <td className="px-4 py-3 text-center">
                            <div className={`w-4 h-4 mx-auto rounded border ${st.terminado ? 'bg-emerald-500 border-emerald-600' : 'bg-slate-100 border-slate-300'}`}>
                              {st.terminado && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs font-bold text-[#003d7a] text-center">{st.pedido}</td>
                          <td className="px-4 py-3 text-xs font-black text-slate-700 text-center">{st.porcentaje_inicial}</td>
                          <td className="px-4 py-3 text-xs font-bold text-slate-500 text-center">{st.marca}</td>
                          <td className="px-4 py-3 text-xs font-bold text-slate-500 text-center">{st.grupo}</td>
                        </tr>
                      ))}
                      {data.surtimiento.length === 0 && (
                        <tr>
                          <td colSpan="8" className="px-4 py-20 text-center text-slate-400 font-bold italic uppercase tracking-widest">
                            No hay información de surtimiento disponible
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-slate-400">
              No se pudo cargar la información del pedido.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const OrdersGrid = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [filters, setFilters] = useState({
    desde: '2024-01-01', 
    hasta: new Date().toISOString().split('T')[0],
    status: 'Todos'
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
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#002b5e] tracking-tight mb-1">
            Mis Pedidos
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Administración y seguimiento histórico de requerimientos
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 hover:text-[#003d7a] transition-colors shadow-sm text-xs font-bold uppercase tracking-wider"
          >
            <Printer className="w-4 h-4" /> Imprimir
          </button>
          <button 
            onClick={() => {
                const headers = ['ID', 'Fecha', 'Status', 'Cliente', 'OV', 'Subtotal', 'IVA', 'Total'];
                const rows = orders.map(o => [o.id, o.fecha, o.status, o.cliente, o.ordenVenta, o.subtotal, o.iva, o.total]);
                const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
                const l = document.createElement("a");
                l.setAttribute("href", encodeURI(csvContent));
                l.setAttribute("download", "pedidos.csv");
                l.click();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 hover:text-[#003d7a] transition-colors shadow-sm text-xs font-bold uppercase tracking-wider"
          >
            <Download className="w-4 h-4" /> Exportar
          </button>
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
          <div className="min-w-[1300px] grid grid-cols-[50px_40px_100px_90px_130px_90px_140px_90px_100px_100px_110px_50px_70px_1fr_1fr] gap-2 items-center">
            <div className="print:hidden"></div>
            <div className="text-[9px] font-black text-white/90 uppercase tracking-widest print:text-black">Id</div>
            <div className="text-[9px] font-black text-white/90 uppercase tracking-widest print:text-black">Fecha</div>
            <div className="text-[9px] font-black text-white/90 uppercase tracking-widest print:text-black">Status</div>
            <div className="text-[9px] font-black text-white/90 uppercase tracking-widest print:text-black">Status Doc</div>
            <div className="text-[9px] font-black text-white/90 uppercase tracking-widest print:text-black">Login</div>
            <div className="text-[9px] font-black text-white/90 uppercase tracking-widest print:text-black">Cliente</div>
            <div className="text-[9px] font-black text-white/90 uppercase tracking-widest print:text-black">OV</div>
            <div className="text-[9px] font-black text-white/90 uppercase tracking-widest print:text-black text-right">Subtotal</div>
            <div className="text-[9px] font-black text-white/90 uppercase tracking-widest print:text-black text-right">IVA</div>
            <div className="text-[9px] font-black text-white/90 uppercase tracking-widest print:text-black text-right">Total</div>
            <div className="text-[9px] font-black text-white/90 uppercase tracking-widest print:text-black">Serie</div>
            <div className="text-[9px] font-black text-white/90 uppercase tracking-widest print:text-black">Fac</div>
            <div className="text-[9px] font-black text-white/90 uppercase tracking-widest print:text-black text-right">Obs. Cliente</div>
            <div className="text-[9px] font-black text-white/90 uppercase tracking-widest print:text-black text-right">Obs. Nieto</div>
          </div>
        </div>

        <div className="hidden md:block divide-y divide-slate-100 overflow-x-auto custom-scrollbar">
          <div className="min-w-[1300px]">
            {orders.map((order, idx) => (
              <div key={idx} className="grid grid-cols-[50px_40px_100px_90px_130px_90px_140px_90px_100px_100px_110px_50px_70px_1fr_1fr] gap-2 items-center px-4 py-3 hover:bg-slate-50 transition-colors print:bg-transparent">
                <div className="print:hidden flex justify-center">
                  <button onClick={() => setSelectedOrderId(order.id)} className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-brand-blue transition-colors">
                    <Printer className="w-4 h-4 cursor-pointer" />
                  </button>
                </div>
                <div className="text-xs font-bold text-slate-500">#{order.id}</div>
                <div className="text-xs font-black text-[#003d7a] cursor-pointer hover:underline" onClick={() => setSelectedOrderId(order.id)}>
                  {order.fecha}
                </div>
                <div className="text-[10px] font-black uppercase text-slate-600 truncate">{order.status}</div>
                <div className="text-[10px] font-medium text-slate-500 truncate">{order.statusDoc}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">{order.login}</div>
                <div className="text-xs font-bold text-slate-700 truncate" title={order.cliente}>{order.cliente}</div>
                <div className="text-xs font-black text-[#003d7a]">{order.ordenVenta}</div>
                <div className="text-xs font-bold text-slate-600 text-right">{order.subtotal}</div>
                <div className="text-xs font-bold text-slate-400 text-right">{order.iva}</div>
                <div className="text-xs font-black text-[#003d7a] text-right">{order.total}</div>
                <div className="text-xs font-bold text-slate-500">{order.serie || '-'}</div>
                <div className="text-xs font-bold text-slate-500">{order.factura || '-'}</div>
                <div className="text-[10px] font-medium text-slate-500 text-right truncate" title={order.obsCliente}>{order.obsCliente || '-'}</div>
                <div className="text-[10px] font-medium text-slate-500 text-right truncate" title={order.obsNieto}>{order.obsNieto || '-'}</div>
              </div>
            ))}
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
