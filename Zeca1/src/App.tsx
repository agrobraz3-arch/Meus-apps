import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { MenuDisplay } from './components/MenuDisplay';
import { MarmitaBuilderModal } from './components/MarmitaBuilderModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { PixPaymentModal } from './components/PixPaymentModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { OrderTrackingView } from './components/OrderTrackingView';
import { AdminDailyMenuPanel } from './components/AdminDailyMenuPanel';
import { AdminOrdersKDS } from './components/AdminOrdersKDS';
import { MarmitaSize } from './types';
import { ShoppingBag, Utensils, Bike, MapPin, Phone, Heart, Lock, ShieldCheck } from 'lucide-react';

function AppContent() {
  const { 
    activeTab, 
    setActiveTab, 
    cartCount, 
    cartSubtotal, 
    restaurant, 
    orders, 
    activeOrder,
    isAdminAuthenticated,
    isAdminLoginModalOpen,
    setIsAdminLoginModalOpen,
    pendingAdminTab,
  } = useApp();

  // Modals state
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [builderInitialSize, setBuilderInitialSize] = useState<MarmitaSize | undefined>();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isPixModalOpen, setIsPixModalOpen] = useState(false);
  const [pixModalData, setPixModalData] = useState<{ total: number; orderNumber: number }>({
    total: 0,
    orderNumber: 101,
  });

  const handleOpenBuilder = (size?: MarmitaSize) => {
    setBuilderInitialSize(size);
    setIsBuilderOpen(true);
  };

  const handleOrderCompleted = (orderId: string, isPix: boolean) => {
    const createdOrder = orders.find(o => o.id === orderId) || activeOrder;
    if (isPix && createdOrder) {
      setPixModalData({
        total: createdOrder.total,
        orderNumber: createdOrder.orderNumber,
      });
      setIsPixModalOpen(true);
    }
    setActiveTab('tracking');
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500 selection:text-stone-950">
      
      {/* App Header */}
      <Header onOpenCart={() => setIsCartOpen(true)} />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:py-8">
        {activeTab === 'menu' && (
          <MenuDisplay onOpenBuilder={handleOpenBuilder} />
        )}

        {activeTab === 'tracking' && (
          <OrderTrackingView />
        )}

        {activeTab === 'admin_menu' && (
          <AdminDailyMenuPanel />
        )}

        {activeTab === 'admin_orders' && (
          <AdminOrdersKDS />
        )}
      </main>

      {/* Mobile Sticky Floating Cart Bar (Visible when cart has items and not in cart/tracking) */}
      {cartCount > 0 && activeTab === 'menu' && (
        <div className="fixed bottom-4 left-4 right-4 z-40 md:hidden">
          <button
            id="mobile-floating-cart-btn"
            onClick={() => setIsCartOpen(true)}
            className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-stone-950 font-black p-3.5 rounded-2xl shadow-2xl shadow-amber-950/80 flex items-center justify-between border border-amber-300 active:scale-98 transition-all"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-stone-950 text-amber-400 flex items-center justify-center font-bold text-xs">
                {cartCount}
              </div>
              <div className="text-left text-xs leading-tight">
                <span className="text-[10px] uppercase font-bold text-stone-800 block">Sua Sacola</span>
                <span className="font-extrabold text-stone-950">Ver Pedido de Quentinhas</span>
              </div>
            </div>

            <div className="text-right font-black text-sm text-stone-950">
              R$ {cartSubtotal.toFixed(2)}
            </div>
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-stone-900 border-t border-amber-800/30 py-8 px-4 text-stone-400 text-xs mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <div className="font-bold text-amber-200 text-sm font-serif">{restaurant.name}</div>
            <p className="text-stone-400 mt-0.5">
              {restaurant.address} • {restaurant.city} • Disk Marmita: {restaurant.phone}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 text-[11px] text-stone-400">
            <div className="flex items-center gap-2">
              <span>Feito com carinho para comida caseira de verdade</span>
              <span>•</span>
              <span className="text-amber-400 font-semibold">Desde {restaurant.since}</span>
            </div>

            <div className="border-t sm:border-t-0 sm:border-l border-stone-800 pt-2 sm:pt-0 sm:pl-3">
              {isAdminAuthenticated ? (
                <button
                  onClick={() => setActiveTab('admin_menu')}
                  className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold transition-colors"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Painel do Dono Ativo</span>
                </button>
              ) : (
                <button
                  id="footer-admin-login-btn"
                  onClick={() => setIsAdminLoginModalOpen(true)}
                  className="text-stone-500 hover:text-amber-400 flex items-center gap-1 transition-colors"
                >
                  <Lock className="w-3 h-3" />
                  <span>Acesso do Dono / Cozinha</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <MarmitaBuilderModal
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        initialSize={builderInitialSize}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        onOpenBuilder={() => handleOpenBuilder()}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderCompleted={handleOrderCompleted}
      />

      <PixPaymentModal
        isOpen={isPixModalOpen}
        total={pixModalData.total}
        orderNumber={pixModalData.orderNumber}
        onPaymentConfirmed={() => setIsPixModalOpen(false)}
        onClose={() => setIsPixModalOpen(false)}
      />

      <AdminLoginModal
        isOpen={isAdminLoginModalOpen}
        onClose={() => setIsAdminLoginModalOpen(false)}
        onSuccessRedirect={pendingAdminTab}
      />

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
