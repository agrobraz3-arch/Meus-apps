import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { DayOfWeek, ItemCategory } from '../types';
import { DAY_ORDER } from '../data/initialMenu';
import { 
  FileUp, 
  FileDown, 
  Copy, 
  Check, 
  Sparkles, 
  X, 
  Layers, 
  Flame, 
  ArrowRight, 
  Trash2, 
  Plus, 
  Calendar,
  AlertCircle,
  HelpCircle,
  Pencil
} from 'lucide-react';

interface ParsedImportItem {
  id: string;
  name: string;
  category: ItemCategory;
  badge?: string;
  extraPrice?: number;
  description?: string;
}

interface ImportExportMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDay?: DayOfWeek;
}

export const ImportExportMenuModal: React.FC<ImportExportMenuModalProps> = ({
  isOpen,
  onClose,
  initialDay
}) => {
  const {
    currentDayOfWeek,
    activeDaySelected,
    weeklySchedule,
    importBulkMenuItems,
    exportStructuredMenuText,
    applyDayMenu
  } = useApp();

  const [activeTab, setActiveTab] = useState<'import' | 'export'>('import');
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(initialDay || activeDaySelected || currentDayOfWeek);

  // Import State
  const [rawText, setRawText] = useState('');
  const [parsedItems, setParsedItems] = useState<ParsedImportItem[]>([]);
  const [replaceExisting, setReplaceExisting] = useState(true);
  const [applyImmediatelyToday, setApplyImmediatelyToday] = useState(true);
  const [importSuccess, setImportSuccess] = useState(false);
  const [importedCounts, setImportedCounts] = useState<{ added: number; updated: number }>({ added: 0, updated: 0 });

  // Export State
  const [copiedExport, setCopiedExport] = useState(false);
  const [exportText, setExportText] = useState('');

  // Keep day updated if prop changes
  useEffect(() => {
    if (initialDay) {
      setSelectedDay(initialDay);
    }
  }, [initialDay]);

  // Update export text when selected day changes
  useEffect(() => {
    setExportText(exportStructuredMenuText(selectedDay));
  }, [selectedDay, exportStructuredMenuText, isOpen]);

  if (!isOpen) return null;

  // Intelligent Parser Function
  const parseRawMenuText = (text: string): ParsedImportItem[] => {
    if (!text.trim()) return [];

    const lines = text.split('\n');
    let currentCategory: ItemCategory = 'carnes'; // default category
    const items: ParsedImportItem[] = [];

    const normalizeHeader = (str: string): ItemCategory | null => {
      const clean = str.toLowerCase().replace(/[*_#:\-\[\]]/g, '').trim();
      
      if (clean.includes('carne') || clean.includes('carnes') || clean.includes('proteina') || clean.includes('churrasco') || clean.includes('grelhado')) return 'carnes';
      if (clean.includes('arroz') || clean.includes('arrozes') || clean.includes('carboidrato')) return 'arroz';
      if (clean.includes('feijao') || clean.includes('feijão') || clean.includes('feijoes') || clean.includes('leguminosa')) return 'feijao';
      if (clean.includes('acomp') || clean.includes('acompanhamento') || clean.includes('guarni') || clean.includes('salada') || clean.includes('massas')) return 'acompanhamentos';
      if (clean.includes('bebida') || clean.includes('refrigerante') || clean.includes('suco') || clean.includes('cerveja')) return 'bebidas';
      if (clean.includes('sobremesa') || clean.includes('doce') || clean.includes('pudim')) return 'sobremesas';
      
      return null;
    };

    const detectCategoryByItemName = (name: string): ItemCategory => {
      const lower = name.toLowerCase();
      
      // Arroz patterns
      if (lower.includes('arroz') || lower.includes('baião') || lower.includes('baiao') || lower.includes('risoto')) return 'arroz';
      
      // Feijão patterns
      if (lower.includes('feijão') || lower.includes('feijao') || lower.includes('macáçar') || lower.includes('macacar') || lower.includes('tropeiro') || lower.includes('fava')) return 'feijao';
      
      // Bebidas patterns
      if (lower.includes('coca') || lower.includes('suco') || lower.includes('refrigerante') || lower.includes('guaraná') || lower.includes('guarana') || lower.includes('água') || lower.includes('agua') || lower.includes('lata') || lower.includes('fanta') || lower.includes('sprite')) return 'bebidas';
      
      // Sobremesas patterns
      if (lower.includes('pudim') || lower.includes('mousse') || lower.includes('torta') || lower.includes('bolo') || lower.includes('doce') || lower.includes('pavê') || lower.includes('pave')) return 'sobremesas';
      
      // Acompanhamentos patterns
      if (lower.includes('macarrão') || lower.includes('macarrao') || lower.includes('farofa') || lower.includes('purê') || lower.includes('pure') || lower.includes('vinagrete') || lower.includes('salada') || lower.includes('legumes') || lower.includes('maionese') || lower.includes('batata') || lower.includes('mandioca') || lower.includes('aipim') || lower.includes('macaxeira')) return 'acompanhamentos';
      
      // Default to Carnes if meat keywords or general main dish
      return 'carnes';
    };

    lines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // Ignore title headers like "CARDAPIO RESTAURANTE DO ZECA", "BOM DIA", "HORÁRIO"
      if (trimmed.toUpperCase().includes('CARDÁPIO') || trimmed.toUpperCase().includes('CARDAPIO') || trimmed.toUpperCase().includes('DELIVERY') || trimmed.toUpperCase().includes('PEDIDOS') || trimmed.toUpperCase().includes('RESTAURANTE DO ZECA')) {
        return;
      }

      // Check if this line is a category header
      const headerCat = normalizeHeader(trimmed);
      if (headerCat) {
        currentCategory = headerCat;
        return;
      }

      // Clean item name (strip bullets, dashes, numbers, emojis, asterisks)
      let cleanName = trimmed
        .replace(/^[\s*•\-–—►▪▫\d.)\t]+/, '') // remove leading bullet points, numbers, symbols
        .replace(/[*_~`]/g, '') // remove markdown bold/italic
        .trim();

      if (!cleanName || cleanName.length < 2) return;

      // Extract badge if present like (Na Brasa) or [Especial]
      let badge: string | undefined = undefined;
      const badgeMatch = cleanName.match(/[\(\[](.*?)[\)\]]/);
      if (badgeMatch && badgeMatch[1] && !badgeMatch[1].toLowerCase().includes('r$')) {
        badge = badgeMatch[1].trim();
        cleanName = cleanName.replace(/[\(\[].*?[\)\]]/, '').trim();
      }

      // Extract price if present like "R$ 5,00" or "- 5.00"
      let extraPrice: number | undefined = undefined;
      const priceMatch = cleanName.match(/r?\$?\s*(\d+[.,]\d{2})/i);
      if (priceMatch && priceMatch[1]) {
        extraPrice = parseFloat(priceMatch[1].replace(',', '.'));
        cleanName = cleanName.replace(/r?\$?\s*\d+[.,]\d{2}/i, '').replace(/[-–—:]\s*$/, '').trim();
      }

      // Determine category (use current section header if valid, or auto-detect based on dish name)
      const assignedCategory = currentCategory || detectCategoryByItemName(cleanName);

      items.push({
        id: 'parsed_' + Math.random().toString(36).substr(2, 6),
        name: cleanName,
        category: assignedCategory,
        badge,
        extraPrice
      });
    });

    return items;
  };

  const handleProcessText = () => {
    const parsed = parseRawMenuText(rawText);
    setParsedItems(parsed);
  };

  const handlePasteExample = () => {
    const example = `🥩 CARNES:
- Contra Filé Acebolado na Chapa (Na Brasa)
- Galinha Velha Caipira ao Molho
- Chambaril com Pirão Especial
- Frango Assado na Brasa
- Boi Guisado com Batatas

🍚 OPÇÕES DE ARROZ:
- Arroz Branco Soltinho
- Arroz com Cenoura e Alho
- Baião de Dois com Queijo Coalho

🫘 OPÇÕES DE FEIJÃO:
- Feijão Carioca Caseiro
- Feijão Macáçar com Charque
- Feijão Preto Temperado

🥗 ACOMPANHAMENTOS:
- Macarrão Espaguete no Alho e Óleo
- Farofa de Manteiga
- Vinagrete Refrescante
- Salada de Maionese Caseira
- Purê de Batata Cremoso`;

    setRawText(example);
    setParsedItems(parseRawMenuText(example));
  };

  const handleUpdateItemCategory = (itemId: string, newCat: ItemCategory) => {
    setParsedItems(prev => prev.map(item => item.id === itemId ? { ...item, category: newCat } : item));
  };

  const handleUpdateItemName = (itemId: string, newName: string) => {
    setParsedItems(prev => prev.map(item => item.id === itemId ? { ...item, name: newName } : item));
  };

  const handleDeleteParsedItem = (itemId: string) => {
    setParsedItems(prev => prev.filter(item => item.id !== itemId));
  };

  const handleAddBlankItem = (cat: ItemCategory) => {
    setParsedItems(prev => [
      ...prev,
      {
        id: 'parsed_' + Math.random().toString(36).substr(2, 6),
        name: '',
        category: cat,
      }
    ]);
  };

  const handleExecuteImport = () => {
    const validItems = parsedItems.filter(i => i.name.trim().length > 0);
    if (validItems.length === 0) return;

    const result = importBulkMenuItems(
      validItems.map(i => ({
        name: i.name,
        category: i.category,
        badge: i.badge,
        extraPrice: i.extraPrice,
      })),
      selectedDay,
      replaceExisting
    );

    setImportedCounts({ added: result.addedCount, updated: result.updatedCount });
    setImportSuccess(true);

    if (applyImmediatelyToday && selectedDay) {
      applyDayMenu(selectedDay);
    }

    setTimeout(() => {
      setImportSuccess(false);
      onClose();
    }, 2000);
  };

  const handleCopyExportText = () => {
    navigator.clipboard.writeText(exportText);
    setCopiedExport(true);
    setTimeout(() => setCopiedExport(false), 2500);
  };

  // Group parsed items by category for preview
  const carnes = parsedItems.filter(i => i.category === 'carnes');
  const arrozes = parsedItems.filter(i => i.category === 'arroz');
  const feijoes = parsedItems.filter(i => i.category === 'feijao');
  const acomp = parsedItems.filter(i => i.category === 'acompanhamentos');
  const bebidas = parsedItems.filter(i => i.category === 'bebidas');
  const sobremesas = parsedItems.filter(i => i.category === 'sobremesas');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-amber-500/50 w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden text-stone-100">
        
        {/* Header */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between bg-stone-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif text-amber-100 flex items-center gap-2">
                Importar e Exportar Cardápio em Lista
              </h2>
              <p className="text-xs text-stone-400">
                Copie, cole sua lista completa de pratos e o sistema organiza tudo nos espaços certos!
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center border-b border-stone-800 bg-stone-950/50 px-5 gap-2 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('import')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'import'
                ? 'border-amber-500 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <FileUp className="w-4 h-4" />
            <span>Importar / Colar Lista</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'export'
                ? 'border-amber-500 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <FileDown className="w-4 h-4" />
            <span>Exportar / Copiar Lista</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">

          {/* TAB 1: IMPORT / PASTE */}
          {activeTab === 'import' && (
            <div className="space-y-6">

              {/* Step 1: Textarea */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 text-[11px] font-black flex items-center justify-center">1</span>
                    Cole seu texto aqui (item por item ou com títulos):
                  </label>
                  <button
                    type="button"
                    onClick={handlePasteExample}
                    className="text-[11px] text-amber-400 hover:text-amber-300 font-semibold underline cursor-pointer self-start sm:self-auto"
                  >
                    Colar exemplo pronto de demonstração
                  </button>
                </div>

                <div className="relative">
                  <textarea
                    rows={7}
                    value={rawText}
                    onChange={(e) => {
                      setRawText(e.target.value);
                      const parsed = parseRawMenuText(e.target.value);
                      setParsedItems(parsed);
                    }}
                    placeholder={`Exemplo de como colar sua lista:
🥩 CARNES:
- Contra Filé Acebolado na Chapa
- Galinha Velha Guisada
- Chambaril com Pirão
- Frango Assado na Brasa

🍚 ARROZ:
- Arroz Branco
- Baião de Dois

🫘 FEIJÃO:
- Feijão Carioca
- Feijão Macáçar

🥗 ACOMPANHAMENTOS:
- Macarrão
- Farofa
- Vinagrete
- Salada de Maionese`}
                    className="w-full bg-stone-950 border border-stone-700 focus:border-amber-500 rounded-2xl p-4 text-xs sm:text-sm text-stone-100 placeholder:text-stone-600 focus:outline-none font-mono leading-relaxed resize-y"
                  />
                  {rawText && (
                    <button
                      type="button"
                      onClick={() => {
                        setRawText('');
                        setParsedItems([]);
                      }}
                      className="absolute top-3 right-3 text-xs bg-stone-800 hover:bg-stone-700 text-stone-300 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      Limpar
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-stone-400">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Reconhecimento inteligente: separa carnes, arrozes, feijões e acompanhamentos automaticamente!
                  </span>
                  <span className="font-bold text-amber-300">
                    {parsedItems.length} pratos identificados
                  </span>
                </div>
              </div>

              {/* Step 2: Interactive Category Organizer */}
              {parsedItems.length > 0 && (
                <div className="space-y-4 pt-2 border-t border-stone-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 text-[11px] font-black flex items-center justify-center">2</span>
                      Confira e ajuste cada item nos espaços necessários:
                    </span>
                    <span className="text-[11px] text-stone-400">
                      Você pode renomear, mudar a categoria ou excluir se desejar
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* CARNES BOX */}
                    <div className="bg-stone-950 border border-stone-800 rounded-2xl p-3.5 space-y-2.5">
                      <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                        <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                          🥩 Carnes ({carnes.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddBlankItem('carnes')}
                          className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" /> Adicionar Carne
                        </button>
                      </div>
                      <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                        {carnes.length === 0 ? (
                          <div className="text-[11px] text-stone-600 italic py-2 text-center">Nenhuma carne listada</div>
                        ) : (
                          carnes.map(item => renderParsedRow(item, handleUpdateItemName, handleUpdateItemCategory, handleDeleteParsedItem))
                        )}
                      </div>
                    </div>

                    {/* ACOMPANHAMENTOS BOX */}
                    <div className="bg-stone-950 border border-stone-800 rounded-2xl p-3.5 space-y-2.5">
                      <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                        <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                          🥗 Acompanhamentos ({acomp.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddBlankItem('acompanhamentos')}
                          className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" /> Adicionar Acomp.
                        </button>
                      </div>
                      <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
                        {acomp.length === 0 ? (
                          <div className="text-[11px] text-stone-600 italic py-2 text-center">Nenhum acompanhamento listado</div>
                        ) : (
                          acomp.map(item => renderParsedRow(item, handleUpdateItemName, handleUpdateItemCategory, handleDeleteParsedItem))
                        )}
                      </div>
                    </div>

                    {/* ARROZ BOX */}
                    <div className="bg-stone-950 border border-stone-800 rounded-2xl p-3.5 space-y-2.5">
                      <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                        <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                          🍚 Opções de Arroz ({arrozes.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddBlankItem('arroz')}
                          className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" /> Adicionar Arroz
                        </button>
                      </div>
                      <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                        {arrozes.length === 0 ? (
                          <div className="text-[11px] text-stone-600 italic py-2 text-center">Nenhum arroz listado</div>
                        ) : (
                          arrozes.map(item => renderParsedRow(item, handleUpdateItemName, handleUpdateItemCategory, handleDeleteParsedItem))
                        )}
                      </div>
                    </div>

                    {/* FEIJÃO BOX */}
                    <div className="bg-stone-950 border border-stone-800 rounded-2xl p-3.5 space-y-2.5">
                      <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                        <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                          🫘 Opções de Feijão ({feijoes.length})
                        </span>
                        <button
                          type="button"
                          onClick={() => handleAddBlankItem('feijao')}
                          className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3 h-3" /> Adicionar Feijão
                        </button>
                      </div>
                      <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                        {feijoes.length === 0 ? (
                          <div className="text-[11px] text-stone-600 italic py-2 text-center">Nenhum feijão listado</div>
                        ) : (
                          feijoes.map(item => renderParsedRow(item, handleUpdateItemName, handleUpdateItemCategory, handleDeleteParsedItem))
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {/* Step 3: Destination Day & Save Settings */}
              {parsedItems.length > 0 && (
                <div className="bg-stone-950 border border-amber-800/50 rounded-2xl p-4 sm:p-5 space-y-4">
                  <span className="text-xs font-bold text-amber-200 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 text-[11px] font-black flex items-center justify-center">3</span>
                    Onde você deseja salvar e aplicar esta lista?
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Day selector */}
                    <div>
                      <label className="block text-[11px] text-stone-400 mb-1 font-semibold">
                        Dia da Semana de Destino:
                      </label>
                      <select
                        value={selectedDay}
                        onChange={(e) => setSelectedDay(e.target.value as DayOfWeek)}
                        className="w-full bg-stone-900 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 font-semibold focus:outline-none focus:border-amber-500"
                      >
                        {DAY_ORDER.map(d => (
                          <option key={d} value={d}>
                            {weeklySchedule[d]?.dayLabel || d} {d === currentDayOfWeek ? '(Hoje)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Mode selector */}
                    <div className="space-y-2">
                      <label className="block text-[11px] text-stone-400 font-semibold">
                        Modo de Importação:
                      </label>
                      <div className="space-y-1.5">
                        <label className="flex items-center gap-2 text-xs text-stone-200 cursor-pointer">
                          <input
                            type="radio"
                            name="replaceMode"
                            checked={replaceExisting}
                            onChange={() => setReplaceExisting(true)}
                            className="accent-amber-500"
                          />
                          <span>Substituir o cardápio deste dia com a nova lista</span>
                        </label>
                        <label className="flex items-center gap-2 text-xs text-stone-200 cursor-pointer">
                          <input
                            type="radio"
                            name="replaceMode"
                            checked={!replaceExisting}
                            onChange={() => setReplaceExisting(false)}
                            className="accent-amber-500"
                          />
                          <span>Somar aos pratos que já existem</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
                    <label className="flex items-center gap-2 text-xs text-amber-300 font-semibold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={applyImmediatelyToday}
                        onChange={(e) => setApplyImmediatelyToday(e.target.checked)}
                        className="accent-amber-500 w-4 h-4 rounded"
                      />
                      <span>Ativar imediatamente no cardápio do restaurante agora</span>
                    </label>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* TAB 2: EXPORT / COPY */}
          {activeTab === 'export' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-950 p-4 rounded-2xl border border-stone-800">
                <div>
                  <h3 className="text-sm font-bold text-amber-200">
                    Exportar Cardápio Formatado
                  </h3>
                  <p className="text-xs text-stone-400">
                    Gera a lista organizada por categorias, pronta para copiar e colar onde quiser.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value as DayOfWeek)}
                    className="bg-stone-900 border border-stone-700 rounded-xl px-3 py-1.5 text-xs text-stone-100 font-semibold focus:outline-none focus:border-amber-500"
                  >
                    {DAY_ORDER.map(d => (
                      <option key={d} value={d}>
                        {weeklySchedule[d]?.dayLabel || d} {d === currentDayOfWeek ? '(Hoje)' : ''}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={handleCopyExportText}
                    className={`px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md cursor-pointer ${
                      copiedExport
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-600 hover:bg-amber-500 text-stone-950'
                    }`}
                  >
                    {copiedExport ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copiar Lista</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="relative">
                <textarea
                  readOnly
                  rows={13}
                  value={exportText}
                  className="w-full bg-stone-950 border border-stone-700 rounded-2xl p-4 text-xs sm:text-sm text-stone-200 font-mono leading-relaxed focus:outline-none"
                />
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-stone-800 bg-stone-950 flex flex-col sm:flex-row items-center justify-between gap-3">
          {activeTab === 'import' ? (
            <>
              <div className="text-xs text-stone-400">
                {importSuccess ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <Check className="w-4 h-4" /> Importado com sucesso! ({importedCounts.added} novos, {importedCounts.updated} atualizados)
                  </span>
                ) : (
                  <span>Pratos prontos para importar: <strong className="text-amber-300">{parsedItems.length}</strong></span>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-4 py-2.5 text-xs font-semibold text-stone-400 hover:text-white rounded-xl bg-stone-900 hover:bg-stone-800 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  id="btn-confirm-import-bulk-menu"
                  disabled={parsedItems.length === 0}
                  onClick={handleExecuteImport}
                  className="flex-1 sm:flex-none px-6 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:hover:bg-amber-500 text-stone-950 font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Importar e Salvar no Cardápio</span>
                </button>
              </div>
            </>
          ) : (
            <div className="flex justify-end w-full">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 text-xs font-semibold text-stone-300 rounded-xl bg-stone-800 hover:bg-stone-700"
              >
                Fechar
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

// Helper row component for reviewing each parsed item
function renderParsedRow(
  item: ParsedImportItem,
  onUpdateName: (id: string, name: string) => void,
  onUpdateCat: (id: string, cat: ItemCategory) => void,
  onDelete: (id: string) => void
) {
  return (
    <div
      key={item.id}
      className="p-1.5 px-2 bg-stone-900 border border-stone-800 hover:border-stone-700 rounded-xl flex items-center justify-between gap-2"
    >
      <input
        type="text"
        value={item.name}
        placeholder="Nome do prato..."
        onChange={(e) => onUpdateName(item.id, e.target.value)}
        className="flex-1 bg-transparent text-xs text-stone-100 font-medium focus:outline-none focus:text-amber-200 truncate"
      />

      <div className="flex items-center gap-1 shrink-0">
        <select
          value={item.category}
          onChange={(e) => onUpdateCat(item.id, e.target.value as ItemCategory)}
          className="bg-stone-950 border border-stone-700 rounded-lg px-1.5 py-0.5 text-[10px] text-stone-300 focus:outline-none focus:border-amber-500"
        >
          <option value="carnes">Carnes</option>
          <option value="arroz">Arroz</option>
          <option value="feijao">Feijão</option>
          <option value="acompanhamentos">Acomp.</option>
          <option value="bebidas">Bebidas</option>
          <option value="sobremesas">Sobremesa</option>
        </select>

        <button
          type="button"
          onClick={() => onDelete(item.id)}
          className="w-5 h-5 rounded hover:bg-red-600 hover:text-white text-stone-500 flex items-center justify-center transition-colors"
          title="Remover este item"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
