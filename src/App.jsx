import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import AuthView from './components/AuthView';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import ProfileView from './components/ProfileView';
import LeaderboardView from './components/LeaderboardView';
import MarketplaceView from './components/MarketplaceView';
import ProofOfSkillView from './components/ProofOfSkillView';
import MessagesView from './components/MessagesView';
import NotificationsView from './components/NotificationsView';
import InvestorPoolsView from './components/InvestorPoolsView';
import InvestorApplicationsView from './components/InvestorApplicationsView';

import { mockConversations } from './services/mockData';

export default function App() {
  const [activeView, setActiveView] = useState('landing'); // 'landing' | 'auth' | 'dashboard' | ...
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [theme, setTheme] = useState('dark');
  
  // Auth Token
  const [token, setToken] = useState(localStorage.getItem('alphascore_access_token'));
  
  // Profile state
  const [profile, setProfile] = useState({
    name: 'Guest User',
    role: 'trader',
    country: 'Nigeria',
    biography: '',
    style: 'Swing Trader',
    experience: '1 Year',
    market: 'Forex',
    goals: '',
    availableForFunding: true,
    isVerified: false,
    badges: [],
  });
  
  // Trader stats state
  const [trades, setTrades] = useState([]);
  const [stats, setStats] = useState({
    winRate: 0,
    profitFactor: 0,
    riskRewardRatio: 0,
    avgMonthlyReturn: 8.4,
    maxDrawdown: 0,
    sharpeRatio: 0,
    consistencyScore: 0,
    avgTradeDuration: '0m',
    dailyRisk: 0,
    weeklyRisk: 0,
    profitStability: 0,
    alphaScore: 0,
    equityCurve: [],
    components: { consistency: 0, riskManagement: 0, profitability: 0, drawdown: 0, longevity: 0 }
  });
  
  // Shared & Dynamic entities
  const [leaderboard, setLeaderboard] = useState([]);
  const [opportunities, setOpportunities] = useState([]);
  const [appliedOppIds, setAppliedOppIds] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [activeChallenge, setActiveChallenge] = useState(null);
  
  // Investor specific entities
  const [applications, setApplications] = useState([]);
  
  // Mock Messages (inbox client-side MVP)
  const [conversations, setConversations] = useState(mockConversations);
  const [isConnecting, setIsConnecting] = useState(false);
  
  // Notifications log
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-base-1',
      type: 'info',
      title: 'Welcome to AlphaScore',
      message: 'Establish your fintech reputation. Connect broker terminals and verify your disciplines.',
      time: 'Just now'
    }
  ]);

  // Headers helper
  const getAuthHeaders = () => {
    const accessToken = localStorage.getItem('alphascore_access_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    };
  };

  // Fetch Profile & Dynamic Stats from Backend
  const fetchProfileAndStats = async () => {
    try {
      const headers = getAuthHeaders();
      
      // 1. Fetch Profile
      const profRes = await fetch('http://localhost:8000/api/profile/', { headers });
      if (profRes.status === 401) {
        handleLogout();
        return;
      }
      if (profRes.ok) {
        const profData = await profRes.json();
        setProfile({
          name: profData.username,
          role: profData.role,
          country: profData.country,
          biography: profData.biography,
          style: profData.style,
          experience: profData.experience,
          market: profData.market,
          goals: profData.goals,
          availableForFunding: profData.available_for_funding,
          isVerified: profData.is_verified,
          badges: profData.badges,
        });

        // 2. Fetch Stats & Trades ONLY if user is a trader
        if (profData.role === 'trader') {
          const statsRes = await fetch('http://localhost:8000/api/stats/', { headers });
          if (statsRes.ok) {
            const statsData = await statsRes.json();
            setStats(statsData);
            if (statsData.trades) {
              const formatted = statsData.trades.map(t => ({
                id: t.ticket,
                symbol: t.symbol,
                type: t.trade_type,
                lots: parseFloat(t.lots),
                profit: parseFloat(t.profit),
                openTime: t.open_time,
                closeTime: t.close_time,
                stopLossUsed: t.stop_loss_used
              }));
              setTrades(formatted);
            }
          }
        }
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  // Fetch lists based on user role
  const fetchCommonData = async (userRole) => {
    try {
      const headers = getAuthHeaders();
      const currentRole = userRole || profile.role;
      
      // 1. Fetch Leaderboard (visible to all)
      const leadRes = await fetch('http://localhost:8000/api/leaderboard/');
      if (leadRes.ok) {
        const leadData = await leadRes.json();
        setLeaderboard(leadData);
      }

      // 2. Fetch Opportunities (visible to all, filtered by backend based on role)
      const oppRes = await fetch('http://localhost:8000/api/marketplace/', { headers });
      if (oppRes.ok) {
        const oppData = await oppRes.json();
        setOpportunities(oppData);
      }

      // 3. Fetch applications review
      const appRes = await fetch('http://localhost:8000/api/marketplace/apply/', { headers });
      if (appRes.ok) {
        const appData = await appRes.json();
        if (currentRole === 'investor') {
          setApplications(appData);
        } else {
          setAppliedOppIds(appData.map(a => a.opportunity));
        }
      }

      // 4. Fetch Challenges (Traders only)
      if (currentRole === 'trader') {
        const chalRes = await fetch('http://localhost:8000/api/challenges/', { headers });
        if (chalRes.ok) {
          const chalData = await chalRes.json();
          setChallenges(chalData);
        }

        // Fetch User Challenge Progress
        const userChalRes = await fetch('http://localhost:8000/api/challenges/enroll/', { headers });
        if (userChalRes.ok) {
          const userChalData = await userChalRes.json();
          if (userChalData && userChalData.challenge_detail) {
            setActiveChallenge({
              ...userChalData.challenge_detail,
              currentDays: userChalData.current_days,
              currentDrawdown: userChalData.current_drawdown,
              status: userChalData.status
            });
          } else {
            setActiveChallenge(null);
          }
        }
      }
    } catch (err) {
      console.error("Error loading common data:", err);
    }
  };

  // Sync token states
  useEffect(() => {
    if (token) {
      const userCached = JSON.parse(localStorage.getItem('alphascore_user') || '{}');
      const cachedRole = userCached.role || 'trader';
      
      setProfile(prev => ({
        ...prev,
        name: userCached.name || 'User',
        role: cachedRole
      }));
      
      // Update starting view
      setActiveView(cachedRole === 'investor' ? 'leaderboard' : 'dashboard');
      
      fetchProfileAndStats();
      fetchCommonData(cachedRole);
    } else {
      setActiveView('landing');
    }
  }, [token]);

  // Handle Theme switching
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleNavigate = (view, args) => {
    if (view === 'auth') {
      setAuthMode(args?.mode || 'login');
      setActiveView('auth');
    } else {
      setActiveView(view);
    }
  };

  // AuthSuccess JWT Handler
  const handleAuthSuccess = (data) => {
    const userProfile = data.user || { name: 'User', role: 'trader' };
    
    // Set states synchronously to avoid timing race conditions
    localStorage.setItem('alphascore_access_token', data.access);
    localStorage.setItem('alphascore_refresh_token', data.refresh);
    localStorage.setItem('alphascore_user', JSON.stringify(userProfile));
    
    setProfile(prev => ({
      ...prev,
      name: userProfile.name,
      role: userProfile.role
    }));
    
    setToken(data.access); // Triggers useEffect loading profiles/data

    const newNotif = {
      id: `notif-login-${Date.now()}`,
      type: 'funding',
      title: 'Authenticated Successfully',
      message: `Signed in as ${userProfile.name} (${userProfile.role}). Real-time feed active.`,
      time: 'Just now',
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('alphascore_access_token');
    localStorage.removeItem('alphascore_refresh_token');
    localStorage.removeItem('alphascore_user');
    setToken(null);
    setActiveView('landing');
  };

  // 1. Connect Account (Traders only)
  const handleConnectAccount = async (broker, accountNum) => {
    setIsConnecting(true);
    try {
      const headers = getAuthHeaders();
      const response = await fetch('http://localhost:8000/api/accounts/connect/', {
        method: 'POST',
        headers,
        body: JSON.stringify({ broker, accountNum, password: 'investor_password' })
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Failed to link account.');

      await fetchProfileAndStats();

      const newNotif = {
        id: `notif-conn-${Date.now()}`,
        type: 'score',
        title: 'Account Synced',
        message: `Successfully connected ${broker} Account #${accountNum}. Dynamic metrics updated.`,
        time: 'Just now',
      };
      setNotifications(prev => [newNotif, ...prev]);
    } catch (err) {
      alert(err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  // 2. Edit Profile
  const handleUpdateProfile = async (updatedForm) => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch('http://localhost:8000/api/profile/', {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          biography: updatedForm.biography,
          style: updatedForm.style,
          experience: updatedForm.experience,
          market: updatedForm.market,
          goals: updatedForm.goals,
          available_for_funding: updatedForm.availableForFunding
        })
      });

      if (response.ok) {
        await fetchProfileAndStats();
        
        const newNotif = {
          id: `notif-prof-${Date.now()}`,
          type: 'info',
          title: 'Profile Updated',
          message: 'Your specifications and biography have been successfully updated in backend.',
          time: 'Just now',
        };
        setNotifications(prev => [newNotif, ...prev]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 3. Apply to Funding Pool (Traders only)
  const handleApplyOpportunity = async (oppId, pitch) => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch('http://localhost:8000/api/marketplace/apply/', {
        method: 'POST',
        headers,
        body: JSON.stringify({ oppId, pitch })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to submit application.');

      setAppliedOppIds(prev => [...prev, oppId]);

      const newNotif = {
        id: `notif-app-${Date.now()}`,
        type: 'funding',
        title: 'Application Received',
        message: `Your capital application was submitted. Review parameters take up to 48 hours.`,
        time: 'Just now',
      };
      setNotifications(prev => [newNotif, ...prev]);
    } catch (err) {
      alert(err.message);
    }
  };

  // 4. Post New Opportunity (Investors only)
  const handlePostOpportunity = async (oppForm) => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch('http://localhost:8000/api/marketplace/', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          type: oppForm.type,
          budget: oppForm.budget,
          minScore: oppForm.minScore,
          maxDrawdown: oppForm.maxDrawdown,
          minTrackRecord: oppForm.minTrackRecord,
          riskProfile: oppForm.riskProfile,
          description: oppForm.description
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to publish opportunity.');

      // Refresh list
      await fetchCommonData();

      const newNotif = {
        id: `notif-opp-${Date.now()}`,
        type: 'funding',
        title: 'Funding Pool Created',
        message: `Successfully posted new ${oppForm.type} pool with budget ${formatCurrency(oppForm.budget)}.`,
        time: 'Just now',
      };
      setNotifications(prev => [newNotif, ...prev]);
    } catch (err) {
      alert(err.message);
    }
  };

  // 5. Review Application Decision (Investors only)
  const handleApplicationDecision = async (appId, decisionStatus) => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch(`http://localhost:8000/api/marketplace/applications/${appId}/decision/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ status: decisionStatus })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to submit decision.');

      // Refresh applications list
      await fetchCommonData();

      const newNotif = {
        id: `notif-dec-${Date.now()}`,
        type: 'funding',
        title: `Application ${decisionStatus}`,
        message: `Successfully ${decisionStatus} application from ${data.username || 'trader'}.`,
        time: 'Just now',
      };
      setNotifications(prev => [newNotif, ...prev]);
    } catch (err) {
      alert(err.message);
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(val);
  };

  // 6. Enroll in Challenge
  const handleEnrollChallenge = async (challengeId) => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch('http://localhost:8000/api/challenges/enroll/', {
        method: 'POST',
        headers,
        body: JSON.stringify({ challengeId })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to enroll.');

      await fetchCommonData();

      const newNotif = {
        id: `notif-chal-${Date.now()}`,
        type: 'challenge',
        title: 'Challenge Started',
        message: `Successfully enrolled in challenge. Trade values are active.`,
        time: 'Just now',
      };
      setNotifications(prev => [newNotif, ...prev]);
    } catch (err) {
      alert(err.message);
    }
  };

  // 7. Simulate Challenge Day
  const handleSimulateTradeDay = async () => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch('http://localhost:8000/api/challenges/simulate/', {
        method: 'POST',
        headers
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to simulate.');

      await fetchProfileAndStats();
      await fetchCommonData();

      const newNotif = {
        id: `notif-sim-${Date.now()}`,
        type: 'challenge',
        title: 'Trade Day Simulated',
        message: `Trading day parameters computed. Statistics synced dynamically.`,
        time: 'Just now',
      };
      setNotifications(prev => [newNotif, ...prev]);
    } catch (err) {
      alert(err.message);
    }
  };

  // 8. Claim Challenge Badge
  const handleCompleteChallenge = async () => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch('http://localhost:8000/api/challenges/claim/', {
        method: 'POST',
        headers
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to claim badge.');

      await fetchProfileAndStats();
      await fetchCommonData();
      setActiveChallenge(null);

      const newNotif = {
        id: `notif-badge-${Date.now()}`,
        type: 'challenge',
        title: 'Badge Claimed!',
        message: `Successfully added "${data.badge}" permanent credential to your profile.`,
        time: 'Just now',
      };
      setNotifications(prev => [newNotif, ...prev]);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleClearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadMessagesCount = conversations.filter(c => c.unread).length;
  const unreadNotificationsCount = notifications.length;

  if (activeView === 'landing') {
    return <LandingPage onNavigate={handleNavigate} stats={stats} />;
  }

  if (activeView === 'auth') {
    return (
      <AuthView 
        initialMode={authMode} 
        onAuthSuccess={handleAuthSuccess} 
        onNavigateToLanding={() => setActiveView('landing')} 
      />
    );
  }

  return (
    <div className="flex bg-zinc-50 dark:bg-[#09090b] text-zinc-950 dark:text-zinc-50 min-h-screen">
      
      {/* Sidebar navigation */}
      <Sidebar 
        activeView={activeView}
        onViewChange={setActiveView}
        stats={stats}
        profile={profile}
        unreadMessages={unreadMessagesCount}
        unreadNotifications={unreadNotificationsCount}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <Header 
          theme={theme}
          onThemeToggle={handleThemeToggle}
          activeView={activeView}
          profile={profile}
          stats={stats}
          notifications={notifications}
          onViewChange={setActiveView}
        />

        {/* View container */}
        <main className="flex-1 overflow-y-auto p-6 max-w-[1600px] w-full mx-auto">
          {activeView === 'dashboard' && (
            <DashboardView 
              trades={trades}
              stats={stats}
              onConnectAccount={handleConnectAccount}
              isConnecting={isConnecting}
            />
          )}

          {activeView === 'profile' && (
            <ProfileView 
              profile={profile}
              onUpdateProfile={handleUpdateProfile}
              stats={stats}
            />
          )}

          {activeView === 'leaderboard' && (
            <LeaderboardView 
              leaderboard={leaderboard}
              onSelectTrader={(trader) => {
                // Clicking self redirects to profile
                if (trader.username === profile.name) setActiveView('profile');
              }}
              currentTraderStats={stats}
            />
          )}

          {activeView === 'marketplace' && (
            <MarketplaceView 
              opportunities={opportunities}
              stats={stats}
              onApplyOpportunity={handleApplyOpportunity}
              appliedOppIds={appliedOppIds}
            />
          )}

          {activeView === 'proof-of-skill' && (
            <ProofOfSkillView 
              challenges={challenges}
              activeChallenge={activeChallenge}
              onEnrollChallenge={handleEnrollChallenge}
              onSimulateTradeDay={handleSimulateTradeDay}
              onFailChallenge={handleFailChallenge}
              onCompleteChallenge={handleCompleteChallenge}
              stats={stats}
            />
          )}

          {activeView === 'messages' && (
            <MessagesView 
              conversations={conversations}
              onSendMessage={handleSendMessage}
            />
          )}

          {activeView === 'notifications' && (
            <NotificationsView 
              notifications={notifications}
              onClearNotification={handleClearNotification}
              onClearAll={handleClearAllNotifications}
            />
          )}

          {/* Investor Specific Subviews */}
          {activeView === 'pools' && (
            <InvestorPoolsView 
              opportunities={opportunities}
              onPostOpportunity={handlePostOpportunity}
            />
          )}

          {activeView === 'applications' && (
            <InvestorApplicationsView 
              applications={applications}
              onDecision={handleApplicationDecision}
            />
          )}
        </main>
      </div>
    </div>
  );
}
