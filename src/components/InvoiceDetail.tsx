import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, Clock, Copy, Landmark, Sparkles, Smartphone, ShieldCheck, 
  HelpCircle, AlertTriangle, FileText, ChevronRight, XCircle, Share2, CornerDownRight, Check
} from 'lucide-react';
import { Transaction } from '../types';
import { formatRupiah, getQRISStandardString } from '../utils';

interface InvoiceDetailProps {
  transaction: Transaction;
  onPaymentSuccess: (txId: string) => void;
  onPaymentFailed: (txId: string) => void;
  onClose: () => void;
}

export default function InvoiceDetail({ transaction, onPaymentSuccess, onPaymentFailed, onClose }: InvoiceDetailProps) {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'checkout' | 'instructions'>('checkout');

  // Logs for simulation of automatic fulfillment
  const [simulationStep, setSimulationStep] = useState<number>(0);
  const [logs, setLogs] = useState<string[]>([]);
  
  // Timer Countdown
  useEffect(() => {
    if (transaction.status !== 'pending' || timeLeft <= 0) return;
    
    const interval = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, transaction.status]);

  // Handle countdown expiration
  useEffect(() => {
    if (timeLeft === 0 && transaction.status === 'pending') {
      onPaymentFailed(transaction.id);
    }
  }, [timeLeft, transaction.status]);

  // Simulate logs output during fulfillment phase
  useEffect(() => {
    if (transaction.status === 'processing') {
      const messages = [
        `[${new Date().toLocaleTimeString()}] Menghubungkan ke API Gateway Core...`,
        `[${new Date().toLocaleTimeString()}] QRIS/E-Wallet payment hash terverifikasi...`,
        `[${new Date().toLocaleTimeString()}] Menyalurkan saldo ${transaction.packageName} ke game ${transaction.gameName}...`,
        `[${new Date().toLocaleTimeString()}] Menghubungkan ke Server Akun (UID: ${transaction.accountId})...`,
        `[${new Date().toLocaleTimeString()}] Pengiriman Sukses! Server mengembalikan kode status 200..`,
        `[${new Date().toLocaleTimeString()}] Mengirimkan nota pembayaran digital via WhatsApp ke +62${transaction.whatsappPhone}...`
      ];

      setLogs([]);
      let i = 0;
      const interval = setInterval(() => {
        if (i < messages.length) {
          setLogs(prev => [...prev, messages[i]]);
          i++;
        } else {
          clearInterval(interval);
          onPaymentSuccess(transaction.id);
        }
      }, 700);

      return () => clearInterval(interval);
    }
  }, [transaction.status]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Helper QR code generator using pure scalable SVG blocks
  const renderSVGQRCode = (text: string) => {
    // Return a stylish geometric QR pattern to simulate an authentic high-resolution code
    return (
      <svg viewBox="0 0 200 200" className="w-52 h-52 mx-auto">
        {/* Background */}
        <rect width="200" height="200" fill="white" rx="12" />
        
        {/* Finder pattern top-left */}
        <rect x="15" y="15" width="40" height="40" fill="#0f172a" rx="4" />
        <rect x="23" y="23" width="24" height="24" fill="white" />
        <rect x="29" y="29" width="12" height="12" fill="#0f172a" rx="1" />

        {/* Finder pattern top-right */}
        <rect x="145" y="15" width="40" height="40" fill="#0f172a" rx="4" />
        <rect x="153" y="23" width="24" height="24" fill="white" />
        <rect x="159" y="29" width="12" height="12" fill="#0f172a" rx="1" />

        {/* Finder pattern bottom-left */}
        <rect x="15" y="145" width="40" height="40" fill="#0f172a" rx="4" />
        <rect x="23" y="153" width="24" height="24" fill="white" />
        <rect x="29" y="159" width="12" height="12" fill="#0f172a" rx="1" />

        {/* Dynamic decorative dot blocks representing encoded contents */}
        {/* Layer 1 */}
        <rect x="70" y="20" width="8" height="8" fill="#4f46e5" rx="1" />
        <rect x="90" y="20" width="16" height="8" fill="#0f172a" rx="1" />
        <rect x="115" y="25" width="8" height="16" fill="#0f172a" rx="1" />
        
        {/* Layer 2 */}
        <rect x="70" y="40" width="16" height="8" fill="#0f172a" rx="1" />
        <rect x="100" y="45" width="8" height="8" fill="#4f46e5" rx="1" />
        <rect x="120" y="40" width="16" height="8" fill="#0f172a" rx="1" />

        {/* Center alignment patterns */}
        <rect x="90" y="90" width="20" height="20" fill="#e11d48" rx="2" />
        <rect x="95" y="95" width="10" height="10" fill="white" />
        
        {/* Layer 3 */}
        <rect x="25" y="75" width="16" height="16" fill="#0f172a" rx="1" />
        <rect x="50" y="70" width="8" height="16" fill="#0f172a" rx="1" />
        <rect x="65" y="85" width="16" height="8" fill="#4f46e5" rx="1" />
        
        {/* Layer 4 */}
        <rect x="120" y="70" width="16" height="16" fill="#0f172a" rx="1" />
        <rect x="145" y="80" width="30" height="8" fill="#0f172a" rx="1" />
        
        {/* Layer 5 */}
        <rect x="15" y="110" width="24" height="8" fill="#0f172a" rx="1" />
        <rect x="50" y="115" width="30" height="8" fill="#0f172a" rx="1" />
        <rect x="90" y="125" width="16" height="16" fill="#0f172a" rx="1" />
        <rect x="115" y="110" width="8" height="16" fill="#4f46e5" rx="1" />
        
        {/* Layer 6 */}
        <rect x="70" y="145" width="16" height="8" fill="#0f172a" rx="1" />
        <rect x="95" y="155" width="16" height="8" fill="#0f172a" rx="1" />
        <rect x="120" y="145" width="8" height="30" fill="#4f46e5" rx="1" />
        <rect x="140" y="150" width="16" height="16" fill="#0f172a" rx="1" />
        <rect x="165" y="145" width="16" height="8" fill="#0f172a" rx="1" />
        
        {/* Logo overlay badge on center (simulate QRIS QR layout) */}
        <rect x="80" y="80" width="40" height="40" fill="white" rx="6" stroke="#f43f5e" strokeWidth="2" />
        <text x="100" y="103" textAnchor="middle" fill="#f43f5e" fontSize="12" fontWeight="950" fontFamily="sans-serif">QRIS</text>
        <text x="100" y="111" textAnchor="middle" fill="#0284c7" fontSize="5" fontWeight="bold" fontFamily="sans-serif">GPN MERCHANT</text>
      </svg>
    );
  };

  return (
    <div id="invoice-detail-wrapper" className="space-y-6">
      
      {/* Simulation Controller Header for testing payment automatons */}
      {transaction.status === 'pending' && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-slate-900 border border-violet-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl"
        >
          <div className="space-y-1">
            <span className="flex items-center gap-1.5 text-xs text-violet-300 font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 animate-bounce" /> Simulator Otomatisasi Merchant
            </span>
            <p className="text-xs text-slate-400">
              Gunakan tombol di sebelah kanan untuk menyimulasikan pembayaran nyata. Server instan mendeteksi status dan mentransfer diamond.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 shrink-0">
            <button
              id="simulate-success-pay"
              onClick={() => {
                // Change status from pending to processing (triggers terminal logging then success)
                transaction.status = 'processing';
                setTimeLeft(0);
              }}
              className="bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs py-2 px-4 rounded-xl transition shadow-lg shadow-emerald-500/10 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Simulasi Bayar QRIS/E-Wallet
            </button>
            <button
              id="simulate-failed-pay"
              onClick={() => onPaymentFailed(transaction.id)}
              className="bg-slate-950 border border-slate-800 hover:bg-slate-800 text-rose-400 font-semibold text-xs py-2 px-3 rounded-xl transition"
            >
              Gagalkan
            </button>
          </div>
        </motion.div>
      )}

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: QR Code scanning and steps details */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md text-center space-y-5">
            
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
              <span className="text-xs text-slate-400 font-medium">Metode Bayar: <strong className="text-slate-200">{transaction.paymentMethod.name}</strong></span>
              <div className="flex items-center gap-1 text-xs text-indigo-400 font-bold font-mono">
                <Clock className="w-3.5 h-3.5" /> {transaction.status === 'pending' ? formatTime(timeLeft) : '---'}
              </div>
            </div>

            {/* State-dependent Checkout Rendering */}
            <AnimatePresence mode="wait">
              {transaction.status === 'pending' && (
                <motion.div
                  key="pending-phase"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {/* QRIS Graphic */}
                  {transaction.paymentMethod.type === 'qris' ? (
                    <div className="space-y-4">
                      <div className="bg-white p-4 inline-block rounded-2xl shadow-xl shadow-slate-950/20 border border-slate-800/5 hover:scale-[1.02] transition duration-200">
                        {renderSVGQRCode(getQRStandard(transaction.id, transaction.packagePrice))}
                      </div>
                      
                      <div className="space-y-1 max-w-sm mx-auto">
                        <span className="text-slate-300 font-bold text-sm tracking-wide block uppercase">
                          A/N: <span className="text-violet-400 font-sans font-black">TOPUP GAME INC</span>
                        </span>
                        <p className="text-[11px] text-slate-500 leading-normal">
                          Pindai kode QRIS di atas melalui aplikasi LinkAja, DANA, OVO, ShopeePay, GoPay, Sakuku, atau Mobile Banking untuk memulai proses pemotongan otomatis.
                        </p>
                      </div>
                    </div>
                  ) : (
                    /* E-Wallet Push Notification Simulator Display */
                    <div className="space-y-5 py-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-indigo-600/15">
                        <Smartphone className="w-8 h-8 text-white animate-pulse" />
                      </div>
                      
                      <div className="space-y-2 max-w-xs mx-auto">
                        <h4 className="font-bold text-slate-200 font-sans text-sm">Menunggu Push OTP / PIN DANA</h4>
                        <p className="text-xs text-slate-400 leading-normal">
                          Sistem kami telah memicu deeplink transaksi untuk nomor <strong>+62{transaction.whatsappPhone}</strong>. Segera periksa handphone Anda atau selesaikan dengan cepat via tombol simulator di atas.
                        </p>
                      </div>

                      {/* Display Push Billing code to copy */}
                      <div className="bg-slate-950/80 border border-slate-850 p-3 rounded-xl flex items-center justify-between text-xs max-w-sm mx-auto">
                        <span className="text-slate-400 font-mono">ID Referensi E-Wallet:</span>
                        <div className="flex items-center gap-1.5 font-mono text-slate-200 font-bold">
                          <span>{transaction.referenceId}</span>
                          <button
                            id="btn-copy-ref"
                            onClick={() => handleCopy(transaction.referenceId, 'ref')}
                            className="text-slate-500 hover:text-slate-300 transition"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-950 border border-slate-850">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping inline-block shrink-0" />
                    <span className="text-slate-400 text-xs font-medium">Sistem memantau pembayaran otomatis...</span>
                  </div>
                </motion.div>
              )}

              {transaction.status === 'processing' && (
                <motion.div
                  key="processing-phase"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-5 py-8"
                >
                  <div className="w-16 h-16 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-200 text-sm">Pembayaran Terdeteksi!</h3>
                    <p className="text-xs text-slate-400">Harap jangan menutup layar, robot server sedang melakukan provisioning stok.</p>
                  </div>

                  {/* Terminal Simulation Logs */}
                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-850 text-left font-mono text-[10px] space-y-1 max-h-36 overflow-y-auto scrollbar-thin">
                    {logs.map((log, idx) => (
                      <div key={idx} className="text-indigo-300 flex items-start gap-1">
                        <span className="text-slate-600 shrink-0 select-none">➔</span>
                        <span className="break-all">{log}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {transaction.status === 'success' && (
                <motion.div
                  key="success-phase"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4 py-4"
                >
                  <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full mx-auto flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-black text-slate-100 text-lg">Top Up Berhasil!</h3>
                    <p className="text-xs text-slate-400 tracking-normal px-2 leading-relaxed">
                      Layanan game otomatis telah mendepositkan koin ke Akun Anda. Receipt digital dikirim ke No WhatsApp terdaftar.
                    </p>
                  </div>

                  <div className="bg-slate-950/80 border border-slate-850 p-3.5 rounded-2xl space-y-2 text-xs text-left">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Nickname:</span>
                      <span className="font-bold text-emerald-400">{transaction.playerNickname}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Produk:</span>
                      <span className="font-bold text-slate-300">{transaction.packageName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Status:</span>
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 rounded-md">SUKSES - PAID</span>
                    </div>
                  </div>

                  <button
                    id="receipt-close-btn"
                    onClick={onClose}
                    className="w-full bg-slate-950 border border-slate-850 hover:bg-slate-900 text-slate-200 text-xs font-bold py-2.5 rounded-xl transition active:scale-95 flex items-center justify-center gap-1.5"
                  >
                    Tutup invoice
                  </button>
                </motion.div>
              )}

              {transaction.status === 'failed' && (
                <motion.div
                  key="failed-phase"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4 py-8"
                >
                  <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-full mx-auto flex items-center justify-center text-rose-400">
                    <XCircle className="w-10 h-10" />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-100 text-base">Pembayaran Expired / Gagal</h3>
                    <p className="text-xs text-slate-400 leading-normal max-w-xs mx-auto">
                      Sesi transfer pembayaran telah kadaluarsa atau dibatalkan oleh server. Silakan buat pesanan baru.
                    </p>
                  </div>

                  <button
                    id="fail-close-all"
                    onClick={onClose}
                    className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-300 text-xs font-bold py-2.5 rounded-xl transition"
                  >
                    Tutup & Buat Transaksi Baru
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* Right Column: Invoice items details and receipt metadata (7 columns) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Main Details Billing information */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-md space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800/80 pb-4 gap-3">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase block">Tagihan Pembayaran</span>
                <div className="flex items-center gap-2 font-mono text-sm font-black text-slate-200">
                  <span>{transaction.id}</span>
                  <button
                    id="copy-invoice-id"
                    onClick={() => handleCopy(transaction.id, 'invoice')}
                    className="text-slate-500 hover:text-slate-300 transition"
                  >
                    {copiedText === 'invoice' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Badges of Transaction Status */}
              <div className="self-start sm:self-center">
                {transaction.status === 'pending' && (
                  <span className="px-3 py-1 text-xs font-bold rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center gap-1 w-fit animate-pulse">
                    <Clock className="w-3.5 h-3.5" /> Menunggu Pembayaran
                  </span>
                )}
                {transaction.status === 'processing' && (
                  <span className="px-3 py-1 text-xs font-bold rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center gap-1 w-fit">
                    <div className="w-2.5 h-2.5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" /> Sedang Diisi...
                  </span>
                )}
                {transaction.status === 'success' && (
                  <span className="px-3 py-1 text-xs font-bold rounded-lg bg-emerald-500/15 border border-emerald-500/20 text-emerald-400 flex items-center gap-1 w-fit">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Sukses Diproses
                  </span>
                )}
                {transaction.status === 'failed' && (
                  <span className="px-3 py-1 text-xs font-bold rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center gap-1 w-fit">
                    <XCircle className="w-3.5 h-3.5" /> Kadaluarsa / Batal
                  </span>
                )}
              </div>
            </div>

            {/* Structured Table Rows of item details */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Rincian Pembelian</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-dashed border-slate-800/60 pb-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-500 text-xs">Game:</span>
                    <span className="font-bold text-slate-300">{transaction.gameName}</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-500 text-xs">ID Akun Game:</span>
                    <span className="font-mono font-bold text-slate-300">{transaction.accountId}</span>
                  </div>
                  {transaction.zoneId && (
                    <div className="flex justify-between py-0.5">
                      <span className="text-slate-500 text-xs">Zone/Server:</span>
                      <span className="font-mono text-slate-300 font-bold">{transaction.zoneId}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-500 text-xs">Nama Nickname:</span>
                    <span className="font-bold text-emerald-400 bg-emerald-950/10 border border-emerald-500/10 px-2 rounded-md">{transaction.playerNickname}</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-500 text-xs">Nominal Kredit:</span>
                    <span className="font-semibold text-slate-300">{transaction.packageName}</span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-500 text-xs">ID WhatsApp:</span>
                    <span className="font-mono text-slate-300 font-bold">+62{transaction.whatsappPhone}</span>
                  </div>
                </div>
              </div>

              {/* Pricing Math calculations */}
              <div className="space-y-2 text-sm pt-2">
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Merchant Referral ID:</span>
                  <span className="font-mono">{transaction.referenceId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Harga Item:</span>
                  <span className="font-mono text-slate-200">{formatRupiah(transaction.packagePrice - transaction.paymentMethod.fee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Biaya Administrasi Gateway:</span>
                  <span className="font-mono text-slate-200">
                    {transaction.paymentMethod.fee === 0 ? 'GRATIS' : formatRupiah(transaction.paymentMethod.fee)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-100 border-t border-slate-800/85 pt-3">
                  <span>Grand Total Tagihan:</span>
                  <span className="font-mono text-violet-400 text-base">{formatRupiah(transaction.packagePrice)}</span>
                </div>
              </div>
            </div>

            {/* Instruction Tabs */}
            <div className="pt-2 border-t border-slate-800/80">
              <div className="flex gap-2 border-b border-slate-850 mb-3 text-xs font-semibold">
                <button
                  onClick={() => setActiveTab('checkout')}
                  className={`pb-2.5 px-1 relative transition ${activeTab === 'checkout' ? 'text-violet-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Panduan Bayar
                  {activeTab === 'checkout' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500" />}
                </button>
                <button
                  onClick={() => setActiveTab('instructions')}
                  className={`pb-2.5 px-1 relative transition ${activeTab === 'instructions' ? 'text-violet-400' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  Ketentuan Layanan
                  {activeTab === 'instructions' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-500" />}
                </button>
              </div>

              {activeTab === 'checkout' ? (
                <div className="space-y-2.5 text-xs text-slate-400 leading-normal">
                  <p className="font-semibold text-slate-300">💡 Langkah Pembayaran Instan:</p>
                  <div className="space-y-1.5 list-none">
                    <div className="flex items-start gap-1.5">
                      <span className="text-violet-400 shrink-0 select-none">1.</span>
                      <p>Gunakan tombol <strong>Simulasi Bayar</strong> di bagian atas panel untuk melakukan pemotongan otomatis tanpa harus scan sungguhan.</p>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-violet-400 shrink-0 select-none">2.</span>
                      <p>Sistem AI kami mendepositkan koin game ke username <strong>{transaction.playerNickname}</strong> dalam waktu maksimal 3-5 detik setelah simulator mengkonfirmasi pembayaran.</p>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <span className="text-violet-400 shrink-0 select-none">3.</span>
                      <p>Hubungi admin CS WA kami jika Anda mengalami error dalam pemrosesan.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-xs text-slate-400 leading-normal">
                  <div className="flex gap-2 items-start">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <p>Produk ini bersifat non-refundable (tidak dapat diubah atau ditarik kembali) karena sistem melakukan top-up otomatis ke server API Game secara instan.</p>
                  </div>
                  <div className="flex gap-2 items-start">
                    <HelpCircle className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                    <p>Harap pastikan player ID yang diinput sudah divalidasi dengan status Verified. Kerugian akibat kesalahan ID berada diluar tanggung jawab platform.</p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

// Generate fallback standard URL parameters for QRIS scanner mocks
function getQRStandard(id: string, price: number) {
  return getQRISStandardString(id, price);
}
