import React, { useState, useMemo, useEffect } from 'react';
import { 
  sampleProducts, 
  initialStoreSettings, 
  weddingDiscounts 
} from './data/products';
import { initialSampleUsers } from './data/users';
import { 
  Product, 
  CategoryId, 
  CartItem, 
  Order, 
  StoreSettings, 
  TieColor,
  CustomerUser
} from './types';
import { 
  subscribeToProducts,
  saveProductToFirestore,
  updateProductStockInFirestore,
  deleteProductFromFirestore,
  subscribeToOrders,
  saveOrderToFirestore,
  updateOrderStatusInFirestore,
  subscribeToSettings,
  saveSettingsToFirestore,
  subscribeToCustomers,
  saveCustomerToFirestore,
  seedInitialProducts
} from './lib/firebase';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { CustomerAccountModal } from './components/CustomerAccountModal';
import { SuitAdvisorModal } from './components/SuitAdvisorModal';
import { KnotTutorialsModal } from './components/KnotTutorialsModal';
import { CustomerSupportModal } from './components/CustomerSupportModal';
import { AdminDrawer } from './components/AdminDrawer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Footer } from './components/Footer';
import { 
  Filter, 
  SlidersHorizontal, 
  Sparkles, 
  Check, 
  HeartHandshake, 
  Tag, 
  Layers, 
  X,
  Search,
  ArrowUpDown
} from 'lucide-react';
import { formatCurrency } from './utils';

export default function App() {
  // Store Data & Settings (persisted to Firebase Firestore & local fallback)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('ds_custom_products');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return sampleProducts;
  });

  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('ds_store_settings');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialStoreSettings;
  });

  // Users & Customer Authentication state
  const [users, setUsers] = useState<CustomerUser[]>(() => {
    try {
      const saved = localStorage.getItem('ds_users');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialSampleUsers;
  });

  const [currentUser, setCurrentUser] = useState<CustomerUser | null>(() => {
    try {
      const saved = localStorage.getItem('ds_current_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return initialSampleUsers[0]; // Start with sample user Guilherme logged in
  });

  // Orders State (Persisted to Firestore & local cache)
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('ds_orders');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'ord_1',
        orderNumber: 'JC-984210-412',
        date: new Date(Date.now() - 3600000 * 4).toISOString(),
        items: [
          { product: sampleProducts[1], quantity: 6, giftBox: true },
          { product: sampleProducts[2], quantity: 1, giftBox: true },
        ],
        customer: {
          name: 'Guilherme Siqueira',
          email: 'guilherme.noivo@gmail.com',
          phone: '(11) 98765-4321',
          cpf: '123.456.789-00',
          cep: '01419-001',
          street: 'Alameda Santos',
          number: '1200',
          complement: 'Apto 42',
          neighborhood: 'Cerqueira César',
          city: 'São Paulo',
          state: 'SP',
        },
        subtotal: 709.30,
        discount: 106.39,
        shipping: 0,
        total: 602.91,
        paymentMethod: 'PIX (Chave Cadastrada)',
        status: 'paid',
        trackingCode: 'BR893420194SP',
      },
    ];
  });

  // Firebase Real-time Subscriptions
  useEffect(() => {
    const unsubProducts = subscribeToProducts((cloudProducts) => {
      if (cloudProducts && cloudProducts.length > 0) {
        setProducts(cloudProducts);
      }
    });

    const unsubOrders = subscribeToOrders((cloudOrders) => {
      if (cloudOrders && cloudOrders.length > 0) {
        setOrders(cloudOrders);
      }
    });

    const unsubSettings = subscribeToSettings((cloudSettings) => {
      if (cloudSettings) {
        setSettings(cloudSettings);
      }
    });

    const unsubCustomers = subscribeToCustomers((cloudCustomers) => {
      if (cloudCustomers && cloudCustomers.length > 0) {
        setUsers(cloudCustomers);
      }
    });

    return () => {
      unsubProducts();
      unsubOrders();
      unsubSettings();
      unsubCustomers();
    };
  }, []);

  // Local Storage Synchronizations
  useEffect(() => {
    try {
      localStorage.setItem('ds_custom_products', JSON.stringify(products));
    } catch (e) {
      console.error(e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem('ds_store_settings', JSON.stringify(settings));
    } catch (e) {
      console.error(e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('ds_orders', JSON.stringify(orders));
    } catch (e) {
      console.error(e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('ds_users', JSON.stringify(users));
    } catch (e) {
      console.error(e);
    }
  }, [users]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('ds_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('ds_current_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  // Catalog Filters & Search
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [selectedWidth, setSelectedWidth] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Cart & Checkout
  const [cart, setCart] = useState<CartItem[]>([
    { product: sampleProducts[1], quantity: 1, giftBox: false }
  ]);
  const [appliedCoupon, setAppliedCoupon] = useState<string>('');
  const [initialDiscount, setInitialDiscount] = useState<number>(0);

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isSuitAdvisorOpen, setIsSuitAdvisorOpen] = useState(false);
  const [isKnotTutorialsOpen, setIsKnotTutorialsOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Added-to-cart Toast feedback
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);

  // User Auth Handlers
  const handleLogin = (emailOrCpf: string, pass?: string): boolean => {
    const cleanInput = (emailOrCpf || '').trim().toLowerCase();
    const cleanDigits = (emailOrCpf || '').replace(/\D/g, '');
    const found = users.find(
      (u) =>
        (u?.email || '').toLowerCase() === cleanInput ||
        (cleanDigits.length >= 9 && (u?.cpf || '').replace(/\D/g, '') === cleanDigits) ||
        (cleanDigits.length >= 9 && (u?.phone || '').replace(/\D/g, '') === cleanDigits)
    );

    if (found) {
      setCurrentUser(found);
      return true;
    }
    return false;
  };

  const handleRegister = (userData: Omit<CustomerUser, 'id' | 'createdAt'>) => {
    const newUser: CustomerUser = {
      ...userData,
      id: `usr_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    saveCustomerToFirestore(newUser).catch((err) => console.error(err));
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleUpdateUser = (updatedUser: CustomerUser) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    setCurrentUser(updatedUser);
    saveCustomerToFirestore(updatedUser).catch((err) => console.error(err));
  };

  const handleReorder = (items: CartItem[]) => {
    setCart(items);
    setIsCartOpen(true);
  };

  // Color chips filter list
  const colorFilterOptions = [
    { id: 'all', label: 'Todas as Cores', colorHex: 'transparent' },
    { id: 'bordo', label: 'Bordô / Marsala', colorHex: '#722F37' },
    { id: 'marinho', label: 'Azul Marinho', colorHex: '#00204A' },
    { id: 'esmeralda', label: 'Verde Esmeralda', colorHex: '#046307' },
    { id: 'terracota', label: 'Terracota', colorHex: '#C85A32' },
    { id: 'rose', label: 'Rosé Quartz', colorHex: '#E8A598' },
    { id: 'dourado', label: 'Dourado / Ouro', colorHex: '#D4AF37' },
    { id: 'preto', label: 'Preto Clássico', colorHex: '#1A1A1A' },
    { id: 'prata', label: 'Prata / Chumbo', colorHex: '#8C92AC' },
  ];

  // Width filter options
  const widthFilterOptions = [
    { id: 'all', label: 'Todas as Larguras' },
    { id: 'Slim (5,5 cm)', label: 'Slim (5,5 cm)' },
    { id: 'Semi-Slim (7,0 cm)', label: 'Semi-Slim (7,0 cm)' },
    { id: 'Clássica (8,5 cm)', label: 'Clássica (8,5 cm)' },
    { id: 'Borboleta Ajustável', label: 'Borboleta' },
  ];

  // Cart Operations
  const handleAddToCart = (product: Product, quantity = 1, giftBox = false) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.giftBox === giftBox
      );

      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity += quantity;
        return newCart;
      } else {
        return [...prevCart, { product, quantity, giftBox }];
      }
    });

    setLastAddedId(product.id);
    setTimeout(() => setLastAddedId(null), 1800);
  };

  const handleUpdateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const handleProceedToCheckout = (coupon: string, discount: number) => {
    setAppliedCoupon(coupon);
    setInitialDiscount(discount);
    setIsCheckoutOpen(true);
  };

  const handleDirectCheckout = (product: Product, quantity: number, giftBox: boolean) => {
    handleAddToCart(product, quantity, giftBox);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  const handleOrderCompleted = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]); // Clear cart after order is finalized

    // Save order to Firestore Cloud Database
    saveOrderToFirestore(newOrder).catch((err) => console.error('Error saving order to Firestore:', err));

    // Deduct stock in Firestore
    newOrder.items.forEach((item) => {
      const currentProd = products.find((p) => p.id === item.product.id);
      if (currentProd) {
        const newStock = Math.max(0, currentProd.stock - item.quantity);
        updateProductStockInFirestore(item.product.id, newStock).catch((err) => console.error(err));
      }
    });

    // If customer is logged in, ensure their saved address is updated with the latest delivery address
    if (currentUser) {
      const updatedUser: CustomerUser = {
        ...currentUser,
        phone: newOrder.customer.phone || currentUser.phone,
        cpf: newOrder.customer.cpf || currentUser.cpf,
        address: {
          cep: newOrder.customer.cep || currentUser.address.cep,
          street: newOrder.customer.street || currentUser.address.street,
          number: newOrder.customer.number || currentUser.address.number,
          complement: newOrder.customer.complement || currentUser.address.complement || '',
          neighborhood: newOrder.customer.neighborhood || currentUser.address.neighborhood,
          city: newOrder.customer.city || currentUser.address.city,
          state: newOrder.customer.state || currentUser.address.state,
        },
      };
      handleUpdateUser(updatedUser);
    }
  };

  // Stock and admin product updates
  const handleUpdateStock = (productId: string, newStock: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
    );
    updateProductStockInFirestore(productId, newStock).catch((err) => console.error(err));
  };

  const handleSaveProduct = (product: Product) => {
    setProducts((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.map((p) => (p.id === product.id ? product : p));
      } else {
        return [product, ...prev];
      }
    });
    saveProductToFirestore(product).catch((err) => console.error(err));
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    deleteProductFromFirestore(productId).catch((err) => console.error(err));
  };

  const handleDuplicateProduct = (productId: string) => {
    const original = products.find((p) => p.id === productId);
    if (!original) return;
    const duplicated: Product = {
      ...original,
      id: `prod-${Date.now()}`,
      name: `${original.name} (Cópia)`,
      stock: 15,
      isNew: true,
      isBestSeller: false,
    };
    setProducts((prev) => [duplicated, ...prev]);
    saveProductToFirestore(duplicated).catch((err) => console.error(err));
  };

  const handleResetProducts = () => {
    setProducts(sampleProducts);
    try {
      localStorage.removeItem('ds_custom_products');
    } catch (e) {
      console.error(e);
    }
    seedInitialProducts().catch((err) => console.error(err));
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status'], trackingCode?: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status, trackingCode: trackingCode !== undefined ? trackingCode : o.trackingCode } : o))
    );
    updateOrderStatusInFirestore(orderId, status, trackingCode).catch((err) => console.error(err));
  };

  const handleUpdateSettings = (newSettings: StoreSettings) => {
    setSettings(newSettings);
    saveSettingsToFirestore(newSettings).catch((err) => console.error(err));
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (!p) return false;

      // Category match
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'casamento' && !p.isWeddingFav && p.category !== 'casamento') {
          return false;
        } else if (selectedCategory !== 'casamento' && p.category !== selectedCategory) {
          return false;
        }
      }

      // Color match
      if (selectedColor !== 'all' && p.color !== selectedColor) {
        return false;
      }

      // Width match
      if (selectedWidth !== 'all' && p.width !== selectedWidth) {
        return false;
      }

      // Search match
      if (searchQuery.trim()) {
        const query = (searchQuery || '').toLowerCase();
        const matchesName = (p.name || '').toLowerCase().includes(query);
        const matchesColor = (p.colorLabel || '').toLowerCase().includes(query);
        const matchesFabric = (p.fabric || '').toLowerCase().includes(query);
        const matchesPattern = (p.pattern || '').toLowerCase().includes(query);
        const matchesDesc = (p.description || '').toLowerCase().includes(query);
        const matchesOccasion = Array.isArray(p.occasion) && p.occasion.some((o) => (o || '').toLowerCase().includes(query));
        return matchesName || matchesColor || matchesFabric || matchesPattern || matchesDesc || matchesOccasion;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a?.price || 0;
      const priceB = b?.price || 0;
      const ratingA = a?.rating || 0;
      const ratingB = b?.rating || 0;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'rating') return ratingB - ratingA;
      // Default featured
      if (a?.isBestSeller && !b?.isBestSeller) return -1;
      if (!a?.isBestSeller && b?.isBestSeller) return 1;
      return 0;
    });
  }, [products, selectedCategory, selectedColor, selectedWidth, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950 font-sans">
      
      {/* 1. Top Global Navigation Header */}
      <Header
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        cart={cart}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSuitAdvisor={() => setIsSuitAdvisorOpen(true)}
        onOpenKnotTutorials={() => setIsKnotTutorialsOpen(true)}
        onOpenSupport={() => setIsSupportOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        currentUser={currentUser}
        onOpenAccount={() => setIsAccountModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        settings={settings}
      />

      {/* 2. Hero Luxury Sartorial Banner */}
      <Hero
        onExplore={(category) => {
          setSelectedCategory(category);
          const elem = document.getElementById('catalog-section');
          elem?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenAdvisor={() => setIsSuitAdvisorOpen(true)}
      />

      {/* 3. Main Catalog & Store Section */}
      <main id="catalog-section" className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        
        {/* Wedding Group Order Promotion Strip */}
        <div className="bg-gradient-to-r from-amber-950/40 via-amber-900/30 to-slate-900 border border-amber-500/30 rounded-2xl p-4 sm:p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center md:text-left">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40 shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-serif-luxury">
                Vai casar ou convidar padrinhos? Descontos automáticos no carrinho!
              </h3>
              <p className="text-xs text-amber-200/80">
                4+ unidades ganham <strong>10% OFF</strong> • 8+ unidades ganham <strong>15% OFF</strong> • 12+ ganham <strong>20% OFF + Frete Grátis</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setSelectedCategory('casamento');
                setSelectedColor('all');
              }}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer"
            >
              Ver Gravatas de Padrinhos
            </button>
          </div>
        </div>

        {/* Filters & Control Bar */}
        <div className="space-y-4">
          
          {/* Main Filter Row */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            
            {/* Title & Count */}
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white font-serif-luxury">
                {selectedCategory === 'all' && 'Coleção Completa de Gravatas'}
                {selectedCategory === 'casamento' && 'Coleção Padrinhos & Casamentos'}
                {selectedCategory === 'kits' && 'Kits com Lenço, Abotoaduras e Estojo'}
                {selectedCategory === 'slim' && 'Gravatas Slim (5,5 cm)'}
                {selectedCategory === 'seda-pura' && 'Linha Seda Pura Italiana'}
                {selectedCategory === 'classica' && 'Gravatas Clássicas (8,5 cm)'}
                {selectedCategory === 'borboleta' && 'Gravatas Borboleta & Black Tie'}
              </h2>
              <span className="text-xs bg-slate-800 text-slate-300 font-semibold px-2.5 py-0.5 rounded-full">
                {filteredProducts.length} modelos
              </span>
            </div>

            {/* Controls: Width & Sorting */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Width Select */}
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span>Largura:</span>
                <select
                  value={selectedWidth}
                  onChange={(e) => setSelectedWidth(e.target.value)}
                  className="bg-slate-950 text-xs text-slate-200 px-3 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500"
                >
                  {widthFilterOptions.map((w) => (
                    <option key={w.id} value={w.id}>{w.label}</option>
                  ))}
                </select>
              </div>

              {/* Sort Select */}
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <span>Ordenar:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-950 text-xs text-slate-200 px-3 py-1.5 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500"
                >
                  <option value="featured">Mais Vendidas / Destaque</option>
                  <option value="price-asc">Menor Preço</option>
                  <option value="price-desc">Maior Preço</option>
                  <option value="rating">Melhor Avaliadas</option>
                </select>
              </div>
            </div>

          </div>

          {/* Color Chips Quick Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            <span className="text-xs font-bold text-slate-400 shrink-0 mr-1 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Filtrar por Cor:
            </span>
            {colorFilterOptions.map((color) => {
              const isSelected = selectedColor === color.id;
              return (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 border cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-sm'
                      : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  {color.id !== 'all' && (
                    <span 
                      className="w-3 h-3 rounded-full border border-white/20 inline-block shadow-sm"
                      style={{ backgroundColor: color.colorHex }}
                    />
                  )}
                  <span>{color.label}</span>
                </button>
              );
            })}

            {(selectedColor !== 'all' || selectedWidth !== 'all' || searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSelectedColor('all');
                  setSelectedWidth('all');
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold px-2 py-1 flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Limpar Filtros</span>
              </button>
            )}
          </div>

        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-slate-900/40 rounded-2xl border border-slate-800">
            <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mx-auto text-slate-500 border border-slate-800">
              <Search className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Nenhuma gravata encontrada</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Não encontramos modelos para esses filtros. Tente limpar os filtros ou buscar por outra cor ou tecido.
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedColor('all');
                setSelectedWidth('all');
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="bg-amber-500 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl"
            >
              Exibir Todas as Gravatas
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(prod) => setSelectedProduct(prod)}
                onAddToCart={(prod, e) => {
                  handleAddToCart(prod, 1, false);
                }}
                isAdded={lastAddedId === product.id}
              />
            ))}
          </div>
        )}

      </main>

      {/* 4. Luxury Footer */}
      <Footer
        onSelectCategory={setSelectedCategory}
        onOpenAdvisor={() => setIsSuitAdvisorOpen(true)}
        onOpenKnotTutorials={() => setIsKnotTutorialsOpen(true)}
        onOpenSupport={() => setIsSupportOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        settings={settings}
      />

      {/* 5. Floating WhatsApp Automation Agent */}
      <FloatingWhatsApp
        settings={settings}
        onOpenAdvisor={() => setIsSuitAdvisorOpen(true)}
      />

      {/* MODALS & DRAWERS */}
      
      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={(prod, qty, gift) => handleAddToCart(prod, qty, gift)}
        onDirectCheckout={handleDirectCheckout}
        onOpenAdvisor={() => setIsSuitAdvisorOpen(true)}
        settings={settings}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleProceedToCheckout}
        settings={settings}
      />

      {/* Checkout Modal (Multi-step with PIX QR, Credit Card, WhatsApp direct, autofill saved address) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        appliedCoupon={appliedCoupon}
        initialDiscount={initialDiscount}
        onOrderCompleted={handleOrderCompleted}
        settings={settings}
        currentUser={currentUser}
        onOpenAccount={() => {
          setIsCheckoutOpen(false);
          setIsAccountModalOpen(true);
        }}
      />

      {/* Customer Account & Order History Portal Modal */}
      <CustomerAccountModal
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        currentUser={currentUser}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onLogout={handleLogout}
        onUpdateUser={handleUpdateUser}
        orders={orders}
        onReorder={handleReorder}
        onOpenAdvisor={() => {
          setIsAccountModalOpen(false);
          setIsSuitAdvisorOpen(true);
        }}
        settings={settings}
      />

      {/* Suit & Look Matcher Advisor */}
      <SuitAdvisorModal
        isOpen={isSuitAdvisorOpen}
        onClose={() => setIsSuitAdvisorOpen(false)}
        products={products}
        onSelectProduct={(prod) => setSelectedProduct(prod)}
        onAddToCart={(prod) => handleAddToCart(prod, 1, false)}
      />

      {/* Knot Tutorials Guide Modal */}
      <KnotTutorialsModal
        isOpen={isKnotTutorialsOpen}
        onClose={() => setIsKnotTutorialsOpen(false)}
      />

      {/* Customer Support & FAQs Modal */}
      <CustomerSupportModal
        isOpen={isSupportOpen}
        onClose={() => setIsSupportOpen(false)}
        settings={settings}
      />

      {/* Store Owner Admin Drawer */}
      <AdminDrawer
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        products={products}
        onUpdateStock={handleUpdateStock}
        onSaveProduct={handleSaveProduct}
        onDeleteProduct={handleDeleteProduct}
        onDuplicateProduct={handleDuplicateProduct}
        onResetProducts={handleResetProducts}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        users={users}
      />

    </div>
  );
}
