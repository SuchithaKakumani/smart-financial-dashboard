import React, { useState } from 'react';
import { 
  WalletCards, 
  AlertTriangle, 
  CheckCircle2, 
  Edit3, 
  Plus, 
  TrendingUp,
  DollarSign,
  PieChart
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';

export const BudgetManager: React.FC = () => {
  const { budgets, transactions, currency, updateBudget } = useFinance();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  // Calculate spent per budget category for current month
  const now = new Date();
  const currentMonthTransactions = transactions.filter(t => {
    const d = new Date(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear() && t.type === 'expense';
  });

  const totalAllocated = budgets.reduce((sum, b) => sum + b.allocated, 0);
  const totalSpent = currentMonthTransactions.reduce((sum, t) => sum + t.amount, 0);

  const handleStartEdit = (id: string, currentVal: number) => {
    setEditingId(id);
    setEditValue(currentVal.toString());
  };

  const handleSaveEdit = async (id: string) => {
    const val = parseFloat(editValue);
    if (!isNaN(val) && val > 0) {
      await updateBudget(id, val);
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Summary */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white shadow-xl shadow-emerald-900/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-white/10 backdrop-blur-md">
              <WalletCards className="w-5 h-5 text-emerald-200" />
            </span>
            <span className="text-xs uppercase font-bold tracking-wider text-emerald-200">
              Monthly Budget Governor
            </span>
          </div>
          <h2 className="mt-2 text-2xl lg:text-3xl font-extrabold tracking-tight">
            {formatCurrency(totalSpent, currency)} spent of {formatCurrency(totalAllocated, currency)}
          </h2>
          <p className="mt-1 text-xs text-emerald-100 max-w-md">
            You have used {((totalSpent / totalAllocated) * 100).toFixed(1)}% of your planned monthly budget envelope. 
            {totalAllocated > totalSpent ? ` Remaining buffer: ${formatCurrency(totalAllocated - totalSpent, currency)}.` : ' Budget threshold exceeded.'}
          </p>
        </div>

        {/* Global Progress Gauge */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 min-w-[200px] border border-white/20">
          <div className="flex items-center justify-between text-xs font-semibold mb-2 text-emerald-100">
            <span>Overall Adherence</span>
            <span className="font-extrabold text-white">{((totalSpent / totalAllocated) * 100).toFixed(0)}%</span>
          </div>
          <div className="w-full bg-black/20 h-2.5 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-700 ${totalSpent > totalAllocated ? 'bg-rose-400' : 'bg-emerald-300'}`}
              style={{ width: `${Math.min(100, (totalSpent / totalAllocated) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-emerald-200 mt-2 text-right">
            11 days remaining in cycle
          </p>
        </div>
      </div>

      {/* Budget Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {budgets.map((b) => {
          const spent = currentMonthTransactions
            .filter(t => t.category.toLowerCase() === b.category.toLowerCase())
            .reduce((sum, t) => sum + t.amount, 0);

          const percent = Math.round((spent / b.allocated) * 100);
          const isOver = percent >= 100;
          const isWarning = percent >= 80 && percent < 100;

          return (
            <div 
              key={b.id}
              className={`
                p-5 rounded-2xl bg-white dark:bg-[#111827] border transition-all duration-200 shadow-xs hover:shadow-md
                ${isOver 
                  ? 'border-rose-400/80 dark:border-rose-900/60 ring-1 ring-rose-500/20' 
                  : isWarning 
                    ? 'border-amber-400/80 dark:border-amber-900/60' 
                    : 'border-slate-200/80 dark:border-slate-800/80'
                }
              `}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {b.category}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {b.period} allowance
                  </p>
                </div>

                <div 
                  className="w-3.5 h-3.5 rounded-full" 
                  style={{ backgroundColor: b.color }} 
                  title={`Color: ${b.color}`} 
                />
              </div>

              {/* Progress Bar */}
              <div className="mt-4 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {formatCurrency(spent, currency)}
                  </span>
                  <span className="text-slate-400">
                    of {formatCurrency(b.allocated, currency)}
                  </span>
                </div>

                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isOver 
                        ? 'bg-rose-500' 
                        : isWarning 
                          ? 'bg-amber-500' 
                          : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(100, percent)}%` }}
                  />
                </div>
              </div>

              {/* Card Footer Status */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/70 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {isOver ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Over by {formatCurrency(spent - b.allocated, currency)}
                    </span>
                  ) : (
                    <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      {formatCurrency(b.allocated - spent, currency)} left
                    </span>
                  )}
                </div>

                {/* Edit inline */}
                {editingId === b.id ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="w-16 px-1.5 py-0.5 text-xs bg-slate-100 dark:bg-slate-800 border rounded font-semibold focus:outline-none"
                    />
                    <button
                      onClick={() => handleSaveEdit(b.id)}
                      className="text-xs px-2 py-0.5 rounded bg-emerald-600 text-white font-bold"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleStartEdit(b.id, b.allocated)}
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded transition-colors"
                    title="Change allocated budget"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
