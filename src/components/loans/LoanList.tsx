import React from 'react';
import { Loan } from '../../types';
import { formatCurrency, formatDate, getDaysUntil, calculateLoanDetails } from '../../utils/calculations';
import { Button } from '../common/Button';

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
      <div className="text-center py-12 text-gray-500">
        No loans yet. Add your first loan to get started!
      </div>
    );
  }

  const sortedLoans = [...loans].sort(
    (a, b) => new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime()
  );

  return (
    <div className="space-y-4">
      {sortedLoans.map((loan) => {
        const calculations = calculateLoanDetails(loan);
        const daysUntil = getDaysUntil(loan.paymentDate);
        const isOverdue = daysUntil < 0;
        const isUpcomingSoon = daysUntil >= 0 && daysUntil <= 7;

        return (
          <div
            key={loan.id}
            className="bg-white rounded-lg shadow-md p-5 border-l-4 transition-transform hover:scale-[1.01]"
            style={{ borderLeftColor: loan.colorTag }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {loan.vendor}
                  </h3>
                  <span
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: loan.colorTag }}
                  />
                </div>
                {loan.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {loan.description}
                  </p>
                )}

                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-gray-700">Total Loan:</span>
                      <span className="text-gray-900 font-semibold">
                        {formatCurrency(loan.totalLoanAmount)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-gray-700">Paid:</span>
                      <span className="text-green-600 font-semibold">
                        {formatCurrency(loan.amountPaidSoFar)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-gray-700">Remaining:</span>
                      <span className="text-red-600 font-semibold">
                        {formatCurrency(calculations.remainingBalance)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-gray-700">Payment:</span>
                      <span className="text-gray-900 font-semibold">
                        {formatCurrency(loan.paymentAmount)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-gray-700">Next Due:</span>
                      <span className="text-gray-900">
                        {formatDate(loan.paymentDate)}
                      </span>
                      {isOverdue && (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-medium">
                          Overdue
                        </span>
                      )}
                      {isUpcomingSoon && !isOverdue && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-medium">
                          Due in {daysUntil} {daysUntil === 1 ? 'day' : 'days'}
                        </span>
                      )}
                    </div>
                    {loan.lastPaymentDate && (
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium text-gray-700">Last Payment:</span>
                        <span className="text-gray-600">
                          {formatDate(loan.lastPaymentDate)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-700">Progress:</span>
                    <span className="text-xs text-gray-600">
                      {calculations.paymentProgress.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-600 h-2.5 rounded-full transition-all"
                      style={{ width: `${calculations.paymentProgress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <Button
                  variant="secondary"
                  onClick={() => onEdit(loan)}
                  className="text-sm px-3 py-1"
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => onDelete(loan.id)}
                  className="text-sm px-3 py-1"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
