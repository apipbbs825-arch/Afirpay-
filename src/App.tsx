/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gamepad2, History, ShieldCheck, Sparkles, MessageSquare, AlertCircle, 
  CheckCircle, RefreshCw, Star, ArrowRight, CornerDownRight, X, PhoneCall
} from 'lucide-react';
import { Game, NominalPackage, PaymentChannel, Transaction } from './types';
import { createNewTransaction } from './utils';

import GameList from './components/GameList';
import TopUpForm from './components/TopUpForm';
import InvoiceDetail from './components/InvoiceDetail';
import TransactionHistory from './components/TransactionHistory';

export default function App() {
  const [screen, setScreen] = useState<'games' | 'form' | 'invoice'>('games');
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [activeInvoice, setActiveInvoice] = useState<Transaction | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // Custom Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Load Transactions on Startup
  useEffect(() => {
    try {
      const stored = localStorage.getItem('game_topup_transactions');
      if (stored) {
        setTransactions(JSON.parse(stored));
      }
    } catch (_) {
      console.warn('Failed to parse localStorage history.');
    }
  }, []);

  // Save transactions to local storage whenever list modifies
  const saveTransactions = (updatedTransactions: Transaction[]) => {
    setTransactions(updatedTransactions);
    try {
      localStorage.setItem('game_topup_transactions', JSON.stringify(updatedTransactions));
    } catch (_) {
      console.error('Failed to save history.');
    }
  };

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Select game to proceed to configuration
  const handleSelectGame = (game: Game) => {
    setSelectedGame(game);
    setScreen('form');
  };

  // Triggers generating the transaction & moving to payment screen
  const handleCreateOrder = (
    pkg: NominalPackage,
    channel: PaymentChannel,
    accountId: string,
    zoneId: string,
    nickname: string,
    phone: string
  ) => {
    if (!selectedGame) return;

    const newTx = createNewTransaction(
      selectedGame,
      pkg,
      channel,
      accountId,
      zoneId,
      nickname,
      phone
    );

    const updated = [newTx, ...transactions];
    saveTransactions(updated);
    setActiveInvoice(newTx);
    setScreen('invoice');
    showToast('Invoice otomatis berhasil dibuat!', 'success');
  };

  // Handler for successful pay confirmation from InvoiceDetail
  const handlePaymentSuccess = (txId: string) => {
    const updated = transactions.map(tx => {
      if (tx.id === txId) {
        return { ...tx, status: 'success' as const };
      }
      return tx;
    });
    saveTransactions(updated);
    
    // Refresh active invoice to display SUCCESS state
    const currentActive = updated.find(tx => tx.id === txId);
    if (currentActive) {
      setActiveInvoice(currentActive);
    }
    
    showToast('Kredit game berhasil terkirim instan!', 'success');
  };

  // Handler for cancelled or expired transaction status
  const handlePaymentFailed = (txId: string) => {
    const updated = transactions.map(tx => {
      if (tx.id === txId) {
        return { ...tx, status: 'failed' as const };
      }
      return tx;
    });
    saveTransactions(updated);

    const currentActive = updated.find(tx => tx.id === txId);
    if (currentActive) {
      setActiveInvoice(currentActive);
    }
    
    showToast('Pembayaran Dibatalkan / Kadaluarsa.', 'error');
  };

  // View historical transaction receipt details
  const handleSelectHistoryTx = (tx: Transaction) => {
    setActiveInvoice(tx);
    setShowHistory(false);
    setScreen('invoice');
    showToast(`Membuka Invoice ${tx.id}`, 'info');
  };

  const handleClearHistory = () => {
    if (confirm('Apakah Anda yakin ingin menghapus semua riwayat transaksi dari memori?')) {
      saveTransactions([]);
      showToast('Seluruh riwayat berhasil dihapus.', 'info');
    }
  };

  const handleCloseInvoice = () => {
    setScreen('games');
    setActiveInvoice(null);
    setSelectedGame(null);
  };

  return (
    <div id="application-root" className="min-h-screen bg-[#020617] text-slate-100 font-sans antialiased selection:bg-blue-500/30 selection:text-blue-300 flex flex-col relative overflow-x-hidden">
      
      {/* Visual background ambient gradient filters */}
      <div className="absolute top-0 left-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid Pattern Background Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b06_1px,transparent_1px),linear-gradient(to_bottom,#1e293b06_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Primary Navigation Header */}
      <header className="sticky top-0 z-30 bg-[#020617]/80 border-b border-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo / Title brand */}
          <div 
            onClick={() => {
              setScreen('games');
              setSelectedGame(null);
              setActiveInvoice(null);
            }}
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 active:scale-98 transition select-none"
          >
            <div className="text-2xl font-black tracking-tighter text-blue-500 font-sans">
              AFIR<span className="text-white">PAY.</span>
            </div>
          </div>

          {/* Quick Menu Tools */}
          <div className="flex items-center gap-3">
            
            {/* Customer Status Info Indicator */}
            <div className="hidden md:flex items-center gap-2 bg-slate-900/50 border border-white/5 px-3 py-1.5 rounded-xl text-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-450 text-blue-400" />
              <span className="text-slate-350 font-bold uppercase tracking-wider text-[10px]">Merchant Terverifikasi</span>
            </div>

            {/* Riwayat Tab Trigger */}
            <button
              id="header-history-btn"
              onClick={() => setShowHistory(true)}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-850 active:scale-95 text-slate-200 border border-white/5 transition py-2 px-4 rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              <History className="w-3.5 h-3.5 text-blue-400" />
              <span>History</span>
              {transactions.length > 0 && (
                <span className="bg-blue-500 text-white font-bold text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {transactions.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container wrapper with fluid responsive margins */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={screen}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.25 }}
          >
            {screen === 'games' && (
              <GameList 
                onSelectGame={handleSelectGame} 
                onOpenHistory={() => setShowHistory(true)}
                hasHistory={transactions.length > 0}
              />
            )}

            {screen === 'form' && selectedGame && (
              <TopUpForm 
                game={selectedGame} 
                onBack={() => setScreen('games')} 
                onSubmitOrder={handleCreateOrder}
              />
            )}

            {screen === 'invoice' && activeInvoice && (
              <InvoiceDetail 
                transaction={activeInvoice} 
                onPaymentSuccess={handlePaymentSuccess}
                onPaymentFailed={handlePaymentFailed}
                onClose={handleCloseInvoice}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Side Drawer Transaction History modal overlay */}
      <AnimatePresence>
        {showHistory && (
          <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowHistory(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs"
            />
            
            {/* Body */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg h-full bg-slate-900 border-l border-slate-800 shadow-2xl overflow-y-auto"
            >
              <div className="p-4">
                <TransactionHistory 
                  transactions={transactions} 
                  onSelectTransaction={handleSelectHistoryTx} 
                  onClearHistory={handleClearHistory}
                  onClose={() => setShowHistory(false)}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Manager notification wrapper */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-4.5 py-3 rounded-2xl shadow-xl shadow-slate-950/40 border text-xs font-semibold backdrop-blur-md ${
              toast.type === 'success' 
                ? 'bg-emerald-950/90 border-emerald-500/25 text-emerald-300' 
                : toast.type === 'error'
                ? 'bg-rose-950/90 border-rose-500/25 text-rose-300'
                : 'bg-slate-900/90 border-slate-800 text-slate-200'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle className="w-4.5 h-4.5 text-emerald-400" /> : <AlertCircle className="w-4.5 h-4.5 text-rose-450" />}
            <span>{toast.message}</span>
            <button onClick={() => setToast(null)} className="text-slate-400 hover:text-slate-200 text-base ml-2">×</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Area with AFIRPAY styling */}
      <footer className="border-t border-white/5 py-8 bg-[#020617] mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          <div className="flex gap-6">
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
            <span>Contact</span>
          </div>
          <div className="flex gap-4 items-center flex-wrap justify-center">
            <span className="text-blue-500 flex items-center gap-1.5 font-extrabold">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" /> Live Server
            </span>
            <span>© {new Date().getFullYear()} AFIRPAY GLOBAL</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
