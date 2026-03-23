import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  type FinanceRecord,
  type Order,
  type Product,
  type Review,
  type Settings,
  type Supplier,
  getFinance,
  getOrders,
  getProducts,
  getReviews,
  getSettings,
  getSuppliers,
  saveFinance,
  saveOrders,
  saveProducts,
  saveReviews,
  saveSettings,
  saveSuppliers,
} from "./data";

interface DataContextType {
  products: Product[];
  orders: Order[];
  finance: FinanceRecord[];
  suppliers: Supplier[];
  settings: Settings;
  reviews: Review[];
  setProducts: (p: Product[]) => void;
  setOrders: (o: Order[]) => void;
  setFinance: (f: FinanceRecord[]) => void;
  setSuppliers: (s: Supplier[]) => void;
  setSettings: (s: Settings) => void;
  setReviews: (r: Review[]) => void;
  addOrderToStore: (order: Order) => void;
  refresh: () => void;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [products, setProductsState] = useState<Product[]>(() => getProducts());
  const [orders, setOrdersState] = useState<Order[]>(() => getOrders());
  const [finance, setFinanceState] = useState<FinanceRecord[]>(() =>
    getFinance(),
  );
  const [suppliers, setSuppliersState] = useState<Supplier[]>(() =>
    getSuppliers(),
  );
  const [settings, setSettingsState] = useState<Settings>(() => getSettings());
  const [reviews, setReviewsState] = useState<Review[]>(() => getReviews());

  // Listen for localStorage changes from other tabs
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === "tdg_products") setProductsState(getProducts());
      if (e.key === "tdg_orders") setOrdersState(getOrders());
      if (e.key === "tdg_finance") setFinanceState(getFinance());
      if (e.key === "tdg_suppliers") setSuppliersState(getSuppliers());
      if (e.key === "tdg_settings") setSettingsState(getSettings());
      if (e.key === "tdg_reviews") setReviewsState(getReviews());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setProducts = useCallback((p: Product[]) => {
    saveProducts(p);
    setProductsState(p);
  }, []);

  const setOrders = useCallback((o: Order[]) => {
    saveOrders(o);
    setOrdersState(o);
  }, []);

  const setFinance = useCallback((f: FinanceRecord[]) => {
    saveFinance(f);
    setFinanceState(f);
  }, []);

  const setSuppliers = useCallback((s: Supplier[]) => {
    saveSuppliers(s);
    setSuppliersState(s);
  }, []);

  const setSettings = useCallback((s: Settings) => {
    saveSettings(s);
    setSettingsState(s);
  }, []);

  const setReviews = useCallback((r: Review[]) => {
    saveReviews(r);
    setReviewsState(r);
  }, []);

  const addOrderToStore = useCallback((order: Order) => {
    setOrdersState((prev) => {
      const updated = [...prev, order];
      saveOrders(updated);
      return updated;
    });
  }, []);

  const refresh = useCallback(() => {
    setProductsState(getProducts());
    setOrdersState(getOrders());
    setFinanceState(getFinance());
    setSuppliersState(getSuppliers());
    setSettingsState(getSettings());
    setReviewsState(getReviews());
  }, []);

  return (
    <DataContext.Provider
      value={{
        products,
        orders,
        finance,
        suppliers,
        settings,
        reviews,
        setProducts,
        setOrders,
        setFinance,
        setSuppliers,
        setSettings,
        setReviews,
        addOrderToStore,
        refresh,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
