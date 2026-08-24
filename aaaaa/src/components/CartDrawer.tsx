import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Truck, 
  Tag, 
  ShieldCheck, 
  ArrowRight,
  MessageCircle,
  Sparkles,
  Gift
} from 'lucide-react';
import { CartItem, StoreSettings } from '../types';
import { formatCurrency, calculateShipping } from '../utils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: (appliedCoupon: string, discount: number, shippingFee: number) => void;
  settings: StoreSettings;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  settings,
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponDiscountPercent, setCouponDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [cep, setCep] = useState('');
  const [shippingCalculated, setShippingCalculated] = useState(false);

  if (!isOpen) return null;

  const subtotal = cart.reduce(
    (sum, item) => sum + (item.product.price * item.quantity) + (item.giftBox ? 19.90 * item.quantity : 0),
    0
  );

  // Free shipping progress
  const freeShippingNeeded = Math.max(0, settings.freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / settings.freeShippingThreshold) * 100);

  // Bulk quantity discounts for weddings
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  let bulkDiscountPercent = 0;
  if (totalItemsCount >= 12) bulkDiscountPercent = 20;
  else if (totalItemsCount >= 8) bulkDiscountPercent = 15;
  else if (totalItemsCount >= 4) bulkDiscountPercent = 10;

  // Best discount between bulk and coupon
  const activeDiscountPercent = Math.max(couponDiscountPercent, bulkDiscountPercent);
  const discountAmount = subtotal * (activeDiscountPercent / 100);

  // Shipping
  const shippingInfo = calculateShipping(cep, subtotal, settings.freeShippingThreshold);
  const shippingFee = shippingInfo.price;
  const grandTotal = Math.max(0, subtotal - discountAmount + (shippingCalculated ? shippingFee : 0));

  const handleApplyCoupon = () => {
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (code === 'PRIMEIRACOMPRA') {
      setAppliedCoupon('PRIMEIRACOMPRA');
      setCouponDiscountPercent(10);
    } else if (code === 'PADRINHOVIP' || code === 'NOBRE10') {
      setAppliedCoupon(code);
      setCouponDiscountPercent(15);
    } else if (code === 'CASAMENTO20') {
      setAppliedCoupon('CASAMENTO20');
      setCouponDiscountPercent(20);
    } else {
      setCouponError('Cupom inválido ou expirado. Tente PRIMEIRACOMPRA ou PADRINHOVIP.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0f1521] border-l border-slate-800 shadow-2xl flex flex-col justify-between">
          
          {/* Top Bar */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white font-serif-luxury">
                Sua Sacola de Compras
              </h2>
              <span className="text-xs bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded-full">
                {totalItemsCount}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-3 text-xs">
            {freeShippingNeeded > 0 ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-amber-200">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Falta <strong>{formatCurrency(freeShippingNeeded)}</strong> para Frete Grátis</span>
                  </span>
                  <span className="font-bold text-amber-400">{Math.round(freeShippingProgress)}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500 rounded-full"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <Truck className="w-4 h-4 text-emerald-400" />
                <span>Parabéns! Você ganhou <strong>FRETE GRÁTIS EXPRESS</strong> para todo o Brasil!</span>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-base font-semibold text-slate-300">Sua sacola está vazia</p>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Explore nosso catálogo de gravatas nobres, kits de padrinhos e seda pura.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="bg-amber-500 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-amber-400 transition-colors cursor-pointer"
                >
                  Ver Catálogo Completo
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-3 p-3 bg-slate-900/80 border border-slate-800 rounded-xl hover:border-slate-700 transition-all"
                  >
                    {/* Item Thumbnail */}
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg bg-slate-950 shrink-0 border border-slate-800"
                      referrerPolicy="no-referrer"
                    />

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-semibold text-white truncate max-w-[180px]">
                            {item.product.name}
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            {item.product.width} • {item.product.colorLabel}
                          </p>
                          {item.giftBox && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-amber-300 bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-500/30 mt-0.5">
                              <Gift className="w-2.5 h-2.5" /> + Caixa de Presente
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.product.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                          title="Remover produto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-slate-700 bg-slate-950 rounded-lg">
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 text-slate-400 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-bold text-slate-200">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 text-slate-400 hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-bold text-amber-300 font-serif-luxury">
                          {formatCurrency(
                            (item.product.price + (item.giftBox ? 19.90 : 0)) * item.quantity
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Coupon and Shipping Section (when cart has items) */}
            {cart.length > 0 && (
              <div className="pt-2 space-y-3">
                {/* Coupon input */}
                <div className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Cupom (ex: PRIMEIRACOMPRA)"
                      className="flex-1 bg-slate-900 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500 uppercase placeholder:normal-case"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-700 transition-colors"
                    >
                      Aplicar
                    </button>
                  </div>
                  {appliedCoupon && (
                    <p className="text-[11px] text-emerald-400 font-medium">
                      ✓ Cupom <strong>{appliedCoupon}</strong> aplicado ({activeDiscountPercent}% OFF)!
                    </p>
                  )}
                  {couponError && (
                    <p className="text-[11px] text-rose-400">{couponError}</p>
                  )}
                </div>

                {/* Freight calculation */}
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-slate-400" />
                      <span>Calcular Frete e Prazo (CEP)</span>
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={9}
                      value={cep}
                      onChange={(e) => {
                        setCep(e.target.value);
                        setShippingCalculated(true);
                      }}
                      placeholder="00000-000"
                      className="flex-1 bg-slate-950 text-xs text-slate-200 px-3 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  {shippingCalculated && (
                    <div className="text-[11px] text-slate-300 flex justify-between items-center pt-1 border-t border-slate-800">
                      <span>{shippingInfo.type} ({shippingInfo.days} dias úteis)</span>
                      <strong className="text-amber-400">
                        {shippingInfo.price === 0 ? 'GRÁTIS' : formatCurrency(shippingInfo.price)}
                      </strong>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer Summary & Checkout */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-slate-800 bg-slate-900/90 space-y-3">
              <div className="space-y-1.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Desconto ({activeDiscountPercent}%)</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Frete</span>
                  <span>
                    {!shippingCalculated
                      ? 'A calcular no checkout'
                      : shippingFee === 0
                      ? 'GRÁTIS'
                      : formatCurrency(shippingFee)}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-white">Total Estimado</span>
                  <div className="text-right">
                    <span className="text-lg font-black text-white font-serif-luxury">
                      {formatCurrency(grandTotal)}
                    </span>
                    <p className="text-[10px] text-emerald-400 font-medium">
                      ou {formatCurrency(grandTotal * 0.95)} no PIX com 5% OFF
                    </p>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout(appliedCoupon, discountAmount, shippingCalculated ? shippingFee : 0);
                }}
                className="w-full py-3.5 px-4 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                <span>Avançar para Pagamento Seguro</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-4 text-[10px] text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Ambiente Criptografado
                </span>
                <span>•</span>
                <span>PIX, Cartão em 12x ou WhatsApp</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
