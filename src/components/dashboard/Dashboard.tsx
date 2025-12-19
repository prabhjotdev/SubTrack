import React, { useState, useEffect } from 'react';
import { Subscription, Loan } from '../../types';
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
  const [showInfoBanner, setShowInfoBanner] = useState(false);

  useEffect(() => {
    // Check if user has dismissed the banner or if they have data
    const bannerDismissed = localStorage.getItem('subtrack_info_banner_dismissed');
    const isNewUser = subscriptions.length === 0 && loans.length === 0;

    // Show banner only for new users who haven't dismissed it
    setShowInfoBanner(isNewUser && bannerDismissed !== 'true');
  }, [subscriptions.length, loans.length]);

  const handleDismissBanner = () => {
    localStorage.setItem('subtrack_info_banner_dismissed', 'true');
    setShowInfoBanner(false);
  };

  const upcomingSubscriptions = subscriptions
    .filter((sub) => isUpcoming(sub.renewalDate))
    .sort((a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime());

  const upcomingLoans = loans
    .filter((loan) => isUpcoming(loan.paymentDate))
    .sort((a, b) => new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime());

  const totalMonthlySubscriptions = subscriptions
    .filter((sub) => !sub.billingCycle || sub.billingCycle === 'monthly')
    .reduce((sum, sub) => sum + sub.amount, 0);

  const totalOutstandingLoans = loans.reduce((sum, loan) => {
    const { remainingBalance } = calculateLoanDetails(loan);
    return sum + remainingBalance;
  }, 0);

  const upcomingRenewalsCount = upcomingSubscriptions.filter(
    sub => getDaysUntil(sub.renewalDate) <= 7
  ).length;

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Info Banner for New Users */}
      {showInfoBanner && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-2 border-blue-200 dark:border-blue-700 rounded-2xl p-4 sm:p-5 shadow-lg">
          <div className="flex items-start gap-3 sm:gap-4">
            {/* Info Icon */}
            <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-blue-500 dark:bg-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 sm:w-7 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white mb-1.5">
                📱 Your Data Stays on This Device
              </h3>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                SubTrack stores all your data locally on this device only. Your subscriptions and loans <span className="font-semibold">won't sync across multiple devices</span> or browsers. Make sure to keep your data backed up if needed!
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={handleDismissBanner}
              className="flex-shrink-0 p-1.5 sm:p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Dismiss banner"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Total Cost Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/40 dark:to-blue-800/40 rounded-2xl p-5 sm:p-6 shadow-lg border border-blue-200 dark:border-blue-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs sm:text-sm font-medium text-blue-800 dark:text-blue-300 uppercase tracking-wide">
              Total Cost
            </h3>
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-3xl sm:text-4xl font-bold text-blue-900 dark:text-blue-100 mb-1">
            {formatCurrency(totalMonthlySubscriptions)}
          </p>
          <p className="text-xs sm:text-sm text-blue-700 dark:text-blue-300">
            Monthly cost • {subscriptions.length} subscriptions
          </p>
        </div>

        {/* Upcoming Renewals Card */}
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/40 dark:to-amber-800/40 rounded-2xl p-5 sm:p-6 shadow-lg border border-amber-200 dark:border-amber-700">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs sm:text-sm font-medium text-amber-800 dark:text-amber-300 uppercase tracking-wide">
              Upcoming Renewals
            </h3>
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-3xl sm:text-4xl font-bold text-amber-900 dark:text-amber-100 mb-1">
            {upcomingRenewalsCount}
          </p>
          <p className="text-xs sm:text-sm text-amber-700 dark:text-amber-300">
            Next 7 days • Track your progress
          </p>
        </div>

        {/* Loan Progress Card */}
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/40 dark:to-emerald-800/40 rounded-2xl p-5 sm:p-6 shadow-lg border border-emerald-200 dark:border-emerald-700 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs sm:text-sm font-medium text-emerald-800 dark:text-emerald-300 uppercase tracking-wide">
              Outstanding Loans
            </h3>
            <svg className="w-7 h-7 sm:w-8 sm:h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-3xl sm:text-4xl font-bold text-emerald-900 dark:text-emerald-100 mb-1">
            {formatCurrency(totalOutstandingLoans)}
          </p>
          <p className="text-xs sm:text-sm text-emerald-700 dark:text-emerald-300">
            {loans.length} active {loans.length === 1 ? 'loan' : 'loans'}
          </p>
        </div>
      </div>

      {/* Upcoming Items Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Upcoming Subscriptions */}
        <div>
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Upcoming Subscriptions
            </h2>
            <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 text-xs font-semibold px-2 sm:px-3 py-1 rounded-full">
              Next 30 Days
            </span>
          </div>
          {upcomingSubscriptions.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center border-2 border-dashed border-gray-300 dark:border-gray-600">
              <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                No upcoming renewals
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Your subscriptions are all set for now
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingSubscriptions.map((subscription) => {
                const daysUntil = getDaysUntil(subscription.renewalDate);
                return (
                  <div
                    key={subscription.id}
                    className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md hover:shadow-xl transition-all border-l-4 group"
                    style={{ borderLeftColor: subscription.colorTag }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-md"
                          style={{ backgroundColor: subscription.colorTag }}
                        >
                          {subscription.vendor.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {subscription.vendor}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                            {formatDate(subscription.renewalDate)}
                          </p>
                          {daysUntil >= 0 && daysUntil <= 7 && (
                            <span className="inline-block mt-2 text-xs bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 px-3 py-1 rounded-full font-semibold">
                              {daysUntil === 0 ? '🔔 Due Today!' : `Due in ${daysUntil} ${daysUntil === 1 ? 'day' : 'days'}`}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {formatCurrency(subscription.amount)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Upcoming Loan Payments */}
        <div>
          <div className="flex items-center justify-between mb-4 sm:mb-5">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Loan Payments Due
            </h2>
            <span className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold px-2 sm:px-3 py-1 rounded-full">
              Next 30 Days
            </span>
          </div>
          {upcomingLoans.length === 0 ? (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-8 text-center border-2 border-dashed border-gray-300 dark:border-gray-600">
              <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-gray-500 dark:text-gray-400 font-medium">
                No upcoming payments
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                All your loan payments are up to date
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingLoans.map((loan) => {
                const daysUntil = getDaysUntil(loan.paymentDate);
                const { remainingBalance, paymentProgress } = calculateLoanDetails(loan);
                return (
                  <div
                    key={loan.id}
                    className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-md hover:shadow-xl transition-all border-l-4 group"
                    style={{ borderLeftColor: loan.colorTag }}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white text-lg shadow-md"
                            style={{ backgroundColor: loan.colorTag }}
                          >
                            {loan.vendor.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 dark:text-white text-lg group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                              {loan.vendor}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                              {formatDate(loan.paymentDate)}
                            </p>
                            {daysUntil >= 0 && daysUntil <= 7 && (
                              <span className="inline-block mt-2 text-xs bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 px-3 py-1 rounded-full font-semibold">
                                {daysUntil === 0 ? '🔔 Due Today!' : `Due in ${daysUntil} ${daysUntil === 1 ? 'day' : 'days'}`}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {formatCurrency(loan.paymentAmount)}
                          </p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500 dark:text-gray-400 font-medium">
                            Remaining: {formatCurrency(remainingBalance)}
                          </span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                            {paymentProgress.toFixed(0)}% paid
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-emerald-400 dark:to-emerald-500 h-2.5 rounded-full transition-all duration-500 shadow-sm"
                            style={{ width: `${paymentProgress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
