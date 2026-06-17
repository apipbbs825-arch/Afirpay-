import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Gamepad2, Swords, Flame, Target, Compass, ShieldAlert, Crown, History, TrendingUp } from 'lucide-react';
import { Game } from '../types';
import { GAMES } from '../data';

interface GameListProps {
  onSelectGame: (game: Game) => void;
  onOpenHistory: () => void;
  hasHistory: boolean;
}

export default function GameList({ onSelectGame, onOpenHistory, hasHistory }: GameListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Map icon name to Lucide Icon Component
  const getGameIcon = (iconName: string) => {
    switch (iconName) {
      case 'Swords': return <Swords className="w-5 h-5 text-indigo-400" />;
      case 'Flame': return <Flame className="w-5 h-5 text-amber-500" />;
      case 'Target': return <Target className="w-5 h-5 text-zinc-400" />;
      case 'Compass': return <Compass className="w-5 h-5 text-emerald-400" />;
      case 'ShieldAlert': return <ShieldAlert className="w-5 h-5 text-rose-500" />;
      case 'Crown': return <Crown className="w-5 h-5 text-cyan-400" />;
      default: return <Gamepad2 className="w-5 h-5 text-purple-400" />;
    }
  };

  const categories = ['All', 'MOBA', 'Battle Royale', 'RPG', 'FPS'];

  const filteredGames = GAMES.filter((game) => {
    const matchesSearch = game.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          game.developer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || 
                            game.category.toLowerCase().includes(selectedCategory.toLowerCase());
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div id="game-list-container" className="space-y-8">
      {/* Header Promo Banner with Bold Typography Theme */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-slate-950 via-[#020617] to-slate-900 p-8 md:p-12 border border-white/5 shadow-2xl flex flex-col lg:flex-row gap-8 items-center justify-between"
      >
        <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="relative z-10 max-w-xl space-y-6">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 font-extrabold text-[10px] tracking-[0.2em] uppercase border border-blue-500/20">
            <TrendingUp className="w-3.5 h-3.5" /> PROMO KILAT INDONESIA
          </div>
          
          <h1 className="text-5xl md:text-7xl font-sans font-black leading-[0.9] tracking-tighter uppercase text-white">
            Instant<br/>
            <span className="text-transparent text-stroke-blue">Power</span><br/>
            Up.
          </h1>
          
          <p className="text-base md:text-lg text-slate-400 leading-snug max-w-md font-medium">
            Top up diamonds dan uc game pavorit Anda dalam hitungan detik. Scan QRIS otomatis atau transfer e-wallet cepat, server memproses instan 24 jam.
          </p>
          
          <div className="flex flex-wrap gap-3 pt-2">
            <div className="flex items-center gap-2.5 bg-slate-900 border border-white/5 rounded-xl px-4 py-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span className="text-slate-355 font-bold uppercase tracking-wider">Settlement Otomatis</span>
            </div>
            <div className="flex items-center gap-2.5 bg-slate-900 border border-white/5 rounded-xl px-4 py-2 text-xs">
              <span className="text-slate-350 font-bold uppercase tracking-wider">⏱️ 15 DETIK</span>
            </div>
            {hasHistory && (
              <button 
                id="view-historic-button"
                onClick={onOpenHistory}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl px-4 py-2 transition shadow-lg shadow-blue-500/20"
              >
                <History className="w-3.5 h-3.5" /> Riwayat
              </button>
            )}
          </div>
        </div>

        {/* Feature showcase from the afirpay mockup on the right side of the banner */}
        <div className="relative z-10 w-full lg:w-fit flex flex-col gap-4 shrink-0 bg-slate-900/40 p-6 rounded-[30px] border border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-2xl shadow-xl shadow-blue-600/10">⚡</div>
            <div>
              <div className="text-lg font-black tracking-tight text-white">Instant Settle</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">under 15 seconds</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-2xl">🔒</div>
            <div>
              <div className="text-lg font-black tracking-tight text-white">Secure QRIS</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">encrypted payments</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filter and Search Bar Section */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 backdrop-blur-md">
        {/* Categories Selector */}
        <div id="category-selector-tabs" className="flex flex-wrap gap-1.5 order-2 md:order-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold uppercase tracking-wider transition duration-200 ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/15'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {cat === 'All' ? '⚡ SEMUA GAME' : cat.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Game Database Search Inputs */}
        <div className="relative w-full md:w-80 order-1 md:order-2">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 pointer-events-none" />
          <input
            id="game-search-input"
            type="text"
            placeholder="Cari Game..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950/80 hover:bg-slate-950/90 focus:bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 outline-none transition"
          />
        </div>
      </div>

      {/* Grid List of Available Games */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-sans font-bold text-slate-100 flex items-center gap-2">
            <Gamepad2 className="w-5 h-5 text-blue-400" />
            Pilih Game Terpopuler
          </h2>
          <span className="text-xs text-slate-500">Menampilkan {filteredGames.length} Game</span>
        </div>

        {filteredGames.length > 0 ? (
          <div id="game-grid" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {filteredGames.map((game, idx) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                whileHover={{ y: -5 }}
                onClick={() => onSelectGame(game)}
                className="group relative cursor-pointer overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/85 hover:border-blue-500/40 p-4 transition-all duration-300 shadow-sm"
              >
                {/* Colored game element accent background on group hover */}
                <div className={`absolute inset-0 bg-gradient-to-t ${game.bannerColor} opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none`} />
                
                {/* Game visual representation */}
                <div className={`w-full aspect-square rounded-xl bg-gradient-to-tr ${game.bannerColor} p-4 flex flex-col justify-between mb-4 relative overflow-hidden shadow-inner`}>
                  {/* Subtle particle graphics */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full blur-[10px] pointer-events-none transform -translate-y-5 translate-x-5" />
                  
                  {/* Game category badge */}
                  <div className="bg-slate-950/80 backdrop-blur-sm px-2 py-0.5 rounded-lg text-[10px] text-blue-300 font-medium self-start border border-white/5">
                    {game.category}
                  </div>

                  {/* Centered Large SVG/Icon representation */}
                  <div className="self-center transform group-hover:scale-110 transition duration-300 relative z-10 flex items-center justify-center p-3 rounded-full bg-slate-950/40 backdrop-blur-xs border border-white/10 shadow-lg">
                    {React.cloneElement(getGameIcon(game.iconName), { className: "w-8 h-8" })}
                  </div>

                  {/* Developer Name in footer of thumbnail */}
                  <span className="text-[10px] text-slate-300/80 font-mono tracking-wide">
                    {game.developer}
                  </span>
                </div>

                {/* Game Title info */}
                <div className="space-y-1 relative z-10">
                  <h3 className="font-sans font-bold text-slate-200 text-sm group-hover:text-blue-400 transition-colors duration-200 line-clamp-1">
                    {game.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>Instan 24 Jam</span>
                  </div>
                </div>

                {/* Bottom arrow visual cue */}
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <span className="text-blue-400 text-xs">➔</span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-slate-900/20 border border-slate-800 rounded-2xl">
            <span className="text-slate-500 text-sm">Game tidak ditemukan. Silakan gunakan pencarian lain.</span>
          </div>
        )}
      </div>
    </div>
  );
}
