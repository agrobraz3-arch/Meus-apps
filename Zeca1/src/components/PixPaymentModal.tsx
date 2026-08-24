import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { generatePixPayload } from '../utils/pixPayload';
import { QRCodeSVG } from 'qrcode.react';
import { 
  QrCode, 
  Copy, 
  Check, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Smartphone, 
  Building2, 
  KeyRound, 
  MessageCircle,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PixPaymentModalProps {
  isOpen: boolean;
  total: number;
  orderNumber: number;
  onPaymentConfirmed: () => void;
  onClose: () => void;
}

export const PixPaymentModal: React.FC<PixPaymentModalProps> = ({
  isOpen,
  total,
  orderNumber,
  onPaymentConfirmed,
  onClose
}) => {
  const { restaurant } = useApp();
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [copiedKeyOnly, setCopiedKeyOnly] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const pixConfig = restaurant.pixConfig || {
    keyType: 'telefone',
    key: '82991761488',
    merchantName: 'RESTAURANTE DO ZECA',
    merchantCity: 'PINDORAMA',
  };

  // Generate official EMVCo BR Code payload
  const pixPayload = useMemo(() => {
    return generatePixPayload({
      key: pixConfig.key || '82991761488',
      merchantName: pixConfig.merchantName || restaurant.name || 'RESTAURANTE DO ZECA',
      merchantCity: pixConfig.merchantCity || restaurant.city || 'PINDORAMA',
      amount: total,
      txId: `ZECA${orderNumber}`,
      description: `Pedido ${orderNumber} Marmita Zeca`,
    });
  }, [pixConfig, total, orderNumber, restaurant]);

  useEffect(() => {
    if (!isOpen) return;
    setTimeLeft(600);
    setIsSuccess(false);
    setIsProcessing(false);
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(pixPayload);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 3000);
  };

  const handleCopyKeyOnly = () => {
    navigator.clipboard.writeText(pixConfig.key);
    setCopiedKeyOnly(true);
    setTimeout(() => setCopiedKeyOnly(false), 3000);
  };

  const handleSimulatePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        onPaymentConfirmed();
      }, 1600);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-amber-800/40 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden text-white flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-950 p-4 sm:p-5 border-b border-emerald-800/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <QrCode className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-emerald-100 font-serif">Pague com PIX</h3>
                <span className="text-[10px] bg-emerald-500/30 text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                  Instantâneo
                </span>
              </div>
              <p className="text-[11px] text-emerald-300/80">
                Pedido #{orderNumber} • {restaurant.name}
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-stone-400 block">Total a pagar</span>
            <span className="text-lg font-black text-emerald-400">R$ {total.toFixed(2)}</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 text-center">
          
          {isSuccess ? (
            <div className="py-8 space-y-3">
              <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-400 animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-lg font-bold text-emerald-300">Pagamento PIX Aprovado!</h4>
              <p className="text-xs text-stone-300">
                Seu pedido foi confirmado instantaneamente na cozinha do {restaurant.name}.
              </p>
            </div>
          ) : (
            <>
              {/* Receiver Information Badge */}
              <div className="bg-stone-950/80 border border-stone-800 rounded-2xl p-3 text-left text-xs space-y-1.5">
                <div className="flex justify-between items-center text-stone-400 text-[11px]">
                  <span>Recebedor:</span>
                  <strong className="text-stone-200 uppercase">{pixConfig.merchantName}</strong>
                </div>
                <div className="flex justify-between items-center text-stone-400 text-[11px]">
                  <span>Chave PIX ({pixConfig.keyType.toUpperCase()}):</span>
                  <button
                    onClick={handleCopyKeyOnly}
                    className="text-amber-400 hover:text-amber-300 font-mono font-bold flex items-center gap-1"
                    title="Clique para copiar apenas a chave"
                  >
                    <span>{pixConfig.key}</span>
                    {copiedKeyOnly ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>
                <div className="flex justify-between items-center text-stone-400 text-[11px]">
                  <span>Cidade / Praça:</span>
                  <span className="text-stone-300">{pixConfig.merchantCity}</span>
                </div>
              </div>

              {/* Scannable Real QR Code Container */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl inline-block shadow-2xl mx-auto border-2 border-emerald-500/40 relative">
                <QRCodeSVG
                  value={pixPayload}
                  size={190}
                  level="M"
                  includeMargin={false}
                  className="rounded-lg"
                />
                <div className="mt-2 text-center text-[10px] font-black text-stone-800 tracking-wider uppercase">
                  Escaneie com qualquer app de banco
                </div>
              </div>

              {/* Countdown Timer */}
              <div className="flex items-center justify-center gap-1.5 text-xs text-amber-300 font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>O QR Code expira em: <strong>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</strong></span>
              </div>

              {/* Official PIX Copia e Cola */}
              <div className="space-y-1.5 text-left">
                <label className="text-xs text-stone-300 font-semibold flex items-center justify-between">
                  <span>PIX Copia e Cola (Código Completo):</span>
                  <span className="text-[10px] text-emerald-400 font-normal">Padrão Banco Central</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={pixPayload}
                    className="flex-1 bg-stone-950 border border-stone-700 rounded-xl px-3 py-2 text-xs text-stone-300 font-mono focus:outline-none select-all"
                  />
                  <button
                    id="copy-pix-code-btn"
                    onClick={handleCopyPayload}
                    className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-black text-xs flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 shadow"
                  >
                    {copiedPayload ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedPayload ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-stone-950/60 p-3 rounded-xl border border-stone-800 text-left text-xs text-stone-400 space-y-1">
                <div className="text-stone-200 font-semibold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Passo a passo rápido:</span>
                </div>
                <p>1. Abra o aplicativo do seu banco (Nubank, Inter, Caixa, BB, Itaú, etc).</p>
                <p>2. Escolha <strong>PIX</strong> e selecione <strong>Pagar com QR Code</strong> ou <strong>PIX Copia e Cola</strong>.</p>
                <p>3. Após transferir, confirme abaixo para liberar o preparo na hora.</p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  id="confirm-pix-instant-btn"
                  disabled={isProcessing}
                  onClick={handleSimulatePayment}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-stone-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/80 transition-all cursor-pointer"
                >
                  {isProcessing ? (
                    <span>Confirmando Pagamento...</span>
                  ) : (
                    <>
                      <span>Já Fiz o Pagamento PIX</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between text-xs pt-1">
                  <a
                    href={`https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(`Olá! Acabei de fazer o pagamento PIX no valor de R$ ${total.toFixed(2)} referente ao Pedido #${orderNumber}.`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Enviar comprovante no WhatsApp</span>
                  </a>

                  <button
                    onClick={onClose}
                    className="text-stone-400 hover:text-stone-200"
                  >
                    Fechar / Acompanhar
                  </button>
                </div>
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
