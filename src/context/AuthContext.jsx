// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Estado inicial del usuario (persistido en LocalStorage o valores por defecto)
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('neobank_user');
    return saved ? JSON.parse(saved) : {
      name: 'Jonathan Cadena',
      doc: '1049300000',
      email: 'jonathan@directpay.co',
      phone: '3101234567',
      balance: 1250000,
      pocketBalance: 300000,
      cardPin: '1234',
      isLoggedIn: true,
      credit: {
        score: 780,
        approvedLimit: 2500000,
        usedCredit: 0,
        status: 'AL_DIA', // AL_DIA, MORA_PREVENTIVA, REPORTADO
        daysInArrears: 0
      }
    };
  });

  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('neobank_tx');
    return saved ? JSON.parse(saved) : [
      { id: 'TID-9821', desc: 'Abono Nómina', amount: 1500000, type: 'IN', date: '2026-10-25' },
      { id: 'TID-4412', desc: 'Transferencia Directa Nequi', amount: -250000, type: 'OUT', date: '2026-10-26' }
    ];
  });

  // Guardar cambios en LocalStorage automáticamente
  useEffect(() => {
    localStorage.setItem('neobank_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('neobank_tx', JSON.stringify(transactions));
  }, [transactions]);

  // Funciones globales para modificar el estado
  const login = (userData) => {
    setUser(prev => ({ ...prev, ...userData, isLoggedIn: true }));
  };

  const logout = () => {
    setUser(prev => ({ ...prev, isLoggedIn: false }));
  };

  const updateBalance = (amount, description, type = 'OUT') => {
    if (type === 'OUT' && user.balance < amount) {
      return { success: false, message: 'Saldo insuficiente' };
    }

    const newBalance = type === 'IN' ? user.balance + amount : user.balance - amount;
    const newTx = {
      id: `TID-${Math.floor(1000 + Math.random() * 9000)}`,
      desc: description,
      amount: type === 'IN' ? amount : -amount,
      type,
      date: new Date().toISOString().split('T')[0]
    };

    setUser(prev => ({ ...prev, balance: newBalance }));
    setTransactions(prev => [newTx, ...prev]);
    return { success: true, txId: newTx.id };
  };

  const updateCardPin = (newPin) => {
    setUser(prev => ({ ...prev, cardPin: newPin }));
  };

  return (
    <AuthContext.Provider value={{
      user,
      transactions,
      login,
      logout,
      updateBalance,
      updateCardPin,
      setUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);