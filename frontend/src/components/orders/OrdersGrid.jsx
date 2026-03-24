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
    <div className="fixed inset-0 z-50 flex py-10 justify-center px-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white w-full max-w-5xl shadow-2xl relative h-max min-h-[500px]">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-slate-100 rounded text-slate-500">
          <X className="w-6 h-6" />
        </button>

        <div className="p-6">
          {/* Header to match screenshot Exactly */}
          <div className="mb-4 text-slate-800">
            <h2 className="text-[19px] font-bold mb-1">Venta Information</h2>
            <p className="text-[13px] text-slate-700">Id C &nbsp;{data?.header?.id_c || orderId}</p>
          </div>

          {/* Old System Tabs */}
          <div className="flex items-end border-b border-black mb-4">
            {[
              { id: 'general', label: 'General' },
              { id: 'detalle', label: 'Detalle' },
              { id: 'surtimiento', label: 'Surtimiento' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-1.5 text-[13px] font-medium rounded-t-lg mr-1 border border-b-0 border-black transition-none ${
                  activeTab === tab.id 
                    ? 'bg-white text-[#b50035] border-t-2 border-t-[#b50035] border-x-black z-10 -mb-[1px]' 
                    : 'bg-[#2b2b2b] text-white hover:bg-[#3b3b3b]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="px-1 text-[13px] text-slate-700 font-sans pb-10">
            {loading ? (
              <div className="py-20 text-center text-slate-500">Cargando...</div>
            ) : data ? (
              <>
                {activeTab === 'general' && (
                  <div className="flex flex-col gap-1.5 max-w-sm">
                    {[
                      { label: 'Id', value: data.header.id },
                      { label: 'Fecha', value: data.header.fecha },
                      { label: 'Status', value: data.header.status_desc },
                      { label: 'Login', value: data.header.login },
                      { label: 'No.Cliente', value: data.header.no_cliente },
                      { label: 'Orden de Venta', value: data.header.orden_venta },
                      { label: 'Subtotal', value: data.header.subtotal.replace('$', '') },
                      { label: 'Iva', value: data.header.iva.replace('$', '') },
                      { label: 'Total', value: data.header.total.replace('$', '') },
                      { label: 'Tipo', value: data.header.tipo },
                      { label: 'Tipo', value: data.header.tipo_bool },
                      { label: 'Observaciones', value: data.header.observaciones },
                      { label: 'Id C', value: data.header.id_c },
                      { label: 'Serie', value: data.header.serie },
                      { label: 'Factura', value: data.header.factura },
                      { label: 'Status', value: data.header.status === 'S' ? 'Solicitada' : data.header.status },
                      { label: 'Solicitud', value: data.header.solicitud },
                      { label: 'Factura', value: data.header.factura_hora },
                      { label: 'Almacén', value: data.header.almacen },
                      { label: 'Entrega', value: data.header.entrega },
                      { label: 'Recepción', value: data.header.recepcion },
                      { label: 'Tránsito', value: data.header.transito },
                      { label: 'Id. Sucursal', value: data.header.sucursal },
                      { label: 'Ruta', value: data.header.ruta },
                      { label: 'Vehiculo', value: data.header.vehiculo },
                      { label: 'Usuario', value: data.header.usuario_nombre, link: true },
                      { label: 'Observacion', value: data.header.observacion_n },
                      { label: 'Sucursal', value: data.header.sucursal },
                      { label: 'Login', value: data.header.login },
                      { label: 'Usuario Nombre', value: data.header.usuario_nombre },
                      { label: 'Perfil Id', value: '0' },
                      { label: 'Recibio', value: data.header.recibio },
                      { label: 'Surtimiento', value: data.header.surtimiento }
                    ].map((field, i) => (
                      <div key={i} className="flex">
                        <div className="w-[140px] shrink-0 text-slate-500">{field.label}</div>
                        <div className="flex-1">
                          {field.link ? (
                            <span className="text-slate-600 underline cursor-pointer">{field.value}</span>
                          ) : (
                            field.value || ''
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'detalle' && (
                  <div className="overflow-x-auto border-t border-slate-300">
                    <table className="w-full text-left text-[12px] border-collapse whitespace-nowrap">
                      <thead className="bg-[#b50035] text-white">
                        <tr>
                          <th className="px-2 py-1.5 font-semibold text-center border-r border-[#95002a]">Clave</th>
                          <th className="px-2 py-1.5 font-semibold border-r border-[#95002a]">Descripción</th>
                          <th className="px-2 py-1.5 font-semibold text-center border-r border-[#95002a]">Iva</th>
                          <th className="px-2 py-1.5 font-semibold text-center border-r border-[#95002a]">Cantidad</th>
                          <th className="px-2 py-1.5 font-semibold text-center border-r border-[#95002a]">Venta</th>
                          <th className="px-2 py-1.5 font-semibold text-center border-r border-[#95002a]">Iva Importe</th>
                          <th className="px-2 py-1.5 font-semibold text-center border-r border-[#95002a]">Detalle Subtotal</th>
                          <th className="px-2 py-1.5 font-semibold text-center border-r border-[#95002a]">Costo</th>
                          <th className="px-2 py-1.5 font-semibold text-center border-r border-[#95002a]">P. Lista</th>
                          <th className="px-2 py-1.5 font-semibold text-center border-r border-[#95002a]">Detalle Original</th>
                          <th className="px-2 py-1.5 font-semibold text-center border-r border-[#95002a]">Detallemfdescncp</th>
                          <th className="px-2 py-1.5 font-semibold text-center">Detalle PVN</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.items.map((item, i) => (
                          <tr key={i} className="border-b border-slate-100/50 hover:bg-slate-50">
                            <td className="px-2 py-1 text-slate-700 text-center">{item.clave}</td>
                            <td className="px-2 py-1 text-slate-600">{item.descripcion}</td>
                            <td className="px-2 py-1 text-slate-700 text-center">{item.iva}</td>
                            <td className="px-2 py-1 text-slate-900 text-right">{item.cantidad}</td>
                            <td className="px-2 py-1 text-slate-700 text-right">{item.venta.replace('$', '')}</td>
                            <td className="px-2 py-1 text-slate-700 text-right">{item.iva_importe.replace('$', '')}</td>
                            <td className="px-2 py-1 text-slate-700 text-right">{item.subtotal.replace('$', '')}</td>
                            <td className="px-2 py-1 text-slate-700 text-right">{item.costo.replace('$', '')}</td>
                            <td className="px-2 py-1 text-slate-700 text-right">{item.p_lista.replace('$', '')}</td>
                            <td className="px-2 py-1 text-slate-700 text-right">{item.original}</td>
                            <td className="px-2 py-1 text-slate-700 text-right">{item.mfdescncp.replace('$', '')}</td>
                            <td className="px-2 py-1 text-slate-700 text-right">{item.pvn.replace('$', '')}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'surtimiento' && (
                  <div className="overflow-x-auto border-t border-slate-300">
                    <table className="w-full text-left text-[12px] border-collapse whitespace-nowrap">
                      <thead className="bg-[#b50035] text-white">
                        <tr>
                          <th className="px-2 py-1.5 font-semibold text-center border-r border-[#95002a]">Clave</th>
                          <th className="px-2 py-1.5 font-semibold text-center border-r border-[#95002a]">Actual</th>
                          <th className="px-2 py-1.5 font-semibold border-r border-[#95002a]">Nombre</th>
                          <th className="px-2 py-1.5 font-semibold text-center border-r border-[#95002a]">Terminado</th>
                          <th className="px-2 py-1.5 font-semibold text-center border-r border-[#95002a]">Pedido</th>
                          <th className="px-2 py-1.5 font-semibold text-center border-r border-[#95002a]">Porcentaje Inicial</th>
                          <th className="px-2 py-1.5 font-semibold text-center border-r border-[#95002a]">Porcentaje Actual</th>
                          <th className="px-2 py-1.5 font-semibold text-center border-r border-[#95002a]">Marca</th>
                          <th className="px-2 py-1.5 font-semibold text-center">Grupo</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.surtimiento.map((st, i) => (
                          <tr key={i} className="border-b border-slate-100/50 hover:bg-slate-50">
                            <td className="px-2 py-1 text-slate-700 text-center">{st.clave}</td>
                            <td className="px-2 py-1 text-slate-900 text-right">{st.actual}</td>
                            <td className="px-2 py-1 text-slate-600">{st.nombre}</td>
                            <td className="px-2 py-1 text-center">
                              {st.terminado ? (
                                <div className="w-3.5 h-3.5 mx-auto bg-slate-200 border border-slate-300 rounded-sm flex items-center justify-center">
                                  <svg className="w-3 h-3 text-white fill-current" viewBox="0 0 20 20"><path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/></svg>
                                </div>
                              ) : (
                                <div className="w-3.5 h-3.5 mx-auto bg-white border border-slate-300 rounded-sm"></div>
                              )}
                            </td>
                            <td className="px-2 py-1 text-slate-900 text-center">{st.pedido}</td>
                            <td className="px-2 py-1 text-slate-900 text-center">{st.porcentaje_inicial}</td>
                            <td className="px-2 py-1 text-slate-900 text-center">{st.porcentaje_inicial}</td>
                            <td className="px-2 py-1 text-slate-700 text-center">{st.marca}</td>
                            <td className="px-2 py-1 text-slate-700 text-center">{st.grupo}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            ) : (
              <div className="py-20 text-slate-500">Error cargando detalles.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const OrdersGrid = ({ user }) => {
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
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#002b5e] tracking-tight mb-1">
            Mis Pedidos
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Administración y seguimiento histórico de requerimientos
          </p>
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
