import { Loan, LoanCalculations, Subscription, BillingCycle } from '../types';

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

// Calculate the next renewal date based on billing cycle
export const getNextRenewalDate = (currentDate: string, billingCycle: BillingCycle): string => {
  const [year, month, day] = currentDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);

  switch (billingCycle) {
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    case 'quarterly':
      date.setMonth(date.getMonth() + 3);
      break;
    case 'yearly':
      date.setFullYear(date.getFullYear() + 1);
      break;
  }

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// Check if a subscription renewal date has passed and needs to be updated
export const needsRenewal = (renewalDate: string): boolean => {
  const daysUntil = getDaysUntil(renewalDate);
  return daysUntil < 0;
};

// Auto-advance renewal date if it's in the past
export const autoRenewSubscription = (subscription: Subscription): Subscription => {
  // Default to monthly if billingCycle is not set (for backwards compatibility)
  const billingCycle = subscription.billingCycle || 'monthly';

  if (!needsRenewal(subscription.renewalDate)) {
    return {
      ...subscription,
      billingCycle, // Ensure billingCycle is set
    };
  }

  let nextRenewal = subscription.renewalDate;
  // Keep advancing until we get a future date
  while (needsRenewal(nextRenewal)) {
    nextRenewal = getNextRenewalDate(nextRenewal, billingCycle);
  }

  return {
    ...subscription,
    renewalDate: nextRenewal,
    billingCycle, // Ensure billingCycle is set
  };
};

// Auto-advance loan payment date if it's in the past
export const autoAdvanceLoanPayment = (loan: Loan): Loan => {
  // Default to monthly if billingCycle is not set (for backwards compatibility)
  const billingCycle = loan.billingCycle || 'monthly';

  if (!needsRenewal(loan.paymentDate)) {
    return {
      ...loan,
      billingCycle, // Ensure billingCycle is set
    };
  }

  let nextPayment = loan.paymentDate;
  // Keep advancing until we get a future date
  while (needsRenewal(nextPayment)) {
    nextPayment = getNextRenewalDate(nextPayment, billingCycle);
  }

  return {
    ...loan,
    paymentDate: nextPayment,
    billingCycle, // Ensure billingCycle is set
  };
};

// Calculate monthly equivalent cost based on billing cycle
export const calculateMonthlyEquivalent = (amount: number, billingCycle?: BillingCycle): number => {
  if (!billingCycle) {
    // Default to monthly if not specified
    return amount;
  }

  switch (billingCycle) {
    case 'weekly':
      return amount * 4.33; // Average weeks per month
    case 'monthly':
      return amount;
    case 'quarterly':
      return amount / 3;
    case 'yearly':
      return amount / 12;
    default:
      return amount;
  }
};
