import React, { useState } from 'react';
import { Subscription, BillingCycle } from '../../types';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { ColorPicker } from '../common/ColorPicker';
import { PRESET_COLORS } from '../../types';

interface SubscriptionFormProps {
  onSubmit: (subscription: Omit<Subscription, 'id'>) => void;
  onCancel: () => void;
  initialData?: Subscription;
}

export const SubscriptionForm: React.FC<SubscriptionFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    vendor: initialData?.vendor || '',
    description: initialData?.description || '',
    datePurchased: initialData?.datePurchased || '',
    renewalDate: initialData?.renewalDate || '',
    amount: initialData?.amount?.toString() || '',
    colorTag: initialData?.colorTag || PRESET_COLORS[0].value,
    billingCycle: (initialData?.billingCycle || 'monthly') as BillingCycle,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.vendor.trim()) {
      newErrors.vendor = 'Vendor is required';
    }
    if (!formData.renewalDate) {
      newErrors.renewalDate = 'Renewal date is required';
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      vendor: formData.vendor.trim(),
      description: formData.description.trim() || undefined,
      datePurchased: formData.datePurchased || undefined,
      renewalDate: formData.renewalDate,
      amount: parseFloat(formData.amount),
      colorTag: formData.colorTag,
      billingCycle: formData.billingCycle,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Vendor"
        value={formData.vendor}
        onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
        error={errors.vendor}
        required
        placeholder="e.g., Netflix, Spotify"
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          placeholder="Optional notes about this subscription"
        />
      </div>

      <Input
        label="Date Purchased"
        type="date"
        value={formData.datePurchased}
        onChange={(e) => setFormData({ ...formData, datePurchased: e.target.value })}
      />

      <Input
        label="Renewal Date"
        type="date"
        value={formData.renewalDate}
        onChange={(e) => setFormData({ ...formData, renewalDate: e.target.value })}
        error={errors.renewalDate}
        required
      />

      <Input
        label="Amount"
        type="number"
        step="0.01"
        min="0"
        value={formData.amount}
        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        error={errors.amount}
        required
        placeholder="0.00"
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Billing Cycle <span className="text-red-500 dark:text-red-400">*</span>
        </label>
        <select
          value={formData.billingCycle}
          onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value as BillingCycle })}
          className="w-full px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly (3 months)</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <ColorPicker
        selectedColor={formData.colorTag}
        onColorChange={(color) => setFormData({ ...formData, colorTag: color })}
      />

      <div className="flex gap-3 pt-4">
        <Button type="submit" variant="primary">
          {initialData ? 'Update Subscription' : 'Add Subscription'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
