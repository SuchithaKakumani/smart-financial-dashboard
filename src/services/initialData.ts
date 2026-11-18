import { Transaction, Budget, SavingsGoal, Subscription, Investment, AIInsight, FinancialHealthScore } from '../types';

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-001',
    description: 'TechCorp Senior Developer Salary',
    amount: 7850.00,
    type: 'income',
    category: 'Salary',
    date: '2026-11-01',
    paymentMethod: 'bank_transfer',
    status: 'completed',
    merchant: 'TechCorp Global Inc.',
    account: 'Chase Premier Checking (...4821)',
    notes: 'Monthly direct deposit salary with tax deductions'
  },
  {
    id: 'tx-002',
    description: 'Apartment Luxury Penthouse Lease',
    amount: 2200.00,
    type: 'expense',
    category: 'Housing',
    date: '2026-11-02',
    paymentMethod: 'bank_transfer',
    status: 'completed',
    merchant: 'Skyline Residences LLC',
    account: 'Chase Premier Checking (...4821)',
    notes: 'November Rent + covered parking slot'
  },
  {
    id: 'tx-003',
    description: 'Whole Foods Organic Market',
    amount: 184.50,
    type: 'expense',
    category: 'Food & Dining',
    date: '2026-11-03',
    paymentMethod: 'credit_card',
    status: 'completed',
    merchant: 'Whole Foods Market',
    account: 'Amex Platinum Card (...1009)',
    notes: 'Weekly fresh groceries, produce, and vitamins'
  },
  {
    id: 'tx-004',
    description: 'Freelance AI Web App Consulting',
    amount: 2400.00,
    type: 'income',
    category: 'Freelance',
    date: '2026-11-04',
    paymentMethod: 'bank_transfer',
    status: 'completed',
    merchant: 'VentureScale Partners',
    account: 'Chase Premier Checking (...4821)',
    notes: 'Milestone 2 frontend dashboard architecture'
  },
  {
    id: 'tx-005',
    description: 'Apple Store - Studio Display Cable & Accessories',
    amount: 159.00,
    type: 'expense',
    category: 'Shopping',
    date: '2026-11-05',
    paymentMethod: 'credit_card',
    status: 'completed',
    merchant: 'Apple Fifth Avenue',
    account: 'Apple Card (...3041)'
  },
  {
    id: 'tx-006',
    description: 'Equinox Elite Gym & Fitness Pass',
    amount: 260.00,
    type: 'expense',
    category: 'Health & Fitness',
    date: '2026-11-06',
    paymentMethod: 'credit_card',
    status: 'completed',
    merchant: 'Equinox Fitness Club',
    account: 'Amex Platinum Card (...1009)'
  },
  {
    id: 'tx-007',
    description: 'Uber Premium Ride - Airport Return',
    amount: 64.20,
    type: 'expense',
    category: 'Transportation',
    date: '2026-11-07',
    paymentMethod: 'credit_card',
    status: 'completed',
    merchant: 'Uber Technologies',
    account: 'Amex Platinum Card (...1009)'
  },
  {
    id: 'tx-008',
    description: 'Vanguard Dividend Payout (VOO S&P 500)',
    amount: 320.75,
    type: 'income',
    category: 'Investments',
    date: '2026-11-08',
    paymentMethod: 'bank_transfer',
    status: 'completed',
    merchant: 'Vanguard Brokerage',
    account: 'Vanguard Investment (...9902)'
  },
  {
    id: 'tx-009',
    description: 'Nobu Japanese Fine Dining Experience',
    amount: 345.80,
    type: 'expense',
    category: 'Food & Dining',
    date: '2026-11-09',
    paymentMethod: 'credit_card',
    status: 'completed',
    merchant: 'Nobu Downtown',
    account: 'Amex Platinum Card (...1009)',
    notes: 'Team celebration dinner'
  },
  {
    id: 'tx-010',
    description: 'Consolidated Edison Power & Gas',
    amount: 142.15,
    type: 'expense',
    category: 'Utilities',
    date: '2026-11-10',
    paymentMethod: 'bank_transfer',
    status: 'completed',
    merchant: 'ConEdison Electric',
    account: 'Chase Premier Checking (...4821)'
  },
  {
    id: 'tx-011',
    description: 'AWS Cloud Services Hosting',
    amount: 88.40,
    type: 'expense',
    category: 'Software & Tech',
    date: '2026-11-11',
    paymentMethod: 'credit_card',
    status: 'completed',
    merchant: 'Amazon Web Services',
    account: 'Chase Sapphire Reserve (...6512)'
  },
  {
    id: 'tx-012',
    description: 'Transfer to High-Yield Savings Account',
    amount: 1500.00,
    type: 'transfer',
    category: 'Savings',
    date: '2026-11-12',
    paymentMethod: 'bank_transfer',
    status: 'completed',
    merchant: 'Marcus by Goldman Sachs',
    account: 'Marcus HYSA (...5114)',
    notes: 'Monthly automatic savings allocation (5.1% APY)'
  },
  {
    id: 'tx-013',
    description: 'Blue Bottle Specialty Coffee Subscription',
    amount: 42.00,
    type: 'expense',
    category: 'Food & Dining',
    date: '2026-11-13',
    paymentMethod: 'credit_card',
    status: 'completed',
    merchant: 'Blue Bottle Coffee',
    account: 'Amex Platinum Card (...1009)'
  },
  {
    id: 'tx-014',
    description: 'Stripe SaaS App Royalties',
    amount: 1850.00,
    type: 'income',
    category: 'Business',
    date: '2026-11-14',
    paymentMethod: 'bank_transfer',
    status: 'completed',
    merchant: 'Stripe Payments',
    account: 'Chase Premier Checking (...4821)'
  },
  {
    id: 'tx-015',
    description: 'Netflix 4K Ultra HD Premium',
    amount: 22.99,
    type: 'expense',
    category: 'Entertainment',
    date: '2026-11-15',
    paymentMethod: 'credit_card',
    status: 'completed',
    merchant: 'Netflix Inc.',
    account: 'Apple Card (...3041)'
  },
  {
    id: 'tx-016',
    description: 'OpenAI ChatGPT Plus Subscription',
    amount: 20.00,
    type: 'expense',
    category: 'Software & Tech',
    date: '2026-11-16',
    paymentMethod: 'credit_card',
    status: 'completed',
    merchant: 'OpenAI',
    account: 'Chase Sapphire Reserve (...6512)'
  },
  {
    id: 'tx-017',
    description: 'Trader Joe’s Market Grocery Run',
    amount: 92.40,
    type: 'expense',
    category: 'Food & Dining',
    date: '2026-11-17',
    paymentMethod: 'debit_card',
    status: 'completed',
    merchant: 'Trader Joe’s',
    account: 'Chase Premier Checking (...4821)'
  },
  {
    id: 'tx-018',
    description: 'Delta Air Lines Flight to San Francisco',
    amount: 389.00,
    type: 'expense',
    category: 'Travel',
    date: '2026-11-18',
    paymentMethod: 'credit_card',
    status: 'completed',
    merchant: 'Delta Air Lines',
    account: 'Amex Platinum Card (...1009)',
    notes: 'Q4 Tech Symposium attendance'
  }
];

export const INITIAL_BUDGETS: Budget[] = [
  {
    id: 'b-1',
    category: 'Housing',
    allocated: 2500,
    period: 'monthly',
    icon: 'Home',
    color: '#3B82F6' // blue
  },
  {
    id: 'b-2',
    category: 'Food & Dining',
    allocated: 900,
    period: 'monthly',
    icon: 'Utensils',
    color: '#10B981' // emerald
  },
  {
    id: 'b-3',
    category: 'Shopping',
    allocated: 600,
    period: 'monthly',
    icon: 'ShoppingBag',
    color: '#8B5CF6' // purple
  },
  {
    id: 'b-4',
    category: 'Transportation',
    allocated: 400,
    period: 'monthly',
    icon: 'Car',
    color: '#F59E0B' // amber
  },
  {
    id: 'b-5',
    category: 'Entertainment',
    allocated: 350,
    period: 'monthly',
    icon: 'Film',
    color: '#EC4899' // pink
  },
  {
    id: 'b-6',
    category: 'Utilities',
    allocated: 300,
    period: 'monthly',
    icon: 'Zap',
    color: '#06B6D4' // cyan
  },
  {
    id: 'b-7',
    category: 'Health & Fitness',
    allocated: 350,
    period: 'monthly',
    icon: 'Activity',
    color: '#14B8A6' // teal
  },
  {
    id: 'b-8',
    category: 'Travel',
    allocated: 600,
    period: 'monthly',
    icon: 'Plane',
    color: '#F43F5E' // rose
  }
];

export const INITIAL_SAVINGS_GOALS: SavingsGoal[] = [
  {
    id: 'g-1',
    title: 'Emergency Safety Net (6 Months)',
    targetAmount: 30000,
    currentAmount: 24500,
    deadline: '2027-04-01',
    category: 'Emergency',
    color: '#10B981',
    icon: 'ShieldCheck'
  },
  {
    id: 'g-2',
    title: 'Tokyo & Kyoto Vacation 2027',
    targetAmount: 6500,
    currentAmount: 4800,
    deadline: '2027-05-15',
    category: 'Travel',
    color: '#6366F1',
    icon: 'Compass'
  },
  {
    id: 'g-3',
    title: 'Tesla Model 3 Performance Down Payment',
    targetAmount: 15000,
    currentAmount: 11200,
    deadline: '2027-08-30',
    category: 'Automotive',
    color: '#EC4899',
    icon: 'Zap'
  },
  {
    id: 'g-4',
    title: 'Urban Real Estate Down Payment',
    targetAmount: 85000,
    currentAmount: 51200,
    deadline: '2028-12-31',
    category: 'Real Estate',
    color: '#F59E0B',
    icon: 'Building'
  }
];

export const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  {
    id: 'sub-1',
    name: 'Netflix 4K Ultra HD',
    amount: 22.99,
    billingCycle: 'monthly',
    nextBillingDate: '2026-12-15',
    category: 'Entertainment',
    status: 'active',
    autoRenew: true,
    color: '#E50914'
  },
  {
    id: 'sub-2',
    name: 'Spotify Family HiFi',
    amount: 16.99,
    billingCycle: 'monthly',
    nextBillingDate: '2026-12-01',
    category: 'Entertainment',
    status: 'active',
    autoRenew: true,
    color: '#1DB954'
  },
  {
    id: 'sub-3',
    name: 'AWS Cloud Services',
    amount: 88.40,
    billingCycle: 'monthly',
    nextBillingDate: '2026-12-11',
    category: 'Software & Tech',
    status: 'active',
    autoRenew: true,
    color: '#FF9900'
  },
  {
    id: 'sub-4',
    name: 'OpenAI ChatGPT Plus',
    amount: 20.00,
    billingCycle: 'monthly',
    nextBillingDate: '2026-12-16',
    category: 'Productivity',
    status: 'active',
    autoRenew: true,
    color: '#10A37F'
  },
  {
    id: 'sub-5',
    name: 'Equinox Gym Membership',
    amount: 260.00,
    billingCycle: 'monthly',
    nextBillingDate: '2026-12-06',
    category: 'Health & Fitness',
    status: 'active',
    autoRenew: true,
    color: '#111827'
  },
  {
    id: 'sub-6',
    name: 'GitHub Copilot Enterprise',
    amount: 19.00,
    billingCycle: 'monthly',
    nextBillingDate: '2026-12-22',
    category: 'Developer Tools',
    status: 'active',
    autoRenew: true,
    color: '#6E40C9'
  },
  {
    id: 'sub-7',
    name: 'Adobe Creative Cloud',
    amount: 54.99,
    billingCycle: 'monthly',
    nextBillingDate: '2026-11-28',
    category: 'Design',
    status: 'to_review',
    autoRenew: false,
    color: '#DA1F26'
  }
];

export const INITIAL_INVESTMENTS: Investment[] = [
  {
    id: 'inv-1',
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    type: 'stock',
    shares: 45,
    buyPrice: 112.50,
    currentPrice: 148.20,
    change24h: 3.42,
    sparkline: [138, 140, 139, 142, 144, 146, 148.2]
  },
  {
    id: 'inv-2',
    symbol: 'AAPL',
    name: 'Apple Inc.',
    type: 'stock',
    shares: 60,
    buyPrice: 182.00,
    currentPrice: 228.50,
    change24h: 1.15,
    sparkline: [222, 224, 223, 225, 226, 227, 228.5]
  },
  {
    id: 'inv-3',
    symbol: 'VOO',
    name: 'Vanguard S&P 500 ETF',
    type: 'etf',
    shares: 85,
    buyPrice: 420.00,
    currentPrice: 535.10,
    change24h: 0.65,
    sparkline: [528, 529, 531, 532, 533, 534, 535.1]
  },
  {
    id: 'inv-4',
    symbol: 'BTC',
    name: 'Bitcoin',
    type: 'crypto',
    shares: 0.85,
    buyPrice: 58000.00,
    currentPrice: 91450.00,
    change24h: 4.80,
    sparkline: [86000, 87500, 88200, 89100, 90300, 90900, 91450]
  },
  {
    id: 'inv-5',
    symbol: 'ETH',
    name: 'Ethereum',
    type: 'crypto',
    shares: 4.5,
    buyPrice: 2450.00,
    currentPrice: 3280.00,
    change24h: 2.95,
    sparkline: [3100, 3140, 3180, 3210, 3250, 3240, 3280]
  },
  {
    id: 'inv-6',
    symbol: 'MSFT',
    name: 'Microsoft Corp.',
    type: 'stock',
    shares: 30,
    buyPrice: 395.00,
    currentPrice: 425.80,
    change24h: -0.45,
    sparkline: [430, 428, 429, 427, 426, 426.5, 425.8]
  }
];

export const INITIAL_AI_INSIGHTS: AIInsight[] = [
  {
    id: 'ins-1',
    type: 'warning',
    title: 'Dining Out Outlier Detected',
    description: 'You have spent $664 on Dining Out this month, which is 74% of your monthly $900 budget in just 19 days. Pace daily spending to under $21/day to stay within limit.',
    impact: 'Potential $180 savings',
    actionLabel: 'Adjust Dining Budget',
    category: 'Food & Dining',
    date: '2026-11-19'
  },
  {
    id: 'ins-2',
    type: 'success',
    title: 'Exceptional 62.4% Savings Rate',
    description: 'Your combined earned income of $12,420 vs total spending of $4,668 gives you a stellar savings rate well above the recommended 20% benchmark.',
    impact: '+$7,752 surplus invested',
    actionLabel: 'Allocate to Goals',
    category: 'Savings',
    date: '2026-11-18'
  },
  {
    id: 'ins-3',
    type: 'tip',
    title: 'Unused Subscription Alert',
    description: 'Adobe Creative Cloud ($54.99/mo) has not had recorded activity in 42 days. Consider pausing it to save $659.88 annually.',
    impact: 'Save $659.88/year',
    actionLabel: 'Review Subscription',
    category: 'Subscriptions',
    date: '2026-11-17'
  },
  {
    id: 'ins-4',
    type: 'alert',
    title: 'Emergency Fund Milestone Approaching',
    description: 'Your Emergency Fund has reached $24,500 (81.7% of target). You are only $5,500 away from full 6-month living expense coverage.',
    impact: 'Goal completion in ~2 months',
    actionLabel: 'Boost Allocation',
    category: 'Goals',
    date: '2026-11-16'
  }
];

export const INITIAL_HEALTH_SCORE: FinancialHealthScore = {
  score: 88,
  rating: 'Excellent',
  breakdown: {
    savingsRateScore: 95,
    budgetAdherenceScore: 82,
    debtToIncomeScore: 92,
    emergencyFundScore: 86,
    subscriptionHealthScore: 85
  },
  summary: 'Your financial foundation is robust! High savings velocity and low debt load put you in the top 10% of peer benchmarks. Optimizing dining expenses and unused subscriptions can boost your score past 92.'
};
