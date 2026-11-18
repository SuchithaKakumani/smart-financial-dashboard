import React from 'react';
import { Sparkles, AlertTriangle, CheckCircle2, Lightbulb, AlertCircle, ArrowRight } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { AIInsight } from '../types';

interface AIInsightsBannerProps {
  onOpenAdvisor: () => void;
}

export const AIInsightsBanner: React.FC<AIInsightsBannerProps> = ({ onOpenAdvisor }) => {
  const { insights, setActiveTab } = useFinance();

  if (!insights || insights.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-lg bg-indigo-500/10 text-indigo-500">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            AI Financial Insights & Recommendations
          </h3>
        </div>
        <button
          onClick={onOpenAdvisor}
          className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
        >
          Ask AI Advisor <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
        {insights.slice(0, 3).map((item) => {
          const isWarning = item.type === 'warning';
          const isAlert = item.type === 'alert';
          const isSuccess = item.type === 'success';

          return (
            <div
              key={item.id}
              className={`
                p-4 rounded-2xl border transition-all hover:shadow-xs flex flex-col justify-between
                ${isWarning 
                  ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200' 
                  : isAlert 
                    ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50 text-rose-900 dark:text-rose-200'
                    : isSuccess
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-200'
                      : 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900/50 text-indigo-900 dark:text-indigo-200'
                }
              `}
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 font-bold text-xs">
                    {isWarning ? <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" /> :
                     isAlert ? <AlertCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" /> :
                     isSuccess ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" /> :
                     <Lightbulb className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />}
                    <span className="truncate">{item.title}</span>
                  </div>
                  {item.impact && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/60 dark:bg-black/40 flex-shrink-0">
                      {item.impact}
                    </span>
                  )}
                </div>

                <p className="mt-2 text-xs opacity-90 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>

              {item.actionLabel && (
                <div className="mt-3 pt-2 border-t border-black/5 dark:border-white/5 flex justify-end">
                  <button
                    onClick={() => {
                      if (item.category === 'Food & Dining') setActiveTab('budgets');
                      else if (item.category === 'Subscriptions') setActiveTab('subscriptions');
                      else if (item.category === 'Goals') setActiveTab('goals');
                      else onOpenAdvisor();
                    }}
                    className="text-[11px] font-bold underline hover:opacity-80"
                  >
                    {item.actionLabel} →
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
