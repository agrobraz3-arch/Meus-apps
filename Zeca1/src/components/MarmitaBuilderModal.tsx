import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MarmitaSize, MenuItem, MarmitaCustomization } from '../types';
import { X, Check, Plus, Minus, AlertCircle, Sparkles, Utensils, Flame, ChevronRight, Info } from 'lucide-react';

interface MarmitaBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSize?: MarmitaSize;
}

export const MarmitaBuilderModal: React.FC<MarmitaBuilderModalProps> = ({
  isOpen,
  onClose,
  initialSize
}) => {
  const { marmitaSizes, menuItems, addToCartMarmita } = useApp();

  const [selectedSize, setSelectedSize] = useState<MarmitaSize>(
    initialSize || marmitaSizes.find(s => s.id === 'm') || marmitaSizes[0]
  );
  const [selectedRice, setSelectedRice] = useState<string[]>(['Arroz Branco']);
  const [selectedBeans, setSelectedBeans] = useState<string[]>([]);
  const [selectedMeats, setSelectedMeats] = useState<string[]>(['Contra Filé na Brasa']);
  const [selectedSides, setSelectedSides] = useState<string[]>(['Macarrão']);
  const [notes, setNotes] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  if (!isOpen) return null;

  // All items for each category
  const allRice = menuItems.filter(i => i.category === 'arroz');
  const allBeans = menuItems.filter(i => i.category === 'feijao');
  const allMeats = menuItems.filter(i => i.category === 'carnes');
  const allSides = menuItems.filter(i => i.category === 'acompanhamentos');

  // Toggle handlers with limit check
  const handleToggleRice = (name: string, isAvailable: boolean = true) => {
    if (!isAvailable) return;
    if (selectedRice.includes(name)) {
      setSelectedRice(prev => prev.filter(r => r !== name));
    } else {
      if (selectedRice.length < selectedSize.maxRice) {
        setSelectedRice(prev => [...prev, name]);
      } else {
        if (selectedSize.maxRice === 1) {
          setSelectedRice([name]);
        }
      }
    }
  };

  const handleToggleBeans = (name: string, isAvailable: boolean = true) => {
    if (!isAvailable) return;
    if (selectedBeans.includes(name)) {
      setSelectedBeans(prev => prev.filter(b => b !== name));
    } else {
      if (selectedBeans.length < selectedSize.maxBeans) {
        setSelectedBeans(prev => [...prev, name]);
      } else {
        if (selectedSize.maxBeans === 1) {
          setSelectedBeans([name]);
        }
      }
    }
  };

  const handleToggleMeat = (name: string, isAvailable: boolean = true) => {
    if (!isAvailable) return;
    if (selectedMeats.includes(name)) {
      setSelectedMeats(prev => prev.filter(m => m !== name));
    } else {
      if (selectedMeats.length < selectedSize.maxMeats) {
        setSelectedMeats(prev => [...prev, name]);
      } else {
        if (selectedSize.maxMeats === 1) {
          setSelectedMeats([name]);
        }
      }
    }
  };

  const handleToggleSide = (name: string, isAvailable: boolean = true) => {
    if (!isAvailable) return;
    if (selectedSides.includes(name)) {
      setSelectedSides(prev => prev.filter(s => s !== name));
    } else {
      if (selectedSides.length < selectedSize.maxSides) {
        setSelectedSides(prev => [...prev, name]);
      }
    }
  };

  const handleSelectSize = (size: MarmitaSize) => {
    setSelectedSize(size);
    // Trim choices if exceeding new size capacity
    if (selectedMeats.length > size.maxMeats) {
      setSelectedMeats(selectedMeats.slice(0, size.maxMeats));
    }
    if (selectedSides.length > size.maxSides) {
      setSelectedSides(selectedSides.slice(0, size.maxSides));
    }
    if (selectedRice.length > size.maxRice) {
      setSelectedRice(selectedRice.slice(0, size.maxRice));
    }
    if (selectedBeans.length > size.maxBeans) {
      setSelectedBeans(selectedBeans.slice(0, size.maxBeans));
    }
  };

  // Valid if at least 1 food item is selected (meat, or side/pasta, or rice)
  const isValid = selectedMeats.length > 0 || selectedSides.length > 0 || selectedRice.length > 0;

  const handleAddToCart = () => {
    if (!isValid) return;

    const customization: MarmitaCustomization = {
      size: selectedSize,
      selectedRice,
      selectedBeans,
      selectedMeats,
      selectedSides,
      notes: notes.trim() ? notes.trim() : undefined,
    };

    addToCartMarmita(customization, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-stone-900 border border-amber-800/40 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 p-4 sm:p-5 border-b border-amber-800/30 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/30 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold font-serif text-amber-100">
                  Monte Sua Marmita do Dia
                </h2>
                <span className="bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded font-medium border border-amber-500/30">
                  Restaurante do Zeca
                </span>
              </div>
              <p className="text-xs text-amber-300/70">
                Personalize com as opções frescas do nosso fogão a lenha
              </p>
            </div>
          </div>

          <button
            id="close-marmita-builder-modal"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body with Two Columns */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Selection Area */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* 1. Escolha do Tamanho */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-600 text-stone-950 text-xs font-black flex items-center justify-center">1</span>
                  <h3 className="text-base font-bold text-amber-200">Escolha o Tamanho da Quentinha</h3>
                </div>
                <span className="text-xs text-amber-400 font-medium">Obrigatório</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {marmitaSizes.map(size => {
                  const isSelected = selectedSize.id === size.id;
                  return (
                    <div
                      key={size.id}
                      id={`marmita-size-${size.id}`}
                      onClick={() => handleSelectSize(size)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all relative ${
                        isSelected
                          ? 'bg-amber-950/60 border-amber-500 text-white shadow-lg shadow-amber-950/40 ring-1 ring-amber-500'
                          : 'bg-stone-800/40 border-stone-700/60 hover:border-amber-700/60 text-stone-300'
                      }`}
                    >
                      {size.popular && (
                        <span className="absolute -top-2 right-3 bg-amber-500 text-stone-950 text-[10px] font-black px-2 py-0.2 rounded-full uppercase tracking-wider shadow">
                          Mais Pedida
                        </span>
                      )}

                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <div className="font-bold text-amber-100 flex items-center gap-1.5">
                            {size.name}
                          </div>
                          <p className="text-xs text-stone-400 mt-1 line-clamp-2">
                            {size.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-base font-black text-amber-400 whitespace-nowrap">
                            R$ {size.price.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-stone-700/50 flex flex-wrap gap-2 text-[11px] text-amber-300/80">
                        <span>🍗 Até {size.maxMeats} {size.maxMeats > 1 ? 'carnes' : 'carne'}</span>
                        <span>•</span>
                        <span>🥗 Até {size.maxSides} acomp.</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Escolha das Carnes */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-600 text-stone-950 text-xs font-black flex items-center justify-center">2</span>
                  <h3 className="text-base font-bold text-amber-200">
                    Carnes do Dia
                  </h3>
                </div>
                <div className="text-xs px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-700/50 text-amber-300 font-medium">
                  {selectedMeats.length} de {selectedSize.maxMeats} selecionada(s)
                </div>
              </div>
              <p className="text-xs text-stone-400 mb-3">
                Carnes assadas na brasa e guisados caseiros no capricho
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {allMeats.map(meat => {
                  const isAvailable = meat.available;
                  const isSelected = selectedMeats.includes(meat.name);
                  const isMaxReached = selectedMeats.length >= selectedSize.maxMeats && !isSelected;

                  return (
                    <button
                      key={meat.id}
                      id={`meat-btn-${meat.id}`}
                      type="button"
                      disabled={!isAvailable || (isMaxReached && selectedSize.maxMeats > 1)}
                      onClick={() => handleToggleMeat(meat.name, isAvailable)}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all relative overflow-hidden ${
                        !isAvailable
                          ? 'bg-stone-950/40 border-stone-800/80 text-stone-500 cursor-not-allowed opacity-60'
                          : isSelected
                          ? 'bg-amber-900/50 border-amber-500 text-white shadow ring-1 ring-amber-500'
                          : isMaxReached && selectedSize.maxMeats > 1
                          ? 'bg-stone-800/20 border-stone-800 text-stone-500 cursor-not-allowed opacity-60'
                          : 'bg-stone-800/40 border-stone-700 hover:border-amber-700 text-stone-200 hover:bg-stone-800'
                      }`}
                    >
                      <div className="pr-2">
                        <div className={`font-semibold text-sm flex items-center gap-1.5 ${!isAvailable ? 'line-through decoration-red-500 decoration-2 text-stone-500' : ''}`}>
                          {meat.name}
                          {!isAvailable ? (
                            <span className="text-[9px] bg-red-950/90 text-red-400 font-black px-1.5 py-0.5 rounded border border-red-800/60 no-underline">
                              🚫 ESGOTADO / ACABOU
                            </span>
                          ) : meat.badge ? (
                            <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded border border-amber-500/30">
                              {meat.badge}
                            </span>
                          ) : null}
                        </div>
                        {meat.description && (
                          <div className={`text-[11px] text-stone-400 mt-0.5 ${!isAvailable ? 'line-through text-stone-600' : ''}`}>
                            {meat.description}
                          </div>
                        )}
                      </div>

                      <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                        !isAvailable
                          ? 'border border-stone-800 bg-stone-950 text-stone-600'
                          : isSelected 
                          ? 'bg-amber-500 text-stone-950' 
                          : 'border border-stone-600 bg-stone-900'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        {!isAvailable && <span className="text-xs font-bold text-red-500">✕</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Opções de Arroz */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-600 text-stone-950 text-xs font-black flex items-center justify-center">3</span>
                  <h3 className="text-base font-bold text-amber-200">Opções de Arroz</h3>
                </div>
                <div className="text-xs px-2.5 py-1 rounded-full bg-stone-800 border border-stone-700 text-amber-300 font-medium">
                  {selectedRice.length === 0 ? '🚫 Sem Arroz' : `${selectedRice.length} de ${selectedSize.maxRice} selecionado(s)`} (Opcional)
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                {/* Botão Sem Arroz */}
                <button
                  id="rice-none-btn"
                  type="button"
                  onClick={() => setSelectedRice([])}
                  className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    selectedRice.length === 0
                      ? 'bg-amber-950/70 border-amber-500 text-amber-300 ring-1 ring-amber-500 font-bold'
                      : 'bg-stone-800/40 border-stone-700 hover:border-amber-700 text-stone-400'
                  }`}
                >
                  <div className="text-xs">🚫 Sem Arroz</div>
                  <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                    selectedRice.length === 0 ? 'bg-amber-500 text-stone-950' : 'border border-stone-600'
                  }`}>
                    {selectedRice.length === 0 && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>

                {allRice.map(rice => {
                  const isAvailable = rice.available;
                  const isSelected = selectedRice.includes(rice.name);
                  return (
                    <button
                      key={rice.id}
                      id={`rice-btn-${rice.id}`}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => handleToggleRice(rice.name, isAvailable)}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        !isAvailable
                          ? 'bg-stone-950/40 border-stone-800/80 text-stone-500 cursor-not-allowed opacity-60'
                          : isSelected
                          ? 'bg-amber-900/50 border-amber-500 text-white ring-1 ring-amber-500 font-medium'
                          : 'bg-stone-800/40 border-stone-700 hover:border-amber-700 text-stone-200'
                      }`}
                    >
                      <div>
                        <div className={`text-xs font-medium ${!isAvailable ? 'line-through decoration-red-500 decoration-2 text-stone-500' : ''}`}>
                          {rice.name}
                        </div>
                        {!isAvailable && (
                          <div className="text-[8px] text-red-400 font-bold mt-0.5">ACABOU</div>
                        )}
                      </div>
                      <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                        !isAvailable ? 'border border-stone-800 bg-stone-950' : isSelected ? 'bg-amber-500 text-stone-950' : 'border border-stone-600'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        {!isAvailable && <span className="text-[10px] font-bold text-red-500">✕</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Opções de Feijão */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-600 text-stone-950 text-xs font-black flex items-center justify-center">4</span>
                  <h3 className="text-base font-bold text-amber-200">Opções de Feijão</h3>
                </div>
                <div className="text-xs px-2.5 py-1 rounded-full bg-stone-800 border border-stone-700 text-amber-300 font-medium">
                  {selectedBeans.length === 0 ? '🚫 Sem Feijão' : `${selectedBeans.length} de ${selectedSize.maxBeans} selecionado(s)`} (Opcional)
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                {/* Botão Sem Feijão (Ideal para quem não gosta ou quer só macarrão) */}
                <button
                  id="bean-none-btn"
                  type="button"
                  onClick={() => setSelectedBeans([])}
                  className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    selectedBeans.length === 0
                      ? 'bg-amber-950/70 border-amber-500 text-amber-300 ring-1 ring-amber-500 font-bold'
                      : 'bg-stone-800/40 border-stone-700 hover:border-amber-700 text-stone-400'
                  }`}
                >
                  <div>
                    <div className="text-xs">🚫 Sem Feijão</div>
                    <div className="text-[9px] text-amber-400/80">Não quero feijão</div>
                  </div>
                  <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                    selectedBeans.length === 0 ? 'bg-amber-500 text-stone-950' : 'border border-stone-600'
                  }`}>
                    {selectedBeans.length === 0 && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>

                {allBeans.map(bean => {
                  const isAvailable = bean.available;
                  const isSelected = selectedBeans.includes(bean.name);
                  return (
                    <button
                      key={bean.id}
                      id={`bean-btn-${bean.id}`}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => handleToggleBeans(bean.name, isAvailable)}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        !isAvailable
                          ? 'bg-stone-950/40 border-stone-800/80 text-stone-500 cursor-not-allowed opacity-60'
                          : isSelected
                          ? 'bg-amber-900/50 border-amber-500 text-white ring-1 ring-amber-500 font-medium'
                          : 'bg-stone-800/40 border-stone-700 hover:border-amber-700 text-stone-200'
                      }`}
                    >
                      <div>
                        <div className={`text-xs font-medium ${!isAvailable ? 'line-through decoration-red-500 decoration-2 text-stone-500' : ''}`}>
                          {bean.name}
                        </div>
                        {!isAvailable ? (
                          <div className="text-[8px] text-red-400 font-bold mt-0.5">ACABOU</div>
                        ) : bean.badge ? (
                          <div className="text-[9px] text-amber-400 font-semibold">{bean.badge}</div>
                        ) : null}
                      </div>
                      <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                        !isAvailable ? 'border border-stone-800 bg-stone-950' : isSelected ? 'bg-amber-500 text-stone-950' : 'border border-stone-600'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        {!isAvailable && <span className="text-[10px] font-bold text-red-500">✕</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Acompanhamentos */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-600 text-stone-950 text-xs font-black flex items-center justify-center">5</span>
                  <h3 className="text-base font-bold text-amber-200">Acompanhamentos</h3>
                </div>
                <div className="text-xs px-2.5 py-1 rounded-full bg-stone-800 border border-stone-700 text-amber-300 font-medium">
                  {selectedSides.length} de {selectedSize.maxSides} selecionado(s) (Opcional)
                </div>
              </div>
              <p className="text-xs text-stone-400 mb-2.5">
                Escolha quantos quiser (ex: pode escolher apenas <strong>Macarrão</strong>, ou combinar salada, purê e farofa).
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {allSides.map(side => {
                  const isAvailable = side.available;
                  const isSelected = selectedSides.includes(side.name);
                  const isMaxReached = selectedSides.length >= selectedSize.maxSides && !isSelected;

                  return (
                    <button
                      key={side.id}
                      id={`side-btn-${side.id}`}
                      type="button"
                      disabled={!isAvailable || isMaxReached}
                      onClick={() => handleToggleSide(side.name, isAvailable)}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                        !isAvailable
                          ? 'bg-stone-950/40 border-stone-800/80 text-stone-500 cursor-not-allowed opacity-60'
                          : isSelected
                          ? 'bg-amber-900/50 border-amber-500 text-white ring-1 ring-amber-500 font-medium'
                          : isMaxReached
                          ? 'bg-stone-800/20 border-stone-800 text-stone-500 cursor-not-allowed opacity-60'
                          : 'bg-stone-800/40 border-stone-700 hover:border-amber-700 text-stone-200'
                      }`}
                    >
                      <div>
                        <div className={`text-xs font-medium leading-tight ${!isAvailable ? 'line-through decoration-red-500 decoration-2 text-stone-500' : ''}`}>
                          {side.name}
                        </div>
                        {!isAvailable && (
                          <span className="text-[8px] text-red-400 font-bold block mt-0.5">ACABOU</span>
                        )}
                      </div>
                      <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ml-1.5 ${
                        !isAvailable ? 'border border-stone-800 bg-stone-950' : isSelected ? 'bg-amber-500 text-stone-950' : 'border border-stone-600'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        {!isAvailable && <span className="text-[10px] font-bold text-red-500">✕</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 6. Observações */}
            <div>
              <label htmlFor="marmita-notes" className="block text-xs font-semibold text-stone-300 mb-1.5">
                Alguma observação para a cozinha? (Opcional)
              </label>
              <input
                id="marmita-notes"
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Ex: pouco arroz, capricha no macarrão, sem salada, feijão separado..."
                className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-3.5 py-2.5 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Side Quentinha Live Plate Preview & Summary */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-stone-950/80 border border-amber-800/40 rounded-2xl p-4 sticky top-0 space-y-4">
              <div className="flex items-center gap-2 text-amber-300 font-serif font-bold text-sm border-b border-amber-900/40 pb-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Resumo da Sua Quentinha</span>
              </div>

              {/* Visual Marmita Dish Display */}
              <div className="bg-stone-900/90 rounded-xl p-3 border border-amber-700/30 text-xs space-y-2">
                <div className="flex justify-between items-center text-amber-200 font-bold">
                  <span>{selectedSize.name}</span>
                  <span className="text-amber-400 font-black">R$ {selectedSize.price.toFixed(2)}</span>
                </div>

                <div className="space-y-1.5 text-stone-300 pt-1 text-[11px]">
                  <div className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold shrink-0">Arroz:</span>
                    <span className="text-stone-200">
                      {selectedRice.length > 0 ? selectedRice.join(', ') : <span className="text-stone-400 italic">🚫 Sem Arroz</span>}
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold shrink-0">Feijão:</span>
                    <span className="text-stone-200">
                      {selectedBeans.length > 0 ? selectedBeans.join(', ') : <span className="text-amber-400/90 italic font-medium">🚫 Sem Feijão</span>}
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold shrink-0">Carne(s):</span>
                    <span className="text-stone-200">
                      {selectedMeats.length > 0 ? selectedMeats.join(', ') : <span className="text-amber-400 italic">Escolha a carne</span>}
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="text-amber-400 font-bold shrink-0">Acomp.:</span>
                    <span className="text-stone-200">
                      {selectedSides.length > 0 ? selectedSides.join(', ') : <span className="text-stone-400 italic">Nenhum</span>}
                    </span>
                  </div>
                  {notes && (
                    <div className="flex items-start gap-1.5 pt-1 text-stone-400 italic">
                      <span className="text-amber-400 font-bold shrink-0">Obs:</span>
                      <span>{notes}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="flex items-center justify-between bg-stone-900 p-2 rounded-xl border border-stone-800">
                <span className="text-xs text-stone-300 font-semibold pl-2">Quantidade:</span>
                <div className="flex items-center gap-2">
                  <button
                    id="decrease-builder-qty-btn"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-7 h-7 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center justify-center font-bold"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-bold text-amber-200 w-6 text-center">{quantity}</span>
                  <button
                    id="increase-builder-qty-btn"
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-7 h-7 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center justify-center font-bold"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Validation Warning */}
              {!isValid && (
                <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/40 text-amber-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>Escolha ao menos uma carne ou acompanhamento para montar sua marmita.</span>
                </div>
              )}

              {/* Price Calculation & Add Button */}
              <div className="pt-2">
                <div className="flex justify-between items-center text-stone-400 text-xs mb-2">
                  <span>Total desta marmita:</span>
                  <span className="text-base font-black text-amber-400">
                    R$ {(selectedSize.price * quantity).toFixed(2)}
                  </span>
                </div>

                <button
                  id="add-marmita-to-cart-btn"
                  disabled={!isValid}
                  onClick={handleAddToCart}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                    isValid
                      ? 'bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 shadow-amber-950/60 active:scale-98 cursor-pointer'
                      : 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
                  }`}
                >
                  <Utensils className="w-4 h-4" />
                  <span>Adicionar ao Pedido</span>
                </button>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
