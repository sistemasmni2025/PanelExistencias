import React, { useMemo, useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, ChevronsRight, ChevronsLeft, ShoppingCart, Minus, Plus, MapPin, Package, Tag, Info } from 'lucide-react';

const ALL_BRANCHES = [
  'QRO', 'CEL', 'SLP', 'AGS', 'LEO',
  'IRA', 'REN', 'GDL', 'SIL', 'IRC',
  'LIC', 'BCE', 'TLA', 'WEB', 'ALT',
  'BQRO', 'BJYA', 'VIGA', 'BALT', 'SJR'
];

const TireImage = ({ product }) => {
  const [imgState, setImgState] = useState({ tryIndex: 0, loaded: false });

  // Normalize brand name for generic image paths
  const brandName = (product.brand && product.brand !== 'Multi') 
    ? product.brand.toLowerCase().replace(/\s+/g, '_') 
    : 'generic';

  // Sanitize to avoid weird characters breaking URLs and routing
  const safeClave = (product.clave || '').toString().replace(/[^a-zA-Z0-9_\-]/g, '_');
  const safeMspn = (product.mspn || '').toString().replace(/[^a-zA-Z0-9_\-]/g, '_');

  // Smart Detection of Tire Type for Representative AI images
  let tireType = 'auto'; // Default car tire
  const desc = (product.description || '').toUpperCase();
  const clase = (product.clase || '').toUpperCase();
  
  if (desc.includes('11R22') || desc.includes('11R24') || desc.includes('295/80') || desc.includes('315/80') || desc.includes('TBR') || clase.includes('CAMI')) {
    tireType = 'camion';
  } else if (desc.includes('AGR') || desc.includes('TRACTOR') || clase.includes('AGRI')) {
    tireType = 'agricola';
  } else if (desc.includes('IND') || desc.includes('MONTACARGAS') || clase.includes('IND')) {
    tireType = 'industrial';
  }

  // Utilize Set to remove duplicate URLs so onError doesn't get stuck caching the same broken URL
  const sequence = Array.from(new Set([
    `/assets/tires/${safeClave}.webp`,
    `/assets/tires/${safeClave}.png`,
    `/assets/tires/${safeMspn}.webp`,
    `/assets/tires/${safeMspn}.png`,
    `/assets/tires/${brandName}_${tireType}.png`, // e.g. bfgoodrich_camion.png
    `/assets/tires/${brandName}_generic.png`,     // e.g. bfgoodrich_generic.png
    `/assets/tires/${tireType}.png`,              // AI representative tire!
    `/assets/tires/generic.png`
  ])).filter(url => !url.includes('undefined') && !url.includes('null'));

  const isExhausted = imgState.tryIndex >= sequence.length;

  return (
    <div className="flex items-center justify-center w-full h-full p-2 lg:p-4 relative z-0 min-h-[150px]">
      {/* 1. Placeholder: Visible if not loaded yet, or if all image fallbacks exhausted */}
      {(!imgState.loaded || isExhausted) && (
        <div className="flex flex-col items-center justify-center opacity-40 group-hover:opacity-60 transition-opacity w-full h-full absolute inset-0">
          <div className="w-24 h-24 rounded-full border-8 border-slate-300 border-dashed flex items-center justify-center animate-[spin_60s_linear_infinite]">
             <div className="w-12 h-12 rounded-full border-4 border-slate-400"></div>
          </div>
        </div>
      )}

      {/* 2. Target Image: Hidden visually until successfully loaded to avoid broken icon flashes */}
      {!isExhausted && (
        <img
          src={sequence[imgState.tryIndex]}
          alt={product.description}
          className={`w-full max-h-[160px] object-contain filter drop-shadow-md group-hover:scale-110 transition-all duration-500 relative z-10 ${imgState.loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImgState(prev => ({ ...prev, loaded: true }))}
          onError={() => setImgState(prev => ({ ...prev, tryIndex: prev.tryIndex + 1 }))}
        />
      )}
    </div>
  );
};

const ProductModal = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div 
        className="bg-white rounded-3xl w-full max-w-5xl max-h-[95vh] overflow-hidden shadow-2xl flex flex-col animate-slide-up relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-[#003d7a] px-5 py-3 flex items-center justify-between shadow-md relative z-10">
           <div className="flex items-center gap-3">
             <span className="bg-white text-[#003d7a] font-black uppercase text-[9px] px-2 py-1 rounded-md tracking-wider shadow-sm">
                MSPN: {product.mspn}
             </span>
             <span className="bg-white/10 text-white font-black uppercase text-[9px] px-2 py-1 rounded-md tracking-wider border border-white/20">
                CLAVE: {product.clave}
             </span>
           </div>
           <button onClick={onClose} className="text-white/60 hover:text-white bg-white/5 hover:bg-white/10 p-1.5 rounded-lg transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
        </div>

        {/* Scrollable Content (Compacted into 3 Columns on Desktop) */}
        <div className="p-4 md:p-5 overflow-y-auto custom-scrollbar bg-slate-50 flex-1">
          <div className="flex flex-col lg:flex-row gap-5 h-full">
            
            {/* 1. Image Preview Column */}
            <div className="w-full lg:w-[280px] shrink-0 flex flex-col gap-3">
               <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-center relative flex-1 min-h-[220px]">
                 <TireImage product={product} />
                 <span className={`absolute top-2 left-2 px-1.5 py-0.5 rounded text-[8px] font-black uppercase border shadow-sm ${product.g === 'G' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                   {product.statusDetail}
                 </span>
                 <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[8px] font-black uppercase bg-slate-100 text-slate-500 border border-slate-200 shadow-sm">
                   {product.brand !== 'Multi' ? product.brand : 'Genérico'}
                 </span>
               </div>
            </div>

            {/* 2. Main Financial Info Column */}
            <div className="flex-1 flex flex-col">
              <h2 className="text-lg md:text-xl font-black text-slate-800 leading-tight mb-1">
                {product.description}
              </h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 border-b border-slate-200 pb-2">
                Familia: <span className="text-brand-blue">{product.clase || 'ESTÁNDAR'}</span>
              </p>

              {/* Ultra-compact Price Breakdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
                 <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Precio Lista</p>
                    <p className="text-[11px] font-bold text-slate-600">${product.priceList.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                 </div>
                 <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Facturado</p>
                    <p className="text-[11px] font-bold text-slate-600">${product.precioFacturado.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                 </div>
                 <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Nota Cr. (NC)</p>
                    <p className="text-[11px] font-bold text-brand-red">{product.ncPercent}%</p>
                 </div>
                 <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Desc Público</p>
                    <p className="text-[11px] font-bold text-brand-red">{product.discountPercent}%</p>
                 </div>
                 <div className="bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Desc Promo</p>
                    <p className="text-[11px] font-bold text-[#f59e0b]">{product.promotion > 0 ? `${product.promotion}%` : 'N/A'}</p>
                 </div>
                 <div className="bg-brand-red/5 p-2 rounded-lg border border-brand-red/10 shadow-sm">
                    <p className="text-[8px] font-black text-brand-red uppercase tracking-widest mb-0.5">Desc Piso</p>
                    <p className="text-[11px] font-bold text-brand-red">{product.piso.desc}%</p>
                 </div>
              </div>

              {/* Final Math Area */}
              <div className="bg-[#003d7a]/5 p-3 rounded-xl border border-[#003d7a]/10 mt-auto">
                 <div className="flex justify-between items-center mb-1">
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Subtotal Piso</p>
                   <p className="text-[11px] font-bold text-slate-700">${product.piso.venta.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                 </div>
                 <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-200/50">
                   <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">I.V.A (16%)</p>
                   <p className="text-[11px] font-bold text-slate-700">{product.piso.iva > 0 ? `$${product.piso.iva.toLocaleString(undefined, { minimumFractionDigits: 2 })}` : 'Exento'}</p>
                 </div>
                 <div className="flex justify-between items-end">
                   <p className="text-[10px] font-black text-[#003d7a] uppercase tracking-widest">Total Neto</p>
                   <p className="text-2xl font-black text-[#003d7a] leading-none drop-shadow-sm">${product.piso.neto.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                 </div>
              </div>
            </div>

            {/* 3. Branch Stock Listing Column */}
            <div className="w-full lg:w-[260px] xl:w-[320px] bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex flex-col shrink-0">
               <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center justify-between border-b border-slate-100 pb-2">
                 <span className="flex items-center gap-1.5"><Package className="w-3.5 h-3.5 text-slate-400" /> Inventario</span>
                 <span className="text-[#003d7a] bg-blue-50 px-2 py-0.5 rounded-lg">TOTAL: {product.stock}</span>
               </h3>
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-2 overflow-y-auto custom-scrollbar pr-1 max-h-[220px]">
                  {product.branches.filter(b => b.stock > 0).length > 0 ? (
                    product.branches.map(br => (
                      <div key={br.code} className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg border ${br.stock > 0 ? 'bg-slate-50 border-slate-200 shadow-sm hover:border-blue-300 transition-colors' : 'hidden'}`}>
                        <span className="text-[9px] font-black text-slate-500">{br.code}</span>
                        <span className={`text-[11px] font-black ${br.stock > 0 ? 'text-[#003d7a]' : 'text-slate-300'}`}>{br.stock}</span>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-8 text-center bg-slate-50 rounded-xl border border-slate-100">
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Agotado</p>
                    </div>
                  )}
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product, onAddToCart, onClick }) => {
  const [quantity, setQuantity] = useState(1);
  const [showBranches, setShowBranches] = useState(false);

  const handleIncrement = () => setQuantity(prev => prev + 1);
  const handleDecrement = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const hasDiscount = product.discountPercent > 0 || product.promotion > 0 || product.piso.desc > 0;
  
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Image Area - Clickable */}
      <div 
        className="relative aspect-[4/3] bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6 border-b border-slate-100 overflow-hidden cursor-pointer"
        onClick={() => onClick(product)}
      >
        {/* Smart Tire Image component */}
        <TireImage product={product} />
        
        {/* Absolute Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
           <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase shadow-sm ${product.g === 'G' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {product.statusDetail}
          </span>
        </div>
        
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1 z-10">
          <span className="bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-md text-[9px] font-black text-slate-500 uppercase border border-slate-200 shadow-sm">
            MSPN: {product.mspn}
          </span>
          <span className="bg-white/80 backdrop-blur-sm px-2 py-0.5 rounded-md text-[9px] font-black text-slate-500 uppercase border border-slate-200 shadow-sm">
            {product.clave}
          </span>
        </div>

        {/* Brand */}
        <div className="absolute bottom-3 left-3 z-10">
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest bg-white/80 backdrop-blur-sm shadow-sm px-2.5 py-1 rounded-md border border-slate-100">
              {product.brand !== 'Multi' ? product.brand : 'Genérico'}
            </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-1">
        {/* Title - Clickable */}
        <h3 
          className="text-[14px] lg:text-[15px] font-black text-slate-800 leading-snug mb-3 line-clamp-2 min-h-[46px] group-hover:text-[#003d7a] transition-colors relative z-10 cursor-pointer" 
          title={product.description}
          onClick={() => onClick(product)}
        >
          {product.description}
        </h3>

        {/* Price Section - E-commerce style */}
        <div className="mb-4 bg-slate-50/50 p-3 rounded-xl border border-slate-100/50">
           {/* List Price */}
           <div className="flex items-center gap-2 mb-1">
             <span className="text-[11px] font-bold text-slate-400 line-through">
               ${product.priceList.toLocaleString(undefined, { minimumFractionDigits: 2 })}
             </span>
             {product.piso.desc > 0 && (
               <span className="bg-brand-red/10 border border-brand-red/20 text-brand-red text-[9px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
                 -{product.piso.desc}% Piso
               </span>
             )}
           </div>
           
           {/* Net Price */}
           <div className="flex items-end gap-1.5">
             <span className="text-[22px] lg:text-[26px] font-black text-[#003d7a] leading-none drop-shadow-sm">
               ${product.piso.neto.toLocaleString(undefined, { minimumFractionDigits: 2 })}
             </span>
             <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1.5 bg-slate-200/50 px-1.5 py-0.5 rounded">Neto</span>
           </div>
        </div>

        {/* Inventory */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex flex-col gap-2 relative z-20">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-1.5 text-slate-600">
               <Package className="w-4 h-4 text-[#ffce00]" />
               <span className="text-[11px] font-bold">Disp: <span className="text-brand-blue font-black">{product.stock}</span></span>
             </div>
             <button 
               onClick={() => setShowBranches(!showBranches)}
               className="text-[10px] font-black text-[#003d7a] uppercase hover:bg-blue-50 transition-colors flex items-center gap-1 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg active:scale-95"
             >
               <MapPin className="w-3 h-3" /> Sucursales
             </button>
          </div>

          {/* Branches Dropdown (Removed, now managed by modal, but keeping structure so it doesnt break other parts) */}
          {showBranches && (
             <div className="absolute bottom-full left-0 w-full bg-white border border-slate-200 shadow-2xl rounded-xl p-3 mb-2 z-30 animate-slide-up origin-bottom">
               <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#003d7a]">Detalle Sucursales</span>
                  <button onClick={() => setShowBranches(false)} className="text-[9px] font-bold text-slate-400 hover:text-brand-red uppercase px-2 py-1 hover:bg-red-50 rounded">Cerrar</button>
               </div>
               <div className="grid grid-cols-4 gap-1.5 max-h-[160px] overflow-y-auto custom-scrollbar p-1">
                 {ALL_BRANCHES.map(code => {
                   const br = product.branches.find(b => b.code === code) || { code, stock: 0 };
                   if (br.stock === 0) return null; // Only show branches with stock for cleaner UI
                   return (
                     <div key={code} className="flex flex-col items-center justify-center bg-blue-50/50 rounded-lg border border-blue-100/50 p-1.5 hover:bg-blue-50 transition-colors">
                       <span className="text-[8px] font-black text-slate-500 mb-0.5">{code}</span>
                       <span className="text-[11px] font-black text-[#003d7a]">{br.stock}</span>
                     </div>
                   );
                 })}
                 {product.stock === 0 && (
                   <div className="col-span-4 text-center py-4 text-[11px] font-bold text-slate-400 bg-slate-50 rounded-lg">
                      Agotado en todas las sucursales
                   </div>
                 )}
               </div>
             </div>
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-4 flex gap-2">
          {/* Quantity */}
          <div className="flex items-center justify-between bg-slate-50 rounded-xl border border-slate-200 w-[100px] shrink-0 shadow-inner">
             <button onClick={handleDecrement} className="p-2 hover:bg-white rounded-l-xl text-slate-500 transition-colors active:scale-90"><Minus className="w-4 h-4" /></button>
             <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full text-center bg-transparent border-none text-[14px] font-black text-slate-800 p-0 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
             />
             <button onClick={handleIncrement} className="p-2 hover:bg-white rounded-r-xl text-slate-500 transition-colors active:scale-90"><Plus className="w-4 h-4" /></button>
          </div>
          
          {/* Add btn */}
          <button 
             onClick={(e) => {
               e.stopPropagation();
               onAddToCart(product, quantity);
               setQuantity(1); // Reset after adding
             }}
             className="flex-1 bg-[#ffce00] hover:bg-[#ffe14c] text-[#002b5e] flex items-center justify-center rounded-xl font-black text-[11px] uppercase tracking-wider transition-all shadow-sm shadow-[#ffce00]/20 hover:shadow-lg hover:shadow-[#ffce00]/40 active:scale-95 border border-[#e6ba00]"
          >
             <ShoppingCart className="w-5 h-5 mr-2" /> Añadir
          </button>
        </div>
      </div>
    </div>
  );
};

const DataGrid = ({ products: externalProducts, onAddToCart }) => {
  const products = externalProducts || [];
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const itemsPerPage = 12; // Adjusted for grid layout (4 columns x 3 rows) // <--- Adjusted items per page for a nice grid
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
    <div ref={gridRef} className="relative animate-slide-up flex flex-col min-h-full">
      
      {/* Product Grid Area */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6 mb-8">
        {paginatedProducts.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} onClick={setSelectedProduct} />
        ))}
      </div>

      {/* Render Modal Overlay */}
      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />

      {products.length === 0 && (
         <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-slate-100 shadow-sm mt-4">
           <Package className="w-16 h-16 text-slate-200 mb-4" />
           <p className="text-lg font-black text-slate-500 uppercase tracking-widest">No se encontraron productos.</p>
           <p className="text-sm text-slate-400 mt-2">Intenta cambiar los filtros de búsqueda en la barra superior o laterar.</p>
         </div>
      )}

      {/* Pagination Footer - Modernized */}
      {products.length > 0 && (
         <div className="mt-auto bg-white px-6 lg:px-8 py-4 lg:py-5 border border-slate-100 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 text-[12px] font-bold text-slate-500 shadow-sm">
           <div className="flex items-center">
             Página {currentPage} de {totalPages} 
             <span className="font-normal text-[10px] ml-3 tracking-widest uppercase bg-slate-50 border border-slate-200 px-2 py-1 rounded-md text-brand-blue">
               ({products.length} Resultados en Total)
             </span>
           </div>
           
           <div className="flex gap-1.5 items-center">
             <button
               onClick={() => setCurrentPage(1)}
               disabled={currentPage === 1}
               className={`p-2 border rounded-lg transition-all shadow-sm ${currentPage === 1 ? 'opacity-50 cursor-not-allowed bg-slate-50 border-slate-100' : 'bg-white border-slate-200 hover:bg-[#ffce00]/10 hover:border-[#ffce00] hover:text-[#003d7a] active:scale-95'}`}
               title="Primera página"
             >
               <ChevronsLeft className="w-4 h-4" />
             </button>
             <button
               onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
               disabled={currentPage === 1}
               className={`p-2 border rounded-lg transition-all shadow-sm ${currentPage === 1 ? 'opacity-50 cursor-not-allowed bg-slate-50 border-slate-100' : 'bg-white border-slate-200 hover:bg-[#ffce00]/10 hover:border-[#ffce00] hover:text-[#003d7a] active:scale-95'}`}
               title="Anterior"
             >
               <ChevronLeft className="w-4 h-4" />
             </button>
             <button
               onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
               disabled={currentPage === totalPages}
               className={`p-2 border rounded-lg transition-all shadow-sm ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed bg-slate-50 border-slate-100' : 'bg-white border-slate-200 hover:bg-[#ffce00]/10 hover:border-[#ffce00] hover:text-[#003d7a] active:scale-95'}`}
               title="Siguiente"
             >
               <ChevronRight className="w-4 h-4" />
             </button>
             <button
               onClick={() => setCurrentPage(totalPages)}
               disabled={currentPage === totalPages}
               className={`p-2 border rounded-lg transition-all shadow-sm ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed bg-slate-50 border-slate-100' : 'bg-white border-slate-200 hover:bg-[#ffce00]/10 hover:border-[#ffce00] hover:text-[#003d7a] active:scale-95'}`}
               title="Última página"
             >
               <ChevronsRight className="w-4 h-4" />
             </button>
           </div>
         </div>
      )}
    </div>
  );
};

export default DataGrid;
