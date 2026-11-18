import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';

const CATEGORY_COLORS: Record<string, string> = {
  'Housing': '#3B82F6',
  'Food & Dining': '#10B981',
  'Shopping': '#8B5CF6',
  'Transportation': '#F59E0B',
  'Entertainment': '#EC4899',
  'Utilities': '#06B6D4',
  'Health & Fitness': '#14B8A6',
  'Travel': '#F43F5E',
  'Software & Tech': '#6366F1',
  'Other': '#64748B'
};

export const ExpenseBreakdown: React.FC = () => {
  const { transactions, currency } = useFinance();

  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const totalExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0) || 1;

  // Aggregate by category
  const categoryTotals: Record<string, number> = {};
  expenseTransactions.forEach(t => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });

  const data = Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      name: category,
      value: amount,
      color: CATEGORY_COLORS[category] || '#64748B',
      percentage: ((amount / totalExpense) * 100).toFixed(1)
    }))
    .sort((a, b) => b.value - a.value);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-xl shadow-xl text-xs space-y-1">
          <p className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            {item.name}
          </p>
          <p className="text-slate-600 dark:text-slate-300 font-semibold">
            {formatCurrency(item.value, currency)} ({item.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-5 lg:p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
      
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Expense Allocation
          </h3>
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {data.length} Categories
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Distribution across lifestyle & essential expenditures
        </p>
      </div>

      {/* Donut Chart with central metric */}
      <div className="relative h-48 my-3">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider">Total</span>
          <span className="text-sm font-extrabold text-slate-900 dark:text-white">
            {formatCurrency(totalExpense, currency)}
          </span>
        </div>
      </div>

      {/* Top 4 Categories list */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
        {data.slice(0, 4).map((cat) => (
          <div key={cat.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate">
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
              <span className="text-slate-700 dark:text-slate-300 font-medium truncate">{cat.name}</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">{cat.percentage}%</span>
              <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(cat.value, currency)}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
