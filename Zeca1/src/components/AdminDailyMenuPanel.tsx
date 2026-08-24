import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ItemCategory, MenuItem, PixKeyType } from '../types';
import { WeeklyScheduleManager } from './WeeklyScheduleManager';
import { ImportExportMenuModal } from './ImportExportMenuModal';
import { 
  SlidersHorizontal, 
  Plus, 
  Trash2, 
  Check, 
  Share2, 
  RotateCcw, 
  Flame, 
  Utensils, 
  DollarSign, 
  Store, 
  Power, 
  Sparkles, 
  Tag,
  Edit2,
  FileText,
  QrCode,
  KeyRound,
  Building2,
  Phone,
  Save,
  CheckCircle2,
  Pencil,
  X,
  Calendar,
  FileUp,
  FileDown
} from 'lucide-react';

export const AdminDailyMenuPanel: React.FC = () => {
  const {
    menuItems,
    marmitaSizes,
    restaurant,
    updateRestaurant,
    toggleItemAvailability,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    updateSizePrice,
    resetToDefaultMenu,
    generateWhatsAppMenuText,
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<ItemCategory | 'todos'>('todos');
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [savedPixSuccess, setSavedPixSuccess] = useState(false);
  const [isImportExportModalOpen, setIsImportExportModalOpen] = useState(false);

  // PIX Form State
  const [pixKeyType, setPixKeyType] = useState<PixKeyType>(restaurant.pixConfig?.keyType || 'telefone');
  const [pixKey, setPixKey] = useState<string>(restaurant.pixConfig?.key || '82993200513');
  const [pixMerchantName, setPixMerchantName] = useState<string>(restaurant.pixConfig?.merchantName || 'RESTAURANTE DO ZECA');
  const [pixMerchantCity, setPixMerchantCity] = useState<string>(restaurant.pixConfig?.merchantCity || 'PINDORAMA');
  const [pixBankName, setPixBankName] = useState<string>(restaurant.pixConfig?.bankName || 'Banco / Chave do Zeca');
  const [restaurantWhatsapp, setRestaurantWhatsapp] = useState<string>(restaurant.whatsapp || '5582993200513');
  const [defaultDeliveryFee, setDefaultDeliveryFee] = useState<number>(restaurant.defaultDeliveryFee || 4.00);
  const [adminPin, setAdminPin] = useState<string>(restaurant.adminPin || '1234');

  // New Item Modal Form State
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<ItemCategory>('carnes');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemBadge, setNewItemBadge] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');

  // Editing existing item state
  const [itemBeingEdited, setItemBeingEdited] = useState<MenuItem | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState<ItemCategory>('carnes');
  const [editDesc, setEditDesc] = useState('');
  const [editBadge, setEditBadge] = useState('');
  const [editPrice, setEditPrice] = useState('');

  const handleStartEdit = (item: MenuItem) => {
    setItemBeingEdited(item);
    setEditName(item.name);
    setEditCategory(item.category);
    setEditDesc(item.description || '');
    setEditBadge(item.badge || '');
    setEditPrice(item.extraPrice !== undefined ? String(item.extraPrice) : '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemBeingEdited || !editName.trim()) return;

    updateMenuItem(itemBeingEdited.id, {
      name: editName.trim(),
      category: editCategory,
      description: editDesc.trim() || undefined,
      badge: editBadge.trim() || undefined,
      extraPrice: editPrice ? Number(editPrice) : undefined,
    });

    setItemBeingEdited(null);
  };

  const handleCopyMenu = () => {
    const text = generateWhatsAppMenuText();
    navigator.clipboard.writeText(text);
    setCopiedSuccess(true);
    setTimeout(() => setCopiedSuccess(false), 2500);
  };

  const handleSavePixSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateRestaurant({
      whatsapp: restaurantWhatsapp.replace(/[^0-9]/g, ''),
      defaultDeliveryFee: Number(defaultDeliveryFee),
      adminPin: adminPin.trim() || '1234',
      pixConfig: {
        keyType: pixKeyType,
        key: pixKey.trim(),
        merchantName: pixMerchantName.trim().toUpperCase(),
        merchantCity: pixMerchantCity.trim().toUpperCase(),
        bankName: pixBankName.trim(),
        requireProofUpload: false,
      }
    });

    setSavedPixSuccess(true);
    setTimeout(() => setSavedPixSuccess(false), 3000);
  };

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    addMenuItem({
      name: newItemName.trim(),
      category: newItemCategory,
      description: newItemDesc.trim() || undefined,
      badge: newItemBadge.trim() || undefined,
      available: true,
      extraPrice: newItemPrice ? Number(newItemPrice) : undefined,
    });

    setNewItemName('');
    setNewItemDesc('');
    setNewItemBadge('');
    setNewItemPrice('');
    setIsAddingNew(false);
  };

  const filteredItems = activeCategory === 'todos' 
    ? menuItems 
    : menuItems.filter(i => i.category === activeCategory);

  const availableCount = menuItems.filter(i => i.available).length;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      
      {/* Admin Top Header Card */}
      <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 border border-amber-800/40 rounded-3xl p-5 sm:p-6 shadow-2xl text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-600/30 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <SlidersHorizontal className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-serif text-amber-100">
                  Painel de Controle do Restaurante
                </h2>
                <span className="bg-amber-500/20 text-amber-300 text-xs px-2 py-0.5 rounded font-bold border border-amber-500/30">
                  Painel do Dono
                </span>
              </div>
              <p className="text-xs text-amber-300/80">
                Gerencie o cardápio do dia, valores das quentinhas e configure sua chave PIX de recebimento.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              id="admin-copy-whatsapp-btn"
              onClick={handleCopyMenu}
              className="bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow"
              title="Copiar texto formatado do cardápio"
            >
              {copiedSuccess ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedSuccess ? 'Copiado!' : 'Gerar Texto WhatsApp'}</span>
            </button>

            <button
              id="admin-toggle-restaurant-status-btn"
              onClick={() => updateRestaurant({ isOpen: !restaurant.isOpen })}
              className={`text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow ${
                restaurant.isOpen
                  ? 'bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-700/50'
                  : 'bg-emerald-900/80 hover:bg-emerald-800 text-emerald-300 border border-emerald-700/50'
              }`}
            >
              <Power className="w-3.5 h-3.5" />
              <span>{restaurant.isOpen ? 'Pausar Restaurante' : 'Abrir Restaurante'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. PROGRAMAÇÃO DO CARDÁPIO SEMANAL AUTOMÁTICO */}
      <WeeklyScheduleManager />

      {/* 2. CONFIGURAÇÃO DA CHAVE PIX DO RESTAURANTE */}
      <div className="bg-stone-900/90 border border-emerald-800/40 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-emerald-200 font-serif">
                Configuração do Seu PIX para Recebimentos
              </h3>
              <p className="text-xs text-stone-400">
                Os clientes escaneiam o QR Code oficial gerado com a sua chave bancária
              </p>
            </div>
          </div>
          <span className="text-[11px] text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/40 font-bold self-start sm:self-auto">
            ⚡ Padrão Banco Central do Brasil
          </span>
        </div>

        <form onSubmit={handleSavePixSettings} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Tipo de Chave */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Tipo da sua Chave PIX:
              </label>
              <select
                value={pixKeyType}
                onChange={e => setPixKeyType(e.target.value as PixKeyType)}
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="telefone">Celular / WhatsApp (com DDD)</option>
                <option value="cpf">CPF (apenas números)</option>
                <option value="cnpj">CNPJ</option>
                <option value="email">E-mail</option>
                <option value="aleatoria">Chave Aleatória (EVP)</option>
              </select>
            </div>

            {/* Chave PIX */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Sua Chave PIX:
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={pixKey}
                  onChange={e => setPixKey(e.target.value)}
                  placeholder="Ex: 82991761488 ou seu e-mail"
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2.5 text-xs font-mono text-emerald-400 font-bold focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Nome do Titular */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Nome do Titular da Conta:
              </label>
              <input
                type="text"
                required
                value={pixMerchantName}
                onChange={e => setPixMerchantName(e.target.value)}
                placeholder="Ex: JOSE CICERO DA SILVA"
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2.5 text-xs text-stone-100 uppercase focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Cidade da Conta */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Cidade da Conta (Padrão PIX):
              </label>
              <input
                type="text"
                required
                value={pixMerchantCity}
                onChange={e => setPixMerchantCity(e.target.value)}
                placeholder="Ex: PINDORAMA ou CORURIPE"
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2.5 text-xs text-stone-100 uppercase focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* WhatsApp para Receber Notificações de Pedido */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                WhatsApp do Restaurante (com DDD):
              </label>
              <input
                type="text"
                required
                value={restaurantWhatsapp}
                onChange={e => setRestaurantWhatsapp(e.target.value)}
                placeholder="5582991761488"
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2.5 text-xs text-stone-100 font-mono focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Taxa de Entrega Padrão */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Taxa de Entrega Padrão (R$):
              </label>
              <input
                type="number"
                step="0.50"
                value={defaultDeliveryFee}
                onChange={e => setDefaultDeliveryFee(Number(e.target.value))}
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2.5 text-xs text-amber-400 font-bold focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Senha / PIN de Acesso do Dono */}
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Senha / PIN do Dono (4 dígitos):
              </label>
              <input
                type="text"
                maxLength={6}
                value={adminPin}
                onChange={e => setAdminPin(e.target.value)}
                placeholder="1234"
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2.5 text-xs text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="text-xs text-stone-400">
              💡 As alterações do PIX têm efeito imediato para todos os clientes no aplicativo.
            </div>

            <button
              id="save-pix-settings-btn"
              type="submit"
              className="w-full sm:w-auto px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/60 transition-all cursor-pointer"
            >
              {savedPixSuccess ? <CheckCircle2 className="w-4 h-4 text-stone-950" /> : <Save className="w-4 h-4" />}
              <span>{savedPixSuccess ? 'Dados do PIX Salvos com Sucesso!' : 'Salvar Dados do PIX'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* 2. Preços dos Tamanhos das Quentinhas */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-3xl p-5 sm:p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-amber-500" />
            <h3 className="text-base font-bold text-amber-100 font-serif">
              Preços dos Tamanhos das Quentinhas (P, M, G)
            </h3>
          </div>
          <span className="text-xs text-stone-400">Edite e salva na hora</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {marmitaSizes.map(size => (
            <div
              key={size.id}
              className="bg-stone-950/70 border border-stone-800 rounded-2xl p-4 space-y-2"
            >
              <div className="font-bold text-sm text-stone-200">{size.name}</div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-400 font-semibold">R$</span>
                <input
                  type="number"
                  step="0.50"
                  value={size.price}
                  onChange={e => updateSizePrice(size.id, Number(e.target.value))}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-1.5 text-sm font-bold text-amber-400 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div className="text-[11px] text-stone-500">
                {size.maxMeats} {size.maxMeats > 1 ? 'Carnes' : 'Carne'} • Até {size.maxSides} Acomp.
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Lista de Itens do Cardápio do Dia */}
      <div className="bg-stone-900/80 border border-stone-800 rounded-3xl p-5 sm:p-6 space-y-5 shadow-xl">
        
        {/* Controls & Tabs */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-stone-800 pb-4">
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1">
            {[
              { id: 'todos', label: 'Todos os Pratos' },
              { id: 'carnes', label: 'Carnes' },
              { id: 'arroz', label: 'Arrozes' },
              { id: 'feijao', label: 'Feijões' },
              { id: 'acompanhamentos', label: 'Acompanhamentos' },
              { id: 'bebidas', label: 'Bebidas' },
              { id: 'sobremesas', label: 'Sobremesas' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === tab.id
                    ? 'bg-amber-600 text-stone-950 font-bold'
                    : 'bg-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              id="admin-btn-open-import"
              onClick={() => setIsImportExportModalOpen(true)}
              className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Importar lista de pratos colando texto"
            >
              <FileUp className="w-3.5 h-3.5" />
              <span>Importar Lista</span>
            </button>

            <button
              type="button"
              onClick={() => setIsImportExportModalOpen(true)}
              className="bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition-colors border border-stone-700 cursor-pointer"
              title="Exportar cardápio em texto"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Exportar</span>
            </button>

            <button
              id="open-add-new-item-btn"
              onClick={() => setIsAddingNew(true)}
              className="bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Cadastrar Novo Prato</span>
            </button>

            <button
              onClick={resetToDefaultMenu}
              className="bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-200 text-xs px-3 py-2 rounded-xl flex items-center gap-1 transition-colors"
              title="Restaurar pratos originais da foto do Zeca"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Restaurar Padrão</span>
            </button>
          </div>
        </div>

        {/* Modal / Inline form to add new item */}
        {isAddingNew && (
          <form
            onSubmit={handleCreateItem}
            className="bg-stone-950 p-4 sm:p-5 rounded-2xl border border-amber-600/50 space-y-4 animate-in fade-in duration-200"
          >
            <div className="flex justify-between items-center text-sm font-bold text-amber-200">
              <span className="flex items-center gap-2">
                <Plus className="w-4 h-4 text-amber-400" />
                Cadastrar Novo Item no Cardápio
              </span>
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="text-stone-400 hover:text-white text-xs"
              >
                Cancelar
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-stone-400 mb-1 font-semibold">Nome do Prato *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Peixe Frito ao Molho de Camarão"
                  value={newItemName}
                  onChange={e => setNewItemName(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-400 mb-1 font-semibold">Categoria *</label>
                <select
                  value={newItemCategory}
                  onChange={e => setNewItemCategory(e.target.value as ItemCategory)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="carnes">Carnes</option>
                  <option value="arroz">Opções de Arroz</option>
                  <option value="feijao">Opções de Feijão</option>
                  <option value="acompanhamentos">Acompanhamentos</option>
                  <option value="bebidas">Bebidas</option>
                  <option value="sobremesas">Sobremesas</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-stone-400 mb-1 font-semibold">Preço Extra / Individual (R$)</label>
                <input
                  type="number"
                  step="0.50"
                  placeholder="0.00 (Incluso na quentinha se vazio)"
                  value={newItemPrice}
                  onChange={e => setNewItemPrice(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-stone-400 mb-1 font-semibold">Descrição / Detalhe (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: Acompanha pirão e cheiro verde"
                  value={newItemDesc}
                  onChange={e => setNewItemDesc(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs text-stone-400 mb-1 font-semibold">Selo de Destaque (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: Especial de Sexta, Na Brasa, Caseiro"
                  value={newItemBadge}
                  onChange={e => setNewItemBadge(e.target.value)}
                  className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-3 py-1.5 rounded-xl text-xs text-stone-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs rounded-xl shadow"
              >
                Salvar Prato no Cardápio
              </button>
            </div>
          </form>
        )}

        {/* List of items with instant toggle switch */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                item.available
                  ? 'bg-stone-950/80 border-stone-700/80 text-white'
                  : 'bg-stone-950/30 border-stone-900 text-stone-500 opacity-60'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-xs truncate text-stone-100">
                    {item.name}
                  </span>
                  {item.badge && (
                    <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded font-bold">
                      {item.badge}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-stone-400 truncate mt-0.5">
                  {item.category.toUpperCase()} {item.extraPrice ? `• R$ ${item.extraPrice.toFixed(2)}` : ''}
                </div>
              </div>

              {/* Actions: Edit, Toggle and Delete */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => handleStartEdit(item)}
                  className="w-7 h-7 rounded-lg bg-stone-900 hover:bg-amber-600 hover:text-stone-950 text-stone-400 flex items-center justify-center transition-colors cursor-pointer"
                  title="Mudar o nome ou detalhes deste prato"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>

                <button
                  id={`toggle-item-${item.id}`}
                  onClick={() => toggleItemAvailability(item.id)}
                  className={`w-11 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
                    item.available ? 'bg-amber-500' : 'bg-stone-800'
                  }`}
                  title={item.available ? 'Clique para desativar hoje' : 'Clique para ativar hoje'}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-stone-950 shadow-md transform transition-transform ${
                      item.available ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  ></div>
                </button>

                <button
                  onClick={() => deleteMenuItem(item.id)}
                  className="w-7 h-7 rounded-lg text-stone-500 hover:text-red-400 hover:bg-stone-900 flex items-center justify-center transition-colors"
                  title="Remover prato"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* MODAL: MUDAR NOME DO PRATO / EDITAR DETALHES */}
      {itemBeingEdited && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-amber-500/50 w-full max-w-md rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Pencil className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-stone-100 text-base">
                  Mudar Nome / Editar Opção
                </h3>
              </div>
              <button
                onClick={() => setItemBeingEdited(null)}
                className="text-stone-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Nome da Opção / Prato:
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  placeholder="Ex: Contra Filé Acebolado, Galinha Caipira"
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-sm text-stone-100 focus:outline-none focus:border-amber-500 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-400 mb-1">
                    Categoria:
                  </label>
                  <select
                    value={editCategory}
                    onChange={e => setEditCategory(e.target.value as ItemCategory)}
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="carnes">Carnes</option>
                    <option value="arroz">Opções de Arroz</option>
                    <option value="feijao">Opções de Feijão</option>
                    <option value="acompanhamentos">Acompanhamentos</option>
                    <option value="bebidas">Bebidas</option>
                    <option value="sobremesas">Sobremesas</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-400 mb-1">
                    Selo de Destaque:
                  </label>
                  <input
                    type="text"
                    value={editBadge}
                    onChange={e => setEditBadge(e.target.value)}
                    placeholder="Ex: Na Brasa, Especial"
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-400 mb-1">
                  Descrição (opcional):
                </label>
                <input
                  type="text"
                  value={editDesc}
                  onChange={e => setEditDesc(e.target.value)}
                  placeholder="Ex: Acompanha pirão, vinagrete e farofa"
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setItemBeingEdited(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-md transition-colors"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: IMPORTAR / EXPORTAR LISTA DE PRATOS */}
      <ImportExportMenuModal
        isOpen={isImportExportModalOpen}
        onClose={() => setIsImportExportModalOpen(false)}
      />

    </div>
  );
};
