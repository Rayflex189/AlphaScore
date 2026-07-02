import React from 'react';
import { Bell, Info, Award, MessageSquare, ShieldCheck, X, Sparkles } from 'lucide-react';

export default function NotificationsView({ notifications, onClearNotification, onClearAll }) {
  
  const getIcon = (type) => {
    switch (type) {
      case 'funding': return <Award className="w-5 h-5 text-emerald-500" />;
      case 'message': return <MessageSquare className="w-5 h-5 text-blue-500" />;
      case 'challenge': return <Sparkles className="w-5 h-5 text-purple-400" />;
      case 'score': return <Award className="w-5 h-5 text-amber-500" />;
      default: return <Info className="w-5 h-5 text-zinc-400" />;
    }
  };

  const getBg = (type) => {
    switch (type) {
      case 'funding': return 'bg-emerald-500/5 border-emerald-500/10 hover:border-emerald-500/20';
      case 'message': return 'bg-blue-500/5 border-blue-500/10 hover:border-blue-500/20';
      case 'challenge': return 'bg-purple-500/5 border-purple-500/10 hover:border-purple-500/20';
      case 'score': return 'bg-amber-500/5 border-amber-500/10 hover:border-amber-500/20';
      default: return 'bg-zinc-500/5 border-zinc-500/10 hover:border-zinc-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            System Notifications
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Stay updated with investment requests, profile statistics, and challenge milestones.
          </p>
        </div>
        {notifications.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs font-semibold text-zinc-500 hover:text-zinc-200 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-1.5 transition-colors cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Notifications list */}
      <div className="max-w-2xl space-y-3">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            className={`border rounded-xl p-4 flex justify-between items-start gap-4 transition-all shadow-sm ${getBg(notif.type)}`}
          >
            <div className="flex gap-3.5">
              <span className="p-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shrink-0">
                {getIcon(notif.type)}
              </span>
              <div className="space-y-1">
                <p className="font-bold text-sm text-zinc-900 dark:text-zinc-50 leading-snug">
                  {notif.title}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-normal">
                  {notif.message}
                </p>
                <span className="block text-[10px] text-zinc-500 font-mono pt-1">
                  {notif.time || 'Just now'}
                </span>
              </div>
            </div>

            <button
              onClick={() => onClearNotification(notif.id)}
              className="text-zinc-500 hover:text-rose-500 p-1 rounded-md transition-colors"
              title="Remove notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-10 text-center text-zinc-500 space-y-2 flex flex-col items-center justify-center">
            <Bell className="w-8 h-8 text-zinc-400" />
            <p className="font-bold">All caught up!</p>
            <p className="text-xs text-zinc-500">You have no new system notifications at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
}
