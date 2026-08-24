import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ShoppingBag, 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  MessageCircle, 
  Check, 
  Plus, 
  Minus, 
  PackageCheck,
  ChevronRight,
  Info,
  Gift
} from 'lucide-react';
import { Product, StoreSettings } from '../types';
import { formatCurrency } from '../utils';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, giftBox: boolean) => void;
  onDirectCheckout: (product: Product, quantity: number, giftBox: boolean) => void;
  onOpenAdvisor: () => void;
  settings: StoreSettings;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onDirectCheckout,
  onOpenAdvisor,
  settings,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [giftBox, setGiftBox] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  if (!product) return null;

  const pixPrice = product.price * 0.95;
  const giftBoxPrice = giftBox ? 19.90 : 0;
  const currentTotal = (product.price * quantity) + giftBoxPrice;

  // Bulk discount calculation
  let bulkDiscountPercent = 0;
  if (quantity >= 12) bulkDiscountPercent = 20;
  else if (quantity >= 8) bulkDiscountPercent = 15;
  else if (quantity >= 4) bulkDiscountPercent = 10;

  const discountedTotal = currentTotal * (1 - bulkDiscountPercent / 100);

  const handleAdd = () => {
    onAddToCart(product, quantity, giftBox);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  const handleBuyNow = () => {
    onDirectCheckout(product, quantity, giftBox);
  };

  const whatsappInquiryUrl = `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    `Olá! Tenho interesse na gravata: *${product.name}* (Ref: ${product.id}).\nGostaria de saber mais sobre cores e prazos para padrinhos!`
  )}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-[#0f1521] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Close Bar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Body */}
        <div className="overflow-y-auto p-4 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Gallery Column */}
            <div className="md:col-span-6 space-y-4">
              {/* Main Photo */}
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-inner">
                <img
                  src={product.images?.[selectedImageIndex] || product.images?.[0] || 'https://images.unsplash.com/photo-1589756823695-278bc923f962?auto=format&fit=crop&w=800&q=80'}
                  alt={product.name || 'Gravata'}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                
                {product.isWeddingFav && (
                  <span className="absolute top-3 left-3 bg-rose-950/90 text-rose-200 border border-rose-500/50 text-xs font-bold px-2.5 py-1 rounded-md backdrop-blur-sm">
                    Recomendada para Padrinhos
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {Array.isArray(product.images) && product.images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                        selectedImageIndex === idx
                          ? 'border-amber-400 scale-105 shadow-md shadow-amber-500/20'
                          : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Miniatura ${idx + 1}`}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Outfit Matcher Shortcut */}
              <div className="bg-slate-900/80 border border-amber-500/20 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-slate-200">Dúvida se combina com seu terno?</p>
                    <p className="text-[11px] text-slate-400">Consulte o nosso simulador de cores</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenAdvisor();
                  }}
                  className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 shrink-0"
                >
                  <span>Simular</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Product Details Column */}
            <div className="md:col-span-6 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                
                {/* Category & Ratings */}
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-amber-400 font-bold">
                    {product.category === 'kits' ? 'Kit Completo' : (product.fabric || 'Seda Jacquard')}
                  </span>
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-semibold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{(product.rating || 5.0).toFixed(1)}</span>
                    <span className="text-slate-500">({product.reviewsCount || 1} avaliações)</span>
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-xl sm:text-2xl font-bold text-white font-serif-luxury leading-snug">
                  {product.name || 'Gravata'}
                </h2>

                {/* Pricing Box */}
                <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 space-y-1.5">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-white font-serif-luxury">
                      {formatCurrency(product.price || 0)}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-slate-500 line-through">
                        {formatCurrency(product.originalPrice)}
                      </span>
                    )}
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                      Em até 6x sem juros
                    </span>
                  </div>
                  
                  <p className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                    <span>⚡ No PIX por apenas: <strong>{formatCurrency(pixPrice)}</strong> (5% OFF)</span>
                  </p>
                </div>

                {/* Description */}
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {product.description || 'Confeccionada com os mais altos padrões de alfaiataria.'}
                </p>

                {/* Kit inclusions if any */}
                {product.includes && product.includes.length > 0 && (
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 space-y-2">
                    <p className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                      <PackageCheck className="w-4 h-4 text-amber-400" />
                      <span>Itens Inclusos no Kit:</span>
                    </p>
                    <ul className="grid grid-cols-2 gap-1.5 text-xs text-slate-200">
                      {product.includes.map((item, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Technical Specs Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Largura da Ponta</span>
                    <span className="text-slate-200 font-semibold">{product.width || 'Slim (5,5 cm)'}</span>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Comprimento Padrão</span>
                    <span className="text-slate-200 font-semibold">{product.length || '148 cm'}</span>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Cor & Tonalidade</span>
                    <span className="text-slate-200 font-semibold">{product.colorLabel || 'Cor Nobre'}</span>
                  </div>
                  <div className="bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Padrão Visual</span>
                    <span className="text-slate-200 font-semibold">{product.pattern || 'Texturizada'}</span>
                  </div>
                </div>

                {/* Quantity & Bulk Wedding Pack Options */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">Quantidade:</span>
                    {bulkDiscountPercent > 0 && (
                      <span className="text-xs font-bold text-emerald-400 animate-pulse">
                        Desconto de {bulkDiscountPercent}% aplicado para lote!
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-slate-700 bg-slate-900 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-2.5 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center text-sm font-bold text-white">
                        {quantity}
                      </span>
                      <button
                        onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                        className="p-2.5 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-xs text-slate-400">
                      <span>Total: </span>
                      <strong className="text-white text-sm font-bold">
                        {formatCurrency(discountedTotal)}
                      </strong>
                    </div>
                  </div>

                  {/* Wedding discount badges */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <button
                      onClick={() => setQuantity(4)}
                      className={`text-[11px] px-2.5 py-1 rounded-md border transition-all ${
                        quantity === 4
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      4 un. (10% OFF)
                    </button>
                    <button
                      onClick={() => setQuantity(8)}
                      className={`text-[11px] px-2.5 py-1 rounded-md border transition-all ${
                        quantity === 8
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      8 un. (15% OFF)
                    </button>
                    <button
                      onClick={() => setQuantity(12)}
                      className={`text-[11px] px-2.5 py-1 rounded-md border transition-all ${
                        quantity === 12
                          ? 'bg-amber-500/20 border-amber-400 text-amber-300 font-bold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      12 un. (20% OFF)
                    </button>
                  </div>
                </div>

                {/* Gift Box Addon Checkbox */}
                <label className="flex items-center gap-3 p-3 bg-slate-900/60 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition-colors">
                  <input
                    type="checkbox"
                    checked={giftBox}
                    onChange={(e) => setGiftBox(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-500 bg-slate-950 border-slate-700"
                  />
                  <div className="flex items-center gap-2 flex-1">
                    <Gift className="w-4 h-4 text-amber-400" />
                    <div>
                      <p className="text-xs font-semibold text-slate-200">
                        Adicionar Caixa de Presente Premium Kraft & Cetim (+R$ 19,90)
                      </p>
                      <p className="text-[11px] text-slate-400">Ideal para convite formal de padrinhos</p>
                    </div>
                  </div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={handleAdd}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      justAdded
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 shadow-md'
                    }`}
                  >
                    {justAdded ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Adicionado à Sacola!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4 text-amber-400" />
                        <span>Adicionar à Sacola</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="w-full py-3 px-4 rounded-xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    <span>Comprar Agora</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Direct WhatsApp Ask Button */}
                <a
                  href={whatsappInquiryUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/30 flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Dúvida sobre esta gravata? Falar no WhatsApp</span>
                </a>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
