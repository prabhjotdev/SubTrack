import React from 'react';
import { useSubscriptions, useLoans } from '../hooks/useFirebaseData';
import { Dashboard } from '../components/dashboard/Dashboard';

export const DashboardPage: React.FC = () => {
  const { subscriptions, loading: subscriptionsLoading } = useSubscriptions();
  const { loans, loading: loansLoading } = useLoans();

  if (subscriptionsLoading || loansLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Dashboard</h1>
      <Dashboard subscriptions={subscriptions} loans={loans} />
    </div>
  );
};
