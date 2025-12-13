import { Subscription, Loan } from '../types';

const SUBSCRIPTIONS_KEY = 'subtrack_subscriptions';
const LOANS_KEY = 'subtrack_loans';

export const storageUtils = {
  subscriptions: {
    getAll: (): Subscription[] => {
      try {
        const data = localStorage.getItem(SUBSCRIPTIONS_KEY);
        return data ? JSON.parse(data) : [];
      } catch (error) {
        console.error('Error loading subscriptions:', error);
        return [];
      }
    },
    save: (subscriptions: Subscription[]): void => {
      try {
        localStorage.setItem(SUBSCRIPTIONS_KEY, JSON.stringify(subscriptions));
      } catch (error) {
        console.error('Error saving subscriptions:', error);
      }
    },
  },
  loans: {
    getAll: (): Loan[] => {
      try {
        const data = localStorage.getItem(LOANS_KEY);
        return data ? JSON.parse(data) : [];
      } catch (error) {
        console.error('Error loading loans:', error);
        return [];
      }
    },
    save: (loans: Loan[]): void => {
      try {
        localStorage.setItem(LOANS_KEY, JSON.stringify(loans));
      } catch (error) {
        console.error('Error saving loans:', error);
      }
    },
  },
};
