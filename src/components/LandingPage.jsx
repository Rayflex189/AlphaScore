import React from 'react';
import { 
  ShieldCheck, Activity, Award, Briefcase, Sparkles, TrendingUp, 
  ArrowRight, Shield, Zap, ChevronRight, CheckCircle2, MessageSquare
} from 'lucide-react';

export default function LandingPage({ onNavigate, stats }) {
  // Simple mini-leaderboard for showcase
  const featuresList = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-500" />,
      title: 'Green Verified Badge',
      desc: 'No fake screenshots or edited statements. Data is streamed directly via read-only APIs from brokers.'
    },
    {
      icon: <Activity className="w-6 h-6 text-blue-500" />,
      title: 'Dynamic Statistics Engine',
      desc: 'Calculates Win Rate, Profit Factor, Max Drawdown, and Sharpe Ratio automatically in real-time.'
    },
    {
      icon: <Award className="w-6 h-6 text-purple-500" />,
      title: 'AlphaScore Algorithm',
      desc: 'A standardized credit score for traders based on Consistency, Risk Management, and Longevity.'
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-950 dark:text-zinc-50 font-sans transition-colors duration-200">
      
      {/* Marketing Navbar */}
      <nav className="h-16 border-b border-zinc-200 dark:border-zinc-800/80 bg-white/70 dark:bg-[#0c0c0f]/70 backdrop-blur-md sticky top-0 z-50 px-6 max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/20">
            A
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-tight">AlphaScore</h1>
            <p className="text-[9px] text-zinc-500 font-semibold leading-none">Trader Reputation Network</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => onNavigate('auth', { mode: 'login' })}
            className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 px-3 py-1.5 transition-colors cursor-pointer"
          >
            Sign In
          </button>
          <button 
            onClick={() => onNavigate('auth', { mode: 'register' })}
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm px-4 py-2 rounded-lg transition-all shadow-md shadow-blue-500/10 cursor-pointer"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20 max-w-5xl mx-auto text-center space-y-8 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-20 left-1/3 w-60 h-60 bg-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <span className="inline-flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-500 dark:text-blue-400 px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          The LinkedIn + credit score for forex traders
        </span>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1] text-zinc-900 dark:text-zinc-50">
          Build a Verifiable <br />
          <span className="text-blue-600 dark:text-blue-500">Trading Reputation</span>
        </h1>

        <p className="text-zinc-500 dark:text-zinc-400 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Connect your cTrader, MT4, or MT5 accounts. Securely audit your performance, compute your dynamic AlphaScore, and get discovered by global prop firms and allocators.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <button
            onClick={() => onNavigate('auth', { mode: 'register' })}
            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 cursor-pointer"
          >
            Create Your Profile
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href="#how-it-works"
            className="border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900/60 font-semibold py-3 px-6 rounded-lg text-sm transition-all cursor-pointer"
          >
            How it Works
          </a>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="px-6 py-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuresList.map((f, i) => (
            <div key={i} className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800/80 rounded-2xl p-6 shadow-sm">
              <div className="p-2.5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl w-fit">
                {f.icon}
              </div>
              <h3 className="font-bold text-lg mt-4 text-zinc-900 dark:text-zinc-50">{f.title}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Real-time Connector Specs (addresses User request) */}
      <section id="how-it-works" className="px-6 py-20 max-w-7xl mx-auto border-t border-zinc-200 dark:border-zinc-800/60 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight">How It Works for Each Platform</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-xl mx-auto">
            AlphaScore integrates using read-only API connectors. We never request or store your master passwords, ensuring your funds stay 100% safe.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* MT4/MT5 Card */}
          <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs bg-blue-500/10 text-blue-500 border border-blue-500/20 px-2.5 py-1 rounded-full font-bold">
                  MetaTrader 4 & 5
                </span>
                <span className="text-[10px] text-zinc-400 font-semibold font-mono">Read-Only Investor Password</span>
              </div>
              <h3 className="text-xl font-bold">MT4 / MT5 Integration</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                When you share your read-only investor password and broker server credentials, AlphaScore connects directly to sync transactions.
              </p>
              
              <div className="bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl space-y-2 text-xs font-mono">
                <div className="flex justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                  <span className="text-zinc-400">Connection Engine:</span>
                  <span className="font-bold text-zinc-100">Python MetaTrader5</span>
                </div>
                <div className="flex justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                  <span className="text-zinc-400">Streaming Feed:</span>
                  <span className="font-bold text-emerald-400">WebSocket Updates</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Execution Safety:</span>
                  <span className="font-bold text-emerald-400">Blocked (Read-Only)</span>
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-100 dark:border-zinc-900/60 pt-4 flex gap-4 text-xs font-medium text-zinc-500">
              <div className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Account Stats</div>
              <div className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Position Tracking</div>
              <div className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Historical Audit</div>
            </div>
          </div>

          {/* cTrader Card */}
          <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs bg-purple-500/10 text-purple-500 border border-purple-500/20 px-2.5 py-1 rounded-full font-bold">
                  cTrader API
                </span>
                <span className="text-[10px] text-zinc-400 font-semibold font-mono">Protobuf + RabbitMQ Streams</span>
              </div>
              <h3 className="text-xl font-bold">cTrader Open API</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Connects directly via cTrader Open API (JSON/Protobuf WebSocket) and Reporting API. Streams position adjustments and order deals.
              </p>

              <div className="bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl space-y-2 text-xs font-mono">
                <div className="flex justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                  <span className="text-zinc-400">Connection Engine:</span>
                  <span className="font-bold text-zinc-100">JSON/Protobuf WS</span>
                </div>
                <div className="flex justify-between border-b border-zinc-200 dark:border-zinc-800 pb-2">
                  <span className="text-zinc-400">Streaming Feed:</span>
                  <span className="font-bold text-emerald-400">RabbitMQ Event Stream</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">Authorization:</span>
                  <span className="font-bold text-emerald-400">OAuth / Whitelisted IP</span>
                </div>
              </div>
            </div>

            <div className="border-t border-zinc-100 dark:border-zinc-900/60 pt-4 flex gap-4 text-xs font-medium text-zinc-500">
              <div className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Protobuf WebSockets</div>
              <div className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> IP Whitelists</div>
              <div className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Event Streams</div>
            </div>
          </div>
        </div>
      </section>

      {/* AlphaScore Formula Explanation */}
      <section className="px-6 py-20 bg-zinc-100 dark:bg-zinc-900/20 border-t border-b border-zinc-200 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2.5 py-0.5 rounded-full text-xs font-semibold">
              <Award className="w-3.5 h-3.5" /> Platform Standard
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">The AlphaScore Algorithm</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Instead of raw growth which favors reckless risk, AlphaScore computes reputation score dynamically weighting multiple discipline vectors:
            </p>
            
            <div className="space-y-3.5 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500 font-semibold">Consistency (30% weight)</span>
                <span className="font-bold text-blue-500">Stable lot sizes & profits</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 font-semibold">Risk Management (25% weight)</span>
                <span className="font-bold text-blue-500">Stop loss compliance & low daily risk</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 font-semibold">Profitability (20% weight)</span>
                <span className="font-bold text-blue-500">Win Rate & Profit Factor</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 font-semibold">Drawdown (15% weight)</span>
                <span className="font-bold text-blue-500">Maximum drawdown limits</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 font-semibold">Longevity (10% weight)</span>
                <span className="font-bold text-blue-500">Track record duration</span>
              </div>
            </div>
          </div>

          {/* Visual representations dials */}
          <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-lg flex flex-col items-center justify-center relative overflow-hidden">
            <h3 className="text-base font-bold mb-6 self-start flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" />
              Reputation Dial
            </h3>
            
            <div className="relative w-48 h-48 flex items-center justify-center rounded-full border-[10px] border-zinc-100 dark:border-zinc-900 shadow-inner">
              <div className="absolute inset-0 rounded-full border-[10px] border-blue-500 opacity-25 animate-pulse"></div>
              <div className="text-center">
                <span className="text-5xl font-extrabold text-blue-500">91</span>
                <p className="text-xs font-semibold text-zinc-500 mt-1">Excellent Score</p>
              </div>
            </div>
            
            <div className="mt-6 flex items-center gap-1 text-emerald-500 text-xs font-bold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              Prop-Firm Grade Verified
            </div>
          </div>

        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-20 text-center space-y-6 px-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold tracking-tight">Ready to Get Funded?</h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm max-w-lg mx-auto leading-relaxed">
          Join skilled traders and build a reputation institutional allocators trust. Secure read-only API connectors sync stats in under two minutes.
        </p>
        <button 
          onClick={() => onNavigate('auth', { mode: 'register' })}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg text-sm inline-flex items-center gap-2 transition-all shadow-lg shadow-blue-500/25 cursor-pointer"
        >
          Create Free Account
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>

      {/* Footer copyright */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800/80 py-8 px-6 max-w-7xl mx-auto flex justify-between items-center text-xs text-zinc-500">
        <p>© 2026 AlphaScore. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-zinc-200">Privacy Policy</a>
          <a href="#" className="hover:text-zinc-200">Terms of Service</a>
        </div>
      </footer>

    </div>
  );
}
