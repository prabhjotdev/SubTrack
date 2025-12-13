import React from 'react';
import { Subscription } from '../../types';
import { formatCurrency, formatDate, getDaysUntil } from '../../utils/calculations';

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
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-12 text-center border-2 border-dashed border-blue-200">
        <svg className="w-20 h-20 text-blue-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          No subscriptions yet
        </h3>
        <p className="text-gray-600">
          Add your first subscription to start tracking your recurring payments!
        </p>
      </div>
    );
  }

  const sortedSubscriptions = [...subscriptions].sort(
    (a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime()
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sortedSubscriptions.map((subscription) => {
        const daysUntil = getDaysUntil(subscription.renewalDate);
        const isOverdue = daysUntil < 0;
        const isUpcomingSoon = daysUntil >= 0 && daysUntil <= 7;

        return (
          <div
            key={subscription.id}
            className="bg-white rounded-xl shadow-lg p-6 border-l-4 hover:shadow-2xl transition-all group relative"
            style={{ borderLeftColor: subscription.colorTag }}
          >
            {/* Color indicator badge */}
            <div
              className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-md text-white font-bold text-lg"
              style={{ backgroundColor: subscription.colorTag }}
            >
              {subscription.vendor.charAt(0).toUpperCase()}
            </div>

            <div className="space-y-4 pr-12">
              {/* Header */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-1">
                  {subscription.vendor}
                </h3>
                {subscription.description && (
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {subscription.description}
                  </p>
                )}
              </div>

              {/* Amount */}
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                <p className="text-xs text-blue-600 font-medium mb-1">Monthly Cost</p>
                <p className="text-2xl font-bold text-blue-900">
                  {formatCurrency(subscription.amount)}
                </p>
              </div>

              {/* Renewal Date */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs font-medium text-gray-500">Next Renewal</p>
                </div>
                <p className="text-sm font-semibold text-gray-900">
                  {formatDate(subscription.renewalDate)}
                </p>
                {isOverdue && (
                  <span className="inline-block mt-2 text-xs bg-red-100 text-red-800 px-3 py-1 rounded-full font-semibold">
                    ⚠️ Overdue
                  </span>
                )}
                {isUpcomingSoon && !isOverdue && (
                  <span className="inline-block mt-2 text-xs bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-semibold">
                    🔔 Due in {daysUntil} {daysUntil === 1 ? 'day' : 'days'}
                  </span>
                )}
              </div>

              {subscription.datePurchased && (
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Purchased: {formatDate(subscription.datePurchased)}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => onEdit(subscription)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(subscription.id)}
                  className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
