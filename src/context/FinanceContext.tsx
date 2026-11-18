import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  Transaction, 
  Budget, 
  SavingsGoal, 
  Subscription, 
  Investment, 
  AIInsight, 
  FinancialHealthScore, 
  CurrencyCode, 
  ViewTab 
} from '../types';
import { api } from '../services/api';
import { calculateFinancialHealth, generateDynamicInsights } from '../services/aiService';
import confetti from 'canvas-confetti';

interface FinanceContextType {
  transactions: Transaction[];
  budgets: Budget[];
  goals: SavingsGoal[];
  subscriptions: Subscription[];
  investments: Investment[];
  insights: AIInsight[];
  healthScore: FinancialHealthScore;
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  activeTab: ViewTab;
  setActiveTab: (tab: ViewTab) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  isBackendConnected: boolean;
  loading: boolean;
  // Actions
  addTransaction: (tx: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, updates: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  updateBudget: (id: string, allocated: number) => Promise<void>;
  contributeToGoal: (id: string, amount: number) => Promise<void>;
  addGoal: (goal: Omit<SavingsGoal, 'id' | 'currentAmount'>) => Promise<void>;
  updateSubscription: (id: string, updates: Partial<Subscription>) => Promise<void>;
  resetToSampleData: () => void;
  triggerConfetti: () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [currency, setCurrencyState] = useState<CurrencyCode>('USD');
  const [activeTab, setActiveTab] = useState<ViewTab>('overview');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize data
  const loadData = async () => {
    try {
      setLoading(true);
      const [txs, bgs, gls, subs, invs] = await Promise.all([
        api.getTransactions(),
        api.getBudgets(),
        api.getGoals(),
        api.getSubscriptions(),
        api.getInvestments()
      ]);
      setTransactions(txs);
      setBudgets(bgs);
      setGoals(gls);
      setSubscriptions(subs);
      setInvestments(invs);
      setIsBackendConnected(api.isBackendConnected());
    } catch (err) {
      console.error('Failed to load financial data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Currency preference
    const savedCurrency = localStorage.getItem('sfd_currency') as CurrencyCode;
    if (savedCurrency) setCurrencyState(savedCurrency);

    // Dark mode preference
    const savedTheme = localStorage.getItem('sfd_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme ? savedTheme === 'dark' : prefersDark || true;
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    loadData();
  }, []);

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    localStorage.setItem('sfd_currency', c);
  };

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('sfd_theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('sfd_theme', 'light');
      }
      return next;
    });
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {
      console.log('Confetti triggered');
    }
  };

  // Dynamic calculations
  const healthScore = calculateFinancialHealth(transactions, budgets, goals, subscriptions);
  const insights = generateDynamicInsights(transactions, budgets, goals, subscriptions);

  // Actions
  const addTransaction = async (tx: Omit<Transaction, 'id'>) => {
    const created = await api.addTransaction(tx);
    setTransactions(prev => [created, ...prev]);
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    const updated = await api.updateTransaction(id, updates);
    setTransactions(prev => prev.map(t => t.id === id ? updated : t));
  };

  const deleteTransaction = async (id: string) => {
    await api.deleteTransaction(id);
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const updateBudget = async (id: string, allocated: number) => {
    const updated = await api.updateBudget(id, { allocated });
    setBudgets(prev => prev.map(b => b.id === id ? updated : b));
  };

  const contributeToGoal = async (id: string, amount: number) => {
    const updated = await api.contributeToGoal(id, amount);
    setGoals(prev => prev.map(g => g.id === id ? updated : g));
    triggerConfetti();
  };

  const addGoal = async (goal: Omit<SavingsGoal, 'id' | 'currentAmount'>) => {
    const created = await api.addGoal(goal);
    setGoals(prev => [...prev, created]);
  };

  const updateSubscription = async (id: string, updates: Partial<Subscription>) => {
    const updated = await api.updateSubscription(id, updates);
    setSubscriptions(prev => prev.map(s => s.id === id ? updated : s));
  };

  const resetToSampleData = () => {
    api.resetDemoData();
    loadData();
    triggerConfetti();
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        budgets,
        goals,
        subscriptions,
        investments,
        insights,
        healthScore,
        currency,
        setCurrency,
        activeTab,
        setActiveTab,
        darkMode,
        toggleDarkMode,
        isBackendConnected,
        loading,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        updateBudget,
        contributeToGoal,
        addGoal,
        updateSubscription,
        resetToSampleData,
        triggerConfetti
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
