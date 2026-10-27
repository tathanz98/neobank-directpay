// src/views/CreditView.jsx
import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { formatCOP } from '../utils/formatters';

export const CreditView = () => {
  const { user, updateBalance } = useAuth();
  
  // Estados del evaluador
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState('');
  const [evaluationResult, setEvaluationResult] = useState(null);
  
  // Estados del Pagaré Digital y Canvas
  const [showSignModal, setShowSignModal] = useState(false);
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSigned, setHasSigned] = useState(false);

  const handleEvaluate = (e) => {
    e.preventDefault();
    const inc = parseFloat(income);
    const exp = parseFloat(expenses);

    if (!inc || !exp || inc <= exp) {
      alert('Por favor ingresa valores válidos (Tus ingresos deben ser mayores a tus gastos).');
      return;
    }

    const availableCapacity = (inc - exp) * 0.40; // 40% para cuota
    let suggestedLimit = availableCapacity * 12; // Cupo estimado a 12 meses

    if (suggestedLimit < 200000) suggestedLimit = 200000;
    if (suggestedLimit > 5000000) suggestedLimit = 5000000; // Tope máximo del MVP

    setEvaluationResult({
      score: user.credit.score,
      capacity: availableCapacity,
      limit: Math.round(suggestedLimit / 50000) * 50000 // Redondeo a múltiplos de 50k
    });
  };

  // Funciones para el Canvas de Firma Digital
  const startDrawing = (e) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.strokeStyle = '#00F5D4';
    ctx.lineWidth = 2;
    ctx.stroke();
    setHasSigned(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSigned(false);
  };

  const handleDisburseCredit = () => {
    if (!hasSigned) {
      alert('Debes firmar el pagaré digital para autorizar el desembolso.');
      return;
    }

    // Acreditar saldo en el neobanco
    updateBalance(evaluationResult.limit, 'Desembolso Crédito DirectPay (Pagaré Digital)', 'IN');
    setShowSignModal(false);
    alert(`¡Crédito aprobado y desembolsado por ${formatCOP(evaluationResult.limit)} a tu cuenta con éxito!`);
    setEvaluationResult(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white">Crédito DirectPay</h2>
        <p className="text-xs text-slate-400">Evaluación inmediata y pagaré digital con validez legal</p>
      </div>

      {/* Estado del Crédito Actual */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400">Score Interno:</span>
          <span className="text-sm font-bold text-cyan-400">{user.credit.score} Puntos (Excelente)</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400">Estado en Centrales:</span>
          <span className="text-xs bg-emerald-400/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-400/20 font-bold">
            Al Día &bull; Datacrédito / CIFIN
          </span>
        </div>
      </div>

      {/* Formulario Evaluador */}
      {!evaluationResult ? (
        <form onSubmit={handleEvaluate} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white">Simulador de Capacidad de Endeudamiento</h3>
          
          <div>
            <label className="block text-xs text-slate-400 mb-1">Ingresos Mensuales Totales (COP)</label>
            <input
              type="number"
              placeholder="Ej. 2500000"
              value={income}
              onChange={(e) => setIncome(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Gastos Fijos Mensuales (COP)</label>
            <input
              type="number"
              placeholder="Ej. 1000000"
              value={expenses}
              onChange={(e) => setExpenses(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-cyan-400"
            />
          </div>

          <Button type="submit" variant="primary" className="text-xs">
            Calcular Cupo Pre-aprobado
          </Button>
        </form>
      ) : (
        <div className="bg-gradient-to-tr from-cyan-950 via-slate-900 to-indigo-950 border border-cyan-500/30 rounded-3xl p-6 space-y-5 shadow-2xl">
          <div>
            <span className="text-[10px] text-cyan-400 uppercase tracking-wider font-semibold">Resultado de Evaluación</span>
            <h3 className="text-2xl font-black text-white mt-1">Cupo Sugerido: {formatCOP(evaluationResult.limit)}</h3>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Tu capacidad de pago mensual estimada es de <strong className="text-cyan-400">{formatCOP(evaluationResult.capacity)}</strong>. El desembolso se realizará de forma inmediata a tu saldo disponible tras firmar digitalmente el pagaré.
          </p>

          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setEvaluationResult(null)} className="text-xs">
              Recalcular
            </Button>
            <Button variant="primary" onClick={() => setShowSignModal(true)} className="text-xs">
              Firmar Pagaré y Desembolsar
            </Button>
          </div>
        </div>
      )}

      {/* Modal de Firma de Pagaré Digital */}
      {showSignModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md flex justify-center items-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white text-center">Pagaré y Carta de Instrucciones</h3>
            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              Mediante la presente firma electrónica, autorizo el desembolso del crédito por <strong className="text-white">{formatCOP(evaluationResult?.limit)}</strong> y acepto las condiciones de reporte a centrales de riesgo en caso de mora.
            </p>

            {/* Canvas de Firma */}
            <div className="border border-slate-800 rounded-2xl bg-slate-950 p-2 text-center">
              <canvas
                ref={canvasRef}
                width={320}
                height={130}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full bg-slate-950 rounded-xl cursor-crosshair touch-none border border-dashed border-slate-800"
              />
              <div className="flex justify-between items-center mt-2 px-2">
                <span className="text-[10px] text-slate-500">Dibuja tu firma aquí con el dedo o mouse</span>
                <button onClick={clearCanvas} className="text-[10px] text-rose-400 hover:underline">Limpiar</button>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="secondary" onClick={() => setShowSignModal(false)} className="text-xs">
                Cancelar
              </Button>
              <Button 
                variant="primary" 
                onClick={handleDisburseCredit} 
                disabled={!hasSigned}
                className="text-xs"
              >
                Aprobar y Desembolsar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};