import React, { useState } from 'react';
import { UserRole } from '../types';

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
      const response = await fetch('http://localhost:3005/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        onLogin({ ...data.user, type: data.type });
      } else {
        setError(data.message || 'Email o contraseña incorrectos');
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
      <div className="bg-white p-8 border-2 border-black w-full max-w-md shadow-lg">
        {/* Logo Simulation */}
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
          >
            ENTRAR
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
    </div>
  );
};
