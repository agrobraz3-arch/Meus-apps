import { CartItem, CustomerInfo, Order, PaymentMethod, StoreSettings } from './types';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatPhoneDisplay(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  // If starts with 55 (Brazil) and 13 digits total (55 + 2 DDD + 9 phone)
  if (digits.startsWith('55') && digits.length === 13) {
    const ddd = digits.slice(2, 4);
    const part1 = digits.slice(4, 9);
    const part2 = digits.slice(9);
    return `(${ddd}) ${part1}-${part2}`;
  }
  if (digits.length === 11) {
    const ddd = digits.slice(0, 2);
    const part1 = digits.slice(2, 7);
    const part2 = digits.slice(7);
    return `(${ddd}) ${part1}-${part2}`;
  }
  return phone;
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(100 + Math.random() * 900);
  return `JC-${timestamp}-${random}`;
}

export function calculateShipping(cep: string, subtotal: number, threshold: number): { price: number; days: number; type: string } {
  if (subtotal >= threshold) {
    return { price: 0, days: 3, type: 'Frete Grátis Express' };
  }
  
  const cleanCep = cep.replace(/\D/g, '');
  if (!cleanCep || cleanCep.length < 5) {
    return { price: 18.90, days: 4, type: 'Sedex Rápido' };
  }

  // Regras de simulação de frete baseado no primeiro dígito do CEP (Brasil)
  const firstDigit = cleanCep.charAt(0);
  switch (firstDigit) {
    case '0':
    case '1':
      // SP Capital e Interior
      return { price: 14.90, days: 2, type: 'Sedex São Paulo Express' };
    case '2':
      // RJ / ES
      return { price: 17.50, days: 3, type: 'Sedex Sudeste' };
    case '3':
      // MG
      return { price: 16.90, days: 3, type: 'Sedex Minas' };
    case '4':
    case '5':
      // Bahia e Nordeste
      return { price: 23.90, days: 5, type: 'PAC Nordeste Seguro' };
    case '8':
    case '9':
      // Sul (PR, SC, RS)
      return { price: 19.90, days: 4, type: 'Sedex Sul' };
    default:
      return { price: 24.90, days: 5, type: 'Sedex Nacional' };
  }
}

export function generateWhatsAppOrderUrl(
  order: Order,
  settings: StoreSettings
): string {
  const itemsSummary = order.items
    .map(
      (item) =>
        `• ${item.quantity}x ${item.product.name} (${formatCurrency(
          item.product.price * item.quantity
        )})`
    )
    .join('\n');

  const paymentText =
    order.paymentMethod === 'pix'
      ? 'PIX (com 5% OFF)'
      : order.paymentMethod === 'credit_card'
      ? `Cartão de Crédito (${order.installments || 1}x)`
      : order.paymentMethod === 'boleto'
      ? 'Boleto Bancário'
      : 'A Combinar via WhatsApp';

  const message = `👔 *NOVO PEDIDO - ${settings.storeName.toUpperCase()}*
━━━━━━━━━━━━━━━━━━━━
📦 *Número do Pedido:* #${order.orderNumber}
📅 *Data:* ${new Date(order.date).toLocaleDateString('pt-BR')}

👤 *DADOS DO CLIENTE:*
• *Nome:* ${order.customer.name}
• *WhatsApp:* ${order.customer.phone}
• *E-mail:* ${order.customer.email}
• *CPF:* ${order.customer.cpf || 'Não informado'}

📍 *ENDEREÇO DE ENTREGA:*
${order.customer.street}, ${order.customer.number}${
    order.customer.complement ? ` - ${order.customer.complement}` : ''
  }
${order.customer.neighborhood} - ${order.customer.city}/${order.customer.state}
*CEP:* ${order.customer.cep}

🛒 *ITENS DO PEDIDO:*
${itemsSummary}

💰 *RESUMO FINANCEIRO:*
• Subtotal: ${formatCurrency(order.subtotal)}
• Desconto: -${formatCurrency(order.discount)}
• Frete: ${order.shipping === 0 ? 'GRÁTIS' : formatCurrency(order.shipping)}
⭐ *TOTAL GERAL: ${formatCurrency(order.total)}*

💳 *Forma de Pagamento:* ${paymentText}
${order.customer.notes ? `\n📝 *Observações:* ${order.customer.notes}` : ''}
━━━━━━━━━━━━━━━━━━━━
Gostaria de confirmar meu pedido e acompanhar o envio!`;

  return `https://wa.me/${settings.whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;
}

export function generatePixPayload(amount: number, orderNumber: string, pixKey: string): string {
  // Padrão BR Code Pix Copia e Cola
  const cleanAmount = amount.toFixed(2);
  return `00020126580014br.gov.bcb.pix0136${pixKey}520400005303986540${cleanAmount.length.toString().padStart(2, '0')}${cleanAmount}5802BR5911JC GRAVATAS6009SAO PAULO62170513${orderNumber.replace(/[^A-Za-z0-9]/g, '')}6304`;
}
