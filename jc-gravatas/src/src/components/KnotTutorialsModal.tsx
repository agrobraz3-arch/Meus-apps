import React, { useState } from 'react';
import { X, BookOpen, CheckCircle2, Award, ChevronRight } from 'lucide-react';
import { knotGuides } from '../data/tutorials';
import { KnotGuide } from '../types';

interface KnotTutorialsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KnotTutorialsModal: React.FC<KnotTutorialsModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedKnotId, setSelectedKnotId] = useState<string>(knotGuides[0].id);

  if (!isOpen) return null;

  const currentKnot = knotGuides.find((k) => k.id === selectedKnotId) || knotGuides[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-[#0e1420] border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-serif-luxury">
                Guia de Nós de Gravata • Don Sartorio
              </h2>
              <p className="text-[11px] text-slate-400">
                Aprenda a fazer o nó perfeito para cada colarinho e ocasião
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
        <div className="overflow-y-auto p-5 sm:p-6 flex-1 space-y-6">
          
          {/* Knot Selector Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-slate-800">
            {knotGuides.map((knot) => (
              <button
                key={knot.id}
                onClick={() => setSelectedKnotId(knot.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 ${
                  selectedKnotId === knot.id
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                <span>{knot.name}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedKnotId === knot.id ? 'bg-black/30 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {knot.difficulty}
                </span>
              </button>
            ))}
          </div>

          {/* Knot Details & Meta */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-3">
              <h3 className="text-xl font-bold text-white font-serif-luxury">
                {currentKnot.name}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {currentKnot.description}
              </p>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Dificuldade:</span>
                <span className="font-bold text-amber-400">{currentKnot.difficulty}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Simetria:</span>
                <span className="font-semibold text-slate-200">{currentKnot.symmetry}</span>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <span className="text-slate-400 block text-[11px] mb-0.5">Colarinho Ideal:</span>
                <span className="font-semibold text-emerald-400">{currentKnot.collarType}</span>
              </div>
            </div>
          </div>

          {/* Step by Step Flow */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              Passo a Passo Ilustrado:
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {currentKnot.steps.map((step) => (
                <div
                  key={step.step}
                  className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2 relative flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 text-xs font-black flex items-center justify-center border border-amber-500/30">
                      {step.step}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">
                      Passo {step.step}
                    </span>
                  </div>

                  <div className="space-y-1 my-2">
                    <h5 className="text-xs font-bold text-white">
                      {step.title}
                    </h5>
                    <p className="text-xs text-slate-300 leading-snug">
                      {step.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center gap-1.5 text-[11px] text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Posição correta</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
