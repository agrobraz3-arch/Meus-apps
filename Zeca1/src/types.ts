export type DayOfWeek = 'segunda' | 'terca' | 'quarta' | 'quinta' | 'sexta' | 'sabado' | 'domingo';

export interface DayMenuSchedule {
  day: DayOfWeek;
  dayLabel: string;
  itemIds: string[]; // List of MenuItem IDs active on this day
  themeTitle?: string; // Ex: "Quarta da Feijoada Completa", "Sexta do Peixe & Frutos do Mar"
}

export type WeeklySchedule = Record<DayOfWeek, DayMenuSchedule>;

export type MarmitaSizeId = 'p' | 'm' | 'g' | 'familia';

export interface MarmitaSize {
  id: MarmitaSizeId;
  name: string;
  label: string;
  price: number;
  description: string;
  maxMeats: number;
  maxSides: number;
  maxRice: number;
  maxBeans: number;
  popular?: boolean;
}

export type ItemCategory = 'arroz' | 'feijao' | 'carnes' | 'acompanhamentos' | 'bebidas' | 'sobremesas';

export interface MenuItem {
  id: string;
  name: string;
  category: ItemCategory;
  description?: string;
  available: boolean; // whether available today
  extraPrice?: number; // for individual drinks/desserts or premium meats
  badge?: string;
  image?: string;
}

export interface MarmitaCustomization {
  size: MarmitaSize;
  selectedRice: string[];
  selectedBeans: string[];
  selectedMeats: string[];
  selectedSides: string[];
  notes?: string;
}

export interface CartItem {
  id: string;
  type: 'marmita' | 'single_item';
  marmita?: MarmitaCustomization;
  singleItem?: MenuItem;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type PaymentType = 'pix' | 'cartao_entrega' | 'dinheiro' | 'cartao_online';

export interface PaymentDetails {
  type: PaymentType;
  cardBrand?: string;
  cashChangeFor?: number;
  pixQrCode?: string;
  pixCode?: string;
  isPaid: boolean;
}

export type OrderStatus = 'recebido' | 'preparando' | 'em_entrega' | 'entregue' | 'cancelado';

export interface DeliveryAddress {
  customerName: string;
  phone: string;
  street: string;
  number: string;
  neighborhood: string;
  complement?: string;
  referencePoint?: string;
  deliveryType: 'delivery' | 'retirada';
}

export interface Order {
  id: string;
  orderNumber: number;
  createdAt: string;
  status: OrderStatus;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  address: DeliveryAddress;
  payment: PaymentDetails;
  estimatedMinutes: number;
  deliveryBoy?: {
    name: string;
    phone: string;
    vehicle: string;
    plate: string;
  };
  trackingCoordinates?: {
    progress: number; // 0 to 100%
    lat: number;
    lng: number;
  };
}

export type PixKeyType = 'telefone' | 'cpf' | 'cnpj' | 'email' | 'aleatoria';

export interface PixConfig {
  keyType: PixKeyType;
  key: string;
  merchantName: string;
  merchantCity: string;
  bankName?: string;
  requireProofUpload?: boolean;
}

export interface RestaurantInfo {
  name: string;
  slogan: string;
  since: string;
  address: string;
  neighborhood: string;
  city: string;
  phone: string;
  whatsapp: string;
  isOpen: boolean;
  openingHours: string;
  defaultDeliveryFee: number;
  freeDeliveryAbove?: number;
  pixConfig: PixConfig;
  adminPin?: string;
}
