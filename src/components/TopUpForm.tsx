import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Swords, Flame, Target, Compass, ShieldAlert, Crown, Gamepad2,
  ListFilter, ShieldCheck, CheckCircle, Smartphone, Clock, Sparkles, MessageSquare, AlertCircle
} from 'lucide-react';
import { Game, NominalPackage, PaymentChannel } from '../types';
import { GAME_PACKAGES, PAYMENT_CHANNELS } from '../data';
import { formatRupiah, resolvePlayerNickname } from '../utils';

interface TopUpFormProps {
  game: Game;
  onBack: () => void;
  onSubmitOrder: (
    pkg: NominalPackage,
    channel: PaymentChannel,
    accountId: string,
    zoneId: string,
    nickname: string,
    phone: string
  ) => void;
}

export default function TopUpForm({ game, onBack, onSubmitOrder }: TopUpFormProps) {
  // Input fields state
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [selectedPkg, setSelectedPkg] = useState<NominalPackage | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<PaymentChannel | null>(null);
  const [whatsappPhone, setWhatsappPhone] = useState('');
  
  // Nickname validation states
  const [isVerifyingNick, setIsVerifyingNick] = useState(false);
  const [verifiedNickname, setVerifiedNickname] = useState<string | null>(null);
  const [errMessage, setErrMessage] = useState<string | null>(null);

  // Load list of packages for current game
  const packages = GAME_PACKAGES[game.id] || [];

  // Reset states when game changes
  useEffect(() => {
    setFormData({});
    setSelectedPkg(null);
    setSelectedChannel(null);
    setWhatsappPhone('');
    setVerifiedNickname(null);
    setErrMessage(null);
  }, [game]);

  // Handle auto-recalculating verification when IDs change
  const handleVerifyId = () => {
    const primaryId = formData['userId']?.trim();
    
    if (!primaryId) {
      setErrMessage('Mohon masukkan ID Pengguna terlebih dahulu!');
      setVerifiedNickname(null);
      return;
    }

    if (primaryId.length < 3) {
      setErrMessage('ID Pengguna tidak valid (terlalu pendek)!');
      setVerifiedNickname(null);
      return;
    }

    setIsVerifyingNick(true);
    setErrMessage(null);

    // Simulate server lookup with latency
    setTimeout(() => {
      const resolved = resolvePlayerNickname(game.id, primaryId, formData['zoneId']);
      setVerifiedNickname(resolved);
      setIsVerifyingNick(false);
    }, 1200);
  };

  const getGameIcon = (iconName: string) => {
    const cls = "w-6 h-6 text-white";
    switch (iconName) {
      case 'Swords': return <Swords className={cls} />;
      case 'Flame': return <Flame className={cls} />;
      case 'Target': return <Target className={cls} />;
      case 'Compass': return <Compass className={cls} />;
      case 'ShieldAlert': return <ShieldAlert className={cls} />;
      case 'Crown': return <Crown className={cls} />;
      default: return <Gamepad2 className={cls} />;
    }
  };

  // Check if order is fully valid for checkout
  const isFormComplete = 
    formData['userId']?.trim() && 
    (!game.idFields.some(f => f.key === 'zoneId') || formData['zoneId']?.trim()) &&
    selectedPkg && 
    selectedChannel && 
    whatsappPhone.length >= 9 &&
    verifiedNickname;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormComplete || !selectedPkg || !selectedChannel) return;
    
    onSubmitOrder(
      selectedPkg,
      selectedChannel,
      formData['userId'].trim(),
      formData['zoneId']?.trim() || '',
      verifiedNickname || 'Verified Player',
      whatsappPhone.trim()
    );
  };

  return (
    <div id="top-up-form" className="space-y-6">
      {/* Return Navigation */}
      <button
        id="back-to-games-button"
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-slate-200 transition text-sm font-medium py-1 active:scale-95 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl"
      >
        <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Game
      </button>

      {/* Game Header Details Banner */}
      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-r ${game.bannerColor} p-6 md:p-8 border border-white/5 shadow-xl`}>
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[80px] pointer-events-none transform translate-x-12 -translate-y-12" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <div className="p-4 rounded-2xl bg-slate-950/40 backdrop-blur-md border border-white/10 shadow-lg">
              {getGameIcon(game.iconName)}
            </div>
            <div className="space-y-1">
              <div className="bg-white/10 text-white font-semibold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md inline-block">
                {game.developer}
              </div>
              <h1 className="text-2xl md:text-3.5xl font-sans font-extrabold text-white tracking-tight">{game.name}</h1>
              <span className="text-slate-300 text-xs flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Proses Otomatis & Terdeteksi Instan • GPN & QRIS Aktif
              </span>
            </div>
          </div>

          <div className="bg-slate-950/75 backdrop-blur-md border border-slate-800 p-3 rounded-2xl text-[11px] font-mono text-slate-400 max-w-sm">
            🛡️ <span className="text-violet-300 font-semibold">Integrasi Gateway Otomatis:</span> Setiap order divalidasi langsung oleh Core IP kami. Tidak perlu login akun, 100% legal & aman menggunakan user ID resmi.
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <form onSubmit={handleFormSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Steps (8 columns) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* STEP 1: ACCOUNT DATA */}
          <div className="bg-slate-900/40 border border-slate-800/80 p-5 md:p-6 rounded-3xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-sm">
                1
              </div>
              <h2 className="text-lg font-sans font-bold text-slate-100">Masukkan Data Akun</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {game.idFields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <label htmlFor={field.key} className="text-xs font-semibold text-slate-300">
                    {field.label} <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id={`input-${field.key}`}
                    type="text"
                    required
                    placeholder={field.placeholder}
                    value={formData[field.key] || ''}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, [field.key]: e.target.value }));
                      setVerifiedNickname(null); // Reset verified on path change
                    }}
                    className="w-full bg-slate-950 border border-slate-850 focus:border-blue-500 rounded-xl py-2.5 px-4 text-sm text-slate-200 placeholder-slate-600 outline-none transition"
                  />
                  <span className="text-[11px] text-slate-500">{field.description}</span>
                </div>
              ))}
            </div>

            {/* Verification Button & Box */}
            <div className="pt-2">
              <button
                id="btn-verify-account"
                type="button"
                onClick={handleVerifyId}
                disabled={isVerifyingNick || !formData['userId']}
                className={`flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs border transition active:scale-95 ${
                  formData['userId'] 
                    ? 'bg-slate-950 border-slate-700/60 hover:bg-slate-900 text-violet-300 hover:text-violet-200' 
                    : 'bg-slate-950/20 border-slate-850 text-slate-600 cursor-not-allowed'
                }`}
              >
                {isVerifyingNick ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                    Menghubungkan ke API Game...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Periksa & Validasi Username Akun
                  </>
                )}
              </button>

              {/* Status Display Area */}
              <AnimatePresence mode="wait">
                {verifiedNickname && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 flex items-center gap-2.5 p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/25 text-emerald-300 text-xs"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      Verifikasi Berhasil! Akun ditemukan: <strong>{verifiedNickname}</strong>
                    </span>
                  </motion.div>
                )}

                {errMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-3 flex items-center gap-2.5 p-3 rounded-xl bg-rose-950/20 border border-rose-500/25 text-rose-300 text-xs"
                  >
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{errMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* STEP 2: NOMINAL PACKAGES */}
          <div className="bg-slate-900/40 border border-slate-800/80 p-5 md:p-6 rounded-3xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-sm">
                2
              </div>
              <h2 className="text-lg font-sans font-bold text-slate-100">Pilih Nominal Top Up</h2>
            </div>

            <div id="nominal-grid" className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {packages.map((pkg) => {
                const isSelected = selectedPkg?.id === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    id={`package-${pkg.id}`}
                    onClick={() => {
                      setSelectedPkg(pkg);
                      // Auto trigger validation if they haven't validated manually but filled IDs
                      if (!verifiedNickname && formData['userId']) {
                        handleVerifyId();
                      }
                    }}
                    className={`relative cursor-pointer overflow-hidden rounded-2xl p-4 flex flex-col justify-between h-24 border transition-all duration-305 select-none ${
                      isSelected
                        ? 'bg-blue-600 border-2 border-white/20 text-white shadow-xl shadow-blue-500/15'
                        : 'bg-slate-950 text-slate-350 border-slate-850 hover:bg-slate-955/50 hover:border-slate-800'
                    }`}
                  >
                    {/* Hot item tag bubble */}
                    {pkg.isPopular && (
                      <div className={`absolute top-0 right-0 font-bold text-[8px] tracking-wider uppercase px-2 py-0.5 rounded-bl-lg flex items-center gap-0.5 shadow-sm ${
                        isSelected ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'
                      }`}>
                        <Sparkles className="w-2.5 h-2.5 inline" /> Best Seller
                      </div>
                    )}

                    <div className="space-y-1">
                      <div className={`font-sans font-black tracking-tight leading-none ${
                        isSelected ? 'text-white text-base sm:text-lg italic' : 'text-slate-200 text-sm sm:text-base'
                      }`}>
                        {pkg.name}
                      </div>

                      <div className="space-y-0.5">
                        <span className={`font-bold text-xs font-mono tracking-tight block ${
                          isSelected ? 'text-blue-100' : 'text-blue-400'
                        }`}>
                          {formatRupiah(pkg.price)}
                        </span>
                        {pkg.originalPrice && (
                          <span className={`text-[10px] font-mono line-through block ${
                            isSelected ? 'text-white/60' : 'text-slate-500'
                          }`}>
                            {formatRupiah(pkg.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Active check indicator */}
                    {isSelected && (
                      <div className="absolute bottom-2.5 right-2.5 bg-white text-blue-600 rounded-full p-0.5">
                        <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 3: PAYMENT TYPE */}
          <div className="bg-slate-900/40 border border-slate-800/80 p-5 md:p-6 rounded-3xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <h2 className="text-lg font-sans font-bold text-slate-100">Pilih Saluran Pembayaran</h2>
            </div>

            <div className="space-y-4">
              {/* QRIS Category */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold text-slate-400 tracking-wider uppercase block">QRIS - Deteksi Otomatis & Bebas Biaya</span>
                {PAYMENT_CHANNELS.filter(c => c.type === 'qris').map((channel) => {
                  const isSelected = selectedChannel?.id === channel.id;
                  return (
                    <div
                      key={channel.id}
                      onClick={() => setSelectedChannel(channel)}
                      id={`channel-${channel.id}`}
                      className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 cursor-pointer rounded-2xl border transition ${
                        isSelected 
                          ? 'bg-[#020617] border-blue-500 border-2 shadow-lg shadow-blue-500/5' 
                          : 'bg-slate-950 border-slate-850 hover:bg-slate-950/70 hover:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`px-4 py-2 bg-gradient-to-br ${channel.logoColor} text-white font-black rounded-lg text-lg tracking-widest italic shadow-sm flex items-center justify-center min-w-[70px]`}>
                          QRIS
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="font-sans font-bold text-slate-250 text-sm">{channel.name}</h4>
                          <span className="text-[10px] text-slate-500 block leading-tight max-w-md">{channel.provider} — Terkoneksi GPN</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-4 mt-3 sm:mt-0 pt-2.5 sm:pt-0 border-t sm:border-0 border-slate-900">
                        <div className="text-right">
                          <span className="text-emerald-500 font-bold font-mono text-xs block">FREE FEE</span>
                          <span className="text-[10px] text-slate-500 block">Biaya Penanganan: {formatRupiah(channel.fee)}</span>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-blue-500 bg-blue-600' : 'border-slate-800 bg-slate-900'}`}>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* E-Wallets Category */}
              <div className="space-y-2.5 pt-2">
                <span className="text-xs font-bold text-slate-400 tracking-wider uppercase block">Instant E-Wallet</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PAYMENT_CHANNELS.filter(c => c.type === 'ewallet').map((channel) => {
                    const isSelected = selectedChannel?.id === channel.id;
                    return (
                      <div
                        key={channel.id}
                        id={`channel-${channel.id}`}
                        onClick={() => setSelectedChannel(channel)}
                        className={`flex items-center justify-between p-4 cursor-pointer rounded-2xl border transition select-none ${
                          isSelected 
                            ? 'bg-[#020617] border-blue-500 border-2 shadow-lg shadow-blue-500/5' 
                            : 'bg-slate-950 border-slate-850 hover:bg-slate-950/70 hover:border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3.5">
                          <div className={`w-11 h-11 bg-gradient-to-br ${channel.logoColor} rounded-xl shadow-inner flex items-center justify-center`}>
                            <Smartphone className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-sans font-bold text-slate-250 text-xs sm:text-sm">{channel.id.toUpperCase()}</h4>
                            <span className="text-[10px] text-slate-500 font-medium block">Fee: {formatRupiah(channel.fee)}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-blue-500 bg-blue-600' : 'border-slate-850 bg-slate-950'}`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* STEP 4: WHATSAPP NOTIFICATION FOR RECEIPT Link */}
          <div className="bg-slate-900/40 border border-slate-800/80 p-5 md:p-6 rounded-3xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-sm">
                4
              </div>
              <h2 className="text-lg font-sans font-bold text-slate-100">Kontak WhatsApp Terdaftar</h2>
            </div>

            <div className="space-y-2">
              <label htmlFor="whatsapp-phone" className="text-xs font-semibold text-slate-300 block">
                Nomor Handphone / WhatsApp <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm pointer-events-none select-none">
                  +62
                </div>
                <input
                  id="whatsapp-phone"
                  type="tel"
                  required
                  placeholder="Contoh: 81234567890"
                  value={whatsappPhone}
                  onChange={(e) => {
                    const cleanNum = e.target.value.replace(/[^0-9]/g, '');
                    setWhatsappPhone(cleanNum);
                  }}
                  className="w-full bg-slate-950 border border-slate-850 focus:border-blue-500 rounded-xl py-2.5 pl-12 pr-4 text-sm text-slate-200 placeholder-slate-600 outline-none transition"
                />
              </div>
              <span className="text-[11px] text-slate-500 block leading-normal">
                Nota pembayaran digital, link status transaksi otomatis, dan nomor tiket penanganan bantuan CS kami akan dikirim instan melalui WhatsApp setelah checkout berhasil diselesaikan.
              </span>
            </div>
          </div>

        </div>

        {/* Right Side: Order Summary Panel (4 columns) */}
        <div className="lg:col-span-4 lg:sticky lg:top-6 space-y-4">
          <div className="bg-slate-900/80 border border-slate-800/90 rounded-3xl p-5 md:p-6 space-y-5 backdrop-blur-lg">
            <h3 className="font-sans font-bold text-slate-100 text-base border-b border-slate-800/80 pb-3 flex items-center gap-2">
              📋 Ringkasan Pesanan Anda
            </h3>
            
            {/* Dynamic visual representation of selections */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 text-xs">Game Terpilih</span>
                <span className="font-bold text-slate-200 text-right">{game.name}</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 text-xs">Input User ID</span>
                <span className="font-semibold text-slate-200 text-right font-mono text-xs">
                  {formData['userId'] ? `${formData['userId']}${formData['zoneId'] ? ` (${formData['zoneId']})` : ''}` : '(Belum Diisi)'}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 text-xs">Verified Nickname</span>
                <span className="font-semibold text-right text-xs">
                  {isVerifyingNick ? (
                    <span className="text-indigo-400 animate-pulse">Menghubungkan...</span>
                  ) : verifiedNickname ? (
                    <span className="text-emerald-400 font-bold bg-emerald-900/10 px-2 py-0.5 rounded border border-emerald-500/10 inline-block">{verifiedNickname}</span>
                  ) : (
                    <span className="text-rose-400/80 text-[11px]">(Menunggu verifikasi ID)</span>
                  )}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 text-xs">Produk</span>
                <span className="font-bold text-slate-200 text-right text-xs">
                  {selectedPkg ? selectedPkg.name : '(Belum Dipilih)'}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-400 text-xs">Metode Potong</span>
                <span className="font-bold text-slate-200 text-right text-xs">
                  {selectedChannel ? selectedChannel.name : '(Belum Dipilih)'}
                </span>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="border-t border-dashed border-slate-800/90 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Harga Produk:</span>
                <span className="font-mono">{selectedPkg ? formatRupiah(selectedPkg.price) : 'Rp 0'}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Biaya Admin Gateway:</span>
                <span className="font-mono text-emerald-400">{selectedChannel ? (selectedChannel.fee === 0 ? 'GRATIS' : formatRupiah(selectedChannel.fee)) : 'Rp 0'}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-100 border-t border-slate-800/80 pt-3">
                <span>Grand Total:</span>
                <span className="font-mono text-blue-500 text-lg font-black">
                  {selectedPkg ? formatRupiah(selectedPkg.price + (selectedChannel?.fee || 0)) : 'Rp 0'}
                </span>
              </div>
            </div>

            {/* Verification Warning Box if not verified */}
            {!verifiedNickname && formData['userId'] && (
              <div className="p-3 rounded-xl bg-amber-950/15 border border-amber-500/20 text-amber-300 text-[11px] flex gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p>Klik tombol <strong>Periksa & Validasi Username Akun</strong> di atas untuk mengonfirmasi nickname akun Anda demi mencegah salah top-up!</p>
              </div>
            )}

            {/* Action Checkout button */}
            <button
              id="submit-checkout-button"
              type="submit"
              disabled={!isFormComplete}
              className={`w-full py-5 rounded-3xl font-black text-base uppercase tracking-widest transition-all duration-300 text-center flex items-center justify-center gap-2 select-none active:scale-97 shadow-xl ${
                isFormComplete
                  ? 'bg-blue-500 hover:bg-blue-400 text-white cursor-pointer shadow-blue-500/20'
                  : 'bg-slate-950 border border-slate-850 text-slate-600 cursor-not-allowed'
              }`}
            >
              Purchase Now
            </button>
            
            <p className="text-[10px] text-slate-500 text-center leading-normal">
              Sistem Enkripsi Gateway SSL 256-bit diaktifkan. Transaksi top-up dilindungi sepenuhnya oleh jaminan keamanan payment merchant GPN.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
