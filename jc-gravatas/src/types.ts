export type CategoryId = 'all' | 'slim' | 'classica' | 'borboleta' | 'kits' | 'seda-pura' | 'casamento';

export type TieColor = 'bordo' | 'marinho' | 'preto' | 'esmeralda' | 'terracota' | 'rose' | 'dourado' | 'prata' | 'estampado';

export type FabricType = 'Seda 100% Jacquard 1200 Fios' | 'Jacquard Poliéster Nobre' | 'Seda Pura Italiana' | 'Linho Puro & Algodão' | 'Knit / Tricô Italiano' | 'Veludo & Seda';

export type TieWidth = 'Slim (5,5 cm)' | 'Semi-Slim (7,0 cm)' | 'Clássica (8,5 cm)' | 'Borboleta Ajustável';

export interface Product {
  id: string;
  name: string;
  category: CategoryId;
  price: number;
  originalPrice?: number;
  images: string[];
  description: string;
  fabric: FabricType;
  width: TieWidth;
  length: string;
  color: TieColor;
  colorLabel: string;
  pattern: 'Lisa Acetinada' | 'Floral' | 'Poá / Micro-pontos' | 'Paisley / Cashmere' | 'Listrada Regimental' | 'Xadrez Tartan' | 'Texturizada';
  occasion: string[];
  stock: number;
  rating: number;
  reviewsCount: number;
  isBestSeller?: boolean;
  isNew?: boolean;
  isWeddingFav?: boolean;
  includes?: string[]; // Para kits: ex ["Gravata", "Lenço de Bolso", "Par de Abotoaduras", "Caixa de Presente"]
}

export interface CartItem {
  product: Product;
  quantity: number;
  giftBox?: boolean;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  notes?: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  password?: string;
  address: {
    cep: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  createdAt: string;
  savedCards?: {
    last4: string;
    brand: string;
    holderName: string;
    expiry: string;
  }[];
}

export type PaymentMethod = 'pix' | 'credit_card' | 'boleto' | 'whatsapp';

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: CartItem[];
  customer: CustomerInfo;
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: PaymentMethod;
  status: 'pending' | 'paid' | 'preparing' | 'shipped' | 'delivered';
  trackingCode?: string;
  installments?: number;
}

export interface KnotGuide {
  id: string;
  name: string;
  difficulty: 'Fácil' | 'Médio' | 'Avançado';
  symmetry: 'Simétrico' | 'Assimétrico';
  collarType: string;
  description: string;
  steps: {
    step: number;
    title: string;
    description: string;
    iconHint: string;
  }[];
}

export interface StoreSettings {
  storeName: string;
  whatsappNumber: string; // formato 5511999999999
  pixKey: string;
  pixKeyType: 'CNPJ' | 'Email' | 'Telefone' | 'Aleatória';
  freeShippingThreshold: number;
  pixDiscountPercent: number;
}
