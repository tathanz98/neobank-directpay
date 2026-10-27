// src/views/CardsView.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';

export const CardsView = () => {
  const { user, updateCardPin } = useAuth();
  
  // Estados para manejo de visualización y PIN
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  
  // Estado para cambiar PIN
  const [newPinInput, setNewPinInput] = useState('');
  const [isChangingPin, setIsChangingPin] = useState(false);

  // Datos simulados de la tarjeta
  const cardData = {
    number: '4532 •••• •••• 8892',
    realNumber: '4532 8810 9923 8892',
    holder: user.name.toUpperCase(),
    exp: '08/29',
    cvv: '482',
    type: 'Débito Visa DirectPay'
  };

  const handleVerifyPin = (e) => {
    e.preventDefault();
    if (enteredPin === user.cardPin) {
      setShowSensitiveData(true);
      setShowPinModal(false);
      setEnteredPin('');
      // Bloquear datos automáticamente tras 30 segundos por seguridad
      setTimeout(() => {
        setShowSensitiveData(false);
      }, 30000);
    } else {
      alert('PIN incorrecto. Intenta con tu clave de 4 dígitos (Por defecto: 1234)');
    }
  };

  const handleChangePinSubmit = (e) => {
    e.preventDefault();
    if (newPinInput.length !== 4 || isNaN(newPinInput)) {
      alert('El PIN debe ser estrictamente numérico de 4 dígitos.');
      return;
    }
    updateCardPin(newPinInput);
    setNewPinInput('');
    setIsChangingPin(false);
    alert('¡PIN de tarjeta actualizado con éxito!');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-white">Tarjetas NeoBank</h2>
          <p className="text-xs text-slate-400">Control absoluto y enmascaramiento por PIN</p>
        </div>
        <Button 
          variant="secondary" 
          className="w-auto text-xs px-4 py-2"
          onClick={() => setIsChangingPin(!isChangingPin)}
        >
          {isChangingPin ? 'Cancelar' : 'Cambiar PIN'}
        </Button>
      </div>

      {/* Formulario de Cambio de PIN */}
      {isChangingPin && (
        <form onSubmit={handleChangePinSubmit} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-bold text-white">Configurar Nuevo PIN de 4 Dígitos</h3>
          <div>
            <label className="block text-xs text-slate-400 mb-1">Nuevo PIN (4 dígitos numéricos)</label>
            <input
              type="password"
              maxLength={4}
              placeholder="••••"
              value={newPinInput}
              onChange={(e) => setNewPinInput(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white tracking-widest text-center text-lg focus:outline-none focus:border-cyan-400"
            />
          </div>
          <Button type="submit" variant="primary" className="text-xs">Guardar Nuevo PIN</Button>
        </form>
      )}

      {/* Tarjeta Visual Interactiva */}
      <div className="relative bg-gradient-to-tr from-cyan-950 via-slate-900 to-indigo-950 border border-cyan-500/30 rounded-3xl p-6 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex justify-between items-start mb-8">
          <div>
            <span className="text-xs font-semibold tracking-widest text-cyan-400 uppercase">NeoBank DirectPay</span>
            <p className="text-xs text-slate-400 mt-0.5">{cardData.type}</p>
          </div>
          <div className="w-10 h-8 bg-amber-400/20 border border-amber-400/40 rounded-md flex items-center justify-center">
            <div className="w-6 h-4 border border-amber-400/60 rounded-sm"></div>
          </div>
        </div>

        {/* Número de Tarjeta Sensible / Enmascarado */}
        <div className="my-6">
          <p className="text-xs text-slate-400 mb-1">Número de Tarjeta</p>
          <p className="text-xl md:text-2xl font-mono font-bold tracking-widest text-white">
            {showSensitiveData ? cardData.realNumber : cardData.number}
          </p>
        </div>

        <div className="flex justify-between items-end pt-4 border-t border-slate-800/60">
          <div>
            <p className="text-[10px] text-slate-400 uppercase">Titular</p>
            <p className="text-sm font-bold text-white tracking-wider">{cardData.holder}</p>
          </div>
          <div className="flex gap-4">
            <div>
              <p className="text-[10px] text-slate-400 uppercase">Vencimiento</p>
              <p className="text-sm font-mono font-bold text-white">
                {showSensitiveData ? cardData.exp : '••/••'}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-slate-400 uppercase">CVV</p>
              <p className="text-sm font-mono font-bold text-cyan-400">
                {showSensitiveData ? cardData.cvv : '•••'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Botón de Revelar Datos Protegidos por PIN */}
      <div className="text-center">
        {!showSensitiveData ? (
          <Button 
            variant="outline" 
            onClick={() => setShowPinModal(true)}
            className="text-xs py-3"
          >
            🔒 Ver Datos Sensibles (Solicitar PIN de 4 Dígitos)
          </Button>
        ) : (
          <Button 
            variant="danger" 
            onClick={() => setShowSensitiveData(false)}
            className="text-xs py-3"
          >
            🙈 Ocultar Datos de la Tarjeta
          </Button>
        )}
      </div>

      {/* Modal de Validación de PIN */}
      {showPinModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white text-center">Seguridad Requerida</h3>
            <p className="text-xs text-slate-400 text-center">
              Ingresa tu PIN de 4 dígitos para ver el número completo, CVV y fecha de vencimiento.
            </p>
            
            <form onSubmit={handleVerifyPin} className="space-y-4">
              <input
                type="password"
                maxLength={4}
                autoFocus
                placeholder="••••"
                value={enteredPin}
                onChange={(e) => setEnteredPin(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-center text-2xl tracking-widest text-white focus:outline-none focus:border-cyan-400 font-mono"
              />
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="secondary" 
                  onClick={() => setShowPinModal(false)}
                  className="text-xs"
                >
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" className="text-xs">
                  Desbloquear
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};