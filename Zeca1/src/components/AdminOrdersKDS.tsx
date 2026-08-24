import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Order, OrderStatus } from '../types';
import { EditOrderModal } from './EditOrderModal';
import { 
  ChefHat, 
  Bike, 
  CheckCircle2, 
  Clock, 
  Phone, 
  MessageCircle, 
  Printer, 
  ShoppingBag, 
  Check, 
  AlertCircle,
  Play,
  Flame,
  Utensils,
  QrCode,
  Banknote,
  CreditCard,
  DollarSign,
  AlertTriangle,
  Pencil,
  Trash2
} from 'lucide-react';

export const AdminOrdersKDS: React.FC = () => {
  const { 
    orders, 
    updateOrderStatus, 
    updateOrder, 
    deleteOrder, 
    toggleOrderPaymentPaid, 
    restaurant, 
    generateOrderWhatsAppUrl 
  } = useApp();
  
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('todos');
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [orderToDeleteId, setOrderToDeleteId] = useState<string | null>(null);

  const handleOpenEdit = (order: Order) => {
    setEditingOrder(order);
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (orderId: string, updates: Partial<Order>) => {
    updateOrder(orderId, updates);
  };

  const handleDeleteOrder = (orderId: string) => {
    deleteOrder(orderId);
    setOrderToDeleteId(null);
  };

  const filteredOrders = selectedStatusFilter === 'todos'
    ? orders
    : orders.filter(o => o.status === selectedStatusFilter);

  const pendingCount = orders.filter(o => o.status === 'recebido').length;
  const preparingCount = orders.filter(o => o.status === 'preparando').length;
  const deliveringCount = orders.filter(o => o.status === 'em_entrega').length;

  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const totalPaid = orders.filter(o => o.payment.isPaid).reduce((sum, o) => sum + o.total, 0);
  const totalPending = totalSales - totalPaid;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      
      {/* Top Banner with Financial & Status Summary */}
      <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 border border-amber-800/40 rounded-3xl p-5 sm:p-6 shadow-2xl text-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-600/30 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <ChefHat className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold font-serif text-amber-100">
              Painel de Pedidos da Cozinha & Caixa (KDS)
            </h2>
            <p className="text-xs text-amber-300/80">
              Controle de montagem de quentinhas, entregas e conferência de pagamentos (PIX, Dinheiro, Cartão)
            </p>
          </div>
        </div>

        {/* Quick metrics */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status counters */}
          <div className="bg-stone-950/80 border border-amber-500/40 px-3 py-1.5 rounded-xl text-center">
            <div className="text-[10px] text-amber-300 font-bold uppercase">Novos</div>
            <div className="text-base font-black text-amber-400">{pendingCount}</div>
          </div>
          <div className="bg-stone-950/80 border border-orange-500/40 px-3 py-1.5 rounded-xl text-center">
            <div className="text-[10px] text-orange-300 font-bold uppercase">Fogão</div>
            <div className="text-base font-black text-orange-400">{preparingCount}</div>
          </div>
          <div className="bg-stone-950/80 border border-blue-500/40 px-3 py-1.5 rounded-xl text-center">
            <div className="text-[10px] text-blue-300 font-bold uppercase">Na Rota</div>
            <div className="text-base font-black text-blue-400">{deliveringCount}</div>
          </div>

          {/* Payment breakdown */}
          <div className="bg-stone-950/90 border border-emerald-500/40 px-3 py-1.5 rounded-xl text-center">
            <div className="text-[10px] text-emerald-300 font-bold uppercase flex items-center justify-center gap-1">
              <span>Recebido</span>
            </div>
            <div className="text-sm font-black text-emerald-400 font-mono">
              R$ {totalPaid.toFixed(2)}
            </div>
          </div>

          {totalPending > 0 && (
            <div className="bg-stone-950/90 border border-amber-500/40 px-3 py-1.5 rounded-xl text-center">
              <div className="text-[10px] text-amber-300 font-bold uppercase flex items-center justify-center gap-1">
                <span>A Receber</span>
              </div>
              <div className="text-sm font-black text-amber-400 font-mono">
                R$ {totalPending.toFixed(2)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'todos', label: `Todos (${orders.length})` },
          { id: 'recebido', label: `Novos (${pendingCount})` },
          { id: 'preparando', label: `No Fogão (${preparingCount})` },
          { id: 'em_entrega', label: `Na Rota (${deliveringCount})` },
          { id: 'entregue', label: 'Concluídos' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedStatusFilter(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedStatusFilter === tab.id
                ? 'bg-amber-500 text-stone-950 shadow-md font-black'
                : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="bg-stone-900/60 border border-stone-800 rounded-3xl p-12 text-center text-stone-400 space-y-3">
          <Utensils className="w-10 h-10 mx-auto text-stone-600" />
          <h4 className="font-bold text-stone-300">Nenhum pedido nesta categoria</h4>
          <p className="text-xs text-stone-500">
            Quando os clientes fecharem pedidos no cardápio, eles aparecerão aqui com status de pagamento e itens.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map(order => {
            const isRecebido = order.status === 'recebido';
            const isPreparando = order.status === 'preparando';
            const isEmEntrega = order.status === 'em_entrega';
            const isEntregue = order.status === 'entregue';
            const isPaid = order.payment.isPaid;
            const isPix = order.payment.type === 'pix';
            const isDinheiro = order.payment.type === 'dinheiro';
            const isCartao = order.payment.type === 'cartao_entrega' || order.payment.type === 'cartao_online';

            const changeAmount = order.payment.cashChangeFor 
              ? Math.max(0, order.payment.cashChangeFor - order.total) 
              : 0;

            return (
              <div
                key={order.id}
                id={`kds-order-card-${order.id}`}
                className={`bg-stone-900/90 rounded-2xl border flex flex-col justify-between overflow-hidden shadow-xl transition-all ${
                  isRecebido
                    ? 'border-amber-500 ring-1 ring-amber-500/50'
                    : isPreparando
                    ? 'border-orange-500/80'
                    : isEmEntrega
                    ? 'border-blue-500/80'
                    : 'border-stone-800 opacity-80'
                }`}
              >
                {/* Header */}
                <div className={`p-3.5 flex justify-between items-center text-xs font-bold ${
                  isRecebido 
                    ? 'bg-amber-950/80 text-amber-200' 
                    : isPreparando 
                    ? 'bg-orange-950/80 text-orange-200' 
                    : isEmEntrega 
                    ? 'bg-blue-950/80 text-blue-200' 
                    : 'bg-stone-950 text-stone-400'
                }`}>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-sm">#{order.orderNumber}</span>
                    <span>•</span>
                    <span>{new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="uppercase text-[10px] px-2 py-0.5 rounded-full bg-stone-900/80 font-black">
                      {order.status.replace('_', ' ')}
                    </span>

                    {/* Botão de Lápis (Editar) */}
                    <button
                      id={`kds-edit-order-btn-${order.id}`}
                      type="button"
                      onClick={() => handleOpenEdit(order)}
                      className="w-6 h-6 rounded-lg bg-stone-800/80 hover:bg-amber-600 hover:text-stone-950 text-stone-300 flex items-center justify-center transition-all cursor-pointer shadow"
                      title="Editar Pedido (Lápis)"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>

                    {/* Botão de Lixeira (Excluir) */}
                    <button
                      id={`kds-delete-order-btn-${order.id}`}
                      type="button"
                      onClick={() => setOrderToDeleteId(order.id)}
                      className="w-6 h-6 rounded-lg bg-stone-800/80 hover:bg-red-600 hover:text-white text-stone-400 flex items-center justify-center transition-all cursor-pointer shadow"
                      title="Excluir Pedido"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 space-y-3 flex-1">
                  
                  {/* Customer details */}
                  <div className="text-xs space-y-0.5 border-b border-stone-800 pb-2.5">
                    <div className="flex justify-between font-bold text-stone-200">
                      <span>{order.address.customerName}</span>
                      <span className="text-amber-400 font-mono">{order.address.phone}</span>
                    </div>
                    <div className="text-stone-400 text-[11px]">
                      📍 {order.address.deliveryType === 'delivery' 
                        ? `${order.address.street}, Nº ${order.address.number} (${order.address.neighborhood})`
                        : 'Retirada no Balcão'}
                    </div>
                    {order.address.referencePoint && (
                      <div className="text-stone-500 text-[10px]">Ref: {order.address.referencePoint}</div>
                    )}
                  </div>

                  {/* Items List (Quentinhas Breakdown) */}
                  <div className="space-y-2 text-xs">
                    {order.items.map((it, i) => (
                      <div key={i} className="bg-stone-950/80 p-2.5 rounded-xl border border-stone-800">
                        {it.type === 'marmita' && it.marmita ? (
                          <div>
                            <div className="font-bold text-amber-300 text-xs">
                              {it.quantity}x {it.marmita.size.name}
                            </div>
                            <div className="text-[11px] text-stone-300 mt-1 space-y-0.5">
                              <div><strong className="text-amber-400">Carnes:</strong> {it.marmita.selectedMeats.length > 0 ? it.marmita.selectedMeats.join(', ') : 'Nenhuma'}</div>
                              <div>
                                <strong className="text-amber-400">Arroz:</strong>{' '}
                                {it.marmita.selectedRice.length > 0 ? it.marmita.selectedRice.join(', ') : <span className="text-amber-400/90 font-bold bg-stone-900 px-1 rounded">🚫 SEM ARROZ</span>}
                              </div>
                              <div>
                                <strong className="text-amber-400">Feijão:</strong>{' '}
                                {it.marmita.selectedBeans.length > 0 ? it.marmita.selectedBeans.join(', ') : <span className="text-amber-400/90 font-bold bg-stone-900 px-1 rounded">🚫 SEM FEIJÃO</span>}
                              </div>
                              {it.marmita.selectedSides.length > 0 && (
                                <div><strong className="text-amber-400">Acomp:</strong> {it.marmita.selectedSides.join(', ')}</div>
                              )}
                              {it.marmita.notes && (
                                <div className="text-amber-200 bg-amber-950/50 px-1.5 py-0.5 rounded text-[10px] mt-1 font-medium border border-amber-800/40">
                                  ⚠️ Obs: {it.marmita.notes}
                                </div>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="font-bold text-stone-200">
                            {it.quantity}x {it.singleItem?.name}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* PROMINENT PAYMENT SECTION (Como foi pago e status) */}
                  <div className={`p-3 rounded-xl border text-xs space-y-2 ${
                    isPaid
                      ? 'bg-emerald-950/40 border-emerald-800/50 text-emerald-200'
                      : isPix
                      ? 'bg-amber-950/40 border-amber-700/60 text-amber-200'
                      : 'bg-stone-950 border-stone-800 text-stone-300'
                  }`}>
                    <div className="flex items-center justify-between font-bold">
                      <div className="flex items-center gap-1.5">
                        {isPix && <QrCode className="w-4 h-4 text-emerald-400" />}
                        {isDinheiro && <Banknote className="w-4 h-4 text-amber-400" />}
                        {isCartao && <CreditCard className="w-4 h-4 text-blue-400" />}
                        <span className="uppercase text-xs tracking-wider">
                          {isPix ? 'PIX' : isDinheiro ? 'Dinheiro' : 'Cartão'}
                        </span>
                      </div>
                      
                      <div className="text-sm font-black text-amber-400 font-mono">
                        R$ {order.total.toFixed(2)}
                      </div>
                    </div>

                    {/* Specific details per payment method */}
                    {isPix && (
                      <div className="text-[11px] space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-stone-300">Status do PIX:</span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            isPaid 
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                          }`}>
                            {isPaid ? '✅ PIX PAGO / CONFIRMADO' : '⏳ AGUARDANDO COMPROVANTE'}
                          </span>
                        </div>
                        <p className="text-[10px] text-stone-400">
                          {isPaid 
                            ? 'O valor já caiu na sua conta via PIX.' 
                            : 'Peça o comprovante no WhatsApp antes de despachar.'}
                        </p>
                      </div>
                    )}

                    {isDinheiro && (
                      <div className="text-[11px] space-y-1 bg-stone-900/80 p-2 rounded-lg border border-stone-800">
                        {order.payment.cashChangeFor ? (
                          <>
                            <div className="flex justify-between text-stone-200">
                              <span>Cliente vai pagar com:</span>
                              <strong className="text-amber-300 font-mono">R$ {order.payment.cashChangeFor.toFixed(2)}</strong>
                            </div>
                            <div className="flex justify-between text-emerald-300 font-bold bg-emerald-950/60 px-1.5 py-1 rounded border border-emerald-800/40">
                              <span>🪙 Motoboy levar de troco:</span>
                              <span className="font-mono">R$ {changeAmount.toFixed(2)}</span>
                            </div>
                          </>
                        ) : (
                          <div className="text-emerald-400 font-semibold flex items-center gap-1">
                            <span>✅ Dinheiro exato (Não precisa de troco)</span>
                          </div>
                        )}
                      </div>
                    )}

                    {isCartao && (
                      <div className="text-[11px] bg-stone-900/80 p-2 rounded-lg border border-stone-800 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-stone-300">Tipo:</span>
                          <strong className="text-blue-300 uppercase">{order.payment.cardBrand || 'Débito / Crédito'}</strong>
                        </div>
                        <div className="text-[10px] text-amber-300 font-medium">
                          🛵 Entregar com Maquininha de Cartão
                        </div>
                      </div>
                    )}

                    {/* Toggle Payment Status Button */}
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => toggleOrderPaymentPaid(order.id)}
                        className={`w-full py-1.5 px-2 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isPaid
                            ? 'bg-stone-800 hover:bg-stone-700 text-stone-300'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-black shadow'
                        }`}
                      >
                        {isPaid ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Pago (Clique para desfazer)</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Confirmar Pagamento Recebido</span>
                          </>
                        )}
                      </button>
                    </div>

                  </div>

                </div>

                {/* Actions Footer */}
                <div className="p-3 bg-stone-950 border-t border-stone-800 flex items-center justify-between gap-2">
                  <a
                    href={generateOrderWhatsAppUrl(order)}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-emerald-800/70 hover:bg-emerald-700 text-white text-xs flex items-center gap-1 transition-colors"
                    title="Conversar no WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </a>

                  {/* Progression button */}
                  {isRecebido && (
                    <button
                      id={`kds-accept-order-${order.id}`}
                      onClick={() => updateOrderStatus(order.id, 'preparando')}
                      className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow"
                    >
                      <Flame className="w-3.5 h-3.5" />
                      <span>Aceitar e Montar Marmita</span>
                    </button>
                  )}

                  {isPreparando && (
                    <button
                      id={`kds-dispatch-order-${order.id}`}
                      onClick={() => updateOrderStatus(order.id, 'em_entrega')}
                      className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow"
                    >
                      <Bike className="w-3.5 h-3.5" />
                      <span>Despachar Motoboy</span>
                    </button>
                  )}

                  {isEmEntrega && (
                    <button
                      id={`kds-finish-order-${order.id}`}
                      onClick={() => updateOrderStatus(order.id, 'entregue')}
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Marcar como Entregue</span>
                    </button>
                  )}

                  {isEntregue && (
                    <div className="flex-1 text-center text-xs text-emerald-400 font-bold py-1.5 flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Pedido Entregue</span>
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Edit Order Modal */}
      <EditOrderModal
        order={editingOrder}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingOrder(null);
        }}
        onSave={handleSaveEdit}
        onDelete={handleDeleteOrder}
      />

      {/* Quick Delete Confirmation Dialog */}
      {orderToDeleteId && (
        <div className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-stone-900 border border-red-800/60 rounded-3xl p-5 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-red-950 border border-red-700/60 flex items-center justify-center text-red-400 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Excluir este pedido?</h3>
              <p className="text-xs text-stone-400 mt-1">
                O pedido será removido do painel da cozinha e do histórico.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setOrderToDeleteId(null)}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => handleDeleteOrder(orderToDeleteId)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Sim, Excluir</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

