import React from 'react';
import { ShoppingBag, Eye, Star, Sparkles, Check } from 'lucide-react';
import { Product } from '../types';
import { formatCurrency } from '../utils';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  isAdded?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
  isAdded,
}) => {
  const pixPrice = (product.price || 0) * 0.95;
  const mainImage = product.images?.[0] || 'https://images.unsplash.com/photo-1589756823695-278bc923f962?auto=format&fit=crop&w=800&q=80';

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative bg-[#111722] hover:bg-[#151c2a] border border-slate-800 hover:border-amber-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-amber-950/20 flex flex-col cursor-pointer"
    >
      {/* Product Image Area */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-900">
        <img
          src={mainImage}
          alt={product.name || 'Gravata'}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
          {product.isBestSeller && (
            <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md shadow-md tracking-wider">
              Mais Vendida
            </span>
          )}
          {product.isWeddingFav && (
            <span className="bg-rose-950/80 text-rose-200 border border-rose-500/40 text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm">
              Favorita de Noivas
            </span>
          )}
          {product.isNew && (
            <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-sm">
              Lançamento
            </span>
          )}
        </div>

        {/* Quick View Button overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="flex items-center gap-1.5 bg-slate-900/90 hover:bg-slate-800 text-slate-100 text-xs font-semibold px-3 py-2 rounded-lg border border-slate-700 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>Ver Detalhes</span>
          </button>
        </div>

        {/* Width badge bottom */}
        <div className="absolute bottom-2 left-2 bg-slate-950/80 backdrop-blur-sm text-[10px] font-medium text-slate-300 px-2 py-0.5 rounded border border-slate-800">
          {product.width || 'Slim (5,5 cm)'}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1.5">
          {/* Fabric & Rating */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="text-[11px] text-amber-400/90 font-medium truncate max-w-[65%]">
              {product.fabric ? `${product.fabric.split(' ')[0]} ${product.fabric.split(' ')[1] || ''}` : 'Seda Jacquard'}
            </span>
            <div className="flex items-center gap-1 text-amber-400 font-semibold text-[11px]">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{(product.rating || 5.0).toFixed(1)}</span>
              <span className="text-slate-500 font-normal">({product.reviewsCount || 1})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-2 leading-snug">
            {product.name || 'Gravata Elegance'}
          </h3>

          {/* Color tag */}
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full border border-slate-600 inline-block shrink-0 bg-slate-700" />
            <span>{product.colorLabel || 'Cor Nobre'}</span>
          </p>
        </div>

        {/* Price & Action */}
        <div className="pt-2 border-t border-slate-800/80 space-y-2">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-slate-100 font-serif-luxury">
                {formatCurrency(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-500 line-through">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            
            {/* PIX highlight */}
            <p className="text-[11px] text-emerald-400 font-medium">
              {formatCurrency(pixPrice)} no PIX <span className="text-emerald-400/70">(5% OFF)</span>
            </p>
          </div>

          {/* Add to cart button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product, e);
            }}
            className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 hover:bg-amber-500 text-slate-200 hover:text-slate-950 border border-slate-700 hover:border-amber-400 shadow-md'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Adicionado!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Adicionar à Sacola</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
