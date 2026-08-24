import React from 'react';
import { 
  ShieldCheck, 
  Truck, 
  CreditCard, 
  QrCode, 
  MessageCircle, 
  Award, 
  Heart,
  Instagram,
  Facebook
} from 'lucide-react';
import { CategoryId, StoreSettings } from '../types';
import { formatPhoneDisplay } from '../utils';

interface FooterProps {
  onSelectCategory: (category: CategoryId) => void;
  onOpenAdvisor: () => void;
  onOpenKnotTutorials: () => void;
  onOpenSupport: () => void;
  settings: StoreSettings;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenAdvisor,
  onOpenKnotTutorials,
  onOpenSupport,
  settings,
}) => {
  return (
    <footer className="bg-[#080c14] border-t border-slate-800 text-slate-400 text-xs">
      {/* Top Banner */}
      <div className="border-b border-slate-800/80 py-8 bg-[#0a0f18]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Garantia de Alfaiataria Fina</h4>
                <p className="text-slate-400 text-[11px]">Seda 100% Jacquard 1200 fios de padrão internacional.</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <QrCode className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Pagamento 100% Seguro</h4>
                <p className="text-slate-400 text-[11px]">PIX com 5% de desconto imediato ou até 12x no cartão.</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Entrega Rápida com Rastreio</h4>
                <p className="text-slate-400 text-[11px]">Envios para todo o Brasil com código minuto a minuto.</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand & Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black font-brand text-sm">
                JC
              </div>
              <span className="text-base font-bold font-brand tracking-wider text-white">
                JC GRAVATAS
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Especialistas em gravatas de alta alfaiataria, kits para noivos, padrinhos de casamento e trajes executivos. Elegância atemporal entregue na sua porta.
            </p>
            <div className="pt-1 flex items-center gap-3 text-slate-300">
              <a href="#" className="hover:text-amber-400 transition-colors p-1"><Instagram className="w-4 h-4" /></a>
              <a href="#" className="hover:text-amber-400 transition-colors p-1"><Facebook className="w-4 h-4" /></a>
              <a 
                href={`https://wa.me/${settings.whatsappNumber}`} 
                target="_blank" 
                rel="noreferrer" 
                className="hover:text-emerald-400 transition-colors p-1"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="space-y-2.5">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Coleções & Catálogo
            </h5>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={() => onSelectCategory('casamento')} className="hover:text-amber-300 transition-colors">
                  Casamentos & Padrinhos
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('kits')} className="hover:text-amber-300 transition-colors">
                  Kits com Lenço e Abotoadura
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('slim')} className="hover:text-amber-300 transition-colors">
                  Gravatas Slim Modernas (5,5 cm)
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('seda-pura')} className="hover:text-amber-300 transition-colors">
                  Linha Seda Pura Italiana
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('borboleta')} className="hover:text-amber-300 transition-colors">
                  Gravatas Borboleta & Smoking
                </button>
              </li>
            </ul>
          </div>

          {/* Client Tools */}
          <div className="space-y-2.5">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Ferramentas & Estilo
            </h5>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button onClick={onOpenAdvisor} className="hover:text-amber-300 transition-colors text-left">
                  ✨ Simulador de Look (Terno & Camisa)
                </button>
              </li>
              <li>
                <button onClick={onOpenKnotTutorials} className="hover:text-amber-300 transition-colors text-left">
                  👔 Guia Passo a Passo de Nós de Gravata
                </button>
              </li>
              <li>
                <button onClick={onOpenSupport} className="hover:text-amber-300 transition-colors text-left">
                  📦 Rastrear Meu Pedido
                </button>
              </li>
              <li>
                <button onClick={onOpenSupport} className="hover:text-amber-300 transition-colors text-left">
                  ❓ Dúvidas Frequentes & Trocas
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service & WhatsApp */}
          <div className="space-y-2.5">
            <h5 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Atendimento Direto
            </h5>
            <p className="text-[11px] text-slate-400">
              Segunda a Sábado, das 08h às 20h.
            </p>
            <a
              href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent('Olá! Gostaria de atendimento para escolher gravatas.')}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/40 text-emerald-300 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-400" />
              <span>WhatsApp: {formatPhoneDisplay(settings.whatsappNumber)}</span>
            </a>
            <p className="text-[10px] text-slate-500">
              E-mail: contato@jcgravatas.com.br
            </p>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-8 mt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} JC Gravatas - Gravataria & Alfaiataria. Todos os direitos reservados.</p>
          <span>Alta Alfaiataria & Acessórios Masculinos</span>
        </div>
      </div>
    </footer>
  );
};
