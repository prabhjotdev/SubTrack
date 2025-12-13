import React from 'react';
import { Subscription } from '../../types';
import { formatCurrency, formatDate, getDaysUntil } from '../../utils/calculations';
import { Button } from '../common/Button';

interface SubscriptionListProps {
  subscriptions: Subscription[];
  onEdit: (subscription: Subscription) => void;
  onDelete: (id: string) => void;
}

export const SubscriptionList: React.FC<SubscriptionListProps> = ({
  subscriptions,
  onEdit,
  onDelete,
}) => {
  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No subscriptions yet. Add your first subscription to get started!
      </div>
    );
  }

  const sortedSubscriptions = [...subscriptions].sort(
    (a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime()
  );

  return (
    <div className="space-y-3">
      {sortedSubscriptions.map((subscription) => {
        const daysUntil = getDaysUntil(subscription.renewalDate);
        const isOverdue = daysUntil < 0;
        const isUpcomingSoon = daysUntil >= 0 && daysUntil <= 7;

        return (
          <div
            key={subscription.id}
            className="bg-white rounded-lg shadow-md p-4 border-l-4 transition-transform hover:scale-[1.01]"
            style={{ borderLeftColor: subscription.colorTag }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {subscription.vendor}
                  </h3>
                  <span
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: subscription.colorTag }}
                  />
                </div>
                {subscription.description && (
                  <p className="text-sm text-gray-600 mt-1">
                    {subscription.description}
                  </p>
                )}
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-gray-700">Amount:</span>
                    <span className="text-gray-900 font-semibold">
                      {formatCurrency(subscription.amount)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-gray-700">Renewal:</span>
                    <span className="text-gray-900">
                      {formatDate(subscription.renewalDate)}
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
                  {subscription.datePurchased && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium text-gray-700">Purchased:</span>
                      <span className="text-gray-600">
                        {formatDate(subscription.datePurchased)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <Button
                  variant="secondary"
                  onClick={() => onEdit(subscription)}
                  className="text-sm px-3 py-1"
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  onClick={() => onDelete(subscription.id)}
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
