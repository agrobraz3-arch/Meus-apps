import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  ShieldCheck, 
  CreditCard, 
  QrCode, 
  Barcode, 
  MessageCircle, 
  Truck, 
  Copy, 
  ArrowLeft, 
  ArrowRight, 
  Sparkles,
  Lock,
  Calendar,
  AlertCircle,
  FileCheck,
  Share2,
  User,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, CustomerInfo, Order, PaymentMethod, StoreSettings, CustomerUser } from '../types';
import { 
  formatCurrency, 
  generateOrderNumber, 
  calculateShipping, 
  generatePixPayload,
  generateWhatsAppOrderUrl 
} from '../utils';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  appliedCoupon: string;
  initialDiscount: number;
  onOrderCompleted: (order: Order) => void;
  settings: StoreSettings;
  currentUser?: CustomerUser | null;
  onOpenAccount?: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  appliedCoupon,
  initialDiscount,
  onOrderCompleted,
  settings,
  currentUser,
  onOpenAccount,
}) => {
  const [step, setStep] = useState<'details' | 'payment' | 'success'>('details');
  
  // Customer Info Form
  const [customer, setCustomer] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: 'SP',
    notes: '',
  });

  // Pre-fill from currentUser when available or when opened
  useEffect(() => {
    if (currentUser && isOpen) {
      setCustomer((prev) => ({
        ...prev,
        name: currentUser.name || prev.name,
        email: currentUser.email || prev.email,
        phone: currentUser.phone || prev.phone,
        cpf: currentUser.cpf || prev.cpf,
        cep: currentUser.address?.cep || prev.cep,
        street: currentUser.address?.street || prev.street,
        number: currentUser.address?.number || prev.number,
        complement: currentUser.address?.complement || prev.complement,
        neighborhood: currentUser.address?.neighborhood || prev.neighborhood,
        city: currentUser.address?.city || prev.city,
        state: currentUser.address?.state || prev.state,
      }));
    }
  }, [currentUser, isOpen]);

  const [isLoadingCep, setIsLoadingCep] = useState(false);

  const handleFetchCepCheckout = async (cepVal: string) => {
    const clean = cepVal.replace(/\D/g, '');
    if (clean.length === 8) {
      setIsLoadingCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setCustomer((prev) => ({
            ...prev,
            street: data.logradouro || prev.street,
            neighborhood: data.bairro || prev.neighborhood,
            city: data.localidade || prev.city,
            state: data.uf || prev.state,
          }));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoadingCep(false);
      }
    }
  };
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Payment States
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [installments, setInstallments] = useState(1);
  const [cardData, setCardData] = useState({
    number: '',
    name: '',
    expiry: '',
    cvv: '',
  });
  const [copiedPix, setCopiedPix] = useState(false);
  const [copiedDirectPix, setCopiedDirectPix] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Completed Order State
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  if (!isOpen) return null;

  const subtotal = cart.reduce(
    (sum, item) => sum + (item.product.price * item.quantity) + (item.giftBox ? 19.90 * item.quantity : 0),
    0
  );

  const shippingInfo = calculateShipping(customer.cep || '01310-100', subtotal, settings.freeShippingThreshold);
  const shippingFee = shippingInfo.price;

  // PIX gets additional 5% off subtotal
  const pixExtraDiscount = paymentMethod === 'pix' ? subtotal * 0.05 : 0;
  const totalDiscount = initialDiscount + pixExtraDiscount;
  const totalToPay = Math.max(0, subtotal - totalDiscount + shippingFee);

  // Validate Step 1 details
  const validateDetails = (): boolean => {
    const errors: Record<string, string> = {};
    if (!customer.name.trim()) errors.name = 'Informe seu nome completo';
    if (!customer.phone.trim() || customer.phone.length < 10) errors.phone = 'Informe seu WhatsApp com DDD';
    if (!customer.email.trim() || !customer.email.includes('@')) errors.email = 'Informe um e-mail válido';
    if (!customer.cep.trim() || customer.cep.length < 8) errors.cep = 'Informe o CEP de entrega';
    if (!customer.street.trim()) errors.street = 'Informe o endereço';
    if (!customer.number.trim()) errors.number = 'Número obrigatório';
    if (!customer.neighborhood.trim()) errors.neighborhood = 'Bairro obrigatório';
    if (!customer.city.trim()) errors.city = 'Cidade obrigatória';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNextToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateDetails()) {
      setStep('payment');
    }
  };

  const handleFinalizePayment = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const newOrder: Order = {
        id: 'ord_' + Date.now(),
        orderNumber: generateOrderNumber(),
        date: new Date().toISOString(),
        items: [...cart],
        customer: { ...customer },
        subtotal,
        discount: totalDiscount,
        shipping: shippingFee,
        total: totalToPay,
        paymentMethod,
        status: paymentMethod === 'pix' ? 'paid' : 'pending',
        trackingCode: `DS${Math.floor(100000000 + Math.random() * 900000000)}BR`,
        installments: paymentMethod === 'credit_card' ? installments : undefined,
      };

      setCompletedOrder(newOrder);
      onOrderCompleted(newOrder);
      setIsProcessing(false);
      setStep('success');

      // Trigger Confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#F59E0B', '#10B981', '#ffffff'],
        });
      } catch (e) {
        // ignore
      }
    }, 1200);
  };

  const handleCopyPix = (pixCode: string) => {
    navigator.clipboard.writeText(pixCode);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3000);
  };

  const currentOrderNumber = completedOrder?.orderNumber || 'DS-PENDING';
  const pixPayload = generatePixPayload(totalToPay, currentOrderNumber, settings.pixKey);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-[#0f1521] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white font-serif-luxury">
                {step === 'details' && '1. Endereço e Dados do Pedido'}
                {step === 'payment' && '2. Escolha a Forma de Pagamento'}
                {step === 'success' && '3. Pedido Confirmado com Sucesso!'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {step !== 'success' ? 'Ambiente 100% Criptografado & Seguro' : 'Guarde o código para acompanhamento'}
              </p>
            </div>
          </div>

          {step !== 'success' && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Content */}
        <div className="overflow-y-auto p-5 sm:p-6 flex-1">
          
          {/* STEP 1: CUSTOMER & ADDRESS DETAILS */}
          {step === 'details' && (
            <form onSubmit={handleNextToPayment} className="space-y-4">
              
              {/* Customer Account & Saved Address Status Banner */}
              {currentUser ? (
                <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-emerald-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      Endereço carregado da sua conta (<strong>{currentUser.name}</strong>).
                    </span>
                  </div>
                  {onOpenAccount && (
                    <button
                      type="button"
                      onClick={onOpenAccount}
                      className="text-emerald-300 hover:text-white underline font-semibold text-[11px] text-left sm:text-right cursor-pointer"
                    >
                      Alterar endereço salvo
                    </button>
                  )}
                </div>
              ) : (
                <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Já possui cadastro na loja? Entre para carregar seu endereço salvo.</span>
                  </div>
                  {onOpenAccount && (
                    <button
                      type="button"
                      onClick={onOpenAccount}
                      className="bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 px-3 py-1 rounded-lg font-bold border border-amber-500/40 transition-colors text-[11px] shrink-0 cursor-pointer text-center"
                    >
                      Entrar / Identificar-se
                    </button>
                  )}
                </div>
              )}

              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Dados Pessoais & Contato
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Nome Completo *</label>
                    <input
                      type="text"
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      placeholder="Ex: Carlos Eduardo Silva"
                      className="w-full bg-slate-900 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500"
                    />
                    {formErrors.name && <span className="text-[10px] text-rose-400">{formErrors.name}</span>}
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">WhatsApp (DDD + Número) *</label>
                    <input
                      type="tel"
                      value={customer.phone}
                      onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                      placeholder="(11) 99999-9999"
                      className="w-full bg-slate-900 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500 font-mono"
                    />
                    {formErrors.phone && <span className="text-[10px] text-rose-400">{formErrors.phone}</span>}
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">E-mail para Recibo *</label>
                    <input
                      type="email"
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      placeholder="seuemail@gmail.com"
                      className="w-full bg-slate-900 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500"
                    />
                    {formErrors.email && <span className="text-[10px] text-rose-400">{formErrors.email}</span>}
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">CPF (opcional p/ nota fiscal)</label>
                    <input
                      type="text"
                      value={customer.cpf}
                      onChange={(e) => setCustomer({ ...customer, cpf: e.target.value })}
                      placeholder="000.000.000-00"
                      className="w-full bg-slate-900 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Endereço de Entrega das Gravatas
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">CEP *</label>
                    <input
                      type="text"
                      value={customer.cep}
                      onChange={(e) => {
                        setCustomer({ ...customer, cep: e.target.value });
                        handleFetchCepCheckout(e.target.value);
                      }}
                      placeholder="00000-000"
                      className="w-full bg-slate-900 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500 font-mono"
                    />
                    {isLoadingCep && <span className="text-[10px] text-amber-400">Consultando CEP...</span>}
                    {formErrors.cep && <span className="text-[10px] text-rose-400">{formErrors.cep}</span>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs text-slate-300 mb-1">Rua / Avenida *</label>
                    <input
                      type="text"
                      value={customer.street}
                      onChange={(e) => setCustomer({ ...customer, street: e.target.value })}
                      placeholder="Av. Paulista ou Rua das Flores"
                      className="w-full bg-slate-900 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500"
                    />
                    {formErrors.street && <span className="text-[10px] text-rose-400">{formErrors.street}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Número *</label>
                    <input
                      type="text"
                      value={customer.number}
                      onChange={(e) => setCustomer({ ...customer, number: e.target.value })}
                      placeholder="123"
                      className="w-full bg-slate-900 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500"
                    />
                    {formErrors.number && <span className="text-[10px] text-rose-400">{formErrors.number}</span>}
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Complemento / Apto</label>
                    <input
                      type="text"
                      value={customer.complement}
                      onChange={(e) => setCustomer({ ...customer, complement: e.target.value })}
                      placeholder="Apto 42 Bloco B"
                      className="w-full bg-slate-900 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Bairro *</label>
                    <input
                      type="text"
                      value={customer.neighborhood}
                      onChange={(e) => setCustomer({ ...customer, neighborhood: e.target.value })}
                      placeholder="Centro"
                      className="w-full bg-slate-900 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500"
                    />
                    {formErrors.neighborhood && <span className="text-[10px] text-rose-400">{formErrors.neighborhood}</span>}
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Cidade / UF *</label>
                    <input
                      type="text"
                      value={customer.city}
                      onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                      placeholder="São Paulo / SP"
                      className="w-full bg-slate-900 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500"
                    />
                    {formErrors.city && <span className="text-[10px] text-rose-400">{formErrors.city}</span>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 mb-1">
                    Instruções Especiais para o Pedido (opcional)
                  </label>
                  <input
                    type="text"
                    value={customer.notes}
                    onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                    placeholder="Ex: É para casamento no dia 25/10; embalar para presente individualmente."
                    className="w-full bg-slate-900 text-xs text-slate-200 px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 flex items-center justify-between border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Voltar à sacola
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-950/40 cursor-pointer"
                >
                  <span>Continuar para Pagamento</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: PAYMENT METHOD SELECTION */}
          {step === 'payment' && (
            <div className="space-y-6">
              
              {/* Payment Methods Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {/* PIX */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                    paymentMethod === 'pix'
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-bold">PIX Instantâneo</span>
                  <span className="text-[10px] bg-emerald-950/80 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-500/40">
                    5% OFF
                  </span>
                </button>

                {/* Credit Card */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit_card')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                    paymentMethod === 'credit_card'
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-bold">Cartão de Crédito</span>
                  <span className="text-[10px] text-slate-400">Até 12x</span>
                </button>

                {/* Boleto */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('boleto')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                    paymentMethod === 'boleto'
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Barcode className="w-5 h-5 text-slate-300" />
                  <span className="text-xs font-bold">Boleto Bancário</span>
                  <span className="text-[10px] text-slate-400">Compensação 1-2 dias</span>
                </button>

                {/* WhatsApp Direct */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod('whatsapp')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5 ${
                    paymentMethod === 'whatsapp'
                      ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300 shadow-md'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <MessageCircle className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-bold">Pagar no WhatsApp</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">Atendimento 1-a-1</span>
                </button>
              </div>

              {/* Payment Box Details */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5">
                
                {/* PIX Detail */}
                {paymentMethod === 'pix' && (
                  <div className="space-y-4 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      {/* Simulated QR Code Box */}
                      <div className="w-36 h-36 bg-white p-2 rounded-xl flex flex-col items-center justify-center shadow-lg border border-amber-400/40 shrink-0">
                        <div className="w-full h-full border-2 border-dashed border-slate-900 flex flex-col items-center justify-center relative">
                          <QrCode className="w-24 h-24 text-slate-950" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="bg-amber-400 text-slate-950 text-[9px] font-black px-1 rounded">
                              PIX
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 px-2.5 py-1 rounded-md text-xs font-bold">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Desconto adicional de 5% aplicado no PIX!</span>
                        </div>
                        <h4 className="text-base font-bold text-white">
                          Pague {formatCurrency(totalToPay)} via PIX Copia e Cola
                        </h4>
                        <p className="text-xs text-slate-400">
                          Abra o app do seu banco, escolha <strong>PIX</strong> e escaneie o QR Code ou cole a chave abaixo. A confirmação é instantânea.
                        </p>
                      </div>
                    </div>

                    {/* Copy Direct PIX Key & Copia e Cola */}
                    <div className="space-y-3 pt-2">
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-slate-300">
                            Chave PIX (Telefone / Celular):
                          </span>
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded border border-amber-500/30">
                            Chave Direta
                          </span>
                        </div>
                        <div className="flex gap-2 items-center">
                          <div className="flex-1 bg-slate-900 text-xs font-mono font-bold text-amber-400 px-3 py-2 rounded-lg border border-slate-800">
                            {settings.pixKey}
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(settings.pixKey);
                              setCopiedDirectPix(true);
                              setTimeout(() => setCopiedDirectPix(false), 3000);
                            }}
                            className="bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold px-3 py-2 rounded-lg text-xs flex items-center gap-1.5 shrink-0 transition-colors border border-slate-700 cursor-pointer"
                          >
                            {copiedDirectPix ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-400">Copiada!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copiar Chave</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[11px] text-slate-400 text-left">
                          Ou use o Código PIX Copia e Cola (QR Code Automático):
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            readOnly
                            value={pixPayload}
                            className="flex-1 bg-slate-950 text-[11px] text-slate-400 px-3 py-2 rounded-lg border border-slate-800 font-mono truncate"
                          />
                          <button
                            type="button"
                            onClick={() => handleCopyPix(pixPayload)}
                            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-2 rounded-lg text-xs flex items-center gap-1.5 shrink-0 transition-colors cursor-pointer"
                          >
                            {copiedPix ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Copiado!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copiar Código</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Credit Card Detail */}
                {paymentMethod === 'credit_card' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-xs text-slate-300 mb-1">Número do Cartão</label>
                        <div className="relative">
                          <input
                            type="text"
                            maxLength={19}
                            value={cardData.number}
                            onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                            placeholder="0000 0000 0000 0000"
                            className="w-full bg-slate-950 text-xs text-slate-200 pl-10 pr-4 py-2.5 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500 font-mono"
                          />
                          <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs text-slate-300 mb-1">Nome Impresso no Cartão</label>
                        <input
                          type="text"
                          value={cardData.name}
                          onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                          placeholder="CARLOS E SILVA"
                          className="w-full bg-slate-950 text-xs text-slate-200 px-3 py-2.5 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500 uppercase"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs text-slate-300 mb-1">Validade</label>
                          <input
                            type="text"
                            maxLength={5}
                            value={cardData.expiry}
                            onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                            placeholder="MM/AA"
                            className="w-full bg-slate-950 text-xs text-slate-200 px-3 py-2.5 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500 text-center font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-slate-300 mb-1">CVV</label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardData.cvv}
                            onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                            placeholder="123"
                            className="w-full bg-slate-950 text-xs text-slate-200 px-3 py-2.5 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500 text-center font-mono"
                          />
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs text-slate-300 mb-1">Parcelamento</label>
                        <select
                          value={installments}
                          onChange={(e) => setInstallments(Number(e.target.value))}
                          className="w-full bg-slate-950 text-xs text-slate-200 px-3 py-2.5 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500"
                        >
                          <option value={1}>1x de {formatCurrency(totalToPay)} (à vista sem juros)</option>
                          <option value={2}>2x de {formatCurrency(totalToPay / 2)} sem juros</option>
                          <option value={3}>3x de {formatCurrency(totalToPay / 3)} sem juros</option>
                          <option value={6}>6x de {formatCurrency(totalToPay / 6)} sem juros</option>
                          <option value={10}>10x de {formatCurrency((totalToPay * 1.05) / 10)} com juros</option>
                          <option value={12}>12x de {formatCurrency((totalToPay * 1.08) / 12)} com juros</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Boleto Detail */}
                {paymentMethod === 'boleto' && (
                  <div className="space-y-3 text-xs text-slate-300">
                    <p>
                      O boleto bancário será gerado e exibido após a confirmação. O prazo de vencimento é de <strong>3 dias úteis</strong>.
                    </p>
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-400">
                      34191.79001 01043.510047 91020.150008 5 910500000{Math.round(totalToPay * 100)}
                    </div>
                  </div>
                )}

                {/* WhatsApp Direct Detail */}
                {paymentMethod === 'whatsapp' && (
                  <div className="space-y-3 text-xs text-slate-300">
                    <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl space-y-1">
                      <p className="font-bold text-emerald-300">
                        Atendimento Personalizado e Humanizado
                      </p>
                      <p className="text-slate-300 text-[11px]">
                        Ao clicar em finalizar, o WhatsApp oficial da <strong>{settings.storeName}</strong> será aberto com todos os itens do seu pedido já pré-formatados. Você poderá negociar prazos especiais de casamento ou pagar direto com o atendente.
                      </p>
                    </div>
                  </div>
                )}

              </div>

              {/* Order Summary & Final Button */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-400">Total a Pagar ({cart.length} itens):</span>
                  <span className="text-xl font-black text-amber-400 font-serif-luxury">
                    {formatCurrency(totalToPay)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setStep('details')}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Voltar aos dados</span>
                  </button>

                  <button
                    onClick={handleFinalizePayment}
                    disabled={isProcessing}
                    className="flex-1 max-w-xs bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 cursor-pointer disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <span>Processando Pedido Seguro...</span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Confirmar & Finalizar Pedido</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* STEP 3: SUCCESS & CONFIRMATION */}
          {step === 'success' && completedOrder && (
            <div className="py-6 text-center space-y-6 animate-in zoom-in-95 duration-300">
              
              {/* Checkmark Icon */}
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/50">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl sm:text-2xl font-bold text-white font-serif-luxury">
                  Pedido Realizado com Sucesso!
                </h3>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Muito obrigado, <strong>{completedOrder.customer.name}</strong>! Suas gravatas já estão sendo separadas em nossa alfaiataria.
                </p>
              </div>

              {/* Order Info Card */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 max-w-md mx-auto text-left space-y-3 text-xs">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Número do Pedido:</span>
                  <span className="font-mono font-bold text-amber-400 text-sm">
                    #{completedOrder.orderNumber}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Código de Rastreio:</span>
                  <span className="font-mono text-slate-200 font-semibold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {completedOrder.trackingCode}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Entrega Prevista em:</span>
                  <span className="text-slate-200">{completedOrder.customer.city} / {completedOrder.customer.state}</span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                  <span className="text-slate-400 font-bold">Total Pago:</span>
                  <span className="font-black text-amber-400 text-sm font-serif-luxury">
                    {formatCurrency(completedOrder.total)}
                  </span>
                </div>
              </div>

              {/* WhatsApp Notification Share Button */}
              <div className="space-y-2 max-w-md mx-auto">
                <a
                  href={generateWhatsAppOrderUrl(completedOrder, settings)}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enviar Comprovante e Acompanhar no WhatsApp</span>
                </a>

                <button
                  onClick={onClose}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold py-2.5 rounded-xl border border-slate-700 transition-colors"
                >
                  Voltar à Loja
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
