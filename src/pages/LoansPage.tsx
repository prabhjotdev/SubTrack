import React, { useState, useEffect } from 'react';
import { Loan } from '../types';
import { useLoans } from '../hooks/useFirebaseData';
import { LoanForm } from '../components/loans/LoanForm';
import { LoanList } from '../components/loans/LoanList';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { autoAdvanceLoanPayment, getNextRenewalDate } from '../utils/calculations';

export const LoansPage: React.FC = () => {
  const {
    loans,
    loading,
    addLoan,
    updateLoan,
    deleteLoan,
  } = useLoans();
  const [showForm, setShowForm] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Loan | undefined>();

  // Auto-advance loan payment dates when component mounts
  useEffect(() => {
    loans.forEach(loan => {
      const advanced = autoAdvanceLoanPayment(loan);
      if (advanced.paymentDate !== loan.paymentDate) {
        updateLoan(loan.id, { paymentDate: advanced.paymentDate });
      }
    });
  }, []);

  const handleAdd = async (loan: Omit<Loan, 'id'>) => {
    try {
      await addLoan(loan);
      setShowForm(false);
    } catch (error) {
      console.error('Error adding loan:', error);
      alert('Failed to add loan. Please try again.');
    }
  };

  const handleEdit = (loan: Loan) => {
    setEditingLoan(loan);
    setShowForm(true);
  };

  const handleUpdate = async (updatedData: Omit<Loan, 'id'>) => {
    if (!editingLoan) return;

    try {
      await updateLoan(editingLoan.id, updatedData);
      setShowForm(false);
      setEditingLoan(undefined);
    } catch (error) {
      console.error('Error updating loan:', error);
      alert('Failed to update loan. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this loan?')) {
      try {
        await deleteLoan(id);
      } catch (error) {
        console.error('Error deleting loan:', error);
        alert('Failed to delete loan. Please try again.');
      }
    }
  };

  const handleMarkAsPaid = async (id: string) => {
    const loan = loans.find(l => l.id === id);
    if (loan) {
      const billingCycle = loan.billingCycle || 'monthly';
      const nextPayment = getNextRenewalDate(loan.paymentDate, billingCycle);
      const newAmountPaid = loan.amountPaidSoFar + loan.paymentAmount;
      // Don't exceed total loan amount
      const finalAmountPaid = Math.min(newAmountPaid, loan.totalLoanAmount);

      try {
        await updateLoan(id, {
          paymentDate: nextPayment,
          amountPaidSoFar: finalAmountPaid,
        });
      } catch (error) {
        console.error('Error marking as paid:', error);
        alert('Failed to mark as paid. Please try again.');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingLoan(undefined);
  };

  const handleArchive = async (id: string) => {
    if (window.confirm('Archive this paid-off loan? This will remove it from your active loans list.')) {
      try {
        await deleteLoan(id);
      } catch (error) {
        console.error('Error archiving loan:', error);
        alert('Failed to archive loan. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600 dark:text-gray-400">Loading loans...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Loans</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            + Add Loan
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {editingLoan ? 'Edit Loan' : 'Add New Loan'}
          </h2>
          <LoanForm
            onSubmit={editingLoan ? handleUpdate : handleAdd}
            onCancel={handleCancel}
            initialData={editingLoan}
          />
        </Card>
      )}

      <LoanList
        loans={loans}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onMarkAsPaid={handleMarkAsPaid}
        onArchive={handleArchive}
      />
    </div>
  );
};
