import React from 'react';
import { useApp } from '../context/AppContext';
import { ShoppingBag, Utensils, MapPin, Phone, ChefHat, Clock, Sparkles, SlidersHorizontal, Bike, Lock, LogOut, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  onOpenCart: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenCart }) => {
  const { 
    restaurant, 
    cartCount, 
    cartSubtotal, 
    activeTab, 
    setActiveTab, 
    orders, 
    activeOrder,
    isAdminAuthenticated,
    setIsAdminLoginModalOpen,
    logoutAdmin
  } = useApp();

  const activeOrdersCount = orders.filter(o => o.status !== 'entregue' && o.status !== 'cancelado').length;

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 text-white shadow-xl border-b border-amber-800/40">
      {/* Top micro banner */}
      <div className="bg-amber-950/90 px-4 py-1 text-xs text-amber-200 flex flex-wrap justify-between items-center border-b border-amber-700/30">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-medium">
            {restaurant.isOpen ? 'Restaurante Aberto para Pedidos' : 'Fechado no momento'}
          </span>
          <span className="hidden sm:inline text-amber-300/70">• Horário: {restaurant.openingHours}</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="hidden md:flex items-center gap-1">
            <MapPin className="w-3 h-3 text-amber-400" />
            {restaurant.city}
          </span>
          <a 
            href={`https://wa.me/${restaurant.whatsapp}`} 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Phone className="w-3 h-3 text-emerald-400" />
            <span className="hidden sm:inline">Disk Marmita:</span> {restaurant.phone}
          </a>

          {/* Discreet Admin Login / Logout Trigger */}
          {isAdminAuthenticated ? (
            <button
              id="admin-logout-top-btn"
              onClick={logoutAdmin}
              className="bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800/50 px-2 py-0.5 rounded-lg flex items-center gap-1 text-[11px] font-bold transition-colors"
              title="Sair do modo administrador"
            >
              <LogOut className="w-3 h-3" />
              <span>Sair do Painel</span>
            </button>
          ) : (
            <button
              id="admin-login-top-btn"
              onClick={() => setIsAdminLoginModalOpen(true)}
              className="bg-amber-900/40 hover:bg-amber-800/60 text-amber-300 border border-amber-700/40 px-2 py-0.5 rounded-lg flex items-center gap-1 text-[11px] font-medium transition-colors"
              title="Acesso exclusivo para o Dono e Cozinha"
            >
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Área do Dono</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand identity */}
        <div 
          onClick={() => setActiveTab('menu')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-700 p-0.5 shadow-md shadow-amber-900/50 group-hover:scale-105 transition-transform flex items-center justify-center">
            <div className="w-full h-full bg-amber-950 rounded-[10px] flex flex-col items-center justify-center border border-amber-400/40">
              <Utensils className="w-5 h-5 text-amber-400" />
              <span className="text-[9px] font-black tracking-widest text-amber-300 uppercase">ZECA</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-amber-100 font-serif">
                {restaurant.name}
              </h1>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-500/40">
                DESDE {restaurant.since}
              </span>
            </div>
            <p className="text-xs text-amber-300/80 font-medium">
              {restaurant.slogan} • <span className="text-amber-200">Av. Ver. Jorge Venâncio, 899A</span>
            </p>
          </div>
        </div>

        {/* Navigation Modes / Tabs */}
        <div className="flex items-center gap-1 sm:gap-1.5 bg-stone-950/70 p-1 rounded-xl border border-amber-800/30 overflow-x-auto max-w-full">
          
          {/* 1. Cliente: Cardápio */}
          <button
            id="tab-cardapio-btn"
            onClick={() => setActiveTab('menu')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
              activeTab === 'menu'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-900/40'
                : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
            }`}
          >
            <Utensils className="w-3.5 h-3.5 text-amber-300" />
            <span>Cardápio do Dia</span>
          </button>

          {/* 2. Cliente: Rastreamento */}
          <button
            id="tab-rastreamento-btn"
            onClick={() => setActiveTab('tracking')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative whitespace-nowrap ${
              activeTab === 'tracking'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-900/40'
                : 'text-stone-300 hover:text-white hover:bg-stone-800/60'
            }`}
          >
            <Bike className="w-3.5 h-3.5 text-amber-300" />
            <span>Rastrear Pedido</span>
            {activeOrdersCount > 0 && (
              <span className="bg-emerald-500 text-stone-950 text-[10px] font-black px-1.5 py-0.2 rounded-full animate-bounce">
                {activeOrdersCount}
              </span>
            )}
          </button>

          {/* 3 & 4. Admin Only Tabs (Protected / Only visible when authenticated) */}
          {isAdminAuthenticated && (
            <>
              <div className="h-4 w-px bg-stone-700 mx-1 hidden sm:block"></div>
              
              <button
                id="tab-admin-menu-btn"
                onClick={() => setActiveTab('admin_menu')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  activeTab === 'admin_menu'
                    ? 'bg-amber-700/90 text-white shadow-md ring-1 ring-amber-400'
                    : 'text-amber-300/80 hover:text-white hover:bg-stone-800/60'
                }`}
                title="Cadastrar e gerenciar pratos do dia e PIX"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                <span>Gestão Cardápio / PIX</span>
              </button>

              <button
                id="tab-admin-orders-btn"
                onClick={() => setActiveTab('admin_orders')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all relative whitespace-nowrap ${
                  activeTab === 'admin_orders'
                    ? 'bg-amber-700/90 text-white shadow-md ring-1 ring-amber-400'
                    : 'text-amber-300/80 hover:text-white hover:bg-stone-800/60'
                }`}
                title="Painel de Pedidos da Cozinha"
              >
                <ChefHat className="w-3.5 h-3.5 text-amber-400" />
                <span>Cozinha / KDS</span>
                {orders.length > 0 && (
                  <span className="bg-amber-400 text-stone-950 text-[10px] font-black px-1.5 py-0.2 rounded-full">
                    {orders.length}
                  </span>
                )}
              </button>
            </>
          )}

        </div>

        {/* Cart Trigger */}
        <div className="flex items-center gap-2">
          <button
            id="open-cart-button"
            onClick={onOpenCart}
            className="flex items-center gap-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-stone-950 font-bold px-4 py-2 rounded-xl shadow-lg shadow-amber-950/50 hover:shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-stone-950" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow">
                  {cartCount}
                </span>
              )}
            </div>
            <div className="text-left leading-tight">
              <div className="text-[10px] font-black uppercase text-amber-950/80">Sua Marmita</div>
              <div className="text-sm font-black text-stone-950">
                R$ {cartSubtotal.toFixed(2)}
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

