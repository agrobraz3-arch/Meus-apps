import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  MessageCircle, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Search,
  CheckCircle2,
  Clock,
  Package
} from 'lucide-react';
import { StoreSettings } from '../types';

interface CustomerSupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StoreSettings;
}

interface FAQItem {
  question: string;
  answer: string;
  category: 'casamento' | 'entrega' | 'cuidados' | 'trocas';
}

const faqs: FAQItem[] = [
  {
    category: 'casamento',
    question: 'Como funciona o desconto para lotes de padrinhos de casamento?',
    answer: 'Oferecemos descontos automáticos progressivos para noivos e padrinhos: 10% OFF a partir de 4 unidades, 15% OFF para 8+ unidades e 20% OFF + Frete Grátis a partir de 12 unidades. Todos os kits vão acompanhados de caixas de presente elegantes e identificadas.',
  },
  {
    category: 'casamento',
    question: 'Vocês enviam uma amostra de tecido para conferir com o vestido das madrinhas?',
    answer: 'Sim! Se você for noiva ou noivo e desejar aprovar a tonalidade exata (ex: Marsala, Terracota, Rosé, Esmeralda), basta nos chamar no WhatsApp que enviamos fotos reais em luz natural ou amostras físicas expressas.',
  },
  {
    category: 'entrega',
    question: 'Qual é o prazo de entrega e envio?',
    answer: 'Nossos produtos possuem pronta-entrega. Pedidos confirmados até as 14h são postados no mesmo dia útil via Sedex ou PAC com código de rastreamento enviado automaticamente via WhatsApp e E-mail.',
  },
  {
    category: 'trocas',
    question: 'Como funciona a garantia e troca caso a cor não combine com o terno?',
    answer: 'Garantia incondicional de 7 dias após o recebimento. Se a cor não ficar como você imaginava ou se precisar de outra largura, a primeira troca é totalmente grátis com logística reversa dos Correios.',
  },
  {
    category: 'cuidados',
    question: 'Como cuidar e passar a gravata de seda jacquard?',
    answer: 'Nunca passe a ferro direto na seda. Utilize vaporizador vertical ou passe pelo verso colocando um pano fino de algodão úmido por cima, com temperatura média. Após o uso, desfaça o nó para não vincar a entretela interna.',
  },
];

export const CustomerSupportModal: React.FC<CustomerSupportModalProps> = ({
  isOpen,
  onClose,
  settings,
}) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [trackingInput, setTrackingInput] = useState('');
  const [trackedStatus, setTrackedStatus] = useState<any>(null);

  if (!isOpen) return null;

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingInput.trim()) return;

    setTrackedStatus({
      code: trackingInput.trim().toUpperCase(),
      status: 'Objeto postado e em trânsito',
      location: 'Centro de Distribuição Express - São Paulo / SP',
      date: new Date().toLocaleDateString('pt-BR'),
      steps: [
        { label: 'Pedido Confirmado e Faturado', done: true, time: 'Ontem 14:20' },
        { label: 'Gravatas separadas e embaladas em caixa luxo', done: true, time: 'Ontem 16:45' },
        { label: 'Em trânsito para a agência da sua cidade', done: true, time: 'Hoje 08:30' },
        { label: 'Saiu para entrega ao destinatário', done: false, time: 'Previsão: 1 a 2 dias úteis' },
      ],
    });
  };

  const getWhatsappUrl = (subject: string) => {
    return `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
      `Olá equipe JC Gravatas! Preciso de suporte referente a: *${subject}*`
    )}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-[#0e1420] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-serif-luxury">
                Central de Atendimento & Suporte
              </h2>
              <p className="text-[11px] text-slate-400">
                Atendimento humanizado para noivos, padrinhos e clientes executivos
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6 flex-1">
          
          {/* Quick WhatsApp Support Buttons */}
          <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-6 h-6 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Atendimento Rápido via WhatsApp
                  </h3>
                  <p className="text-xs text-slate-300">
                    Fale diretamente com nossa equipe de alfaiates e consultores de casamento.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
              <a
                href={getWhatsappUrl('Kits de Padrinhos de Casamento & Paletas')}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-900/50 hover:bg-emerald-800/70 text-emerald-200 text-xs font-semibold p-2.5 rounded-xl border border-emerald-600/40 text-center transition-colors block"
              >
                💍 Casamentos & Padrinhos
              </a>

              <a
                href={getWhatsappUrl('Dúvida sobre Cores e Combinações de Terno')}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-900/50 hover:bg-emerald-800/70 text-emerald-200 text-xs font-semibold p-2.5 rounded-xl border border-emerald-600/40 text-center transition-colors block"
              >
                👔 Consultoria de Cores
              </a>

              <a
                href={getWhatsappUrl('Informações sobre Rastreio ou Trocas')}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-900/50 hover:bg-emerald-800/70 text-emerald-200 text-xs font-semibold p-2.5 rounded-xl border border-emerald-600/40 text-center transition-colors block"
              >
                📦 Rastreio & Trocas
              </a>
            </div>
          </div>

          {/* Real-time Order Tracking Tool */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Package className="w-4 h-4" />
              <span>Rastreamento de Pedido</span>
            </h3>
            
            <form onSubmit={handleTrack} className="flex gap-2">
              <input
                type="text"
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                placeholder="Insira seu código (ex: DS123456789BR ou #DS-1029)"
                className="flex-1 bg-slate-950 text-xs text-slate-200 px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500 font-mono"
              />
              <button
                type="submit"
                className="bg-slate-800 hover:bg-amber-500 text-slate-200 hover:text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 hover:border-amber-400 transition-colors"
              >
                Rastrear
              </button>
            </form>

            {trackedStatus && (
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3 animate-in fade-in">
                <div className="flex justify-between items-center text-xs border-b border-slate-800 pb-2">
                  <span className="font-mono text-amber-400 font-bold">{trackedStatus.code}</span>
                  <span className="text-emerald-400 font-semibold">{trackedStatus.status}</span>
                </div>
                <div className="space-y-2 text-xs">
                  {trackedStatus.steps.map((step: any, i: number) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${step.done ? 'text-emerald-400' : 'text-slate-600'}`} />
                      <div className="flex-1 flex justify-between">
                        <span className={step.done ? 'text-slate-200' : 'text-slate-500'}>{step.label}</span>
                        <span className="text-[10px] text-slate-500">{step.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Interactive FAQs Accordion */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Dúvidas Frequentes:
            </h3>

            <div className="space-y-2">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-800 bg-slate-900/60 rounded-xl overflow-hidden transition-colors"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-3.5 text-left text-xs sm:text-sm font-semibold text-slate-200 flex items-center justify-between gap-2 hover:text-amber-300 transition-colors cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                      )}
                    </button>

                    {isOpen && (
                      <div className="px-3.5 pb-3.5 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
