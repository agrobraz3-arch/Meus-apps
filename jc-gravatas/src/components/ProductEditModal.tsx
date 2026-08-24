import React, { useState, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Check, 
  Sparkles, 
  Eye, 
  Tag, 
  DollarSign, 
  Layers, 
  Package,
  AlertCircle
} from 'lucide-react';
import { Product, CategoryId, TieColor, FabricType, TieWidth } from '../types';
import { formatCurrency } from '../utils';

interface ProductEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null; // null = novo produto
  onSave: (product: Product) => void;
}

const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: 'slim', label: 'Gravatas Slim (5,5 a 6cm)' },
  { id: 'classica', label: 'Gravatas Clássicas (7 a 8,5cm)' },
  { id: 'casamento', label: 'Padrinhos & Noivos' },
  { id: 'kits', label: 'Kits com Lenço e Abotoadura' },
  { id: 'borboleta', label: 'Gravatas Borboleta' },
  { id: 'seda-pura', label: 'Seda Pura Italiana 1200 Fios' },
];

const COLORS: { id: TieColor; label: string; hex: string }[] = [
  { id: 'bordo', label: 'Bordô / Marsala', hex: '#68182b' },
  { id: 'marinho', label: 'Azul Marinho / Royal', hex: '#0f2444' },
  { id: 'preto', label: 'Preto Ebony / Grafite', hex: '#111827' },
  { id: 'esmeralda', label: 'Verde Esmeralda / Musgo', hex: '#0e4429' },
  { id: 'terracota', label: 'Terracota / Rust / Cobre', hex: '#a84c28' },
  { id: 'rose', label: 'Rosé Quartz / Salmão', hex: '#d98b8b' },
  { id: 'dourado', label: 'Dourado / Mostarda / Champanhe', hex: '#c89a3c' },
  { id: 'prata', label: 'Prata / Cinza Platina', hex: '#94a3b8' },
  { id: 'estampado', label: 'Estampado / Xadrez / Paisley', hex: 'linear-gradient(135deg, #1e3a8a, #991b1b)' },
];

const FABRICS: FabricType[] = [
  'Seda 100% Jacquard 1200 Fios',
  'Jacquard Poliéster Nobre',
  'Seda Pura Italiana',
  'Linho Puro & Algodão',
  'Knit / Tricô Italiano',
  'Veludo & Seda',
];

const WIDTHS: TieWidth[] = [
  'Slim (5,5 cm)',
  'Semi-Slim (7,0 cm)',
  'Clássica (8,5 cm)',
  'Borboleta Ajustável',
];

const PATTERNS: Product['pattern'][] = [
  'Lisa Acetinada',
  'Floral',
  'Poá / Micro-pontos',
  'Paisley / Cashmere',
  'Listrada Regimental',
  'Xadrez Tartan',
  'Texturizada',
];

export const ProductEditModal: React.FC<ProductEditModalProps> = ({
  isOpen,
  onClose,
  product,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    category: 'slim',
    price: 89.90,
    originalPrice: 119.90,
    images: [],
    description: '',
    fabric: 'Seda 100% Jacquard 1200 Fios',
    width: 'Slim (5,5 cm)',
    length: '148 cm',
    color: 'marinho',
    colorLabel: 'Azul Marinho Imperial',
    pattern: 'Texturizada',
    occasion: ['Casamentos', 'Eventos Formais', 'Trabalho'],
    stock: 20,
    rating: 5.0,
    reviewsCount: 1,
    isBestSeller: false,
    isNew: true,
    isWeddingFav: false,
    includes: [],
  });

  const [imageUrlInput, setImageUrlInput] = useState('');
  const [includesInput, setIncludesInput] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'images' | 'preview'>('info');

  useEffect(() => {
    if (product) {
      setFormData(product);
      setIncludesInput(product.includes ? product.includes.join(', ') : '');
    } else {
      setFormData({
        id: `prod-${Date.now()}`,
        name: '',
        category: 'slim',
        price: 89.90,
        originalPrice: 119.90,
        images: [
          'https://images.unsplash.com/photo-1589756823695-278bc923f962?auto=format&fit=crop&w=800&q=80',
        ],
        description: 'Gravata de alta alfaiataria confeccionada com acabamento impecável.',
        fabric: 'Seda 100% Jacquard 1200 Fios',
        width: 'Slim (5,5 cm)',
        length: '148 cm',
        color: 'marinho',
        colorLabel: 'Azul Marinho',
        pattern: 'Lisa Acetinada',
        occasion: ['Casamentos', 'Reuniões', 'Formaturas'],
        stock: 25,
        rating: 5.0,
        reviewsCount: 1,
        isBestSeller: false,
        isNew: true,
        isWeddingFav: false,
        includes: [],
      });
      setIncludesInput('');
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  // Handle local file upload (converts to Base64 image data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadError(null);
    const newImages: string[] = [...(formData.images || [])];

    Array.from(files).forEach((file: File) => {
      if (!file.type.startsWith('image/')) {
        setUploadError('Por favor selecione apenas arquivos de imagem (PNG, JPG, WEBP).');
        return;
      }

      // Max 5MB per image
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('A imagem selecionada é muito pesada (máximo 5MB).');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const result = event.target.result as string;
          setFormData((prev) => ({
            ...prev,
            images: [...(prev.images || []), result],
          }));
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...(prev.images || []), imageUrlInput.trim()],
    }));
    setImageUrlInput('');
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));
  };

  const handleSetMainImage = (index: number) => {
    if (!formData.images) return;
    const item = formData.images[index];
    const rest = formData.images.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      images: [item, ...rest],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name?.trim()) {
      alert('Por favor informe o nome do produto.');
      return;
    }

    if (!formData.images || formData.images.length === 0) {
      alert('Adicione pelo menos 1 foto para o produto.');
      return;
    }

    const includesArr = includesInput
      ? includesInput.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const finalProduct: Product = {
      id: formData.id || `prod-${Date.now()}`,
      name: formData.name.trim(),
      category: formData.category || 'slim',
      price: Number(formData.price) || 89.90,
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      images: formData.images,
      description: formData.description || 'Gravata de alta qualidade Don Sartorio.',
      fabric: formData.fabric || 'Seda 100% Jacquard 1200 Fios',
      width: formData.width || 'Slim (5,5 cm)',
      length: formData.length || '148 cm',
      color: formData.color || 'marinho',
      colorLabel: formData.colorLabel || 'Cor Exclusiva',
      pattern: formData.pattern || 'Lisa Acetinada',
      occasion: formData.occasion && formData.occasion.length > 0 ? formData.occasion : ['Eventos Especiais'],
      stock: Number(formData.stock) >= 0 ? Number(formData.stock) : 10,
      rating: formData.rating || 5.0,
      reviewsCount: formData.reviewsCount || 1,
      isBestSeller: !!formData.isBestSeller,
      isNew: !!formData.isNew,
      isWeddingFav: !!formData.isWeddingFav,
      includes: includesArr.length > 0 ? includesArr : undefined,
    };

    onSave(finalProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#0f1523] border border-amber-500/30 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-serif-luxury">
                {product ? 'Editar Produto' : 'Cadastrar Novo Produto'}
              </h2>
              <p className="text-xs text-slate-400">
                Altere valores, fotos, descrições e estoque que aparecerão imediatamente na loja
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setActiveTab('info')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'info'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Dados do Produto & Valores</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('images')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'images'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Fotos do Produto ({formData.images?.length || 0})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 cursor-pointer transition-all ${
              activeTab === 'preview'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>Pré-visualização</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: BASIC INFO & PRICING */}
          {activeTab === 'info' && (
            <div className="space-y-5">
              
              {/* Product Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                    Nome do Produto *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Gravata Slim Jacquard Azul Marinho Imperial"
                    className="w-full bg-slate-900 text-sm text-white px-3.5 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-500 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                    Categoria da Loja *
                  </label>
                  <select
                    value={formData.category || 'slim'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as CategoryId })}
                    className="w-full bg-slate-900 text-sm text-white px-3 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-amber-400 uppercase tracking-wider block flex items-center gap-1">
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Preço de Venda (R$) *</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    placeholder="89.90"
                    className="w-full bg-slate-950 text-base font-bold text-emerald-400 px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-500 font-mono"
                  />
                  <p className="text-[10px] text-slate-400">Preço cobrado do cliente no checkout</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Preço Original "De" (R$)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.originalPrice || ''}
                    onChange={(e) => setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || undefined })}
                    placeholder="119.90 (opcional)"
                    className="w-full bg-slate-950 text-sm font-semibold text-slate-300 px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-500 font-mono"
                  />
                  <p className="text-[10px] text-slate-400">Gera a tag de desconto (ex: "25% OFF")</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Estoque Disponível *
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.stock !== undefined ? formData.stock : 20}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value, 10) || 0 })}
                    placeholder="20"
                    className="w-full bg-slate-950 text-sm font-bold text-white px-3 py-2 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-500 font-mono"
                  />
                  <p className="text-[10px] text-slate-400">Unidades prontas para envio imediato</p>
                </div>
              </div>

              {/* Color & Material Attributes */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                    Cor Principal *
                  </label>
                  <select
                    value={formData.color || 'marinho'}
                    onChange={(e) => {
                      const sel = COLORS.find((c) => c.id === e.target.value);
                      setFormData({ 
                        ...formData, 
                        color: e.target.value as TieColor,
                        colorLabel: sel ? sel.label : formData.colorLabel 
                      });
                    }}
                    className="w-full bg-slate-900 text-sm text-white px-3 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-500"
                  >
                    {COLORS.map((col) => (
                      <option key={col.id} value={col.id}>
                        {col.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                    Nome da Cor / Tom Exibido
                  </label>
                  <input
                    type="text"
                    value={formData.colorLabel || ''}
                    onChange={(e) => setFormData({ ...formData, colorLabel: e.target.value })}
                    placeholder="Ex: Marsala Barroco / Terracota Rust"
                    className="w-full bg-slate-900 text-sm text-white px-3 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                    Largura da Ponteira
                  </label>
                  <select
                    value={formData.width || 'Slim (5,5 cm)'}
                    onChange={(e) => setFormData({ ...formData, width: e.target.value as TieWidth })}
                    className="w-full bg-slate-900 text-sm text-white px-3 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-500"
                  >
                    {WIDTHS.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Fabric & Pattern */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                    Tecido & Composição
                  </label>
                  <select
                    value={formData.fabric || 'Seda 100% Jacquard 1200 Fios'}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value as FabricType })}
                    className="w-full bg-slate-900 text-sm text-white px-3 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-500"
                  >
                    {FABRICS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                    Estampa / Padrão
                  </label>
                  <select
                    value={formData.pattern || 'Lisa Acetinada'}
                    onChange={(e) => setFormData({ ...formData, pattern: e.target.value as any })}
                    className="w-full bg-slate-900 text-sm text-white px-3 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-500"
                  >
                    {PATTERNS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                  Descrição Detalhada do Produto
                </label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva a elegância, toque do tecido, sugestão de uso com ternos e detalhes artesanais..."
                  className="w-full bg-slate-900 text-xs text-white p-3 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              {/* Includes (For Kits) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block">
                  Itens Inclusos no Pacote (separe por vírgula)
                </label>
                <input
                  type="text"
                  value={includesInput}
                  onChange={(e) => setIncludesInput(e.target.value)}
                  placeholder="Ex: Gravata Semi-Slim, Lenço de Bolso 25x25cm, Par de Abotoaduras Cromadas, Estojo Don Sartorio"
                  className="w-full bg-slate-900 text-xs text-white px-3 py-2.5 rounded-xl border border-slate-700 focus:outline-none focus:border-amber-500"
                />
                <p className="text-[10px] text-slate-400">Excelente para destacar kits de padrinhos e caixas de presente</p>
              </div>

              {/* Badges / Destaques */}
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  Destaques e Selos Promocionais
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:border-amber-500/40">
                    <input
                      type="checkbox"
                      checked={!!formData.isBestSeller}
                      onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                      className="accent-amber-500 w-4 h-4 rounded"
                    />
                    <span className="text-xs text-slate-200 font-medium">⭐ Mais Vendido</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:border-amber-500/40">
                    <input
                      type="checkbox"
                      checked={!!formData.isNew}
                      onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                      className="accent-amber-500 w-4 h-4 rounded"
                    />
                    <span className="text-xs text-slate-200 font-medium">✨ Lançamento</span>
                  </label>

                  <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-950 border border-slate-800 cursor-pointer hover:border-amber-500/40">
                    <input
                      type="checkbox"
                      checked={!!formData.isWeddingFav}
                      onChange={(e) => setFormData({ ...formData, isWeddingFav: e.target.checked })}
                      className="accent-amber-500 w-4 h-4 rounded"
                    />
                    <span className="text-xs text-slate-200 font-medium">💍 Favorito Padrinhos</span>
                  </label>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: IMAGES UPLOAD & MANAGEMENT */}
          {activeTab === 'images' && (
            <div className="space-y-6">
              
              {/* Upload Box */}
              <div className="bg-slate-900/90 border-2 border-dashed border-amber-500/30 rounded-2xl p-6 text-center hover:border-amber-400 transition-colors">
                <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 mx-auto flex items-center justify-center mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">
                  Adicionar Fotos do seu Computador ou Celular
                </h3>
                <p className="text-xs text-slate-400 mb-4 max-w-md mx-auto">
                  Selecione as fotos da gravata no seu aparelho. Elas serão salvas e exibidas instantaneamente na vitrine da loja.
                </p>

                <label className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl cursor-pointer shadow-lg shadow-amber-500/10 transition-transform active:scale-95 text-xs">
                  <Upload className="w-4 h-4" />
                  <span>Escolher Fotos no Dispositivo</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {uploadError && (
                  <div className="mt-3 flex items-center justify-center gap-1 text-xs text-rose-400">
                    <AlertCircle className="w-4 h-4" />
                    <span>{uploadError}</span>
                  </div>
                )}
              </div>

              {/* Or add via URL */}
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Ou adicione uma foto por Link / URL da Web:
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="https://exemplo.com/foto-gravata.jpg"
                    className="flex-1 bg-slate-950 text-xs text-white px-3 py-2 rounded-lg border border-slate-700 focus:outline-none focus:border-amber-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="bg-slate-800 hover:bg-slate-700 text-amber-300 px-4 py-2 rounded-lg text-xs font-bold border border-amber-500/20 cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Adicionar Link</span>
                  </button>
                </div>
              </div>

              {/* Gallery List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Fotos Cadastradas ({formData.images?.length || 0})
                  </h4>
                  <span className="text-[11px] text-amber-400">
                    ★ A primeira foto da esquerda é a foto principal (capa da vitrine)
                  </span>
                </div>

                {(!formData.images || formData.images.length === 0) ? (
                  <div className="text-center py-10 bg-slate-950 rounded-xl border border-slate-800 text-slate-500 text-xs">
                    Nenhuma foto adicionada para este produto. Adicione pelo menos 1 foto acima!
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {formData.images.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className={`group relative rounded-xl overflow-hidden border-2 bg-slate-950 flex flex-col ${
                          idx === 0
                            ? 'border-amber-400 ring-2 ring-amber-400/20'
                            : 'border-slate-800 hover:border-slate-600'
                        }`}
                      >
                        <div className="aspect-square relative overflow-hidden bg-slate-900">
                          <img
                            src={imgUrl}
                            alt={`Foto ${idx + 1}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            referrerPolicy="no-referrer"
                          />
                          {idx === 0 && (
                            <span className="absolute top-2 left-2 bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded shadow">
                              CAPA PRINCIPAL
                            </span>
                          )}
                        </div>

                        <div className="p-2 bg-slate-900 flex items-center justify-between gap-1 border-t border-slate-800">
                          {idx !== 0 ? (
                            <button
                              type="button"
                              onClick={() => handleSetMainImage(idx)}
                              className="text-[10px] text-amber-400 hover:text-amber-300 font-semibold cursor-pointer"
                            >
                              Tornar Capa
                            </button>
                          ) : (
                            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
                              <Check className="w-3 h-3" /> Foto Principal
                            </span>
                          )}

                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="p-1 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                            title="Excluir foto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 3: LIVE PREVIEW */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>Assim é como o seu produto aparecerá na vitrine da Don Sartorio:</span>
              </div>

              <div className="max-w-xs mx-auto bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="aspect-[4/5] bg-slate-950 relative overflow-hidden">
                  <img
                    src={
                      formData.images && formData.images.length > 0
                        ? formData.images[0]
                        : 'https://images.unsplash.com/photo-1589756823695-278bc923f962?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={formData.name || 'Preview'}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {formData.isBestSeller && (
                      <span className="bg-amber-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded shadow">
                        MAIS VENDIDO
                      </span>
                    )}
                    {formData.isNew && (
                      <span className="bg-emerald-500 text-slate-950 text-[10px] font-extrabold px-2 py-0.5 rounded shadow">
                        LANÇAMENTO
                      </span>
                    )}
                    {formData.isWeddingFav && (
                      <span className="bg-indigo-600 text-white text-[10px] font-extrabold px-2 py-0.5 rounded shadow">
                        PADRINHOS
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                    {formData.fabric}
                  </span>
                  <h4 className="text-sm font-bold text-white font-serif-luxury line-clamp-2">
                    {formData.name || 'Nome da sua Gravata'}
                  </h4>
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-extrabold text-amber-400 font-serif-luxury">
                      {formatCurrency(formData.price || 0)}
                    </span>
                    {formData.originalPrice && formData.originalPrice > (formData.price || 0) && (
                      <span className="text-xs text-slate-500 line-through">
                        {formatCurrency(formData.originalPrice)}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-800">
                    <span>Estoque: {formData.stock} un</span>
                    <span>{formData.width}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            <div className="w-full sm:w-auto flex items-center gap-3">
              <button
                type="submit"
                className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold px-6 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all active:scale-95"
              >
                <Check className="w-4 h-4" />
                <span>{product ? 'Salvar Alterações do Produto' : 'Publicar Produto na Loja'}</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
