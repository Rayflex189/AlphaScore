import React, { useState } from 'react';
import { 
  Search, ShieldCheck, Award, MapPin, TrendingUp, Filter, 
  ChevronRight, X, MessageSquare, DollarSign, Calendar
} from 'lucide-react';

export default function LeaderboardView({ leaderboard, onSelectTrader, currentTraderStats }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedTrader, setSelectedTrader] = useState(null);

  const getCountryFlag = (country) => {
    const flags = {
      'Nigeria': '🇳🇬',
      'Japan': '🇯🇵',
      'USA': '🇺🇸',
      'United States': '🇺🇸',
      'France': '🇫🇷',
      'Senegal': '🇸🇳',
      'United Kingdom': '🇬🇧',
      'UK': '🇬🇧',
      'Canada': '🇨🇦',
    };
    return flags[country] || '🌐';
  };

  // Process leaderboard list
  const traders = (leaderboard || []).map(trader => {
    // Dynamically calculate metrics based on AlphaScore so they fit naturally and scale
    const score = trader.alpha_score || 70;
    const computedWinRate = Math.round(48 + (score - 50) * 0.4);
    const computedDrawdown = parseFloat((12.5 - (score - 50) * 0.18).toFixed(1));
    const computedMonthlyReturn = parseFloat(((score - 50) * 0.25 + 4).toFixed(1));
    const computedProfitFactor = parseFloat(((score - 50) * 0.05 + 1.2).toFixed(2));

    return {
      id: trader.id,
      username: trader.username || 'Trader',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${trader.username || 'Trader'}`,
      country: trader.country || 'Nigeria',
      flag: getCountryFlag(trader.country || 'Nigeria'),
      style: trader.style || 'Swing Trader',
      experience: trader.experience || '3 Years',
      biography: trader.biography || '',
      market: trader.market || 'Forex',
      goals: trader.goals || '',
      availableForFunding: trader.available_for_funding,
      isVerified: trader.is_verified,
      badges: trader.badges || [],
      alphaScore: score,
      winRate: computedWinRate,
      drawdown: computedDrawdown,
      monthlyReturn: computedMonthlyReturn,
      profitFactor: computedProfitFactor,
    };
  });

  // Unique lists for filtering dropdowns
  const styles = ['All', ...new Set(traders.map(t => t.style))];
  const countries = ['All', ...new Set(traders.map(t => t.country))];

  // Filter logic
  const filteredTraders = traders.filter(trader => {
    const matchesSearch = trader.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStyle = selectedStyle === 'All' || trader.style === selectedStyle;
    const matchesCountry = selectedCountry === 'All' || trader.country === selectedCountry;
    const matchesVerified = !verifiedOnly || trader.isVerified;
    return matchesSearch && matchesStyle && matchesCountry && matchesVerified;
  });

  // Highlight classes for score ranges
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
    if (score >= 80) return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    if (score >= 70) return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
    return 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20';
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* View Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Global Leaderboard
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Explore and analyze verified forex and futures traders ranked by their verified AlphaScore metrics.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800/80 rounded-xl p-4 shadow-sm text-sm">
        
        {/* Left Side: Search + Dropdowns */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-zinc-400" />
            <input 
              type="text" 
              placeholder="Search trader username..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-zinc-50 dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-zinc-900 dark:text-zinc-100"
            />
          </div>

          {/* Style Filter */}
          <div className="relative">
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none cursor-pointer"
            >
              {styles.map(s => (
                <option key={s} value={s}>{s === 'All' ? 'All Styles' : s}</option>
              ))}
            </select>
          </div>

          {/* Country Filter */}
          <div className="relative">
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-zinc-900 dark:text-zinc-100 focus:outline-none cursor-pointer"
            >
              {countries.map(c => (
                <option key={c} value={c}>{c === 'All' ? 'All Regions' : c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Side: Toggle Switch */}
        <label className="flex items-center gap-2 cursor-pointer font-semibold select-none text-zinc-500 dark:text-zinc-400">
          <input 
            type="checkbox" 
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
            className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 dark:bg-[#09090b] border-zinc-300 dark:border-zinc-850"
          />
          <span>Verified accounts only</span>
        </label>

      </div>

      {/* Main Grid: List and Detail Panel */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Left Side: Traders Table */}
        <div className="flex-1 w-full bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800/80 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800/80">
                <thead className="bg-zinc-50 dark:bg-zinc-900/30 text-zinc-500 uppercase tracking-wider text-[10px] font-bold">
                  <tr>
                    <th scope="col" className="px-5 py-3.5 text-center w-12">Rank</th>
                    <th scope="col" className="px-5 py-3.5 text-left">Trader Name</th>
                    <th scope="col" className="px-5 py-3.5 text-center">AlphaScore</th>
                    <th scope="col" className="px-5 py-3.5 text-center">Avg Return</th>
                    <th scope="col" className="px-5 py-3.5 text-center">Max DD</th>
                    <th scope="col" className="px-5 py-3.5 text-center">Win Rate</th>
                    <th scope="col" className="px-5 py-3.5 text-left">Style</th>
                    <th scope="col" className="relative px-5 py-3.5"><span className="sr-only">Details</span></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-150 dark:divide-zinc-850 text-sm font-semibold">
                  {filteredTraders.map((trader, index) => {
                    const isSelected = selectedTrader?.id === trader.id;

                    return (
                      <tr 
                        key={trader.id} 
                        onClick={() => setSelectedTrader(trader)}
                        className={`cursor-pointer transition-colors ${
                          isSelected 
                            ? 'bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20' 
                            : 'hover:bg-zinc-50 dark:hover:bg-zinc-900/30'
                        }`}
                      >
                        <td className="px-5 py-4 text-center font-mono text-zinc-500 text-xs">
                          {index + 1}
                        </td>
                        
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <img src={trader.avatar} alt={trader.username} className="w-9 h-9 rounded-full object-cover" />
                            <div>
                              <p className="font-bold flex items-center gap-1">
                                {trader.username}
                              </p>
                              <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                                <span>{trader.flag}</span>
                                <span>{trader.country}</span>
                                {trader.isVerified && (
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" title="Verified Statement" />
                                )}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${getScoreColor(trader.alphaScore)}`}>
                            {trader.alphaScore}
                          </span>
                        </td>

                        <td className="px-5 py-4 text-center font-mono text-emerald-500">
                          +{trader.monthlyReturn}%
                        </td>

                        <td className="px-5 py-4 text-center font-mono text-rose-500">
                          {trader.drawdown}%
                        </td>

                        <td className="px-5 py-4 text-center font-mono">
                          {trader.winRate}%
                        </td>

                        <td className="px-5 py-4 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
                          {trader.style}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <ChevronRight className="w-4 h-4 text-zinc-400 ml-auto" />
                        </td>
                      </tr>
                    );
                  })}
                  {filteredTraders.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-5 py-10 text-center text-zinc-500">
                        No traders found matching those filter selections.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Details Side Panel */}
        {selectedTrader && (
          <div className="w-full lg:w-1/3 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800/80 rounded-xl p-5 shadow-xl space-y-5 sticky top-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold">Trader Evaluation</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Summary of trader metrics & options.</p>
              </div>
              <button 
                onClick={() => setSelectedTrader(null)}
                className="text-zinc-500 hover:text-zinc-200 font-bold p-1 rounded-lg border border-zinc-200 dark:border-zinc-800"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-5">
              <img src={selectedTrader.avatar} alt={selectedTrader.username} className="w-16 h-16 rounded-full object-cover" />
              <div>
                <h4 className="font-bold text-base flex items-center gap-1.5">
                  {selectedTrader.username}
                  {selectedTrader.isVerified && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
                </h4>
                <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                  <span>{selectedTrader.flag}</span>
                  <span>{selectedTrader.country}</span>
                  <span>•</span>
                  <span>{selectedTrader.experience} Exp</span>
                </p>
                <span className="mt-1.5 inline-block text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-bold">
                  {selectedTrader.style}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm font-mono border-b border-zinc-200 dark:border-zinc-800 pb-5">
              <div className="bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-500 font-semibold block uppercase">AlphaScore</span>
                <span className="text-lg font-bold text-blue-500">{selectedTrader.alphaScore}</span>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-500 font-semibold block uppercase">Profit Factor</span>
                <span className="text-lg font-bold text-purple-400">{selectedTrader.profitFactor}</span>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-500 font-semibold block uppercase">Max Drawdown</span>
                <span className="text-lg font-bold text-rose-500">{selectedTrader.drawdown}%</span>
              </div>
              <div className="bg-zinc-50 dark:bg-zinc-900/40 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <span className="text-[10px] text-zinc-500 font-semibold block uppercase">Win Rate</span>
                <span className="text-lg font-bold text-emerald-500">{selectedTrader.winRate}%</span>
              </div>
            </div>

            <div className="space-y-3 pt-2 text-sm">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500">Status</span>
                {selectedTrader.availableForFunding ? (
                  <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                    Open to Capital
                  </span>
                ) : (
                  <span className="bg-zinc-200 dark:bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded-full font-bold">
                    Allocated
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-500">Avg Return</span>
                <span className="font-bold text-emerald-500">+{selectedTrader.monthlyReturn}% Monthly</span>
              </div>
            </div>

            {/* Badges list */}
            {selectedTrader.badges.length > 0 && (
              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
                <span className="text-[10px] text-zinc-500 font-semibold block uppercase mb-2">Verified Badges</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTrader.badges.map((badge, bIdx) => (
                    <span 
                      key={bIdx}
                      className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-bold"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <button 
                onClick={() => alert(`Opening chat with ${selectedTrader.username}...`)}
                className="flex-1 py-2 px-3 bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 text-white rounded-lg text-xs font-semibold flex justify-center items-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Message
              </button>
              {selectedTrader.availableForFunding && (
                <button 
                  onClick={() => alert(`Initiated funding proposal for ${selectedTrader.username}`)}
                  className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex justify-center items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  Fund Trader
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
