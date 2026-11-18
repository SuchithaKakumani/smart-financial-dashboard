import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  ArrowUpRight, 
  ArrowDownLeft, 
  ShieldCheck, 
  Wallet,
  Sparkles,
  CreditCard,
  Target,
  ArrowRight
} from 'lucide-react';
import { useFinance } from './context/FinanceContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { MetricCard } from './components/MetricCard';
import { CashFlowChart } from './components/CashFlowChart';
import { ExpenseBreakdown } from './components/ExpenseBreakdown';
import { RecentTransactions } from './components/RecentTransactions';
import { BudgetManager } from './components/BudgetManager';
import { SavingsGoals } from './components/SavingsGoals';
import { SubscriptionsManager } from './components/SubscriptionsManager';
import { InvestmentWatchlist } from './components/InvestmentWatchlist';
import { AIAdvisorModal } from './components/AIAdvisorModal';
import { ExportReportModal } from './components/ExportReportModal';
import { TransactionModal } from './components/TransactionModal';
import { AIInsightsBanner } from './components/AIInsightsBanner';
import { FinancialCalculator } from './components/FinancialCalculator';
import { formatCurrency } from './utils/formatters';

export const App: React.FC = () => {
  const { 
    transactions, 
    budgets, 
    goals, 
    investments, 
    subscriptions, 
    healthScore, 
    currency, 
    activeTab, 
    setActiveTab, 
    loading 
  } = useFinance();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAIAdvisorOpen, setIsAIAdvisorOpen] = useState(false);

  // Income & Expense totals for current period
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalInvestments = investments.reduce((sum, i) => sum + (i.shares * i.currentPrice), 0);
  const totalCashAndSavings = 42500 + goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const netWorth = totalCashAndSavings + totalInvestments;

  const savingsRate = totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0A0E1A] flex transition-colors">
      
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        onOpenAIAdvisor={() => setIsAIAdvisorOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Navbar */}
        <Navbar 
          onOpenTransactionModal={() => setIsTransactionModalOpen(true)}
          onOpenExportModal={() => setIsExportModalOpen(true)}
          onOpenAIAdvisor={() => setIsAIAdvisorOpen(true)}
          toggleMobileMenu={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        {/* Content Body */}
        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* 4 Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title="Total Net Worth"
                  amount={netWorth}
                  change={14.2}
                  changeLabel="vs last month"
                  icon={Wallet}
                  iconBg="bg-emerald-500/10"
                  iconColor="text-emerald-500"
                />
                <MetricCard
                  title="Monthly Inflows"
                  amount={totalIncome}
                  change={8.5}
                  changeLabel="vs last month"
                  icon={ArrowDownLeft}
                  iconBg="bg-teal-500/10"
                  iconColor="text-teal-500"
                />
                <MetricCard
                  title="Monthly Outflows"
                  amount={totalExpense}
                  change={-4.1}
                  changeLabel="vs last month"
                  isPositiveGood={false}
                  icon={ArrowUpRight}
                  iconBg="bg-rose-500/10"
                  iconColor="text-rose-500"
                />
                <MetricCard
                  title="Savings Velocity"
                  amount={totalIncome - totalExpense}
                  change={savingsRate}
                  changeLabel={`${savingsRate}% savings rate`}
                  icon={TrendingUp}
                  iconBg="bg-indigo-500/10"
                  iconColor="text-indigo-500"
                />
              </div>

              {/* AI Insights & Alerts Carousel */}
              <AIInsightsBanner onOpenAdvisor={() => setIsAIAdvisorOpen(true)} />

              {/* Calculator Quick Interactive Banner */}
              <div 
                onClick={() => setActiveTab('calculator')}
                className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-indigo-500/10 border border-emerald-500/20 hover:border-emerald-500/40 cursor-pointer transition-all flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold flex-shrink-0 shadow-md shadow-emerald-500/20">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Interactive Financial Health & Scenario Calculator</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500 text-white">
                        Try It
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Input your own income, expenses, and debts to calculate your 50/30/20 split, emergency buffer, and receive tailored AI strategy suggestions.
                    </p>
                  </div>
                </div>

                <span className="hidden sm:flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
                  Launch Calculator <ArrowRight className="w-4 h-4" />
                </span>
              </div>

              {/* Two Column Layout: Charts & Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left (2 cols): Cash Flow Trend Chart */}
                <div className="lg:col-span-2">
                  <CashFlowChart />
                </div>

                {/* Right (1 col): Donut Expense Allocation */}
                <div className="lg:col-span-1">
                  <ExpenseBreakdown />
                </div>

              </div>

              {/* Bottom Section: Recent Transactions + Goals Snippet */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Recent Transactions List (2 cols) */}
                <div className="lg:col-span-2">
                  <RecentTransactions 
                    onOpenAddModal={() => setIsTransactionModalOpen(true)} 
                    limit={6} 
                  />
                  <div className="mt-3 text-right">
                    <button
                      onClick={() => setActiveTab('transactions')}
                      className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                    >
                      View all {transactions.length} transactions <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Mini Goals & Subscriptions Quick Cards (1 col) */}
                <div className="space-y-4 lg:col-span-1">
                  
                  {/* Goals mini card */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-indigo-500" />
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                          Savings Milestones
                        </h4>
                      </div>
                      <button
                        onClick={() => setActiveTab('goals')}
                        className="text-[11px] font-bold text-indigo-500 hover:underline"
                      >
                        Manage
                      </button>
                    </div>

                    <div className="space-y-3">
                      {goals.slice(0, 3).map(g => {
                        const pct = Math.min(100, Math.round((g.currentAmount / g.targetAmount) * 100));
                        return (
                          <div key={g.id} className="text-xs space-y-1">
                            <div className="flex justify-between font-medium">
                              <span className="truncate max-w-[150px] text-slate-800 dark:text-slate-200">{g.title}</span>
                              <span className="font-bold text-indigo-600 dark:text-indigo-400">{pct}%</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                              <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Upcoming Subscriptions mini card */}
                  <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-emerald-500" />
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                          Next Renewals
                        </h4>
                      </div>
                      <button
                        onClick={() => setActiveTab('subscriptions')}
                        className="text-[11px] font-bold text-emerald-500 hover:underline"
                      >
                        View all
                      </button>
                    </div>

                    <div className="space-y-2 text-xs">
                      {subscriptions.slice(0, 3).map(s => (
                        <div key={s.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                          <span className="font-semibold text-slate-800 dark:text-slate-200">{s.name}</span>
                          <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(s.amount, currency)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB: INTERACTIVE FINANCIAL CALCULATOR & AI SUGGESTIONS */}
          {activeTab === 'calculator' && (
            <FinancialCalculator onOpenAIAdvisor={() => setIsAIAdvisorOpen(true)} />
          )}

          {/* TAB 2: TRANSACTIONS */}
          {activeTab === 'transactions' && (
            <RecentTransactions onOpenAddModal={() => setIsTransactionModalOpen(true)} />
          )}

          {/* TAB 3: CASH FLOW & ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <CashFlowChart />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ExpenseBreakdown />
                <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                      Savings & Efficiency Ratios
                    </h3>
                    <p className="text-xs text-slate-400 mb-4">
                      Institutional capital efficiency metrics
                    </p>

                    <div className="space-y-4 text-xs">
                      <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                        <span className="font-medium text-slate-600 dark:text-slate-300">Savings Rate</span>
                        <span className="font-bold text-emerald-500 text-sm">{savingsRate}% (Target: &ge;20%)</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                        <span className="font-medium text-slate-600 dark:text-slate-300">Fixed Needs Ratio</span>
                        <span className="font-bold text-indigo-500 text-sm">38.4% (Target: &le;50%)</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                        <span className="font-medium text-slate-600 dark:text-slate-300">Discretionary Ratio</span>
                        <span className="font-bold text-teal-500 text-sm">17.2% (Target: &le;30%)</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                        <span className="font-medium text-slate-600 dark:text-slate-300">Emergency Runway</span>
                        <span className="font-bold text-purple-500 text-sm">5.2 Months Liquidity</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                    Calculated in accordance with CFP standard 50/30/20 guidelines.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SMART BUDGETS */}
          {activeTab === 'budgets' && (
            <BudgetManager />
          )}

          {/* TAB 5: SAVINGS GOALS */}
          {activeTab === 'goals' && (
            <SavingsGoals />
          )}

          {/* TAB 6: SUBSCRIPTIONS */}
          {activeTab === 'subscriptions' && (
            <SubscriptionsManager />
          )}

          {/* TAB 7: INVESTMENTS */}
          {activeTab === 'investments' && (
            <InvestmentWatchlist />
          )}

          {/* TAB 8: AI ADVISOR */}
          {activeTab === 'ai-advisor' && (
            <div className="space-y-6">
              <div className="p-8 rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
                    AI Financial Intelligence Copilot
                  </span>
                  <h2 className="mt-3 text-3xl font-extrabold tracking-tight">
                    Audited Health Score: {healthScore.score}/100 ({healthScore.rating})
                  </h2>
                  <p className="mt-2 text-xs sm:text-sm text-indigo-200 max-w-xl leading-relaxed">
                    {healthScore.summary}
                  </p>
                </div>
                <button
                  onClick={() => setIsAIAdvisorOpen(true)}
                  className="px-6 py-3 rounded-2xl bg-white text-indigo-900 font-extrabold text-sm shadow-xl hover:bg-indigo-50 transition-all hover:scale-105 flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Launch Interactive Chat</span>
                </button>
              </div>

              {/* Health Score Pillar Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80">
                  <p className="text-xs font-semibold text-slate-400">Savings Velocity</p>
                  <h4 className="mt-1 text-2xl font-bold text-emerald-500">{healthScore.breakdown.savingsRateScore}/100</h4>
                  <p className="text-[11px] text-slate-400 mt-1">Exceptional &gt;25% accumulation rate</p>
                </div>
                <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80">
                  <p className="text-xs font-semibold text-slate-400">Budget Adherence</p>
                  <h4 className="mt-1 text-2xl font-bold text-teal-500">{healthScore.breakdown.budgetAdherenceScore}/100</h4>
                  <p className="text-[11px] text-slate-400 mt-1">Minor dining out overrun</p>
                </div>
                <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80">
                  <p className="text-xs font-semibold text-slate-400">Emergency Reserves</p>
                  <h4 className="mt-1 text-2xl font-bold text-indigo-500">{healthScore.breakdown.emergencyFundScore}/100</h4>
                  <p className="text-[11px] text-slate-400 mt-1">81.7% of 6-month goal funded</p>
                </div>
                <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80">
                  <p className="text-xs font-semibold text-slate-400">Subscription Health</p>
                  <h4 className="mt-1 text-2xl font-bold text-purple-500">{healthScore.breakdown.subscriptionHealthScore}/100</h4>
                  <p className="text-[11px] text-slate-400 mt-1">1 idle app flagged for review</p>
                </div>
                <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-slate-800/80">
                  <p className="text-xs font-semibold text-slate-400">Debt to Income</p>
                  <h4 className="mt-1 text-2xl font-bold text-cyan-500">{healthScore.breakdown.debtToIncomeScore}/100</h4>
                  <p className="text-[11px] text-slate-400 mt-1">Zero high-interest revolving debt</p>
                </div>
              </div>
            </div>
          )}

        </main>

        {/* Global Footer */}
        <footer className="border-t border-slate-200/80 dark:border-slate-800/80 py-6 px-4 lg:px-8 text-center text-xs text-slate-400">
          <p>
            Smart Financial Dashboard • Built for Suchitha Kakumani • Engineered with React, TypeScript, Tailwind CSS & Node.js
          </p>
        </footer>

      </div>

      {/* Global Modals */}
      <TransactionModal 
        isOpen={isTransactionModalOpen} 
        onClose={() => setIsTransactionModalOpen(false)} 
      />

      <ExportReportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      <AIAdvisorModal
        isOpen={isAIAdvisorOpen}
        onClose={() => setIsAIAdvisorOpen(false)}
      />

    </div>
  );
};
export default App;
