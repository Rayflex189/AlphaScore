import React from 'react';
import { Award, FileText, Check, X, ShieldCheck, ArrowRight, User } from 'lucide-react';

export default function InvestorApplicationsView({ applications, onDecision }) {
  
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
          Applications Review
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Evaluate applications submitted by traders seeking capital.
          Review their verifiable AlphaScores and stop guidelines.
        </p>
      </div>

      {/* Main Grid: Listings */}
      <div className="max-w-4xl space-y-4">
        {applications.map((app) => {
          const isPending = app.status === 'applied';

          return (
            <div 
              key={app.id}
              className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800/80 rounded-xl p-5 shadow-sm space-y-4"
            >
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-100 dark:border-zinc-900/60 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                    <User className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-50">
                      Applicant: {app.username || 'Trader'}
                    </h3>
                    <p className="text-xs text-zinc-500 font-semibold">
                      Applied for: {app.type} ({formatCurrency(app.budget)})
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {new Date(app.applied_at).toLocaleDateString()}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold capitalize border ${
                    app.status === 'approved' 
                      ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                      : app.status === 'rejected'
                        ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                        : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'
                  }`}>
                    {app.status === 'applied' ? 'Pending Review' : app.status}
                  </span>
                </div>
              </div>

              {/* Pitch details */}
              <div className="bg-zinc-50 dark:bg-zinc-900/40 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 text-xs space-y-2">
                <div className="flex gap-2">
                  <FileText className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed text-zinc-600 dark:text-zinc-300 font-medium">
                    {app.pitch || "No written pitch provided by the applicant."}
                  </p>
                </div>
              </div>

              {/* Decision Actions */}
              {isPending && (
                <div className="flex gap-2 justify-end pt-1">
                  <button
                    onClick={() => onDecision(app.id, 'rejected')}
                    className="px-3.5 py-2 border border-zinc-200 dark:border-zinc-800 text-rose-500 rounded-lg text-xs font-bold hover:bg-rose-500/5 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    Decline
                  </button>
                  <button
                    onClick={() => onDecision(app.id, 'approved')}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-500/10"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Approve & Allocate
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {applications.length === 0 && (
          <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-10 text-center text-zinc-500">
            <FileText className="w-10 h-10 mx-auto text-zinc-400 mb-3" />
            <p className="font-bold">No applications submitted yet</p>
            <p className="text-xs mt-1">When traders apply to your active capital pools, they will show up here for decision.</p>
          </div>
        )}
      </div>
    </div>
  );
}
