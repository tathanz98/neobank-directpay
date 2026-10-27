// src/views/LoginView.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';

export const LoginView = () => {
  const { login, user } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Estados del formulario
  const [identifier, setIdentifier] = useState(user.phone || '');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [doc, setDoc] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegistering) {
      if (!name || !doc || !identifier || !password) {
        alert('Por favor completa todos los campos de registro.');
        return;
      }
      login({
        name,
        doc,
        email,
        phone: identifier,
        balance: 500000, // Bono de bienvenida de prueba
      });
    } else {
      if (!identifier || !password) {
        alert('Por favor ingresa tus datos de acceso.');
        return;
      }
      login({ phone: identifier });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl">
        
        {/* Cabecera / Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-400/10 text-cyan-400 text-2xl font-black mb-4 border border-cyan-400/20">
            ND
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">NeoBank DirectPay</h1>
          <p className="text-sm text-slate-400 mt-1">Banca Digital Segura y Sin Intermediarios</p>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegistering && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Nombre Completo</label>
                <input
                  type="text"
                  placeholder="Ej. Carlos Pérez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Cédula de Ciudadanía</label>
                <input
                  type="text"
                  placeholder="Ej. 1049300123"
                  value={doc}
                  onChange={(e) => setDoc(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  placeholder="correo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Número de Celular</label>
            <input
              type="text"
              placeholder="3101234567"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Contraseña de Acceso</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-400"
            />
          </div>

          <Button type="submit" variant="primary" className="mt-6">
            {isRegistering ? 'Crear Cuenta y Recibir Bono' : 'Iniciar Sesión'}
          </Button>
        </form>

        {/* Alternar entre Login y Registro */}
        <div className="text-center mt-6">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-xs text-cyan-400 hover:underline font-semibold"
          >
            {isRegistering ? '¿Ya tienes cuenta? Inicia sesión aquí' : '¿No tienes cuenta? Regístrate gratis'}
          </button>
        </div>

      </div>
    </div>
  );
};