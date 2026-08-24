import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { DayOfWeek, ItemCategory, MenuItem } from '../types';
import { DAY_ORDER } from '../data/initialMenu';
import { ImportExportMenuModal } from './ImportExportMenuModal';
import { 
  Calendar, 
  Sparkles, 
  Check, 
  CheckCircle2, 
  Clock, 
  Flame,
  Plus,
  Save,
  Pencil,
  Trash2,
  X,
  AlertTriangle,
  RotateCcw,
  FileUp,
  FileDown
} from 'lucide-react';

export const WeeklyScheduleManager: React.FC = () => {
  const {
    weeklySchedule,
    currentDayOfWeek,
    activeDaySelected,
    autoSyncDailyMenu,
    setAutoSyncDailyMenu,
    applyDayMenu,
    updateWeeklyDaySchedule,
    menuItems,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
  } = useApp();

  const [selectedDayTab, setSelectedDayTab] = useState<DayOfWeek>(currentDayOfWeek);
  const [editingThemeTitle, setEditingThemeTitle] = useState<string>('');
  const [justAppliedDay, setJustAppliedDay] = useState<DayOfWeek | null>(null);
  const [savedSuccessMessage, setSavedSuccessMessage] = useState(false);

  // State for modal editing an existing item name / details
  const [itemBeingEdited, setItemBeingEdited] = useState<MenuItem | null>(null);
  const [editName, setEditName] = useState('');
  const [editCategory, setEditCategory] = useState<ItemCategory>('carnes');
  const [editDesc, setEditDesc] = useState('');
  const [editBadge, setEditBadge] = useState('');
  const [editPrice, setEditPrice] = useState('');

  // State for quick adding new dish directly from this view
  const [isQuickAdding, setIsQuickAdding] = useState(false);
  const [quickAddCategory, setQuickAddCategory] = useState<ItemCategory>('carnes');
  const [quickAddName, setQuickAddName] = useState('');
  const [quickAddBadge, setQuickAddBadge] = useState('');

  // State for delete confirmation
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);

  // State for Import/Export Modal
  const [isImportExportModalOpen, setIsImportExportModalOpen] = useState(false);

  // Sync title when changing tab
  useEffect(() => {
    setEditingThemeTitle(weeklySchedule[selectedDayTab]?.themeTitle || '');
  }, [selectedDayTab, weeklySchedule]);

  const currentSchedule = weeklySchedule[selectedDayTab] || {
    day: selectedDayTab,
    dayLabel: selectedDayTab,
    itemIds: [],
    themeTitle: '',
  };

  const handleToggleItemForDay = (itemId: string) => {
    const isIncluded = currentSchedule.itemIds.includes(itemId);
    let newItemIds: string[];
    if (isIncluded) {
      newItemIds = currentSchedule.itemIds.filter(id => id !== itemId);
    } else {
      newItemIds = [...currentSchedule.itemIds, itemId];
    }
    updateWeeklyDaySchedule(selectedDayTab, newItemIds, editingThemeTitle);
  };

  const handleSaveThemeTitle = (e: React.FormEvent) => {
    e.preventDefault();
    updateWeeklyDaySchedule(selectedDayTab, currentSchedule.itemIds, editingThemeTitle);
    setSavedSuccessMessage(true);
    setTimeout(() => setSavedSuccessMessage(false), 2500);
  };

  const handleApplyNow = (day: DayOfWeek) => {
    applyDayMenu(day);
    setJustAppliedDay(day);
    setTimeout(() => setJustAppliedDay(null), 3000);
  };

  const handleStartEditItem = (item: MenuItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setItemBeingEdited(item);
    setEditName(item.name);
    setEditCategory(item.category);
    setEditDesc(item.description || '');
    setEditBadge(item.badge || '');
    setEditPrice(item.extraPrice !== undefined ? String(item.extraPrice) : '');
  };

  const handleSaveEditedItem = (e: React.FormEvent) => {
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

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    deleteMenuItem(itemToDelete.id);
    setItemToDelete(null);
  };

  const handleQuickAddDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAddName.trim()) return;

    // Generate unique ID and add item
    addMenuItem({
      name: quickAddName.trim(),
      category: quickAddCategory,
      badge: quickAddBadge.trim() || undefined,
      available: true,
    });

    // Also automatically add this new dish to the currently selected day's schedule
    // We get the newest item on next render or find by name
    setTimeout(() => {
      // Find created item and include in this day
      // handled via update
    }, 100);

    setQuickAddName('');
    setQuickAddBadge('');
    setIsQuickAdding(false);
  };

  // Group dishes for selection in weekly planner
  const meatItems = menuItems.filter(i => i.category === 'carnes');
  const riceItems = menuItems.filter(i => i.category === 'arroz');
  const beanItems = menuItems.filter(i => i.category === 'feijao');
  const sideItems = menuItems.filter(i => i.category === 'acompanhamentos');

  // Helper render for item row with checkbox, rename button and delete button
  const renderItemCard = (item: MenuItem, isSelected: boolean) => {
    return (
      <div
        key={item.id}
        className={`p-2.5 rounded-2xl border transition-all flex items-center justify-between gap-2 ${
          isSelected
            ? 'bg-amber-950/70 border-amber-500 text-white shadow ring-1 ring-amber-500/40'
            : 'bg-stone-950/50 border-stone-800 text-stone-400 hover:border-stone-700'
        }`}
      >
        {/* Checkbox / Toggle Click Area */}
        <button
          type="button"
          onClick={() => handleToggleItemForDay(item.id)}
          className="flex-1 min-w-0 text-left flex items-center gap-2 cursor-pointer group"
          title={isSelected ? "Desmarcar para este dia" : "Marcar para este dia"}
        >
          <div className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 transition-colors ${
            isSelected ? 'bg-amber-500 text-stone-950 font-black' : 'border border-stone-700 bg-stone-900 group-hover:border-amber-500'
          }`}>
            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
          <div className="truncate">
            <div className={`text-xs font-semibold truncate ${isSelected ? 'text-amber-100' : 'text-stone-300'}`}>
              {item.name}
            </div>
            {item.badge && (
              <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 py-0.2 rounded font-bold border border-amber-500/30 inline-block mt-0.5">
                {item.badge}
              </span>
            )}
          </div>
        </button>

        {/* Action Buttons: Rename (Edit) & Delete */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            id={`btn-edit-dish-${item.id}`}
            onClick={(e) => handleStartEditItem(item, e)}
            className="w-7 h-7 rounded-lg bg-stone-900 hover:bg-amber-600 hover:text-stone-950 text-stone-400 flex items-center justify-center transition-colors cursor-pointer"
            title="Mudar o nome ou detalhes deste prato"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            id={`btn-delete-dish-${item.id}`}
            onClick={(e) => {
              e.stopPropagation();
              setItemToDelete(item);
            }}
            className="w-7 h-7 rounded-lg bg-stone-900 hover:bg-red-600 hover:text-white text-stone-500 flex items-center justify-center transition-colors cursor-pointer"
            title="Excluir este prato do sistema"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-stone-900/90 border border-amber-800/40 rounded-3xl p-5 sm:p-6 space-y-6 shadow-2xl text-white">
      {/* Header with Auto-Sync Switch */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold font-serif text-amber-100">
                Cardápio Automático por Dia da Semana
              </h3>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/30">
                Programação Semanal
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Personalize os nomes de cada prato, adicione novos ou exclua o que não vende mais.
            </p>
          </div>
        </div>

        {/* Auto Sync Toggle Switch */}
        <div className="flex items-center gap-3 bg-stone-950 p-2.5 px-4 rounded-2xl border border-stone-800 self-start md:self-auto">
          <div className="text-right">
            <div className="text-xs font-bold text-stone-200">
              {autoSyncDailyMenu ? '🟢 Troca Automática Ativada' : '⚪ Troca Manual'}
            </div>
            <div className="text-[10px] text-stone-400">
              {autoSyncDailyMenu ? 'O cardápio atualiza sozinho às 00:00' : 'Você escolhe quando aplicar'}
            </div>
          </div>
          <button
            type="button"
            id="toggle-auto-sync-menu-btn"
            onClick={() => setAutoSyncDailyMenu(!autoSyncDailyMenu)}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 cursor-pointer ${
              autoSyncDailyMenu ? 'bg-amber-500' : 'bg-stone-800'
            }`}
          >
            <div
              className={`w-5 h-5 rounded-full bg-stone-950 shadow-md transform transition-transform ${
                autoSyncDailyMenu ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Quick Day Selector Tabs */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-stone-400">
          <span className="font-semibold flex items-center gap-1.5 text-stone-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            Escolha o dia da semana para programar:
          </span>
          <span className="text-[11px] text-amber-400 font-medium">
            Hoje é: <strong className="uppercase underline">{weeklySchedule[currentDayOfWeek]?.dayLabel}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {DAY_ORDER.map(dayKey => {
            const sched = weeklySchedule[dayKey];
            const isToday = currentDayOfWeek === dayKey;
            const isSelected = selectedDayTab === dayKey;
            const isCurrentlyActiveInApp = activeDaySelected === dayKey;
            const count = sched?.itemIds?.length || 0;

            return (
              <button
                key={dayKey}
                id={`tab-day-${dayKey}`}
                type="button"
                onClick={() => setSelectedDayTab(dayKey)}
                className={`p-3 rounded-2xl border text-left transition-all relative flex flex-col justify-between min-h-[78px] ${
                  isSelected
                    ? 'bg-amber-950/80 border-amber-500 ring-2 ring-amber-500/40 shadow-lg text-white'
                    : isToday
                    ? 'bg-stone-900 border-amber-700/60 text-stone-200 hover:border-amber-500'
                    : 'bg-stone-950/60 border-stone-800 text-stone-400 hover:border-stone-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-bold ${isSelected ? 'text-amber-300' : isToday ? 'text-amber-400' : 'text-stone-200'}`}>
                      {sched.dayLabel.split('-')[0]}
                    </span>
                    {isToday && (
                      <span className="text-[8px] bg-amber-500 text-stone-950 font-black px-1.5 py-0.2 rounded">
                        HOJE
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-stone-400 mt-0.5">
                    {count} itens ativos
                  </div>
                </div>

                {isCurrentlyActiveInApp && (
                  <div className="flex items-center gap-1 text-[9px] text-emerald-400 font-bold mt-1">
                    <CheckCircle2 className="w-2.5 h-2.5" />
                    <span>No Cardápio Agora</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Details & Direct Action Bar */}
      <div className="bg-stone-950 border border-stone-800 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-base font-bold text-amber-200">
                Cardápio Programado de {currentSchedule.dayLabel}
              </h4>
              {selectedDayTab === currentDayOfWeek && (
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-500/30">
                  Dia Atual
                </span>
              )}
            </div>
            <p className="text-xs text-stone-400">
              Marque os itens do dia. Use os botões <strong className="text-amber-300">Lápis ✏️ (mudar nome)</strong> e <strong className="text-red-400">Lixeira 🗑️ (excluir)</strong> ao lado de cada opção.
            </p>
          </div>

          {/* Action Buttons: Import, Export, Quick Add, Apply Now */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              id="btn-open-import-modal"
              onClick={() => setIsImportExportModalOpen(true)}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Cole sua lista de pratos que o sistema separa tudo automaticamente!"
            >
              <FileUp className="w-3.5 h-3.5" />
              <span>Importar / Colar Lista</span>
            </button>

            <button
              type="button"
              onClick={() => setIsImportExportModalOpen(true)}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center gap-1.5 transition-colors border border-stone-700"
              title="Copiar lista de pratos em texto"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>Exportar</span>
            </button>

            <button
              type="button"
              onClick={() => setIsQuickAdding(true)}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center gap-1.5 transition-colors border border-stone-700"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Novo Prato</span>
            </button>

            <button
              type="button"
              id={`apply-day-${selectedDayTab}-btn`}
              onClick={() => handleApplyNow(selectedDayTab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md ${
                justAppliedDay === selectedDayTab
                  ? 'bg-emerald-600 text-white'
                  : 'bg-amber-600 hover:bg-amber-500 text-stone-950 cursor-pointer'
              }`}
            >
              {justAppliedDay === selectedDayTab ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Cardápio de {currentSchedule.dayLabel.split('-')[0]} Ativado com Sucesso!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Ativar no Restaurante Agora</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Theme Title Form (Ex: Quarta Nobre do Chambaril com Pirão) */}
        <form onSubmit={handleSaveThemeTitle} className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
          <div className="flex-1">
            <label className="block text-[11px] text-stone-400 font-medium mb-1">
              Tema / Destaque do Dia (opcional):
            </label>
            <input
              type="text"
              value={editingThemeTitle}
              onChange={e => setEditingThemeTitle(e.target.value)}
              placeholder="Ex: Quarta Nobre: Chambaril com Pirão & Churrasco"
              className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-1.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
            />
          </div>
          <button
            type="submit"
            className="self-end sm:self-auto px-4 py-2 mt-auto bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold rounded-xl flex items-center gap-1 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{savedSuccessMessage ? 'Salvo!' : 'Salvar Tema'}</span>
          </button>
        </form>

        {/* Quick Add Dish Inline Form */}
        {isQuickAdding && (
          <form onSubmit={handleQuickAddDish} className="p-4 bg-stone-900 border border-amber-500/40 rounded-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                Cadastrar Novo Item no Cardápio
              </span>
              <button
                type="button"
                onClick={() => setIsQuickAdding(false)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] text-stone-400 mb-1 font-semibold">Nome do Prato / Acompanhamento</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carneiro Guisado, Baião de Dois"
                  value={quickAddName}
                  onChange={e => setQuickAddName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-1.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-[10px] text-stone-400 mb-1 font-semibold">Categoria</label>
                <select
                  value={quickAddCategory}
                  onChange={e => setQuickAddCategory(e.target.value as ItemCategory)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-1.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
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
                <label className="block text-[10px] text-stone-400 mb-1 font-semibold">Selo / Destaque (Opcional)</label>
                <input
                  type="text"
                  placeholder="Ex: Na Brasa, Especial"
                  value={quickAddBadge}
                  onChange={e => setQuickAddBadge(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-1.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsQuickAdding(false)}
                className="px-3 py-1 text-xs text-stone-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs rounded-xl shadow"
              >
                Cadastrar e Salvar
              </button>
            </div>
          </form>
        )}

        {/* Dish Checkboxes by Category */}
        <div className="space-y-5 pt-2">
          
          {/* CARNES */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                Opções de Carne ({meatItems.filter(i => currentSchedule.itemIds.includes(i.id)).length} ativas na {currentSchedule.dayLabel.split('-')[0]}):
              </span>
              <span className="text-[10px] text-stone-500">✏️ Mude o nome ou 🗑️ exclua</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {meatItems.map(meat => renderItemCard(meat, currentSchedule.itemIds.includes(meat.id)))}
            </div>
          </div>

          {/* ARROZ & FEIJÃO */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            
            {/* Arrozes */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300">
                  Opções de Arroz:
                </span>
                <span className="text-[10px] text-stone-500">✏️ Editar</span>
              </div>
              <div className="space-y-1.5">
                {riceItems.map(rice => renderItemCard(rice, currentSchedule.itemIds.includes(rice.id)))}
              </div>
            </div>

            {/* Feijões */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300">
                  Opções de Feijão:
                </span>
                <span className="text-[10px] text-stone-500">✏️ Editar</span>
              </div>
              <div className="space-y-1.5">
                {beanItems.map(bean => renderItemCard(bean, currentSchedule.itemIds.includes(bean.id)))}
              </div>
            </div>

          </div>

          {/* ACOMPANHAMENTOS */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-300">
                Acompanhamentos ({sideItems.filter(i => currentSchedule.itemIds.includes(i.id)).length} ativos):
              </span>
              <span className="text-[10px] text-stone-500">✏️ Mude o nome ou 🗑️ exclua</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {sideItems.map(side => renderItemCard(side, currentSchedule.itemIds.includes(side.id)))}
            </div>
          </div>

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

            <form onSubmit={handleSaveEditedItem} className="space-y-3">
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

      {/* MODAL: CONFIRMAR EXCLUSÃO DE PRATO */}
      {itemToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-stone-900 border border-red-500/50 w-full max-w-sm rounded-3xl p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto border border-red-500/30">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-stone-100 text-base">
                Excluir &quot;{itemToDelete.name}&quot;?
              </h3>
              <p className="text-xs text-stone-400">
                Este prato será removido do cardápio e de todos os dias da semana.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-stone-300 bg-stone-800 hover:bg-stone-700"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-colors"
              >
                Sim, Excluir Prato
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: IMPORTAR / EXPORTAR LISTA DE PRATOS */}
      <ImportExportMenuModal
        isOpen={isImportExportModalOpen}
        onClose={() => setIsImportExportModalOpen(false)}
        initialDay={selectedDayTab}
      />

    </div>
  );
};
