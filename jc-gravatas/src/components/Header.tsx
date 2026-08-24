import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Sparkles, 
  HelpCircle, 
  BookOpen, 
  MessageCircle, 
  SlidersHorizontal, 
  Menu, 
  X, 
  ShieldCheck, 
  Truck, 
  Layers,
  User
} from 'lucide-react';
import { CategoryId, CartItem, StoreSettings, CustomerUser } from '../types';
import { formatCurrency } from '../utils';

interface HeaderProps {
  selectedCategory: CategoryId;
  onSelectCategory: (category: CategoryId) => void;
  cart: CartItem[];
  onOpenCart: () => void;
  onOpenSuitAdvisor: () => void;
  onOpenKnotTutorials: () => void;
  onOpenSupport: () => void;
  onOpenAdmin: () => void;
  currentUser: CustomerUser | null;
  onOpenAccount: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  settings: StoreSettings;
}

export const Header: React.FC<HeaderProps> = ({
  selectedCategory,
  onSelectCategory,
  cart,
  onOpenCart,
  onOpenSuitAdvisor,
  onOpenKnotTutorials,
  onOpenSupport,
  onOpenAdmin,
  currentUser,
  onOpenAccount,
  searchQuery,
  onSearchChange,
  settings,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const categories: { id: CategoryId; label: string; badge?: string }[] = [
    { id: 'all', label: 'Coleção Completa' },
    { id: 'casamento', label: 'Casamentos & Padrinhos', badge: 'Em Alta' },
    { id: 'kits', label: 'Kits com Lenço & Abotoadura' },
    { id: 'slim', label: 'Gravatas Slim' },
    { id: 'seda-pura', label: 'Seda 100% Pura' },
    { id: 'classica', label: 'Clássicas & Tradicionais' },
    { id: 'borboleta', label: 'Gravatas Borboleta' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0d121c]/95 backdrop-blur-md border-b border-amber-500/20 shadow-xl transition-all">
      {/* Top Notification Bar */}
      <div className="bg-gradient-to-r from-amber-950/80 via-amber-900/90 to-amber-950/80 text-amber-200 text-xs py-1.5 px-4 border-b border-amber-500/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[11px] font-semibold border border-amber-400/30">
              <Truck className="w-3 h-3 text-amber-400" /> FRETE GRÁTIS
            </span>
            <span className="hidden sm:inline text-amber-100">
              Para todo o Brasil nas compras a partir de {formatCurrency(settings.freeShippingThreshold)}
            </span>
            <span className="text-amber-300 font-medium">| 5% de Desconto no PIX</span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-[11px]">
            <button
              onClick={onOpenAccount}
              className="text-amber-200 hover:text-white font-semibold flex items-center gap-1 cursor-pointer transition-colors"
            >
              <User className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentUser ? `Olá, ${currentUser.name.split(' ')[0]}` : 'Entrar / Meus Pedidos'}</span>
            </button>

            <button
              onClick={onOpenAdmin}
              className="bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 px-2.5 py-0.5 rounded-full border border-amber-500/40 font-bold cursor-pointer transition-all flex items-center gap-1"
              title="Acessar o Painel do Dono para editar produtos, preços, fotos e gerenciar pedidos"
            >
              <span>👑 Painel do Dono</span>
            </button>
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Olá! Gostaria de atendimento para escolher minhas gravatas.')}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Atendimento VIP</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/60"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo & Brand Identity */}
          <div 
            onClick={() => {
              onSelectCategory('all');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="cursor-pointer flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 via-amber-600 to-amber-800 flex items-center justify-center shadow-lg shadow-amber-900/30 border border-amber-300/40 group-hover:scale-105 transition-transform">
              <span className="text-black font-black text-xl font-brand">JC</span>
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-bold font-brand tracking-widest text-slate-100 block leading-tight">
                JC GRAVATAS
              </span>
              <span className="text-[10px] tracking-[0.25em] text-amber-400 font-medium uppercase block">
                Gravataria & Alfaiataria
              </span>
            </div>
          </div>

          {/* Search Box (Desktop) */}
          <div className="hidden lg:flex flex-1 max-w-md mx-6 relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar gravata, cor, tecido ou ocasião (ex: Marsala, Seda, Padrinho)..."
              className="w-full bg-slate-900/90 text-sm text-slate-200 pl-10 pr-4 py-2.5 rounded-full border border-slate-700/80 focus:outline-none focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/50 transition-all placeholder:text-slate-500"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Quick Action Tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Customer Account Button */}
            <button
              onClick={onOpenAccount}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                currentUser
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25'
                  : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
              }`}
              title="Acesse sua conta para ver pedidos e gerenciar seu endereço de entrega"
            >
              <User className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">
                {currentUser ? currentUser.name.split(' ')[0] : 'Entrar / Cadastro'}
              </span>
            </button>

            {/* Suit & Look Matcher button */}
            <button
              onClick={onOpenSuitAdvisor}
              className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-slate-800 to-slate-900 hover:from-amber-950/40 hover:to-slate-800 text-amber-300 hover:text-amber-200 text-xs font-semibold px-3 py-2 rounded-lg border border-amber-500/30 transition-all hover:border-amber-500/60 shadow-sm"
              title="Simule a combinação do seu terno e camisa com nossas gravatas"
            >
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>Simulador</span>
            </button>

            {/* Knot Guide button */}
            <button
              onClick={onOpenKnotTutorials}
              className="hidden md:flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs font-medium px-3 py-2 rounded-lg border border-slate-700 transition-colors"
              title="Aprenda a fazer 5 nós de gravata passo a passo"
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-300" />
              <span>Guia de Nós</span>
            </button>

            {/* Support button */}
            <button
              onClick={onOpenSupport}
              className="p-2 text-slate-300 hover:text-amber-300 rounded-lg hover:bg-slate-800 transition-colors"
              title="Dúvidas Frequentes & Suporte"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            {/* Cart Button with Count Badge */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-3.5 py-2.5 rounded-xl shadow-lg shadow-amber-950/40 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline text-xs font-extrabold uppercase tracking-wide">
                Sacola
              </span>
              {totalCartItems > 0 && (
                <span className="w-5 h-5 rounded-full bg-slate-950 text-amber-300 text-[11px] font-black flex items-center justify-center border border-amber-400">
                  {totalCartItems}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden pb-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar gravatas, kits, tecidos ou cores..."
              className="w-full bg-slate-900 text-sm text-slate-200 pl-10 pr-4 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* Categories Navigation Bar (Desktop) */}
        <nav className="hidden md:flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-800/80 no-scrollbar">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`relative px-3.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-inner'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {cat.label}
                {cat.badge && (
                  <span className="text-[9px] font-bold bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded-full uppercase tracking-tighter">
                    {cat.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0a0e17] border-b border-slate-800 px-4 py-4 space-y-3">
          <div className="space-y-1">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider px-2 mb-2">Categorias</p>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500/20 text-amber-300 font-bold'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <span>{cat.label}</span>
                {cat.badge && (
                  <span className="text-[10px] bg-amber-500 text-black px-1.5 py-0.5 rounded font-bold">
                    {cat.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-800 space-y-2">
            <button
              onClick={() => {
                onOpenAccount();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 bg-amber-500/20 text-amber-300 px-3 py-2.5 rounded-lg text-sm font-semibold border border-amber-500/40"
            >
              <User className="w-4 h-4 text-amber-400" />
              <span>{currentUser ? `Minha Conta (${currentUser.name})` : 'Entrar / Criar Conta & Pedidos'}</span>
            </button>

            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-300 px-3 py-2.5 rounded-lg text-sm font-bold border border-amber-500/50"
            >
              <span>👑 Painel do Dono (Gerenciar Produtos & Pedidos)</span>
            </button>

            <button
              onClick={() => {
                onOpenSuitAdvisor();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 bg-slate-800/80 text-amber-300 px-3 py-2.5 rounded-lg text-sm font-semibold border border-amber-500/30"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Simulador de Look (Terno & Camisa)</span>
            </button>

            <button
              onClick={() => {
                onOpenKnotTutorials();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 bg-slate-800 text-slate-200 px-3 py-2.5 rounded-lg text-sm font-medium"
            >
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span>Como Fazer Nós de Gravata</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
