// Mock Data Service for AlphaScore MVP

// Generate initial raw trades for the default user "Isaiah Rory"
const generateMockTrades = () => {
  const symbols = ['EURUSD', 'GBPUSD', 'XAUUSD', 'USDJPY', 'AUDUSD'];
  const trades = [];
  const baseDate = new Date('2026-05-01T08:00:00');
  
  let balance = 100000; // Starting with $100k
  
  for (let i = 0; i < 120; i++) {
    // Increment time by a few hours or days
    const tradeDate = new Date(baseDate.getTime() + i * 12 * 60 * 60 * 1000);
    const durationMin = Math.floor(Math.random() * 300) + 15; // 15 mins to 5 hours
    const closeDate = new Date(tradeDate.getTime() + durationMin * 60 * 1000);
    
    const symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const type = Math.random() > 0.45 ? 'buy' : 'sell';
    const lots = parseFloat((Math.random() * 1.5 + 0.1).toFixed(2));
    
    // Outcome probabilities: 62% win rate for Isaiah
    const isWin = Math.random() < 0.62;
    let profit = 0;
    
    if (isWin) {
      profit = Math.floor(Math.random() * 600) + 100; // Win $100 to $700
    } else {
      profit = -(Math.floor(Math.random() * 400) + 50); // Loss -$50 to -$450
    }
    
    // Add transaction ID and details
    trades.push({
      id: `T-${100000 + i}`,
      openTime: tradeDate.toISOString(),
      closeTime: closeDate.toISOString(),
      symbol,
      type,
      lots,
      profit: parseFloat(profit.toFixed(2)),
      stopLossUsed: Math.random() > 0.05, // 95% SL usage
    });
  }
  
  return trades.reverse(); // Newest first
};

export const initialTrades = generateMockTrades();

// Dynamic calculator for statistics based on trades
export const calculateStats = (tradesList) => {
  if (tradesList.length === 0) {
    return {
      winRate: 0,
      profitFactor: 0,
      riskRewardRatio: 0,
      avgMonthlyReturn: 0,
      maxDrawdown: 0,
      sharpeRatio: 0,
      consistencyScore: 0,
      avgTradeDuration: '0m',
      dailyRisk: 0,
      weeklyRisk: 0,
      profitStability: 0,
      alphaScore: 0,
      longevity: 0,
      components: {
        consistency: 0,
        riskManagement: 0,
        profitability: 0,
        drawdown: 0,
        longevity: 0
      }
    };
  }

  const wins = tradesList.filter(t => t.profit > 0);
  const losses = tradesList.filter(t => t.profit < 0);
  
  const winRate = (wins.length / tradesList.length) * 100;
  
  const grossProfits = wins.reduce((sum, t) => sum + t.profit, 0);
  const grossLosses = Math.abs(losses.reduce((sum, t) => sum + t.profit, 0));
  
  const profitFactor = grossLosses === 0 ? grossProfits : grossProfits / grossLosses;
  
  const avgWin = wins.length === 0 ? 0 : grossProfits / wins.length;
  const avgLoss = losses.length === 0 ? 1 : grossLosses / losses.length;
  const riskRewardRatio = avgLoss === 0 ? avgWin : avgWin / avgLoss;

  // Calculate duration
  let totalDurationMs = 0;
  tradesList.forEach(t => {
    totalDurationMs += new Date(t.closeTime) - new Date(t.openTime);
  });
  const avgDurationMs = totalDurationMs / tradesList.length;
  const avgDurationHours = avgDurationMs / (1000 * 60 * 60);
  const avgDurationStr = avgDurationHours < 1 
    ? `${Math.round(avgDurationHours * 60)} mins` 
    : `${avgDurationHours.toFixed(1)} hours`;

  // Drawdown & Equity Curve Simulation
  let balance = 100000;
  let peak = balance;
  let maxDrawdownVal = 0;
  const equityCurve = [{ time: 'Start', value: balance }];
  
  // To simulate in chronological order
  const chronologicalTrades = [...tradesList].reverse();
  chronologicalTrades.forEach((t, index) => {
    balance += t.profit;
    if (balance > peak) peak = balance;
    const dd = ((peak - balance) / peak) * 100;
    if (dd > maxDrawdownVal) maxDrawdownVal = dd;
    equityCurve.push({
      time: new Date(t.closeTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      value: Math.round(balance)
    });
  });

  // Monthly Return Simulation
  // Assuming the trades span roughly 2 months (from May 1 to end of June)
  const avgMonthlyReturn = 8.4; // Fixed placeholder representation of growth

  // Components of AlphaScore (0-100 scale)
  
  // 1. Consistency: Based on dispersion of trade profits and lots stability
  const lotSizes = tradesList.map(t => t.lots);
  const avgLotSize = lotSizes.reduce((a, b) => a + b, 0) / lotSizes.length;
  const lotVariance = lotSizes.reduce((sum, l) => sum + Math.pow(l - avgLotSize, 2), 0) / lotSizes.length;
  // lower lot variance = more consistency
  const lotConsistencyScore = Math.max(50, 100 - (lotVariance * 35));
  // Win consistency
  const consistency = Math.round(lotConsistencyScore * 0.4 + winRate * 0.6);

  // 2. Risk Management (Discipline): Based on Stop Loss usage and Drawdown control
  const stopLossUsage = (tradesList.filter(t => t.stopLossUsed).length / tradesList.length) * 100;
  const ddPenalization = Math.max(0, 100 - (maxDrawdownVal * 8)); // 0 drawdown = 100 score, 10% dd = 20 score, etc.
  const riskManagement = Math.round(stopLossUsage * 0.5 + ddPenalization * 0.5);

  // 3. Profitability: Based on Profit Factor and Win Rate
  const profitFactorScore = Math.min(100, (profitFactor / 2.5) * 100);
  const profitability = Math.round(profitFactorScore * 0.5 + winRate * 0.5);

  // 4. Drawdown Score: Direct metric of the max drawdown compared to 10% target limit
  const drawdownScore = Math.max(0, Math.round(100 - (maxDrawdownVal * 10)));

  // 5. Longevity: Based on trade count and timeline
  const longevity = Math.min(100, Math.round((tradesList.length / 150) * 100));

  // Overall Score Calculation (using PRD formula)
  // 30% Consistency, 25% Risk Management, 20% Profitability, 15% Drawdown, 10% Longevity
  const alphaScore = Math.round(
    (consistency * 0.30) +
    (riskManagement * 0.25) +
    (profitability * 0.20) +
    (drawdownScore * 0.15) +
    (longevity * 0.10)
  );

  // Calculated Risk metrics
  const dailyRisk = parseFloat((maxDrawdownVal * 0.3).toFixed(2));
  const weeklyRisk = parseFloat((maxDrawdownVal * 0.7).toFixed(2));
  
  return {
    winRate: parseFloat(winRate.toFixed(1)),
    profitFactor: parseFloat(profitFactor.toFixed(2)),
    riskRewardRatio: parseFloat(riskRewardRatio.toFixed(2)),
    avgMonthlyReturn,
    maxDrawdown: parseFloat(maxDrawdownVal.toFixed(2)),
    sharpeRatio: parseFloat((riskRewardRatio * 1.2).toFixed(2)), // simulated
    consistencyScore: consistency,
    avgTradeDuration: avgDurationStr,
    dailyRisk,
    weeklyRisk,
    profitStability: Math.round(consistency * 0.95),
    alphaScore,
    equityCurve,
    longevity,
    components: {
      consistency,
      riskManagement,
      profitability,
      drawdown: drawdownScore,
      longevity
    }
  };
};

// Leaderboard Data
export const mockLeaderboard = [
  {
    id: 'trader-001',
    name: 'Isaiah Rory',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100',
    country: 'Nigeria',
    flag: '🇳🇬',
    style: 'Swing Trader',
    experience: '5 Years',
    alphaScore: 91,
    monthlyReturn: 8.4,
    drawdown: 4.1,
    winRate: 62,
    profitFactor: 2.1,
    verified: true,
    availableForFunding: true,
  },
  {
    id: 'trader-002',
    name: 'Yuki Sato',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100',
    country: 'Japan',
    flag: '🇯🇵',
    style: 'Scalper',
    experience: '8 Years',
    alphaScore: 96,
    monthlyReturn: 14.2,
    drawdown: 3.2,
    winRate: 74,
    profitFactor: 2.8,
    verified: true,
    availableForFunding: false,
  },
  {
    id: 'trader-003',
    name: 'Sofia Martinez',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100',
    country: 'Spain',
    flag: '🇪🇸',
    style: 'Day Trader',
    experience: '4 Years',
    alphaScore: 89,
    monthlyReturn: 9.1,
    drawdown: 4.8,
    winRate: 59,
    profitFactor: 1.9,
    verified: true,
    availableForFunding: true,
  },
  {
    id: 'trader-004',
    name: 'Amara Diop',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100',
    country: 'Senegal',
    flag: '🇸🇳',
    style: 'Swing Trader',
    experience: '6 Years',
    alphaScore: 93,
    monthlyReturn: 11.5,
    drawdown: 3.9,
    winRate: 67,
    profitFactor: 2.4,
    verified: true,
    availableForFunding: true,
  },
  {
    id: 'trader-005',
    name: 'Liam O\'Connor',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=100',
    country: 'Ireland',
    flag: '🇮🇪',
    style: 'Crypto Trader',
    experience: '3 Years',
    alphaScore: 82,
    monthlyReturn: 18.7,
    drawdown: 8.5,
    winRate: 51,
    profitFactor: 1.7,
    verified: true,
    availableForFunding: true,
  },
  {
    id: 'trader-006',
    name: 'Kwame Mensah',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=100',
    country: 'Ghana',
    flag: '🇬🇭',
    style: 'Scalper',
    experience: '7 Years',
    alphaScore: 94,
    monthlyReturn: 12.8,
    drawdown: 3.5,
    winRate: 71,
    profitFactor: 2.6,
    verified: true,
    availableForFunding: true,
  },
  {
    id: 'trader-007',
    name: 'Chloe Dubois',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100',
    country: 'France',
    flag: '🇫🇷',
    style: 'Day Trader',
    experience: '5 Years',
    alphaScore: 87,
    monthlyReturn: 7.9,
    drawdown: 4.5,
    winRate: 61,
    profitFactor: 2.0,
    verified: false,
    availableForFunding: true,
  }
];

// Funding Opportunities
export const mockOpportunities = [
  {
    id: 'opp-1',
    investor: 'Apex Capital Partners',
    logo: '💼',
    type: 'Swing Traders',
    minScore: 85,
    maxDrawdown: 5.0,
    minTrackRecord: '12 Months',
    riskProfile: 'Low',
    budget: 500000,
    description: 'Looking to allocate capital to disciplined Swing Traders specializing in major G10 currencies. Proven risk management is our highest criteria.',
    applicants: 12,
    status: 'open',
  },
  {
    id: 'opp-2',
    investor: 'Horizon Alpha Fund',
    logo: '🌐',
    type: 'Scalpers',
    minScore: 90,
    maxDrawdown: 4.0,
    minTrackRecord: '6 Months',
    riskProfile: 'Medium',
    budget: 250000,
    description: 'Seeking high-frequency scalpers with robust consistency metrics. Rapid execution, low latency setup verification required.',
    applicants: 8,
    status: 'open',
  },
  {
    id: 'opp-3',
    investor: 'Genesis Crypto Ventures',
    logo: '🪙',
    type: 'Crypto Traders',
    minScore: 80,
    maxDrawdown: 10.0,
    minTrackRecord: '6 Months',
    riskProfile: 'High',
    budget: 1000000,
    description: 'Looking for traders to handle leveraged crypto asset management. Must demonstrate profitability across Bitcoin and Ether volatility.',
    applicants: 19,
    status: 'open',
  }
];

// Challenges / Proof of Skill
export const mockChallenges = [
  {
    id: 'chal-1',
    title: 'Low Drawdown Master Class',
    difficulty: 'Hard',
    duration: '30 Days',
    targetScore: 88,
    limitDrawdown: 4.0,
    rewardBadge: 'Drawdown Guard',
    badgeColor: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    participants: 1420,
    successRate: '12%',
    description: 'Complete 30 trading days with a maximum drawdown of 4% and a minimum profit factor of 1.8. Earn the Drawdown Guard credential.',
    status: 'available'
  },
  {
    id: 'chal-2',
    title: 'High Consistency Challenge',
    difficulty: 'Medium',
    duration: '15 Days',
    targetScore: 85,
    limitDrawdown: 6.0,
    rewardBadge: 'Consistency Icon',
    badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    participants: 2310,
    successRate: '28%',
    description: 'Execute trades with steady sizing and consistent daily profits. Lot size deviation must remain below 0.3. Earn the Consistency Icon badge.',
    status: 'available'
  },
  {
    id: 'chal-3',
    title: 'Prop Firm Prep Challenge',
    difficulty: 'Expert',
    duration: '45 Days',
    targetScore: 90,
    limitDrawdown: 5.0,
    rewardBadge: 'Prop Verified',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    participants: 840,
    successRate: '5%',
    description: 'Align with institutional risk guidelines. Maintain tight stop losses, limit weekly drawdown, and achieve a 10% return goal. Earn the Prop Verified badge.',
    status: 'available'
  }
];

// Initial messages
export const mockConversations = [
  {
    id: 'conv-1',
    partnerName: 'Apex Capital Partners (Marcus)',
    partnerLogo: '💼',
    lastMessage: 'We reviewed your AlphaScore dashboard. Let\'s schedule a call to discuss the $500k allocation.',
    timestamp: '10:45 AM',
    unread: true,
    messages: [
      { sender: 'investor', text: 'Hello Isaiah, we noticed your profile on the Leaderboard. Your 91 AlphaScore and low 4.1% drawdown fits our mandate.', time: '10:30 AM' },
      { sender: 'trader', text: 'Thank you Marcus. Yes, I specialize in major pairs with strict risk controls and stop loss on every position.', time: '10:35 AM' },
      { sender: 'investor', text: 'We reviewed your AlphaScore dashboard. Let\'s schedule a call to discuss the $500k allocation.', time: '10:45 AM' }
    ]
  },
  {
    id: 'conv-2',
    partnerName: 'Genesis Crypto Ventures (Sarah)',
    partnerLogo: '🪙',
    lastMessage: 'Thanks for the details. We will check the account verification records.',
    timestamp: 'Yesterday',
    unread: false,
    messages: [
      { sender: 'investor', text: 'Hey, do you trade crypto markets as well or only FX swing trades?', time: 'Yesterday' },
      { sender: 'trader', text: 'Mainly FX swing trades (EURUSD/GBPUSD) and spot Gold (XAUUSD). Occasionally BTCUSD during high volatility setup.', time: 'Yesterday' },
      { sender: 'investor', text: 'Thanks for the details. We will check the account verification records.', time: 'Yesterday' }
    ]
  }
];
