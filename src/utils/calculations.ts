import { Loan, LoanCalculations } from '../types';

export const calculateLoanDetails = (loan: Loan): LoanCalculations => {
  const remainingBalance = loan.totalLoanAmount - loan.amountPaidSoFar;
  const paymentProgress = (loan.amountPaidSoFar / loan.totalLoanAmount) * 100;

  return {
    remainingBalance: Math.max(0, remainingBalance),
    paymentProgress: Math.min(100, Math.max(0, paymentProgress)),
    nextPaymentDue: loan.paymentDate,
  };
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  // Parse date string to avoid timezone issues
  // Split the date string (YYYY-MM-DD) and create date in local timezone at noon
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day, 12, 0, 0);

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const getDaysUntil = (dateString: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Parse date string to avoid timezone issues
  const [year, month, day] = dateString.split('-').map(Number);
  const targetDate = new Date(year, month - 1, day, 0, 0, 0, 0);

  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const isUpcoming = (dateString: string, days: number = 30): boolean => {
  const daysUntil = getDaysUntil(dateString);
  return daysUntil >= 0 && daysUntil <= days;
};
