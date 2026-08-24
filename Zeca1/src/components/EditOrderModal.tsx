import React, { useState } from 'react';
import { Order, OrderStatus, PaymentType } from '../types';
import { X, Pencil, Trash2, Check, DollarSign, MapPin, Phone, User, AlertTriangle } from 'lucide-react';

interface EditOrderModalProps {
  order: Order | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (orderId: string, updates: Partial<Order>) => void;
  onDelete: (orderId: string) => void;
}

export const EditOrderModal: React.FC<EditOrderModalProps> = ({
  order,
  isOpen,
  onClose,
  onSave,
  onDelete,
}) => {
  if (!isOpen || !order) return null;

  const [customerName, setCustomerName] = useState(order.address.customerName);
  const [phone, setPhone] = useState(order.address.phone);
  const [street, setStreet] = useState(order.address.street);
  const [number, setNumber] = useState(order.address.number);
  const [neighborhood, setNeighborhood] = useState(order.address.neighborhood);
  const [referencePoint, setReferencePoint] = useState(order.address.referencePoint || '');
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [paymentType, setPaymentType] = useState<PaymentType>(order.payment.type);
  const [isPaid, setIsPaid] = useState<boolean>(order.payment.isPaid);
  const [total, setTotal] = useState<number>(order.total);
  const [deliveryFee, setDeliveryFee] = useState<number>(order.deliveryFee);
  const [cashChangeFor, setCashChangeFor] = useState<number | undefined>(order.payment.cashChangeFor);
  const [notes, setNotes] = useState<string>(order.notes || '');

  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(order.id, {
      status,
      total: Number(total),
      deliveryFee: Number(deliveryFee),
      notes,
      address: {
        ...order.address,
        customerName,
        phone,
        street,
        number,
        neighborhood,
        referencePoint,
      },
      payment: {
        ...order.payment,
        type: paymentType,
        isPaid,
        cashChangeFor: paymentType === 'dinheiro' ? Number(cashChangeFor || 0) : undefined,
      },
    });
    onClose();
  };

  const handleDelete = () => {
    onDelete(order.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-amber-800/40 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 p-4 border-b border-amber-800/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-600/30 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Pencil className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-amber-100 font-serif">
                Editar Pedido #{order.orderNumber}
              </h3>
              <p className="text-[11px] text-amber-300/80">
                Altere status, endereço, pagamento ou exclua o pedido
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto">
          
          {/* Status Selection */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-300">
              Status do Pedido:
            </label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as OrderStatus)}
              className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-500"
            >
              <option value="recebido">📥 Recebido (Novo)</option>
              <option value="preparando">🍳 Preparando (No Fogão)</option>
              <option value="em_entrega">🛵 Em Entrega (Na Rota)</option>
              <option value="entregue">✅ Entregue (Finalizado)</option>
              <option value="cancelado">❌ Cancelado</option>
            </select>
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Nome do Cliente:
              </label>
              <input
                type="text"
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                required
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Telefone / WhatsApp:
              </label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
                className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Delivery Address */}
          <div className="space-y-2 pt-1 border-t border-stone-800">
            <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> Endereço de Entrega
            </h4>

            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-2">
                <label className="block text-[11px] text-stone-400 mb-0.5">Rua / Logradouro:</label>
                <input
                  type="text"
                  value={street}
                  onChange={e => setStreet(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-stone-400 mb-0.5">Número:</label>
                <input
                  type="text"
                  value={number}
                  onChange={e => setNumber(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-stone-400 mb-0.5">Bairro / Povoado:</label>
                <input
                  type="text"
                  value={neighborhood}
                  onChange={e => setNeighborhood(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-[11px] text-stone-400 mb-0.5">Ponto de Referência:</label>
                <input
                  type="text"
                  value={referencePoint}
                  onChange={e => setReferencePoint(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-1.5 text-xs text-white"
                />
              </div>
            </div>
          </div>

          {/* Payment & Values */}
          <div className="space-y-2 pt-1 border-t border-stone-800">
            <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5" /> Pagamento e Valores
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-stone-400 mb-0.5">Forma de Pagamento:</label>
                <select
                  value={paymentType}
                  onChange={e => setPaymentType(e.target.value as PaymentType)}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-1.5 text-xs text-white font-bold"
                >
                  <option value="pix">PIX</option>
                  <option value="dinheiro">Dinheiro</option>
                  <option value="cartao_entrega">Cartão na Entrega</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-stone-400 mb-0.5">Status do Pagamento:</label>
                <button
                  type="button"
                  onClick={() => setIsPaid(!isPaid)}
                  className={`w-full py-1.5 px-3 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 ${
                    isPaid
                      ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300'
                      : 'bg-amber-950/60 border-amber-600 text-amber-300'
                  }`}
                >
                  {isPaid ? '✅ PAGO / RECEBIDO' : '⏳ PENDENTE / A RECEBER'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-stone-400 mb-0.5">Valor Total (R$):</label>
                <input
                  type="number"
                  step="0.50"
                  value={total}
                  onChange={e => setTotal(Number(e.target.value))}
                  className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-1.5 text-xs text-amber-300 font-mono font-bold"
                />
              </div>

              {paymentType === 'dinheiro' && (
                <div>
                  <label className="block text-[11px] text-stone-400 mb-0.5">Troco para (R$):</label>
                  <input
                    type="number"
                    step="1"
                    value={cashChangeFor || ''}
                    onChange={e => setCashChangeFor(e.target.value ? Number(e.target.value) : undefined)}
                    placeholder="Ex: 50"
                    className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Observations */}
          <div className="pt-1 border-t border-stone-800">
            <label className="block text-[11px] text-stone-400 mb-0.5">Observações Gerais do Pedido:</label>
            <input
              type="text"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Ex: Entregar com rapidez, cliente preferencial, etc."
              className="w-full bg-stone-950 border border-stone-700 rounded-xl px-3 py-1.5 text-xs text-white"
            />
          </div>

          {/* Delete Danger Section */}
          <div className="pt-2 border-t border-red-900/40 bg-red-950/20 p-3 rounded-2xl border">
            {confirmDelete ? (
              <div className="space-y-2 text-center">
                <div className="flex items-center justify-center gap-1.5 text-red-400 text-xs font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Tem certeza que deseja apagar o pedido #{order.orderNumber}?</span>
                </div>
                <p className="text-[11px] text-stone-400">Esta ação não pode ser desfeita.</p>
                <div className="flex items-center justify-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="px-4 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Sim, Excluir Pedido</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-xs text-stone-400">Deseja remover este pedido do sistema?</span>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="px-3 py-1.5 rounded-xl bg-red-950 hover:bg-red-900 text-red-300 border border-red-800/60 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Excluir Pedido</span>
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition-colors"
            >
              Fechar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-black text-xs flex items-center gap-1.5 transition-colors shadow cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
