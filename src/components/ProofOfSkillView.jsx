import React, { useState } from 'react';
import { 
  Award, ShieldAlert, Sparkles, TrendingUp, Compass, Calendar, 
  HelpCircle, ChevronRight, Play, RefreshCw, CheckCircle2, XCircle
} from 'lucide-react';

export default function ProofOfSkillView({ 
  challenges, activeChallenge, onEnrollChallenge, onSimulateTradeDay, 
  onFailChallenge, onCompleteChallenge, stats 
}) {
  const [loadingSim, setLoadingSim] = useState(false);

  const handleEnroll = (challengeId) => {
    onEnrollChallenge(challengeId);
  };

  const handleSimulateDay = () => {
    setLoadingSim(true);
    setTimeout(() => {
      onSimulateTradeDay();
      setLoadingSim(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
          Proof of Skill Challenges
          <span className="text-xs bg-purple-500/15 text-purple-400 border border-purple-500/20 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-0.5">
            <Sparkles className="w-3 h-3" /> Recommended MVP Feature
          </span>
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Prove your discipline under standardized conditions and earn credentials recognized by institutional investors.
        </p>
      </div>

      {/* Conditional Active Challenge Panel */}
      {activeChallenge ? (
        <div className="bg-gradient-to-r from-purple-950/20 to-zinc-950/40 border border-purple-500/30 rounded-xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-[10px] uppercase font-mono font-extrabold text-purple-400 tracking-widest bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">Active Enrollment</span>
              <h2 className="text-xl font-bold mt-1.5 flex items-center gap-2">
                {activeChallenge.title}
                <span className={`text-xs px-2.5 py-0.5 border rounded-full font-semibold ${activeChallenge.badgeColor}`}>
                  {activeChallenge.rewardBadge}
                </span>
              </h2>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleSimulateDay}
                disabled={loadingSim}
                className="bg-purple-600 hover:bg-purple-500 text-white font-medium py-2 px-4 rounded-lg text-xs flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {loadingSim ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Calculating Day...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Simulate Trade Day
                  </>
                )}
              </button>
              
              <button
                onClick={onFailChallenge}
                className="bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-rose-500 hover:text-white py-2 px-3 border border-zinc-300 dark:border-zinc-700 hover:border-transparent rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Progress Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Drawdown Gauge */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400">Current Drawdown Limit</span>
                <span className="font-mono font-bold text-rose-400">{stats.maxDrawdown}% / {activeChallenge.limitDrawdown}%</span>
              </div>
              <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    stats.maxDrawdown >= activeChallenge.limitDrawdown ? 'bg-rose-500' : 'bg-blue-500'
                  }`}
                  style={{ width: `${Math.min(100, (stats.maxDrawdown / activeChallenge.limitDrawdown) * 100)}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-zinc-500">Must not touch or exceed drawdown threshold.</p>
            </div>

            {/* Trading Days */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400">Trading Period Progress</span>
                <span className="font-mono font-bold text-blue-400">Day {Math.min(30, stats.longevity / 3.3).toFixed(0)} / 30</span>
              </div>
              <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${Math.min(100, (stats.longevity / 100) * 100)}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-zinc-500">Achieve active consistent trades for the duration.</p>
            </div>

            {/* Score Target */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400">Target AlphaScore</span>
                <span className="font-mono font-bold text-emerald-400">{stats.alphaScore} / {activeChallenge.targetScore}</span>
              </div>
              <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${Math.min(100, (stats.alphaScore / activeChallenge.targetScore) * 100)}%` }}
                ></div>
              </div>
              <p className="text-[10px] text-zinc-500">Overall score calculated dynamically via algorithm.</p>
            </div>

          </div>

          {/* Validation Alert */}
          {stats.maxDrawdown >= activeChallenge.limitDrawdown ? (
            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl flex gap-3 text-xs leading-normal">
              <ShieldAlert className="w-5 h-5 shrink-0" />
              <div>
                <strong className="font-bold">Challenge Failed!</strong> Max drawdown threshold exceeded. Reset the challenge to clean trading parameters and start fresh.
              </div>
            </div>
          ) : stats.alphaScore >= activeChallenge.targetScore && (stats.longevity >= 90) ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl flex justify-between items-center text-xs">
              <div className="flex gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <div>
                  <strong className="font-bold">Challenge Passed!</strong> You met all performance and consistency requirements.
                </div>
              </div>
              <button
                onClick={onCompleteChallenge}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 px-3 rounded-lg text-xs cursor-pointer"
              >
                Claim Badge
              </button>
            </div>
          ) : (
            <div className="bg-purple-500/10 border border-purple-500/20 text-purple-300 p-4 rounded-xl flex gap-3 text-xs leading-normal">
              <Sparkles className="w-5 h-5 shrink-0" />
              <div>
                <strong className="font-bold">Instructions:</strong> Click <strong className="font-bold">"Simulate Trade Day"</strong> to record trading activity. Standardized trades will compute. Keep profit steady, use strict stops, and stay below the drawdown threshold to pass.
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* Available Challenges List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {challenges.map((challenge) => {
          const isEnrolled = activeChallenge?.id === challenge.id;
          
          return (
            <div 
              key={challenge.id}
              className={`bg-white dark:bg-[#0c0c0f] border rounded-xl p-5 shadow-sm flex flex-col justify-between space-y-4 ${
                isEnrolled ? 'border-purple-500 shadow-purple-500/5' : 'border-zinc-200 dark:border-zinc-800'
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex justify-between items-start">
                  <span className={`text-[10px] font-mono px-2 py-0.5 border rounded ${
                    challenge.difficulty === 'Expert' 
                      ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' 
                      : challenge.difficulty === 'Hard'
                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                        : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                  }`}>
                    {challenge.difficulty}
                  </span>
                  
                  <span className="text-xs text-zinc-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {challenge.duration}
                  </span>
                </div>

                <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-50">
                  {challenge.title}
                </h3>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {challenge.description}
                </p>

                {/* Challenge Parameters List */}
                <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 p-3 rounded-lg text-xs space-y-2 font-mono">
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Target AlphaScore:</span>
                    <span className="font-bold">{challenge.targetScore}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Max Drawdown Limit:</span>
                    <span className="font-bold text-rose-500">{challenge.limitDrawdown}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-500">Reward Badge:</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${challenge.badgeColor}`}>
                      {challenge.rewardBadge}
                    </span>
                  </div>
                </div>
              </div>

              {activeChallenge ? (
                <button
                  disabled
                  className="w-full bg-zinc-200 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-400 py-2.5 px-4 rounded-lg text-xs font-semibold cursor-not-allowed"
                >
                  Already Enrolled Elsewhere
                </button>
              ) : (
                <button
                  onClick={() => handleEnroll(challenge.id)}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 px-4 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  Enroll in Challenge
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
