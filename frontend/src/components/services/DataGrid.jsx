import React, { useMemo, useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft, ShoppingCart, PlusCircle, FileSpreadsheet, Minus, Plus } from 'lucide-react';

const ALL_BRANCHES = [
  'QRO', 'CEL', 'SLP', 'AGS', 'LEO',
  'IRA', 'REN', 'GDL', 'SIL', 'IRC',
  'LIC', 'BCE', 'TLA', 'WEB', 'ALT',
  'BQRO', 'BJYA', 'VIGA', 'BALT', 'SJR'
];

const ProductRow = ({ product }) => {
  const [quantity, setQuantity] = useState(1);

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  return (
    <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 px-4 lg:px-8 py-6 items-start lg:items-center hover:bg-slate-50/50 transition-all group relative">

      {/* Col 1: Gamma & Branding */}
      <div className="lg:col-span-1 flex lg:flex-col items-center gap-4 lg:gap-3 w-full lg:w-auto border-b lg:border-none border-slate-100 pb-4 lg:pb-0">
        <span className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs border-2 shadow-sm ${product.g === 'G' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-slate-50 text-slate-400 border-slate-100'
          }`}>
          {product.g}
        </span>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-black text-slate-400 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100 uppercase tracking-tighter">
            {product.clave}
          </span>
        </div>
      </div>

      {/* Col 2: Info & Status - Optimized Layout */}
      <div className="lg:col-span-3 space-y-2 lg:space-y-3 w-full lg:w-auto border-b lg:border-none border-slate-100 pb-4 lg:pb-0">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm lg:text-[15px] font-black text-slate-800 leading-snug group-hover:text-brand-red transition-colors pr-2">
            {product.description}
          </h3>
          <button className="shrink-0 p-2 bg-slate-100 text-slate-400 rounded-xl hover:bg-brand-blue hover:text-white transition-all shadow-sm">
            <FileSpreadsheet className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2 lg:gap-3">
          <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 shadow-sm">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">MSPN</span>
            <span className="text-[11px] font-black text-slate-800 leading-none">{product.mspn}</span>
          </span>
          <span className="text-[9px] lg:text-[11px] font-black text-red-600 bg-red-50 px-2 lg:px-3 py-1 rounded border border-red-100 uppercase italic tracking-wide">
            {product.statusDetail}
          </span>
          <div className="hidden lg:block h-3 w-px bg-slate-200"></div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            {product.brand}
          </span>
        </div>
      </div>

      {/* Col 3: Branch Expansion - Responsive Layout */}
      <div className="w-full lg:col-span-4 lg:px-2 border-b lg:border-none border-slate-100 pb-4 lg:pb-0">
        <div className="flex lg:hidden justify-between items-center mb-2">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sucursales</span>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-5 gap-1.5 lg:gap-2">
          {ALL_BRANCHES.map((branchCode) => {
            const br = product.branches.find(b => b.code === branchCode) || { code: branchCode, stock: 0 };
            return (
              <div key={br.code} className={`flex flex-col items-center justify-center p-1.5 rounded-lg border min-w-[32px] lg:min-w-[38px] transition-all ${br.stock > 0
                ? 'bg-white border-slate-200 shadow-sm'
                : 'bg-slate-50/30 border-transparent opacity-30 lg:opacity-20'
                }`}>
                <span className="text-[7px] lg:text-[8px] font-black text-slate-500 mb-0.5 leading-none uppercase">{br.code}</span>
                <span className={`text-[10px] lg:text-[11px] font-black leading-none ${br.stock > 0 ? 'text-brand-blue' : 'text-slate-400'}`}>
                  {br.stock}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex items-center justify-between px-1">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Producto(s)</p>
          <p className="text-[10px] lg:text-[12px] font-black text-slate-800 leading-none">
            DISPONIBLE(S): <span className="text-brand-red ml-1">{product.stock}</span>
          </p>
        </div>
      </div>

      {/* Col 4: Complex Commercial Details & Quantity Control */}
      <div className="w-full lg:col-span-4 flex flex-col sm:flex-row lg:flex-row items-stretch gap-3 lg:h-[84px] pt-2 lg:pt-0">
        <div className="flex-1 flex flex-col gap-2">

          {/* Fila 1: Precios Base */}
          <div className="flex-1 flex justify-between items-center bg-white border border-slate-200 px-2 lg:px-3 py-2 lg:py-0 rounded-xl shadow-sm overflow-x-auto lg:overflow-visible custom-scrollbar hide-scrollbar-mobile">
            <div className="flex flex-col items-center min-w-[50px] lg:min-w-0">
              <span className="text-[7px] font-black text-slate-400 uppercase tracking-wider mb-0.5">N. Parte</span>
              <span className="text-[9px] lg:text-[10px] font-black text-slate-800">{product.mspn}</span>
            </div>
            <div className="w-px h-6 bg-slate-100 mx-1 lg:mx-0 shrink-0"></div>
            <div className="flex flex-col items-center min-w-[50px] lg:min-w-0">
              <span className="text-[7px] font-black text-slate-400 uppercase tracking-wider mb-0.5">P. Lista</span>
              <span className="text-[9px] lg:text-[10px] font-black text-slate-800">${product.priceList.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="w-px h-6 bg-slate-100 mx-1 lg:mx-0 shrink-0"></div>
            <div className="flex flex-col items-center min-w-[30px] lg:min-w-0">
              <span className="text-[7px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Desc</span>
              <span className="text-[9px] lg:text-[10px] font-black text-brand-red">{product.discountPercent}%</span>
            </div>
            <div className="w-px h-6 bg-slate-100 mx-1 lg:mx-0 shrink-0"></div>
            <div className="flex flex-col items-center min-w-[30px] lg:min-w-0">
              <span className="text-[7px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Promo</span>
              <span className="text-[9px] lg:text-[10px] font-black text-brand-red">{product.promotion}%</span>
            </div>
            <div className="w-px h-6 bg-slate-100 mx-1 lg:mx-0 shrink-0"></div>
            <div className="flex flex-col items-center min-w-[30px] lg:min-w-0">
              <span className="text-[7px] font-black text-slate-400 uppercase tracking-wider mb-0.5">%NC</span>
              <span className="text-[9px] lg:text-[10px] font-black text-amber-500">{product.ncPercent}%</span>
            </div>
            <div className="w-px h-6 bg-slate-100 mx-1 lg:mx-0 shrink-0"></div>
            <div className="flex flex-col items-center min-w-[50px] lg:min-w-0">
              <span className="text-[7px] font-black text-brand-red uppercase tracking-wider mb-0.5" title="Precio Facturado">Facturado</span>
              <span className="text-[9px] lg:text-[10px] font-bold text-slate-800">${product.precioFacturado ? product.precioFacturado.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'}</span>
            </div>
          </div>

          {/* Fila 2: Detalle de Piso */}
          <div className="flex-1 flex justify-between items-center bg-[#003d7a] border border-[#002b5e] px-2 lg:px-3 py-2 lg:py-0 rounded-xl shadow-lg relative overflow-hidden overflow-x-auto lg:overflow-hidden hide-scrollbar-mobile">
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#ffce00]/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none"></div>

            <div className="flex flex-col items-center z-10 min-w-[40px] lg:min-w-0">
              <span className="text-[6px] lg:text-[7px] font-black text-blue-300 uppercase tracking-wider mb-0.5">Desc. Piso</span>
              <span className="text-[9px] lg:text-[10px] font-bold text-white">{product.piso.desc}%</span>
            </div>
            <div className="flex flex-col items-center z-10 min-w-[40px] lg:min-w-0">
              <span className="text-[6px] lg:text-[7px] font-black text-blue-300 uppercase tracking-wider mb-0.5">Promo P.</span>
              <span className="text-[9px] lg:text-[10px] font-bold text-white">{product.piso.promo || '0.00'}%</span>
            </div>
            <div className="flex flex-col items-center z-10 min-w-[50px] lg:min-w-0">
              <span className="text-[6px] lg:text-[7px] font-black text-blue-300 uppercase tracking-wider mb-0.5">Venta P.</span>
              <span className="text-[9px] lg:text-[10px] font-bold text-white">${product.piso.venta.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex flex-col items-center z-10 min-w-[50px] lg:min-w-0">
              <span className="text-[6px] lg:text-[7px] font-black text-blue-300 uppercase tracking-wider mb-0.5">IVA P.</span>
              <span className="text-[9px] lg:text-[10px] font-bold text-white">${product.piso.iva.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex flex-col items-center ml-2 pl-2 lg:pl-3 border-l border-[#2e3b52] z-10 min-w-[60px] lg:min-w-0">
              <span className="text-[6px] lg:text-[7px] font-black text-brand-red uppercase tracking-wider mb-0.5">P. Neto</span>
              <span className="text-[11px] lg:text-[12px] font-black text-green-400">${product.piso.neto.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* Quantity Selector & Action */}
        <div className="flex sm:flex-col lg:flex-col gap-2 shrink-0 w-full sm:w-[100px] lg:w-[100px] mt-2 sm:mt-0">
          <div className="flex-1 flex items-center justify-between bg-slate-100 px-1 py-1 lg:py-0 rounded-xl border border-slate-200 shadow-inner">
            <button
              onClick={handleDecrement}
              className="p-2 lg:p-1 hover:bg-white hover:text-brand-red rounded-lg transition-all active:scale-90 text-slate-400 bg-transparent"
            >
              <Minus className="w-4 h-4 lg:w-3.5 lg:h-3.5" />
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full text-center bg-transparent border-none text-sm lg:text-[12px] font-black text-slate-800 p-0 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              onClick={handleIncrement}
              className="p-2 lg:p-1 hover:bg-white hover:text-brand-blue rounded-lg transition-all active:scale-90 text-slate-400 bg-transparent"
            >
              <Plus className="w-4 h-4 lg:w-3.5 lg:h-3.5" />
            </button>
          </div>

          <button className="flex-1 flex items-center justify-center bg-[#ffce00] text-[#002b5e] py-3 lg:py-0 rounded-xl hover:bg-[#e6ba00] hover:shadow-xl hover:shadow-[#ffce00]/40 transition-all active:scale-95 group/btn border border-[#e6ba00]">
            <ShoppingCart className="w-5 h-5 lg:w-4 lg:h-4 group-hover/btn:scale-110 transition-transform" />
            <span className="ml-2 text-xs font-black uppercase tracking-wider block sm:hidden">Añadir</span>
          </button>
        </div>
      </div>

    </div>
  );
};

const DataGrid = ({ products: externalProducts }) => {
  const products = externalProducts || [];
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const gridRef = useRef(null);
  
  const totalPages = Math.max(1, Math.ceil(products.length / itemsPerPage));

  useEffect(() => {
    setCurrentPage(1);
  }, [products]);

  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentPage]);

  const paginatedProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div ref={gridRef} className="relative animate-slide-up">
      {/* Table Header - Cascading Sticky (Fixed to top of Page Scroll) - Hidden on Mobile */}
      <div className="hidden lg:block sticky top-0 z-[60] -mx-px">
        <div className="bg-[#003d7a] border-b border-[#ffce00] shadow-xl rounded-t-[2.5rem] px-8 py-5 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#ffce00]"></div>
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-1 text-[10px] font-bold text-blue-200 uppercase tracking-widest text-center">Gamma / Clave</div>
            <div className="col-span-3 text-[10px] font-bold text-blue-200 uppercase tracking-widest">Información & status</div>
            <div className="col-span-4 text-[10px] font-bold text-blue-200 uppercase tracking-widest text-center">Sucursales</div>
            <div className="col-span-4 text-[10px] font-bold text-blue-200 uppercase tracking-widest text-center">Condiciones y Detalle de Piso</div>
          </div>
        </div>
      </div>

      {/* Table Body - Stacked Cards on Mobile, Horizontal Rows on Desktop */}
      <div className="bg-white border lg:border-t-0 border-slate-100 rounded-[2rem] lg:rounded-t-none lg:rounded-b-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden divide-y divide-slate-100/50 mt-4 lg:mt-0">
        {paginatedProducts.map((product) => (
          <ProductRow key={product.id} product={product} />
        ))}

        {/* Footer Info - Pagination Controls */}
        <div className="bg-slate-50 px-8 py-5 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-[12px] font-bold text-slate-500">
          <div>Página {currentPage} de {totalPages} <span className="font-normal text-[10px] ml-2 tracking-widest uppercase">({products.length} resultados)</span></div>
          <div className="flex gap-1.5 items-center">
            <button 
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className={`p-2 border rounded-lg transition-colors shadow-sm ${currentPage === 1 ? 'opacity-50 cursor-not-allowed bg-slate-100 border-slate-200' : 'bg-white border-slate-300 hover:bg-slate-50 hover:text-[#003d7a]'}`}
              title="Primera página"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`p-2 border rounded-lg transition-colors shadow-sm ${currentPage === 1 ? 'opacity-50 cursor-not-allowed bg-slate-100 border-slate-200' : 'bg-white border-slate-300 hover:bg-slate-50 hover:text-[#003d7a]'}`}
              title="Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`p-2 border rounded-lg transition-colors shadow-sm ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed bg-slate-100 border-slate-200' : 'bg-white border-slate-300 hover:bg-slate-50 hover:text-[#003d7a]'}`}
              title="Siguiente"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className={`p-2 border rounded-lg transition-colors shadow-sm ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed bg-slate-100 border-slate-200' : 'bg-white border-slate-300 hover:bg-slate-50 hover:text-[#003d7a]'}`}
              title="Última página"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataGrid;
