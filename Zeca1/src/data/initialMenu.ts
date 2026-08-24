import { MarmitaSize, MenuItem, RestaurantInfo, DayOfWeek, WeeklySchedule } from '../types';

export const INITIAL_RESTAURANT_INFO: RestaurantInfo = {
  name: 'Restaurante Do Zeca',
  slogan: 'A melhor comida caseira da região',
  since: '1986',
  address: 'Av. Ver. Jorge Venâncio, 899A',
  neighborhood: 'Centro',
  city: 'Pindorama - AL',
  phone: '(82) 99320-0513',
  whatsapp: '5582993200513',
  isOpen: true,
  openingHours: '10:30 às 15:00',
  defaultDeliveryFee: 4.00,
  freeDeliveryAbove: 60.00,
  adminPin: '1234',
  pixConfig: {
    keyType: 'telefone',
    key: '82993200513',
    merchantName: 'RESTAURANTE DO ZECA',
    merchantCity: 'PINDORAMA',
    bankName: 'Banco / Chave do Zeca',
    requireProofUpload: false,
  },
};

export const INITIAL_MARMITA_SIZES: MarmitaSize[] = [
  {
    id: 'p',
    name: 'Quentinha Pequena (P)',
    label: 'Tamanho P',
    price: 18.00,
    description: 'Ideal para 1 pessoa (aprox. 500g). 1 Arroz, 1 Feijão, 1 Carne e até 3 Acompanhamentos.',
    maxRice: 1,
    maxBeans: 1,
    maxMeats: 1,
    maxSides: 3,
  },
  {
    id: 'm',
    name: 'Quentinha Média (M)',
    label: 'Tamanho M',
    price: 22.00,
    description: 'A mais pedida! (aprox. 750g). Até 2 Arrozes, 1 Feijão, até 2 Carnes e até 4 Acompanhamentos.',
    maxRice: 2,
    maxBeans: 1,
    maxMeats: 2,
    maxSides: 4,
    popular: true,
  },
  {
    id: 'g',
    name: 'Quentinha Grande (G)',
    label: 'Tamanho G',
    price: 25.00,
    description: 'Muito bem servida! (aprox. 1kg). Até 2 Arrozes, 1 Feijão, até 2 Carnes generosas e todos Acompanhamentos.',
    maxRice: 2,
    maxBeans: 1,
    maxMeats: 2,
    maxSides: 6,
  },
  {
    id: 'familia',
    name: 'Marmita Família / Executiva',
    label: 'Família Especial',
    price: 45.00,
    description: 'Serve até 3 pessoas com fartura. Até 3 Carnes, 2 Arrozes, Feijão à vontade e todos os Acompanhamentos.',
    maxRice: 3,
    maxBeans: 2,
    maxMeats: 3,
    maxSides: 6,
  }
];

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  // OPÇÕES DE ARROZ
  { id: 'arroz-1', name: 'Arroz Branco', category: 'arroz', description: 'Soltinho e fresquinho', available: true },
  { id: 'arroz-2', name: 'Arroz Cenoura', category: 'arroz', description: 'Com toque de cenoura e ervas', available: true },
  { id: 'arroz-3', name: 'Arroz Carreteiro', category: 'arroz', description: 'Temperado com carne seca e temperos', available: true, badge: 'Destaque' },

  // OPÇÕES DE FEIJÃO
  { id: 'feijao-1', name: 'Feijão Caseiro', category: 'feijao', description: 'Caldinho encorpado com louro', available: true },
  { id: 'feijao-2', name: 'Feijão Tropeiro', category: 'feijao', description: 'Com farinha crocante, bacon e cheiro verde', available: true, badge: 'Tradicional' },
  { id: 'feijao-3', name: 'Feijão Preto', category: 'feijao', description: 'Estilo feijoada leve temperada', available: true },

  // CARNES
  { id: 'carne-1', name: 'Galinha Velha', category: 'carnes', description: 'Tradicional galinha caipira no molho suculento', available: true, badge: 'Caseira' },
  { id: 'carne-2', name: 'Chambaril (com Pirão)', category: 'carnes', description: 'Ossobuco cozido lentamente acompanhado do legítimo pirão', available: true, badge: 'Especialidade' },
  { id: 'carne-3', name: 'Contra Filé na Brasa', category: 'carnes', description: 'Grelhado na brasa no ponto ideal', available: true },
  { id: 'carne-4', name: 'Carneiro Guisado', category: 'carnes', description: 'Carne macia com tempero regional apurado', available: true },
  { id: 'carne-5', name: 'Frango Guisado', category: 'carnes', description: 'Franguinho com batatas e molho encorpado', available: true },
  { id: 'carne-6', name: 'Frango na Brasa', category: 'carnes', description: 'Assado lentamente e douradinho', available: true },
  { id: 'carne-7', name: 'Frango Frito', category: 'carnes', description: 'Crocante por fora e suculento por dentro', available: true },
  { id: 'carne-8', name: 'Boi Assado', category: 'carnes', description: 'Fatias macias de carne bovina assada', available: true },
  { id: 'carne-9', name: 'Boi Guisado', category: 'carnes', description: 'Cubos de carne bovina bem cozidos no molho', available: true },
  { id: 'carne-10', name: 'Calabresa Acebolada', category: 'carnes', description: 'Linguiça calabresa frita com anéis de cebola', available: true },
  { id: 'carne-11', name: 'Porco na Brasa', category: 'carnes', description: 'Copa lombo suína na brasa com tempero de limão e alho', available: true },

  // ACOMPANHAMENTOS
  { id: 'acomp-1', name: 'Macarrão', category: 'acompanhamentos', description: 'Espaguete no molho de tomate caseiro', available: true },
  { id: 'acomp-2', name: 'Purê de Batata', category: 'acompanhamentos', description: 'Cremoso com manteiga da terra', available: true },
  { id: 'acomp-3', name: 'Alface + Tomate', category: 'acompanhamentos', description: 'Salada fresca do dia', available: true },
  { id: 'acomp-4', name: 'Legumes Cozidos', category: 'acompanhamentos', description: 'Cenoura, chuchu e batata no vapor', available: true },
  { id: 'acomp-5', name: 'Maionese da Casa', category: 'acompanhamentos', description: 'Salada de batatas com maionese artesanal', available: true },
  { id: 'acomp-6', name: 'Vinagrete', category: 'acompanhamentos', description: 'Tomate, cebola e pimentão picadinhos', available: true },
  { id: 'acomp-7', name: 'Farofa Especial da Casa', category: 'acompanhamentos', description: 'Crocante com manteiga e temperinhos', available: true },

  // BEBIDAS (Vendidas separadas)
  { id: 'beb-1', name: 'Coca-Cola 350ml (Lata)', category: 'bebidas', description: 'Geladinha', available: true, extraPrice: 6.00 },
  { id: 'beb-2', name: 'Coca-Cola 2L', category: 'bebidas', description: 'Tamanho família', available: true, extraPrice: 13.00 },
  { id: 'beb-3', name: 'Guaraná Antarctica 350ml', category: 'bebidas', description: 'Lata gelada', available: true, extraPrice: 6.00 },
  { id: 'beb-4', name: 'Suco Natural de Laranja 500ml', category: 'bebidas', description: 'Feito na hora da fruta', available: true, extraPrice: 8.00 },
  { id: 'beb-5', name: 'Suco de Acerola 500ml', category: 'bebidas', description: 'Polpa natural bem gelada', available: true, extraPrice: 7.00 },
  { id: 'beb-6', name: 'Água Mineral sem Gás 500ml', category: 'bebidas', description: 'Água fresca', available: true, extraPrice: 3.50 },

  // SOBREMESAS (Vendidas separadas)
  { id: 'sob-1', name: 'Pudim de Leite Condensado', category: 'sobremesas', description: 'Fatia generosa com calda de caramelo', available: true, extraPrice: 8.00 },
  { id: 'sob-2', name: 'Doce de Leite Caseiro com Queijo', category: 'sobremesas', description: 'Tradicional da fazenda', available: true, extraPrice: 7.50 },
  { id: 'sob-3', name: 'Mousse de Maracujá', category: 'sobremesas', description: 'Cremoso com sementinhas', available: true, extraPrice: 7.00 },
];

export const NEIGHBORHOODS_DELIVERY: { name: string; fee: number; estimatedMin: number }[] = [
  { name: 'Centro - Pindorama', fee: 3.00, estimatedMin: 25 },
  { name: 'Av. Jorge Venâncio (Próximo)', fee: 2.50, estimatedMin: 20 },
  { name: 'Conjunto Habitacional Novo', fee: 4.50, estimatedMin: 35 },
  { name: 'Bairro São José', fee: 4.00, estimatedMin: 30 },
  { name: 'Zona Rural / Entorno Pindorama', fee: 7.00, estimatedMin: 45 },
  { name: 'Retirada no Balcão (Grátis)', fee: 0.00, estimatedMin: 15 },
];

export const INITIAL_WEEKLY_SCHEDULE: WeeklySchedule = {
  segunda: {
    day: 'segunda',
    dayLabel: 'Segunda-feira',
    themeTitle: 'Segunda da Comida Caseira & Carnes no Ponto',
    itemIds: [
      'arroz-1', 'arroz-2', 
      'feijao-1', 'feijao-2',
      'carne-3', 'carne-5', 'carne-9', 'carne-10', // Contra Filé, Frango Guisado, Boi Guisado, Calabresa
      'acomp-1', 'acomp-2', 'acomp-3', 'acomp-6', 'acomp-7',
      'beb-1', 'beb-2', 'beb-3', 'beb-4', 'beb-5', 'beb-6',
      'sob-1', 'sob-2', 'sob-3'
    ]
  },
  terca: {
    day: 'terca',
    dayLabel: 'Terça-feira',
    themeTitle: 'Terça da Galinha Velha & Frango na Brasa',
    itemIds: [
      'arroz-1', 'arroz-2',
      'feijao-1', 'feijao-2',
      'carne-1', 'carne-6', 'carne-8', 'carne-10', // Galinha Velha, Frango na Brasa, Boi Assado, Calabresa
      'acomp-1', 'acomp-2', 'acomp-3', 'acomp-4', 'acomp-5', 'acomp-7',
      'beb-1', 'beb-2', 'beb-3', 'beb-4', 'beb-5', 'beb-6',
      'sob-1', 'sob-2', 'sob-3'
    ]
  },
  quarta: {
    day: 'quarta',
    dayLabel: 'Quarta-feira',
    themeTitle: 'Quarta Nobre: Chambaril com Pirão & Churrasco',
    itemIds: [
      'arroz-1', 'arroz-2', 'arroz-3',
      'feijao-1', 'feijao-2', 'feijao-3',
      'carne-2', 'carne-3', 'carne-7', 'carne-11', // Chambaril, Contra Filé, Frango Frito, Porco na Brasa
      'acomp-1', 'acomp-2', 'acomp-3', 'acomp-5', 'acomp-6', 'acomp-7',
      'beb-1', 'beb-2', 'beb-3', 'beb-4', 'beb-5', 'beb-6',
      'sob-1', 'sob-2', 'sob-3'
    ]
  },
  quinta: {
    day: 'quinta',
    dayLabel: 'Quinta-feira',
    themeTitle: 'Quinta do Carneiro Guisado & Boi Assado',
    itemIds: [
      'arroz-1', 'arroz-2',
      'feijao-1', 'feijao-2',
      'carne-4', 'carne-6', 'carne-8', 'carne-10', // Carneiro Guisado, Frango na Brasa, Boi Assado, Calabresa
      'acomp-1', 'acomp-2', 'acomp-3', 'acomp-4', 'acomp-7',
      'beb-1', 'beb-2', 'beb-3', 'beb-4', 'beb-5', 'beb-6',
      'sob-1', 'sob-2', 'sob-3'
    ]
  },
  sexta: {
    day: 'sexta',
    dayLabel: 'Sexta-feira',
    themeTitle: 'Sexta da Casa: Galinha Caipira, Contra Filé & Porco',
    itemIds: [
      'arroz-1', 'arroz-2', 'arroz-3',
      'feijao-1', 'feijao-2',
      'carne-1', 'carne-3', 'carne-7', 'carne-11', // Galinha Velha, Contra Filé, Frango Frito, Porco na Brasa
      'acomp-1', 'acomp-2', 'acomp-3', 'acomp-5', 'acomp-6', 'acomp-7',
      'beb-1', 'beb-2', 'beb-3', 'beb-4', 'beb-5', 'beb-6',
      'sob-1', 'sob-2', 'sob-3'
    ]
  },
  sabado: {
    day: 'sabado',
    dayLabel: 'Sábado',
    themeTitle: 'Sábado Especial do Zeca: Chambaril & Carnes na Brasa',
    itemIds: [
      'arroz-1', 'arroz-2', 'arroz-3',
      'feijao-1', 'feijao-2', 'feijao-3',
      'carne-2', 'carne-3', 'carne-4', 'carne-6', 'carne-11', // Chambaril, Contra Filé, Carneiro, Frango Brasa, Porco
      'acomp-1', 'acomp-2', 'acomp-3', 'acomp-4', 'acomp-5', 'acomp-6', 'acomp-7',
      'beb-1', 'beb-2', 'beb-3', 'beb-4', 'beb-5', 'beb-6',
      'sob-1', 'sob-2', 'sob-3'
    ]
  },
  domingo: {
    day: 'domingo',
    dayLabel: 'Domingo',
    themeTitle: 'Domingo em Família: Churrasco Completo & Galinha Velha',
    itemIds: [
      'arroz-1', 'arroz-2', 'arroz-3',
      'feijao-1', 'feijao-2',
      'carne-1', 'carne-3', 'carne-6', 'carne-8', 'carne-11', // Galinha Velha, Contra Filé, Frango Brasa, Boi Assado, Porco
      'acomp-1', 'acomp-2', 'acomp-3', 'acomp-5', 'acomp-6', 'acomp-7',
      'beb-1', 'beb-2', 'beb-3', 'beb-4', 'beb-5', 'beb-6',
      'sob-1', 'sob-2', 'sob-3'
    ]
  }
};

export const getCurrentDayOfWeek = (): DayOfWeek => {
  const dayIndex = new Date().getDay(); // 0 = Domingo, 1 = Segunda, ...
  switch (dayIndex) {
    case 0: return 'domingo';
    case 1: return 'segunda';
    case 2: return 'terca';
    case 3: return 'quarta';
    case 4: return 'quinta';
    case 5: return 'sexta';
    case 6: return 'sabado';
    default: return 'segunda';
  }
};

export const DAY_ORDER: DayOfWeek[] = ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado', 'domingo'];

