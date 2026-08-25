import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  MenuItem, 
  ItemCategory,
  MarmitaSize, 
  CartItem, 
  Order, 
  OrderStatus, 
  RestaurantInfo, 
  DeliveryAddress, 
  PaymentDetails,
  MarmitaCustomization,
  DayOfWeek,
  WeeklySchedule
} from '../types';
import { 
  INITIAL_MENU_ITEMS, 
  INITIAL_MARMITA_SIZES, 
  INITIAL_RESTAURANT_INFO,
  INITIAL_WEEKLY_SCHEDULE,
  getCurrentDayOfWeek
} from '../data/initialMenu';

interface AppContextType {
  restaurant: RestaurantInfo;
  updateRestaurant: (info: Partial<RestaurantInfo>) => void;
  menuItems: MenuItem[];
  marmitaSizes: MarmitaSize[];
  cart: CartItem[];
  orders: Order[];
  activeOrder: Order | null;
  activeTab: 'menu' | 'tracking' | 'admin_menu' | 'admin_orders';
  setActiveTab: (tab: 'menu' | 'tracking' | 'admin_menu' | 'admin_orders') => void;
  
  // Weekly Schedule Automation
  weeklySchedule: WeeklySchedule;
  currentDayOfWeek: DayOfWeek;
  activeDaySelected: DayOfWeek;
  autoSyncDailyMenu: boolean;
  setAutoSyncDailyMenu: (auto: boolean) => void;
  applyDayMenu: (day: DayOfWeek) => void;
  updateWeeklyDaySchedule: (day: DayOfWeek, itemIds: string[], themeTitle?: string) => void;
  
  // Admin & Security Management
  isAdminAuthenticated: boolean;
  isAdminLoginModalOpen: boolean;
  setIsAdminLoginModalOpen: (open: boolean) => void;
  loginAdmin: (pin: string) => boolean;
  logoutAdmin: () => void;
  updateAdminPin: (newPin: string) => void;
  pendingAdminTab: 'admin_menu' | 'admin_orders';
  setPendingAdminTab: (tab: 'admin_menu' | 'admin_orders') => void;
  
  // Cart Actions
  addToCartMarmita: (customization: MarmitaCustomization, quantity?: number) => void;
  addToCartSingleItem: (item: MenuItem, quantity?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  
  // Order Actions
  createOrder: (address: DeliveryAddress, payment: PaymentDetails, deliveryFee: number) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updateOrder: (orderId: string, updates: Partial<Order>) => void;
  deleteOrder: (orderId: string) => void;
  toggleOrderPaymentPaid: (orderId: string) => void;
  setActiveTrackingOrderId: (orderId: string | null) => void;
  
  // Menu Management (Daily Menu System)
  toggleItemAvailability: (itemId: string) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (itemId: string, updates: Partial<MenuItem>) => void;
  deleteMenuItem: (itemId: string) => void;
  importBulkMenuItems: (
    items: Array<{ name: string; category: ItemCategory; badge?: string; extraPrice?: number; description?: string }>,
    targetDay?: DayOfWeek,
    replaceTargetDay?: boolean
  ) => { addedCount: number; updatedCount: number };
  exportStructuredMenuText: (day?: DayOfWeek) => string;
  updateSizePrice: (sizeId: string, newPrice: number) => void;
  resetToDefaultMenu: () => void;
  generateWhatsAppMenuText: () => string;
  generateOrderWhatsAppUrl: (order: Order) => string;
}

// 1. Definição da versão do aplicativo para forçar atualização no celular do cliente
const APP_VERSION = '1.0.2';

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  MENU: 'zeca_menu_items_v1',
  SIZES: 'zeca_sizes_v1',
  CART: 'zeca_cart_v1',
  ORDERS: 'zeca_orders_v1',
  RESTAURANT: 'zeca_restaurant_v1',
  ACTIVE_ORDER_ID: 'zeca_active_order_id_v1',
  ADMIN_AUTH: 'zeca_admin_auth_v1',
  WEEKLY_SCHEDULE: 'zeca_weekly_schedule_v1',
  AUTO_SYNC_DAY: 'zeca_auto_sync_day_v1',
  LAST_SYNCED_DATE: 'zeca_last_synced_date_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 2. Trava de versão que apaga dados antigos se houver atualização
  useEffect(() => {
    if (localStorage.getItem('app_version') !== APP_VERSION) {
      localStorage.clear();
      localStorage.setItem('app_version', APP_VERSION);
      window.location.reload();
    }
  }, []);

  const [currentDayOfWeek, setCurrentDayOfWeek] = useState<DayOfWeek>(getCurrentDayOfWeek());
  const [activeDaySelected, setActiveDaySelected] = useState<DayOfWeek>(getCurrentDayOfWeek());

  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.WEEKLY_SCHEDULE);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_WEEKLY_SCHEDULE;
      }
    }
    return INITIAL_WEEKLY_SCHEDULE;
  });

  const [autoSyncDailyMenu, setAutoSyncDailyMenuState] = useState<boolean>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTO_SYNC_DAY);
    return saved !== null ? saved === 'true' : true; // Default is true for convenience
  });

  const [restaurant, setRestaurant] = useState<RestaurantInfo>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.RESTAURANT);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // If it had the old test number, seamlessly migrate to requested 82993200513
        if (parsed.whatsapp === '5582991761488' || !parsed.whatsapp) {
          parsed.whatsapp = '5582993200513';
          parsed.phone = '(82) 99320-0513';
          if (parsed.pixConfig?.key === '82991761488') {
            parsed.pixConfig.key = '82993200513';
          }
        }
        return parsed;
      } catch {
        return INITIAL_RESTAURANT_INFO;
      }
    }
    return INITIAL_RESTAURANT_INFO;
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.MENU);
    return saved ? JSON.parse(saved) : INITIAL_MENU_ITEMS;
  });

  const [marmitaSizes, setMarmitaSizes] = useState<MarmitaSize[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.SIZES);
    return saved ? JSON.parse(saved) : INITIAL_MARMITA_SIZES;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.CART);
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.ORDERS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  const [activeTrackingOrderId, setActiveTrackingOrderIdState] = useState<string | null>(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.ACTIVE_ORDER_ID) || null;
  });

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEYS.ADMIN_AUTH) === 'true';
  });

  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState(false);
  const [pendingAdminTab, setPendingAdminTab] = useState<'admin_menu' | 'admin_orders'>('admin_menu');

  const [activeTab, setActiveTabState] = useState<'menu' | 'tracking' | 'admin_menu' | 'admin_orders'>('menu');

  const setActiveTab = (tab: 'menu' | 'tracking' | 'admin_menu' | 'admin_orders') => {
    if ((tab === 'admin_menu' || tab === 'admin_orders') && !isAdminAuthenticated) {
      setPendingAdminTab(tab);
      setIsAdminLoginModalOpen(true);
      return;
    }
    setActiveTabState(tab);
  };

  const loginAdmin = (pin: string): boolean => {
    const expectedPin = restaurant.adminPin || '1234';
    if (pin.trim() === expectedPin.trim()) {
      setIsAdminAuthenticated(true);
      localStorage.setItem(LOCAL_STORAGE_KEYS.ADMIN_AUTH, 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminAuthenticated(false);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.ADMIN_AUTH);
    setActiveTabState('menu');
  };

  const updateAdminPin = (newPin: string) => {
    if (newPin.trim().length >= 4) {
      setRestaurant(prev => ({
        ...prev,
        adminPin: newPin.trim()
      }));
    }
  };

  // Persistence
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.MENU, JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.SIZES, JSON.stringify(marmitaSizes));
  }, [marmitaSizes]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CART, JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.RESTAURANT, JSON.stringify(restaurant));
  }, [restaurant]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.WEEKLY_SCHEDULE, JSON.stringify(weeklySchedule));
  }, [weeklySchedule]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEYS.AUTO_SYNC_DAY, autoSyncDailyMenu ? 'true' : 'false');
  }, [autoSyncDailyMenu]);

  // Daily automatic menu switcher based on current date
  useEffect(() => {
    const checkAndSyncToday = () => {
      const today = getCurrentDayOfWeek();
      setCurrentDayOfWeek(today);

      const todayDateStr = new Date().toISOString().slice(0, 10);
      const lastSynced = localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_SYNCED_DATE);

      if (autoSyncDailyMenu && lastSynced !== todayDateStr) {
        // Automatically activate scheduled items for today
        const scheduleForToday = weeklySchedule[today];
        if (scheduleForToday && scheduleForToday.itemIds.length > 0) {
          setMenuItems(prev => prev.map(item => {
            // Drinks and desserts always stay available unless manually turned off
            if (item.category === 'bebidas' || item.category === 'sobremesas') {
              return item;
            }
            const isScheduled = scheduleForToday.itemIds.includes(item.id);
            return {
              ...item,
              available: isScheduled
            };
          }));
          localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_SYNCED_DATE, todayDateStr);
          setActiveDaySelected(today);
        }
      }
    };

    checkAndSyncToday();

    // Check periodically for day change (every 60s)
    const interval = setInterval(checkAndSyncToday, 60000);
    return () => clearInterval(interval);
  }, [autoSyncDailyMenu, weeklySchedule]);

  const setAutoSyncDailyMenu = (auto: boolean) => {
    setAutoSyncDailyMenuState(auto);
    localStorage.setItem(LOCAL_STORAGE_KEYS.AUTO_SYNC_DAY, auto ? 'true' : 'false');
  };

  const applyDayMenu = (day: DayOfWeek) => {
    const daySchedule = weeklySchedule[day];
    if (!daySchedule) return;

    setActiveDaySelected(day);

    setMenuItems(prev => prev.map(item => {
      // Keep drinks and desserts enabled
      if (item.category === 'bebidas' || item.category === 'sobremesas') {
        return item;
      }
      const isIncluded = daySchedule.itemIds.includes(item.id);
      return {
        ...item,
        available: isIncluded
      };
    }));

    // Update last synced date to today so it holds
    localStorage.setItem(LOCAL_STORAGE_KEYS.LAST_SYNCED_DATE, new Date().toISOString().slice(0, 10));
  };

  const updateWeeklyDaySchedule = (day: DayOfWeek, itemIds: string[], themeTitle?: string) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        itemIds,
        themeTitle: themeTitle !== undefined ? themeTitle : prev[day].themeTitle,
      }
    }));
  };

  useEffect(() => {
    if (activeTrackingOrderId) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.ACTIVE_ORDER_ID, activeTrackingOrderId);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.ACTIVE_ORDER_ID);
    }
  }, [activeTrackingOrderId]);

  // Real-time automated progression for demo & tracking realism
  useEffect(() => {
    const interval = setInterval(() => {
      setOrders(prevOrders => {
        let changed = false;
        const updated = prevOrders.map(order => {
          if (order.status === 'entregue' || order.status === 'cancelado') return order;

          const now = Date.now();
          const orderTime = new Date(order.createdAt).getTime();
          const elapsedSeconds = Math.floor((now - orderTime) / 1000);

          let newStatus = order.status;
          let progress = order.trackingCoordinates?.progress || 0;

          // Realistic timeline progression for tracking demo:
          // 0-30s: recebido -> preparando
          // 30-70s: preparando -> em_entrega (com motoboy se movendo)
          // 70-130s: em_entrega -> entregue
          if (elapsedSeconds > 30 && order.status === 'recebido') {
            newStatus = 'preparando';
            changed = true;
          } else if (elapsedSeconds > 65 && order.status === 'preparando') {
            newStatus = 'em_entrega';
            changed = true;
          } else if (order.status === 'em_entrega') {
            // animate progress from 10% to 100%
            const deliveryElapsed = elapsedSeconds - 65;
            const targetProgress = Math.min(100, Math.floor((deliveryElapsed / 55) * 100));
            if (targetProgress !== progress) {
              progress = targetProgress;
              changed = true;
            }
            if (progress >= 100 && order.status !== 'entregue') {
              newStatus = 'entregue';
              changed = true;
            }
          }

          if (changed || newStatus !== order.status) {
            return {
              ...order,
              status: newStatus,
              trackingCoordinates: {
                progress,
                lat: -9.8145 + (progress / 100) * 0.005,
                lng: -36.3120 + (progress / 100) * 0.006,
              }
            };
          }
          return order;
        });

        return changed ? updated : prevOrders;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const activeOrder = orders.find(o => o.id === activeTrackingOrderId) || orders[0] || null;

  const updateRestaurant = (info: Partial<RestaurantInfo>) => {
    setRestaurant(prev => ({ ...prev, ...info }));
  };

  const addToCartMarmita = (customization: MarmitaCustomization, quantity = 1) => {
    const id = 'cart_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
    const unitPrice = customization.size.price;
    const newItem: CartItem = {
      id,
      type: 'marmita',
      marmita: customization,
      quantity,
      unitPrice,
      totalPrice: unitPrice * quantity,
    };
    setCart(prev => [...prev, newItem]);
  };

  const addToCartSingleItem = (item: MenuItem, quantity = 1) => {
    const existingIndex = cart.findIndex(c => c.type === 'single_item' && c.singleItem?.id === item.id);
    const unitPrice = item.extraPrice || 0;
    
    if (existingIndex > -1) {
      setCart(prev => {
        const next = [...prev];
        const current = next[existingIndex];
        const newQty = current.quantity + quantity;
        next[existingIndex] = {
          ...current,
          quantity: newQty,
          totalPrice: newQty * unitPrice,
        };
        return next;
      });
    } else {
      const id = 'cart_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
      setCart(prev => [
        ...prev,
        {
          id,
          type: 'single_item',
          singleItem: item,
          quantity,
          unitPrice,
          totalPrice: unitPrice * quantity,
        }
      ]);
    }
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(c => c.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.id === cartItemId) {
          const newQty = item.quantity + delta;
          if (newQty <= 0) return null;
          return {
            ...item,
            quantity: newQty,
            totalPrice: newQty * item.unitPrice,
          };
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);

  const createOrder = (
    address: DeliveryAddress, 
    payment: PaymentDetails, 
    deliveryFee: number
  ): Order => {
    const orderNumber = 100 + orders.length + 1;
    const orderId = 'ORD-' + Date.now().toString().slice(-6);
    const subtotal = cartSubtotal;
    const total = subtotal + deliveryFee;

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      createdAt: new Date().toISOString(),
      status: 'recebido',
      items: [...cart],
      subtotal,
      deliveryFee,
      total,
      address,
      payment,
      estimatedMinutes: address.deliveryType === 'retirada' ? 15 : 35,
      deliveryBoy: {
        name: 'Carlos Oliveira (Motoboy Zeca)',
        phone: '(82) 99312-8841',
        vehicle: 'Honda CG 160 Fan Vermelha',
        plate: 'RGZ-4E82'
      },
      trackingCoordinates: {
        progress: 5,
        lat: -9.8145,
        lng: -36.3120,
      }
    };

    setOrders(prev => [newOrder, ...prev]);
    setActiveTrackingOrderIdState(orderId);
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        let progress = 0;
        if (status === 'recebido') progress = 10;
        if (status === 'preparando') progress = 40;
        if (status === 'em_entrega') progress = 75;
        if (status === 'entregue') progress = 100;

        return {
          ...o,
          status,
          trackingCoordinates: {
            progress,
            lat: -9.8145 + (progress / 100) * 0.005,
            lng: -36.3120 + (progress / 100) * 0.006,
          }
        };
      }
      return o;
    }));
  };

  const updateOrder = (orderId: string, updates: Partial<Order>) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return { ...o, ...updates };
      }
      return o;
    }));
  };

  const deleteOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
    if (activeTrackingOrderId === orderId) {
      setActiveTrackingOrderIdState(null);
    }
  };

  const toggleOrderPaymentPaid = (orderId: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          payment: {
            ...o.payment,
            isPaid: !o.payment.isPaid,
          }
        };
      }
      return o;
    }));
  };

  const setActiveTrackingOrderId = (orderId: string | null) => {
    setActiveTrackingOrderIdState(orderId);
  };

  // Menu Management
  const toggleItemAvailability = (itemId: string) => {
    setMenuItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, available: !item.available };
      }
      return item;
    }));
  };

  const addMenuItem = (itemData: Omit<MenuItem, 'id'>) => {
    const newItem: MenuItem = {
      ...itemData,
      id: 'custom_' + Date.now(),
    };
    setMenuItems(prev => [...prev, newItem]);
  };

  const updateMenuItem = (itemId: string, updates: Partial<MenuItem>) => {
    setMenuItems(prev => prev.map(item => item.id === itemId ? { ...item, ...updates } : item));
  };

  const deleteMenuItem = (itemId: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== itemId));
  };

  const importBulkMenuItems = (
    items: Array<{ name: string; category: ItemCategory; badge?: string; extraPrice?: number; description?: string }>,
    targetDay?: DayOfWeek,
    replaceTargetDay = false
  ): { addedCount: number; updatedCount: number } => {
    let added = 0;
    let updated = 0;
    const targetItemIds: string[] = [];

    setMenuItems(prev => {
      const nextList = [...prev];

      items.forEach(incoming => {
        const cleanName = incoming.name.trim();
        if (!cleanName) return;

        // Case-insensitive name match
        const existingIdx = nextList.findIndex(
          it => it.name.trim().toLowerCase() === cleanName.toLowerCase()
        );

        if (existingIdx > -1) {
          // Update existing item
          nextList[existingIdx] = {
            ...nextList[existingIdx],
            category: incoming.category,
            badge: incoming.badge || nextList[existingIdx].badge,
            description: incoming.description || nextList[existingIdx].description,
            extraPrice: incoming.extraPrice !== undefined ? incoming.extraPrice : nextList[existingIdx].extraPrice,
            available: true,
          };
          targetItemIds.push(nextList[existingIdx].id);
          updated++;
        } else {
          // Create new item
          const newId = 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4);
          const newItem: MenuItem = {
            id: newId,
            name: cleanName,
            category: incoming.category,
            badge: incoming.badge,
            description: incoming.description,
            extraPrice: incoming.extraPrice,
            available: true,
          };
          nextList.push(newItem);
          targetItemIds.push(newId);
          added++;
        }
      });

      return nextList;
    });

    // If a target day was selected, associate these items with that day's schedule
    if (targetDay) {
      setWeeklySchedule(prev => {
        const currentSched = prev[targetDay] || { day: targetDay, dayLabel: targetDay, itemIds: [] };
        let finalItemIds: string[];

        if (replaceTargetDay) {
          // Keep drinks and desserts if desired, or replace with imported
          finalItemIds = targetItemIds;
        } else {
          // Merge avoiding duplicates
          finalItemIds = Array.from(new Set([...currentSched.itemIds, ...targetItemIds]));
        }

        return {
          ...prev,
          [targetDay]: {
            ...currentSched,
            itemIds: finalItemIds,
          }
        };
      });
    }

    return { addedCount: added, updatedCount: updated };
  };

  const exportStructuredMenuText = (day?: DayOfWeek): string => {
    const targetDay = day || activeDaySelected || currentDayOfWeek;
    const schedule = weeklySchedule[targetDay];
    const dayLabel = schedule?.dayLabel || 'Hoje';
    const theme = schedule?.themeTitle ? `\n🔥 *Destaque:* ${schedule.themeTitle}` : '';

    // Filter items either by day schedule or all currently active
    const activeItems = schedule && schedule.itemIds.length > 0
      ? menuItems.filter(i => schedule.itemIds.includes(i.id))
      : menuItems.filter(i => i.available);

    const carnes = activeItems.filter(i => i.category === 'carnes');
    const arrozes = activeItems.filter(i => i.category === 'arroz');
    const feijoes = activeItems.filter(i => i.category === 'feijao');
    const acompanhamentos = activeItems.filter(i => i.category === 'acompanhamentos');
    const bebidas = menuItems.filter(i => i.category === 'bebidas');
    const sobremesas = menuItems.filter(i => i.category === 'sobremesas');

    let text = `🍽️ *CARDÁPIO DO ZECA - ${dayLabel.toUpperCase()}*${theme}\n\n`;

    if (carnes.length > 0) {
      text += `🥩 *CARNES:*\n${carnes.map(c => `- ${c.name}${c.badge ? ` (${c.badge})` : ''}`).join('\n')}\n\n`;
    }
    if (arrozes.length > 0) {
      text += `🍚 *ARROZ:*\n${arrozes.map(a => `- ${a.name}`).join('\n')}\n\n`;
    }
    if (feijoes.length > 0) {
      text += `🫘 *FEIJÃO:*\n${feijoes.map(f => `- ${f.name}`).join('\n')}\n\n`;
    }
    if (acompanhamentos.length > 0) {
      text += `🥗 *ACOMPANHAMENTOS:*\n${acompanhamentos.map(ac => `- ${ac.name}`).join('\n')}\n\n`;
    }
    if (bebidas.length > 0) {
      text += `🥤 *BEBIDAS:*\n${bebidas.map(b => `- ${b.name}${b.extraPrice ? ` - R$ ${b.extraPrice.toFixed(2)}` : ''}`).join('\n')}\n\n`;
    }
    if (sobremesas.length > 0) {
      text += `🍰 *SOBREMESAS:*\n${sobremesas.map(s => `- ${s.name}${s.extraPrice ? ` - R$ ${s.extraPrice.toFixed(2)}` : ''}`).join('\n')}\n\n`;
    }

    text += `📍 *Restaurante do Zeca* - Delivery: ${restaurant.phone}`;
    return text.trim();
  };

  const updateSizePrice = (sizeId: string, newPrice: number) => {
    setMarmitaSizes(prev => prev.map(s => s.id === sizeId ? { ...s, price: newPrice } : s));
  };

  const resetToDefaultMenu = () => {
    setMenuItems(INITIAL_MENU_ITEMS);
    setMarmitaSizes(INITIAL_MARMITA_SIZES);
  };

  const generateWhatsAppMenuText = (): string => {
    const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit' });
    
    const arrozes = menuItems.filter(i => i.category === 'arroz' && i.available).map(i => `• ${i.name}`).join('\n');
    const feijoes = menuItems.filter(i => i.category === 'feijao' && i.available).map(i => `• ${i.name}`).join('\n');
    const carnes = menuItems.filter(i => i.category === 'carnes' && i.available).map(i => `• ${i.name}`).join('\n');
    const acomp = menuItems.filter(i => i.category === 'acompanhamentos' && i.available).map(i => `• ${i.name}`).join('\n');
    
    const sizes = marmitaSizes.map(s => `🍱 ${s.name} - R$ ${s.price.toFixed(2)}`).join('\n');

    return `🔥 *CARDÁPIO DO DIA - RESTAURANTE DO ZECA* 🔥\n📅 *${today.toUpperCase()}*\n\n${sizes}\n\n🍚 *OPÇÕES DE ARROZ:*\n${arrozes}\n\n🍲 *OPÇÕES DE FEIJÃO:*\n${feijoes}\n\n🥩 *CARNES DO DIA:*\n${carnes}\n\n🥗 *ACOMPANHAMENTOS:*\n${acomp}\n\n📍 *Endereço:* ${restaurant.address} - ${restaurant.city}\n🛵 *Peça pelo Delivery:* ${restaurant.phone}\n🔗 *Monte seu pedido online com rastreamento:* ${window.location.origin}`;
  };

  const generateOrderWhatsAppUrl = (order: Order): string => {
    const itemsText = order.items.map((it, idx) => {
      if (it.type === 'marmita' && it.marmita) {
        const m = it.marmita;
        return `*${idx + 1}. ${m.size.name}* (Qtd: ${it.quantity}) - R$ ${it.totalPrice.toFixed(2)}\n  - Arroz: ${m.selectedRice.length > 0 ? m.selectedRice.join(', ') : '🚫 Sem arroz'}\n  - Feijão: ${m.selectedBeans.length > 0 ? m.selectedBeans.join(', ') : '🚫 SEM FEIJÃO'}\n  - Carnes: ${m.selectedMeats.length > 0 ? m.selectedMeats.join(', ') : 'Nenhuma'}\n  - Acompanhamentos: ${m.selectedSides.length > 0 ? m.selectedSides.join(', ') : 'Nenhum'}${m.notes ? `\n  - Obs: ${m.notes}` : ''}`;
      } else if (it.singleItem) {
        return `*${idx + 1}. ${it.singleItem.name}* (Qtd: ${it.quantity}) - R$ ${it.totalPrice.toFixed(2)}`;
      }
      return '';
    }).join('\n\n');

    const paymentDesc = order.payment.type === 'pix' 
      ? `PIX (${order.payment.isPaid ? '✅ Já Pago Online' : 'Pagar na Entrega'})`
      : order.payment.type === 'cartao_entrega' 
      ? `Cartão na Entrega (${order.payment.cardBrand || 'Maquininha'})` 
      : `Dinheiro ${order.payment.cashChangeFor ? `(Troco para R$ ${order.payment.cashChangeFor.toFixed(2)})` : '(Sem troco)'}`;

    const text = `🔔 *NOVO PEDIDO #${order.orderNumber} - RESTAURANTE DO ZECA*\n\n` +
      `👤 *Cliente:* ${order.address.customerName}\n` +
      `📱 *Telefone:* ${order.address.phone}\n` +
      `📍 *Tipo:* ${order.address.deliveryType === 'delivery' ? '🛵 Entrega em Domicílio' : '🏬 Retirada no Balcão'}\n` +
      (order.address.deliveryType === 'delivery' ? `🏠 *Endereço:* ${order.address.street}, Nº ${order.address.number} - ${order.address.neighborhood}${order.address.complement ? ` (${order.address.complement})` : ''}${order.address.referencePoint ? `\n📌 *Ref:* ${order.address.referencePoint}` : ''}\n` : '') +
      `\n🛒 *ITENS DO PEDIDO:*\n${itemsText}\n\n` +
      `💵 *Subtotal:* R$ ${order.subtotal.toFixed(2)}\n` +
      `🛵 *Taxa de Entrega:* R$ ${order.deliveryFee.toFixed(2)}\n` +
      `💰 *TOTAL:* R$ ${order.total.toFixed(2)}\n` +
      `💳 *Forma de Pagamento:* ${paymentDesc}\n\n` +
      `⏱️ *Rastreamento:* ${window.location.origin}`;

    return `https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(text)}`;
  };

  return (
    <AppContext.Provider
      value={{
        restaurant,
        updateRestaurant,
        menuItems,
        marmitaSizes,
        cart,
        orders,
        activeOrder,
        activeTab,
        setActiveTab,
        weeklySchedule,
        currentDayOfWeek,
        activeDaySelected,
        autoSyncDailyMenu,
        setAutoSyncDailyMenu,
        applyDayMenu,
        updateWeeklyDaySchedule,
        isAdminAuthenticated,
        isAdminLoginModalOpen,
        setIsAdminLoginModalOpen,
        loginAdmin,
        logoutAdmin,
        updateAdminPin,
        pendingAdminTab,
        setPendingAdminTab,
        addToCartMarmita,
        addToCartSingleItem,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        createOrder,
        updateOrderStatus,
        updateOrder,
        deleteOrder,
        toggleOrderPaymentPaid,
        setActiveTrackingOrderId,
        toggleItemAvailability,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        importBulkMenuItems,
        exportStructuredMenuText,
        updateSizePrice,
        resetToDefaultMenu,
        generateWhatsAppMenuText,
        generateOrderWhatsAppUrl,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
