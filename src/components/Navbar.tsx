import React from 'react';
import { 
  Sun, 
  Moon, 
  Plus, 
  Download, 
  Sparkles, 
  Activity, 
  RotateCcw,
  Menu,
  ShieldCheck
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { CurrencyCode } from '../types';
import { CURRENCY_CONFIGS } from '../utils/formatters';

interface NavbarProps {
  onOpenTransactionModal: () => void;
  onOpenExportModal: () => void;
  onOpenAIAdvisor: () => void;
  toggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenTransactionModal,
  onOpenExportModal,
  onOpenAIAdvisor,
  toggleMobileMenu
}) => {
  const { 
    currency, 
    setCurrency, 
    darkMode, 
    toggleDarkMode, 
    isBackendConnected,
    resetToSampleData 
  } = useFinance();

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#0E131F]/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 px-4 lg:px-8 py-3.5 transition-colors">
      <div className="flex items-center justify-between gap-4">
        
        {/* Left: Mobile Menu + Branding */}
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 text-white font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-slate-900 via-emerald-600 to-teal-500 dark:from-white dark:via-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                  SmartFinance
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  AI 2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Intelligent Financial Intelligence Engine
              </p>
            </div>
          </div>
        </div>

        {/* Center / Right: Actions & Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Backend Connection Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-300">
            <span className={`w-2 h-2 rounded-full ${isBackendConnected ? 'bg-emerald-500 animate-pulse' : 'bg-teal-400'}`} />
            <span>{isBackendConnected ? 'Express API Live' : 'Demo Mode (Sync Ready)'}</span>
          </div>

          {/* AI Advisor Button */}
          <button
            onClick={onOpenAIAdvisor}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 hover:from-indigo-500/20 hover:to-pink-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 transition-all hover:scale-[1.02]"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span className="hidden sm:inline">AI Advisor</span>
          </button>

          {/* Currency Dropdown */}
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
            className="bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 text-xs rounded-xl px-2.5 py-1.5 font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors"
          >
            {Object.entries(CURRENCY_CONFIGS).map(([code, config]) => (
              <option key={code} value={code} className="dark:bg-slate-800">
                {config.label}
              </option>
            ))}
          </select>

          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* Export Report */}
          <button
            onClick={onOpenExportModal}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            title="Export Report"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          {/* Reset Demo Data Button */}
          <button
            onClick={resetToSampleData}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Reset to default sample data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo</span>
          </button>

          {/* Primary Action: Add Transaction */}
          <button
            onClick={onOpenTransactionModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Transaction</span>
          </button>

          {/* User Profile Badge */}
          <div className="flex items-center gap-2 pl-1 border-l border-slate-200 dark:border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-emerald-500/30">
              SK
            </div>
            <div className="hidden xl:block text-left">
              <div className="flex items-center gap-1">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-100">Suchitha K.</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Pro Portfolio</span>
            </div>
          </div>

        </div>

      </div>
    </header>
  );
};
