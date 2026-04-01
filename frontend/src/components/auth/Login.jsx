import React, { useState } from 'react';
import { User, Lock, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import logoImg from '../../../assets/logo_nieto.png';
import bgVideo from '../../../assets/video_michelin.mp4';
import API_BASE_URL from '../../services/apiConfig';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!consent) return;

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: username, password }),
      });

      const data = await response.json();

      if (data.success) {
        onLogin(data.user);
      } else {
        setError(data.message || 'Error de autenticación');
      }
    } catch (err) {
      setError('No se pudo conectar con el servidor. Verifica que la API esté corriendo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#0A0F16]">
      
      {/* Premium Cinematic Video Background */}
      <div className="absolute inset-0 z-0 bg-black">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
          src={bgVideo}
        ></video>
        {/* Deep vignette overlay to ensure the login box stands out */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/80 pointer-events-none"></div>
      </div>

      {/* Floating UI Container */}
      <div className="w-full max-w-[380px] px-4 sm:px-6 relative z-10 animate-slide-up">
        
        {/* Premium Glass Card with Floating Motion */}
        <div className="animate-float">
          <div className="relative bg-white/90 backdrop-blur-2xl border border-white/50 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.8)] rounded-3xl overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[lightSweep_5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent before:z-20">
            
            {/* Header */}
            <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-4 text-center">
              <div className="flex justify-center mb-4">
                <img
                  src={logoImg}
                  alt="Multi Llantas Nieto"
                  className="h-14 sm:h-20 object-contain drop-shadow-sm transition-transform duration-500 hover:scale-105"
                />
              </div>
              <h2 className="mt-2 sm:mt-4 text-lg sm:text-xl font-bold text-slate-800 tracking-tight">
                Sistema de Existencias
              </h2>
              <p className="text-[10px] sm:text-xs text-slate-500 mt-1 uppercase tracking-widest font-semibold">
                Acceso al Panel
              </p>
            </div>

            {/* Form */}
            <div className="px-6 sm:px-8 pb-6 sm:pb-8">
              <form onSubmit={handleSubmit} className="space-y-3">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-lg animate-shake">
                    {error}
                  </div>
                )}

                <div className="space-y-3 relative z-30">
                  {/* Username Input */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 group-focus-within:text-brand-blue transition-colors" />
                    </div>
                    <input
                      type="text"
                      required
                      className="block w-full pl-10 pr-3 py-2 sm:py-2.5 border border-slate-200 rounded-xl leading-5 bg-white/50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue text-sm sm:text-base shadow-sm transition-all"
                      placeholder="Login"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>

                  {/* Password Input */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 group-focus-within:text-brand-blue transition-colors" />
                    </div>
                    <input
                      type="password"
                      required
                      className="block w-full pl-10 pr-3 py-2 sm:py-2.5 border border-slate-200 rounded-xl leading-5 bg-white/50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue text-sm sm:text-base shadow-sm transition-all"
                      placeholder="Contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                {/* Consent Checkbox */}
                <div className="flex items-start mt-4 mb-4 relative z-30">
                  <div className="flex items-center h-5">
                    <input
                      id="consent"
                      name="consent"
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="focus:ring-brand-blue h-4 w-4 text-brand-blue border-slate-300 rounded cursor-pointer transition-colors"
                    />
                  </div>
                  <div className="ml-2 text-[10px] sm:text-[11px] leading-tight mt-0.5">
                    <label htmlFor="consent" className="font-medium text-slate-600 cursor-pointer select-none">
                      Consiento el tratamiento de datos según el <a href="#" className="text-brand-blue hover:text-brand-red font-bold">Aviso de Privacidad</a>
                    </label>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-2 relative z-30">
                  <button
                    type="submit"
                    disabled={!consent || loading}
                    className={`w-full flex justify-center items-center gap-2 py-2.5 sm:py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white transition-all duration-300
                      ${consent && !loading
                        ? 'bg-brand-red hover:bg-red-800 hover:shadow-brand-red/40 hover:-translate-y-0.5'
                        : 'bg-slate-300 cursor-not-allowed shadow-none'
                      }
                    `}
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 opacity-90" />
                        Acceso
                        <ArrowRight className={`h-4 w-4 transition-transform duration-300 ${consent ? 'opacity-100 translate-x-1' : 'opacity-50'}`} />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Footer Inside the Box */}
              <div className="mt-6 pt-4 border-t border-slate-100 text-center text-[9px] sm:text-[10px] font-bold text-slate-400 tracking-widest uppercase">
                <p>&copy; {new Date().getFullYear()} MULTILLANTAS NIETO</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
