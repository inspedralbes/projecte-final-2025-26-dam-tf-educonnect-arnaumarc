import React, { useState } from 'react';
import { UserRole } from '../types';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      if (email.toLowerCase().includes('profe')) {
        onLogin('TEACHER');
      } else {
        onLogin('STUDENT');
      }
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
          </div>
        </div>

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
      </div>
    </div>
  );
};