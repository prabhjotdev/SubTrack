import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { subscriptionsService, loansService } from '../services/firebaseService';
import { Subscription, Loan } from '../types';

export const useSubscriptions = () => {
  const { currentUser } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setSubscriptions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscriptionsService.subscribe(
      currentUser.uid,
      (data) => {
        setSubscriptions(data);
        setLoading(false);
        setError(null);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const addSubscription = async (subscription: Omit<Subscription, 'id'>) => {
    if (!currentUser) throw new Error('User not authenticated');
    try {
      await subscriptionsService.add({ ...subscription, userId: currentUser.uid });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add subscription');
      throw err;
    }
  };

  const updateSubscription = async (id: string, subscription: Partial<Subscription>) => {
    try {
      await subscriptionsService.update(id, subscription);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update subscription');
      throw err;
    }
  };

  const deleteSubscription = async (id: string) => {
    try {
      await subscriptionsService.delete(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete subscription');
      throw err;
    }
  };

  return {
    subscriptions,
    loading,
    error,
    addSubscription,
    updateSubscription,
    deleteSubscription,
  };
};

export const useLoans = () => {
  const { currentUser } = useAuth();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setLoans([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = loansService.subscribe(
      currentUser.uid,
      (data) => {
        setLoans(data);
        setLoading(false);
        setError(null);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  const addLoan = async (loan: Omit<Loan, 'id'>) => {
    if (!currentUser) throw new Error('User not authenticated');
    try {
      await loansService.add({ ...loan, userId: currentUser.uid });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add loan');
      throw err;
    }
  };

  const updateLoan = async (id: string, loan: Partial<Loan>) => {
    try {
      await loansService.update(id, loan);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update loan');
      throw err;
    }
  };

  const deleteLoan = async (id: string) => {
    try {
      await loansService.delete(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete loan');
      throw err;
    }
  };

  return {
    loans,
    loading,
    error,
    addLoan,
    updateLoan,
    deleteLoan,
  };
};
