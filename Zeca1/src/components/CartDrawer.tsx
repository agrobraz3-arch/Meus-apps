import React from 'react';
import { useApp } from '../context/AppContext';
import { NEIGHBORHOODS_DELIVERY } from '../data/initialMenu';
import { X, Trash2, Plus, Minus, ShoppingBag, Utensils, ArrowRight, MapPin, Sparkles } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
  onOpenBuilder: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout,
  onOpenBuilder
}) => {
  const { cart, removeFromCart, updateCartQuantity, cartSubtotal, clearCart, restaurant } = useApp();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/80 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-md bg-stone-900 border-l border-amber-800/40 h-full flex flex-col shadow-2xl text-white">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 border-b border-amber-800/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-600/30 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-amber-100 font-serif">Sua Sacola de Marmitas</h3>
              <p className="text-xs text-amber-300/70">{cart.length} {cart.length === 1 ? 'item adicionado' : 'itens adicionados'}</p>
            </div>
          </div>

          <button
            id="close-cart-drawer-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-stone-500">
                <Utensils className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-stone-300 text-base">Sua sacola está vazia</h4>
                <p className="text-xs text-stone-500 mt-1 max-w-xs">
                  Monte sua quentinha personalizada com carnes, arroz, feijão e acompanhamentos do dia.
                </p>
              </div>
              <button
                id="cart-empty-monte-sua-marmita-btn"
                onClick={() => {
                  onClose();
                  onOpenBuilder();
                }}
                className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow"
              >
                Montar Quentinha Agora
              </button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center text-xs text-stone-400 pb-1">
                <span>Itens selecionados</span>
                <button
                  id="clear-cart-btn"
                  onClick={clearCart}
                  className="text-stone-400 hover:text-red-400 transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Limpar</span>
                </button>
              </div>

              {cart.map((item, idx) => (
                <div
                  key={item.id}
                  id={`cart-item-${item.id}`}
                  className="bg-stone-800/60 border border-stone-700/60 rounded-xl p-3.5 space-y-2.5"
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      {item.type === 'marmita' && item.marmita ? (
                        <div>
                          <div className="flex items-center gap-1.5 font-bold text-amber-200 text-sm">
                            <span>🍱 {item.marmita.size.name}</span>
                          </div>
                          <div className="text-[11px] text-stone-300 mt-1 space-y-0.5 leading-tight">
                            <div>
                              <strong className="text-amber-400/90">Arroz:</strong>{' '}
                              {item.marmita.selectedRice.length > 0 ? item.marmita.selectedRice.join(', ') : <span className="text-stone-400 italic">Sem arroz</span>}
                            </div>
                            <div>
                              <strong className="text-amber-400/90">Feijão:</strong>{' '}
                              {item.marmita.selectedBeans.length > 0 ? item.marmita.selectedBeans.join(', ') : <span className="text-amber-400/80 italic font-semibold">Sem feijão</span>}
                            </div>
                            <div>
                              <strong className="text-amber-400/90">Carnes:</strong>{' '}
                              {item.marmita.selectedMeats.length > 0 ? item.marmita.selectedMeats.join(', ') : <span className="text-stone-400">Nenhuma</span>}
                            </div>
                            {item.marmita.selectedSides.length > 0 && (
                              <div>
                                <strong className="text-amber-400/90">Acomp:</strong>{' '}
                                {item.marmita.selectedSides.join(', ')}
                              </div>
                            )}
                            {item.marmita.notes && (
                              <div className="text-stone-400 italic"><strong className="text-amber-400/90">Obs:</strong> {item.marmita.notes}</div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="font-bold text-stone-100 text-sm">{item.singleItem?.name}</div>
                          <div className="text-[11px] text-stone-400">{item.singleItem?.category}</div>
                        </div>
                      )}
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-sm font-black text-amber-400">
                        R$ {item.totalPrice.toFixed(2)}
                      </div>
                      <div className="text-[10px] text-stone-400">
                        R$ {item.unitPrice.toFixed(2)} un
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Actions */}
                  <div className="flex justify-between items-center pt-2 border-t border-stone-700/50">
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Remover</span>
                    </button>

                    <div className="flex items-center gap-2 bg-stone-900 px-2 py-1 rounded-lg border border-stone-700">
                      <button
                        onClick={() => updateCartQuantity(item.id, -1)}
                        className="w-5 h-5 rounded flex items-center justify-center text-stone-300 hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-amber-200 px-1">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.id, 1)}
                        className="w-5 h-5 rounded flex items-center justify-center text-stone-300 hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <button
                id="cart-add-more-marmita-btn"
                onClick={() => {
                  onClose();
                  onOpenBuilder();
                }}
                className="w-full py-2 px-3 rounded-xl border border-dashed border-amber-700/60 hover:border-amber-500 text-amber-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Montar outra Marmita</span>
              </button>
            </>
          )}
        </div>

        {/* Footer Summary & Checkout CTA */}
        {cart.length > 0 && (
          <div className="p-4 bg-stone-950 border-t border-amber-800/40 space-y-3">
            <div className="space-y-1.5 text-xs text-stone-300">
              <div className="flex justify-between">
                <span>Subtotal dos itens:</span>
                <span className="font-bold text-stone-100">R$ {cartSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Taxa de entrega:</span>
                <span>Calculada no checkout</span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-800 flex justify-between items-center">
              <span className="text-sm font-bold text-amber-100">Total estimado:</span>
              <span className="text-xl font-black text-amber-400">R$ {cartSubtotal.toFixed(2)}</span>
            </div>

            <button
              id="proceed-to-checkout-btn"
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-950/60 active:scale-98 transition-all cursor-pointer"
            >
              <span>Continuar para Pagamento e Entrega</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
