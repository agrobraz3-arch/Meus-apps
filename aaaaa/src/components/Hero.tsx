import React from 'react';
import { Sparkles, ShieldCheck, Truck, Users, Award, ArrowRight, HeartHandshake } from 'lucide-react';
import { CategoryId } from '../types';

interface HeroProps {
  onExplore: (category: CategoryId) => void;
  onOpenAdvisor: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, onOpenAdvisor }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#0e1420] via-[#090d15] to-[#0c1017] border-b border-slate-800">
      {/* Background Subtle Ambient Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-900/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Main Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wide">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>ALTA ALFAIATARIA • SEDA JACQUARD 1200 FIOS</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight font-serif-luxury">
              A gravata perfeita para o seu momento de maior <span className="gold-gradient-text">destaque e distinção</span>.
            </h1>

            <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Do clássico executivo aos kits de padrinhos de casamento sob medida. Peças com estrutura encorpada, toque de seda e o nó perfeito que não amassa.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                onClick={() => onExplore('casamento')}
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold px-6 py-3.5 rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 text-sm cursor-pointer"
              >
                <Users className="w-4 h-4 text-slate-900" />
                <span>Kits para Padrinhos & Noivos</span>
                <ArrowRight className="w-4 h-4 text-slate-900" />
              </button>

              <button
                onClick={onOpenAdvisor}
                className="flex items-center gap-2 bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 font-semibold px-5 py-3.5 rounded-xl border border-slate-700 hover:border-amber-500/50 transition-all text-sm cursor-pointer shadow-md"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Simulador de Look (Terno & Camisa)</span>
              </button>
            </div>

            {/* Key Trust Signals */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-3 text-center sm:text-left">
              <div>
                <p className="text-xl sm:text-2xl font-bold text-amber-400 font-serif-luxury">+15.000</p>
                <p className="text-[11px] sm:text-xs text-slate-400">Gravatas entregues em todo o país</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-amber-400 font-serif-luxury">4.9 / 5.0</p>
                <p className="text-[11px] sm:text-xs text-slate-400">Avaliação média de noivos e clientes</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-amber-400 font-serif-luxury">100% Seda</p>
                <p className="text-[11px] sm:text-xs text-slate-400">Jacquard e acabamento de alta costura</p>
              </div>
            </div>
          </div>

          {/* Hero Visual Card / Showcase */}
          <div className="lg:col-span-5">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Highlight Card */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-900/90 border border-amber-500/30 p-4 shadow-2xl shadow-black/80">
                <div className="relative h-72 sm:h-80 rounded-xl overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1000&q=85"
                    alt="Coleção de Gravatas Nobres Don Sartorio"
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                  
                  {/* Floating Tag */}
                  <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md border border-amber-500/40 text-amber-300 text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1.5 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span>Coleção Cerimonial 2026</span>
                  </div>

                  {/* Bottom details on image */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-xs uppercase tracking-wider text-amber-400 font-semibold">Edição Limitada</p>
                    <p className="text-lg font-bold font-serif-luxury">Kit Supremo do Noivo & Padrinhos</p>
                    <p className="text-xs text-slate-300">Gravata + Lenço + Abotoaduras em caixa de presente</p>
                  </div>
                </div>

                {/* Quick Wedding Bundle Perk */}
                <div className="mt-3 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-300">
                      <HeartHandshake className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-amber-200">Desconto em Lote para Casamentos</p>
                      <p className="text-[11px] text-slate-300">Compre 4 ou mais e ganhe até 20% OFF</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onExplore('kits')}
                    className="text-xs font-bold text-amber-400 hover:text-amber-300 underline"
                  >
                    Ver Kits
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Feature Strip */}
      <div className="border-t border-slate-800/80 bg-slate-950/60 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <Truck className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-200">Envio para todo Brasil</p>
              <p className="text-[11px] text-slate-400">Rastreamento minuto a minuto</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-200">Garantia Incondicional</p>
              <p className="text-[11px] text-slate-400">7 dias para troca ou devolução</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Award className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-200">Tecido Jacquard 1200 Fios</p>
              <p className="text-[11px] text-slate-400">Nó perfeito e covinha firme</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-slate-200">Suporte WhatsApp 1-a-1</p>
              <p className="text-[11px] text-slate-400">Auxílio na escolha da cor do terno</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
