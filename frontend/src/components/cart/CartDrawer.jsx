import React, { useState } from 'react';
import { X, Trash2, Save, ShoppingCart, AlertCircle, DollarSign, Info } from 'lucide-react';

const CartDrawer = ({ isOpen, onClose, cart = [], onRemove, onClear, sucursal }) => {
  const subtotal = cart.reduce((acc, item) => acc + (item.piso.venta * item.quantity), 0);
  const totalIva = cart.reduce((acc, item) => acc + (item.piso.iva * item.quantity), 0);
  const grandTotal = cart.reduce((acc, item) => acc + (item.piso.neto * item.quantity), 0);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleCancelClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmCancel = () => {
    onClear();
    setShowConfirm(false);
  };
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-full md:w-[600px] xl:w-[800px] bg-slate-50 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Header */}
        <div className="bg-[#003d7a] text-white px-6 py-4 flex items-center justify-between shrink-0 shadow-lg relative overflow-hidden border-b-[3px] border-[#ffce00]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffce00]/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

          <div className="flex items-center gap-4 relative z-10">
            <div className="p-2.5 bg-brand-red rounded-xl shadow-lg shadow-brand-red/20">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-widest">Resumen de Compra</h2>
              <p className="text-[10px] font-bold text-blue-200 uppercase tracking-tight">Sucursal: {sucursal || 'General'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white/5 hover:bg-[#ffce00] text-slate-100 hover:text-[#003d7a] rounded-xl transition-all relative z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Items */}
        <div className="flex-1 overflow-auto p-6 space-y-4">

          {/* Item Headers (PC) */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 bg-white border border-slate-200 rounded-xl shadow-sm mb-4 sticky top-0 z-10">
            <div className="col-span-2 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Clave / N.Parte</div>
            <div className="col-span-6 text-[9px] font-black text-slate-400 uppercase tracking-widest">Descripción</div>
            <div className="col-span-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Cant / Total</div>
            <div className="col-span-1 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Acciones</div>
          </div>

          {/* Cart Items List */}
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-dashed border-slate-300 rounded-[2.5rem] opacity-60">
              <ShoppingCart className="w-12 h-12 text-slate-300 mb-4" />
              <p className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">El carrito está vacío</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col gap-4 relative overflow-hidden group mb-4">
                <div className="absolute top-0 left-0 w-1 h-full bg-brand-blue"></div>

                <div className="flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-2 flex flex-col items-center">
                    <span className="text-xs font-black text-slate-800">{item.clave}</span>
                    <span className="text-[10px] font-bold text-slate-400">{item.id}</span>
                  </div>

                  <div className="md:col-span-6 flex flex-col text-center md:text-left">
                    <span className="text-xs font-black text-slate-800">{item.description}</span>
                    <span className="text-[10px] font-bold text-slate-400 tracking-tight">{item.brand}</span>
                  </div>

                  <div className="md:col-span-3 flex justify-center gap-4">
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Cant</span>
                      <span className="text-xs font-black text-brand-blue bg-blue-50 px-2 py-0.5 rounded">{item.quantity}</span>
                    </div>
                    <div className="w-px h-8 bg-slate-100"></div>
                    <div className="flex flex-col items-center">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Total</span>
                      <span className="text-[13px] font-black text-green-500">${(item.piso.neto * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>

                  <div className="md:col-span-1 flex justify-center">
                    <button
                      onClick={() => onRemove(item.id)}
                      className="p-2 text-slate-300 hover:text-brand-red hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}



        </div>

        {/* Footer - Totals & Actions */}
        <div className="bg-white border-t border-slate-200 p-6 shrink-0 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">

          <div className="flex flex-col md:flex-row items-end justify-between gap-6">
            <div className="flex gap-3 w-full md:w-auto">
              <button
                onClick={handleCancelClick}
                disabled={cart.length === 0}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-100 hover:bg-brand-red text-slate-500 hover:text-white rounded-xl font-bold text-[11px] tracking-widest uppercase transition-all shadow-sm hover:shadow-lg hover:shadow-brand-red/20 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Cancelar
              </button>
              <button
                disabled={cart.length === 0}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3.5 bg-[#ffce00] hover:bg-[#e6ba00] text-[#002b5e] rounded-xl font-black text-[11px] tracking-widest uppercase transition-all shadow-lg shadow-[#ffce00]/30 hover:shadow-xl hover:shadow-[#ffce00]/40 hover:-translate-y-0.5 group border border-[#e6ba00] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <DollarSign className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Comprar
              </button>
            </div>

            <div className="flex flex-col items-end gap-1 w-full md:w-auto bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div className="flex justify-between w-full md:w-48">
                <span className="text-[10px] font-black text-brand-red uppercase tracking-widest">Subtotal</span>
                <span className="text-xs font-bold text-slate-700">${subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between w-full md:w-48">
                <span className="text-[10px] font-black text-brand-red uppercase tracking-widest">IVA</span>
                <span className="text-xs font-bold text-slate-700">${totalIva.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="w-full h-px bg-slate-200 my-1"></div>
              <div className="flex justify-between w-full md:w-48 items-center mt-1">
                <span className="text-[12px] font-black text-slate-800 uppercase tracking-widest">Total</span>
                <span className="text-xl font-black text-[#003d7a]">${grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-[110] px-4">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowConfirm(false)}
          />
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl border border-slate-100 relative z-10 animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-brand-red" />
            </div>
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest text-center mb-2">
              ¿Deseas Vaciar el Carrito?
            </h3>
            <div className="flex flex-col gap-3">
              <button
                onClick={handleConfirmCancel}
                className="w-full py-4 bg-brand-red hover:bg-red-700 text-white rounded-2xl font-black text-[11px] tracking-widest uppercase transition-all shadow-lg shadow-brand-red/20 active:scale-95"
              >
                Sí, Vaciar Todo
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-2xl font-black text-[11px] tracking-widest uppercase transition-all active:scale-95"
              >
                No, Mantener Productos
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartDrawer;
