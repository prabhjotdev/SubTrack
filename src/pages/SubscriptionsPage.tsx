import React, { useState, useEffect } from 'react';
import { Subscription } from '../types';
import { useSubscriptions } from '../hooks/useFirebaseData';
import { SubscriptionForm } from '../components/subscriptions/SubscriptionForm';
import { SubscriptionList } from '../components/subscriptions/SubscriptionList';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { autoRenewSubscription, getNextRenewalDate, formatCurrency } from '../utils/calculations';

export const SubscriptionsPage: React.FC = () => {
  const {
    subscriptions,
    loading,
    addSubscription,
    updateSubscription,
    deleteSubscription,
  } = useSubscriptions();
  const [showForm, setShowForm] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | undefined>();

  // Auto-renew subscriptions when component mounts or subscriptions change
  useEffect(() => {
    subscriptions.forEach(sub => {
      const renewed = autoRenewSubscription(sub);
      if (renewed.renewalDate !== sub.renewalDate) {
        updateSubscription(sub.id, { renewalDate: renewed.renewalDate });
      }
    });
  }, []);

  const handleAdd = async (subscription: Omit<Subscription, 'id'>) => {
    try {
      await addSubscription(subscription);
      setShowForm(false);
    } catch (error) {
      console.error('Error adding subscription:', error);
      alert('Failed to add subscription. Please try again.');
    }
  };

  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setShowForm(true);
  };

  const handleUpdate = async (updatedData: Omit<Subscription, 'id'>) => {
    if (!editingSubscription) return;

    try {
      await updateSubscription(editingSubscription.id, updatedData);
      setShowForm(false);
      setEditingSubscription(undefined);
    } catch (error) {
      console.error('Error updating subscription:', error);
      alert('Failed to update subscription. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      try {
        await deleteSubscription(id);
      } catch (error) {
        console.error('Error deleting subscription:', error);
        alert('Failed to delete subscription. Please try again.');
      }
    }
  };

  const handleMarkAsPaid = async (id: string) => {
    const subscription = subscriptions.find(sub => sub.id === id);
    if (subscription) {
      const billingCycle = subscription.billingCycle || 'monthly';
      const nextRenewal = getNextRenewalDate(subscription.renewalDate, billingCycle);
      try {
        await updateSubscription(id, { renewalDate: nextRenewal });
      } catch (error) {
        console.error('Error marking as paid:', error);
        alert('Failed to mark as paid. Please try again.');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSubscription(undefined);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600 dark:text-gray-400">Loading subscriptions...</div>
      </div>
    );
  }

  // Calculate totals
  const totalAmount = subscriptions.reduce((sum, sub) => sum + sub.amount, 0);

  const subscriptionsByType = {
    weekly: subscriptions.filter(sub => sub.billingCycle === 'weekly').length,
    monthly: subscriptions.filter(sub => sub.billingCycle === 'monthly' || !sub.billingCycle).length,
    quarterly: subscriptions.filter(sub => sub.billingCycle === 'quarterly').length,
    yearly: subscriptions.filter(sub => sub.billingCycle === 'yearly').length,
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Subscriptions</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            + Add Subscription
          </Button>
        )}
      </div>

      {/* Total Summary Card */}
      {subscriptions.length > 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-2 border-blue-200 dark:border-blue-700 rounded-2xl p-5 sm:p-6 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Total Amount */}
            <div className="flex-1">
              <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 uppercase tracking-wide mb-2">
                Total Subscription Cost
              </h3>
              <p className="text-3xl sm:text-4xl font-bold text-blue-900 dark:text-blue-100 mb-3">
                {formatCurrency(totalAmount)}
              </p>

              {/* Breakdown */}
              <div className="flex flex-wrap gap-2">
                {subscriptionsByType.weekly > 0 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/40 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-700">
                    {subscriptionsByType.weekly} Weekly
                  </span>
                )}
                {subscriptionsByType.monthly > 0 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-700">
                    {subscriptionsByType.monthly} Monthly
                  </span>
                )}
                {subscriptionsByType.quarterly > 0 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700">
                    {subscriptionsByType.quarterly} Quarterly
                  </span>
                )}
                {subscriptionsByType.yearly > 0 && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-700">
                    {subscriptionsByType.yearly} Yearly
                  </span>
                )}
              </div>
            </div>

            {/* Info Icon */}
            <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-blue-500 dark:bg-blue-600 rounded-xl flex items-center justify-center">
              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <Card>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {editingSubscription ? 'Edit Subscription' : 'Add New Subscription'}
          </h2>
          <SubscriptionForm
            onSubmit={editingSubscription ? handleUpdate : handleAdd}
            onCancel={handleCancel}
            initialData={editingSubscription}
          />
        </Card>
      )}

      <SubscriptionList
        subscriptions={subscriptions}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onMarkAsPaid={handleMarkAsPaid}
      />
    </div>
  );
};
