import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  ArrowRight, 
  DollarSign, 
  PieChart, 
  Compass, 
  Zap, 
  Layers,
  ArrowUpRight,
  Lightbulb
} from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { CalculatorInputs } from '../types';
import { computeFinancialPlan, generateCalculatorAISuggestion } from '../services/calculatorService';
import { formatCurrency } from '../utils/formatters';

interface FinancialCalculatorProps {
  onOpenAIAdvisor?: () => void;
}

export const FinancialCalculator: React.FC<FinancialCalculatorProps> = ({ onOpenAIAdvisor }) => {
  const { transactions, budgets, goals, currency, triggerConfetti } = useFinance();

  // Extract live dashboard totals for quick auto-fill
  const liveIncome = useMemo(() => {
    return transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0) || 10250;
  }, [transactions]);

  const liveExpenses = useMemo(() => {
    return transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0) || 4010;
  }, [transactions]);

  const liveSavings = useMemo(() => {
    return goals.reduce((s, g) => s + g.currentAmount, 0) + 24500;
  }, [goals]);

  // Calculator State
  const [inputs, setInputs] = useState<CalculatorInputs>({
    monthlyIncome: 10250,
    essentialExpenses: 3200,
    discretionaryExpenses: 1450,
    debtPayments: 450,
    currentSavings: 28500,
    monthlyInvestment: 1800,
    annualReturnRate: 8.5,
    timeHorizonYears: 10
  });

  // Dynamic calculations
  const results = useMemo(() => computeFinancialPlan(inputs), [inputs]);
  const aiSuggestion = useMemo(() => generateCalculatorAISuggestion(inputs, results), [inputs, results]);

  const handleInputChange = (field: keyof CalculatorInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: isNaN(value) ? 0 : value }));
  };

  // Presets
  const applyPreset = (preset: 'live' | 'starter' | 'hightech' | 'fire') => {
    if (preset === 'live') {
      const essential = Math.round(liveExpenses * 0.65);
      const discretionary = Math.round(liveExpenses * 0.35);
      setInputs({
        monthlyIncome: Math.round(liveIncome),
        essentialExpenses: essential,
        discretionaryExpenses: discretionary,
        debtPayments: 350,
        currentSavings: Math.round(liveSavings),
        monthlyInvestment: Math.round(Math.max(500, (liveIncome - liveExpenses) * 0.6)),
        annualReturnRate: 8.0,
        timeHorizonYears: 10
      });
    } else if (preset === 'starter') {
      setInputs({
        monthlyIncome: 4800,
        essentialExpenses: 2400,
        discretionaryExpenses: 1200,
        debtPayments: 400,
        currentSavings: 6500,
        monthlyInvestment: 500,
        annualReturnRate: 7.5,
        timeHorizonYears: 10
      });
    } else if (preset === 'hightech') {
      setInputs({
        monthlyIncome: 14500,
        essentialExpenses: 4500,
        discretionaryExpenses: 2800,
        debtPayments: 800,
        currentSavings: 65000,
        monthlyInvestment: 3500,
        annualReturnRate: 9.0,
        timeHorizonYears: 15
      });
    } else if (preset === 'fire') {
      setInputs({
        monthlyIncome: 9500,
        essentialExpenses: 2800,
        discretionaryExpenses: 1100,
        debtPayments: 0,
        currentSavings: 85000,
        monthlyInvestment: 4500,
        annualReturnRate: 8.5,
        timeHorizonYears: 12
      });
    }
    triggerConfetti();
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="p-6 lg:p-8 rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-emerald-700/30">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-white/10 backdrop-blur-md text-emerald-300">
              <Calculator className="w-5 h-5" />
            </span>
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-300">
              Interactive Financial Health & Scenario Calculator
            </span>
          </div>
          <h2 className="mt-2 text-2xl lg:text-3xl font-extrabold tracking-tight">
            Calculate Cashflow, Compounding & AI Strategy
          </h2>
          <p className="mt-1 text-xs text-emerald-100 max-w-xl">
            Input your income, expenses, and investment assumptions. Our AI engine instantly computes your 50/30/20 balance, DTI risk, emergency runway, and generates personalized recommendations.
          </p>
        </div>

        {/* Preset quick actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => applyPreset('live')}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-white shadow-sm transition-all"
          >
            ⚡ Auto-Fill From Dashboard
          </button>
          <button
            onClick={() => applyPreset('starter')}
            className="px-3 py-2 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
          >
            🌱 Starter
          </button>
          <button
            onClick={() => applyPreset('hightech')}
            className="px-3 py-2 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
          >
            🚀 Tech Earner
          </button>
          <button
            onClick={() => applyPreset('fire')}
            className="px-3 py-2 rounded-xl text-xs font-medium bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
          >
            🔥 FIRE Strategy
          </button>
        </div>
      </div>

      {/* Main Grid: User Inputs (Left) vs Calculations & AI Suggestions (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: USER INPUT CONTROLS (5 COLS) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Your Monthly Financial Inputs
              </h3>
              <p className="text-xs text-slate-400">
                Adjust values to simulate different scenarios
              </p>
            </div>
            <button
              onClick={() => applyPreset('live')}
              className="p-1.5 text-slate-400 hover:text-emerald-500 rounded-lg transition-colors"
              title="Reset inputs"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4 text-xs">
            
            {/* Monthly Take-Home Income */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <label className="text-slate-700 dark:text-slate-300">Monthly Net Income</label>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {formatCurrency(inputs.monthlyIncome, currency)}
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="30000"
                step="250"
                value={inputs.monthlyIncome}
                onChange={(e) => handleInputChange('monthlyIncome', Number(e.target.value))}
                className="w-full accent-emerald-500 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                <span>$1k</span>
                <input
                  type="number"
                  value={inputs.monthlyIncome}
                  onChange={(e) => handleInputChange('monthlyIncome', Number(e.target.value))}
                  className="w-24 px-1.5 py-0.5 text-right bg-slate-50 dark:bg-slate-800 border rounded font-semibold focus:outline-none"
                />
                <span>$30k</span>
              </div>
            </div>

            {/* Essential Expenses (Needs) */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <label className="text-slate-700 dark:text-slate-300">
                  Essential Needs (Rent, Bills, Food)
                </label>
                <span className="text-slate-900 dark:text-white font-bold">
                  {formatCurrency(inputs.essentialExpenses, currency)}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="15000"
                step="100"
                value={inputs.essentialExpenses}
                onChange={(e) => handleInputChange('essentialExpenses', Number(e.target.value))}
                className="w-full accent-blue-500 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                <span>$500</span>
                <input
                  type="number"
                  value={inputs.essentialExpenses}
                  onChange={(e) => handleInputChange('essentialExpenses', Number(e.target.value))}
                  className="w-24 px-1.5 py-0.5 text-right bg-slate-50 dark:bg-slate-800 border rounded font-semibold focus:outline-none"
                />
                <span>$15k</span>
              </div>
            </div>

            {/* Discretionary Expenses (Wants) */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <label className="text-slate-700 dark:text-slate-300">
                  Discretionary Wants (Dining, Shopping)
                </label>
                <span className="text-slate-900 dark:text-white font-bold">
                  {formatCurrency(inputs.discretionaryExpenses, currency)}
                </span>
              </div>
              <input
                type="range"
                min="200"
                max="10000"
                step="50"
                value={inputs.discretionaryExpenses}
                onChange={(e) => handleInputChange('discretionaryExpenses', Number(e.target.value))}
                className="w-full accent-purple-500 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                <span>$200</span>
                <input
                  type="number"
                  value={inputs.discretionaryExpenses}
                  onChange={(e) => handleInputChange('discretionaryExpenses', Number(e.target.value))}
                  className="w-24 px-1.5 py-0.5 text-right bg-slate-50 dark:bg-slate-800 border rounded font-semibold focus:outline-none"
                />
                <span>$10k</span>
              </div>
            </div>

            {/* Monthly Debt Payments */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <label className="text-slate-700 dark:text-slate-300">
                  Debt & Loan Payments (Car, Loans)
                </label>
                <span className="text-rose-500 font-bold">
                  {formatCurrency(inputs.debtPayments, currency)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="5000"
                step="50"
                value={inputs.debtPayments}
                onChange={(e) => handleInputChange('debtPayments', Number(e.target.value))}
                className="w-full accent-rose-500 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                <span>$0</span>
                <input
                  type="number"
                  value={inputs.debtPayments}
                  onChange={(e) => handleInputChange('debtPayments', Number(e.target.value))}
                  className="w-24 px-1.5 py-0.5 text-right bg-slate-50 dark:bg-slate-800 border rounded font-semibold focus:outline-none"
                />
                <span>$5k</span>
              </div>
            </div>

            {/* Current Savings Buffer */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <label className="text-slate-700 dark:text-slate-300">
                  Current Liquid Savings / Assets
                </label>
                <span className="text-teal-600 dark:text-teal-400 font-bold">
                  {formatCurrency(inputs.currentSavings, currency)}
                </span>
              </div>
              <input
                type="range"
                min="1000"
                max="200000"
                step="1000"
                value={inputs.currentSavings}
                onChange={(e) => handleInputChange('currentSavings', Number(e.target.value))}
                className="w-full accent-teal-500 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                <span>$1k</span>
                <input
                  type="number"
                  value={inputs.currentSavings}
                  onChange={(e) => handleInputChange('currentSavings', Number(e.target.value))}
                  className="w-24 px-1.5 py-0.5 text-right bg-slate-50 dark:bg-slate-800 border rounded font-semibold focus:outline-none"
                />
                <span>$200k</span>
              </div>
            </div>

            {/* Monthly Investment & Compounding Settings */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Compounding Growth Settings
              </h4>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Monthly Investment</label>
                  <input
                    type="number"
                    value={inputs.monthlyInvestment}
                    onChange={(e) => handleInputChange('monthlyInvestment', Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-500 mb-1">Return Rate (% APY)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={inputs.annualReturnRate}
                    onChange={(e) => handleInputChange('annualReturnRate', Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800 border rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <label className="text-slate-600 dark:text-slate-400">Time Horizon</label>
                  <span className="font-bold text-slate-900 dark:text-white">{inputs.timeHorizonYears} Years</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="35"
                  step="1"
                  value={inputs.timeHorizonYears}
                  onChange={(e) => handleInputChange('timeHorizonYears', Number(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

          </div>
        </div>

        {/* RIGHT COLUMN: CALCULATED METRICS & AI STRATEGIC SUGGESTIONS (7 COLS) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* 4 Primary Calculated KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            {/* Free Cashflow */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Monthly Surplus</span>
              <h4 className={`text-lg font-extrabold mt-1 ${results.monthlySurplus >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                {results.monthlySurplus >= 0 ? '+' : ''}{formatCurrency(results.monthlySurplus, currency)}
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Free net cashflow</p>
            </div>

            {/* Savings Rate */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Savings Velocity</span>
              <h4 className="text-lg font-extrabold text-indigo-500 mt-1">
                {results.savingsRate}%
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Target: &ge; 20%</p>
            </div>

            {/* DTI Ratio */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Debt-to-Income</span>
              <h4 className={`text-lg font-extrabold mt-1 ${results.dtiRatio <= 30 ? 'text-teal-500' : 'text-rose-500'}`}>
                {results.dtiRatio}%
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Safe ceiling: &le; 36%</p>
            </div>

            {/* Emergency Runway */}
            <div className="p-4 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">Emergency Runway</span>
              <h4 className="text-lg font-extrabold text-cyan-500 mt-1">
                {results.emergencyFundMonths} mo
              </h4>
              <p className="text-[10px] text-slate-400 mt-0.5">Buffer: 3-6 months</p>
            </div>

          </div>

          {/* 50/30/20 Visual Rule Comparison */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-emerald-500" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  50/30/20 Rule Adherence Analysis
                </h4>
              </div>
              <span className="text-[11px] font-bold text-slate-500">
                Grade: <span className="text-emerald-500 font-extrabold">{results.grade}</span>
              </span>
            </div>

            {/* Tri-color comparison progress bar */}
            <div className="space-y-1.5 text-xs">
              <div className="h-3.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                <div 
                  className="bg-blue-500 h-full transition-all duration-500"
                  style={{ width: `${Math.min(100, results.needsPercent)}%` }}
                  title={`Needs: ${results.needsPercent}% (Ideal 50%)`}
                />
                <div 
                  className="bg-purple-500 h-full transition-all duration-500"
                  style={{ width: `${Math.min(100 - results.needsPercent, results.wantsPercent)}%` }}
                  title={`Wants: ${results.wantsPercent}% (Ideal 30%)`}
                />
                <div 
                  className="bg-emerald-500 h-full transition-all duration-500 flex-1"
                  title={`Savings: ${results.savingsPercent}% (Ideal 20%)`}
                />
              </div>

              {/* Legends with deltas */}
              <div className="grid grid-cols-3 gap-2 pt-1 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Needs: {results.needsPercent}%</span>
                    <span className="block text-[10px] text-slate-400">Target 50% ({aiSuggestion.rule503020Comparison.needs.diff >= 0 ? `+$${aiSuggestion.rule503020Comparison.needs.diff}` : `-$${Math.abs(aiSuggestion.rule503020Comparison.needs.diff)}`})</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Wants: {results.wantsPercent}%</span>
                    <span className="block text-[10px] text-slate-400">Target 30% ({aiSuggestion.rule503020Comparison.wants.diff >= 0 ? `+$${aiSuggestion.rule503020Comparison.wants.diff}` : `-$${Math.abs(aiSuggestion.rule503020Comparison.wants.diff)}`})</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0" />
                  <div>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Savings: {results.savingsPercent}%</span>
                    <span className="block text-[10px] text-slate-400">Target 20%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Compound Wealth Horizon Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-slate-900/60 border border-indigo-500/20 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-1.5 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Projected Wealth in {inputs.timeHorizonYears} Years</span>
              </div>
              <h3 className="mt-1 text-2xl font-extrabold text-white">
                {formatCurrency(results.futureWealthValue, currency)}
              </h3>
              <p className="text-xs text-indigo-200 mt-0.5">
                Invested: {formatCurrency(results.totalContributions, currency)} • Compound Gain: <span className="text-emerald-400 font-bold">+{formatCurrency(results.totalInterestEarned, currency)}</span>
              </p>
            </div>

            <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-center">
              @{inputs.annualReturnRate}% APY
            </span>
          </div>

          {/* DYNAMIC AI SUGGESTION & DIAGNOSIS BOX */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/30 shadow-xl space-y-4">
            
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">
                      AI Strategic Diagnosis
                    </h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${aiSuggestion.badgeColor}`}>
                      {aiSuggestion.verdict}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Real-time analysis based on your exact calculated figures
                  </p>
                </div>
              </div>

              {onOpenAIAdvisor && (
                <button
                  onClick={onOpenAIAdvisor}
                  className="hidden sm:flex items-center gap-1 text-xs font-semibold text-indigo-300 hover:text-white transition-colors"
                >
                  <span>Chat with Copilot</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <p className="text-xs text-indigo-100 leading-relaxed bg-white/5 p-3 rounded-2xl border border-white/5">
              {aiSuggestion.summary}
            </p>

            {/* AI Specific Actionable Recommendations */}
            <div className="space-y-2.5">
              {aiSuggestion.recommendations.map((rec, idx) => (
                <div 
                  key={idx}
                  className="p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-400/30 transition-all text-xs space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 font-bold text-white">
                      {rec.type === 'warning' ? (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                      ) : rec.type === 'positive' ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      ) : (
                        <Lightbulb className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                      )}
                      <span>{rec.title}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-emerald-300 flex-shrink-0">
                      {rec.impact}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 pl-5.5 leading-relaxed">
                    {rec.description}
                  </p>
                </div>
              ))}
            </div>

            {onOpenAIAdvisor && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={onOpenAIAdvisor}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Ask AI Financial Copilot About This Scenario</span>
                </button>
              </div>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
