import React, { useState } from 'react';
import { Briefcase, DollarSign, Award, ArrowRight, ShieldCheck, Plus, Sparkles, Activity } from 'lucide-react';

export default function InvestorPoolsView({ opportunities, onPostOpportunity }) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [type, setType] = useState('Swing Traders');
  const [budget, setBudget] = useState('500000');
  const [minScore, setMinScore] = useState('85');
  const [maxDrawdown, setMaxDrawdown] = useState('5.0');
  const [minTrackRecord, setMinTrackRecord] = useState('12 Months');
  const [riskProfile, setRiskProfile] = useState('Low');
  const [description, setDescription] = useState('');
  
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) return;

    onPostOpportunity({
      type,
      budget,
      minScore,
      maxDrawdown,
      minTrackRecord,
      riskProfile,
      description
    });

    setShowCreateForm(false);
    setDescription('');
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            My Funding Pools
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Manage your active capital allocations and post new funding contracts.
          </p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Create Pool
        </button>
      </div>

      {/* Main Grid: Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Opportunities List */}
        <div className="lg:col-span-2 space-y-4">
          {opportunities.map((opp) => (
            <div 
              key={opp.id}
              className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800/80 rounded-xl p-6 shadow-sm flex flex-col md:flex-row justify-between gap-6"
            >
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

              <div className="flex flex-col justify-center items-start md:items-end w-full md:w-48 border-t md:border-t-0 border-zinc-100 dark:border-zinc-800/80 pt-4 md:pt-0">
                <div className="md:text-right">
                  <span className="text-xs text-zinc-500 uppercase tracking-wider font-semibold block">Total Capital</span>
                  <span className="text-2xl font-bold font-mono text-emerald-500">
                    {formatCurrency(opp.budget)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {opportunities.length === 0 && (
            <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-10 text-center text-zinc-500">
              <Briefcase className="w-10 h-10 mx-auto text-zinc-400 mb-3" />
              <p className="font-bold">No active funding pools</p>
              <p className="text-xs mt-1">Click "Create Pool" to post your first capital allocation opportunity.</p>
            </div>
          )}
        </div>

        {/* Right Column: Allocation Guide */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800/80 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-base font-bold flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              Allocator Statistics
            </h3>
            <div className="space-y-3.5 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Active Pools:</span>
                <span className="font-bold">{opportunities.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Total Allocated:</span>
                <span className="font-bold text-emerald-500">
                  {formatCurrency(opportunities.reduce((sum, o) => sum + parseFloat(o.budget), 0))}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Post Opportunity Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0c0c0f] rounded-xl border border-zinc-200 dark:border-zinc-800 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold">Post New Funding Pool</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Define your allocation targets and safety parameters.</p>
              </div>
              <button 
                onClick={() => setShowCreateForm(false)}
                className="text-zinc-500 hover:text-zinc-200 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-sm font-medium">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-zinc-500 mb-1.5">Target Style</label>
                  <select 
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-950 dark:text-zinc-100 focus:outline-none"
                  >
                    <option value="Swing Traders">Swing Traders</option>
                    <option value="Scalpers">Scalpers</option>
                    <option value="Day Traders">Day Traders</option>
                    <option value="Crypto Traders">Crypto Traders</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-zinc-500 mb-1.5">Capital Budget ($)</label>
                  <input 
                    type="number" 
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-950 dark:text-zinc-100 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-zinc-500 mb-1.5">Min AlphaScore</label>
                  <input 
                    type="number" 
                    value={minScore}
                    onChange={(e) => setMinScore(e.target.value)}
                    className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-950 dark:text-zinc-100 focus:outline-none"
                    min="0" max="100"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-zinc-500 mb-1.5">Max Drawdown Limit (%)</label>
                  <input 
                    type="text" 
                    value={maxDrawdown}
                    onChange={(e) => setMaxDrawdown(e.target.value)}
                    className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-950 dark:text-zinc-100 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-zinc-500 mb-1.5">Risk Profile</label>
                  <select 
                    value={riskProfile}
                    onChange={(e) => setRiskProfile(e.target.value)}
                    className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-950 dark:text-zinc-100 focus:outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-zinc-500 mb-1.5">Required Track Record</label>
                  <input 
                    type="text" 
                    value={minTrackRecord}
                    onChange={(e) => setMinTrackRecord(e.target.value)}
                    className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-950 dark:text-zinc-100 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-xs font-semibold text-zinc-500 mb-1.5">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your allocation objectives, payout ratios, or broker specifications..."
                  className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-950 dark:text-zinc-100 focus:outline-none"
                  rows={3}
                  required
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium shadow-md shadow-blue-500/10 cursor-pointer"
                >
                  Publish Pool
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
