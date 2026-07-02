import React, { useState } from 'react';
import { 
  Briefcase, DollarSign, Award, ShieldAlert, ArrowRight, CheckCircle2, 
  HelpCircle, ChevronRight, Filter, AlertTriangle, FileText
} from 'lucide-react';

export default function MarketplaceView({ opportunities, stats, onApplyOpportunity, appliedOppIds }) {
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [pitch, setPitch] = useState('');
  
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  const handleApply = (oppId) => {
    onApplyOpportunity(oppId, pitch);
    setSelectedOpp(null);
    setPitch('');
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Funding Marketplace
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Apply to institutional funding pools, proprietary firms, and private capital allocators.
        </p>
      </div>

      {/* Main Grid: Opportunities List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Listings */}
        <div className="lg:col-span-2 space-y-4">
          
          {opportunities.map((opp) => {
            const meetsScore = stats.alphaScore >= opp.min_score;
            const meetsDrawdown = stats.maxDrawdown <= parseFloat(opp.max_drawdown);
            const isEligible = meetsScore && meetsDrawdown;
            const isApplied = (appliedOppIds || []).includes(opp.id);

            return (
              <div 
                key={opp.id}
                className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800/80 rounded-xl p-6 shadow-sm hover:border-zinc-300 dark:hover:border-zinc-700/80 transition-all flex flex-col md:flex-row justify-between gap-6"
              >
                {/* Left part: Title & Specs */}
                <div className="space-y-3.5 flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg">
                      {opp.logo}
                    </span>
                    <div>
                      <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-50">{opp.investor}</h3>
                      <p className="text-xs text-zinc-500 font-semibold">{opp.type} Allocation</p>
                    </div>
                  </div>

                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {opp.description}
                  </p>

                  {/* Requirements Badges */}
                  <div className="flex flex-wrap gap-2 text-[10px] font-mono font-bold">
                    <span className="bg-blue-500/5 text-blue-400 border border-blue-500/10 px-2.5 py-1 rounded">
                      Min AlphaScore: {opp.min_score}
                    </span>
                    <span className="bg-rose-500/5 text-rose-400 border border-rose-500/10 px-2.5 py-1 rounded">
                      Max Drawdown: {opp.max_drawdown}%
                    </span>
                    <span className="bg-purple-500/5 text-purple-400 border border-purple-500/10 px-2.5 py-1 rounded">
                      Record: {opp.min_track_record}
                    </span>
                    <span className="bg-amber-500/5 text-amber-400 border border-amber-500/10 px-2.5 py-1 rounded">
                      Risk Profile: {opp.risk_profile}
                    </span>
                  </div>
                </div>

                {/* Right part: Budget & Action */}
                <div className="flex flex-col justify-between items-start md:items-end w-full md:w-48 border-t md:border-t-0 border-zinc-100 dark:border-zinc-800/80 pt-4 md:pt-0">
                  <div className="md:text-right">
                    <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold block">Allocation Pool</span>
                    <span className="text-2xl font-bold font-mono text-emerald-500">
                      {formatCurrency(opp.budget)}
                    </span>
                  </div>

                  <div className="mt-4 md:mt-0 w-full">
                    {isApplied ? (
                      <div className="w-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 py-2.5 px-4 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        Application Submitted
                      </div>
                    ) : !isEligible ? (
                      <div className="w-full bg-rose-500/5 text-rose-400 border border-rose-500/10 py-2 px-3 rounded-lg text-[11px] font-medium flex items-start gap-1.5 leading-normal">
                        <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>
                          {!meetsScore && `AlphaScore ${opp.min_score} required (you have ${stats.alphaScore}).`}
                          {meetsScore && !meetsDrawdown && `Drawdown limit ${opp.max_drawdown}% exceeded.`}
                        </span>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedOpp(opp)}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 px-4 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-blue-500/10 cursor-pointer"
                      >
                        Apply for Funding
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right 1 Column: Platform Stats & Help */}
        <div className="space-y-6">
          {/* Marketplace Stats */}
          <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800/80 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-base font-bold flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-500" />
              Your Status Summary
            </h3>
            
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-semibold">Active AlphaScore:</span>
                <span className="font-mono font-bold text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">{stats.alphaScore} / 100</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-semibold">Max Account Drawdown:</span>
                <span className="font-mono font-bold text-rose-500">{stats.maxDrawdown}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-semibold">Track Record Length:</span>
                <span className="font-bold">2 Months (Simulated)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 font-semibold">Submitted Applications:</span>
                <span className="font-mono font-bold text-zinc-400">{(appliedOppIds || []).length}</span>
              </div>
            </div>
          </div>

          {/* Secure Allocation Warning */}
          <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800/80 rounded-xl p-5 shadow-sm space-y-3">
            <h4 className="text-sm font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              How Verification Protects You
            </h4>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Investors allocate capital pools using contracts integrated directly with AlphaScore API dashboards. When a deal is signed, performance is tracked via read-only channels to verify compliance with drawdown parameters and safety limits.
            </p>
          </div>
        </div>
      </div>

      {/* Application Pitch Modal */}
      {selectedOpp && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0c0c0f] rounded-xl border border-zinc-200 dark:border-zinc-800 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold">Apply to {selectedOpp.investor}</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Pitch your trading experience and style to the allocating team.</p>
              </div>
              <button 
                onClick={() => setSelectedOpp(null)}
                className="text-zinc-500 hover:text-zinc-200 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 bg-zinc-50 dark:bg-zinc-900/60 p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Allocation Goal:</span>
                <span className="font-bold text-emerald-500">{formatCurrency(selectedOpp.budget)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Required AlphaScore:</span>
                <span className="font-bold font-mono text-blue-500">{selectedOpp.min_score}+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Required Drawdown:</span>
                <span className="font-bold font-mono text-rose-500">Under {selectedOpp.max_drawdown}%</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-zinc-500">Why should we allocate capital to you? (Optional)</label>
              <textarea
                value={pitch}
                onChange={(e) => setPitch(e.target.value)}
                placeholder="Brief description of your risk management structure, trading setup, and target growth returns..."
                className="w-full bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-zinc-950 dark:text-zinc-100"
                rows={4}
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setSelectedOpp(null)}
                className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApply(selectedOpp.id)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium shadow-md shadow-blue-500/10 cursor-pointer"
              >
                Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
