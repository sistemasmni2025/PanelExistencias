import React, { useState } from 'react';
import { User, Lock, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import logoImg from '../../../assets/logo_nieto.png';
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50">
      {/* Background ambient light effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-blue/10 rounded-full blur-3xl animate-pulse-subtle"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-red/10 rounded-full blur-3xl animate-pulse-subtle" style={{ animationDelay: '1s' }}></div>

      <div className="w-full max-w-md px-4 sm:px-8 relative z-10 animate-slide-up">
        {/* Premium Glass Card */}
        <div className="bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl rounded-2xl md:rounded-3xl overflow-hidden">

          {/* Header */}
          <div className="px-6 sm:px-10 pt-8 sm:pt-10 pb-6 text-center">
            {/* Logo Corporativo Real */}
            <div className="flex justify-center mb-6">
              <img
                src={logoImg}
                alt="Multi Llantas Nieto"
                className="h-16 sm:h-24 object-contain drop-shadow-sm transition-transform duration-500 hover:scale-105"
              />
            </div>
            <h2 className="mt-4 sm:mt-8 text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">
              Sistema de Existencias
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Inicia Sesión para acceder al panel
            </p>
          </div>

          {/* Form */}
          <div className="px-6 sm:px-10 pb-8 sm:pb-10">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded-lg animate-shake">
                  {error}
                </div>
              )}

              <div className="space-y-3 sm:space-y-4">
                {/* Username Input */}
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 sm:h-5 sm:w-5 text-slate-400 group-focus-within:text-brand-blue transition-colors" />
                  </div>
                  <input
                    type="text"
                    required
                    className="block w-full pl-10 pr-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl leading-5 bg-white/50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue text-sm sm:text-base shadow-sm transition-all"
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
                    className="block w-full pl-10 pr-3 py-2.5 sm:py-3 border border-slate-200 rounded-xl leading-5 bg-white/50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue text-sm sm:text-base shadow-sm transition-all"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {/* Consent Checkbox */}
              <div className="flex items-start mt-4">
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
                <div className="ml-3 text-xs sm:text-sm">
                  <label htmlFor="consent" className="font-medium text-slate-600 cursor-pointer select-none leading-tight">
                    Consiento y Autorizo el tratamiento de mis datos de conformidad con el <a href="#" className="text-brand-blue hover:text-brand-red hover:underline transition-colors">Aviso de Privacidad</a>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={!consent || loading}
                  className={`w-full flex justify-center items-center gap-2 py-3 sm:py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white transition-all duration-300
                    ${consent && !loading
                      ? 'bg-brand-red hover:bg-red-800 hover:shadow-brand-red/40 hover:-translate-y-0.5 active:translate-y-0'
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
          </div>

        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} Multi Llantas Nieto. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
