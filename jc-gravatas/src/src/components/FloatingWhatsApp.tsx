import React, { useState } from 'react';
import { MessageCircle, X, Sparkles, Send, ShieldCheck } from 'lucide-react';
import { StoreSettings } from '../types';

interface FloatingWhatsAppProps {
  settings: StoreSettings;
  onOpenAdvisor: () => void;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  settings,
  onOpenAdvisor,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const sendCustom = (msg: string) => {
    const url = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      {/* Popover Bubble */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-88 bg-[#0e1420] border border-emerald-500/40 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-800 to-emerald-900 p-3.5 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-xs">
                DS
              </div>
              <div>
                <p className="text-xs font-bold leading-tight">Alfaiataria Don Sartorio</p>
                <p className="text-[10px] text-emerald-200 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-ping" />
                  <span>Online no WhatsApp</span>
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-emerald-200 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Options */}
          <div className="p-3.5 space-y-2.5 bg-slate-950/80 text-xs">
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Olá! Como podemos te ajudar hoje a escolher a gravata ideal?
            </p>

            <div className="space-y-1.5">
              <button
                onClick={() => sendCustom('Olá! Gostaria de consultar os kits e descontos para padrinhos de casamento.')}
                className="w-full text-left p-2 rounded-lg bg-slate-900 hover:bg-emerald-950/50 border border-slate-800 hover:border-emerald-500/40 text-slate-200 hover:text-emerald-300 transition-colors text-[11px] flex items-center justify-between"
              >
                <span>💍 Kits de Padrinhos de Casamento</span>
                <Send className="w-3 h-3 text-emerald-400" />
              </button>

              <button
                onClick={() => {
                  setIsOpen(false);
                  onOpenAdvisor();
                }}
                className="w-full text-left p-2 rounded-lg bg-slate-900 hover:bg-amber-950/50 border border-slate-800 hover:border-amber-500/40 text-slate-200 hover:text-amber-300 transition-colors text-[11px] flex items-center justify-between"
              >
                <span>✨ Simulador: Terno + Camisa + Gravata</span>
                <Sparkles className="w-3 h-3 text-amber-400" />
              </button>

              <button
                onClick={() => sendCustom('Olá! Gostaria de ajuda para escolher a melhor gravata para o meu terno.')}
                className="w-full text-left p-2 rounded-lg bg-slate-900 hover:bg-emerald-950/50 border border-slate-800 hover:border-emerald-500/40 text-slate-200 hover:text-emerald-300 transition-colors text-[11px] flex items-center justify-between"
              >
                <span>👔 Falar com Consultor de Estilo</span>
                <Send className="w-3 h-3 text-emerald-400" />
              </button>
            </div>

            {/* Custom Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (customMsg.trim()) sendCustom(customMsg);
              }}
              className="pt-2 flex gap-1.5"
            >
              <input
                type="text"
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                placeholder="Digite sua dúvida..."
                className="flex-1 bg-slate-900 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white p-1.5 rounded-lg transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-2xl shadow-emerald-950/60 border-2 border-emerald-300 hover:scale-105 active:scale-95 transition-all cursor-pointer relative"
        aria-label="Atendimento no WhatsApp"
      >
        <MessageCircle className="w-7 h-7 text-slate-950 fill-current" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-slate-950 text-[9px] font-black rounded-full flex items-center justify-center border border-slate-900">
          1
        </span>
      </button>
    </div>
  );
};
