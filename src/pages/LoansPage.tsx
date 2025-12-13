import React, { useState } from 'react';
import { Loan } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { LoanForm } from '../components/loans/LoanForm';
import { LoanList } from '../components/loans/LoanList';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

export const LoansPage: React.FC = () => {
  const [loans, setLoans] = useLocalStorage<Loan[]>('subtrack_loans', []);
  const [showForm, setShowForm] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Loan | undefined>();

  const handleAdd = (loan: Omit<Loan, 'id'>) => {
    const newLoan: Loan = {
      ...loan,
      id: Date.now().toString(),
    };
    setLoans([...loans, newLoan]);
    setShowForm(false);
  };

  const handleEdit = (loan: Loan) => {
    setEditingLoan(loan);
    setShowForm(true);
  };

  const handleUpdate = (updatedData: Omit<Loan, 'id'>) => {
    if (!editingLoan) return;

    const updatedLoans = loans.map((loan) =>
      loan.id === editingLoan.id
        ? { ...updatedData, id: editingLoan.id }
        : loan
    );
    setLoans(updatedLoans);
    setShowForm(false);
    setEditingLoan(undefined);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this loan?')) {
      setLoans(loans.filter((loan) => loan.id !== id));
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingLoan(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Loans</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            + Add Loan
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
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
      />
    </div>
  );
};
