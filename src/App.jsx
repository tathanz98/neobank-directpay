// src/App.jsx
import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { LoginView } from './views/LoginView';
import { CardsView } from './views/CardsView';
import { CreditView } from './views/CreditView';
import { TransfersView } from './views/TransfersView';
import { Button } from './components/Button';
import { formatCOP } from './utils/formatters';

export default function App() {
  const { user, logout, transactions, updateBalance } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'cards' | 'credit' | 'transfers'
  const [depositAmount, setDepositAmount] = useState('');

  if (!user.isLoggedIn) {
    return <LoginView />;
  }

  const handleSandboxDeposit = (e) => {
    e.preventDefault();
    const amt = parseFloat(depositAmount);
    if (!amt || amt <= 0) return;
    updateBalance(amt, 'Depósito de Prueba Sandbox (PSE)', 'IN');
    setDepositAmount('');
    alert(`¡Depósito de ${formatCOP(amt)} acreditado con éxito!`);
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-6 pb-24">
      <div className="max-w-md mx-auto space-y-6">
        
        {/* Barra Superior */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex justify-between items-center">
          <div>
            <h1 className="text-sm font-bold text-white">Hola, {user.name.split(' ')[0]} 👋</h1>
            <p className="text-[10px] text-slate-400">CC: {user.doc}</p>
          </div>
          <Button variant="secondary" onClick={logout} className="w-auto px-3 py-1.5 text-xs">
            Salir
          </Button>
        </div>

        {/* Menú de Pestañas (4 Pestañas) */}
        <div className="grid grid-cols-4 gap-1 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`py-2 text-[10px] font-bold rounded-xl transition-all ${
              activeTab === 'dashboard' ? 'bg-cyan-400 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            Cuenta
          </button>
          <button
            onClick={() => setActiveTab('transfers')}
            className={`py-2 text-[10px] font-bold rounded-xl transition-all ${
              activeTab === 'transfers' ? 'bg-cyan-400 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            Enviar
          </button>
          <button
            onClick={() => setActiveTab('cards')}
            className={`py-2 text-[10px] font-bold rounded-xl transition-all ${
              activeTab === 'cards' ? 'bg-cyan-400 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            Tarjetas
          </button>
          <button
            onClick={() => setActiveTab('credit')}
            className={`py-2 text-[10px] font-bold rounded-xl transition-all ${
              activeTab === 'credit' ? 'bg-cyan-400 text-slate-950 shadow-lg' : 'text-slate-400 hover:text-white'
            }`}
          >
            Crédito
          </button>
        </div>

        {/* Contenido Dinámico */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-cyan-950 to-slate-900 border border-cyan-500/30 rounded-3xl p-6 shadow-xl">
              <p className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Saldo Disponible</p>
              <h2 className="text-3xl font-black text-white mt-1">{formatCOP(user.balance)}</h2>
              <div className="flex gap-2 mt-4 flex-wrap">
                <span className="text-[10px] bg-cyan-400/10 text-cyan-400 px-2.5 py-1 rounded-full border border-cyan-400/20 font-medium">
                  Red Directa Activa
                </span>
                <span className="text-[10px] bg-emerald-400/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-400/20 font-medium">
                  PIN 4 Dígitos Seguro
                </span>
              </div>
            </div>

            {/* Zona de Pruebas (Sandbox Deposit) */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Simulador de Depósito (Sandbox)</h3>
              <form onSubmit={handleSandboxDeposit} className="flex gap-2">
                <input
                  type="number"
                  placeholder="Monto ej. 100000"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
                <Button type="submit" variant="primary" className="w-auto px-4 py-2 text-xs">
                  Abonar
                </Button>
              </form>
            </div>

            {/* Historial de Transacciones */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Movimientos Recientes</h3>
              <div className="space-y-2">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex justify-between items-center p-3 bg-slate-950/60 rounded-xl border border-slate-800/50">
                    <div>
                      <p className="text-xs font-bold text-white">{tx.desc}</p>
                      <p className="text-[10px] text-slate-400">{tx.id} &bull; {tx.date}</p>
                    </div>
                    <span className={`text-xs font-mono font-bold ${tx.type === 'IN' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {tx.type === 'IN' ? '+' : ''}{formatCOP(tx.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transfers' && <TransfersView />}
        {activeTab === 'cards' && <CardsView />}
        {activeTab === 'credit' && <CreditView />}

        <div className="text-center text-slate-500 text-[10px] pt-4">
          NeoBank DirectPay &bull; Frontend React Modular
        </div>

      </div>
    </div>
  );
}