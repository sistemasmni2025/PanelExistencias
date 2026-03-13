import React from 'react';
import { Sparkles, Trophy, ShieldCheck, Zap } from 'lucide-react';

const PromoBanner = () => {
  return (
    <div className="w-full relative overflow-hidden group">
      {/* Slim Container for more discretion */}
      <div className="relative h-14 sm:h-16 lg:h-20 w-full bg-[#001f44] transition-all duration-700">

        {/* Animated Background Image Layer */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 ease-linear scale-110 group-hover:scale-100"
          style={{
            backgroundImage: "url('/assets/banner/promo_bg.png')",
            filter: 'brightness(0.5) contrast(1.2)'
          }}
        />

        {/* Dynamic Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#003d7a] via-[#003d7a]/60 to-transparent z-10" />

        {/* Animated Tires with Rims - left and right */}
        <div className="absolute left-[-25px] sm:left-[-15px] top-1/2 -translate-y-1/2 z-20 pointer-events-none opacity-50 sm:opacity-100">
          <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden shadow-[0_0_30px_rgba(255,206,0,0.2)]">
            <img
              src="/assets/banner/tire_rim.png"
              className="w-full h-full object-cover animate-[spin_10s_linear_infinite] mix-blend-screen brightness-110 contrast-125"
              alt="Rotating Tire with Rim"
            />
          </div>
        </div>

        <div className="absolute right-[-25px] sm:right-[-15px] top-1/2 -translate-y-1/2 z-20 pointer-events-none opacity-50 sm:opacity-100">
          <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden shadow-[0_0_30px_rgba(0,61,122,0.3)]">
            <img
              src="/assets/banner/tire_rim.png"
              className="w-full h-full object-cover animate-[spin_10s_linear_infinite] mix-blend-screen brightness-110 contrast-125"
              alt="Rotating Tire with Rim"
            />
          </div>
        </div>

        {/* Content Layer - Now Horizontal for Slim look */}
        <div className="absolute inset-0 z-30 flex items-center px-6 sm:px-12 lg:px-24 justify-between">
          <div className="flex items-center gap-4 sm:gap-8 transform transition-all duration-700">

            {/* Michelin Tag + Main Title in one line */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#ffce00] animate-pulse" />
                <span className="text-[10px] font-black bg-[#ffce00] text-[#003d7a] px-2 py-0.5 rounded uppercase tracking-tighter">Premium</span>
              </div>
              <h2 className="text-sm sm:text-lg lg:text-2xl font-black text-white uppercase tracking-tighter leading-none">
                DRP  <span className="text-[#ffce00] italic">Servicios Automotrices</span>
              </h2>
            </div>

            {/* Subtext hidden on mobile for extreme discretion */}
            <p className="hidden md:block text-[10px] lg:text-xs text-slate-300 font-medium border-l border-white/20 pl-6 max-w-xs">
              Existencias en tiempo real de toda la gama de llantas con garantía extendida.
            </p>
          </div>

          {/* Right side stats/icons */}
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#ffce00]" />
              <span className="text-[10px] font-bold text-white uppercase tracking-widest hidden sm:block">Garantía Total</span>
            </div>
            <div className="h-4 w-px bg-white/20 hidden sm:block" />
            <div className="flex -space-x-1.5 hidden lg:flex">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-6 h-6 rounded-full border border-[#003d7a] bg-[#ffce00] flex items-center justify-center shadow-lg">
                  <Trophy className="w-3 h-3 text-[#003d7a]" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Aesthetic bottom border glow */}
        <div className="absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#ffce00] to-yellow-300 z-30" />
      </div>
    </div>
  );
};

export default PromoBanner;
