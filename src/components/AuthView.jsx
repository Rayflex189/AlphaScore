import React, { useState } from 'react';
import { ShieldCheck, User, Mail, Lock, Globe, Briefcase, Activity, RefreshCw, Award } from 'lucide-react';

export default function AuthView({ initialMode, onAuthSuccess, onNavigateToLanding }) {
  const [mode, setMode] = useState(initialMode || 'login'); // 'login' | 'register'
  
  // Login fields
  const [email, setEmail] = useState('isaiah@alphascore.com');
  const [password, setPassword] = useState('password123');
  
  // Registration fields
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [role, setRole] = useState('trader'); // 'trader' | 'investor'
  const [country, setCountry] = useState('Nigeria');
  const [experience, setExperience] = useState('5 Years');
  const [style, setStyle] = useState('Swing Trader');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const endpoint = mode === 'login' ? 'login/' : 'register/';
      const payload = mode === 'login' 
        ? { email, password } 
        : { 
            username: registerName, 
            email: registerEmail, 
            password: registerPassword,
            role,
            country,
            experience,
            style
          };

      // Call Backend API
      const response = await fetch(`http://localhost:8000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.detail || 'Authentication failed. Please verify credentials.');
      }

      // Save token to localStorage
      localStorage.setItem('alphascore_access_token', data.access);
      localStorage.setItem('alphascore_refresh_token', data.refresh);
      localStorage.setItem('alphascore_user', JSON.stringify(data.user || { 
        name: mode === 'login' ? 'Isaiah Rory' : registerName,
        role: data.user?.role || role
      }));
      
      onAuthSuccess(data);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Connecting to backend API failed. Ensure Django server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-[#09090b] text-zinc-950 dark:text-zinc-50 flex flex-col justify-center items-center p-4 relative font-sans">
      {/* Background blur effects */}
      <div className="absolute top-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none"></div>

      {/* Brand logo at top */}
      <div 
        onClick={onNavigateToLanding}
        className="flex items-center gap-2 mb-6 cursor-pointer hover:opacity-80"
      >
        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
          A
        </div>
        <div>
          <h1 className="font-extrabold text-base tracking-tight leading-none">AlphaScore</h1>
          <p className="text-[10px] text-zinc-500 font-semibold leading-none mt-1">Reputation Platform</p>
        </div>
      </div>

      {/* Auth Card */}
      <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800/80 rounded-2xl w-full max-w-md p-6 md:p-8 shadow-xl space-y-6">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">
            {mode === 'login' ? 'Access your verified reputation board.' : 'Start building your trading credit.'}
          </p>
        </div>

        {/* Role Toggle Selector (Only on registration) */}
        {mode === 'register' && (
          <div className="bg-zinc-100 dark:bg-zinc-900/60 p-1 rounded-xl grid grid-cols-2 text-xs font-semibold text-zinc-500 select-none">
            <button
              type="button"
              onClick={() => setRole('trader')}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                role === 'trader' 
                  ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'hover:text-zinc-800 dark:hover:text-zinc-300'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              I am a Trader
            </button>
            <button
              type="button"
              onClick={() => setRole('investor')}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                role === 'investor' 
                  ? 'bg-white dark:bg-zinc-800 text-blue-600 dark:text-blue-400 shadow-sm' 
                  : 'hover:text-zinc-800 dark:hover:text-zinc-300'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5" />
              I am an Allocator
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-lg text-xs leading-relaxed font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm font-medium">
          {mode === 'register' && (
            <div>
              <label className="text-xs font-semibold text-zinc-500 mb-1.5 block">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4.5 w-4.5 text-zinc-400" />
                <input 
                  type="text" 
                  placeholder="isaiah_rory"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  className="w-full bg-zinc-50 dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-zinc-950 dark:text-zinc-100"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-zinc-500 mb-1.5 block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4.5 w-4.5 text-zinc-400" />
              <input 
                type="email" 
                placeholder="isaiah@alphascore.com"
                value={mode === 'login' ? email : registerEmail}
                onChange={(e) => mode === 'login' ? setEmail(e.target.value) : setRegisterEmail(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-zinc-950 dark:text-zinc-100"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-500 mb-1.5 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4.5 w-4.5 text-zinc-400" />
              <input 
                type="password" 
                placeholder="••••••••••••"
                value={mode === 'login' ? password : registerPassword}
                onChange={(e) => mode === 'login' ? setPassword(e.target.value) : setRegisterPassword(e.target.value)}
                className="w-full bg-zinc-50 dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-zinc-950 dark:text-zinc-100"
                required
              />
            </div>
          </div>

          {mode === 'register' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-zinc-500 mb-1.5 block">Country</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-2.5 h-4.5 w-4.5 text-zinc-400" />
                  <input 
                    type="text" 
                    placeholder="Nigeria"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-zinc-50 dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-zinc-950 dark:text-zinc-100"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-500 mb-1.5 block">
                  {role === 'trader' ? 'Trading Style' : 'Firm Type'}
                </label>
                <div className="relative">
                  <Activity className="absolute left-3 top-2.5 h-4.5 w-4.5 text-zinc-400" />
                  {role === 'trader' ? (
                    <select 
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm text-zinc-950 dark:text-zinc-100 focus:outline-none"
                    >
                      <option value="Swing Trader">Swing Trader</option>
                      <option value="Scalper">Scalper</option>
                      <option value="Day Trader">Day Trader</option>
                      <option value="Crypto Trader">Crypto Trader</option>
                    </select>
                  ) : (
                    <select 
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                      className="w-full bg-zinc-50 dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-sm text-zinc-950 dark:text-zinc-100 focus:outline-none"
                    >
                      <option value="Prop Firm">Prop Firm</option>
                      <option value="Private Investor">Private Investor</option>
                      <option value="Venture Capital">Venture Capital</option>
                      <option value="Hedge Fund">Hedge Fund</option>
                    </select>
                  )}
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-lg transition-colors font-semibold shadow-md shadow-blue-500/10 flex justify-center items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Processing...
              </>
            ) : (
              mode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div className="text-center text-xs text-zinc-500 border-t border-zinc-200 dark:border-zinc-800/80 pt-4">
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button 
                onClick={() => setMode('register')} 
                className="text-blue-500 font-semibold hover:underline bg-transparent border-none cursor-pointer p-0"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button 
                onClick={() => setMode('login')} 
                className="text-blue-500 font-semibold hover:underline bg-transparent border-none cursor-pointer p-0"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
