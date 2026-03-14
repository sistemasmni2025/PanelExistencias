import React, { useState } from 'react';
import { Download, Printer, Share2, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

const PrimasFdnPanel = () => {
  const [zoom, setZoom] = useState(100);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    alert("Iniciando descarga del reporte...");
  };

  const handleShare = () => {
    alert("Abriendo opciones para compartir...");
  };
  return (
    <div className="flex flex-col h-full bg-slate-100 animate-fade-in">
      {/* PDF Viewer Interface Simulation */}
      <div className="bg-[#323639] text-white h-12 flex items-center justify-between px-2 md:px-4 shrink-0 shadow-lg z-20">
        <div className="flex items-center gap-2 md:gap-4 overflow-hidden">
          <div className="hidden sm:flex items-center gap-2 truncate">
            <span className="text-xs font-medium text-slate-300 truncate max-w-[150px] md:max-w-none">com.existencias.areporteasociadosgastosb</span>
          </div>
          <div className="hidden sm:block h-4 w-px bg-slate-600"></div>
          <div className="flex items-center gap-1 md:gap-2">
            <button className="p-1 hover:bg-white/10 rounded transition-colors"><ChevronLeft className="w-4 h-4" /></button>
            <span className="text-[10px] md:text-[11px] bg-[#1a1c1e] px-1.5 md:px-2 py-0.5 rounded border border-slate-700 whitespace-nowrap">1 / 1</span>
            <button className="p-1 hover:bg-white/10 rounded transition-colors"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="flex items-center gap-1 bg-[#1a1c1e] px-2 md:px-3 py-1 rounded border border-slate-700">
            <button 
              onClick={handleZoomOut}
              className="p-1 hover:text-brand-blue disabled:opacity-30 transition-colors"
              disabled={zoom <= 50}
            >
              <ZoomOut className="w-3 md:w-3.5 h-3 md:h-3.5" />
            </button>
            <span className="text-[9px] md:text-[10px] font-bold min-w-[25px] md:min-w-[30px] text-center font-mono">
              {zoom}%
            </span>
            <button 
              onClick={handleZoomIn}
              className="p-1 hover:text-brand-blue disabled:opacity-30 transition-colors"
              disabled={zoom >= 200}
            >
              <ZoomIn className="w-3 md:w-3.5 h-3 md:h-3.5" />
            </button>
          </div>
          <div className="h-4 w-px bg-slate-600 hidden xs:block"></div>
          <div className="flex items-center gap-1 md:gap-2">
            <button 
              onClick={handleDownload}
              className="p-1.5 md:p-2 hover:bg-white/10 rounded-full transition-all text-slate-300 hover:text-white" 
              title="Descargar"
            >
              <Download className="w-3.5 md:w-4 h-3.5 md:h-4" />
            </button>
            <button 
              onClick={handlePrint}
              className="p-1.5 md:p-2 hover:bg-white/10 rounded-full transition-all text-slate-300 hover:text-white" 
              title="Imprimir"
            >
              <Printer className="w-3.5 md:w-4 h-3.5 md:h-4" />
            </button>
            <button 
              onClick={handleShare}
              className="p-1.5 md:p-2 hover:bg-white/10 rounded-full transition-all text-slate-300 hover:text-white" 
              title="Compartir"
            >
              <Share2 className="w-3.5 md:w-4 h-3.5 md:h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 md:p-6 flex justify-center custom-scrollbar bg-slate-200/50">
        <div 
          className="w-full max-w-[1000px] bg-white shadow-xl p-4 md:p-8 lg:p-12 min-h-[1400px] relative shadow-slate-300 mx-auto transition-transform duration-200 origin-top"
          style={{ transform: `scale(${zoom / 100})` }}
        >
            <div className="w-full flex flex-col sm:flex-row justify-between items-center sm:items-start gap-6 sm:gap-0 mb-8 md:mb-10">
              <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 text-center sm:text-left">
                <div className="w-16 md:w-20 h-16 md:h-20 bg-brand-red flex items-center justify-center rounded-2xl shadow-lg relative overflow-hidden shrink-0">
                  <img src="/assets/logo/icon.png" alt="Logo" className="w-10 md:w-12 h-10 md:h-12 object-contain invert brightness-0" />
                </div>
                <div>
                  <h1 className="text-xl md:text-3xl font-black text-brand-red tracking-tighter leading-none mb-1">MULTI LLANTAS NIETO</h1>
                  <p className="text-[10px] md:text-sm font-bold text-slate-500 uppercase tracking-widest leading-none">Servicios Automotrices Especializados</p>
                </div>
              </div>
              <div className="text-center sm:text-right">
                 <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Folio Interno:</p>
                 <p className="text-lg md:text-xl font-black text-brand-blue tracking-tighter">RFDN-2026-03</p>
              </div>
            </div>
            
            <div className="bg-slate-50 w-full py-4 border-y-2 border-slate-100 flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-12 mb-8 md:mb-10 text-center">
              <div>
                <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Sucursal</p>
                <p className="text-base md:text-lg font-black text-brand-blue uppercase">LA VIGA</p>
              </div>
              <div className="hidden sm:block w-px h-10 bg-slate-200"></div>
              <div>
                <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Tipo de Reporte</p>
                <p className="text-base md:text-lg font-black text-brand-red uppercase italic">Reporte Mensual y FDN</p>
              </div>
            </div>

          {/* Meta Info Grid - Responsive Columns */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mb-10 bg-white border-2 border-slate-100 p-2 rounded-xl shadow-sm">
            <div className="col-span-2 bg-slate-50 p-4 rounded-lg border border-slate-100/50">
               <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Cliente:</p>
               <p className="text-[11px] font-bold text-slate-800 uppercase italic">DRP Servicios Automotrices</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100/50">
               <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Num. Cliente:</p>
               <p className="text-[11px] font-bold text-slate-800">6094</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100/50">
               <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Periodo:</p>
               <p className="text-[11px] font-bold text-slate-800">MAR-2026</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100/50">
               <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Categoría:</p>
               <span className="text-[11px] font-black text-brand-blue bg-[#ffce00] px-3 py-0.5 rounded-full inline-block">BIB+</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100/50 text-center">
               <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Página:</p>
               <p className="text-[11px] font-bold text-slate-800 tracking-widest">01 / 01</p>
            </div>
          </div>

          {/* Tables Section - High Legibility & Professional Contrast */}
          <div className="flex flex-col gap-10">
            
            {/* Table Row 1: Michelin & FDN */}
            {/* Table Row 1: Michelin & FDN - Flex Wrap for Responsiveness */}
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-[7]">
                <div className="flex items-center gap-2 mb-3 px-2">
                  <div className="w-1.5 h-6 bg-brand-red rounded-full"></div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Michelin - BFG ROR</h3>
                </div>
                <div className="overflow-x-auto pb-2 custom-scrollbar-horizontal">
                  <div className="min-w-[450px]">
                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                      <table className="w-full text-[10px] border-collapse">
                        <thead>
                          <tr className="bg-slate-800 text-white">
                            <th className="py-2 px-3 text-left font-black tracking-wider border-r border-slate-700">MES</th>
                            <th className="py-2 px-3 text-center font-black tracking-wider border-r border-slate-700">MI</th>
                            <th className="py-2 px-3 text-center font-black tracking-wider border-r border-slate-700">BF</th>
                            <th className="py-2 px-3 text-center font-black tracking-wider border-r border-slate-700">%BI</th>
                            <th className="py-2 px-3 text-center font-black tracking-wider border-r border-slate-700">#</th>
                            <th className="py-2 px-3 text-right font-black tracking-wider">BIMARCA</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr className="bg-white hover:bg-slate-50 transition-colors">
                            <td className="py-2 px-3 font-bold border-r border-slate-100">Marzo</td>
                            <td className="py-2 px-3 text-center border-r border-slate-100 italic">20</td>
                            <td className="py-2 px-3 text-center border-r border-slate-100 italic">5</td>
                            <td className="py-2 px-3 text-center border-r border-slate-100 font-black text-brand-red">4.50</td>
                            <td className="py-2 px-3 text-center border-r border-slate-100 italic">25</td>
                            <td className="py-2 px-3 text-right font-black">$ 80,808.65</td>
                          </tr>
                          <tr className="bg-slate-50 font-black">
                            <td className="py-2 px-3 uppercase text-center border-r border-slate-200">TOTAL</td>
                            <td className="py-2 px-3 text-center border-r border-slate-200">20</td>
                            <td className="py-2 px-3 text-center border-r border-slate-200">5</td>
                            <td className="py-2 px-3 border-r border-slate-200"></td>
                            <td className="py-2 px-3 text-center border-r border-slate-200 italic font-medium">25</td>
                            <td className="py-2 px-3 text-right text-brand-blue font-bold">$ 80,808.65</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-[5]">
                <div className="flex items-center gap-2 mb-3 px-2">
                  <div className="w-1.5 h-6 bg-brand-blue rounded-full"></div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Total FDN Sell Out</h3>
                </div>
                <div className="overflow-x-auto pb-2 custom-scrollbar-horizontal">
                  <div className="min-w-[320px]">
                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                      <table className="w-full text-[10px] border-collapse">
                        <thead>
                          <tr className="bg-brand-blue text-white">
                            <th className="py-2 px-3 text-left font-black tracking-wider border-r border-white/10">MES</th>
                            <th className="py-2 px-3 text-center font-black tracking-wider border-r border-white/10">TOTAL FDN</th>
                            <th className="py-2 px-3 text-center font-black tracking-wider border-r border-white/10">GASTO</th>
                            <th className="py-2 px-3 text-right font-black tracking-wider">SALDO</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          <tr className="bg-white hover:bg-slate-50 transition-colors">
                            <td className="py-2 px-3 font-bold border-r border-slate-100 italic">Marzo</td>
                            <td className="py-2 px-3 text-center border-r border-slate-100 italic">$ 1,212.13</td>
                            <td className="py-2 px-3 text-center border-r border-slate-100 italic">$ 0.00</td>
                            <td className="py-2 px-3 text-right font-black text-brand-blue">$ 1,212.13</td>
                          </tr>
                          <tr className="bg-slate-50 font-black">
                            <td className="py-2 px-3 uppercase text-center border-r border-slate-200">TOTALES</td>
                            <td className="py-2 px-3 text-center border-r border-slate-200 italic font-medium">$ 1,212.13</td>
                            <td className="py-2 px-3 text-center border-r border-slate-200 italic font-medium">$ 0.00</td>
                            <td className="py-2 px-3 text-right text-brand-red font-bold">$ 1,212.13</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Table Row 2: MTO & OTRAS */}
            {/* Table Row 2: MTO & OTRAS - Flex Wrap */}
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-[7]">
                <div className="flex items-center gap-2 mb-3 px-2">
                  <div className="w-1.5 h-6 bg-slate-400 rounded-full"></div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">MTO (BFG ON - UN)</h3>
                </div>
                <div className="overflow-x-auto pb-2 custom-scrollbar-horizontal">
                  <div className="min-w-[450px]">
                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                      <table className="w-full text-[10px] border-collapse">
                        <thead>
                          <tr className="bg-slate-100 text-slate-600">
                            <th className="py-2 px-3 text-left font-black border-r border-slate-200">MES</th>
                            <th className="py-2 px-3 text-center font-black border-r border-slate-200">#</th>
                            <th className="py-2 px-3 text-center font-black border-r border-slate-200">BF ON</th>
                            <th className="py-2 px-3 text-center font-black border-r border-slate-200">#</th>
                            <th className="py-2 px-3 text-center font-black border-r border-slate-200">UN</th>
                            <th className="py-2 px-3 text-center font-black border-r border-slate-200">#</th>
                            <th className="py-2 px-3 text-right font-black">TOT MTO</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-white">
                            <td className="py-2 px-3 font-bold italic border-r border-slate-100">Marzo</td>
                            <td className="py-2 px-3 text-center border-r border-slate-100 italic">0</td>
                            <td className="py-2 px-3 text-center border-r border-slate-100 italic">$ 0.00</td>
                            <td className="py-2 px-3 text-center border-r border-slate-100 italic">0</td>
                            <td className="py-2 px-3 text-center border-r border-slate-100 italic">$ 0.00</td>
                            <td className="py-2 px-3 text-center border-r border-slate-100 italic">0</td>
                            <td className="py-2 px-3 text-right font-black">$ 0.00</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-[5]">
                <div className="flex items-center gap-2 mb-3 px-2">
                  <div className="w-1.5 h-6 bg-slate-400 rounded-full"></div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Otras Marcas</h3>
                </div>
                <div className="overflow-x-auto pb-2 custom-scrollbar-horizontal">
                  <div className="min-w-[280px]">
                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                      <table className="w-full text-[10px] border-collapse">
                        <thead>
                          <tr className="bg-slate-100 text-slate-600">
                            <th className="py-2 px-3 text-left font-black border-r border-slate-200">MES</th>
                            <th className="py-2 px-3 text-center font-black border-r border-slate-200">#</th>
                            <th className="py-2 px-3 text-right font-black">VALOR</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="bg-white">
                            <td className="py-2 px-3 font-bold italic border-r border-slate-100 text-center">Marzo</td>
                            <td className="py-2 px-3 text-center border-r border-slate-100 italic">0</td>
                            <td className="py-2 px-3 text-right font-black">$ 0.00</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Report Footer - Professional Signature / Footer Look */}
          <div className="mt-20 pt-10 border-t border-slate-100 flex justify-between items-end opacity-60">
            <div className="space-y-4">
               <div className="w-40 h-px bg-slate-400"></div>
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Firma de Recibido / Sucursal</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic mb-1">Documento Corporativo Multillantas Nieto</p>
              <p className="text-[10px] font-bold text-slate-500">© 2026 Sistemas MNI - Todos los derechos reservados</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrimasFdnPanel;
