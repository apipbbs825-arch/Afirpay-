export interface Game {
  id: string;
  name: string;
  category: string;
  developer: string;
  bannerColor: string;
  iconName: string;
  idFields: {
    key: string;
    label: string;
    placeholder: string;
    description: string;
  }[];
}

export interface NominalPackage {
  id: string;
  name: string;
  amount: number;
  price: number;
  originalPrice?: number;
  unit: 'Diamonds' | 'UC' | 'Genesis Crystals' | 'Tokens' | 'Valorant Points' | 'Starlight';
  isPopular?: boolean;
}

export interface PaymentChannel {
  id: string;
  name: string;
  provider: string;
  fee: number;
  type: 'qris' | 'ewallet';
  logoColor: string;
  instruction: string;
}

export interface Transaction {
  id: string;
  referenceId: string;
  gameId: string;
  gameName: string;
  gameIcon: string;
  accountId: string;
  zoneId?: string;
  playerNickname: string;
  packageName: string;
  packagePrice: number;
  paymentMethod: {
    id: string;
    name: string;
    type: 'qris' | 'ewallet';
    fee: number;
  };
  whatsappPhone: string;
  status: 'pending' | 'processing' | 'success' | 'failed';
  createdAt: string;
  expiresAt: string;
}
