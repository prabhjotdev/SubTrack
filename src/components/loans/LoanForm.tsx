import React, { useState } from 'react';
import { Loan } from '../../types';
import { Input } from '../common/Input';
import { Button } from '../common/Button';
import { ColorPicker } from '../common/ColorPicker';
import { PRESET_COLORS } from '../../types';

interface LoanFormProps {
  onSubmit: (loan: Omit<Loan, 'id'>) => void;
  onCancel: () => void;
  initialData?: Loan;
}

export const LoanForm: React.FC<LoanFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    vendor: initialData?.vendor || '',
    description: initialData?.description || '',
    totalLoanAmount: initialData?.totalLoanAmount?.toString() || '',
    amountPaidSoFar: initialData?.amountPaidSoFar?.toString() || '0',
    paymentAmount: initialData?.paymentAmount?.toString() || '',
    paymentDate: initialData?.paymentDate || '',
    lastPaymentDate: initialData?.lastPaymentDate || '',
    colorTag: initialData?.colorTag || PRESET_COLORS[0].value,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.vendor.trim()) {
      newErrors.vendor = 'Vendor is required';
    }
    if (!formData.totalLoanAmount || parseFloat(formData.totalLoanAmount) <= 0) {
      newErrors.totalLoanAmount = 'Total loan amount must be greater than 0';
    }
    if (!formData.paymentAmount || parseFloat(formData.paymentAmount) <= 0) {
      newErrors.paymentAmount = 'Payment amount must be greater than 0';
    }
    if (!formData.paymentDate) {
      newErrors.paymentDate = 'Payment date is required';
    }

    const totalLoan = parseFloat(formData.totalLoanAmount);
    const amountPaid = parseFloat(formData.amountPaidSoFar);
    if (amountPaid > totalLoan) {
      newErrors.amountPaidSoFar = 'Amount paid cannot exceed total loan amount';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      vendor: formData.vendor.trim(),
      description: formData.description.trim() || undefined,
      totalLoanAmount: parseFloat(formData.totalLoanAmount),
      amountPaidSoFar: parseFloat(formData.amountPaidSoFar),
      paymentAmount: parseFloat(formData.paymentAmount),
      paymentDate: formData.paymentDate,
      lastPaymentDate: formData.lastPaymentDate || undefined,
      colorTag: formData.colorTag,
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
        placeholder="e.g., Bank, Family, Friend"
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          placeholder="Optional notes about this loan"
        />
      </div>

      <Input
        label="Total Loan Amount"
        type="number"
        step="0.01"
        min="0"
        value={formData.totalLoanAmount}
        onChange={(e) => setFormData({ ...formData, totalLoanAmount: e.target.value })}
        error={errors.totalLoanAmount}
        required
        placeholder="0.00"
      />

      <Input
        label="Amount Paid So Far"
        type="number"
        step="0.01"
        min="0"
        value={formData.amountPaidSoFar}
        onChange={(e) => setFormData({ ...formData, amountPaidSoFar: e.target.value })}
        error={errors.amountPaidSoFar}
        required
        placeholder="0.00"
      />

      <Input
        label="Payment Amount"
        type="number"
        step="0.01"
        min="0"
        value={formData.paymentAmount}
        onChange={(e) => setFormData({ ...formData, paymentAmount: e.target.value })}
        error={errors.paymentAmount}
        required
        placeholder="0.00"
      />

      <Input
        label="Payment Date (Next Due)"
        type="date"
        value={formData.paymentDate}
        onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
        error={errors.paymentDate}
        required
      />

      <Input
        label="Last Payment Date"
        type="date"
        value={formData.lastPaymentDate}
        onChange={(e) => setFormData({ ...formData, lastPaymentDate: e.target.value })}
      />

      <ColorPicker
        selectedColor={formData.colorTag}
        onColorChange={(color) => setFormData({ ...formData, colorTag: color })}
      />

      <div className="flex gap-3 pt-4">
        <Button type="submit" variant="primary">
          {initialData ? 'Update Loan' : 'Add Loan'}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
};
