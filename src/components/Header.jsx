import React from 'react';
import { Sun, Moon, Bell, ShieldCheck, Award } from 'lucide-react';

export default function Header({ theme, onThemeToggle, activeView, profile, stats, notifications, onViewChange }) {
  
  const getPageTitle = () => {
    switch (activeView) {
      case 'dashboard': return 'Dashboard';
      case 'profile': return 'Trader Profile';
      case 'leaderboard': return 'Leaderboard';
      case 'marketplace': return 'Funding Marketplace';
      case 'proof-of-skill': return 'Proof of Skill';
      case 'messages': return 'Messages';
      case 'notifications': return 'Notifications';
      case 'pools': return 'Funding Pools';
      case 'applications': return 'Applications Review';
      default: return 'AlphaScore';
    }
  };

  const unreadCount = notifications.length;
  const isTrader = profile.role !== 'investor';

  return (
    <header className="h-16 border-b border-zinc-200 dark:border-zinc-800/80 bg-white dark:bg-[#0c0c0f] flex justify-between items-center px-6 sticky top-0 z-40">
      
      {/* Page Context Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-semibold">
        <span className="text-zinc-500">AlphaScore</span>
        <span className="text-zinc-400">/</span>
        <span className="text-zinc-950 dark:text-zinc-50">{getPageTitle()}</span>
      </div>

      {/* Action Header controls */}
      <div className="flex items-center gap-4">
        
        {/* Verification Status Pill (Trader only) */}
        {isTrader && profile.isVerified && (
          <div className="hidden sm:flex items-center gap-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2.5 py-1 rounded-full text-[10px] font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>KYC & Broker Verified</span>
          </div>
        )}

        {/* Global score indicator pill (Trader only) */}
        {isTrader && (
          <div 
            onClick={() => onViewChange('dashboard')}
            className="flex items-center gap-1.5 bg-blue-500/10 hover:bg-blue-500/15 border border-blue-500/20 px-3 py-1 rounded-full text-[10px] font-bold text-blue-400 cursor-pointer transition-colors"
          >
            <Award className="w-3.5 h-3.5" />
            <span>Score: {stats.alphaScore}</span>
          </div>
        )}

        {/* Theme Toggle Button */}
        <button
          onClick={onThemeToggle}
          className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 cursor-pointer"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4.5 h-4.5" />
          ) : (
            <Moon className="w-4.5 h-4.5" />
          )}
        </button>

        {/* Notification Bell */}
        <button
          onClick={() => onViewChange('notifications')}
          className="p-2 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 relative cursor-pointer"
          title="System Notifications"
        >
          <Bell className="w-4.5 h-4.5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-blue-600 rounded-full ring-2 ring-white dark:ring-[#0c0c0f]"></span>
          )}
        </button>
      </div>

    </header>
  );
}
