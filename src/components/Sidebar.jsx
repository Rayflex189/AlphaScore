import React from 'react';
import { 
  LayoutDashboard, User, Trophy, Briefcase, Award, MessageSquare, 
  Bell, LogOut, ShieldCheck, ClipboardList
} from 'lucide-react';

export default function Sidebar({ activeView, onViewChange, stats, profile, unreadMessages, unreadNotifications, onLogout }) {
  
  const isTrader = profile.role !== 'investor';

  // Dynamic Navigation menu items based on role
  const menuItems = isTrader ? [
    { id: 'dashboard', name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'profile', name: 'Trader Profile', icon: <User className="w-5 h-5" /> },
    { id: 'leaderboard', name: 'Leaderboard', icon: <Trophy className="w-5 h-5" /> },
    { id: 'marketplace', name: 'Funding Marketplace', icon: <Briefcase className="w-5 h-5" /> },
    { id: 'proof-of-skill', name: 'Proof of Skill', icon: <Award className="w-5 h-5" /> },
    { id: 'messages', name: 'Messages', icon: <MessageSquare className="w-5 h-5" />, count: unreadMessages },
    { id: 'notifications', name: 'Notifications', icon: <Bell className="w-5 h-5" />, count: unreadNotifications }
  ] : [
    { id: 'leaderboard', name: 'Trader Feed', icon: <Trophy className="w-5 h-5" /> },
    { id: 'pools', name: 'Funding Pools', icon: <Briefcase className="w-5 h-5" /> },
    { id: 'applications', name: 'Applications Review', icon: <ClipboardList className="w-5 h-5" />, count: unreadNotifications },
    { id: 'messages', name: 'Messages', icon: <MessageSquare className="w-5 h-5" />, count: unreadMessages }
  ];

  return (
    <aside className="w-64 bg-white dark:bg-[#0c0c0f] border-r border-zinc-200 dark:border-zinc-800/80 flex flex-col justify-between h-screen shrink-0 sticky top-0">
      <div className="space-y-6">
        {/* Brand Logo Header */}
        <div className="h-16 flex items-center gap-2.5 px-6 border-b border-zinc-100 dark:border-zinc-900/60">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/20">
            A
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-tight">AlphaScore</h1>
            <p className="text-[10px] text-zinc-500 font-semibold leading-none">
              {isTrader ? 'Trader reputation Board' : 'Capital Allocation Feed'}
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-3 space-y-1.5">
          {menuItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all group cursor-pointer ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10' 
                    : 'text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 hover:bg-zinc-100 dark:hover:bg-zinc-900/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${isActive ? 'text-white' : 'text-zinc-400 group-hover:text-blue-500'}`}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                </div>

                {item.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mini Profile Info Card Footer & Logout */}
      <div className="p-4 border-t border-zinc-100 dark:border-zinc-900/60 space-y-3.5">
        
        <div className="flex items-center gap-3 bg-zinc-50 dark:bg-zinc-900/30 p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
          <div className="w-9 h-9 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 flex items-center justify-center font-bold text-sm uppercase shrink-0">
            {profile.name ? profile.name[0] : 'U'}
          </div>
          <div className="truncate flex-1 min-w-0">
            <h4 className="font-bold text-xs truncate flex items-center gap-1">
              {profile.name}
              {profile.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />}
            </h4>
            <p className="text-[10px] text-zinc-500 font-semibold truncate mt-0.5 capitalize">
              {profile.role === 'investor' ? 'Investor' : `AlphaScore: ${stats.alphaScore}`}
            </p>
          </div>
        </div>

        {/* Log Out Button */}
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-rose-500 hover:bg-rose-500/5 transition-all cursor-pointer"
        >
          <LogOut className="w-5 h-5 text-rose-500" />
          <span>Sign Out</span>
        </button>

      </div>
    </aside>
  );
}
