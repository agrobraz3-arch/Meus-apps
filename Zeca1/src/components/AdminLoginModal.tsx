import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, KeyRound, ShieldAlert, ArrowRight, X, ChefHat, SlidersHorizontal, CheckCircle2 } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessRedirect?: 'admin_menu' | 'admin_orders';
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccessRedirect = 'admin_menu',
}) => {
  const { loginAdmin, setActiveTab, restaurant } = useApp();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
      const ok = loginAdmin(pin);
      setIsSubmitting(false);
      if (ok) {
        setPin('');
        setError('');
        onClose();
        setActiveTab(onSuccessRedirect);
      } else {
        setError('Senha / PIN incorreto. Tente novamente.');
      }
    }, 400);
  };

  const handleKeyClick = (digit: string) => {
    if (pin.length < 6) {
      const next = pin + digit;
      setPin(next);
      setError('');
      if (next.length === 4 && (next === (restaurant.adminPin || '1234'))) {
        // Auto submit if 4 digits matches
        setTimeout(() => {
          loginAdmin(next);
          setPin('');
          onClose();
          setActiveTab(onSuccessRedirect);
        }, 200);
      }
    }
  };

  const handleDeleteDigit = () => {
    setPin(prev => prev.slice(0, -1));
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-amber-800/40 w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 p-4 border-b border-amber-800/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-600/30 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-amber-100 font-serif">Área Restrita do Restaurante</h3>
              <p className="text-[11px] text-amber-300/80">Acesso exclusivo do Dono e Cozinha</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-center">
          <p className="text-xs text-stone-300">
            Digite a senha de 4 dígitos para gerenciar o <strong>Cardápio</strong>, <strong>PIX</strong> e <strong>Pedidos da Cozinha (KDS)</strong>.
          </p>

          {/* PIN Display */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex justify-center items-center gap-2 my-2">
              {[0, 1, 2, 3].map(idx => (
                <div
                  key={idx}
                  className={`w-10 h-12 rounded-xl border flex items-center justify-center text-lg font-bold font-mono transition-all ${
                    pin.length > idx
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-1 ring-amber-500'
                      : 'bg-stone-950 border-stone-700 text-stone-600'
                  }`}
                >
                  {pin.length > idx ? '●' : ''}
                </div>
              ))}
            </div>

            {error && (
              <div className="text-xs text-red-400 bg-red-950/60 border border-red-800/60 py-1.5 px-3 rounded-xl flex items-center justify-center gap-1.5 animate-in shake">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Virtual PIN Pad */}
            <div className="grid grid-cols-3 gap-2 pt-1 max-w-[240px] mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleKeyClick(num)}
                  className="h-11 rounded-xl bg-stone-800 hover:bg-amber-600 hover:text-stone-950 text-stone-200 font-bold text-base transition-colors active:scale-95 cursor-pointer shadow"
                >
                  {num}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setPin('')}
                className="h-11 rounded-xl bg-stone-950 hover:bg-stone-800 text-stone-400 font-medium text-xs transition-colors"
              >
                Limpar
              </button>
              <button
                type="button"
                onClick={() => handleKeyClick('0')}
                className="h-11 rounded-xl bg-stone-800 hover:bg-amber-600 hover:text-stone-950 text-stone-200 font-bold text-base transition-colors active:scale-95 cursor-pointer shadow"
              >
                0
              </button>
              <button
                type="button"
                onClick={handleDeleteDigit}
                className="h-11 rounded-xl bg-stone-950 hover:bg-stone-800 text-stone-400 font-medium text-xs transition-colors"
              >
                ⌫
              </button>
            </div>

            <div className="pt-2">
              <button
                id="admin-login-submit-btn"
                type="submit"
                disabled={isSubmitting || pin.length === 0}
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-stone-950 font-black text-xs flex items-center justify-center gap-1.5 transition-colors shadow cursor-pointer"
              >
                {isSubmitting ? <span>Verificando...</span> : <span>Acessar Painel do Dono</span>}
              </button>
            </div>
          </form>

          <div className="bg-stone-950/60 p-2.5 rounded-xl border border-stone-800 text-[11px] text-stone-400">
            💡 Senha padrão inicial: <strong className="text-amber-400 font-mono">1234</strong> (Você pode alterá-la dentro do painel).
          </div>
        </div>

      </div>
    </div>
  );
};
