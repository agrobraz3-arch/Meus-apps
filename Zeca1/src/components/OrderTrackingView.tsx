import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Order, OrderStatus } from '../types';
import { 
  Bike, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ChefHat, 
  Phone, 
  MessageCircle, 
  Utensils, 
  Sparkles, 
  Navigation, 
  ShieldCheck, 
  ShoppingBag,
  ExternalLink,
  RotateCcw,
  Play
} from 'lucide-react';

export const OrderTrackingView: React.FC = () => {
  const { 
    orders, 
    activeOrder, 
    setActiveTrackingOrderId, 
    restaurant, 
    updateOrderStatus, 
    setActiveTab, 
    generateOrderWhatsAppUrl 
  } = useApp();

  const [simulatingSpeed, setSimulatingSpeed] = useState(false);

  // If no orders yet, show empty state
  if (orders.length === 0 || !activeOrder) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4 text-center">
        <div className="bg-stone-900/80 border border-stone-800 rounded-3xl p-8 sm:p-12 space-y-5 shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-amber-600/20 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
            <Bike className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold font-serif text-amber-100">
              Nenhum Pedido em Andamento
            </h2>
            <p className="text-sm text-stone-400 max-w-md mx-auto">
              Você ainda não fez nenhum pedido de quentinha hoje. Escolha seu tamanho preferido e monte sua marmita no cardápio do dia!
            </p>
          </div>
          <button
            id="tracking-empty-go-menu-btn"
            onClick={() => setActiveTab('menu')}
            className="bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-black text-sm px-6 py-3 rounded-xl shadow-lg transition-all cursor-pointer"
          >
            Ver Cardápio do Dia e Fazer Pedido
          </button>
        </div>
      </div>
    );
  }

  const currentOrder = activeOrder;
  const status = currentOrder.status;
  const progressPercent = currentOrder.trackingCoordinates?.progress ?? (
    status === 'recebido' ? 15 : status === 'preparando' ? 45 : status === 'em_entrega' ? 80 : 100
  );

  const steps: { key: OrderStatus; label: string; desc: string; icon: React.ReactNode }[] = [
    { 
      key: 'recebido', 
      label: 'Pedido Recebido', 
      desc: 'Restaurante confirmou seu pedido',
      icon: <ShoppingBag className="w-4 h-4" /> 
    },
    { 
      key: 'preparando', 
      label: 'No Fogão do Zeca', 
      desc: 'Marmita quentinha sendo montada',
      icon: <ChefHat className="w-4 h-4" /> 
    },
    { 
      key: 'em_entrega', 
      label: 'Saiu para Entrega', 
      desc: 'Motoboy a caminho com sua refeição',
      icon: <Bike className="w-4 h-4" /> 
    },
    { 
      key: 'entregue', 
      label: 'Entregue com Sucesso', 
      desc: 'Bom apetite!',
      icon: <CheckCircle2 className="w-4 h-4" /> 
    },
  ];

  const getStepIndex = (st: OrderStatus) => {
    switch (st) {
      case 'recebido': return 0;
      case 'preparando': return 1;
      case 'em_entrega': return 2;
      case 'entregue': return 3;
      default: return 0;
    }
  };

  const currentStepIndex = getStepIndex(status);

  // Fast manual simulator triggers
  const handleAdvanceStep = () => {
    if (status === 'recebido') updateOrderStatus(currentOrder.id, 'preparando');
    else if (status === 'preparando') updateOrderStatus(currentOrder.id, 'em_entrega');
    else if (status === 'em_entrega') updateOrderStatus(currentOrder.id, 'entregue');
  };

  const handleResetOrder = () => {
    updateOrderStatus(currentOrder.id, 'recebido');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      
      {/* Top Selector if multiple orders exist */}
      {orders.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs text-stone-400 font-semibold shrink-0">Seus Pedidos:</span>
          {orders.map(o => (
            <button
              key={o.id}
              onClick={() => setActiveTrackingOrderId(o.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                o.id === currentOrder.id
                  ? 'bg-amber-500 text-stone-950 shadow'
                  : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
              }`}
            >
              Pedido #{o.orderNumber} ({o.status.toUpperCase()})
            </button>
          ))}
        </div>
      )}

      {/* Main Tracking Card */}
      <div className="bg-stone-900/90 border border-amber-800/40 rounded-3xl overflow-hidden shadow-2xl">
        
        {/* Banner with Order Number & Time */}
        <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 p-5 border-b border-amber-800/30 flex flex-wrap items-center justify-between gap-4 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-600/30 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-inner">
              <Bike className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-serif text-amber-100">
                  Rastreamento em Tempo Real
                </h2>
                <span className="bg-amber-500/20 text-amber-300 text-xs px-2.5 py-0.5 rounded-full font-bold border border-amber-500/30">
                  #{currentOrder.orderNumber}
                </span>
              </div>
              <p className="text-xs text-amber-300/80">
                Pedido feito às {new Date(currentOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {restaurant.name}
              </p>
            </div>
          </div>

          {/* Estimated Arrival Badge */}
          <div className="bg-stone-950/80 border border-amber-600/40 px-4 py-2 rounded-2xl flex items-center gap-3 shadow">
            <Clock className="w-5 h-5 text-amber-400" />
            <div>
              <div className="text-[10px] uppercase font-bold text-stone-400">
                {status === 'entregue' ? 'Status Final' : 'Previsão de Entrega'}
              </div>
              <div className="text-sm font-black text-amber-300">
                {status === 'entregue' ? 'Entregue!' : `Aprox. ${currentOrder.estimatedMinutes} minutos`}
              </div>
            </div>
          </div>
        </div>

        {/* Live Stepper */}
        <div className="p-5 sm:p-6 bg-stone-950/60 border-b border-stone-800">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 relative">
            {steps.map((step, idx) => {
              const isPassed = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;

              return (
                <div
                  key={step.key}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'bg-amber-950/60 border-amber-500 text-white ring-1 ring-amber-500 shadow-lg'
                      : isPassed
                      ? 'bg-stone-900/80 border-amber-800/40 text-stone-200'
                      : 'bg-stone-900/30 border-stone-800 text-stone-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      isPassed ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-stone-800 text-stone-500'
                    }`}>
                      {step.icon}
                    </div>
                    {isCurrent && (
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                      </span>
                    )}
                  </div>
                  <div className="font-bold text-xs text-amber-100">{step.label}</div>
                  <div className="text-[11px] text-stone-400 mt-0.5 leading-tight">{step.desc}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Live Simulated Map Canvas */}
        <div className="p-4 sm:p-6 space-y-4">
          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-1.5 text-stone-300 font-semibold">
              <Navigation className="w-4 h-4 text-amber-400" />
              <span>Mapa de Deslocamento ao Vivo (Pindorama - AL)</span>
            </div>
            <div className="text-amber-400 font-mono text-xs font-bold">
              GPS: {status === 'em_entrega' ? 'Motoboy em Movimento' : status === 'entregue' ? 'Chegou ao Destino' : 'Aguardando Despacho'}
            </div>
          </div>

          {/* Styled GPS Vector Map Container */}
          <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden bg-stone-950 border border-amber-800/40 shadow-inner">
            
            {/* Dark map styled grid lines & roads */}
            <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="map-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#292524" strokeWidth="0.8" />
                </pattern>
                <linearGradient id="route-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#d97706" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>

              <rect width="100%" height="100%" fill="#1c1917" />
              <rect width="100%" height="100%" fill="url(#map-grid)" />

              {/* City background roads */}
              <path d="M 0 100 Q 200 120 400 80 T 800 120" fill="none" stroke="#292524" strokeWidth="6" />
              <path d="M 150 0 L 150 400" fill="none" stroke="#292524" strokeWidth="5" />
              <path d="M 600 0 L 600 400" fill="none" stroke="#292524" strokeWidth="5" />
              <path d="M 0 220 L 900 220" fill="none" stroke="#292524" strokeWidth="8" />

              {/* Delivery Path from Restaurant (left) to Customer (right) */}
              <path
                id="delivery-road-path"
                d="M 80 180 C 180 80, 320 230, 480 130 S 680 200, 780 140"
                fill="none"
                stroke="#44403c"
                strokeWidth="10"
                strokeLinecap="round"
              />

              <path
                d="M 80 180 C 180 80, 320 230, 480 130 S 680 200, 780 140"
                fill="none"
                stroke="url(#route-gradient)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="6 4"
                className="animate-pulse"
              />
            </svg>

            {/* Pin: Restaurante Do Zeca */}
            <div className="absolute left-10 sm:left-14 top-28 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-10 h-10 rounded-2xl bg-amber-600 text-stone-950 font-black flex items-center justify-center shadow-lg shadow-amber-950/80 border-2 border-amber-300">
                <Utensils className="w-5 h-5" />
              </div>
              <div className="mt-1 bg-stone-900/90 text-amber-200 border border-amber-700/50 px-2 py-0.5 rounded text-[10px] font-bold shadow whitespace-nowrap">
                Restaurante Do Zeca (Origem)
              </div>
            </div>

            {/* Pin: Casa do Cliente */}
            <div className="absolute right-8 sm:right-16 top-20 transform translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-950/80 border-2 border-emerald-300">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="mt-1 bg-stone-900/90 text-emerald-200 border border-emerald-700/50 px-2 py-0.5 rounded text-[10px] font-bold shadow whitespace-nowrap max-w-[160px] truncate">
                {currentOrder.address.customerName} (Destino)
              </div>
            </div>

            {/* Dynamic Motoboy Marker moving along progress */}
            <div
              className="absolute transition-all duration-1000 ease-out flex flex-col items-center"
              style={{
                left: `${Math.min(85, Math.max(15, progressPercent))}%`,
                top: `${48 - Math.sin((progressPercent / 100) * Math.PI) * 18}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Radar pulse around bike */}
              <div className="relative">
                <div className="absolute -inset-3 bg-amber-500/30 rounded-full animate-ping pointer-events-none"></div>
                <div className="w-11 h-11 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center shadow-xl shadow-amber-500/40 border-2 border-white">
                  <Bike className="w-6 h-6" />
                </div>
              </div>
              <div className="mt-1 bg-amber-950 text-amber-200 border border-amber-400 px-2 py-0.5 rounded-full text-[10px] font-black shadow whitespace-nowrap">
                Carlos Motoboy ({progressPercent}%)
              </div>
            </div>

            {/* Floating Quick Legend */}
            <div className="absolute bottom-3 left-3 bg-stone-950/90 border border-stone-800 px-3 py-1.5 rounded-xl text-[11px] text-stone-300 flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Origem: Av. Ver. Jorge Venâncio
              </span>
              <span className="hidden sm:flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Destino: {currentOrder.address.neighborhood}
              </span>
            </div>

          </div>

          {/* Delivery & Motoboy Profile Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Motoboy Card */}
            <div className="bg-stone-950/70 border border-stone-800 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-stone-800 border border-stone-700 flex items-center justify-center text-amber-400">
                  <Bike className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-stone-100">{currentOrder.deliveryBoy?.name}</h4>
                  <p className="text-xs text-stone-400">{currentOrder.deliveryBoy?.vehicle} • Placa: {currentOrder.deliveryBoy?.plate}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${restaurant.phone}`}
                  className="w-9 h-9 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
                  title="Ligar para o restaurante"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                </a>
                <a
                  href={generateOrderWhatsAppUrl(currentOrder)}
                  target="_blank"
                  rel="noreferrer"
                  className="w-9 h-9 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white flex items-center justify-center transition-colors"
                  title="Abrir WhatsApp sobre este pedido"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Delivery Address & Status */}
            <div className="bg-stone-950/70 border border-stone-800 rounded-2xl p-4 space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold text-amber-300">Endereço de Entrega:</span>
                <span className="text-[11px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-medium">
                  {currentOrder.address.deliveryType === 'delivery' ? 'Em Domicílio' : 'Retirada'}
                </span>
              </div>
              <p className="text-stone-200">
                {currentOrder.address.street}, Nº {currentOrder.address.number} - {currentOrder.address.neighborhood}
              </p>
              {currentOrder.address.referencePoint && (
                <p className="text-stone-400">Ref: {currentOrder.address.referencePoint}</p>
              )}
            </div>

          </div>

          {/* Quentinha Items Breakdown in the Order */}
          <div className="bg-stone-950/60 border border-stone-800/80 rounded-2xl p-4 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-amber-200 font-serif flex items-center gap-2">
              <Utensils className="w-4 h-4 text-amber-400" />
              <span>Itens da sua Quentinha (#{currentOrder.orderNumber})</span>
            </h4>

            <div className="space-y-2 text-xs">
              {currentOrder.items.map((it, idx) => (
                <div key={idx} className="bg-stone-900/80 p-3 rounded-xl border border-stone-800 flex justify-between items-start">
                  <div>
                    {it.type === 'marmita' && it.marmita ? (
                      <div className="space-y-1">
                        <div className="font-bold text-amber-300">{it.quantity}x {it.marmita.size.name}</div>
                        <div className="text-[11px] text-stone-300 space-y-0.5">
                          <div><strong>Carnes:</strong> {it.marmita.selectedMeats.length > 0 ? it.marmita.selectedMeats.join(', ') : 'Nenhuma'}</div>
                          <div>
                            <strong>Arroz:</strong> {it.marmita.selectedRice.length > 0 ? it.marmita.selectedRice.join(', ') : 'Sem arroz'} •{' '}
                            <strong>Feijão:</strong> {it.marmita.selectedBeans.length > 0 ? it.marmita.selectedBeans.join(', ') : 'Sem feijão'}
                          </div>
                          {it.marmita.selectedSides.length > 0 && (
                            <div><strong>Acompanhamentos:</strong> {it.marmita.selectedSides.join(', ')}</div>
                          )}
                          {it.marmita.notes && <div className="italic text-stone-400">Obs: {it.marmita.notes}</div>}
                        </div>
                      </div>
                    ) : (
                      <div className="font-bold text-stone-200">{it.quantity}x {it.singleItem?.name}</div>
                    )}
                  </div>
                  <div className="font-bold text-amber-400">R$ {it.totalPrice.toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-stone-800 flex justify-between items-center text-xs">
              <span className="text-stone-400">Forma de pagamento: <strong className="text-stone-200 uppercase">{currentOrder.payment.type}</strong></span>
              <span className="text-sm font-black text-amber-400">Total: R$ {currentOrder.total.toFixed(2)}</span>
            </div>
          </div>

          {/* Interactive Simulation Controls (For easy testing and kitchen action) */}
          <div className="bg-stone-900/50 border border-stone-800 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-stone-400">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Controle de Simulação:</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="tracking-advance-step-btn"
                onClick={handleAdvanceStep}
                disabled={status === 'entregue'}
                className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors ${
                  status !== 'entregue'
                    ? 'bg-amber-600 hover:bg-amber-500 text-stone-950 cursor-pointer'
                    : 'bg-stone-800 text-stone-500 cursor-not-allowed'
                }`}
              >
                <Play className="w-3.5 h-3.5" />
                <span>Avançar Etapa ({status})</span>
              </button>

              <button
                id="tracking-reset-step-btn"
                onClick={handleResetOrder}
                className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 font-semibold flex items-center gap-1 transition-colors"
                title="Reiniciar rastreamento"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reiniciar</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
