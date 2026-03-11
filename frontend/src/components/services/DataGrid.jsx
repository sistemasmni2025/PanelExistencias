import React, { useMemo, useState } from 'react';
import { ChevronRight, ShoppingCart, PlusCircle, FileSpreadsheet, Minus, Plus } from 'lucide-react';

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
    <div className="grid grid-cols-12 gap-6 px-8 py-6 items-center hover:bg-slate-50/50 transition-all group">

      {/* Col 1: Gamma & Branding */}
      <div className="col-span-1 flex flex-col items-center gap-3">
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
      <div className="col-span-3 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[15px] font-black text-slate-800 leading-snug group-hover:text-brand-red transition-colors">
            {product.description}
          </h3>
          <button className="shrink-0 p-2 bg-slate-100 text-slate-400 rounded-xl hover:bg-brand-blue hover:text-white transition-all shadow-sm">
            <FileSpreadsheet className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 shadow-sm">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">MSPN</span>
            <span className="text-[11px] font-black text-slate-800 leading-none">{product.mspn}</span>
          </span>
          <span className="text-[11px] font-black text-red-600 bg-red-50 px-3 py-1 rounded border border-red-100 uppercase italic tracking-wide">
            {product.statusDetail}
          </span>
          <div className="h-3 w-px bg-slate-200"></div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            {product.brand}
          </span>
        </div>
      </div>

      {/* Col 3: Branch Expansion - Increased Visibility */}
      <div className="col-span-4 px-2">
        <div className="grid grid-cols-5 gap-1.5">
          {ALL_BRANCHES.map((branchCode) => {
            const br = product.branches.find(b => b.code === branchCode) || { code: branchCode, stock: 0 };
            return (
              <div key={br.code} className={`flex flex-col items-center justify-center p-1.5 rounded-lg border min-w-[38px] transition-all ${br.stock > 0
                ? 'bg-white border-slate-200 shadow-sm'
                : 'bg-slate-50/30 border-transparent opacity-20'
                }`}>
                <span className="text-[8px] font-black text-slate-500 mb-0.5 leading-none uppercase">{br.code}</span>
                <span className={`text-[11px] font-black leading-none ${br.stock > 0 ? 'text-brand-blue' : 'text-slate-400'}`}>
                  {br.stock}
                </span>
              </div>
            );
          })}
        </div>
        <div className="mt-3 flex items-center justify-between px-1">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] leading-none">Producto(s)</p>
          <p className="text-[12px] font-black text-slate-800 leading-none">
            DISPONIBLE(S): <span className="text-brand-red ml-1">{product.stock}</span>
          </p>
        </div>
      </div>

      {/* Col 4: Complex Commercial Details & Quantity Control */}
      <div className="col-span-4 flex items-stretch gap-3 h-[84px]">
        <div className="flex-1 flex flex-col gap-2">

          {/* Fila 1: Precios Base */}
          <div className="flex-1 flex justify-between items-center bg-white border border-slate-200 px-3 rounded-xl shadow-sm">
            <div className="flex flex-col items-center">
              <span className="text-[7px] font-black text-slate-400 uppercase tracking-wider mb-0.5">N. Parte</span>
              <span className="text-[10px] font-black text-slate-800">{product.mspn}</span>
            </div>
            <div className="w-px h-6 bg-slate-100"></div>
            <div className="flex flex-col items-center">
              <span className="text-[7px] font-black text-slate-400 uppercase tracking-wider mb-0.5">P. Lista</span>
              <span className="text-[10px] font-black text-slate-800">${product.priceList.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="w-px h-6 bg-slate-100"></div>
            <div className="flex flex-col items-center">
              <span className="text-[7px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Desc</span>
              <span className="text-[10px] font-black text-brand-red">{product.discountPercent}%</span>
            </div>
            <div className="w-px h-6 bg-slate-100"></div>
            <div className="flex flex-col items-center">
              <span className="text-[7px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Promo</span>
              <span className="text-[10px] font-black text-brand-red">{product.promotion}%</span>
            </div>
            <div className="w-px h-6 bg-slate-100"></div>
            <div className="flex flex-col items-center">
              <span className="text-[7px] font-black text-slate-400 uppercase tracking-wider mb-0.5">%NC</span>
              <span className="text-[10px] font-black text-amber-500">{product.ncPercent}%</span>
            </div>
          </div>

          {/* Fila 2: Detalle de Piso */}
          <div className="flex-1 flex justify-between items-center bg-slate-900 border border-slate-800 px-3 rounded-xl shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-16 h-16 bg-white/5 rounded-full blur-2xl -mr-8 -mt-8"></div>

            <div className="flex flex-col items-center z-10">
              <span className="text-[7px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Desc. Piso</span>
              <span className="text-[10px] font-bold text-slate-200">{product.piso.desc}%</span>
            </div>
            <div className="flex flex-col items-center z-10">
              <span className="text-[7px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Promo P.</span>
              <span className="text-[10px] font-bold text-slate-200">{product.piso.promo || '0.00'}%</span>
            </div>
            <div className="flex flex-col items-center z-10">
              <span className="text-[7px] font-black text-slate-400 uppercase tracking-wider mb-0.5">Venta P.</span>
              <span className="text-[10px] font-bold text-slate-200">${product.piso.venta.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex flex-col items-center z-10">
              <span className="text-[7px] font-black text-slate-400 uppercase tracking-wider mb-0.5">IVA P.</span>
              <span className="text-[10px] font-bold text-slate-200">${product.piso.iva.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex flex-col items-center ml-2 pl-3 border-l border-slate-700/50 z-10">
              <span className="text-[7px] font-black text-brand-red uppercase tracking-wider mb-0.5">P. Neto</span>
              <span className="text-[12px] font-black text-green-400">${product.piso.neto.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        {/* Quantity Selector & Action */}
        <div className="flex flex-col gap-2 shrink-0 w-[100px]">
          <div className="flex-1 flex items-center justify-between bg-slate-100 px-1 rounded-xl border border-slate-200 shadow-inner">
            <button
              onClick={handleDecrement}
              className="p-1 hover:bg-white hover:text-brand-red rounded-lg transition-all active:scale-90 text-slate-400 bg-transparent"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full text-center bg-transparent border-none text-[12px] font-black text-slate-800 p-0 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
            <button
              onClick={handleIncrement}
              className="p-1 hover:bg-white hover:text-brand-blue rounded-lg transition-all active:scale-90 text-slate-400 bg-transparent"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button className="flex-1 flex items-center justify-center bg-slate-900 text-white rounded-xl hover:bg-brand-red hover:shadow-xl hover:shadow-brand-red/30 transition-all active:scale-95 group/btn border border-slate-800">
            <ShoppingCart className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>

    </div>
  );
};

const DataGrid = () => {
  // Enriched Mock data with 10 products
  const products = useMemo(() => [
    {
      id: 1, g: 'G', clave: 'AAU-163', statusDetail: 'Fuera de Gamma',
      description: '205/65R15 94H TIGAR HIGH PERF 4001',
      mspn: '17418', brand: 'Tigar High Performance', stock: 154,
      priceList: 1175.00, discountPercent: 23.00, promotion: 0.00, ncPercent: 0.00,
      piso: { desc: 13.00, venta: 1022.25, iva: 163.56, neto: 1185.81 },
      branches: [
        { code: 'QRO', stock: 12 }, { code: 'CEL', stock: 8 }, { code: 'SLP', stock: 45 },
        { code: 'AGS', stock: 2 }, { code: 'LEO', stock: 15 }, { code: 'IRA', stock: 0 },
        { code: 'REN', stock: 30 }, { code: 'GDL', stock: 10 }, { code: 'SIL', stock: 5 },
        { code: 'IRC', stock: 12 }, { code: 'LIC', stock: 0 }, { code: 'BCE', stock: 7 },
        { code: 'TLA', stock: 3 }, { code: 'WEB', stock: 5 }, { code: 'ALT', stock: 0 },
        { code: 'BQRO', stock: 0 }, { code: 'BJYA', stock: 0 }, { code: 'VIGA', stock: 0 },
        { code: 'BALT', stock: 0 }, { code: 'SJR', stock: 0 }
      ]
    },
    {
      id: 2, g: 'G', clave: 'AAU-165', statusDetail: 'Fuera de Gamma',
      description: '195/70R14 91H TIGAR TOURING 3001',
      mspn: '82814', brand: 'Tigar Performance', stock: 42,
      priceList: 1019.00, discountPercent: 23.00, promotion: 0.00, ncPercent: 0.00,
      piso: { desc: 13.00, venta: 886.53, iva: 141.84, neto: 1028.37 },
      branches: [
        { code: 'QRO', stock: 5 }, { code: 'CEL', stock: 0 }, { code: 'SLP', stock: 10 },
        { code: 'AGS', stock: 0 }, { code: 'LEO', stock: 2 }, { code: 'IRA', stock: 25 },
        { code: 'BQRO', stock: 0 }, { code: 'BJYA', stock: 0 }, { code: 'VIGA', stock: 0 }
      ]
    },
    {
      id: 3, g: 'G', clave: 'AAU-170', statusDetail: 'Fuera de Gamma',
      description: '215/60R15 94T TIGAR HIGH PERF TL',
      mspn: '42222', brand: 'Tigar High Performance', stock: 8,
      priceList: 1332.00, discountPercent: 23.00, promotion: 0.00, ncPercent: 0.00,
      piso: { desc: 13.00, venta: 1158.84, iva: 185.41, neto: 1344.25 },
      branches: [{ code: 'SLP', stock: 3 }, { code: 'QRO', stock: 5 }]
    },
    {
      id: 4, g: 'G', clave: 'AAU-173', statusDetail: 'Fuera de Gamma',
      description: '205/65R16 95H TIGAR HIG PERF TL',
      mspn: '34458', brand: 'Tigar High Performance', stock: 1,
      priceList: 1321.00, discountPercent: 23.00, promotion: 0.00, ncPercent: 0.00,
      piso: { desc: 13.00, venta: 1149.27, iva: 183.88, neto: 1333.15 },
      branches: [{ code: 'IRC', stock: 1 }]
    },
    {
      id: 5, g: 'G', clave: 'AAU-184', statusDetail: 'Fuera de Gamma',
      description: '235/60R16 100H TIGAR HIGH PERF',
      mspn: '75815', brand: 'Tigar High Performance', stock: 1,
      priceList: 1445.00, discountPercent: 23.00, promotion: 0.00, ncPercent: 0.00,
      piso: { desc: 13.00, venta: 1257.15, iva: 201.14, neto: 1458.29 },
      branches: [{ code: 'LIC', stock: 1 }]
    },
    {
      id: 6, g: 'G', clave: 'AAU-226', statusDetail: 'Fuera de Gamma',
      description: '195/70R14 TAURUS TOURING 3001 91H',
      mspn: 'AAU-226', brand: 'Taurus Touring', stock: 1,
      priceList: 989.35, discountPercent: 23.00, promotion: 0.00, ncPercent: 0.00,
      piso: { desc: 13.00, venta: 860.73, iva: 137.72, neto: 998.45 },
      branches: [{ code: 'LIC', stock: 1 }]
    },
    {
      id: 7, g: 'F', clave: 'BAU-242', statusDetail: 'Fuera de Gamma',
      description: '215/50R16 TRACTION T/A 89V PN',
      mspn: '47261', brand: 'BFGoodrich Traction', stock: 1,
      priceList: 2906.00, discountPercent: 25.00, promotion: 0.00, ncPercent: 0.00,
      piso: { desc: 25.00, venta: 2179.50, iva: 348.72, neto: 2528.22 },
      branches: [{ code: 'QRO', stock: 1 }]
    },
    {
      id: 8, g: 'F', clave: 'BAU-256', statusDetail: 'Fuera de Gamma',
      description: 'P155/80R15 RADIAL T/A 83S LRD',
      mspn: '06462', brand: 'BFGoodrich Radial', stock: 1,
      priceList: 2660.00, discountPercent: 25.00, promotion: 0.00, ncPercent: 0.00,
      piso: { desc: 25.00, venta: 1995.00, iva: 319.20, neto: 2314.20 },
      branches: [{ code: 'AGS', stock: 1 }]
    },
    {
      id: 9, g: 'F', clave: 'BAU-304', statusDetail: 'Fuera de Gamma',
      description: '285/30ZR20 G-FORCE TA KDW 99Y',
      mspn: '93701', brand: 'BFGoodrich G-Force', stock: 1,
      priceList: 8920.00, discountPercent: 25.00, promotion: 0.00, ncPercent: 0.00,
      piso: { desc: 25.00, venta: 6690.00, iva: 1070.40, neto: 7760.40 },
      branches: [{ code: 'LIC', stock: 1 }]
    },
    {
      id: 10, g: 'F', clave: 'BAU-331', statusDetail: 'Fuera de Gamma',
      description: '255/35ZR20 G-FORCE T/A KDW 93Y',
      mspn: '49407', brand: 'BFGoodrich G-Force', stock: 1,
      priceList: 7174.00, discountPercent: 25.00, promotion: 0.00, ncPercent: 0.00,
      piso: { desc: 25.00, venta: 5380.50, iva: 860.88, neto: 6241.38 },
      branches: [{ code: 'LIC', stock: 1 }]
    }
  ], []);

  return (
    <div className="relative animate-slide-up">
      {/* Table Header - Cascading Sticky (Fixed to top of Page Scroll) */}
      <div className="sticky top-0 z-[60] -mx-px">
        <div className="bg-slate-900 border-b border-slate-800 shadow-xl rounded-t-[2.5rem] px-8 py-5">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-1 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">G / Clave</div>
            <div className="col-span-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">Información & status</div>
            <div className="col-span-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Sucursales</div>
            <div className="col-span-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">Condiciones y Detalle de Piso</div>
          </div>
        </div>
      </div>

      {/* Table Body - Traditional Card Style without Internal Scroll */}
      <div className="bg-white border-x border-b border-slate-100 rounded-b-[2.5rem] shadow-2xl shadow-slate-200/50 overflow-hidden divide-y divide-slate-100/50">
        {products.map((product) => (
          <ProductRow key={product.id} product={product} />
        ))}

        {/* Footer Info - Now Part of the Scrolled Card at the bottom */}
        <div className="bg-slate-50 px-8 py-5 border-t border-slate-100 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <div>Mostrando <span className="text-slate-800 font-black">10</span> de <span className="text-slate-800 font-black">1240</span> resultados</div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors">Anterior</button>
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors">Siguiente</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataGrid;
