import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Subscription, Loan } from '../types';
import { Dashboard } from '../components/dashboard/Dashboard';

export const DashboardPage: React.FC = () => {
  const [subscriptions] = useLocalStorage<Subscription[]>('subtrack_subscriptions', []);
  const [loans] = useLocalStorage<Loan[]>('subtrack_loans', []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Dashboard</h1>
      <Dashboard subscriptions={subscriptions} loans={loans} />
    </div>
  );
};
