import { Transaction, Budget, SavingsGoal, Subscription, Investment, AIInsight, FinancialHealthScore } from '../types';
import { 
  INITIAL_TRANSACTIONS, 
  INITIAL_BUDGETS, 
  INITIAL_SAVINGS_GOALS, 
  INITIAL_SUBSCRIPTIONS, 
  INITIAL_INVESTMENTS, 
  INITIAL_AI_INSIGHTS, 
  INITIAL_HEALTH_SCORE 
} from './initialData';
import { calculateFinancialHealth, generateDynamicInsights, getAIAdvisorResponse } from './aiService';

const STORAGE_KEYS = {
  TRANSACTIONS: 'sfd_transactions_v1',
  BUDGETS: 'sfd_budgets_v1',
  GOALS: 'sfd_goals_v1',
  SUBSCRIPTIONS: 'sfd_subscriptions_v1',
  INVESTMENTS: 'sfd_investments_v1',
  CURRENCY: 'sfd_currency_v1',
  THEME: 'sfd_theme_v1',
};

// Check if running against live backend
let isBackendAvailable = false;

const checkBackend = async () => {
  try {
    const res = await fetch('/api/health', { method: 'GET' });
    if (res.ok) {
      isBackendAvailable = true;
    }
  } catch {
    isBackendAvailable = false;
  }
};
checkBackend();

export const api = {
  isBackendConnected: () => isBackendAvailable,

  // Transactions
  getTransactions: async (): Promise<Transaction[]> => {
    if (isBackendAvailable) {
      try {
        const res = await fetch('/api/transactions');
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend fetch failed, falling back to local storage', e);
      }
    }
    const local = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error('Failed to parse local transactions', e);
      }
    }
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
    return INITIAL_TRANSACTIONS;
  },

  addTransaction: async (tx: Omit<Transaction, 'id'>): Promise<Transaction> => {
    const newTx: Transaction = {
      ...tx,
      id: `tx-${Date.now()}`
    };

    if (isBackendAvailable) {
      try {
        const res = await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTx)
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend POST failed, fallback to local', e);
      }
    }

    const current = await api.getTransactions();
    const updated = [newTx, ...current];
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(updated));
    return newTx;
  },

  updateTransaction: async (id: string, updates: Partial<Transaction>): Promise<Transaction> => {
    if (isBackendAvailable) {
      try {
        const res = await fetch(`/api/transactions/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates)
        });
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend PUT failed, fallback to local', e);
      }
    }

    const current = await api.getTransactions();
    const index = current.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Transaction not found');
    const updatedTx = { ...current[index], ...updates };
    current[index] = updatedTx;
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(current));
    return updatedTx;
  },

  deleteTransaction: async (id: string): Promise<boolean> => {
    if (isBackendAvailable) {
      try {
        const res = await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
        if (res.ok) return true;
      } catch (e) {
        console.warn('Backend DELETE failed, fallback to local', e);
      }
    }

    const current = await api.getTransactions();
    const filtered = current.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(filtered));
    return true;
  },

  // Budgets
  getBudgets: async (): Promise<Budget[]> => {
    if (isBackendAvailable) {
      try {
        const res = await fetch('/api/budgets');
        if (res.ok) return await res.json();
      } catch (e) {
        console.warn('Backend fetch failed, fallback', e);
      }
    }
    const local = localStorage.getItem(STORAGE_KEYS.BUDGETS);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {}
    }
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(INITIAL_BUDGETS));
    return INITIAL_BUDGETS;
  },

  updateBudget: async (id: string, updates: Partial<Budget>): Promise<Budget> => {
    const current = await api.getBudgets();
    const idx = current.findIndex(b => b.id === id);
    if (idx === -1) throw new Error('Budget not found');
    current[idx] = { ...current[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(current));
    return current[idx];
  },

  addBudget: async (budget: Omit<Budget, 'id'>): Promise<Budget> => {
    const newBudget: Budget = {
      ...budget,
      id: `b-${Date.now()}`
    };
    const current = await api.getBudgets();
    const updated = [...current, newBudget];
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(updated));
    return newBudget;
  },

  // Savings Goals
  getGoals: async (): Promise<SavingsGoal[]> => {
    if (isBackendAvailable) {
      try {
        const res = await fetch('/api/goals');
        if (res.ok) return await res.json();
      } catch {}
    }
    const local = localStorage.getItem(STORAGE_KEYS.GOALS);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {}
    }
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(INITIAL_SAVINGS_GOALS));
    return INITIAL_SAVINGS_GOALS;
  },

  contributeToGoal: async (id: string, amount: number): Promise<SavingsGoal> => {
    const current = await api.getGoals();
    const idx = current.findIndex(g => g.id === id);
    if (idx === -1) throw new Error('Goal not found');
    current[idx] = {
      ...current[idx],
      currentAmount: Math.min(current[idx].targetAmount * 1.5, current[idx].currentAmount + amount)
    };
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(current));
    return current[idx];
  },

  addGoal: async (goal: Omit<SavingsGoal, 'id' | 'currentAmount'>): Promise<SavingsGoal> => {
    const newGoal: SavingsGoal = {
      ...goal,
      id: `g-${Date.now()}`,
      currentAmount: 0
    };
    const current = await api.getGoals();
    const updated = [...current, newGoal];
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(updated));
    return newGoal;
  },

  // Subscriptions
  getSubscriptions: async (): Promise<Subscription[]> => {
    if (isBackendAvailable) {
      try {
        const res = await fetch('/api/subscriptions');
        if (res.ok) return await res.json();
      } catch {}
    }
    const local = localStorage.getItem(STORAGE_KEYS.SUBSCRIPTIONS);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {}
    }
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(INITIAL_SUBSCRIPTIONS));
    return INITIAL_SUBSCRIPTIONS;
  },

  updateSubscription: async (id: string, updates: Partial<Subscription>): Promise<Subscription> => {
    const current = await api.getSubscriptions();
    const idx = current.findIndex(s => s.id === id);
    if (idx === -1) throw new Error('Subscription not found');
    current[idx] = { ...current[idx], ...updates };
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(current));
    return current[idx];
  },

  addSubscription: async (sub: Omit<Subscription, 'id'>): Promise<Subscription> => {
    const newSub: Subscription = {
      ...sub,
      id: `sub-${Date.now()}`
    };
    const current = await api.getSubscriptions();
    const updated = [...current, newSub];
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(updated));
    return newSub;
  },

  deleteSubscription: async (id: string): Promise<boolean> => {
    const current = await api.getSubscriptions();
    const filtered = current.filter(s => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(filtered));
    return true;
  },

  // Investments
  getInvestments: async (): Promise<Investment[]> => {
    const local = localStorage.getItem(STORAGE_KEYS.INVESTMENTS);
    if (local) {
      try {
        return JSON.parse(local);
      } catch {}
    }
    localStorage.setItem(STORAGE_KEYS.INVESTMENTS, JSON.stringify(INITIAL_INVESTMENTS));
    return INITIAL_INVESTMENTS;
  },

  // Reset to default sample demo data
  resetDemoData: () => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(INITIAL_TRANSACTIONS));
    localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(INITIAL_BUDGETS));
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(INITIAL_SAVINGS_GOALS));
    localStorage.setItem(STORAGE_KEYS.SUBSCRIPTIONS, JSON.stringify(INITIAL_SUBSCRIPTIONS));
    localStorage.setItem(STORAGE_KEYS.INVESTMENTS, JSON.stringify(INITIAL_INVESTMENTS));
  }
};
