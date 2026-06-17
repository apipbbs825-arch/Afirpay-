import { Game, NominalPackage, PaymentChannel } from './types';

export const GAMES: Game[] = [
  {
    id: 'mobile-legends',
    name: 'Mobile Legends',
    category: 'MOBA',
    developer: 'Moonton',
    bannerColor: 'from-blue-600 to-indigo-950',
    iconName: 'Swords',
    idFields: [
      {
        key: 'userId',
        label: 'ID Pengguna',
        placeholder: 'Contoh: 12345678',
        description: 'Masukkan ID Pengguna Anda yang berada di profil MLBB.'
      },
      {
        key: 'zoneId',
        label: 'Zone ID',
        placeholder: 'Contoh: 1234',
        description: 'Masukkan angka di dalam tanda kurung di sebelah ID Pengguna.'
      }
    ]
  },
  {
    id: 'free-fire',
    name: 'Free Fire',
    category: 'Battle Royale',
    developer: 'Garena',
    bannerColor: 'from-amber-600 to-amber-950',
    iconName: 'Flame',
    idFields: [
      {
        key: 'userId',
        label: 'Player ID',
        placeholder: 'Contoh: 987654321',
        description: 'Masukkan Player ID Free Fire Anda.'
      }
    ]
  },
  {
    id: 'pubg-mobile',
    name: 'PUBG Mobile',
    category: 'Battle Royale',
    developer: 'Tencent Games',
    bannerColor: 'from-zinc-700 to-zinc-950',
    iconName: 'Target',
    idFields: [
      {
        key: 'userId',
        label: 'Character ID',
        placeholder: 'Contoh: 5123456789',
        description: 'Masukkan Character ID PUBG Mobile Anda.'
      }
    ]
  },
  {
    id: 'genshin-impact',
    name: 'Genshin Impact',
    category: 'RPG',
    developer: 'HoYoverse',
    bannerColor: 'from-emerald-600 to-emerald-950',
    iconName: 'Compass',
    idFields: [
      {
        key: 'userId',
        label: 'UID',
        placeholder: 'Contoh: 812345678',
        description: 'Masukkan UID Genshin Impact Anda.'
      },
      {
        key: 'zoneId',
        label: 'Server',
        placeholder: 'Pilih server (Asia, America, Europe, TW_HK_MO)',
        description: 'Pilih server tempat akun Anda berada.'
      }
    ]
  },
  {
    id: 'valorant',
    name: 'Valorant',
    category: 'FPS / Shooter',
    developer: 'Riot Games',
    bannerColor: 'from-rose-600 to-rose-950',
    iconName: 'ShieldAlert',
    idFields: [
      {
        key: 'userId',
        label: 'Riot ID & Tagline',
        placeholder: 'Contoh: Jett#KR1',
        description: 'Masukkan Riot ID lengkap beserta deskripsi Tag setelah simbol #'
      }
    ]
  },
  {
    id: 'honor-of-kings',
    name: 'Honor of Kings',
    category: 'MOBA',
    developer: 'Level Infinite',
    bannerColor: 'from-cyan-600 to-blue-950',
    iconName: 'Crown',
    idFields: [
      {
        key: 'userId',
        label: 'ID Pengguna',
        placeholder: 'Contoh: 618234983',
        description: 'Masukkan ID Pengguna Anda di profil Honor of Kings.'
      }
    ]
  }
];

export const GAME_PACKAGES: Record<string, NominalPackage[]> = {
  'mobile-legends': [
    { id: 'ml-5', name: '5 Diamonds', amount: 5, price: 1500, unit: 'Diamonds' },
    { id: 'ml-12', name: '12 Diamonds', amount: 12, price: 3500, unit: 'Diamonds' },
    { id: 'ml-50', name: '50 Diamonds', amount: 50, price: 14000, unit: 'Diamonds' },
    { id: 'ml-150', name: '150 Diamonds', amount: 150, price: 42000, unit: 'Diamonds', isPopular: true },
    { id: 'ml-250', name: '250 Diamonds', amount: 250, price: 69000, unit: 'Diamonds' },
    { id: 'ml-500', name: '500 Diamonds', amount: 500, price: 137000, unit: 'Diamonds' },
    { id: 'ml-1000', name: '1000 Diamonds', amount: 1000, price: 270000, unit: 'Diamonds' },
    { id: 'ml-starlight', name: 'Starlight Member', amount: 1, price: 49000, unit: 'Starlight', isPopular: true }
  ],
  'free-fire': [
    { id: 'ff-5', name: '5 Diamonds', amount: 5, price: 1000, unit: 'Diamonds' },
    { id: 'ff-50', name: '50 Diamonds', amount: 50, price: 7000, unit: 'Diamonds' },
    { id: 'ff-140', name: '140 Diamonds', amount: 140, price: 19000, unit: 'Diamonds', isPopular: true },
    { id: 'ff-355', name: '355 Diamonds', amount: 355, price: 47000, unit: 'Diamonds' },
    { id: 'ff-720', name: '720 Diamonds', amount: 720, price: 92000, unit: 'Diamonds', isPopular: true },
    { id: 'ff-1450', name: '1450 Diamonds', amount: 1450, price: 185000, unit: 'Diamonds' }
  ],
  'pubg-mobile': [
    { id: 'pubg-30', name: '30 UC', amount: 30, price: 7000, unit: 'UC' },
    { id: 'pubg-60', name: '60 UC', amount: 60, price: 14500, unit: 'UC' },
    { id: 'pubg-325', name: '325 UC', amount: 325, price: 70000, unit: 'UC', isPopular: true },
    { id: 'pubg-660', name: '660 UC', amount: 660, price: 142000, unit: 'UC', isPopular: true },
    { id: 'pubg-1800', name: '1800 UC', amount: 1800, price: 355000, unit: 'UC' }
  ],
  'genshin-impact': [
    { id: 'gi-60', name: '60 Genesis Crystals', amount: 60, price: 16000, unit: 'Genesis Crystals' },
    { id: 'gi-300', name: '300 Genesis Crystals', amount: 300, price: 79000, unit: 'Genesis Crystals' },
    { id: 'gi-980', name: '980 Genesis Crystals', amount: 980, price: 245000, unit: 'Genesis Crystals', isPopular: true },
    { id: 'gi-1980', name: '1980 Genesis Crystals', amount: 1980, price: 480000, unit: 'Genesis Crystals' },
    { id: 'gi-welkin', name: 'Blessing of the Welkin Moon', amount: 1, price: 79000, unit: 'Starlight', isPopular: true }
  ],
  'valorant': [
    { id: 'val-125', name: '125 Valorant Points', amount: 125, price: 15000, unit: 'Valorant Points' },
    { id: 'val-625', name: '625 Valorant Points', amount: 625, price: 75000, unit: 'Valorant Points', isPopular: true },
    { id: 'val-1125', name: '1125 Valorant Points', amount: 1125, price: 135000, unit: 'Valorant Points' },
    { id: 'val-2675', name: '2675 Valorant Points', amount: 2675, price: 295000, unit: 'Valorant Points', isPopular: true },
    { id: 'val-5350', name: '5350 Valorant Points', amount: 5350, price: 575000, unit: 'Valorant Points' }
  ],
  'honor-of-kings': [
    { id: 'hok-8', name: '8 Tokens', amount: 8, price: 2000, unit: 'Tokens' },
    { id: 'hok-80', name: '80 Tokens', amount: 80, price: 18000, unit: 'Tokens' },
    { id: 'hok-240', name: '240 Tokens', amount: 240, price: 54000, unit: 'Tokens', isPopular: true },
    { id: 'hok-800', name: '800 Tokens', amount: 800, price: 172000, unit: 'Tokens', isPopular: true },
    { id: 'hok-1200', name: '1200 Tokens', amount: 1200, price: 255000, unit: 'Tokens' }
  ]
};

export const PAYMENT_CHANNELS: PaymentChannel[] = [
  {
    id: 'qris',
    name: 'QRIS Realtime 24 Jam',
    provider: 'GPN / LinkAja',
    fee: 0,
    type: 'qris',
    logoColor: 'from-rose-500 to-red-600',
    instruction: 'Scan kode QRIS yang tampil di layar Anda menggunakan aplikasi Fintech (GoPay, OVO, DANA, LinkAja, ShopeePay atau Mobile Banking). Transaksi terdeteksi secara otomatis & instan.'
  },
  {
    id: 'gopay',
    name: 'GoPay Pembayaran Instan',
    provider: 'Gojek',
    fee: 150,
    type: 'ewallet',
    logoColor: 'from-cyan-500 to-blue-600',
    instruction: 'Salin kode pembayaran / QR atau klik konfirmasi bayar otomatis untuk membuka aplikasi GoPay di smartphone Anda.'
  },
  {
    id: 'dana',
    name: 'DANA E-Wallet',
    provider: 'DANA Indonesia',
    fee: 100,
    type: 'ewallet',
    logoColor: 'from-sky-400 to-blue-500',
    instruction: 'Sistem akan mengirimkan Push/Deeplink DANA setelah konfirmasi. Masukkan PIN DANA Anda pada simulasi untuk mengotorisasi transaksi.'
  },
  {
    id: 'ovo',
    name: 'OVO Push Billing',
    provider: 'Lippo Group',
    fee: 250,
    type: 'ewallet',
    logoColor: 'from-purple-600 to-indigo-800',
    instruction: 'Pastikan nomor WhatsApp yang dimasukkan juga terdaftar di aplikasi OVO. OVO Push Billing akan dikirimkan langsung ke HP Anda.'
  },
  {
    id: 'shopeepay',
    name: 'ShopeePay Instant',
    provider: 'Shopee Sea Group',
    fee: 150,
    type: 'ewallet',
    logoColor: 'from-orange-500 to-red-500',
    instruction: 'Gunakan saldo ShopeePay untuk pembayaran cepat. Transaksi akan divalidasi langsung oleh server pembayaran.'
  }
];
