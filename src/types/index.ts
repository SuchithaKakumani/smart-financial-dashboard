export type TransactionType = 'income' | 'expense' | 'transfer';

export type PaymentMethod = 'credit_card' | 'debit_card' | 'bank_transfer' | 'cash' | 'crypto';

export type TransactionStatus = 'completed' | 'pending' | 'flagged';

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  date: string;
  paymentMethod: PaymentMethod;
  status: TransactionStatus;
  merchant: string;
  account: string;
  notes?: string;
}

export interface Budget {
  id: string;
  category: string;
  allocated: number;
  period: 'monthly' | 'yearly';
  icon: string;
  color: string;
}

export interface SavingsGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
  color: string;
  icon: string;
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingCycle: 'monthly' | 'yearly' | 'weekly';
  nextBillingDate: string;
  category: string;
  status: 'active' | 'paused' | 'to_review';
  autoRenew: boolean;
  color?: string;
}

export interface Investment {
  id: string;
  symbol: string;
  name: string;
  type: 'stock' | 'crypto' | 'etf' | 'commodity';
  shares: number;
  buyPrice: number;
  currentPrice: number;
  change24h: number;
  sparkline: number[];
}

export interface AIInsight {
  id: string;
  type: 'warning' | 'tip' | 'success' | 'alert';
  title: string;
  description: string;
  impact?: string;
  actionLabel?: string;
  category?: string;
  date: string;
}

export interface FinancialHealthScore {
  score: number;
  rating: 'Needs Attention' | 'Fair' | 'Good' | 'Excellent';
  breakdown: {
    savingsRateScore: number;
    budgetAdherenceScore: number;
    debtToIncomeScore: number;
    emergencyFundScore: number;
    subscriptionHealthScore: number;
  };
  summary: string;
}

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR' | 'JPY' | 'CAD';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number; // conversion rate against USD
  label: string;
}

export type ViewTab = 
  | 'overview' 
  | 'calculator'
  | 'transactions' 
  | 'analytics' 
  | 'budgets' 
  | 'goals' 
  | 'subscriptions' 
  | 'investments' 
  | 'ai-advisor';

export interface CalculatorInputs {
  monthlyIncome: number;
  essentialExpenses: number; // Needs (Rent, groceries, utilities, insurance)
  discretionaryExpenses: number; // Wants (Dining out, entertainment, shopping)
  debtPayments: number; // Loans, credit cards, EMIs
  currentSavings: number; // Current accumulated cash/investments
  monthlyInvestment: number; // Planned monthly investment
  annualReturnRate: number; // Expected return (e.g. 8%)
  timeHorizonYears: number; // Time horizon (e.g. 5, 10, 20 years)
}

export interface CalculatorResults {
  totalOutflows: number;
  monthlySurplus: number;
  savingsRate: number; // percentage
  dtiRatio: number; // Debt-to-income percentage
  needsPercent: number; // Actual % of income on needs
  wantsPercent: number; // Actual % of income on wants
  savingsPercent: number; // Actual % of income on savings/debt
  emergencyFundMonths: number; // How many months essential expenses covered
  futureWealthValue: number; // Compound wealth projection
  totalContributions: number;
  totalInterestEarned: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D';
}

export interface CalculatorAISuggestion {
  verdict: string;
  badgeColor: string;
  summary: string;
  recommendations: Array<{
    title: string;
    impact: string;
    description: string;
    type: 'positive' | 'warning' | 'tip';
  }>;
  rule503020Comparison: {
    needs: { actual: number; ideal: number; diff: number; status: 'good' | 'high' };
    wants: { actual: number; ideal: number; diff: number; status: 'good' | 'high' };
    savings: { actual: number; ideal: number; diff: number; status: 'good' | 'low' };
  };
}
