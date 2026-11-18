import React from 'react';
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  PieChart, 
  Target, 
  WalletCards, 
  TrendingUp, 
  Sparkles, 
  CreditCard,
  X,
  HeartPulse,
  ChevronRight
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { ViewTab } from '../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAIAdvisor: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onOpenAIAdvisor }) => {
  const { activeTab, setActiveTab, transactions, subscriptions, healthScore } = useFinance();

  const navItems: { id: ViewTab; label: string; icon: React.FC<{ className?: string }>; badge?: string | number; badgeColor?: string }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight, badge: transactions.length },
    { id: 'analytics', label: 'Cash Flow & Analytics', icon: PieChart },
    { id: 'budgets', label: 'Smart Budgets', icon: WalletCards },
    { id: 'goals', label: 'Savings Goals', icon: Target },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard, badge: subscriptions.filter(s => s.status === 'to_review').length || undefined, badgeColor: 'bg-amber-500' },
    { id: 'investments', label: 'Investments', icon: TrendingUp },
    { id: 'ai-advisor', label: 'AI Advisor', icon: Sparkles, badge: 'AI', badgeColor: 'bg-indigo-500 text-white' },
  ];

  const handleSelect = (tab: ViewTab) => {
    setActiveTab(tab);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-40 h-screen w-64
        bg-white dark:bg-[#0E131F] border-r border-slate-200/80 dark:border-slate-800/80
        flex flex-col justify-between py-6 px-4
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        <div>
          {/* Header Mobile Close */}
          <div className="flex items-center justify-between pb-4 mb-2 lg:hidden border-b border-slate-100 dark:border-slate-800">
            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">Navigation</span>
            <button 
              onClick={onClose}
              className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 mb-2.5">
            Main Menu
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id)}
                  className={`
                    w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                    ${isActive 
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold shadow-sm' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className={`
                      text-[10px] font-bold px-2 py-0.5 rounded-full
                      ${item.badgeColor 
                        ? `${item.badgeColor} text-white` 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }
                    `}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Health Score Widget */}
        <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800/80 space-y-3">
          <div 
            onClick={onOpenAIAdvisor}
            className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-cyan-500/10 border border-emerald-500/20 cursor-pointer hover:border-emerald-500/40 transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
                <HeartPulse className="w-4 h-4 text-emerald-500" />
                <span>Health Score</span>
              </div>
              <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                {healthScore.score}/100
              </span>
            </div>

            {/* Score progress bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gradient-to-r from-teal-400 to-emerald-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${healthScore.score}%` }}
              />
            </div>

            <div className="flex items-center justify-between mt-2 pt-1">
              <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                {healthScore.rating}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center group-hover:text-emerald-500 transition-colors">
                View AI Audit <ChevronRight className="w-3 h-3 ml-0.5" />
              </span>
            </div>
          </div>

          <div className="text-center text-[11px] text-slate-400 dark:text-slate-600">
            Smart Financial Dashboard v2.0
          </div>
        </div>

      </aside>
    </>
  );
};
