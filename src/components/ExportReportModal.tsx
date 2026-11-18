import React from 'react';
import { X, Download, FileText, Database, Printer, CheckCircle } from 'lucide-react';
import { useFinance } from '../context/FinanceContext';
import { exportToCSV, exportToJSON, printFinancialReport } from '../utils/exportUtils';
import { formatCurrency } from '../utils/formatters';

interface ExportReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({ isOpen, onClose }) => {
  const { transactions, budgets, goals, subscriptions, investments, healthScore, currency } = useFinance();

  if (!isOpen) return null;

  const handleExportCSV = () => {
    exportToCSV(transactions, `SmartFinance_Transactions_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleExportJSON = () => {
    const fullBackup = {
      exportedAt: new Date().toISOString(),
      user: 'Suchitha Kakumani',
      financialHealthScore: healthScore,
      transactions,
      budgets,
      goals,
      subscriptions,
      investments
    };
    exportToJSON(fullBackup, `SmartFinance_Backup_${new Date().toISOString().split('T')[0]}.json`);
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      
      <div className="w-full max-w-lg bg-white dark:bg-[#111827] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Export Financial Statements & Data
            </h3>
            <p className="text-xs text-slate-400">
              Download audited records or generate PDF statement
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current statement summary preview */}
        <div className="my-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
          <div className="flex justify-between text-slate-500">
            <span>Period</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">November 2026</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Total Recorded Inflow</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(totalIncome, currency)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Total Recorded Outflow</span>
            <span className="font-semibold text-rose-500">{formatCurrency(totalExpense, currency)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Net Monthly Surplus</span>
            <span className="font-bold text-slate-900 dark:text-white">{formatCurrency(totalIncome - totalExpense, currency)}</span>
          </div>
        </div>

        {/* Export Options */}
        <div className="space-y-3">
          
          {/* CSV */}
          <div 
            onClick={handleExportCSV}
            className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500/50 hover:bg-emerald-500/5 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Export as Spreadsheet (CSV)
                </h4>
                <p className="text-[11px] text-slate-400">
                  Compatible with Excel, Google Sheets, Numbers
                </p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
          </div>

          {/* JSON Full Backup */}
          <div 
            onClick={handleExportJSON}
            className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500/50 hover:bg-indigo-500/5 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Export Complete Data Snapshot (JSON)
                </h4>
                <p className="text-[11px] text-slate-400">
                  Full backup of budgets, goals, holdings, and transactions
                </p>
              </div>
            </div>
            <Download className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
          </div>

          {/* Print / Save PDF */}
          <div 
            onClick={() => { onClose(); printFinancialReport(); }}
            className="flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-teal-500/50 hover:bg-teal-500/5 cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
                <Printer className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  Printable Financial Audit Report (PDF)
                </h4>
                <p className="text-[11px] text-slate-400">
                  Executive PDF summary layout ready for filing
                </p>
              </div>
            </div>
            <Printer className="w-4 h-4 text-slate-400 group-hover:text-teal-500 transition-colors" />
          </div>

        </div>

      </div>

    </div>
  );
};
