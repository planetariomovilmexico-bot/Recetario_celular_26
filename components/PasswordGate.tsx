
import React, { useState } from 'react';
import { ACCESS_CODE } from '../constants';
import { Lock, LogIn } from 'lucide-react';

interface PasswordGateProps {
  onUnlock: () => void;
}

const PasswordGate: React.FC<PasswordGateProps> = ({ onUnlock }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ACCESS_CODE) {
      onUnlock();
    } else {
      setError(true);
      setPassword('');
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/90 backdrop-blur-sm p-4">
      <div className={`bg-white rounded-2xl p-8 shadow-2xl w-full max-auto max-w-sm transform transition-all ${error ? 'animate-bounce' : ''}`}>
        <div className="flex flex-col items-center space-y-4">
          <div className="bg-blue-100 p-4 rounded-full">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Acceso Médico</h2>
          <p className="text-slate-500 text-center text-sm">
            Ingresa la clave de acceso para entrar al sistema de recetas.
          </p>
          
          <form onSubmit={handleSubmit} className="w-full space-y-4 mt-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className={`w-full text-center text-2xl tracking-[0.5em] border-2 rounded-xl py-3 focus:outline-none focus:ring-2 transition-all ${
                error ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:ring-blue-500'
              }`}
              autoFocus
            />
            {error && <p className="text-red-500 text-xs text-center font-medium">Contraseña incorrecta</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl flex items-center justify-center space-x-2 transition-colors shadow-lg shadow-blue-200"
            >
              <LogIn className="w-5 h-5" />
              <span>Entrar al Sistema</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordGate;
