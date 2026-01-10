import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  Timestamp,
  orderBy,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Subscription, Loan } from '../types';

const SUBSCRIPTIONS_COLLECTION = 'subscriptions';
const LOANS_COLLECTION = 'loans';

// Helper function to remove undefined values from objects
// Firestore doesn't accept undefined values
const removeUndefined = <T extends Record<string, any>>(obj: T): Partial<T> => {
  const cleaned: any = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== undefined) {
      cleaned[key] = obj[key];
    }
  });
  return cleaned;
};

// Subscription operations
export const subscriptionsService = {
  // Get all subscriptions for a user
  async getAll(userId: string): Promise<Subscription[]> {
    const q = query(
      collection(db, SUBSCRIPTIONS_COLLECTION),
      where('userId', '==', userId),
      orderBy('renewalDate', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Subscription[];
  },

  // Get a single subscription
  async getById(id: string): Promise<Subscription | null> {
    const docRef = doc(db, SUBSCRIPTIONS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Subscription;
    }
    return null;
  },

  // Add a new subscription
  async add(subscription: Omit<Subscription, 'id'> & { userId: string }): Promise<string> {
    const docRef = await addDoc(collection(db, SUBSCRIPTIONS_COLLECTION), {
      ...subscription,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  },

  // Update a subscription
  async update(id: string, subscription: Partial<Subscription>): Promise<void> {
    const docRef = doc(db, SUBSCRIPTIONS_COLLECTION, id);
    const cleanedData = removeUndefined({
      ...subscription,
      updatedAt: Timestamp.now(),
    });
    await updateDoc(docRef, cleanedData);
  },

  // Delete a subscription
  async delete(id: string): Promise<void> {
    const docRef = doc(db, SUBSCRIPTIONS_COLLECTION, id);
    await deleteDoc(docRef);
  },

  // Listen to real-time updates for subscriptions
  subscribe(userId: string, callback: (subscriptions: Subscription[]) => void) {
    const q = query(
      collection(db, SUBSCRIPTIONS_COLLECTION),
      where('userId', '==', userId),
      orderBy('renewalDate', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const subscriptions = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Subscription[];
      callback(subscriptions);
    });
  },
};

// Loan operations
export const loansService = {
  // Get all loans for a user
  async getAll(userId: string): Promise<Loan[]> {
    const q = query(
      collection(db, LOANS_COLLECTION),
      where('userId', '==', userId),
      orderBy('paymentDate', 'asc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Loan[];
  },

  // Get a single loan
  async getById(id: string): Promise<Loan | null> {
    const docRef = doc(db, LOANS_COLLECTION, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Loan;
    }
    return null;
  },

  // Add a new loan
  async add(loan: Omit<Loan, 'id'> & { userId: string }): Promise<string> {
    const docRef = await addDoc(collection(db, LOANS_COLLECTION), {
      ...loan,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  },

  // Update a loan
  async update(id: string, loan: Partial<Loan>): Promise<void> {
    const docRef = doc(db, LOANS_COLLECTION, id);
    const cleanedData = removeUndefined({
      ...loan,
      updatedAt: Timestamp.now(),
    });
    await updateDoc(docRef, cleanedData);
  },

  // Delete a loan
  async delete(id: string): Promise<void> {
    const docRef = doc(db, LOANS_COLLECTION, id);
    await deleteDoc(docRef);
  },

  // Listen to real-time updates for loans
  subscribe(userId: string, callback: (loans: Loan[]) => void) {
    const q = query(
      collection(db, LOANS_COLLECTION),
      where('userId', '==', userId),
      orderBy('paymentDate', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const loans = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Loan[];
      callback(loans);
    });
  },
};

// Migration helper - migrate localStorage data to Firebase
export const migrateLocalStorageToFirebase = async (userId: string) => {
  try {
    // Get existing data from localStorage
    const localSubscriptions = localStorage.getItem('subtrack_subscriptions');
    const localLoans = localStorage.getItem('subtrack_loans');

    if (localSubscriptions) {
      const subscriptions: Subscription[] = JSON.parse(localSubscriptions);
      for (const subscription of subscriptions) {
        const { id, ...subscriptionData } = subscription;
        await subscriptionsService.add({ ...subscriptionData, userId });
      }
      console.log(`Migrated ${subscriptions.length} subscriptions to Firebase`);
    }

    if (localLoans) {
      const loans: Loan[] = JSON.parse(localLoans);
      for (const loan of loans) {
        const { id, ...loanData } = loan;
        await loansService.add({ ...loanData, userId });
      }
      console.log(`Migrated ${loans.length} loans to Firebase`);
    }

    // Mark migration as complete
    localStorage.setItem('subtrack_migrated_to_firebase', 'true');

    return true;
  } catch (error) {
    console.error('Error migrating data to Firebase:', error);
    return false;
  }
};
