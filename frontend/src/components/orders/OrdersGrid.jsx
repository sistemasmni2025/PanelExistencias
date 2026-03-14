import React, { useState } from 'react';
import { Search, Calendar, ChevronDown, Filter, FileText, Download } from 'lucide-react';

const OrdersGrid = () => {
  // Mock data representing the table rows
  const mockOrders = [
    {
      id: '10245',
      fecha: '12/03/2026',
      status: 'Facturada',
      statusDoc: 'Facturado',
      login: 'ADMIN',
      cliente: 'Llantas del Centro SA',
      ordenVenta: 'OV-9923',
      subtotal: '$12,450.00',
      iva: '$1,992.00',
      total: '$14,442.00',
      serie: 'A',
      factura: 'F-1022',
      obsCliente: 'Entregar por la tarde',
      obsNieto: 'Cliente frecuente'
    },
    {
      id: '10246',
      fecha: '12/03/2026',
      status: 'Solicitada',
      statusDoc: 'En Captura',
      login: 'VENDEDOR1',
      cliente: 'Automotriz Express',
      ordenVenta: 'OV-9924',
      subtotal: '$8,200.00',
      iva: '$1,312.00',
      total: '$9,512.00',
      serie: '',
      factura: '',
      obsCliente: '',
      obsNieto: 'Requiere validación de crédito'
    },
    {
      id: '10247',
      fecha: '11/03/2026',
      status: 'En Transito',
      statusDoc: 'En Transito',
      login: 'ADMIN',
      cliente: 'Mecánica Rápida',
      ordenVenta: 'OV-9920',
      subtotal: '$4,100.00',
      iva: '$656.00',
      total: '$4,756.00',
      serie: '',
      factura: '',
      obsCliente: 'Error en pedido',
      obsNieto: 'Se sustituyó por OV-9925'
    }
  ];

  return (
    <div className="w-full relative">
      {/* Header Section */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#002b5e] tracking-tight mb-1">
            Mis Pedidos
          </h1>
          <p className="text-sm font-medium text-slate-500">
            Administración y seguimiento histórico de requerimientos
          </p>
        </div>
        
        {/* Action Buttons (Export, Print) */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 hover:text-[#003d7a] transition-colors shadow-sm text-xs font-bold uppercase tracking-wider">
            <Download className="w-4 h-4" /> Exportar
          </button>
        </div>
      </div>

      {/* Filters Control Panel - Premium Michelin Styling */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-5 lg:p-6 mb-8 relative overflow-hidden">
        {/* Decorative accent */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#ffce00]"></div>
        
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-[#003d7a]" />
          <h2 className="text-xs font-black text-[#003d7a] uppercase tracking-widest">Filtros de Búsqueda</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-6">
          {/* Fecha Inicial */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Fecha Inicial</label>
            <div className="relative group">
              <input 
                type="date" 
                defaultValue="2026-03-12"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-3 pr-10 text-sm font-medium text-slate-700 focus:border-[#003d7a] focus:ring-2 focus:ring-[#003d7a]/20 outline-none transition-all hover:bg-white"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#003d7a] pointer-events-none" />
            </div>
          </div>
          
          {/* Fecha Final */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Fecha Final</label>
            <div className="relative group">
              <input 
                type="date" 
                defaultValue="2026-03-12"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-3 pr-10 text-sm font-medium text-slate-700 focus:border-[#003d7a] focus:ring-2 focus:ring-[#003d7a]/20 outline-none transition-all hover:bg-white"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#003d7a] pointer-events-none" />
            </div>
          </div>

          {/* Status */}
          <div className="space-y-1.5 md:col-span-2 lg:col-span-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Status</label>
            <div className="relative group">
              <select className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 pl-3 pr-10 text-sm font-medium text-slate-700 focus:border-[#003d7a] focus:ring-2 focus:ring-[#003d7a]/20 outline-none transition-all appearance-none cursor-pointer hover:bg-white">
                <option>Todos</option>
                <option>Solicitada</option>
                <option>Facturada</option>
                <option>Recepcion Almacen</option>
                <option>Entrega Almacen</option>
                <option>En Transito</option>
                <option>Entregada</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#003d7a] pointer-events-none" />
            </div>
          </div>

          {/* Search Action / Quick Filter */}
          <div className="flex items-end lg:col-span-1">
            <button className="w-full bg-[#003d7a] hover:bg-[#002b5e] text-white rounded-xl py-2 px-4 font-black uppercase tracking-widest text-[11px] transition-all shadow-lg shadow-[#003d7a]/20 flex items-center justify-center gap-2">
              <Search className="w-4 h-4" /> Buscar
            </button>
          </div>
        </div>
      </div>

      {/* Main Data Table */}
      {/* Main Data Table & Mobile Cards */}
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {/* VIEW FOR DESKTOP: Table Header (Michelin Blue) - Hidden on mobile */}
        <div className="hidden md:block bg-[#003d7a] border-b-[3px] border-[#ffce00] px-4 py-3.5 overflow-x-auto hide-scrollbar-mobile">
          <div className="min-w-[1100px] grid grid-cols-12 gap-3 items-center">
            <div className="col-span-1 text-[9px] font-black text-white/90 uppercase tracking-widest">Id / Fecha</div>
            <div className="col-span-2 text-[9px] font-black text-white/90 uppercase tracking-widest">Status / Doc</div>
            <div className="col-span-2 text-[9px] font-black text-white/90 uppercase tracking-widest">Cliente / Login</div>
            <div className="col-span-1 text-[9px] font-black text-white/90 uppercase tracking-widest">OV</div>
            <div className="col-span-3 text-[9px] font-black text-white/90 uppercase tracking-widest text-center">Importes</div>
            <div className="col-span-1 text-[9px] font-black text-white/90 uppercase tracking-widest">Serie/Fac</div>
            <div className="col-span-2 text-[9px] font-black text-white/90 uppercase tracking-widest text-right">Observaciones</div>
          </div>
        </div>

        {/* VIEW FOR DESKTOP: Table Body - Hidden on mobile */}
        <div className="hidden md:block divide-y divide-slate-100 overflow-x-auto custom-scrollbar">
          <div className="min-w-[1100px]">
            {mockOrders.map((order, idx) => (
              <div 
                key={idx} 
                className="grid grid-cols-12 gap-3 items-center px-4 py-3 hover:bg-slate-50 transition-colors group cursor-default"
              >
                {/* ID & Fecha */}
                <div className="col-span-1 flex flex-col">
                  <span className="text-xs font-black text-[#003d7a]">#{order.id}</span>
                  <span className="text-[10px] font-medium text-slate-400">{order.fecha}</span>
                </div>

                {/* Status & Status Doc */}
                <div className="col-span-2 flex flex-col items-start gap-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                    order.status === 'Facturada' || order.status === 'Entregada' ? 'bg-emerald-100 text-emerald-700' : 
                    'bg-amber-100 text-amber-700'
                  }`}>
                    {order.status}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 truncate w-full" title={order.statusDoc}>
                    {order.statusDoc}
                  </span>
                </div>

                {/* Cliente & Login */}
                <div className="col-span-2 flex flex-col">
                  <span className="text-[11px] font-bold text-slate-800 truncate" title={order.cliente}>{order.cliente}</span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{order.login}</span>
                </div>

                {/* OV */}
                <div className="col-span-1">
                  <span className="inline-flex items-center gap-1 text-[11px] font-black text-[#003d7a] bg-blue-50 px-2 py-1 rounded-md border border-blue-100">
                    {order.ordenVenta}
                  </span>
                </div>

                {/* Importes */}
                <div className="col-span-3 flex justify-between items-center bg-slate-50 border border-slate-100 rounded-lg px-2 py-1">
                  <div className="text-center">
                    <p className="text-[8px] font-bold text-slate-400 uppercase mb-0.5">IVA</p>
                    <p className="text-[10px] font-bold text-slate-600">{order.iva}</p>
                  </div>
                  <div className="w-px h-6 bg-slate-200 mx-2"></div>
                  <div className="text-right flex-1">
                    <p className="text-[8px] font-bold text-[#003d7a] uppercase mb-0.5">Total</p>
                    <p className="text-xs font-black text-[#003d7a]">{order.total}</p>
                  </div>
                </div>

                {/* Serie & Factura */}
                <div className="col-span-1 flex flex-col">
                  <span className="text-[11px] font-bold text-slate-700 truncate">{order.serie || '-'}</span>
                  <span className="text-[10px] font-medium text-slate-500 truncate">{order.factura || '-'}</span>
                </div>

                {/* Observaciones */}
                <div className="col-span-2 flex flex-col text-right">
                  <span className="text-[10px] font-semibold text-slate-600 truncate" title={order.obsCliente}>
                    {order.obsCliente || 'N/A'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* VIEW FOR MOBILE: Card List - Visible ONLY on small screens */}
        <div className="md:hidden divide-y divide-slate-100">
          {mockOrders.map((order, idx) => (
            <div key={idx} className="p-5 hover:bg-slate-50 active:bg-slate-100 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-black text-[#003d7a]">#{order.id}</span>
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-tighter ${
                      order.status === 'Facturada' || order.status === 'Entregada' ? 'bg-emerald-100 text-emerald-700' : 
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{order.fecha}</span>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-1 text-xs font-black text-[#003d7a] bg-blue-50 px-2 py-1 rounded-lg border border-blue-100">
                    <FileText className="w-3.5 h-3.5 text-brand-blue" />
                    {order.ordenVenta}
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-4">
                <div className="flex flex-col gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0">
                      <Search className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Cliente</span>
                      <span className="text-sm font-bold text-slate-800 leading-tight">{order.cliente}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-200/60">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Status Doc</span>
                      <span className="text-xs font-bold text-slate-600">{order.statusDoc}</span>
                    </div>
                    <div className="flex flex-col text-right">
                      <span className="text-[9px] font-bold text-[#003d7a] uppercase tracking-widest mb-0.5">Importe Total</span>
                      <span className="text-base font-black text-[#003d7a]">{order.total}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-slate-100 rounded-md">
                    <Download className="w-3.5 h-3.5 text-slate-500" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Detalles</span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-300" />
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer info */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex justify-between items-center">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">
            Total Registros: <span className="text-[#003d7a] text-xs ml-1">3</span>
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrdersGrid;
