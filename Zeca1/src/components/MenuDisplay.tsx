import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MarmitaSize, MenuItem } from '../types';
import { 
  Utensils, 
  Flame, 
  Sparkles, 
  Plus, 
  Check, 
  Info, 
  ShoppingBag, 
  Calendar, 
  Share2, 
  Star, 
  Award,
  ChevronRight,
  Coffee,
  Beer
} from 'lucide-react';

interface MenuDisplayProps {
  onOpenBuilder: (size?: MarmitaSize) => void;
}

export const MenuDisplay: React.FC<MenuDisplayProps> = ({ onOpenBuilder }) => {
  const { 
    menuItems, 
    marmitaSizes, 
    restaurant, 
    addToCartSingleItem, 
    generateWhatsAppMenuText,
    weeklySchedule,
    currentDayOfWeek,
    activeDaySelected
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [copySuccess, setCopySuccess] = useState(false);

  const todayFormatted = new Date().toLocaleDateString('pt-BR', { 
    weekday: 'long', 
    day: '2-digit', 
    month: 'long' 
  });

  const currentDaySchedule = weeklySchedule[activeDaySelected] || weeklySchedule[currentDayOfWeek];

  const handleCopyMenu = () => {
    const text = generateWhatsAppMenuText();
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const allMeats = menuItems.filter(i => i.category === 'carnes');
  const allRice = menuItems.filter(i => i.category === 'arroz');
  const allBeans = menuItems.filter(i => i.category === 'feijao');
  const allSides = menuItems.filter(i => i.category === 'acompanhamentos');
  const drinks = menuItems.filter(i => i.category === 'bebidas');
  const desserts = menuItems.filter(i => i.category === 'sobremesas');

  return (
    <div className="space-y-8 pb-12">
      
      {/* Hero Cardápio Board - Emulating the Restaurant Blackboard / Wooden Board */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-amber-950 via-stone-900 to-amber-950 border-2 border-amber-700/50 shadow-2xl p-6 sm:p-8 text-white">
        
        {/* Subtle wood texture & lights overlay */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-3 max-w-2xl">
            
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-500/40 px-3 py-1 rounded-full text-xs font-bold text-amber-300">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span className="capitalize">{todayFormatted}</span>
                <span>•</span>
                <span className="text-amber-200">Pratos Fresquinhos</span>
              </div>
              {currentDaySchedule?.themeTitle && (
                <div className="inline-flex items-center gap-1.5 bg-orange-500/20 border border-orange-500/40 px-3 py-1 rounded-full text-xs font-bold text-orange-300">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  <span>{currentDaySchedule.themeTitle}</span>
                </div>
              )}
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-serif text-amber-100 tracking-tight leading-none drop-shadow-md">
              CARDÁPIO DO DIA
            </h2>

            <p className="text-sm sm:text-base text-amber-200/90 font-medium">
              Monte sua quentinha completa com o legítimo tempero caseiro do <strong className="text-amber-400">Restaurante Do Zeca</strong>. Escolha arroz, feijão, carnes na brasa e guisados com até 6 acompanhamentos.
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
              <button
                id="hero-monte-sua-marmita-btn"
                onClick={() => onOpenBuilder()}
                className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-black text-sm px-6 py-3 rounded-xl shadow-lg shadow-amber-950/60 hover:shadow-amber-500/30 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Utensils className="w-4 h-4" />
                <span>MONTE SUA QUENTINHA AGORA</span>
              </button>

              <button
                id="share-daily-menu-btn"
                onClick={handleCopyMenu}
                className="bg-stone-800/80 hover:bg-stone-700 text-amber-200 border border-amber-700/40 text-xs font-bold px-4 py-3 rounded-xl flex items-center gap-2 transition-all"
                title="Copiar texto do cardápio formatado para WhatsApp"
              >
                {copySuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-amber-400" />}
                <span>{copySuccess ? 'Cardápio Copiado!' : 'Copiar p/ WhatsApp'}</span>
              </button>
            </div>
          </div>

          {/* Quick Price Cards / Badges */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full md:w-auto shrink-0">
            {marmitaSizes.filter(s => s.id !== 'familia').map(s => (
              <div 
                key={s.id}
                onClick={() => onOpenBuilder(s)}
                className={`p-3 sm:p-4 rounded-2xl border text-center cursor-pointer transition-all hover:scale-105 ${
                  s.popular 
                    ? 'bg-amber-900/60 border-amber-400 text-white ring-1 ring-amber-400' 
                    : 'bg-stone-900/80 border-amber-800/40 text-stone-200'
                }`}
              >
                <div className="text-[11px] font-black uppercase text-amber-300 tracking-wider">
                  {s.label}
                </div>
                <div className="text-xl sm:text-2xl font-black text-amber-400 mt-1">
                  R$ {s.price.toFixed(2)}
                </div>
                <div className="text-[10px] text-stone-300 mt-1">
                  {s.maxMeats} {s.maxMeats > 1 ? 'Carnes' : 'Carne'}
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* Quentinha Sizes Showcase */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold font-serif text-stone-100 flex items-center gap-2">
              <Utensils className="w-5 h-5 text-amber-500" />
              <span>1. Escolha o Tamanho da sua Marmita</span>
            </h3>
            <p className="text-xs text-stone-400">
              Todas acompanham arroz, feijão, carnes escolhidas e acompanhamentos caprichados
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {marmitaSizes.map(size => (
            <div
              key={size.id}
              id={`size-card-${size.id}`}
              className="bg-stone-900/80 border border-stone-800 hover:border-amber-700/60 rounded-2xl p-5 flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-amber-950/20 group relative"
            >
              {size.popular && (
                <div className="absolute -top-2.5 right-4 bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 text-[10px] font-black px-2.5 py-0.5 rounded-full shadow uppercase tracking-wider">
                  Mais Pedida
                </div>
              )}

              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-base font-bold text-amber-100 group-hover:text-amber-400 transition-colors">
                      {size.name}
                    </h4>
                    <span className="text-xs text-amber-400/90 font-medium">
                      {size.label}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-amber-400">
                      R$ {size.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-stone-400 mt-2.5 leading-relaxed">
                  {size.description}
                </p>

                <div className="mt-4 pt-3 border-t border-stone-800 space-y-1.5 text-xs text-stone-300">
                  <div className="flex items-center gap-1.5 text-amber-300/90">
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>Até <strong>{size.maxMeats}</strong> {size.maxMeats > 1 ? 'carnes' : 'carne do dia'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-stone-400">
                    <Utensils className="w-3.5 h-3.5 text-amber-500/70" />
                    <span>Até <strong>{size.maxSides}</strong> acompanhamentos</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-stone-400">
                    <span>🍚</span>
                    <span>Arroz & Feijão à sua escolha</span>
                  </div>
                </div>
              </div>

              <button
                id={`montar-size-btn-${size.id}`}
                onClick={() => onOpenBuilder(size)}
                className="mt-5 w-full bg-stone-800 hover:bg-amber-600 text-amber-200 hover:text-white font-bold text-xs py-2.5 px-4 rounded-xl border border-stone-700 hover:border-amber-500 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Montar esta Marmita</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Daily Highlights Board Breakdown */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
          <div>
            <h3 className="text-xl font-bold font-serif text-stone-100 flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500" />
              <span>Opções Disponíveis Hoje no Fogão do Zeca</span>
            </h3>
            <p className="text-xs text-stone-400">
              Esses itens estão prontos e saem na montagem da sua quentinha
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {[
              { id: 'todos', label: 'Tudo do Dia' },
              { id: 'carnes', label: `Carnes (${allMeats.length})` },
              { id: 'arroz', label: `Arrozes (${allRice.length})` },
              { id: 'feijao', label: `Feijões (${allBeans.length})` },
              { id: 'acompanhamentos', label: `Acomp. (${allSides.length})` },
              { id: 'bebidas', label: 'Bebidas' },
              { id: 'sobremesas', label: 'Sobremesas' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === tab.id
                    ? 'bg-amber-500 text-stone-950 shadow-md font-bold'
                    : 'bg-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 1. Carnes Section */}
        {(activeCategory === 'todos' || activeCategory === 'carnes') && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <h4 className="font-bold text-amber-200 text-sm uppercase tracking-wide">
                🥩 Carnes do Dia (Grelhadas & Guisados)
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {allMeats.map(meat => {
                const isAvailable = meat.available;
                return (
                  <div
                    key={meat.id}
                    className={`rounded-xl p-3.5 flex justify-between items-center transition-colors border ${
                      !isAvailable
                        ? 'bg-stone-950/40 border-stone-900 opacity-60'
                        : 'bg-stone-900/60 border-stone-800 hover:border-amber-700/50 group'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold text-sm transition-colors ${
                          !isAvailable
                            ? 'line-through decoration-red-500 decoration-2 text-stone-500'
                            : 'text-stone-200 group-hover:text-amber-300'
                        }`}>
                          {meat.name}
                        </span>
                        {!isAvailable ? (
                          <span className="text-[9px] bg-red-950/90 text-red-400 font-bold px-1.5 py-0.2 rounded border border-red-800/60 no-underline">
                            🚫 ESGOTADO / ACABOU
                          </span>
                        ) : meat.badge ? (
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.2 rounded border border-amber-500/30">
                            {meat.badge}
                          </span>
                        ) : null}
                      </div>
                      {meat.description && (
                        <p className={`text-xs mt-1 ${!isAvailable ? 'line-through text-stone-600' : 'text-stone-400'}`}>
                          {meat.description}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => onOpenBuilder()}
                      disabled={!isAvailable}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ml-3 transition-colors ${
                        !isAvailable
                          ? 'bg-stone-900 text-stone-600 cursor-not-allowed'
                          : 'bg-stone-800 hover:bg-amber-600 text-stone-300 hover:text-white cursor-pointer'
                      }`}
                      title={isAvailable ? "Montar quentinha com esta carne" : "Prato esgotado"}
                    >
                      {isAvailable ? <Plus className="w-4 h-4" /> : <span className="text-xs font-bold text-red-500">✕</span>}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2. Arroz & Feijão Section */}
        {(activeCategory === 'todos' || activeCategory === 'arroz' || activeCategory === 'feijao') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Arrozes */}
            {(activeCategory === 'todos' || activeCategory === 'arroz') && (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <h4 className="font-bold text-amber-200 text-sm uppercase tracking-wide">
                    🍚 Opções de Arroz
                  </h4>
                </div>
                <div className="space-y-2">
                  {allRice.map(rice => {
                    const isAvailable = rice.available;
                    return (
                      <div key={rice.id} className={`border rounded-xl p-3 flex justify-between items-center ${
                        !isAvailable ? 'bg-stone-950/40 border-stone-900 opacity-60' : 'bg-stone-900/60 border-stone-800'
                      }`}>
                        <div>
                          <div className="font-semibold text-sm flex items-center gap-2">
                            <span className={!isAvailable ? 'line-through decoration-red-500 decoration-2 text-stone-500' : 'text-stone-200'}>
                              {rice.name}
                            </span>
                            {!isAvailable ? (
                              <span className="text-[9px] bg-red-950/90 text-red-400 font-bold px-1.5 py-0.2 rounded border border-red-800/60">
                                🚫 ESGOTADO
                              </span>
                            ) : rice.badge ? (
                              <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/30 font-bold">
                                {rice.badge}
                              </span>
                            ) : null}
                          </div>
                          {rice.description && <p className={`text-xs ${!isAvailable ? 'line-through text-stone-600' : 'text-stone-400'}`}>{rice.description}</p>}
                        </div>
                        {isAvailable ? (
                          <span className="text-xs text-emerald-400 font-medium">Disponível</span>
                        ) : (
                          <span className="text-xs text-red-400 font-bold">Acabou</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Feijões */}
            {(activeCategory === 'todos' || activeCategory === 'feijao') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <h4 className="font-bold text-amber-200 text-sm uppercase tracking-wide">
                      🍲 Opções de Feijão
                    </h4>
                  </div>
                  <span className="text-[11px] text-amber-400 font-bold bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                    Opcional (Pode pedir sem feijão)
                  </span>
                </div>
                <div className="space-y-2">
                  {/* Card informativo de Sem Feijão */}
                  <div className="bg-amber-950/30 border border-amber-600/40 rounded-xl p-3 flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-amber-200 text-sm flex items-center gap-2">
                        <span>🚫 Opção Sem Feijão</span>
                        <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/30 font-bold">
                          Personalizado
                        </span>
                      </div>
                      <p className="text-xs text-stone-300 mt-0.5">
                        Não gosta de feijão? Você pode montar sua marmita apenas com <strong>Macarrão</strong>, arroz, carnes e salada.
                      </p>
                    </div>
                    <button
                      onClick={() => onOpenBuilder()}
                      className="text-xs bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold px-2.5 py-1.5 rounded-lg shrink-0 ml-2"
                    >
                      Montar
                    </button>
                  </div>

                  {allBeans.map(bean => {
                    const isAvailable = bean.available;
                    return (
                      <div key={bean.id} className={`border rounded-xl p-3 flex justify-between items-center ${
                        !isAvailable ? 'bg-stone-950/40 border-stone-900 opacity-60' : 'bg-stone-900/60 border-stone-800'
                      }`}>
                        <div>
                          <div className="font-semibold text-sm flex items-center gap-2">
                            <span className={!isAvailable ? 'line-through decoration-red-500 decoration-2 text-stone-500' : 'text-stone-200'}>
                              {bean.name}
                            </span>
                            {!isAvailable ? (
                              <span className="text-[9px] bg-red-950/90 text-red-400 font-bold px-1.5 py-0.2 rounded border border-red-800/60">
                                🚫 ESGOTADO
                              </span>
                            ) : bean.badge ? (
                              <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded border border-amber-500/30 font-bold">
                                {bean.badge}
                              </span>
                            ) : null}
                          </div>
                          {bean.description && <p className={`text-xs ${!isAvailable ? 'line-through text-stone-600' : 'text-stone-400'}`}>{bean.description}</p>}
                        </div>
                        {isAvailable ? (
                          <span className="text-xs text-emerald-400 font-medium">Disponível</span>
                        ) : (
                          <span className="text-xs text-red-400 font-bold">Acabou</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}

        {/* 3. Acompanhamentos Section */}
        {(activeCategory === 'todos' || activeCategory === 'acompanhamentos') && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <h4 className="font-bold text-amber-200 text-sm uppercase tracking-wide">
                🥗 Acompanhamentos do Dia
              </h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
              {allSides.map(side => {
                const isAvailable = side.available;
                return (
                  <div
                    key={side.id}
                    className={`border rounded-xl p-3 flex flex-col justify-between ${
                      !isAvailable ? 'bg-stone-950/40 border-stone-900 opacity-60' : 'bg-stone-900/50 border-stone-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className={`font-medium text-xs ${!isAvailable ? 'line-through decoration-red-500 decoration-2 text-stone-500' : 'text-stone-200'}`}>
                          {side.name}
                        </div>
                        {!isAvailable && (
                          <span className="text-[8px] bg-red-950 text-red-400 font-bold px-1 rounded">ACABOU</span>
                        )}
                      </div>
                      {side.description && (
                        <div className={`text-[11px] mt-0.5 ${!isAvailable ? 'line-through text-stone-600' : 'text-stone-500'}`}>{side.description}</div>
                      )}
                    </div>
                    <span className={`text-[10px] font-bold mt-2 ${!isAvailable ? 'text-red-400' : 'text-amber-400/80'}`}>
                      {isAvailable ? 'Incluso na marmita' : 'Esgotado'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. Bebidas & Sobremesas (Adicionais Diretos) */}
        {(activeCategory === 'todos' || activeCategory === 'bebidas' || activeCategory === 'sobremesas') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-800">
            
            {/* Bebidas */}
            {(activeCategory === 'todos' || activeCategory === 'bebidas') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Beer className="w-4 h-4 text-amber-500" />
                    <h4 className="font-bold text-amber-200 text-sm uppercase tracking-wide">
                      🥤 Bebidas Geladas
                    </h4>
                  </div>
                  <span className="text-xs text-stone-400">Adicione ao pedido</span>
                </div>

                <div className="space-y-2">
                  {drinks.map(drink => {
                    const isAvailable = drink.available;
                    return (
                      <div
                        key={drink.id}
                        className={`border rounded-xl p-3 flex items-center justify-between transition-colors ${
                          !isAvailable ? 'bg-stone-950/40 border-stone-900 opacity-60' : 'bg-stone-900/60 border-stone-800 hover:border-amber-700/50'
                        }`}
                      >
                        <div>
                          <div className={`font-semibold text-xs sm:text-sm flex items-center gap-2 ${!isAvailable ? 'line-through decoration-red-500 decoration-2 text-stone-500' : 'text-stone-200'}`}>
                            <span>{drink.name}</span>
                            {!isAvailable && (
                              <span className="text-[8px] bg-red-950 text-red-400 font-bold px-1.5 py-0.2 rounded border border-red-800/60">
                                ESGOTADO
                              </span>
                            )}
                          </div>
                          <div className={`text-xs font-bold mt-0.5 ${!isAvailable ? 'line-through text-stone-600' : 'text-amber-400'}`}>
                            R$ {drink.extraPrice?.toFixed(2)}
                          </div>
                        </div>

                        <button
                          id={`add-drink-btn-${drink.id}`}
                          disabled={!isAvailable}
                          onClick={() => addToCartSingleItem(drink, 1)}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors ${
                            !isAvailable
                              ? 'bg-stone-900 text-stone-600 cursor-not-allowed'
                              : 'bg-amber-600 hover:bg-amber-500 text-stone-950 cursor-pointer'
                          }`}
                        >
                          {isAvailable ? (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Adicionar</span>
                            </>
                          ) : (
                            <span>Acabou</span>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sobremesas */}
            {(activeCategory === 'todos' || activeCategory === 'sobremesas') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-amber-500" />
                    <h4 className="font-bold text-amber-200 text-sm uppercase tracking-wide">
                      🍮 Sobremesas Caseiras
                    </h4>
                  </div>
                  <span className="text-xs text-stone-400">Adicione ao pedido</span>
                </div>

                <div className="space-y-2">
                  {desserts.map(dessert => {
                    const isAvailable = dessert.available;
                    return (
                      <div
                        key={dessert.id}
                        className={`border rounded-xl p-3 flex items-center justify-between transition-colors ${
                          !isAvailable ? 'bg-stone-950/40 border-stone-900 opacity-60' : 'bg-stone-900/60 border-stone-800 hover:border-amber-700/50'
                        }`}
                      >
                        <div>
                          <div className={`font-semibold text-xs sm:text-sm flex items-center gap-2 ${!isAvailable ? 'line-through decoration-red-500 decoration-2 text-stone-500' : 'text-stone-200'}`}>
                            <span>{dessert.name}</span>
                            {!isAvailable && (
                              <span className="text-[8px] bg-red-950 text-red-400 font-bold px-1.5 py-0.2 rounded border border-red-800/60">
                                ESGOTADO
                              </span>
                            )}
                          </div>
                          <div className={`text-xs font-bold mt-0.5 ${!isAvailable ? 'line-through text-stone-600' : 'text-amber-400'}`}>
                            R$ {dessert.extraPrice?.toFixed(2)}
                          </div>
                        </div>

                        <button
                          id={`add-dessert-btn-${dessert.id}`}
                          disabled={!isAvailable}
                          onClick={() => addToCartSingleItem(dessert, 1)}
                          className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition-colors ${
                            !isAvailable
                              ? 'bg-stone-900 text-stone-600 cursor-not-allowed'
                              : 'bg-amber-600 hover:bg-amber-500 text-stone-950 cursor-pointer'
                          }`}
                        >
                          {isAvailable ? (
                            <>
                              <Plus className="w-3.5 h-3.5" />
                              <span>Adicionar</span>
                            </>
                          ) : (
                            <span>Acabou</span>
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}

      </section>

    </div>
  );
};
