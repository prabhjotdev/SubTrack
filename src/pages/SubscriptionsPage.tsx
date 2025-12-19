import React, { useState, useEffect } from 'react';
import { Subscription } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SubscriptionForm } from '../components/subscriptions/SubscriptionForm';
import { SubscriptionList } from '../components/subscriptions/SubscriptionList';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { autoRenewSubscription, getNextRenewalDate } from '../utils/calculations';

export const SubscriptionsPage: React.FC = () => {
  const [subscriptions, setSubscriptions] = useLocalStorage<Subscription[]>(
    'subtrack_subscriptions',
    []
  );
  const [showForm, setShowForm] = useState(false);
  const [editingSubscription, setEditingSubscription] = useState<Subscription | undefined>();

  // Auto-renew subscriptions when component mounts or subscriptions change
  useEffect(() => {
    const renewedSubscriptions = subscriptions.map(sub => autoRenewSubscription(sub));
    // Only update if something changed
    const hasChanges = renewedSubscriptions.some((renewed, index) =>
      renewed.renewalDate !== subscriptions[index].renewalDate
    );
    if (hasChanges) {
      setSubscriptions(renewedSubscriptions);
    }
  }, []);

  const handleAdd = (subscription: Omit<Subscription, 'id'>) => {
    const newSubscription: Subscription = {
      ...subscription,
      id: Date.now().toString(),
    };
    setSubscriptions([...subscriptions, newSubscription]);
    setShowForm(false);
  };

  const handleEdit = (subscription: Subscription) => {
    setEditingSubscription(subscription);
    setShowForm(true);
  };

  const handleUpdate = (updatedData: Omit<Subscription, 'id'>) => {
    if (!editingSubscription) return;

    const updatedSubscriptions = subscriptions.map((sub) =>
      sub.id === editingSubscription.id
        ? { ...updatedData, id: editingSubscription.id }
        : sub
    );
    setSubscriptions(updatedSubscriptions);
    setShowForm(false);
    setEditingSubscription(undefined);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this subscription?')) {
      setSubscriptions(subscriptions.filter((sub) => sub.id !== id));
    }
  };

  const handleMarkAsPaid = (id: string) => {
    const updatedSubscriptions = subscriptions.map((sub) => {
      if (sub.id === id) {
        const nextRenewal = getNextRenewalDate(sub.renewalDate, sub.billingCycle);
        return { ...sub, renewalDate: nextRenewal };
      }
      return sub;
    });
    setSubscriptions(updatedSubscriptions);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingSubscription(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Subscriptions</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            + Add Subscription
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
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
