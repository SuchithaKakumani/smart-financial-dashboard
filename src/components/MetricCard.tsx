import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';

interface MetricCardProps {
  title: string;
  amount: number;
  change?: number; // e.g. 12.5 means +12.5%
  changeLabel?: string;
  isPositiveGood?: boolean;
  icon: React.FC<{ className?: string }>;
  iconBg: string;
  iconColor: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  amount,
  change,
  changeLabel = 'vs last month',
  isPositiveGood = true,
  icon: Icon,
  iconBg,
  iconColor
}) => {
  const { currency } = useFinance();

  const isPositive = change !== undefined && change > 0;
  const isNeutral = change === undefined || change === 0;
  const isGood = isPositive ? isPositiveGood : !isPositiveGood;

  return (
    <div className="relative overflow-hidden p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all group">
      
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {title}
          </p>
          <h3 className="mt-2 text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {formatCurrency(amount, currency)}
          </h3>
        </div>

        <div className={`p-3 rounded-2xl ${iconBg} ${iconColor} transition-transform group-hover:scale-110 duration-200`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {change !== undefined && (
        <div className="mt-4 flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
          <span className={`
            inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold
            ${isNeutral 
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400' 
              : isGood 
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
            }
          `}>
            {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : isNeutral ? <Minus className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {isPositive ? `+${change}%` : `${change}%`}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 truncate">
            {changeLabel}
          </span>
        </div>
      )}

      {/* Decorative gradient corner accent */}
      <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-5 pointer-events-none ${iconBg}`} />
    </div>
  );
};
