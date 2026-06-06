import React, { useState } from 'react';
import { getApiCandidates } from '../config';

interface LoginProps {
  onLogin: (userData: any) => void;
  onNavigateToRegister: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onNavigateToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const candidates = getApiCandidates();
      let lastError: unknown = null;
      let handled = false;

      for (const baseUrl of candidates) {
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 8000);

        try {
          const response = await fetch(`${baseUrl}/api/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            signal: controller.signal,
          });

          const data = await response.json();
          handled = true;

          if (data.success) {
            onLogin({ user: data.user, type: data.type, token: data.token });
          } else {
            setError(data.message || 'Email o contraseña incorrectos');
          }
          break;
        } catch (requestError) {
          lastError = requestError;
        } finally {
          window.clearTimeout(timeout);
        }
      }

      if (!handled) {
        throw lastError || new Error('No backend candidate responded');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 border-8 border-black p-4">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 items-start">
        <div className="bg-white p-8 border-2 border-black w-full max-w-md shadow-lg mx-auto">
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center space-x-2 mb-2">
              <div className="flex space-x-1">
                <div className="w-4 h-12 bg-black"></div>
                <div className="w-4 h-8 mt-4 bg-black"></div>
                <div className="w-4 h-10 mt-2 bg-black"></div>
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-bold text-cyan-500 leading-none">INS</h1>
                <h1 className="text-3xl font-bold text-cyan-400 leading-none">PEDRALBES</h1>
              </div>
            </div>
            <div className="flex space-x-1 mt-1">
              <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
              <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
              <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
              <div className="w-3 h-3 rounded-full bg-cyan-500"></div>
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-2 mb-4 text-sm font-bold animate-pulse">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full border-2 border-black p-3 font-semibold text-center text-black focus:outline-none focus:border-cyan-500 transition-colors placeholder-gray-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Contraseña"
                className="w-full border-2 border-black p-3 font-semibold text-center text-black focus:outline-none focus:border-cyan-500 transition-colors placeholder-gray-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white p-3 font-bold hover:bg-gray-800 transition-colors"
              disabled={loading}
            >
              {loading ? 'CARGANDO...' : 'ENTRAR'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-200 text-center">
            <p className="text-gray-600 mb-2 font-medium">¿No tienes cuenta?</p>
            <button
              onClick={onNavigateToRegister}
              className="text-cyan-500 font-bold hover:text-cyan-600 transition-colors uppercase tracking-wider"
            >
              Regístrate aquí
            </button>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto lg:max-w-none space-y-4">
          <a
            href="https://dotacio.domini.cat/"
            target="_blank"
            rel="noopener noreferrer"
            className="block border-2 border-black bg-white shadow-lg p-5 hover:bg-cyan-50 transition-colors"
          >
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Enlace recomendado</p>
            <h3 className="text-xl font-black text-black mt-1">Dotació</h3>
            <p className="text-sm text-gray-700 mt-2">Accede al portal de dotación del centro.</p>
          </a>
          <a
            href="https://cdmon.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block border-2 border-black bg-white shadow-lg p-5 hover:bg-cyan-50 transition-colors"
          >
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Hosting</p>
            <h3 className="text-xl font-black text-black mt-1">cdmon</h3>
            <p className="text-sm text-gray-700 mt-2">Gestiona dominio, DNS y servicios web.</p>
          </a>
        </div>
      </div>
    </div>
  );
};
