import React, { useState } from 'react';
import { 
  X, 
  User, 
  Package, 
  MapPin, 
  LogOut, 
  Lock, 
  Mail, 
  Phone, 
  CreditCard, 
  CheckCircle2, 
  Clock, 
  Truck, 
  ShoppingBag, 
  ArrowRight, 
  ShieldCheck, 
  Search, 
  Plus,
  Save,
  RotateCcw,
  Sparkles,
  ExternalLink,
  MessageCircle,
  FileText
} from 'lucide-react';
import { CustomerUser, Order, CartItem, StoreSettings } from '../types';
import { formatCurrency, formatPhoneDisplay } from '../utils';

interface CustomerAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CustomerUser | null;
  onLogin: (emailOrCpf: string, pass?: string) => boolean;
  onRegister: (userData: Omit<CustomerUser, 'id' | 'createdAt'>) => void;
  onLogout: () => void;
  onUpdateUser: (userData: CustomerUser) => void;
  orders: Order[];
  onReorder: (items: CartItem[]) => void;
  onOpenAdvisor?: () => void;
  settings: StoreSettings;
}

export const CustomerAccountModal: React.FC<CustomerAccountModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onRegister,
  onLogout,
  onUpdateUser,
  orders,
  onReorder,
  onOpenAdvisor,
  settings,
}) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'address' | 'profile'>('orders');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  // Login form state
  const [loginInput, setLoginInput] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register / Edit Profile state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cpf: '',
    password: '',
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: 'SP',
  });

  // When opening or user changes, populate form if logged in
  React.useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        cpf: currentUser.cpf || '',
        password: currentUser.password || '',
        cep: currentUser.address.cep || '',
        street: currentUser.address.street || '',
        number: currentUser.address.number || '',
        complement: currentUser.address.complement || '',
        neighborhood: currentUser.address.neighborhood || '',
        city: currentUser.address.city || '',
        state: currentUser.address.state || 'SP',
      });
      setLoginError('');
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  // Filter orders related to this user
  const userOrders = currentUser
    ? orders.filter(
        (o) =>
          (o?.customer?.email || '').toLowerCase() === (currentUser?.email || '').toLowerCase() ||
          (o?.customer?.phone || '').replace(/\D/g, '') === (currentUser?.phone || '').replace(/\D/g, '')
      )
    : [];

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginInput.trim()) {
      setLoginError('Por favor, informe seu e-mail ou CPF.');
      return;
    }

    const success = onLogin(loginInput.trim(), loginPassword);
    if (!success) {
      setLoginError('Usuário não encontrado ou senha inválida.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setLoginError('Por favor, preencha Nome, E-mail e Telefone.');
      return;
    }

    onRegister({
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      phone: formData.phone.trim(),
      cpf: formData.cpf.trim(),
      password: formData.password || '123',
      address: {
        cep: formData.cep.trim(),
        street: formData.street.trim(),
        number: formData.number.trim(),
        complement: formData.complement.trim(),
        neighborhood: formData.neighborhood.trim(),
        city: formData.city.trim(),
        state: formData.state.trim() || 'SP',
      },
    });

    setIsRegistering(false);
  };

  const handleSaveAddressAndProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    const updated: CustomerUser = {
      ...currentUser,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      cpf: formData.cpf,
      address: {
        cep: formData.cep,
        street: formData.street,
        number: formData.number,
        complement: formData.complement,
        neighborhood: formData.neighborhood,
        city: formData.city,
        state: formData.state,
      },
    };

    onUpdateUser(updated);
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  const handleFetchCep = async (cepValue: string) => {
    const cleanCep = cepValue.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      setIsLoadingCep(true);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setFormData((prev) => ({
            ...prev,
            street: data.logradouro || prev.street,
            neighborhood: data.bairro || prev.neighborhood,
            city: data.localidade || prev.city,
            state: data.uf || prev.state,
          }));
        }
      } catch (err) {
        console.error('Erro ao consultar CEP:', err);
      } finally {
        setIsLoadingCep(false);
      }
    }
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full text-xs font-semibold border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pago & Aprovado</span>
          </span>
        );
      case 'preparing':
        return (
          <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-full text-xs font-semibold border border-amber-500/30">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Em Separação & Embalagem</span>
          </span>
        );
      case 'shipped':
        return (
          <span className="inline-flex items-center gap-1 bg-blue-500/20 text-blue-300 px-2.5 py-1 rounded-full text-xs font-semibold border border-blue-500/30">
            <Truck className="w-3.5 h-3.5 text-blue-400" />
            <span>Enviado com Rastreio</span>
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1 bg-purple-500/20 text-purple-300 px-2.5 py-1 rounded-full text-xs font-semibold border border-purple-500/30">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Entregue ao Destinatário</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full text-xs font-semibold border border-slate-700">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Aguardando Pagamento</span>
          </span>
        );
    }
  };

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
              <User className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-serif-luxury">
                {currentUser ? `Minha Conta • ${currentUser.name}` : 'Acesse sua Conta • JC Gravatas'}
              </h2>
              <p className="text-[11px] text-slate-400">
                {currentUser 
                  ? 'Acompanhe seus pedidos de gravatas e gerencie seu endereço salvo para compras rápidas'
                  : 'Entre ou cadastre-se para ver seus pedidos e salvar seu endereço de entrega'}
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

        {/* Body Content */}
        <div className="overflow-y-auto p-5 sm:p-6 flex-1">
          
          {/* STATE 1: NOT LOGGED IN */}
          {!currentUser ? (
            <div className="max-w-md mx-auto space-y-6 py-2">
              
              {/* Login / Register Toggle Header */}
              <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(false);
                    setLoginError('');
                  }}
                  className={`flex-1 py-2 font-bold rounded-lg transition-all cursor-pointer ${
                    !isRegistering
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Entrar na Conta
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(true);
                    setLoginError('');
                  }}
                  className={`flex-1 py-2 font-bold rounded-lg transition-all cursor-pointer ${
                    isRegistering
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Criar Nova Conta
                </button>
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                  <span className="font-bold">Aviso:</span> {loginError}
                </div>
              )}

              {/* Form: LOGIN */}
              {!isRegistering ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="block font-bold text-slate-300">
                      E-mail cadastrado ou CPF:
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="text"
                        value={loginInput}
                        onChange={(e) => setLoginInput(e.target.value)}
                        placeholder="ex: guilherme.noivo@gmail.com"
                        className="w-full bg-slate-950 text-slate-200 pl-9 pr-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-bold text-slate-300">Senha:</label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-950 text-slate-200 pl-9 pr-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500 font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
                  >
                    <span>Entrar e Ver Meus Pedidos</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Quick Demo Login Helper */}
                  <div className="pt-4 border-t border-slate-800 space-y-2">
                    <p className="text-[11px] text-slate-400 font-semibold text-center">
                      Ou faça login rápido com conta de teste:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setLoginInput('guilherme.noivo@gmail.com');
                          onLogin('guilherme.noivo@gmail.com');
                        }}
                        className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-[11px] text-left transition-colors cursor-pointer"
                      >
                        <p className="font-bold text-amber-300">🤵 Guilherme (Noivo)</p>
                        <p className="text-[10px] text-slate-400 truncate">Possui pedido de 6 padrinhos</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setLoginInput('carlos.adv@silveira.com.br');
                          onLogin('carlos.adv@silveira.com.br');
                        }}
                        className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-lg text-[11px] text-left transition-colors cursor-pointer"
                      >
                        <p className="font-bold text-slate-200">👔 Carlos Eduardo</p>
                        <p className="text-[10px] text-slate-400 truncate">Endereço Maceió / AL salvo</p>
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                /* Form: REGISTER */
                <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="block font-bold text-slate-300">Nome Completo: *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="ex: Roberto Albuquerque"
                        className="w-full bg-slate-950 text-slate-200 px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block font-bold text-slate-300">E-mail: *</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="seuemail@exemplo.com"
                          className="w-full bg-slate-950 text-slate-200 px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block font-bold text-slate-300">WhatsApp / Celular: *</label>
                        <input
                          type="text"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="(82) 99320-0513"
                          className="w-full bg-slate-950 text-slate-200 px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500 font-mono"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block font-bold text-slate-300">CPF (para nota e envio):</label>
                        <input
                          type="text"
                          value={formData.cpf}
                          onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                          placeholder="000.000.000-00"
                          className="w-full bg-slate-950 text-slate-200 px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500 font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block font-bold text-slate-300">Senha de Acesso:</label>
                        <input
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder="Crie uma senha"
                          className="w-full bg-slate-950 text-slate-200 px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    {/* Address Section in Register */}
                    <div className="pt-2 border-t border-slate-800 space-y-2.5">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Endereço de Entrega Principal</span>
                      </p>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-1 space-y-1">
                          <label className="block text-[11px] text-slate-400">CEP:</label>
                          <input
                            type="text"
                            value={formData.cep}
                            onChange={(e) => {
                              setFormData({ ...formData, cep: e.target.value });
                              handleFetchCep(e.target.value);
                            }}
                            placeholder="00000-000"
                            className="w-full bg-slate-950 text-slate-200 px-2.5 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500 font-mono text-xs"
                          />
                        </div>
                        <div className="col-span-2 space-y-1">
                          <label className="block text-[11px] text-slate-400">Rua / Logradouro:</label>
                          <input
                            type="text"
                            value={formData.street}
                            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                            placeholder="Rua / Avenida"
                            className="w-full bg-slate-950 text-slate-200 px-2.5 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500 text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-1 space-y-1">
                          <label className="block text-[11px] text-slate-400">Número:</label>
                          <input
                            type="text"
                            value={formData.number}
                            onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                            placeholder="123"
                            className="w-full bg-slate-950 text-slate-200 px-2.5 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500 text-xs"
                          />
                        </div>
                        <div className="col-span-2 space-y-1">
                          <label className="block text-[11px] text-slate-400">Complemento:</label>
                          <input
                            type="text"
                            value={formData.complement}
                            onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                            placeholder="Apto, Bloco, etc."
                            className="w-full bg-slate-950 text-slate-200 px-2.5 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500 text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-1 space-y-1">
                          <label className="block text-[11px] text-slate-400">Bairro:</label>
                          <input
                            type="text"
                            value={formData.neighborhood}
                            onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                            className="w-full bg-slate-950 text-slate-200 px-2.5 py-2 rounded-lg border border-slate-800 text-xs"
                          />
                        </div>
                        <div className="col-span-1 space-y-1">
                          <label className="block text-[11px] text-slate-400">Cidade:</label>
                          <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            className="w-full bg-slate-950 text-slate-200 px-2.5 py-2 rounded-lg border border-slate-800 text-xs"
                          />
                        </div>
                        <div className="col-span-1 space-y-1">
                          <label className="block text-[11px] text-slate-400">UF:</label>
                          <input
                            type="text"
                            value={formData.state}
                            onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                            maxLength={2}
                            className="w-full bg-slate-950 text-slate-200 px-2.5 py-2 rounded-lg border border-slate-800 text-xs font-mono uppercase"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-xs"
                  >
                    <span>Concluir Cadastro & Salvar Endereço</span>
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </form>
              )}

            </div>
          ) : (
            /* STATE 2: LOGGED IN CUSTOMER DASHBOARD */
            <div className="space-y-6">
              
              {/* User Greeting & Quick Summary */}
              <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-black text-base flex items-center justify-center shadow-lg border border-amber-300/60 font-brand shrink-0">
                    {currentUser.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <span>Olá, {currentUser.name}!</span>
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 font-semibold">
                        Cliente VIP
                      </span>
                    </h3>
                    <p className="text-xs text-slate-300">
                      {currentUser.email} • {currentUser.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-500/40 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sair da Conta</span>
                  </button>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="flex border-b border-slate-800 bg-slate-900/60 rounded-xl p-1 gap-1">
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'orders'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Package className="w-4 h-4" />
                  <span>Meus Pedidos ({userOrders.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('address')}
                  className={`flex-1 py-2.5 px-4 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'address'
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>Endereço Salvo & Dados</span>
                </button>
              </div>

              {/* TAB 1: MEUS PEDIDOS */}
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {userOrders.length === 0 ? (
                    <div className="py-12 text-center space-y-4 bg-slate-900/50 rounded-2xl border border-slate-800">
                      <div className="w-14 h-14 rounded-full bg-slate-900 text-slate-500 flex items-center justify-center mx-auto border border-slate-800">
                        <ShoppingBag className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white">Nenhum pedido realizado ainda</h4>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto">
                          Explore nossa coleção de gravatas de seda Jacquard e kits de padrinhos para fazer seu primeiro pedido!
                        </p>
                      </div>
                      <button
                        onClick={onClose}
                        className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-5 py-2.5 rounded-xl transition-colors cursor-pointer"
                      >
                        Explorar Catálogo de Gravatas
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userOrders.map((order) => (
                        <div
                          key={order.id}
                          className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-lg"
                        >
                          {/* Order Header */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-amber-400 text-xs sm:text-sm">
                                  #{order.orderNumber}
                                </span>
                                <span className="text-[11px] text-slate-400">
                                  • {new Date(order.date).toLocaleDateString('pt-BR')} às {new Date(order.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400">
                                Pagamento: <strong className="text-slate-200 uppercase">{order.paymentMethod}</strong> • {order.items.reduce((s, i) => s + i.quantity, 0)} itens
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              {getStatusBadge(order.status)}
                            </div>
                          </div>

                          {/* Tracking & Logistics Strip */}
                          {order.trackingCode && (
                            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                              <div className="flex items-center gap-2">
                                <Truck className="w-4 h-4 text-blue-400 shrink-0" />
                                <div>
                                  <span className="text-slate-400">Rastreio Correios: </span>
                                  <span className="font-mono font-bold text-white">{order.trackingCode}</span>
                                </div>
                              </div>
                              <a
                                href={`https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(`Olá! Gostaria de saber atualizações do meu pedido #${order.orderNumber}`)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                                <span>Acompanhar com Consultor</span>
                              </a>
                            </div>
                          )}

                          {/* Order Items List */}
                          <div className="space-y-2">
                            {order.items.map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60"
                              >
                                <div className="flex items-center gap-3">
                                  <img
                                    src={item.product.images[0]}
                                    alt={item.product.name}
                                    className="w-12 h-12 rounded-lg object-cover bg-slate-900 border border-slate-800 shrink-0"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div>
                                    <h5 className="text-xs font-bold text-white">
                                      {item.product.name}
                                    </h5>
                                    <p className="text-[11px] text-slate-400">
                                      Qtd: {item.quantity} • {item.product.colorLabel} • {item.product.fabric}
                                      {item.giftBox && ' • + Caixa Luxo'}
                                    </p>
                                  </div>
                                </div>

                                <div className="text-right">
                                  <span className="text-xs font-bold text-slate-200">
                                    {formatCurrency(item.product.price * item.quantity)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Order Delivery & Reorder Footer */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-800">
                            <div className="text-[11px] text-slate-400 flex items-start gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                              <span>
                                Entrega em: {order.customer.street}, {order.customer.number} - {order.customer.city}/{order.customer.state} ({order.customer.cep})
                              </span>
                            </div>

                            <div className="flex items-center gap-3 justify-between sm:justify-end">
                              <div className="text-right">
                                <span className="text-[10px] uppercase text-slate-400 block">Total do Pedido</span>
                                <span className="text-sm font-bold text-emerald-400 font-serif-luxury">
                                  {formatCurrency(order.total)}
                                </span>
                              </div>

                              <button
                                onClick={() => {
                                  onReorder(order.items);
                                  onClose();
                                }}
                                className="bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 border border-amber-500/40 text-xs font-bold px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                                title="Adicionar estes mesmos itens à sacola para comprar novamente"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Pedir Novamente</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: ENDEREÇO SALVO & DADOS PESSOAIS */}
              {activeTab === 'address' && (
                <form onSubmit={handleSaveAddressAndProfile} className="space-y-4 text-xs">
                  
                  {/* Notification banner on how saved address works */}
                  <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      <strong>Endereço Automático Ativo:</strong> Ao finalizar compras futuras na loja, seus dados de entrega e telefone serão preenchidos automaticamente.
                    </span>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <User className="w-4 h-4" />
                      <span>Identificação do Comprador</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block font-bold text-slate-300">Nome Completo:</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-slate-950 text-slate-200 px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block font-bold text-slate-300">WhatsApp / Telefone:</label>
                        <input
                          type="text"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-slate-950 text-slate-200 px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500 font-mono"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="block font-bold text-slate-300">E-mail:</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-slate-950 text-slate-200 px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block font-bold text-slate-300">CPF:</label>
                        <input
                          type="text"
                          value={formData.cpf}
                          onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                          className="w-full bg-slate-950 text-slate-200 px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500 font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delivery Address Details */}
                  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      <span>Endereço de Entrega Principal</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="block font-bold text-slate-300">CEP:</label>
                        <input
                          type="text"
                          value={formData.cep}
                          onChange={(e) => {
                            setFormData({ ...formData, cep: e.target.value });
                            handleFetchCep(e.target.value);
                          }}
                          placeholder="00000-000"
                          className="w-full bg-slate-950 text-slate-200 px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500 font-mono"
                        />
                        {isLoadingCep && <p className="text-[10px] text-amber-400">Buscando endereço...</p>}
                      </div>

                      <div className="sm:col-span-2 space-y-1">
                        <label className="block font-bold text-slate-300">Rua / Logradouro:</label>
                        <input
                          type="text"
                          value={formData.street}
                          onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                          className="w-full bg-slate-950 text-slate-200 px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="block font-bold text-slate-300">Número:</label>
                        <input
                          type="text"
                          value={formData.number}
                          onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                          className="w-full bg-slate-950 text-slate-200 px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="sm:col-span-2 space-y-1">
                        <label className="block font-bold text-slate-300">Complemento (Apto, Sala, etc):</label>
                        <input
                          type="text"
                          value={formData.complement}
                          onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                          className="w-full bg-slate-950 text-slate-200 px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="block font-bold text-slate-300">Bairro:</label>
                        <input
                          type="text"
                          value={formData.neighborhood}
                          onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                          className="w-full bg-slate-950 text-slate-200 px-3 py-2 rounded-lg border border-slate-800"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block font-bold text-slate-300">Cidade:</label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full bg-slate-950 text-slate-200 px-3 py-2 rounded-lg border border-slate-800"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="block font-bold text-slate-300">Estado (UF):</label>
                        <input
                          type="text"
                          value={formData.state}
                          onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                          maxLength={2}
                          className="w-full bg-slate-950 text-slate-200 px-3 py-2 rounded-lg border border-slate-800 font-mono uppercase"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {saveSuccessNotice ? (
                      <span className="text-emerald-400 font-bold text-xs flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Dados salvos com sucesso!</span>
                      </span>
                    ) : <span />}

                    <button
                      type="submit"
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2.5 rounded-xl shadow-lg transition-colors flex items-center gap-2 cursor-pointer text-xs"
                    >
                      <Save className="w-4 h-4" />
                      <span>Salvar Alterações</span>
                    </button>
                  </div>

                </form>
              )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
