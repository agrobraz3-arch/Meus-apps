import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  writeBatch
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Product, Order, StoreSettings, CustomerUser } from '../types';
import { sampleProducts, initialStoreSettings } from '../data/products';

// Helper to strip undefined values recursively (Firestore rejects undefined)
export function cleanDataForFirestore<T>(data: T): T {
  if (data === undefined) {
    return undefined as any;
  }
  if (data === null || typeof data !== 'object') {
    return data;
  }
  if (Array.isArray(data)) {
    return data
      .filter((item) => item !== undefined)
      .map((item) => cleanDataForFirestore(item)) as any;
  }
  const result: Record<string, any> = {};
  for (const [key, val] of Object.entries(data)) {
    if (val !== undefined) {
      result[key] = cleanDataForFirestore(val);
    }
  }
  return result as T;
}

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore
export const db = (firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)')
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Collections
export const PRODUCTS_COLLECTION = 'products';
export const ORDERS_COLLECTION = 'orders';
export const SETTINGS_COLLECTION = 'storeSettings';
export const CUSTOMERS_COLLECTION = 'customers';

// ==================== PRODUCTS ====================

export const subscribeToProducts = (
  onProducts: (products: Product[]) => void,
  onError?: (err: Error) => void
) => {
  try {
    const colRef = collection(db, PRODUCTS_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        if (snapshot.empty) {
          // If Firestore is empty, seed initial sample products
          seedInitialProducts().then(() => {
            onProducts(sampleProducts);
          });
        } else {
          const list: Product[] = [];
          snapshot.forEach((docSnap) => {
            list.push(docSnap.data() as Product);
          });
          // Sort by creation or name
          onProducts(list);
        }
      },
      (error) => {
        console.warn('Firestore subscription fallback to local cache:', error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    console.error('Failed to subscribe to products:', error);
    return () => {};
  }
};

export const saveProductToFirestore = async (product: Product): Promise<void> => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, product.id);
    const sanitized = cleanDataForFirestore(product);
    await setDoc(docRef, sanitized, { merge: true });
  } catch (error) {
    console.error('Error saving product to Firestore:', error);
    throw error;
  }
};

export const updateProductStockInFirestore = async (productId: string, newStock: number): Promise<void> => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await updateDoc(docRef, { stock: newStock });
  } catch (error) {
    console.error('Error updating stock in Firestore:', error);
    throw error;
  }
};

export const deleteProductFromFirestore = async (productId: string): Promise<void> => {
  try {
    const docRef = doc(db, PRODUCTS_COLLECTION, productId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting product from Firestore:', error);
    throw error;
  }
};

export const seedInitialProducts = async (): Promise<void> => {
  try {
    const batch = writeBatch(db);
    sampleProducts.forEach((prod) => {
      const docRef = doc(db, PRODUCTS_COLLECTION, prod.id);
      const sanitized = cleanDataForFirestore(prod);
      batch.set(docRef, sanitized);
    });
    await batch.commit();
    console.log('Sample products seeded to Firestore successfully');
  } catch (error) {
    console.error('Error seeding products to Firestore:', error);
  }
};

// ==================== ORDERS ====================

export const subscribeToOrders = (
  onOrders: (orders: Order[]) => void,
  onError?: (err: Error) => void
) => {
  try {
    const colRef = collection(db, ORDERS_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const list: Order[] = [];
        snapshot.forEach((docSnap) => {
          list.push(docSnap.data() as Order);
        });
        // Sort descending by date
        list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        onOrders(list);
      },
      (error) => {
        console.warn('Firestore orders fallback:', error);
        if (onError) onError(error);
      }
    );
  } catch (error) {
    console.error('Failed to subscribe to orders:', error);
    return () => {};
  }
};

export const saveOrderToFirestore = async (order: Order): Promise<void> => {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, order.id);
    const sanitized = cleanDataForFirestore(order);
    await setDoc(docRef, sanitized);
  } catch (error) {
    console.error('Error saving order to Firestore:', error);
    throw error;
  }
};

export const updateOrderStatusInFirestore = async (
  orderId: string, 
  status: Order['status'], 
  trackingCode?: string
): Promise<void> => {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    const updateData: Partial<Order> = { status };
    if (trackingCode !== undefined && trackingCode !== '') {
      updateData.trackingCode = trackingCode;
    }
    const sanitized = cleanDataForFirestore(updateData);
    await updateDoc(docRef, sanitized);
  } catch (error) {
    console.error('Error updating order status in Firestore:', error);
    throw error;
  }
};

// ==================== STORE SETTINGS ====================

export const subscribeToSettings = (
  onSettings: (settings: StoreSettings) => void
) => {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, 'main');
    return onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        onSettings(docSnap.data() as StoreSettings);
      } else {
        // Seed default store settings
        const sanitized = cleanDataForFirestore(initialStoreSettings);
        setDoc(docRef, sanitized);
        onSettings(initialStoreSettings);
      }
    });
  } catch (error) {
    console.error('Failed to subscribe to settings:', error);
    return () => {};
  }
};

export const saveSettingsToFirestore = async (newSettings: StoreSettings): Promise<void> => {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, 'main');
    const sanitized = cleanDataForFirestore(newSettings);
    await setDoc(docRef, sanitized, { merge: true });
  } catch (error) {
    console.error('Error saving store settings to Firestore:', error);
    throw error;
  }
};

// ==================== CUSTOMERS ====================

export const subscribeToCustomers = (
  onCustomers: (customers: CustomerUser[]) => void
) => {
  try {
    const colRef = collection(db, CUSTOMERS_COLLECTION);
    return onSnapshot(colRef, (snapshot) => {
      const list: CustomerUser[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as CustomerUser);
      });
      onCustomers(list);
    });
  } catch (error) {
    console.error('Failed to subscribe to customers:', error);
    return () => {};
  }
};

export const saveCustomerToFirestore = async (customer: CustomerUser): Promise<void> => {
  try {
    const docRef = doc(db, CUSTOMERS_COLLECTION, customer.id);
    const sanitized = cleanDataForFirestore(customer);
    await setDoc(docRef, sanitized, { merge: true });
  } catch (error) {
    console.error('Error saving customer to Firestore:', error);
    throw error;
  }
};
