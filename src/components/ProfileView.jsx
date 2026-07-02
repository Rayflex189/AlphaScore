import React, { useState } from 'react';
import { 
  User, MapPin, Briefcase, Award, Compass, Target, Edit2, Check, 
  ShieldCheck, Share2, ToggleLeft, ToggleRight, Sparkles
} from 'lucide-react';

export default function ProfileView({ profile, onUpdateProfile, stats }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...profile });
  const [copiedLink, setCopiedLink] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleToggleFunding = () => {
    setFormData(prev => ({
      ...prev,
      availableForFunding: !prev.availableForFunding
    }));
  };

  const handleSave = () => {
    onUpdateProfile(formData);
    setIsEditing(false);
  };

  const handleCopyLink = () => {
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
            Trader Profile
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">
            Manage your public profile representation and funding status.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-blue-500" />
            <span>{copiedLink ? 'Copied Link!' : 'Share Profile'}</span>
          </button>
          
          {isEditing ? (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-zinc-900 dark:bg-zinc-800 hover:bg-zinc-800 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-zinc-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
            >
              <Edit2 className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Avatar & Verification Badges */}
        <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800/80 rounded-xl p-6 shadow-sm flex flex-col items-center text-center">
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150" 
              alt="Avatar"
              className="w-32 h-32 rounded-full border-4 border-zinc-100 dark:border-zinc-900 object-cover shadow-md"
            />
            {profile.isVerified && (
              <span className="absolute bottom-0 right-0 bg-emerald-500 text-white p-1.5 rounded-full border-4 border-white dark:border-[#0c0c0f] shadow-lg flex items-center justify-center" title="Verified Trader Account">
                <ShieldCheck className="w-5 h-5" />
              </span>
            )}
          </div>

          <h2 className="text-xl font-bold mt-4 flex items-center gap-1.5 justify-center">
            {profile.name}
            {profile.isVerified && (
              <span className="text-xs bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded-full font-semibold flex items-center gap-0.5">
                Verified
              </span>
            )}
          </h2>
          
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-rose-500" />
            {profile.country}
          </p>

          <div className="w-full mt-6 grid grid-cols-2 gap-4 border-t border-b border-zinc-200 dark:border-zinc-800 py-4 text-sm font-mono">
            <div className="border-r border-zinc-200 dark:border-zinc-800">
              <span className="text-xs text-zinc-500">AlphaScore</span>
              <p className="text-2xl font-bold text-blue-500 mt-0.5">{stats.alphaScore}</p>
            </div>
            <div>
              <span className="text-xs text-zinc-500">Win Rate</span>
              <p className="text-2xl font-bold text-emerald-500 mt-0.5">{stats.winRate}%</p>
            </div>
          </div>

          {/* Funding Status Indicator */}
          <div className="w-full mt-6 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 flex justify-between items-center text-left">
            <div>
              <p className="font-bold text-sm">Available for Funding</p>
              <p className="text-xs text-zinc-500">Investors can offer capital deals.</p>
            </div>
            {isEditing ? (
              <button 
                type="button" 
                onClick={handleToggleFunding}
                className="text-blue-500 hover:text-blue-400"
              >
                {formData.availableForFunding ? (
                  <ToggleRight className="w-9 h-9" />
                ) : (
                  <ToggleLeft className="w-9 h-9" />
                )}
              </button>
            ) : (
              <div>
                {profile.availableForFunding ? (
                  <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2.5 py-1 rounded-full text-xs font-semibold">
                    Active
                  </span>
                ) : (
                  <span className="bg-zinc-200 dark:bg-zinc-800 text-zinc-500 px-2.5 py-1 rounded-full text-xs font-semibold">
                    Off
                  </span>
                )}
              </div>
            )}
          </div>
          
          {/* Credentials / Proof of Skill Badges */}
          <div className="w-full mt-6 text-left space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">Permanent Credentials</h3>
            <div className="flex flex-wrap gap-2">
              <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                KYC Completed
              </span>
              <span className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                cTrader Verified
              </span>
              {profile.badges?.map(badge => (
                <span key={badge} className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
                  <Award className="w-3.5 h-3.5" />
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Bio, Stats & Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800/80 rounded-xl p-6 shadow-sm space-y-5">
            <h3 className="text-lg font-bold">Trader Specifications</h3>
            
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-zinc-500 mb-1.5">Biography</label>
                  <textarea 
                    name="biography" 
                    value={formData.biography} 
                    onChange={handleInputChange}
                    className="w-full md:col-span-2 bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-zinc-950 dark:text-zinc-100"
                    rows={3}
                  />
                </div>
                
                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-zinc-500 mb-1.5">Trading Style</label>
                  <select 
                    name="style" 
                    value={formData.style} 
                    onChange={handleInputChange}
                    className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-950 dark:text-zinc-100"
                  >
                    <option value="Swing Trader">Swing Trader</option>
                    <option value="Scalper">Scalper</option>
                    <option value="Day Trader">Day Trader</option>
                    <option value="Crypto Trader">Crypto Trader</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-zinc-500 mb-1.5">Trading Experience</label>
                  <input 
                    type="text" 
                    name="experience" 
                    value={formData.experience} 
                    onChange={handleInputChange}
                    className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-950 dark:text-zinc-100"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-zinc-500 mb-1.5">Preferred Markets</label>
                  <input 
                    type="text" 
                    name="market" 
                    value={formData.market} 
                    onChange={handleInputChange}
                    className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-950 dark:text-zinc-100"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-xs font-semibold text-zinc-500 mb-1.5">Trading Goals</label>
                  <input 
                    type="text" 
                    name="goals" 
                    value={formData.goals} 
                    onChange={handleInputChange}
                    className="bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-950 dark:text-zinc-100"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="md:col-span-2 bg-zinc-50 dark:bg-zinc-900/30 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/80">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">Biography</p>
                  <p className="mt-1.5 leading-relaxed text-zinc-700 dark:text-zinc-300 font-medium">{profile.biography}</p>
                </div>

                <div className="flex items-center gap-3.5 bg-zinc-50 dark:bg-zinc-900/30 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/80">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><Briefcase className="w-5 h-5" /></div>
                  <div>
                    <span className="text-xs text-zinc-500">Trading Style</span>
                    <p className="font-bold mt-0.5">{profile.style}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 bg-zinc-50 dark:bg-zinc-900/30 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/80">
                  <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500"><Award className="w-5 h-5" /></div>
                  <div>
                    <span className="text-xs text-zinc-500">Experience</span>
                    <p className="font-bold mt-0.5">{profile.experience}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 bg-zinc-50 dark:bg-zinc-900/30 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/80">
                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500"><Compass className="w-5 h-5" /></div>
                  <div>
                    <span className="text-xs text-zinc-500">Preferred Market</span>
                    <p className="font-bold mt-0.5">{profile.market}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 bg-zinc-50 dark:bg-zinc-900/30 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/80">
                  <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500"><Target className="w-5 h-5" /></div>
                  <div>
                    <span className="text-xs text-zinc-500">Trading Goals</span>
                    <p className="font-bold mt-0.5">{profile.goals}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* KYC and Account Safety Panel */}
          <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800/80 rounded-xl p-6 shadow-sm space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              Trust & ID Verification
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-medium">
              <div className="bg-emerald-500/5 border border-emerald-500/10 p-3.5 rounded-lg flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <div>
                  <p className="font-bold">Email Verified</p>
                  <p className="text-zinc-500">isaiah***@gmail.com</p>
                </div>
              </div>
              <div className="bg-emerald-500/5 border border-emerald-500/10 p-3.5 rounded-lg flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <div>
                  <p className="font-bold">Phone Verified</p>
                  <p className="text-zinc-500">+234 •••• ••• 291</p>
                </div>
              </div>
              <div className="bg-emerald-500/5 border border-emerald-500/10 p-3.5 rounded-lg flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <div>
                  <p className="font-bold">Government ID</p>
                  <p className="text-zinc-500">NIN Passport Verified</p>
                </div>
              </div>
            </div>
            
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 p-3 rounded-lg">
              <strong>Verified Badges:</strong> The green verification badge is issued only to accounts with complete KYC checks and directly linked read-only broker API logs. Accounts marked with a verified badge are protected against spoofed histories, duplicate accounts, and manual upload manipulation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
