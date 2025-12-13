import React from 'react';
import { Subscription, Loan } from '../../types';
import { Card } from '../common/Card';
import {
  formatCurrency,
  formatDate,
  getDaysUntil,
  isUpcoming,
  calculateLoanDetails,
} from '../../utils/calculations';

interface DashboardProps {
  subscriptions: Subscription[];
  loans: Loan[];
}

export const Dashboard: React.FC<DashboardProps> = ({ subscriptions, loans }) => {
  const upcomingSubscriptions = subscriptions
    .filter((sub) => isUpcoming(sub.renewalDate))
    .sort((a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime());

  const upcomingLoans = loans
    .filter((loan) => isUpcoming(loan.paymentDate))
    .sort((a, b) => new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime());

  const totalMonthlySubscriptions = subscriptions.reduce(
    (sum, sub) => sum + sub.amount,
    0
  );

  const totalOutstandingLoans = loans.reduce((sum, loan) => {
    const { remainingBalance } = calculateLoanDetails(loan);
    return sum + remainingBalance;
  }, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Total Monthly Subscriptions
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {formatCurrency(totalMonthlySubscriptions)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {subscriptions.length} active {subscriptions.length === 1 ? 'subscription' : 'subscriptions'}
          </p>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Total Outstanding Loans
          </h3>
          <p className="text-3xl font-bold text-red-600">
            {formatCurrency(totalOutstandingLoans)}
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {loans.length} active {loans.length === 1 ? 'loan' : 'loans'}
          </p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Upcoming Subscriptions (Next 30 Days)
          </h2>
          {upcomingSubscriptions.length === 0 ? (
            <Card>
              <p className="text-gray-500 text-center py-4">
                No upcoming subscription renewals
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {upcomingSubscriptions.map((subscription) => {
                const daysUntil = getDaysUntil(subscription.renewalDate);
                return (
                  <Card
                    key={subscription.id}
                    className="border-l-4 hover:shadow-lg transition-shadow"
                    style={{ borderLeftColor: subscription.colorTag }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {subscription.vendor}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {formatDate(subscription.renewalDate)}
                        </p>
                        {daysUntil >= 0 && daysUntil <= 7 && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-medium inline-block mt-1">
                            {daysUntil === 0 ? 'Today' : `In ${daysUntil} ${daysUntil === 1 ? 'day' : 'days'}`}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {formatCurrency(subscription.amount)}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Upcoming Loan Payments (Next 30 Days)
          </h2>
          {upcomingLoans.length === 0 ? (
            <Card>
              <p className="text-gray-500 text-center py-4">
                No upcoming loan payments
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {upcomingLoans.map((loan) => {
                const daysUntil = getDaysUntil(loan.paymentDate);
                const { remainingBalance } = calculateLoanDetails(loan);
                return (
                  <Card
                    key={loan.id}
                    className="border-l-4 hover:shadow-lg transition-shadow"
                    style={{ borderLeftColor: loan.colorTag }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {loan.vendor}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {formatDate(loan.paymentDate)}
                        </p>
                        {daysUntil >= 0 && daysUntil <= 7 && (
                          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-medium inline-block mt-1">
                            {daysUntil === 0 ? 'Today' : `In ${daysUntil} ${daysUntil === 1 ? 'day' : 'days'}`}
                          </span>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          Remaining: {formatCurrency(remainingBalance)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {formatCurrency(loan.paymentAmount)}
                        </p>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
