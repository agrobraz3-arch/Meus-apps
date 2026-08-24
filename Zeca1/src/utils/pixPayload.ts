/**
 * Utilitário oficial de geração de PIX Copia e Cola (Padrão BR Code / Banco Central do Brasil EMVCo)
 */

function formatTLV(id: string, value: string): string {
  const length = value.length.toString().padStart(2, '0');
  return `${id}${length}${value}`;
}

function removeAccents(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z0-9 ]/g, '');
}

/**
 * Cálculo do Checksum CRC16 CCITT (Polinômio 0x1021, valor inicial 0xFFFF)
 */
function crc16(payload: string): string {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

export interface PixPayloadParams {
  key: string;
  merchantName: string;
  merchantCity: string;
  amount: number;
  txId?: string;
  description?: string;
}

/**
 * Gera a string oficial do PIX Copia e Cola
 */
export function generatePixPayload({
  key,
  merchantName,
  merchantCity,
  amount,
  txId = '***',
  description
}: PixPayloadParams): string {
  // Limpeza da chave
  const cleanKey = key.trim();

  // Nome do recebedor (max 25 caracteres, sem acentos)
  const cleanName = removeAccents(merchantName || 'RESTAURANTE DO ZECA').substring(0, 25);

  // Cidade do recebedor (max 15 caracteres, sem acentos)
  const cleanCity = removeAccents(merchantCity || 'PINDORAMA').substring(0, 15);

  // Formato do valor (2 casas decimais com ponto)
  const formattedAmount = amount > 0 ? amount.toFixed(2) : undefined;

  // Merchant Account Information (ID 26)
  let maiPayload = formatTLV('00', 'br.gov.bcb.pix');
  maiPayload += formatTLV('01', cleanKey);
  if (description) {
    maiPayload += formatTLV('02', removeAccents(description).substring(0, 40));
  }

  // Additional Data Field Template (ID 62)
  const cleanTxId = (txId.replace(/[^a-zA-Z0-9]/g, '') || 'ZECA').substring(0, 25);
  const additionalData = formatTLV('05', cleanTxId);

  // Montagem do payload EMV
  let payload = '';
  payload += formatTLV('00', '01'); // Payload Format Indicator
  payload += formatTLV('01', '12'); // Point of Initiation Method (12 = dinâmico / valor pré-definido)
  payload += formatTLV('26', maiPayload); // Merchant Account Info
  payload += formatTLV('52', '0000'); // Merchant Category Code
  payload += formatTLV('53', '986'); // Transaction Currency (986 = BRL Real)
  if (formattedAmount) {
    payload += formatTLV('54', formattedAmount); // Transaction Amount
  }
  payload += formatTLV('58', 'BR'); // Country Code
  payload += formatTLV('59', cleanName); // Merchant Name
  payload += formatTLV('60', cleanCity); // Merchant City
  payload += formatTLV('62', additionalData); // Additional Data (TxID)
  payload += '6304'; // CRC16 Header

  // Adiciona o CRC16 calculado no final
  const checksum = crc16(payload);
  return payload + checksum;
}
