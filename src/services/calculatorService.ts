import { CalculatorInputs, CalculatorResults, CalculatorAISuggestion } from '../types';

export const computeFinancialPlan = (inputs: CalculatorInputs): CalculatorResults => {
  const {
    monthlyIncome,
    essentialExpenses,
    discretionaryExpenses,
    debtPayments,
    currentSavings,
    monthlyInvestment,
    annualReturnRate,
    timeHorizonYears
  } = inputs;

  const income = Math.max(1, monthlyIncome);
  const totalOutflows = essentialExpenses + discretionaryExpenses + debtPayments;
  const monthlySurplus = monthlyIncome - totalOutflows;

  // Ratios
  const needsPercent = Math.round((essentialExpenses / income) * 100);
  const wantsPercent = Math.round((discretionaryExpenses / income) * 100);
  const dtiRatio = Math.round((debtPayments / income) * 100);
  const savingsRate = Math.round((Math.max(0, monthlySurplus) / income) * 100);
  const savingsPercent = Math.max(0, 100 - needsPercent - wantsPercent);

  // Emergency runway
  const emergencyFundMonths = essentialExpenses > 0 
    ? Number((currentSavings / essentialExpenses).toFixed(1)) 
    : 12;

  // Future Value with compound interest
  // FV = PV*(1 + r)^n + PMT * [((1 + r)^n - 1) / r]
  const pmt = Math.max(0, monthlyInvestment > 0 ? monthlyInvestment : Math.max(0, monthlySurplus * 0.6));
  const r = (annualReturnRate / 100) / 12;
  const n = timeHorizonYears * 12;

  let futureWealthValue = currentSavings;
  if (r > 0 && n > 0) {
    const fvPV = currentSavings * Math.pow(1 + r, n);
    const fvPMT = pmt * ((Math.pow(1 + r, n) - 1) / r);
    futureWealthValue = Math.round(fvPV + fvPMT);
  } else {
    futureWealthValue = Math.round(currentSavings + pmt * n);
  }

  const totalContributions = Math.round(currentSavings + pmt * n);
  const totalInterestEarned = Math.max(0, futureWealthValue - totalContributions);

  // Financial Grade
  let grade: CalculatorResults['grade'] = 'B';
  if (monthlySurplus < 0 || dtiRatio > 43) {
    grade = 'D';
  } else if (savingsRate >= 35 && dtiRatio <= 15 && emergencyFundMonths >= 5) {
    grade = 'A+';
  } else if (savingsRate >= 20 && dtiRatio <= 28 && emergencyFundMonths >= 3) {
    grade = 'A';
  } else if (savingsRate >= 10 && dtiRatio <= 36) {
    grade = 'B';
  } else {
    grade = 'C';
  }

  return {
    totalOutflows,
    monthlySurplus,
    savingsRate,
    dtiRatio,
    needsPercent,
    wantsPercent,
    savingsPercent,
    emergencyFundMonths,
    futureWealthValue,
    totalContributions,
    totalInterestEarned,
    grade
  };
};

export const generateCalculatorAISuggestion = (
  inputs: CalculatorInputs,
  results: CalculatorResults
): CalculatorAISuggestion => {
  const { monthlyIncome, essentialExpenses, discretionaryExpenses, debtPayments, monthlyInvestment, timeHorizonYears } = inputs;
  const { monthlySurplus, savingsRate, dtiRatio, needsPercent, wantsPercent, emergencyFundMonths, futureWealthValue, grade } = results;

  // 50/30/20 Ideal vs Actual
  const idealNeeds = monthlyIncome * 0.50;
  const idealWants = monthlyIncome * 0.30;
  const idealSavings = monthlyIncome * 0.20;

  const needsDiff = essentialExpenses - idealNeeds;
  const wantsDiff = discretionaryExpenses - idealWants;
  const actualSavingsAmount = Math.max(0, monthlySurplus);
  const savingsDiff = actualSavingsAmount - idealSavings;

  const rule503020Comparison: CalculatorAISuggestion['rule503020Comparison'] = {
    needs: {
      actual: needsPercent,
      ideal: 50,
      diff: Math.round(needsDiff),
      status: needsPercent <= 50 ? 'good' : 'high'
    },
    wants: {
      actual: wantsPercent,
      ideal: 30,
      diff: Math.round(wantsDiff),
      status: wantsPercent <= 30 ? 'good' : 'high'
    },
    savings: {
      actual: savingsRate,
      ideal: 20,
      diff: Math.round(savingsDiff),
      status: savingsRate >= 20 ? 'good' : 'low'
    }
  };

  const recommendations: CalculatorAISuggestion['recommendations'] = [];

  // 1. Surplus / Deficit check
  if (monthlySurplus < 0) {
    recommendations.push({
      title: 'Immediate Cashflow Deficit Alert',
      impact: `-$${Math.abs(monthlySurplus).toLocaleString()}/month deficit`,
      description: `Your monthly expenditures exceed your take-home pay by $${Math.abs(monthlySurplus).toLocaleString()}. Trim non-essential wants by $${Math.min(discretionaryExpenses, Math.abs(monthlySurplus) + 100).toLocaleString()} to restore positive cash flow immediately.`,
      type: 'warning'
    });
  } else if (savingsRate >= 30) {
    recommendations.push({
      title: 'Top-Tier Wealth Accumulation Velocity',
      impact: `+$${monthlySurplus.toLocaleString()}/mo reinvestable`,
      description: `Your ${savingsRate}% savings rate places you in the top 5% of personal finance benchmarks. With compounding at your chosen horizon, your portfolio will reach $${futureWealthValue.toLocaleString()}.`,
      type: 'positive'
    });
  }

  // 2. Debt to Income
  if (dtiRatio > 35) {
    recommendations.push({
      title: 'High Debt-to-Income Exposure',
      impact: `${dtiRatio}% of income consumed by debt`,
      description: `Debt obligations ($${debtPayments.toLocaleString()}/mo) are above the healthy 30% ceiling. Prioritize high-interest consumer debt using the debt avalanche method to free up cashflow.`,
      type: 'warning'
    });
  } else if (debtPayments > 0) {
    recommendations.push({
      title: 'Manageable Debt Burden',
      impact: `DTI safely at ${dtiRatio}%`,
      description: `Your debt payments are well within safe lenders limits (<= 36%). Allocate an extra $150/mo to accelerate principal reduction.`,
      type: 'tip'
    });
  }

  // 3. Emergency Runway
  if (emergencyFundMonths < 3) {
    recommendations.push({
      title: 'Emergency Cushion Needs Boosting',
      impact: `${emergencyFundMonths} months coverage`,
      description: `Target at least 3-6 months ($${(essentialExpenses * 3).toLocaleString()} - $${(essentialExpenses * 6).toLocaleString()}) in liquid high-yield savings (4.5%+ APY) before scaling aggressive speculative investments.`,
      type: 'warning'
    });
  } else {
    recommendations.push({
      title: 'Solid Emergency Liquidity Defense',
      impact: `${emergencyFundMonths} months living runway`,
      description: `You have adequate liquidity reserves to weather unexpected shocks without selling investments or taking on high-interest loans.`,
      type: 'positive'
    });
  }

  // 4. Investment Compounding
  if (monthlyInvestment > 0) {
    recommendations.push({
      title: `Compounding Wealth Trajectory (${timeHorizonYears} Years)`,
      impact: `$${futureWealthValue.toLocaleString()} projected portfolio`,
      description: `Consistently allocating $${monthlyInvestment.toLocaleString()}/mo into broad index funds (VOO, S&P 500) will yield an estimated $${results.totalInterestEarned.toLocaleString()} in pure compound interest over ${timeHorizonYears} years.`,
      type: 'positive'
    });
  }

  let verdict = '';
  let badgeColor = '';
  let summary = '';

  if (grade === 'A+' || grade === 'A') {
    verdict = 'Excellent Financial Foundation';
    badgeColor = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    summary = `Your cashflow model demonstrates exceptional financial hygiene. High savings velocity (${savingsRate}%) and low debt footprint (${dtiRatio}%) allow your capital to compound rapidly toward financial independence.`;
  } else if (grade === 'B') {
    verdict = 'Solid & Balanced Financial Plan';
    badgeColor = 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20';
    summary = `Your fundamentals are healthy. Minor optimizations in discretionary lifestyle expenditures and directing $200–$400 more into monthly index investing will push you into top-tier wealth generation.`;
  } else if (grade === 'C') {
    verdict = 'Optimization Required';
    badgeColor = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    summary = `Your budget operates on thin margins. Reviewing discretionary spending ($${discretionaryExpenses.toLocaleString()}) and accelerating debt payoff will provide much-needed buffer against unexpected expenses.`;
  } else {
    verdict = 'High Risk - Action Needed';
    badgeColor = 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
    summary = `Expenses or debt obligations exceed safe thresholds. Immediate reductions in flexible expenses are advised to avoid debt accumulation and restore financial peace of mind.`;
  }

  return {
    verdict,
    badgeColor,
    summary,
    recommendations,
    rule503020Comparison
  };
};
