export interface Subscription {
  id: string;
  vendor: string;
  description?: string;
  datePurchased?: string;
  renewalDate: string;
  amount: number;
  colorTag: string;
}

export interface Loan {
  id: string;
  vendor: string;
  description?: string;
  totalLoanAmount: number;
  amountPaidSoFar: number;
  paymentAmount: number;
  paymentDate: string;
  finalPaymentDate?: string; // Date of final/last installment (when loan ends)
  colorTag: string;
}

export interface LoanCalculations {
  remainingBalance: number;
  paymentProgress: number;
  nextPaymentDue: string;
}

export type ColorOption = {
  name: string;
  value: string;
};

export const PRESET_COLORS: ColorOption[] = [
  { name: 'Red', value: '#EF4444' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Yellow', value: '#EAB308' },
  { name: 'Green', value: '#10B981' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Indigo', value: '#6366F1' },
  { name: 'Purple', value: '#A855F7' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Gray', value: '#6B7280' },
];
