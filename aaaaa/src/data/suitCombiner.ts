export interface SuitColorOption {
  id: string;
  name: string;
  hex: string;
  textColor: string;
}

export interface ShirtColorOption {
  id: string;
  name: string;
  hex: string;
  borderClass: string;
}

export interface OccasionOption {
  id: string;
  name: string;
  badge: string;
}

export const suitColors: SuitColorOption[] = [
  { id: 'marinho', name: 'Azul Marinho / Navy', hex: '#162447', textColor: '#ffffff' },
  { id: 'chumbo', name: 'Cinza Chumbo / Grafite', hex: '#374151', textColor: '#ffffff' },
  { id: 'preto', name: 'Preto Clássico / Black Tie', hex: '#111827', textColor: '#ffffff' },
  { id: 'areia', name: 'Areia / Bege / Linho', hex: '#D7C4A7', textColor: '#1e293b' },
  { id: 'cinza-claro', name: 'Cinza Claro / Prata', hex: '#9CA3AF', textColor: '#111827' },
  { id: 'azul-petroleo', name: 'Azul Petróleo / Royal', hex: '#1E3A8A', textColor: '#ffffff' },
];

export const shirtColors: ShirtColorOption[] = [
  { id: 'branca', name: 'Branca Impecável', hex: '#FFFFFF', borderClass: 'border-slate-300' },
  { id: 'azul-claro', name: 'Azul Claro / Céu', hex: '#DCEBFA', borderClass: 'border-blue-200' },
  { id: 'rosa-claro', name: 'Rosa Pastel / Quartz', hex: '#FCE7F3', borderClass: 'border-pink-200' },
  { id: 'preta', name: 'Preta / Noturna', hex: '#1F2937', borderClass: 'border-slate-700' },
  { id: 'listrada', name: 'Listrada Micro Fio', hex: '#F3F4F6', borderClass: 'border-slate-300' },
];

export const occasions: OccasionOption[] = [
  { id: 'casamento-padrinho', name: 'Padrinho ou Noivo em Casamento', badge: 'Cerimonial' },
  { id: 'executivo', name: 'Trabalho, Reuniões & Negócios', badge: 'Corporativo' },
  { id: 'gala', name: 'Formatura, Gala & Premiação', badge: 'Black Tie' },
  { id: 'casual', name: 'Almoço, Batizado ou Casual Chic', badge: 'Moderno' },
];

export interface CombinationAdvice {
  recommendedProductIds: string[];
  styleTip: string;
  contrastScore: 'Alto Impacto' | 'Harmonia Clássica' | 'Monocromático Refinado';
}

export function getCombinationAdvice(suitId: string, shirtId: string, occasionId: string): CombinationAdvice {
  // Azul Marinho
  if (suitId === 'marinho') {
    if (occasionId === 'casamento-padrinho') {
      return {
        recommendedProductIds: ['grav-02', 'kit-01', 'grav-04'],
        styleTip: 'O terno azul marinho com camisa branca/azul claro é a tela perfeita para gravatas Bordô Marsala ou Terracota. O contraste aquece a composição e destaca o padrinho com distinção.',
        contrastScore: 'Harmonia Clássica',
      };
    }
    return {
      recommendedProductIds: ['grav-01', 'grav-06', 'grav-07'],
      styleTip: 'Tom sobre tom elegante: combine com a gravata marinho jacquard 1200 fios ou listrada regimental para transmitir máxima credibilidade corporativa.',
      contrastScore: 'Monocromático Refinado',
    };
  }

  // Cinza Chumbo
  if (suitId === 'chumbo') {
    if (occasionId === 'casamento-padrinho') {
      return {
        recommendedProductIds: ['grav-04', 'grav-02', 'kit-02'],
        styleTip: 'O cinza chumbo neutraliza tons quentes, fazendo a gravata Rosé Quartz ou Bordô resplandecer com elegância contemporânea.',
        contrastScore: 'Harmonia Clássica',
      };
    }
    return {
      recommendedProductIds: ['grav-03', 'grav-07', 'grav-01'],
      styleTip: 'Verde esmeralda ou cinza chumbo poá prateado sobre camisa branca criam um visual executivo de revista europeia.',
      contrastScore: 'Alto Impacto',
    };
  }

  // Preto
  if (suitId === 'preto') {
    if (occasionId === 'gala') {
      return {
        recommendedProductIds: ['borb-01', 'grav-08', 'kit-02'],
        styleTip: 'Em ocasiões Black Tie, a gravata borboleta em veludo nobre é obrigatória. Para ternos normais de gala, a seda pura Paisley ouro cria presença régia.',
        contrastScore: 'Alto Impacto',
      };
    }
    return {
      recommendedProductIds: ['grav-07', 'grav-01', 'grav-08'],
      styleTip: 'Camisa branca com gravata prata micro-pontos ou azul marinho profundo mantém o traje clássico sem parecer fúnebre.',
      contrastScore: 'Harmonia Clássica',
    };
  }

  // Areia / Bege
  if (suitId === 'areia') {
    return {
      recommendedProductIds: ['kit-01', 'grav-05', 'grav-04'],
      styleTip: 'Perfeito para casamentos ao ar livre e praia. O kit Terracota em linho puro ou a gravata knit café italiano combinam com a textura natural do tecido.',
      contrastScore: 'Harmonia Clássica',
    };
  }

  // Default fallback
  return {
    recommendedProductIds: ['grav-01', 'grav-02', 'kit-01'],
    styleTip: 'Para essa paleta, aposte em gravatas jacquard com texturas finas e cores nobres como Azul Imperial e Marsala.',
    contrastScore: 'Harmonia Clássica',
  };
}
