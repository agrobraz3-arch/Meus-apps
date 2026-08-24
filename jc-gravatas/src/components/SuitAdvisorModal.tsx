import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, ShoppingBag, Eye } from 'lucide-react';
import { 
  suitColors, 
  shirtColors, 
  occasions, 
  getCombinationAdvice 
} from '../data/suitCombiner';
import { Product } from '../types';
import { formatCurrency } from '../utils';

interface SuitAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const SuitAdvisorModal: React.FC<SuitAdvisorModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
  onAddToCart,
}) => {
  const [selectedSuit, setSelectedSuit] = useState<string>('marinho');
  const [selectedShirt, setSelectedShirt] = useState<string>('branca');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('casamento-padrinho');

  if (!isOpen) return null;

  const advice = getCombinationAdvice(selectedSuit, selectedShirt, selectedOccasion);
  const recommendedProducts = products.filter((p) => advice.recommendedProductIds.includes(p.id));

  const currentSuitObj = suitColors.find((s) => s.id === selectedSuit);
  const currentShirtObj = shirtColors.find((s) => s.id === selectedShirt);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-[#0e1420] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-serif-luxury">
                Simulador de Look • Alfaiate Consultor
              </h2>
              <p className="text-[11px] text-slate-400">
                Descubra a gravata ideal para a combinação exata do seu terno e camisa
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6 flex-1">
          
          {/* Step Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Suit Color Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider">
                1. Cor do Terno / Blazer:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {suitColors.map((suit) => (
                  <button
                    key={suit.id}
                    onClick={() => setSelectedSuit(suit.id)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 transition-all ${
                      selectedSuit === suit.id
                        ? 'border-amber-400 bg-amber-500/10 text-white shadow-sm'
                        : 'border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span 
                      className="w-4 h-4 rounded-full shrink-0 border border-white/20 shadow-sm"
                      style={{ backgroundColor: suit.hex }}
                    />
                    <span className="truncate">{suit.name.split('/')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Shirt Color Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider">
                2. Cor da Camisa Social:
              </label>
              <div className="grid grid-cols-2 gap-2">
                {shirtColors.map((shirt) => (
                  <button
                    key={shirt.id}
                    onClick={() => setSelectedShirt(shirt.id)}
                    className={`p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center gap-2 transition-all ${
                      selectedShirt === shirt.id
                        ? 'border-amber-400 bg-amber-500/10 text-white shadow-sm'
                        : 'border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span 
                      className="w-4 h-4 rounded-full shrink-0 border border-slate-600 shadow-sm"
                      style={{ backgroundColor: shirt.hex }}
                    />
                    <span className="truncate">{shirt.name.split('/')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Occasion Selector */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-amber-400 uppercase tracking-wider">
                3. Ocasião do Evento:
              </label>
              <div className="space-y-1.5">
                {occasions.map((occ) => (
                  <button
                    key={occ.id}
                    onClick={() => setSelectedOccasion(occ.id)}
                    className={`w-full p-2 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all ${
                      selectedOccasion === occ.id
                        ? 'border-amber-400 bg-amber-500/10 text-amber-300 shadow-sm'
                        : 'border-slate-800 bg-slate-900/80 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span className="truncate">{occ.name}</span>
                    <span className="text-[10px] bg-slate-800 px-1.5 py-0.2 rounded text-slate-400">
                      {occ.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Visual Palette Preview & Styling Advice */}
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                {/* Visual Swatch Preview */}
                <div className="flex items-center -space-x-2">
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-slate-900 shadow"
                    style={{ backgroundColor: currentSuitObj?.hex }}
                    title={`Terno ${currentSuitObj?.name}`}
                  />
                  <div 
                    className="w-8 h-8 rounded-full border-2 border-slate-900 shadow"
                    style={{ backgroundColor: currentShirtObj?.hex }}
                    title={`Camisa ${currentShirtObj?.name}`}
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">
                    Paleta Selecionada: {currentSuitObj?.name.split('/')[0]} + {currentShirtObj?.name.split('/')[0]}
                  </h4>
                  <p className="text-[11px] text-amber-400 font-semibold">
                    Classificação: {advice.contrastScore}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
              "{advice.styleTip}"
            </p>
          </div>

          {/* Recommended Ties Grid */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <span>Gravatas Recomendadas para essa Composição:</span>
              <span className="text-[10px] bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded font-bold">
                {recommendedProducts.length} Opções Perfeitas
              </span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {recommendedProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-xl overflow-hidden p-3 flex flex-col justify-between space-y-2 group transition-all"
                >
                  <div 
                    onClick={() => {
                      onClose();
                      onSelectProduct(prod);
                    }}
                    className="cursor-pointer space-y-2"
                  >
                    <div className="aspect-square rounded-lg overflow-hidden bg-slate-950">
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-amber-400 font-bold block">
                        {prod.colorLabel}
                      </span>
                      <h5 className="text-xs font-semibold text-white line-clamp-1 group-hover:text-amber-300">
                        {prod.name}
                      </h5>
                      <span className="text-xs font-bold text-slate-200 font-serif-luxury">
                        {formatCurrency(prod.price)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    <button
                      onClick={() => {
                        onClose();
                        onSelectProduct(prod);
                      }}
                      className="p-1.5 text-[11px] font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Ver</span>
                    </button>
                    <button
                      onClick={() => onAddToCart(prod)}
                      className="p-1.5 text-[11px] font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg flex items-center justify-center gap-1"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Comprar</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
