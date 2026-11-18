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
  | 'transactions' 
  | 'analytics' 
  | 'budgets' 
  | 'goals' 
  | 'subscriptions' 
  | 'investments' 
  | 'ai-advisor';
