import React, { useState } from 'react';
import { 
  X, 
  TrendingUp, 
  Package, 
  Settings, 
  MessageCircle, 
  CheckCircle2, 
  Clock, 
  Truck, 
  DollarSign,
  Save,
  Plus, 
  Minus,
  Edit3,
  Trash2,
  Copy,
  Users,
  Search,
  RotateCcw,
  Sparkles,
  Download,
  Phone,
  MapPin,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { Order, Product, StoreSettings, CustomerUser } from '../types';
import { formatCurrency, generateWhatsAppOrderUrl } from '../utils';
import { ProductEditModal } from './ProductEditModal';

interface AdminDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: Order['status'], trackingCode?: string) => void;
  products: Product[];
  onUpdateStock: (productId: string, newStock: number) => void;
  onSaveProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => void;
  onDuplicateProduct: (productId: string) => void;
  onResetProducts: () => void;
  settings: StoreSettings;
  onUpdateSettings: (newSettings: StoreSettings) => void;
  users?: CustomerUser[];
}

export const AdminDrawer: React.FC<AdminDrawerProps> = ({
  isOpen,
  onClose,
  orders,
  onUpdateOrderStatus,
  products,
  onUpdateStock,
  onSaveProduct,
  onDeleteProduct,
  onDuplicateProduct,
  onResetProducts,
  settings,
  onUpdateSettings,
  users = [],
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'customers' | 'settings'>('products');
  const [productSearch, setProductSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  
  // Product edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Orders filter & tracking codes
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [trackingInputs, setTrackingInputs] = useState<Record<string, string>>({});

  // Settings
  const [tempSettings, setTempSettings] = useState<StoreSettings>(settings);
  const [savedSettingsNotice, setSavedSettingsNotice] = useState(false);

  if (!isOpen) return null;

  // Financial Metrics
  const totalSales = orders.reduce((sum, ord) => sum + ord.total, 0);
  const paidOrders = orders.filter((o) => o.status !== 'pending');
  const totalPaidRevenue = paidOrders.reduce((sum, ord) => sum + ord.total, 0);
  const averageTicket = orders.length > 0 ? totalSales / orders.length : 0;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    if (!p) return false;
    const query = (productSearch || '').toLowerCase();
    const matchesSearch = 
      (p.name || '').toLowerCase().includes(query) ||
      (p.colorLabel || '').toLowerCase().includes(query) ||
      (p.fabric || '').toLowerCase().includes(query);
    const matchesCategory = selectedCategoryFilter === 'all' || p.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Filtered Orders
  const filteredOrders = orders.filter((ord) => {
    if (orderStatusFilter === 'all') return true;
    return ord.status === orderStatusFilter;
  });

  const handleOpenNewProduct = () => {
    setEditingProduct(null);
    setIsEditModalOpen(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setIsEditModalOpen(true);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(tempSettings);
    setSavedSettingsNotice(true);
    setTimeout(() => setSavedSettingsNotice(false), 3000);
  };

  const handleExportBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({
      products,
      settings,
      orders,
      exportedAt: new Date().toISOString()
    }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `don_sartorio_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div className="w-screen max-w-4xl bg-[#0b111e] border-l border-slate-800 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-white font-serif-luxury">
                    Painel do Dono & Gestão Total
                  </h2>
                  <span className="bg-amber-500/20 text-amber-300 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-500/40">
                    JC GRAVATAS
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-medium px-2 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Firebase Firestore Ativo
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Edite fotos, nomes, valores de gravatas, gerencie pedidos e dados de clientes
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="bg-slate-950 p-3 sm:p-4 border-b border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            <div className="bg-slate-900/90 p-2.5 sm:p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase text-slate-400 block font-bold">Faturamento Total</span>
              <span className="text-sm sm:text-base font-extrabold text-emerald-400 font-serif-luxury block">
                {formatCurrency(totalPaidRevenue || totalSales)}
              </span>
            </div>
            
            <div className="bg-slate-900/90 p-2.5 sm:p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase text-slate-400 block font-bold">Total Pedidos</span>
              <span className="text-sm sm:text-base font-extrabold text-amber-400 font-serif-luxury block">
                {orders.length} ({paidOrders.length} pagos)
              </span>
            </div>

            <div className="bg-slate-900/90 p-2.5 sm:p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase text-slate-400 block font-bold">Catálogo Ativo</span>
              <span className="text-sm sm:text-base font-extrabold text-slate-200 font-serif-luxury block">
                {products.length} Produtos
              </span>
            </div>

            <div className="bg-slate-900/90 p-2.5 sm:p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] uppercase text-slate-400 block font-bold">Alerta de Estoque</span>
              <span className={`text-sm sm:text-base font-extrabold font-serif-luxury block ${outOfStockCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                {outOfStockCount > 0 ? `${outOfStockCount} esgotado(s)` : 'Tudo em estoque'}
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex overflow-x-auto border-b border-slate-800 bg-slate-900 px-2 sm:px-4 no-scrollbar">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-3 sm:px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all ${
                activeTab === 'products'
                  ? 'border-amber-400 text-amber-300 bg-amber-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Gerenciar Produtos ({products.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 sm:px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all ${
                activeTab === 'orders'
                  ? 'border-amber-400 text-amber-300 bg-amber-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Pedidos de Clientes ({orders.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`px-3 sm:px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all ${
                activeTab === 'customers'
                  ? 'border-amber-400 text-amber-300 bg-amber-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Clientes Cadastrados ({users.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3 sm:px-4 py-3 text-xs font-bold border-b-2 flex items-center gap-1.5 whitespace-nowrap cursor-pointer transition-all ${
                activeTab === 'settings'
                  ? 'border-amber-400 text-amber-300 bg-amber-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Configurações Loja & PIX</span>
            </button>
          </div>

          {/* TAB CONTENTS */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            
            {/* 1. PRODUCTS MANAGEMENT */}
            {activeTab === 'products' && (
              <div className="space-y-4">
                
                {/* Top Action Bar */}
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                  
                  {/* Search and Filters */}
                  <div className="flex flex-1 items-center gap-2">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={productSearch}
                        onChange={(e) => setProductSearch(e.target.value)}
                        placeholder="Buscar produto por nome, cor ou tecido..."
                        className="w-full bg-slate-900 text-xs text-white pl-9 pr-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <select
                      value={selectedCategoryFilter}
                      onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                      className="bg-slate-900 text-xs text-slate-300 px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                    >
                      <option value="all">Todas Categorias</option>
                      <option value="slim">Slim</option>
                      <option value="classica">Clássica</option>
                      <option value="casamento">Casamento/Padrinhos</option>
                      <option value="kits">Kits</option>
                      <option value="borboleta">Borboleta</option>
                      <option value="seda-pura">Seda Pura</option>
                    </select>
                  </div>

                  {/* Add Product Button */}
                  <button
                    onClick={handleOpenNewProduct}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer transition-all active:scale-95 shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>+ Cadastrar Novo Produto</span>
                  </button>
                </div>

                {/* Product List Cards */}
                <div className="space-y-3">
                  {filteredProducts.length === 0 ? (
                    <div className="text-center py-12 bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400 text-xs space-y-2">
                      <p>Nenhum produto encontrado com os filtros atuais.</p>
                      <button
                        onClick={() => { setProductSearch(''); setSelectedCategoryFilter('all'); }}
                        className="text-amber-400 hover:underline font-bold"
                      >
                        Limpar filtros
                      </button>
                    </div>
                  ) : (
                    filteredProducts.map((prod) => (
                      <div
                        key={prod.id}
                        className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 hover:border-slate-700 transition-colors"
                      >
                        {/* Image & Product Info */}
                        <div className="flex items-center gap-3.5 flex-1 min-w-0">
                          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-slate-950 overflow-hidden border border-slate-800 shrink-0 relative group">
                            <img
                              src={prod.images[0]}
                              alt={prod.name}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            {prod.images.length > 1 && (
                              <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] font-bold px-1 rounded">
                                +{prod.images.length - 1} fotos
                              </span>
                            )}
                          </div>

                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="text-xs sm:text-sm font-bold text-white truncate max-w-[280px] sm:max-w-md">
                                {prod.name}
                              </h4>
                              {prod.isBestSeller && (
                                <span className="bg-amber-500/20 text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-amber-500/30">
                                  ⭐ Mais Vendido
                                </span>
                              )}
                              {prod.isNew && (
                                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-emerald-500/30">
                                  ✨ Lançamento
                                </span>
                              )}
                            </div>

                            <p className="text-[11px] text-slate-400 flex items-center gap-2 flex-wrap">
                              <span className="font-semibold text-slate-300">{prod.fabric}</span>
                              <span>•</span>
                              <span>{prod.colorLabel}</span>
                              <span>•</span>
                              <span>{prod.width}</span>
                            </p>

                            <div className="flex items-baseline gap-2 pt-0.5">
                              <span className="text-xs sm:text-sm font-extrabold text-amber-400 font-serif-luxury">
                                {formatCurrency(prod.price)}
                              </span>
                              {prod.originalPrice && prod.originalPrice > prod.price && (
                                <span className="text-[11px] text-slate-500 line-through">
                                  {formatCurrency(prod.originalPrice)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Stock Controls & Actions */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto border-t sm:border-t-0 border-slate-800 pt-2.5 sm:pt-0">
                          
                          {/* Stock Quick Stepper */}
                          <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-xl border border-slate-800">
                            <button
                              onClick={() => onUpdateStock(prod.id, Math.max(0, prod.stock - 1))}
                              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                              title="Diminuir estoque"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            
                            <div className="px-1 text-center">
                              <span className={`text-xs font-bold font-mono block ${prod.stock === 0 ? 'text-rose-400' : 'text-slate-200'}`}>
                                {prod.stock} un
                              </span>
                            </div>

                            <button
                              onClick={() => onUpdateStock(prod.id, prod.stock + 1)}
                              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                              title="Aumentar estoque"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleOpenEditProduct(prod)}
                              className="bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 border border-amber-500/30 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                              title="Editar nome, valores, fotos e descrições"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Editar</span>
                            </button>

                            <button
                              onClick={() => onDuplicateProduct(prod.id)}
                              className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                              title="Duplicar produto para criar variação"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                if (window.confirm(`Tem certeza que deseja excluir "${prod.name}" do catálogo?`)) {
                                  onDeleteProduct(prod.id);
                                }
                              }}
                              className="p-2 text-slate-400 hover:text-rose-400 bg-slate-800 hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
                              title="Excluir produto"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Bottom Tools */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-slate-900/60 rounded-2xl border border-slate-800 text-xs">
                  <div className="text-slate-400">
                    Todas as edições feitas ficam salvas no seu navegador.
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleExportBackup}
                      className="text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer font-medium"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span>Exportar Backup (JSON)</span>
                    </button>

                    <button
                      onClick={() => {
                        if (window.confirm('Deseja restaurar o catálogo de gravatas original de fábrica da Don Sartorio?')) {
                          onResetProducts();
                        }
                      }}
                      className="text-slate-400 hover:text-rose-300 bg-slate-800/60 hover:bg-rose-950/40 px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restaurar Catálogo Original</span>
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* 2. ORDERS MANAGEMENT */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                
                {/* Orders Filter */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Filtrar por Status:
                  </span>

                  <div className="flex gap-1.5 flex-wrap">
                    {[
                      { id: 'all', label: 'Todos' },
                      { id: 'pending', label: 'Pendentes' },
                      { id: 'paid', label: 'Pagos' },
                      { id: 'preparing', label: 'Em Separação' },
                      { id: 'shipped', label: 'Enviados' },
                      { id: 'delivered', label: 'Entregues' },
                    ].map((st) => (
                      <button
                        key={st.id}
                        onClick={() => setOrderStatusFilter(st.id)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                          orderStatusFilter === st.id
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        {st.label}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredOrders.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 text-xs bg-slate-900/40 rounded-2xl border border-slate-800">
                    Nenhum pedido encontrado nesta categoria.
                  </div>
                ) : (
                  filteredOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-lg"
                    >
                      {/* Order Head */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono font-extrabold text-amber-400 text-sm">
                            #{ord.orderNumber}
                          </span>
                          <span className="text-xs text-slate-400">
                            {new Date(ord.date).toLocaleDateString('pt-BR')} às {new Date(ord.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {/* Status Select */}
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400">Status:</span>
                          <select
                            value={ord.status}
                            onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as any, ord.trackingCode)}
                            className={`text-xs font-bold px-3 py-1.5 rounded-xl border cursor-pointer ${
                              ord.status === 'paid'
                                ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40'
                                : ord.status === 'shipped'
                                ? 'bg-indigo-950 text-indigo-300 border-indigo-500/40'
                                : ord.status === 'delivered'
                                ? 'bg-teal-950 text-teal-300 border-teal-500/40'
                                : ord.status === 'preparing'
                                ? 'bg-amber-950 text-amber-300 border-amber-500/40'
                                : 'bg-slate-800 text-slate-300 border-slate-700'
                            }`}
                          >
                            <option value="pending">⏳ Pendente (Aguardando)</option>
                            <option value="paid">✓ Pago (Aprovado PIX/Cartão)</option>
                            <option value="preparing">📦 Em Separação no Estoque</option>
                            <option value="shipped">🚚 Enviado (Correios / Sedex)</option>
                            <option value="delivered">🎉 Entregue ao Cliente</option>
                          </select>
                        </div>
                      </div>

                      {/* Customer & Address Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                        <div className="space-y-1">
                          <p className="font-bold text-white flex items-center gap-1.5">
                            <span>{ord.customer.name}</span>
                          </p>
                          <p className="text-slate-300 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-amber-400" />
                            <span>{ord.customer.phone}</span>
                            {ord.customer.email && <span className="text-slate-400">({ord.customer.email})</span>}
                          </p>
                          {ord.customer.cpf && (
                            <p className="text-slate-400 font-mono text-[11px]">
                              CPF: {ord.customer.cpf}
                            </p>
                          )}
                        </div>

                        <div className="space-y-1">
                          <p className="text-slate-300 flex items-start gap-1">
                            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <span>
                              {ord.customer.street}, nº {ord.customer.number}
                              {ord.customer.complement ? ` (${ord.customer.complement})` : ''} - {ord.customer.neighborhood}
                              <br />
                              {ord.customer.city}/{ord.customer.state} • CEP {ord.customer.cep}
                            </span>
                          </p>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="bg-slate-950 p-3 rounded-xl text-xs space-y-2 border border-slate-800">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">
                          Produtos Solicitados:
                        </span>
                        {ord.items.map((item, i) => (
                          <div key={i} className="flex justify-between items-center text-xs text-slate-200">
                            <div className="flex items-center gap-2">
                              <span className="bg-slate-800 text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold text-[11px]">
                                {item.quantity}x
                              </span>
                              <span>{item.product.name}</span>
                            </div>
                            <span className="font-semibold text-slate-300 font-mono">
                              {formatCurrency(item.product.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Tracking Code Input & WhatsApp Notification */}
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                        
                        {/* Tracking Input */}
                        <div className="flex items-center gap-2 flex-1">
                          <label className="text-[11px] text-slate-400 shrink-0">Rastreio Correios:</label>
                          <input
                            type="text"
                            placeholder="Ex: NL123456789BR"
                            defaultValue={ord.trackingCode || ''}
                            onChange={(e) => {
                              const val = e.target.value;
                              setTrackingInputs((prev) => ({ ...prev, [ord.id]: val }));
                            }}
                            className="bg-slate-950 text-xs font-mono text-white px-2.5 py-1.5 rounded-lg border border-slate-700 w-36 focus:outline-none focus:border-amber-500"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const code = trackingInputs[ord.id] !== undefined ? trackingInputs[ord.id] : ord.trackingCode;
                              onUpdateOrderStatus(ord.id, ord.status, code);
                              alert('Código de rastreio atualizado com sucesso!');
                            }}
                            className="text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 px-2.5 py-1.5 rounded-lg font-bold cursor-pointer"
                          >
                            Salvar
                          </button>
                        </div>

                        {/* Total & WhatsApp Button */}
                        <div className="flex items-center justify-between sm:justify-end gap-3">
                          <div className="text-right">
                            <span className="text-xs text-slate-400 block">Total do Pedido:</span>
                            <span className="text-sm font-extrabold text-amber-400 font-serif-luxury">
                              {formatCurrency(ord.total)} ({ord.paymentMethod.toUpperCase()})
                            </span>
                          </div>

                          <a
                            href={generateWhatsAppOrderUrl(ord, settings)}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-lg shadow-emerald-950 cursor-pointer"
                          >
                            <MessageCircle className="w-4 h-4" />
                            <span>Notificar WhatsApp</span>
                          </a>
                        </div>

                      </div>

                    </div>
                  ))
                )}
              </div>
            )}

            {/* 3. CUSTOMERS TAB */}
            {activeTab === 'customers' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Lista de Clientes Cadastrados
                  </h3>
                  <span className="text-xs text-slate-400">
                    Total: {users.length} cliente(s)
                  </span>
                </div>

                {users.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 text-xs bg-slate-900/40 rounded-2xl border border-slate-800">
                    Nenhum cliente cadastrado até o momento.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3">
                    {users.map((u) => (
                      <div
                        key={u.id}
                        className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-amber-500/20 text-amber-300 font-bold flex items-center justify-center text-xs">
                              {u.name.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <h4 className="text-xs sm:text-sm font-bold text-white">{u.name}</h4>
                              <p className="text-[11px] text-slate-400">{u.email} • {u.phone}</p>
                            </div>
                          </div>

                          <a
                            href={`https://wa.me/${u.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${u.name}, tudo bem? Sou o atendimento da Don Sartorio Gravataria!`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-slate-800 hover:bg-emerald-950 hover:text-emerald-300 text-slate-300 text-xs px-3 py-1.5 rounded-xl border border-slate-700 flex items-center gap-1 transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                            <span>WhatsApp</span>
                          </a>
                        </div>

                        {u.address && (
                          <div className="text-xs text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-start gap-2">
                            <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                            <span>
                              {u.address.street}, {u.address.number}
                              {u.address.complement ? ` (${u.address.complement})` : ''} - {u.address.neighborhood} - {u.address.city}/{u.address.state} (CEP: {u.address.cep})
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. STORE & PIX SETTINGS */}
            {activeTab === 'settings' && (
              <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                
                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Dados da Loja & WhatsApp
                  </h3>

                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-200">Nome da Loja:</label>
                    <input
                      type="text"
                      value={tempSettings.storeName}
                      onChange={(e) => setTempSettings({ ...tempSettings, storeName: e.target.value })}
                      className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-bold text-slate-200">
                      Número do WhatsApp para Recebimento de Pedidos (DDI 55 + DDD + Número):
                    </label>
                    <input
                      type="text"
                      value={tempSettings.whatsappNumber}
                      onChange={(e) => setTempSettings({ ...tempSettings, whatsappNumber: e.target.value })}
                      placeholder="5582993200513"
                      className="w-full bg-slate-950 text-amber-300 p-2.5 rounded-xl border border-slate-800 font-mono focus:outline-none focus:border-amber-500 font-bold"
                    />
                    <p className="text-[11px] text-slate-400">
                      Quando o cliente clica em "Enviar Pedido para o WhatsApp", este é o número que recebe os dados prontos.
                    </p>
                  </div>
                </div>

                <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Configurações do PIX & Pagamentos
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-200">Chave PIX da Empresa:</label>
                      <input
                        type="text"
                        value={tempSettings.pixKey}
                        onChange={(e) => setTempSettings({ ...tempSettings, pixKey: e.target.value })}
                        placeholder="82993200513"
                        className="w-full bg-slate-950 text-emerald-400 p-2.5 rounded-xl border border-slate-800 font-mono focus:outline-none focus:border-amber-500 font-bold"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-200">Tipo de Chave PIX:</label>
                      <select
                        value={tempSettings.pixKeyType}
                        onChange={(e) => setTempSettings({ ...tempSettings, pixKeyType: e.target.value as any })}
                        className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                      >
                        <option value="Telefone">Celular / Telefone</option>
                        <option value="CPF">CPF</option>
                        <option value="CNPJ">CNPJ</option>
                        <option value="Email">E-mail</option>
                        <option value="Aleatória">Chave Aleatória (EVP)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-200">
                        Valor Mínimo para Frete Grátis (R$):
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={tempSettings.freeShippingThreshold}
                        onChange={(e) => setTempSettings({ ...tempSettings, freeShippingThreshold: Number(e.target.value) })}
                        className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-200">
                        Desconto no PIX à Vista (%):
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="30"
                        value={tempSettings.pixDiscountPercent}
                        onChange={(e) => setTempSettings({ ...tempSettings, pixDiscountPercent: Number(e.target.value) })}
                        className="w-full bg-slate-950 text-slate-200 p-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold py-3 rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-lg shadow-amber-500/20"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Configurações da Loja</span>
                </button>

                {savedSettingsNotice && (
                  <p className="text-center text-emerald-400 font-bold text-xs bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/40 animate-in fade-in">
                    ✓ Configurações da loja salvas com sucesso!
                  </p>
                )}
              </form>
            )}

          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-800 bg-slate-900 flex items-center justify-between">
            <span className="text-[11px] text-slate-500 font-medium">
              Don Sartorio Gravataria • Versão de Administração
            </span>
            <button
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-4 py-2 rounded-xl cursor-pointer"
            >
              Fechar Painel
            </button>
          </div>

        </div>
      </div>

      {/* Product Edit & Photo Upload Modal */}
      <ProductEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={editingProduct}
        onSave={onSaveProduct}
      />
    </div>
  );
};
