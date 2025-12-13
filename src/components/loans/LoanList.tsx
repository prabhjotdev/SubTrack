import React from 'react';
import { Loan } from '../../types';
import { formatCurrency, formatDate, getDaysUntil, calculateLoanDetails } from '../../utils/calculations';

interface LoanListProps {
  loans: Loan[];
  onEdit: (loan: Loan) => void;
  onDelete: (id: string) => void;
}

export const LoanList: React.FC<LoanListProps> = ({
  loans,
  onEdit,
  onDelete,
}) => {
  if (loans.length === 0) {
    return (
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-12 text-center border-2 border-dashed border-emerald-200">
        <svg className="w-20 h-20 text-emerald-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          No loans yet
        </h3>
        <p className="text-gray-600">
          Add your first loan to start tracking your payments and progress!
        </p>
      </div>
    );
  }

  const sortedLoans = [...loans].sort(
    (a, b) => new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime()
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {sortedLoans.map((loan) => {
        const calculations = calculateLoanDetails(loan);
        const daysUntil = getDaysUntil(loan.paymentDate);
        const isOverdue = daysUntil < 0;
        const isUpcomingSoon = daysUntil >= 0 && daysUntil <= 7;

        return (
          <div
            key={loan.id}
            className="bg-white rounded-2xl shadow-xl p-6 border-l-4 hover:shadow-2xl transition-all group"
            style={{ borderLeftColor: loan.colorTag }}
          >
            {/* Header with color badge */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3 flex-1">
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-white text-xl shadow-lg"
                  style={{ backgroundColor: loan.colorTag }}
                >
                  {loan.vendor.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors mb-1">
                    {loan.vendor}
                  </h3>
                  {loan.description && (
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {loan.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Financial Overview */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                <p className="text-xs text-gray-500 font-medium mb-1">Total Loan</p>
                <p className="text-sm font-bold text-gray-900">
                  {formatCurrency(loan.totalLoanAmount)}
                </p>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                <p className="text-xs text-emerald-600 font-medium mb-1">Paid</p>
                <p className="text-sm font-bold text-emerald-700">
                  {formatCurrency(loan.amountPaidSoFar)}
                </p>
              </div>
              <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                <p className="text-xs text-red-600 font-medium mb-1">Remaining</p>
                <p className="text-sm font-bold text-red-700">
                  {formatCurrency(calculations.remainingBalance)}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4 bg-gray-100 rounded-xl p-4 border-2 border-gray-300">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-gray-700">
                  Payment Progress
                </span>
                <span className="text-xl font-bold text-emerald-600">
                  {calculations.paymentProgress.toFixed(0)}%
                </span>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-6 border border-gray-400">
                <div
                  className="bg-emerald-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${calculations.paymentProgress}%`,
                    height: '24px',
                    minWidth: calculations.paymentProgress > 0 ? '8px' : '0'
                  }}
                />
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-600 font-medium mb-1">Next Payment</p>
                  <p className="text-lg font-bold text-blue-900">
                    {formatCurrency(loan.paymentAmount)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 justify-end mb-1">
                    <svg className="w-3 h-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-xs text-blue-600 font-medium">Due Date</p>
                  </div>
                  <p className="text-sm font-semibold text-blue-900">
                    {formatDate(loan.paymentDate)}
                  </p>
                </div>
              </div>
              {isOverdue && (
                <div className="mt-3 bg-red-100 text-red-800 px-3 py-2 rounded-lg text-xs font-semibold text-center">
                  ⚠️ Payment Overdue
                </div>
              )}
              {isUpcomingSoon && !isOverdue && (
                <div className="mt-3 bg-yellow-100 text-yellow-800 px-3 py-2 rounded-lg text-xs font-semibold text-center">
                  🔔 Due in {daysUntil} {daysUntil === 1 ? 'day' : 'days'}
                </div>
              )}
            </div>

            {loan.finalPaymentDate && (
              <div className="mb-4 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Loan End Date: {formatDate(loan.finalPaymentDate)}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => onEdit(loan)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm"
              >
                📝 Edit
              </button>
              <button
                onClick={() => onDelete(loan.id)}
                className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2.5 px-4 rounded-xl transition-colors text-sm"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
