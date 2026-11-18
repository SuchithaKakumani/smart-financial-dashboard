import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, 'db.json');
const SEED_FILE = path.join(__dirname, 'seedData.json');

const initDB = () => {
  if (!fs.existsSync(DB_FILE)) {
    const seed = fs.readFileSync(SEED_FILE, 'utf-8');
    fs.writeFileSync(DB_FILE, seed, 'utf-8');
  }
};

const readDB = () => {
  initDB();
  try {
    const data = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading database file, recreating from seed', err);
    const seed = fs.readFileSync(SEED_FILE, 'utf-8');
    fs.writeFileSync(DB_FILE, seed, 'utf-8');
    return JSON.parse(seed);
  }
};

const writeDB = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
};

export const db = {
  // Transactions
  getTransactions: () => {
    return readDB().transactions || [];
  },
  addTransaction: (tx) => {
    const current = readDB();
    const newTx = { ...tx, id: tx.id || `tx-${Date.now()}` };
    current.transactions = [newTx, ...(current.transactions || [])];
    writeDB(current);
    return newTx;
  },
  updateTransaction: (id, updates) => {
    const current = readDB();
    const idx = current.transactions.findIndex(t => t.id === id);
    if (idx === -1) return null;
    current.transactions[idx] = { ...current.transactions[idx], ...updates };
    writeDB(current);
    return current.transactions[idx];
  },
  deleteTransaction: (id) => {
    const current = readDB();
    current.transactions = (current.transactions || []).filter(t => t.id !== id);
    writeDB(current);
    return true;
  },

  // Budgets
  getBudgets: () => {
    return readDB().budgets || [];
  },
  updateBudget: (id, updates) => {
    const current = readDB();
    const idx = current.budgets.findIndex(b => b.id === id);
    if (idx === -1) return null;
    current.budgets[idx] = { ...current.budgets[idx], ...updates };
    writeDB(current);
    return current.budgets[idx];
  },

  // Goals
  getGoals: () => {
    return readDB().goals || [];
  },
  updateGoal: (id, updates) => {
    const current = readDB();
    const idx = current.goals.findIndex(g => g.id === id);
    if (idx === -1) return null;
    current.goals[idx] = { ...current.goals[idx], ...updates };
    writeDB(current);
    return current.goals[idx];
  },

  // Subscriptions
  getSubscriptions: () => {
    return readDB().subscriptions || [];
  },
  updateSubscription: (id, updates) => {
    const current = readDB();
    const idx = current.subscriptions.findIndex(s => s.id === id);
    if (idx === -1) return null;
    current.subscriptions[idx] = { ...current.subscriptions[idx], ...updates };
    writeDB(current);
    return current.subscriptions[idx];
  }
};
