import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  Layers, 
  Sparkles,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { formatCurrency } from '../utils/formatters';

export const InvestmentWatchlist: React.FC = () => {
  const { investments, currency } = useFinance();

  const totalPortfolioValue = investments.reduce((sum, inv) => sum + (inv.shares * inv.currentPrice), 0);
  const totalCostBasis = investments.reduce((sum, inv) => sum + (inv.shares * inv.buyPrice), 0);
  const totalGain = totalPortfolioValue - totalCostBasis;
  const totalGainPercent = totalCostBasis > 0 ? ((totalGain / totalCostBasis) * 100).toFixed(2) : '0';

  return (
    <div className="space-y-6">
      
      {/* Portfolio Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Investment Portfolio
          </p>
          <h3 className="mt-2 text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white">
            {formatCurrency(totalPortfolioValue, currency)}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Stocks, ETFs & Digital Assets
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            All-Time Unrealized Profit
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              +{formatCurrency(totalGain, currency)}
            </h3>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              +{totalGainPercent}%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Cost basis: {formatCurrency(totalCostBasis, currency)}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            24h Estimated Movement
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              +{formatCurrency(totalPortfolioValue * 0.021, currency)}
            </h3>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
              +2.14%
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Market rally driven by NVDA & Tech
          </p>
        </div>

      </div>

      {/* Holdings Table */}
      <div className="p-5 lg:p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Watchlist & Active Holdings
            </h3>
            <p className="text-xs text-slate-400">
              Live market quotations and positions
            </p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            Realtime Pulses
          </span>
        </div>

        <div className="overflow-x-auto -mx-5 lg:-mx-6 px-5 lg:px-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800/60 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="pb-3 pl-2">Asset</th>
                <th className="pb-3 text-right">Price</th>
                <th className="pb-3 text-right">24h Change</th>
                <th className="pb-3 text-center hidden md:table-cell">Trend (7D)</th>
                <th className="pb-3 text-right hidden sm:table-cell">Holdings</th>
                <th className="pb-3 text-right pr-2">Market Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-xs">
              {investments.map(inv => {
                const isGain = inv.change24h >= 0;
                const holdingValue = inv.shares * inv.currentPrice;
                const totalPositionGain = (inv.currentPrice - inv.buyPrice) * inv.shares;

                return (
                  <tr key={inv.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30 transition-colors">
                    
                    {/* Symbol & Name */}
                    <td className="py-3.5 pl-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-extrabold text-xs text-slate-800 dark:text-slate-200">
                          {inv.symbol.slice(0, 3)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-900 dark:text-white">{inv.symbol}</span>
                            <span className="text-[10px] font-semibold uppercase px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                              {inv.type}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate max-w-[120px] sm:max-w-none">
                            {inv.name}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Current Price */}
                    <td className="py-3.5 text-right font-semibold text-slate-900 dark:text-white">
                      {formatCurrency(inv.currentPrice, currency)}
                    </td>

                    {/* 24h Change */}
                    <td className="py-3.5 text-right">
                      <span className={`inline-flex items-center gap-0.5 font-bold ${isGain ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                        {isGain ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        {isGain ? `+${inv.change24h}%` : `${inv.change24h}%`}
                      </span>
                    </td>

                    {/* Mini SVG Sparkline */}
                    <td className="py-3.5 text-center hidden md:table-cell">
                      <div className="flex justify-center">
                        <svg className="w-20 h-6 overflow-visible" viewBox="0 0 100 30">
                          <polyline
                            fill="none"
                            stroke={isGain ? '#10B981' : '#F43F5E'}
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            points={inv.sparkline.map((val, idx) => {
                              const min = Math.min(...inv.sparkline);
                              const max = Math.max(...inv.sparkline);
                              const range = max - min || 1;
                              const x = (idx / (inv.sparkline.length - 1)) * 90 + 5;
                              const y = 26 - ((val - min) / range) * 22;
                              return `${x},${y}`;
                            }).join(' ')}
                          />
                        </svg>
                      </div>
                    </td>

                    {/* Holdings */}
                    <td className="py-3.5 text-right hidden sm:table-cell">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">
                        {inv.shares} {inv.symbol}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Avg: {formatCurrency(inv.buyPrice, currency)}
                      </p>
                    </td>

                    {/* Total Market Value */}
                    <td className="py-3.5 text-right pr-2">
                      <p className="font-bold text-slate-900 dark:text-white">
                        {formatCurrency(holdingValue, currency)}
                      </p>
                      <p className={`text-[11px] font-semibold ${totalPositionGain >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {totalPositionGain >= 0 ? '+' : ''}{formatCurrency(totalPositionGain, currency)}
                      </p>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
