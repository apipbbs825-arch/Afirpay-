import { Game, NominalPackage, PaymentChannel, Transaction } from './types';

/**
 * Formats a number into Indonesian Rupiah currency format (e.g., Rp 150.000)
 */
export const formatRupiah = (value: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

/**
 * Returns a randomized placeholder gaming nickname based on user credentials
 * for highly believable simulated nickname checking.
 */
export const resolvePlayerNickname = (gameId: string, userId: string, zoneId?: string): string => {
  const cleanId = userId.trim();
  if (!cleanId) return 'Player';

  const suffixes = ['Pro', 'Gamer', 'Esport', 'Noob', 'Slayer', 'Rider', 'King', 'Shadow', 'Ace', 'Savage'];
  const prefixes = ['Sultan', 'Wibu', 'Lord', 'Bang', 'X', 'Dark', 'Kuro', 'Alpha', 'Zeus', 'Ryzen'];
  
  // Deterministic randomize based on ID length & characters
  const charSum = cleanId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) + (zoneId ? zoneId.length : 0);
  const prefIndex = charSum % prefixes.length;
  const suffIndex = (charSum + 7) % suffixes.length;
  const numSuffix = (charSum * 3) % 1000;

  switch (gameId) {
    case 'mobile-legends':
      return `${prefixes[prefIndex]}${suffixes[suffIndex]}`;
    case 'free-fire':
      return `FF_${prefixes[prefIndex]}${numSuffix}`;
    case 'pubg-mobile':
      return `PUBG_🦖${suffixes[suffIndex]}`;
    case 'genshin-impact':
      return `Traveler_${prefixes[prefIndex]}`;
    case 'valorant':
      const valorantName = cleanId.split('#')[0] || 'Agent';
      return `${valorantName} (Verified)`;
    case 'honor-of-kings':
      return `${prefixes[prefIndex]}_HOK`;
    default:
      return `${prefixes[prefIndex]}${suffixes[suffIndex]}_${numSuffix}`;
  }
};

/**
 * Generates a standard invoice transaction structure
 */
export const createNewTransaction = (
  game: Game,
  pkg: NominalPackage,
  channel: PaymentChannel,
  accountId: string,
  zoneId: string,
  nickname: string,
  whatsappPhone: string
): Transaction => {
  const timestamp = new Date();
  
  // Invoice format: INV-YYYYMMDD-HHMMSS-RAND
  const year = timestamp.getFullYear();
  const month = String(timestamp.getMonth() + 1).padStart(2, '0');
  const date = String(timestamp.getDate()).padStart(2, '0');
  
  const randNum = Math.floor(1000 + Math.random() * 9000);
  const invoiceId = `INV-${year}${month}${date}-${randNum}`;
  const refId = `REF-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;

  // Invoice expires in 5 minutes
  const expiresAt = new Date(timestamp.getTime() + 5 * 60 * 1000).toISOString();

  return {
    id: invoiceId,
    referenceId: refId,
    gameId: game.id,
    gameName: game.name,
    gameIcon: game.iconName,
    accountId,
    zoneId: zoneId || undefined,
    playerNickname: nickname,
    packageName: pkg.name,
    packagePrice: pkg.price + channel.fee,
    paymentMethod: {
      id: channel.id,
      name: channel.name,
      type: channel.type,
      fee: channel.fee,
    },
    whatsappPhone,
    status: 'pending',
    createdAt: timestamp.toISOString(),
    expiresAt,
  };
};

/**
 * Generates mock QRIS string data for QR code encoding (EMVCo QR standard)
 */
export const getQRISStandardString = (invoiceId: string, amount: number): string => {
  const formattedAmount = String(amount).padStart(8, '0');
  return `00020101021226590016ID.CO.QRIS.WWW01189360000200123456780215INV${invoiceId}5204000053033605408${formattedAmount}5802ID5919TOPUP-ESTORE INDON6007JAKARTA6304D1B5`;
};
