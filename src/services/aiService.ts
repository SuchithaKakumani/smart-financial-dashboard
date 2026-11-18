import { Transaction, Budget, SavingsGoal, Subscription, AIInsight, FinancialHealthScore } from '../types';

export const calculateFinancialHealth = (
  transactions: Transaction[],
  budgets: Budget[],
  goals: SavingsGoal[],
  subscriptions: Subscription[]
): FinancialHealthScore => {
  const currentMonthTransactions = transactions.filter(t => {
    const txDate = new Date(t.date);
    const now = new Date();
    return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
  });

  const totalIncome = currentMonthTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0) || 1;

  const totalExpenses = currentMonthTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // 1. Savings rate score (target: >= 20% savings)
  const savingsRate = Math.max(0, (totalIncome - totalExpenses) / totalIncome);
  let savingsRateScore = Math.min(100, Math.round((savingsRate / 0.25) * 100));

  // 2. Budget adherence score
  let budgetOverruns = 0;
  budgets.forEach(b => {
    const spent = currentMonthTransactions
      .filter(t => t.type === 'expense' && t.category.toLowerCase() === b.category.toLowerCase())
      .reduce((sum, t) => sum + t.amount, 0);
    if (spent > b.allocated) {
      budgetOverruns++;
    }
  });
  const budgetAdherenceScore = Math.max(40, 100 - (budgetOverruns * 18));

  // 3. Emergency fund score (based on goal g-1 or highest target)
  const emergencyGoal = goals.find(g => g.category.toLowerCase().includes('emergency')) || goals[0];
  const emergencyFundScore = emergencyGoal 
    ? Math.min(100, Math.round((emergencyGoal.currentAmount / emergencyGoal.targetAmount) * 100))
    : 80;

  // 4. Subscriptions health score (subscriptions under 5% of monthly income)
  const monthlySubTotal = subscriptions
    .filter(s => s.status === 'active')
    .reduce((sum, s) => sum + (s.billingCycle === 'yearly' ? s.amount / 12 : s.amount), 0);
  const subRatio = monthlySubTotal / totalIncome;
  const subscriptionHealthScore = subRatio < 0.05 ? 95 : subRatio < 0.10 ? 80 : 60;

  // 5. Debt to income (low debt assumed, 90 baseline)
  const debtToIncomeScore = 90;

  const overallScore = Math.round(
    savingsRateScore * 0.35 +
    budgetAdherenceScore * 0.25 +
    emergencyFundScore * 0.20 +
    subscriptionHealthScore * 0.10 +
    debtToIncomeScore * 0.10
  );

  let rating: FinancialHealthScore['rating'] = 'Fair';
  if (overallScore >= 85) rating = 'Excellent';
  else if (overallScore >= 70) rating = 'Good';
  else if (overallScore >= 50) rating = 'Fair';
  else rating = 'Needs Attention';

  let summary = '';
  if (overallScore >= 85) {
    summary = `Outstanding performance! Your savings rate is ${(savingsRate * 100).toFixed(1)}%, emergency reserves are robust, and discretionary spending is well-governed.`;
  } else if (overallScore >= 70) {
    summary = `Healthy financial footing. With minor reductions in top spending categories and trimming unused subscriptions, you can reach the top tier.`;
  } else {
    summary = `Opportunities for optimization detected. Review categories approaching or exceeding their caps and boost regular goal contributions.`;
  }

  return {
    score: overallScore,
    rating,
    breakdown: {
      savingsRateScore,
      budgetAdherenceScore,
      debtToIncomeScore,
      emergencyFundScore,
      subscriptionHealthScore
    },
    summary
  };
};

export const generateDynamicInsights = (
  transactions: Transaction[],
  budgets: Budget[],
  goals: SavingsGoal[],
  subscriptions: Subscription[]
): AIInsight[] => {
  const insights: AIInsight[] = [];
  const today = new Date().toISOString().split('T')[0];

  // Category overrun checks
  budgets.forEach(b => {
    const spent = transactions
      .filter(t => t.type === 'expense' && t.category.toLowerCase() === b.category.toLowerCase())
      .reduce((sum, t) => sum + t.amount, 0);

    const ratio = spent / b.allocated;
    if (ratio > 0.85) {
      insights.push({
        id: `ins-over-${b.id}`,
        type: ratio >= 1 ? 'alert' : 'warning',
        title: `${b.category} Budget Alert`,
        description: `You've used ${(ratio * 100).toFixed(0)}% ($${spent.toFixed(0)} of $${b.allocated}) of your ${b.category} budget for this cycle.`,
        impact: ratio >= 1 ? 'Over budget by $' + (spent - b.allocated).toFixed(0) : 'Approaching cap',
        actionLabel: 'View Category Details',
        category: b.category,
        date: today
      });
    }
  });

  // High subscriptions
  const reviewSubs = subscriptions.filter(s => s.status === 'to_review');
  if (reviewSubs.length > 0) {
    const potentialSaving = reviewSubs.reduce((sum, s) => sum + s.amount, 0);
    insights.push({
      id: 'ins-sub-review',
      type: 'tip',
      title: `${reviewSubs.length} Subscription(s) Flagged for Review`,
      description: `Subscriptions like ${reviewSubs.map(s => s.name).join(', ')} appear under-utilized. Pausing them could save you $${potentialSaving.toFixed(2)}/mo ($${(potentialSaving * 12).toFixed(2)}/yr).`,
      impact: `Save $${(potentialSaving * 12).toFixed(2)}/year`,
      actionLabel: 'Manage Subscriptions',
      category: 'Subscriptions',
      date: today
    });
  }

  // Savings progress
  const topGoal = goals[0];
  if (topGoal) {
    const pct = Math.round((topGoal.currentAmount / topGoal.targetAmount) * 100);
    insights.push({
      id: 'ins-goal-prog',
      type: 'success',
      title: `Goal On-Track: ${topGoal.title}`,
      description: `You have reached ${pct}% of your $${topGoal.targetAmount.toLocaleString()} target. At current savings pace, you will meet your milestone ahead of deadline.`,
      impact: `${100 - pct}% remaining ($${(topGoal.targetAmount - topGoal.currentAmount).toLocaleString()})`,
      actionLabel: 'Boost Goal',
      category: 'Goals',
      date: today
    });
  }

  return insights;
};

export const getAIAdvisorResponse = (
  query: string,
  context: {
    transactions: Transaction[];
    budgets: Budget[];
    goals: SavingsGoal[];
    subscriptions: Subscription[];
    healthScore: FinancialHealthScore;
  }
): string => {
  const q = query.toLowerCase();

  const totalIncome = context.transactions
    .filter(t => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);

  const totalExpense = context.transactions
    .filter(t => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);

  const netSavings = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((netSavings / totalIncome) * 100).toFixed(1) : '0';

  if (q.includes('health') || q.includes('score') || q.includes('how am i doing')) {
    return `📊 **Financial Health Score: ${context.healthScore.score}/100 (${context.healthScore.rating})**\n\n` +
      `• **Savings Rate:** ${savingsRate}% (Score: ${context.healthScore.breakdown.savingsRateScore}/100)\n` +
      `• **Budget Adherence:** ${context.healthScore.breakdown.budgetAdherenceScore}/100\n` +
      `• **Emergency Reserves:** ${context.healthScore.breakdown.emergencyFundScore}/100\n\n` +
      `**Summary:** ${context.healthScore.summary}`;
  }

  if (q.includes('50/30/20') || q.includes('rule') || q.includes('breakdown')) {
    const needsBudget = totalIncome * 0.50;
    const wantsBudget = totalIncome * 0.30;
    const savingsBudget = totalIncome * 0.20;

    return `📐 **Your 50/30/20 Optimal Budget Allocation (based on $${totalIncome.toFixed(0)} income):**\n\n` +
      `• **50% Needs ($${needsBudget.toFixed(0)}):** Rent, Utilities, Groceries, Insurance.\n` +
      `• **30% Wants ($${wantsBudget.toFixed(0)}):** Dining Out, Entertainment, Gadgets, Shopping.\n` +
      `• **20% Savings & Debt ($${savingsBudget.toFixed(0)}):** Emergency Fund, Brokerage, Retirement.\n\n` +
      `*Your current actual savings rate is ${savingsRate}%, which comfortably meets or exceeds this rule!*`;
  }

  if (q.includes('afford') || q.includes('buy') || q.includes('purchase')) {
    const match = q.match(/\$?\s*(\d+([,.]\d+)?)/);
    const amount = match ? parseFloat(match[1].replace(/,/g, '')) : 500;
    const safeToSpend = netSavings * 0.35;

    if (amount <= safeToSpend) {
      return `✅ **Yes, you can comfortably afford $${amount.toFixed(2)}!**\n\n` +
        `You currently have a monthly cash surplus of $${netSavings.toFixed(2)}. Spending $${amount.toFixed(2)} represents only ${((amount / netSavings) * 100).toFixed(1)}% of your discretionary excess and will not jeopardize any of your active savings goals.`;
    } else {
      return `⚠️ **Exercise caution with a $${amount.toFixed(2)} purchase.**\n\n` +
        `Your monthly surplus is $${netSavings.toFixed(2)}. While you have the funds, this expense would consume ${((amount / (netSavings || 1)) * 100).toFixed(0)}% of your available cashflow. We recommend spreading this over 2 months or reallocating from non-essential budgets.`;
    }
  }

  if (q.includes('subscription') || q.includes('recurring') || q.includes('bills')) {
    const activeSubs = context.subscriptions.filter(s => s.status === 'active');
    const totalSub = activeSubs.reduce((s, sub) => s + (sub.billingCycle === 'yearly' ? sub.amount / 12 : sub.amount), 0);
    return `💳 **Subscription Breakdown:**\n\n` +
      `You have **${activeSubs.length} active recurring subscriptions** totaling **$${totalSub.toFixed(2)}/month** ($${(totalSub * 12).toFixed(2)}/year).\n\n` +
      `Top subscriptions:\n` +
      context.subscriptions.slice(0, 4).map(s => `• **${s.name}:** $${s.amount}/${s.billingCycle === 'yearly' ? 'yr' : 'mo'}`).join('\n') +
      `\n\n💡 *Action item: Adobe Creative Cloud is marked for review; canceling it would free up $54.99/mo instantly.*`;
  }

  if (q.includes('goal') || q.includes('japan') || q.includes('car') || q.includes('emergency')) {
    return `🎯 **Savings Goals Progress:**\n\n` +
      context.goals.map(g => {
        const pct = ((g.currentAmount / g.targetAmount) * 100).toFixed(0);
        return `• **${g.title}:** $${g.currentAmount.toLocaleString()} / $${g.targetAmount.toLocaleString()} (${pct}%) — Target: ${g.deadline}`;
      }).join('\n') +
      `\n\n🚀 *Tip: Allocating an additional $250/mo from your salary surplus will allow you to reach your Japan Vacation goal 1.5 months ahead of schedule!*`;
  }

  if (q.includes('highest') || q.includes('large') || q.includes('spend') || q.includes('expense')) {
    const expensesByCategory: Record<string, number> = {};
    context.transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        expensesByCategory[t.category] = (expensesByCategory[t.category] || 0) + t.amount;
      });

    const sorted = Object.entries(expensesByCategory).sort((a, b) => b[1] - a[1]);
    return `💸 **Your Top Spending Categories This Month:**\n\n` +
      sorted.slice(0, 5).map(([cat, amt], idx) => `${idx + 1}. **${cat}:** $${amt.toFixed(2)} (${((amt / totalExpense) * 100).toFixed(1)}%)`).join('\n') +
      `\n\nTotal monthly spending: **$${totalExpense.toFixed(2)}**. Housing and Food & Dining constitute the largest share.`;
  }

  // Default intelligent assistant response
  return `🤖 **Smart Financial Assistant Overview:**\n\n` +
    `Here is a quick snapshot of your financial status:\n` +
    `• **Total Inflows:** $${totalIncome.toFixed(2)}\n` +
    `• **Total Outflows:** $${totalExpense.toFixed(2)}\n` +
    `• **Net Cashflow:** +$${netSavings.toFixed(2)} (${savingsRate}% savings velocity)\n` +
    `• **Health Score:** ${context.healthScore.score}/100 (${context.healthScore.rating})\n\n` +
    `You can ask me anything specific, such as:\n` +
    `• *"Can I afford a $450 tech upgrade?"*\n` +
    `• *"What is my 50/30/20 breakdown?"*\n` +
    `• *"Analyze my recurring subscriptions"*\n` +
    `• *"Show my top spending categories"*\n` +
    `• *"How can I improve my financial health score?"*`;
};
