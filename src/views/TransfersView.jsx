// src/views/TransfersView.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { formatCOP } from '../utils/formatters';

export const TransfersView = () => {
  const { user, updateBalance } = useAuth();
  
  // Estados del formulario
  const [bank, setBank] = useState('Bancolombia');
  const [accountType, setAccountType] = useState('Ahorros');
  const [accountNumber, setAccountNumber] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [amount, setAmount] = useState('');
  
  // Estado para mostrar comprobante
  const [receipt, setReceipt] = useState(null);

  const colombianBanks = [
    'Bancolombia',
    'Nequi',
    'Davivienda',
    'Daviplata',
    'Banco de Bogotá',
    'BBVA Colombia',
    'Lulo Bank',
    'Nu Colombia'
  ];

  const handleTransfer = (e) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);

    if (!accountNumber || !recipientName || !numericAmount || numericAmount <= 0) {
      alert('Por favor completa todos los campos del destinatario y monto.');
      return;
    }

    if (numericAmount > user.balance) {
      alert('Saldo insuficiente para realizar esta transferencia.');
      return;
    }

    // Ejecutar la transferencia en el estado global
    const res = updateBalance(
      numericAmount, 
      `Transferencia Red Directa a ${bank} (${recipientName})`, 
      'OUT'
    );

    if (res.success) {
      // Generar Comprobante Oficial
      setReceipt({
        tid: res.txId,
        date: new Date().toLocaleString('es-CO'),
        bank,
        accountType,
        accountNumber: `•••• ${accountNumber.slice(-4)}`,
        recipientName,
        amount: numericAmount,
        fee: 0 // Cero comisiones en Red Directa
      });

      // Limpiar campos
      setAccountNumber('');
      setRecipientName('');
      setAmount('');
    } else {
      alert(res.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Red Directa Interbancaria</h2>
        <p className="text-xs text-slate-400">Envíos inmediatos a cualquier banco de Colombia sin costo</p>
      </div>

      {!receipt ? (
        <form onSubmit={handleTransfer} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white">Datos de Destinatario</h3>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Entidad Financiera</label>
            <select
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-400"
            >
              {colombianBanks.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Tipo de Cuenta</label>
              <select
                value={accountType}
                onChange={(e) => setAccountType(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 text-white text-xs focus:outline-none focus:border-cyan-400"
              >
                <option value="Ahorros">Ahorros</option>
                <option value="Corriente">Corriente</option>
                <option value="Monedero / Depósito">Monedero</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Número de Cuenta/Celular</label>
              <input
                type="text"
                placeholder="10 dígitos"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-3 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Nombre del Titular</label>
            <input
              type="text"
              placeholder="Ej. María Gómez"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Monto a Enviar (COP)</span>
              <span>Disponible: <strong className="text-cyan-400">{formatCOP(user.balance)}</strong></span>
            </div>
            <input
              type="number"
              placeholder="Monto a transferir"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-400"
            />
          </div>

          <Button type="submit" variant="primary" className="text-xs mt-2">
            Confirmar y Enviar Dinero
          </Button>
        </form>
      ) : (
        /* Comprobante Digital Oficial */
        <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 space-y-4 shadow-2xl">
          <div className="text-center pb-4 border-b border-slate-800">
            <div className="w-12 h-12 bg-emerald-400/10 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-2 border border-emerald-400/20 text-xl font-bold">
              ✓
            </div>
            <h3 className="text-lg font-black text-white">¡Transferencia Exitosa!</h3>
            <p className="text-[11px] text-slate-400">Comprobante Oficial de Red Directa</p>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">ID Transacción (TID):</span>
              <span className="font-mono font-bold text-white">{receipt.tid}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Fecha / Hora:</span>
              <span className="text-white">{receipt.date}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Banco Destino:</span>
              <span className="font-bold text-white">{receipt.bank}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Destinatario:</span>
              <span className="text-white">{receipt.recipientName} ({receipt.accountNumber})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/50">
              <span className="text-slate-400">Costo de Transacción:</span>
              <span className="text-emerald-400 font-bold">$ 0 COP (Gratis)</span>
            </div>
            <div className="flex justify-between py-2 text-sm font-bold">
              <span className="text-slate-300">Monto Enviado:</span>
              <span className="text-cyan-400">{formatCOP(receipt.amount)}</span>
            </div>
          </div>

          <Button variant="primary" onClick={() => setReceipt(null)} className="text-xs">
            Realizar Otra Transferencia
          </Button>
        </div>
      )}
    </div>
  );
};