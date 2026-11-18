import { Transaction } from '../types';

export const exportToCSV = (transactions: Transaction[], filename: string = 'financial_transactions.csv') => {
  const headers = ['ID', 'Date', 'Description', 'Category', 'Type', 'Amount', 'Payment Method', 'Status', 'Merchant', 'Account', 'Notes'];
  
  const rows = transactions.map(t => [
    `"${t.id}"`,
    `"${t.date}"`,
    `"${t.description.replace(/"/g, '""')}"`,
    `"${t.category}"`,
    `"${t.type}"`,
    t.amount.toFixed(2),
    `"${t.paymentMethod}"`,
    `"${t.status}"`,
    `"${t.merchant.replace(/"/g, '""')}"`,
    `"${t.account.replace(/"/g, '""')}"`,
    `"${(t.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToJSON = (data: any, filename: string = 'financial_data_backup.json') => {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
  const link = document.createElement('a');
  link.setAttribute('href', dataStr);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const printFinancialReport = () => {
  window.print();
};
