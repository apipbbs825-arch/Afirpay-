import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  History, Calendar, Hash, CreditCard, ChevronRight, Search, 
  Trash2, X, Swords, Flame, Target, Compass, ShieldAlert, Crown, Gamepad2
} from 'lucide-react';
import { Transaction } from '../types';
import { formatRupiah } from '../utils';

interface TransactionHistoryProps {
  transactions: Transaction[];
  onSelectTransaction: (tx: Transaction) => void;
  onClearHistory: () => void;
  onClose: () => void;
}

export default function TransactionHistory({ transactions, onSelectTransaction, onClearHistory, onClose }: TransactionHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Map icon name to Lucide Icon Component
  const getGameIcon = (iconName: string) => {
    const cls = "w-4 h-4 text-slate-400";
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

  const filteredHistory = transactions.filter(tx => 
    tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.gameName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tx.playerNickname.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="transaction-history-panel" className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
      
      {/* Drawer Title Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <History className="w-5 h-5 text-violet-400" />
          <h2 className="text-base font-sans font-bold text-slate-100">Riwayat Pembelian Anda</h2>
        </div>
        <button
          onClick={onClose}
          className="text-slate-500 hover:text-slate-300 p-1.5 hover:bg-slate-850 rounded-xl transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Filter and Cleaning Tools */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari Invoice, Game, atau Nickname..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-850 focus:border-violet-500 rounded-xl py-2 pl-9 pr-4 text-xs text-slate-200 outline-none transition placeholder-slate-600"
          />
        </div>

        {transactions.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-xs font-semibold text-rose-500 hover:text-rose-400 bg-rose-950/10 hover:bg-rose-950/20 px-4 py-2 border border-rose-900/30 rounded-xl transition flex items-center justify-center gap-1.5 active:scale-95"
          >
            <Trash2 className="w-3.5 h-3.5" /> Hapus Riwayat
          </button>
        )}
      </div>

      {/* Listing Content */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 scrollbar-thin">
        {filteredHistory.length > 0 ? (
          <div className="space-y-2">
            {filteredHistory.map((tx) => (
              <div
                key={tx.id}
                onClick={() => onSelectTransaction(tx)}
                className="group relative bg-slate-950 hover:bg-slate-950/80 border border-slate-850 hover:border-slate-800 p-4 rounded-2xl cursor-pointer transition duration-200 select-none flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  {/* Game Icon avatar wrapper */}
                  <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    {getGameIcon(tx.gameIcon)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200 text-xs sm:text-sm line-clamp-1">{tx.gameName}</span>
                      <span className="text-[10px] text-slate-500 font-mono font-bold">{tx.id}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
                      <span className="font-semibold text-emerald-400">{tx.playerNickname}</span>
                      <span className="text-slate-600">•</span>
                      <span>{tx.packageName}</span>
                      <span className="text-slate-600">•</span>
                      <span className="font-mono">{formatRupiah(tx.packagePrice)}</span>
                    </div>

                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(tx.createdAt).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</span>
                    </div>
                  </div>
                </div>

                {/* Status indicator on the right */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="text-right hidden sm:block">
                    {tx.status === 'pending' && <span className="text-[10px] text-amber-500 font-bold bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10">Pending</span>}
                    {tx.status === 'processing' && <span className="text-[10px] text-indigo-400 font-bold bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10 animate-pulse">Sedang Diisi</span>}
                    {tx.status === 'success' && <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/15">Sukses</span>}
                    {tx.status === 'failed' && <span className="text-[10px] text-rose-500 font-bold bg-rose-500/5 px-2 py-0.5 rounded border border-rose-500/10">Expired</span>}
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-slate-400 transition" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-slate-850 rounded-2xl">
            <span className="text-slate-500 text-xs block mb-1">Riwayat transaksi kosong</span>
            <span className="text-[10px] text-slate-600">Lakukan pembelian game di dasbor utama untuk melihat data di sini.</span>
          </div>
        )}
      </div>

    </div>
  );
}
