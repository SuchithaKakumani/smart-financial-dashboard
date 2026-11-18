import express from 'express';
import cors from 'cors';
import { db } from './data/database.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'Smart Financial Dashboard API'
  });
});

// Summary analytics
app.get('/api/summary', (req, res) => {
  const transactions = db.getTransactions();
  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
  const net = income - expense;
  const savingsRate = income > 0 ? ((net / income) * 100).toFixed(1) : 0;

  res.json({
    totalIncome: income,
    totalExpense: expense,
    netSavings: net,
    savingsRate: Number(savingsRate),
    transactionCount: transactions.length
  });
});

// Transactions CRUD
app.get('/api/transactions', (req, res) => {
  const { category, type, search } = req.query;
  let list = db.getTransactions();

  if (category) {
    list = list.filter(t => t.category.toLowerCase() === String(category).toLowerCase());
  }
  if (type) {
    list = list.filter(t => t.type === type);
  }
  if (search) {
    const s = String(search).toLowerCase();
    list = list.filter(t => 
      t.description.toLowerCase().includes(s) || 
      t.merchant.toLowerCase().includes(s) ||
      t.category.toLowerCase().includes(s)
    );
  }

  res.json(list);
});

app.post('/api/transactions', (req, res) => {
  try {
    const tx = db.addTransaction(req.body);
    res.status(201).json(tx);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create transaction', details: err.message });
  }
});

app.put('/api/transactions/:id', (req, res) => {
  const updated = db.updateTransaction(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Transaction not found' });
  res.json(updated);
});

app.delete('/api/transactions/:id', (req, res) => {
  db.deleteTransaction(req.params.id);
  res.json({ success: true, message: 'Transaction deleted' });
});

// Budgets
app.get('/api/budgets', (req, res) => {
  res.json(db.getBudgets());
});

app.put('/api/budgets/:id', (req, res) => {
  const updated = db.updateBudget(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Budget not found' });
  res.json(updated);
});

// Goals
app.get('/api/goals', (req, res) => {
  res.json(db.getGoals());
});

app.put('/api/goals/:id', (req, res) => {
  const updated = db.updateGoal(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Goal not found' });
  res.json(updated);
});

// Subscriptions
app.get('/api/subscriptions', (req, res) => {
  res.json(db.getSubscriptions());
});

app.put('/api/subscriptions/:id', (req, res) => {
  const updated = db.updateSubscription(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Subscription not found' });
  res.json(updated);
});

// AI Advisor Endpoint
app.post('/api/ai/advisor', (req, res) => {
  const { query } = req.body;
  const transactions = db.getTransactions();
  const budgets = db.getBudgets();
  const goals = db.getGoals();
  const subscriptions = db.getSubscriptions();

  // Simple heuristic response if called directly on server
  res.json({
    query,
    reply: `Financial Advisor Analysis for: "${query}". Context: ${transactions.length} active records analyzed.`
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Smart Financial Dashboard API Server running on http://localhost:${PORT}`);
});
