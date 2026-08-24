import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NEIGHBORHOODS_DELIVERY } from '../data/initialMenu';
import { DeliveryAddress, PaymentDetails, PaymentType } from '../types';
import { 
  X, 
  MapPin, 
  Phone, 
  User, 
  CreditCard, 
  Banknote, 
  QrCode, 
  Bike, 
  Store, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  MessageCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCompleted: (orderId: string, isPix: boolean) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderCompleted
}) => {
  const { cart, cartSubtotal, createOrder, restaurant, generateOrderWhatsAppUrl } = useApp();

  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'retirada'>('delivery');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState(NEIGHBORHOODS_DELIVERY[0].name);
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [referencePoint, setReferencePoint] = useState('');

  // Payment
  const [paymentType, setPaymentType] = useState<PaymentType>('pix');
  const [cardBrand, setCardBrand] = useState('Cartão de Crédito/Débito');
  const [needChange, setNeedChange] = useState(false);
  const [changeFor, setChangeFor] = useState('');

  if (!isOpen) return null;

  const currentNeighborhoodObj = NEIGHBORHOODS_DELIVERY.find(n => n.name === selectedNeighborhood) || NEIGHBORHOODS_DELIVERY[0];
  const deliveryFee = deliveryType === 'retirada' ? 0 : currentNeighborhoodObj.fee;
  const orderTotal = cartSubtotal + deliveryFee;

  const isFormValid = 
    customerName.trim().length >= 2 &&
    phone.trim().length >= 8 &&
    (deliveryType === 'retirada' || (street.trim().length >= 2 && number.trim().length >= 1));

  const handleFinishOrder = (sendWhatsAppDirect = false) => {
    if (!isFormValid) return;

    const address: DeliveryAddress = {
      customerName: customerName.trim(),
      phone: phone.trim(),
      street: deliveryType === 'retirada' ? 'Retirada no Balcão' : street.trim(),
      number: deliveryType === 'retirada' ? 'S/N' : number.trim(),
      neighborhood: deliveryType === 'retirada' ? 'Restaurante Do Zeca' : selectedNeighborhood,
      complement: complement.trim() ? complement.trim() : undefined,
      referencePoint: referencePoint.trim() ? referencePoint.trim() : undefined,
      deliveryType,
    };

    const payment: PaymentDetails = {
      type: paymentType,
      cardBrand: paymentType === 'cartao_entrega' ? cardBrand : undefined,
      cashChangeFor: paymentType === 'dinheiro' && needChange && Number(changeFor) > orderTotal ? Number(changeFor) : undefined,
      isPaid: false,
    };

    const newOrder = createOrder(address, payment, deliveryFee);

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 }
    });

    if (sendWhatsAppDirect) {
      const waUrl = generateOrderWhatsAppUrl(newOrder);
      window.open(waUrl, '_blank');
    }

    onClose();
    onOrderCompleted(newOrder.id, paymentType === 'pix');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-stone-900 border border-amber-800/40 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col text-white max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950 via-stone-900 to-amber-950 p-4 sm:p-5 border-b border-amber-800/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600/30 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Bike className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-serif text-amber-100">
                Finalizar Pedido de Quentinha
              </h2>
              <p className="text-xs text-amber-300/70">
                Restaurante Do Zeca • Pindorama - AL
              </p>
            </div>
          </div>

          <button
            id="close-checkout-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* 1. Dados Pessoais */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-amber-200 uppercase tracking-wide flex items-center gap-2">
              <User className="w-4 h-4 text-amber-500" />
              <span>1. Seus Dados de Contato</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="customer-name" className="block text-xs font-semibold text-stone-300 mb-1">
                  Seu Nome Completo *
                </label>
                <input
                  id="customer-name"
                  type="text"
                  required
                  placeholder="Ex: João da Silva"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3.5 py-2.5 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label htmlFor="customer-phone" className="block text-xs font-semibold text-stone-300 mb-1">
                  WhatsApp / Celular com DDD *
                </label>
                <input
                  id="customer-phone"
                  type="tel"
                  required
                  placeholder="(82) 99999-9999"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3.5 py-2.5 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* 2. Modalidade e Endereço */}
          <div className="space-y-3 pt-3 border-t border-stone-800">
            <h3 className="text-sm font-bold text-amber-200 uppercase tracking-wide flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-500" />
              <span>2. Como Deseja Receber?</span>
            </h3>

            {/* Delivery vs Retirada Tabs */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="select-delivery-type-btn"
                onClick={() => setDeliveryType('delivery')}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-all ${
                  deliveryType === 'delivery'
                    ? 'bg-amber-950/70 border-amber-500 text-amber-200 ring-1 ring-amber-500'
                    : 'bg-stone-800/40 border-stone-700 text-stone-400 hover:text-stone-200'
                }`}
              >
                <Bike className="w-4 h-4" />
                <span>Entrega em Domicílio</span>
              </button>

              <button
                type="button"
                id="select-pickup-type-btn"
                onClick={() => setDeliveryType('retirada')}
                className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold text-xs transition-all ${
                  deliveryType === 'retirada'
                    ? 'bg-amber-950/70 border-amber-500 text-amber-200 ring-1 ring-amber-500'
                    : 'bg-stone-800/40 border-stone-700 text-stone-400 hover:text-stone-200'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>Retirar no Balcão (Grátis)</span>
              </button>
            </div>

            {deliveryType === 'delivery' ? (
              <div className="space-y-3 bg-stone-800/40 p-3.5 rounded-xl border border-stone-700/60">
                <div>
                  <label htmlFor="neighborhood-select" className="block text-xs font-semibold text-stone-300 mb-1">
                    Bairro / Região em Pindorama *
                  </label>
                  <select
                    id="neighborhood-select"
                    value={selectedNeighborhood}
                    onChange={e => setSelectedNeighborhood(e.target.value)}
                    className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3.5 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-amber-500"
                  >
                    {NEIGHBORHOODS_DELIVERY.filter(n => n.name !== 'Retirada no Balcão (Grátis)').map(n => (
                      <option key={n.name} value={n.name}>
                        {n.name} — Taxa: R$ {n.fee.toFixed(2)} (Aprox. {n.estimatedMin} min)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label htmlFor="street-address" className="block text-xs font-semibold text-stone-300 mb-1">
                      Rua / Avenida *
                    </label>
                    <input
                      id="street-address"
                      type="text"
                      required
                      placeholder="Ex: Rua das Flores"
                      value={street}
                      onChange={e => setStreet(e.target.value)}
                      className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="street-number" className="block text-xs font-semibold text-stone-300 mb-1">
                      Número *
                    </label>
                    <input
                      id="street-number"
                      type="text"
                      required
                      placeholder="Nº ou S/N"
                      value={number}
                      onChange={e => setNumber(e.target.value)}
                      className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-sm text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="address-complement" className="block text-xs font-semibold text-stone-300 mb-1">
                      Complemento (Apto, Bloco, Casa dos fundos)
                    </label>
                    <input
                      id="address-complement"
                      type="text"
                      placeholder="Opcional"
                      value={complement}
                      onChange={e => setComplement(e.target.value)}
                      className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="address-reference" className="block text-xs font-semibold text-stone-300 mb-1">
                      Ponto de Referência
                    </label>
                    <input
                      id="address-reference"
                      type="text"
                      placeholder="Ex: Próximo à pracinha"
                      value={referencePoint}
                      onChange={e => setReferencePoint(e.target.value)}
                      className="w-full bg-stone-800 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-amber-950/30 border border-amber-800/40 p-3.5 rounded-xl text-xs text-amber-200/90 space-y-1">
                <p className="font-bold text-amber-300">📍 Endereço para Retirada:</p>
                <p>{restaurant.address} - {restaurant.city}</p>
                <p className="text-stone-400">Tempo médio de preparo: 15 a 20 minutos.</p>
              </div>
            )}
          </div>

          {/* 3. Forma de Pagamento */}
          <div className="space-y-3 pt-3 border-t border-stone-800">
            <h3 className="text-sm font-bold text-amber-200 uppercase tracking-wide flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-amber-500" />
              <span>3. Forma de Pagamento</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              
              {/* PIX */}
              <div
                id="payment-pix-btn"
                onClick={() => setPaymentType('pix')}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentType === 'pix'
                    ? 'bg-emerald-950/70 border-emerald-500 text-white ring-1 ring-emerald-500 shadow'
                    : 'bg-stone-800/40 border-stone-700 text-stone-300 hover:border-emerald-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs flex items-center gap-1.5 text-emerald-400">
                    <QrCode className="w-4 h-4" />
                    <span>PIX Instantâneo</span>
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-1.5 py-0.2 rounded">
                    Recomendado
                  </span>
                </div>
                <p className="text-[11px] text-stone-400">QR Code gerado na hora com confirmação rápida</p>
              </div>

              {/* Cartão na Entrega */}
              <div
                id="payment-card-btn"
                onClick={() => setPaymentType('cartao_entrega')}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentType === 'cartao_entrega'
                    ? 'bg-amber-950/70 border-amber-500 text-white ring-1 ring-amber-500 shadow'
                    : 'bg-stone-800/40 border-stone-700 text-stone-300 hover:border-amber-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs flex items-center gap-1.5 text-amber-400">
                    <CreditCard className="w-4 h-4" />
                    <span>Cartão na Entrega</span>
                  </span>
                </div>
                <p className="text-[11px] text-stone-400">O motoboy leva a maquininha (Crédito/Débito)</p>
              </div>

              {/* Dinheiro */}
              <div
                id="payment-cash-btn"
                onClick={() => setPaymentType('dinheiro')}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  paymentType === 'dinheiro'
                    ? 'bg-amber-950/70 border-amber-500 text-white ring-1 ring-amber-500 shadow'
                    : 'bg-stone-800/40 border-stone-700 text-stone-300 hover:border-amber-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs flex items-center gap-1.5 text-amber-400">
                    <Banknote className="w-4 h-4" />
                    <span>Dinheiro Físico</span>
                  </span>
                </div>
                <p className="text-[11px] text-stone-400">Pagamento na entrega (com ou sem troco)</p>
              </div>
            </div>

            {/* Dinheiro Change selector */}
            {paymentType === 'dinheiro' && (
              <div className="bg-stone-800/60 p-3 rounded-xl border border-stone-700 space-y-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-stone-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={needChange}
                    onChange={e => setNeedChange(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>Preciso de troco</span>
                </label>

                {needChange && (
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs text-stone-400">Troco para: R$</span>
                    <input
                      type="number"
                      placeholder="Ex: 50"
                      value={changeFor}
                      onChange={e => setChangeFor(e.target.value)}
                      className="w-28 bg-stone-800 border border-stone-600 rounded-lg px-2 py-1 text-xs text-stone-100"
                    />
                    {Number(changeFor) > orderTotal && (
                      <span className="text-xs text-emerald-400 font-bold">
                        Troco de R$ {(Number(changeFor) - orderTotal).toFixed(2)}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Cartão selector */}
            {paymentType === 'cartao_entrega' && (
              <div className="bg-stone-800/60 p-3 rounded-xl border border-stone-700 space-y-1.5">
                <span className="text-xs font-semibold text-stone-300 block">Tipo de Cartão:</span>
                <div className="flex gap-2 flex-wrap">
                  {['Cartão de Crédito', 'Cartão de Débito', 'Vale Refeição / Alimentação'].map(brand => (
                    <button
                      key={brand}
                      type="button"
                      onClick={() => setCardBrand(brand)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                        cardBrand === brand
                          ? 'bg-amber-600 border-amber-400 text-stone-950 font-bold'
                          : 'bg-stone-800 border-stone-700 text-stone-300'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* 4. Resumo Financeiro */}
          <div className="bg-stone-950 p-4 rounded-xl border border-stone-800 space-y-2 text-xs text-stone-300">
            <div className="flex justify-between">
              <span>Marmitas e Itens ({cart.length}):</span>
              <span className="font-bold text-stone-200">R$ {cartSubtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxa de Entrega ({deliveryType === 'delivery' ? selectedNeighborhood : 'Balcão'}):</span>
              <span className="font-bold text-amber-400">
                {deliveryFee === 0 ? 'Grátis' : `R$ ${deliveryFee.toFixed(2)}`}
              </span>
            </div>
            <div className="pt-2 border-t border-stone-800 flex justify-between items-center text-sm font-bold">
              <span className="text-amber-100">Total a Pagar:</span>
              <span className="text-xl font-black text-amber-400">R$ {orderTotal.toFixed(2)}</span>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-stone-950 border-t border-amber-800/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-stone-400 text-center sm:text-left flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Rastreamento em tempo real após a confirmação</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              id="submit-order-wa-btn"
              type="button"
              disabled={!isFormValid}
              onClick={() => handleFinishOrder(true)}
              className={`flex-1 sm:flex-none py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
                isFormValid
                  ? 'bg-emerald-700 hover:bg-emerald-600 text-white cursor-pointer'
                  : 'bg-stone-800 text-stone-500 cursor-not-allowed'
              }`}
              title="Confirmar e abrir no WhatsApp do Restaurante"
            >
              <MessageCircle className="w-4 h-4 text-emerald-300" />
              <span>Confirmar + WhatsApp</span>
            </button>

            <button
              id="submit-order-direct-btn"
              type="button"
              disabled={!isFormValid}
              onClick={() => handleFinishOrder(false)}
              className={`flex-1 sm:flex-none py-3 px-5 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                isFormValid
                  ? 'bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 shadow-amber-950/60 active:scale-98 cursor-pointer'
                  : 'bg-stone-800 text-stone-500 cursor-not-allowed border border-stone-700'
              }`}
            >
              <span>{paymentType === 'pix' ? 'Gerar PIX e Rastrear' : 'Confirmar Pedido'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
