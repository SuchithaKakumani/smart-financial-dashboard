import React, { useState } from 'react';
import { 
  CreditCard, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  PauseCircle, 
  Plus, 
  Trash2,
  ExternalLink,
  ShieldAlert,
  Sparkles
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Subscription } from '../types';

export const SubscriptionsManager: React.FC = () => {
  const { subscriptions, updateSubscription, currency } = useFinance();
  const [filter, setFilter] = useState<'all' | 'active' | 'to_review'>('all');

  // Calculations
  const monthlyTotal = subscriptions
    .filter(s => s.status === 'active')
    .reduce((sum, s) => sum + (s.billingCycle === 'yearly' ? s.amount / 12 : s.amount), 0);

  const annualTotal = monthlyTotal * 12;

  const reviewList = subscriptions.filter(s => s.status === 'to_review');
  const potentialSavings = reviewList.reduce((sum, s) => sum + (s.billingCycle === 'yearly' ? s.amount : s.amount * 12), 0);

  const filtered = subscriptions.filter(s => {
    if (filter === 'active') return s.status === 'active';
    if (filter === 'to_review') return s.status === 'to_review';
    return true;
  });

  const toggleStatus = async (sub: Subscription) => {
    const nextStatus = sub.status === 'active' ? 'paused' : 'active';
    await updateSubscription(sub.id, { status: nextStatus });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Monthly Recurring Burn
          </p>
          <h3 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {formatCurrency(monthlyTotal, currency)}
            <span className="text-xs text-slate-400 font-normal"> /month</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Across {subscriptions.filter(s => s.status === 'active').length} active services
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Annualized Commitment
          </p>
          <h3 className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
            {formatCurrency(annualTotal, currency)}
            <span className="text-xs text-slate-400 font-normal"> /year</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Projected 12-month recurring expenditure
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-rose-500/10 border border-amber-500/20 shadow-sm">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Subscription Optimization</span>
          </div>
          <h3 className="mt-2 text-2xl font-extrabold text-amber-600 dark:text-amber-400">
            {formatCurrency(potentialSavings, currency)}
            <span className="text-xs font-normal"> /yr savable</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {reviewList.length} idle or duplicate service flagged
          </p>
        </div>

      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs">
          {(['all', 'active', 'to_review'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg font-semibold capitalize transition-colors ${
                filter === tab 
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' 
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-400">
          Showing {filtered.length} subscriptions
        </span>
      </div>

      {/* Subscriptions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(sub => {
          const isActive = sub.status === 'active';
          const isReview = sub.status === 'to_review';

          return (
            <div
              key={sub.id}
              className={`
                p-5 rounded-2xl bg-white dark:bg-[#111827] border transition-all shadow-sm hover:shadow-md flex flex-col justify-between
                ${isReview ? 'border-amber-400/80 dark:border-amber-800/80 ring-1 ring-amber-500/20' : 'border-slate-200/80 dark:border-slate-800/80'}
              `}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-white text-sm"
                      style={{ backgroundColor: sub.color || '#6366F1' }}
                    >
                      {sub.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {sub.name}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {sub.category}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    isActive 
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                      : isReview 
                        ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                  }`}>
                    {sub.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="mt-4 flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      {formatCurrency(sub.amount, currency)}
                    </span>
                    <span className="text-xs text-slate-400 font-normal">
                      /{sub.billingCycle === 'yearly' ? 'yr' : 'mo'}
                    </span>
                  </div>

                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Due {formatDate(sub.nextBillingDate)}
                  </span>
                </div>
              </div>

              {/* Action row */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {sub.autoRenew ? 'Auto-renews enabled' : 'Auto-renew off'}
                </span>

                <button
                  onClick={() => toggleStatus(sub)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-400' 
                      : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-400'
                  }`}
                >
                  {isActive ? 'Pause / Cancel' : 'Resume'}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
