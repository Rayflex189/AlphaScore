import React, { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { 
  TrendingUp, TrendingDown, DollarSign, Percent, Award, AlertTriangle, 
  Calendar, CheckCircle, Activity, ChevronRight, RefreshCw, Plus, ShieldCheck, HelpCircle
} from 'lucide-react';

export default function DashboardView({ trades, stats, onConnectAccount, isConnecting }) {
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [broker, setBroker] = useState('MT5');
  const [accountNum, setAccountNum] = useState('8042910');
  const [readOnlyPassword, setReadOnlyPassword] = useState('••••••••••••');
  
  // Format currency
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  // ECharts Equity Curve options
  const getEquityChartOptions = () => {
    const data = stats.equityCurve || [];
    const xData = data.map(d => d.time);
    const yData = data.map(d => d.value);

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          const p = params[0];
          return `<div class="bg-zinc-900 border border-zinc-800 text-zinc-100 p-2 rounded-lg text-xs font-mono">
            Date: ${p.name}<br/>
            Equity: <span class="text-emerald-400 font-semibold">${formatCurrency(p.value)}</span>
          </div>`;
        },
      },
      grid: {
        left: '2%',
        right: '4%',
        bottom: '3%',
        top: '10%',
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        data: xData,
        boundaryGap: false,
        axisLine: { lineStyle: { color: '#3f3f46' } },
        axisLabel: { color: '#a1a1aa', fontFamily: 'JetBrains Mono', fontSize: 10 },
        splitLine: { show: false },
      },
      yAxis: {
        type: 'value',
        min: 'dataMin',
        axisLine: { show: false },
        axisLabel: { 
          color: '#a1a1aa', 
          fontFamily: 'JetBrains Mono', 
          fontSize: 10,
          formatter: (val) => `$${(val / 1000)}k`
        },
        splitLine: { lineStyle: { color: '#1e1e24' } },
      },
      series: [
        {
          data: yData,
          type: 'line',
          smooth: true,
          showSymbol: false,
          lineStyle: { color: '#3b82f6', width: 3 },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(59, 130, 246, 0.25)' },
                { offset: 1, color: 'rgba(59, 130, 246, 0.00)' }
              ]
            }
          }
        }
      ]
    };
  };

  const handleConnectSubmit = (e) => {
    e.preventDefault();
    onConnectAccount(broker, accountNum);
    setShowConnectModal(false);
  };

  // Get score healthiness colors
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-emerald-500';
    if (score >= 80) return 'text-blue-500';
    if (score >= 70) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getScoreBg = (score) => {
    if (score >= 90) return 'bg-emerald-500/10 border-emerald-500/20';
    if (score >= 80) return 'bg-blue-500/10 border-blue-500/20';
    if (score >= 70) return 'bg-amber-500/10 border-amber-500/20';
    return 'bg-rose-500/10 border-rose-500/20';
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Summary */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Trader Dashboard
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Real-time analytics and verified status of your linked accounts.
          </p>
        </div>
        <button
          onClick={() => setShowConnectModal(true)}
          disabled={isConnecting}
          className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 cursor-pointer disabled:opacity-50"
        >
          {isConnecting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Syncing Terminal...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Connect Account
            </>
          )}
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* KPI 1: Balance */}
        <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800/80 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Account Equity</p>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500"><DollarSign className="w-4 h-4" /></div>
          </div>
          <h3 className="text-2xl font-bold mt-2 font-mono">{formatCurrency(trades.reduce((a, b) => a + b.profit, 100000))}</h3>
          <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-500">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+5.4% this month</span>
          </div>
        </div>

        {/* KPI 2: Win Rate */}
        <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800/80 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Win Rate</p>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500"><Percent className="w-4 h-4" /></div>
          </div>
          <h3 className="text-2xl font-bold mt-2 font-mono">{stats.winRate}%</h3>
          <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-500">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Highly consistent</span>
          </div>
        </div>

        {/* KPI 3: Profit Factor */}
        <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800/80 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Profit Factor</p>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-500"><Activity className="w-4 h-4" /></div>
          </div>
          <h3 className="text-2xl font-bold mt-2 font-mono">{stats.profitFactor}</h3>
          <div className="flex items-center gap-1 mt-2 text-xs font-medium text-zinc-400">
            <span>&gt; 2.0 is institutional grade</span>
          </div>
        </div>

        {/* KPI 4: Drawdown */}
        <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800/80 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Max Drawdown</p>
            <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-500"><TrendingDown className="w-4 h-4" /></div>
          </div>
          <h3 className="text-2xl font-bold mt-2 font-mono">{stats.maxDrawdown}%</h3>
          <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-500">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Well within limits (&lt;5%)</span>
          </div>
        </div>

        {/* KPI 5: Sharpe Ratio */}
        <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800/80 rounded-xl p-5 shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">Sharpe Ratio</p>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-500"><Award className="w-4 h-4" /></div>
          </div>
          <h3 className="text-2xl font-bold mt-2 font-mono">{stats.sharpeRatio}</h3>
          <div className="flex items-center gap-1 mt-2 text-xs font-medium text-emerald-500">
            <span>Excellent risk adjusted</span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Equity & History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Equity Chart */}
          <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800/80 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" />
                Verified Growth Curve
              </h2>
              <span className="text-xs font-mono text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-md">
                Live Feed
              </span>
            </div>
            <div className="h-[300px]">
              <ReactECharts option={getEquityChartOptions()} style={{ height: '100%', width: '100%' }} />
            </div>
          </div>

          {/* Trade History Table */}
          <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800/80 rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center">
              <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-500" />
                Recent Verified Trades
              </h2>
              <span className="text-xs font-semibold text-zinc-500">
                Showing last 8 trades
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400 text-xs font-semibold uppercase border-b border-zinc-200 dark:border-zinc-800">
                    <th className="px-6 py-3.5">Ticket</th>
                    <th className="px-6 py-3.5">Symbol</th>
                    <th className="px-6 py-3.5">Type</th>
                    <th className="px-6 py-3.5">Lots</th>
                    <th className="px-6 py-3.5">Close Time</th>
                    <th className="px-6 py-3.5 text-right">Profit ($)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/80 text-sm">
                  {trades.slice(0, 8).map((trade) => (
                    <tr key={trade.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-900/30 transition-colors">
                      <td className="px-6 py-4 font-mono text-zinc-400">{trade.id}</td>
                      <td className="px-6 py-4 font-bold">{trade.symbol}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          trade.type === 'buy' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-400'
                        }`}>
                          {trade.type.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono">{trade.lots}</td>
                      <td className="px-6 py-4 text-zinc-500 dark:text-zinc-400">
                        {new Date(trade.closeTime).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className={`px-6 py-4 text-right font-bold ${
                        trade.profit >= 0 ? 'text-emerald-500' : 'text-rose-500'
                      }`}>
                        {trade.profit >= 0 ? `+${formatCurrency(trade.profit)}` : `-${formatCurrency(Math.abs(trade.profit))}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1 Column: AlphaScore breakdown & Connect */}
        <div className="space-y-6">
          {/* AlphaScore Meter */}
          <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800/80 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2 mb-6 self-start w-full">
              <Award className="w-4 h-4 text-blue-500" />
              AlphaScore Reputation
            </h2>

            {/* Circular Dial Visual */}
            <div className="relative w-44 h-44 flex items-center justify-center rounded-full border-8 border-zinc-100 dark:border-zinc-900 shadow-inner">
              {/* Outer stroke glow based on score quality */}
              <div className="absolute inset-0 rounded-full border-8 border-blue-500 opacity-20 animate-pulse"></div>
              
              <div className="text-center">
                <span className={`text-5xl font-extrabold tracking-tighter ${getScoreColor(stats.alphaScore)}`}>
                  {stats.alphaScore}
                </span>
                <p className="text-xs font-semibold text-zinc-500 mt-1">Overall / 100</p>
              </div>
            </div>

            {/* verified badge status */}
            <div className="mt-4 flex items-center gap-1.5 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1 rounded-full text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified Trader Badge Active
            </div>

            {/* Score components list */}
            <div className="w-full mt-6 space-y-3.5 border-t border-zinc-200 dark:border-zinc-800 pt-5 text-sm">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Consistency (30%)
                </div>
                <span className="font-bold">{stats.components.consistency}/100</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  Risk Management (25%)
                </div>
                <span className="font-bold">{stats.components.riskManagement}/100</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Profitability (20%)
                </div>
                <span className="font-bold">{stats.components.profitability}/100</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Drawdown Control (15%)
                </div>
                <span className="font-bold">{stats.components.drawdown}/100</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  Longevity (10%)
                </div>
                <span className="font-bold">{stats.components.longevity}/100</span>
              </div>
            </div>
          </div>

          {/* Connected Brokers Card */}
          <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800/80 rounded-xl p-5 shadow-sm">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2 mb-4">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Connected Brokers
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/60 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <div>
                  <p className="font-bold text-sm">cTrader - Live Terminal</p>
                  <p className="text-xs text-zinc-500">ID: 8042910 | OctaFX</p>
                </div>
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
              </div>

              <div className="flex justify-between items-center bg-zinc-50 dark:bg-zinc-900/60 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 opacity-60">
                <div>
                  <p className="font-bold text-sm">MT4 - Archive</p>
                  <p className="text-xs text-zinc-500">ID: 290145 | IC Markets</p>
                </div>
                <span className="text-xs bg-zinc-200 dark:bg-zinc-800 text-zinc-500 px-2 py-0.5 rounded">
                  Closed
                </span>
              </div>
            </div>

            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-4 leading-relaxed flex gap-1.5 items-start">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>Read-only credentials are secured. AlphaScore will never request execution permissions.</span>
            </p>
          </div>
        </div>
      </div>

      {/* Account Connection Modal */}
      {showConnectModal && (
        <div className="fixed inset-0 bg-zinc-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0c0c0f] rounded-xl border border-zinc-200 dark:border-zinc-800 max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-bold">Connect Broker Account</h3>
                <p className="text-xs text-zinc-500 mt-0.5">Link your account to compute reputation analytics.</p>
              </div>
              <button 
                onClick={() => setShowConnectModal(false)}
                className="text-zinc-400 hover:text-zinc-200 font-bold"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleConnectSubmit} className="space-y-4 text-sm">
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-zinc-500 mb-1.5">Select Terminal</label>
                <div className="grid grid-cols-3 gap-2">
                  {['MT4', 'MT5', 'cTrader'].map(item => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setBroker(item)}
                      className={`py-2 px-3 rounded-lg border font-medium transition-all ${
                        broker === item 
                          ? 'border-blue-500 bg-blue-500/10 text-blue-500' 
                          : 'border-zinc-200 dark:border-zinc-800 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-900 text-zinc-500'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1.5">Login ID / Account Number</label>
                <input 
                  type="text" 
                  value={accountNum} 
                  onChange={(e) => setAccountNum(e.target.value)}
                  className="w-full bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-zinc-950 dark:text-zinc-100"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-500 mb-1.5 flex justify-between">
                  <span>Investor Password (Read-Only)</span>
                  <span className="text-[10px] text-emerald-500 flex items-center gap-0.5"><ShieldCheck className="w-3 h-3" /> Securable API</span>
                </label>
                <input 
                  type="password" 
                  value={readOnlyPassword}
                  onChange={(e) => setReadOnlyPassword(e.target.value)}
                  className="w-full bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-zinc-950 dark:text-zinc-100"
                  required
                />
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 text-blue-500 p-3 rounded-lg flex gap-2">
                <HelpCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-xs leading-relaxed">
                  <strong>Why investor password?</strong> An investor password gives AlphaScore view-only access. The software parses statistics but cannot place, alter, or close trades.
                </p>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowConnectModal(false)}
                  className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-300 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium shadow-md shadow-blue-500/10 cursor-pointer"
                >
                  Sync Terminal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
