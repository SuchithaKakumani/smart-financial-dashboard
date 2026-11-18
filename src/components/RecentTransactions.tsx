import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ArrowLeftRight, 
  Trash2, 
  Download,
  Calendar,
  CreditCard,
  Building,
  Tag
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency, formatRelativeDate } from '../utils/formatters';
import { exportToCSV } from '../utils/exportUtils';
import { TransactionType } from '../types';

interface RecentTransactionsProps {
  onOpenAddModal: () => void;
  limit?: number;
}

export const RecentTransactions: React.FC<RecentTransactionsProps> = ({ onOpenAddModal, limit }) => {
  const { transactions, deleteTransaction, currency } = useFinance();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | TransactionType>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Categories list
  const categories = useMemo(() => {
    const set = new Set(transactions.map(t => t.category));
    return Array.from(set).sort();
  }, [transactions]);

  // Filtered transactions
  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = 
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.merchant.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase());

      const matchesType = typeFilter === 'all' || t.type === typeFilter;
      const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;

      return matchesSearch && matchesType && matchesCategory;
    });
  }, [transactions, search, typeFilter, categoryFilter]);

  const displayList = limit ? filtered.slice(0, limit) : filtered;

  return (
    <div className="p-5 lg:p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Transactions History
            </h3>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {filtered.length} total
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Audit, categorize, and search through verified inflows and outflows
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search merchant, notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none w-44 sm:w-56"
            />
          </div>

          {/* Export CSV button */}
          <button
            onClick={() => exportToCSV(filtered)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            title="Download CSV statement"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800/70">
        
        {/* Type pills */}
        <div className="flex items-center gap-1">
          {(['all', 'income', 'expense', 'transfer'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setTypeFilter(tab)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold capitalize transition-colors ${
                typeFilter === tab
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Category selector */}
        <div className="flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/80 rounded-lg px-2 py-1 text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Transactions Table / List */}
      {displayList.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          <p className="text-sm">No transactions match your filters.</p>
          <button 
            onClick={() => { setSearch(''); setTypeFilter('all'); setCategoryFilter('all'); }}
            className="mt-2 text-xs text-emerald-500 hover:underline font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-5 lg:-mx-6 px-5 lg:px-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="pb-3 pl-2">Transaction</th>
                <th className="pb-3 hidden sm:table-cell">Category</th>
                <th className="pb-3 hidden md:table-cell">Account</th>
                <th className="pb-3 hidden lg:table-cell">Date</th>
                <th className="pb-3 text-right">Amount</th>
                <th className="pb-3 text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
              {displayList.map(tx => {
                const isIncome = tx.type === 'income';
                const isExpense = tx.type === 'expense';

                return (
                  <tr key={tx.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors group">
                    
                    {/* Description & Icon */}
                    <td className="py-3.5 pl-2">
                      <div className="flex items-center gap-3">
                        <div className={`
                          w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0
                          ${isIncome 
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                            : isExpense 
                              ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' 
                              : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                          }
                        `}>
                          {isIncome ? <ArrowDownLeft className="w-4 h-4" /> : isExpense ? <ArrowUpRight className="w-4 h-4" /> : <ArrowLeftRight className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                            {tx.description}
                          </p>
                          <p className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                            <span>{tx.merchant}</span>
                            <span className="sm:hidden text-slate-300 dark:text-slate-600">•</span>
                            <span className="sm:hidden text-emerald-500">{tx.category}</span>
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 hidden sm:table-cell">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {tx.category}
                      </span>
                    </td>

                    {/* Account */}
                    <td className="py-3.5 hidden md:table-cell text-xs text-slate-500 dark:text-slate-400">
                      <span className="truncate max-w-[150px] inline-block">{tx.account}</span>
                    </td>

                    {/* Date */}
                    <td className="py-3.5 hidden lg:table-cell text-xs text-slate-500 dark:text-slate-400">
                      {formatRelativeDate(tx.date)}
                    </td>

                    {/* Amount */}
                    <td className="py-3.5 text-right font-bold text-xs sm:text-sm">
                      <span className={isIncome ? 'text-emerald-600 dark:text-emerald-400' : isExpense ? 'text-slate-900 dark:text-white' : 'text-indigo-500'}>
                        {isIncome ? '+' : isExpense ? '-' : ''}
                        {formatCurrency(tx.amount, currency)}
                      </span>
                    </td>

                    {/* Delete Action */}
                    <td className="py-3.5 text-right pr-2">
                      <button
                        onClick={() => {
                          if (confirm(`Delete transaction "${tx.description}"?`)) {
                            deleteTransaction(tx.id);
                          }
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors opacity-70 group-hover:opacity-100"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
};
