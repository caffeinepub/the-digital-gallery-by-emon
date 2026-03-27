import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useActor } from "../hooks/useActor";
import {
  type BackendActorWithOrders,
  getBackendActor,
  orderFromBackend,
} from "./backendOrders";
import {
  type CartItem,
  type CustomerSession,
  type FinanceRecord,
  type Order,
  type Product,
  type Review,
  type Settings,
  type Supplier,
  clearCart,
  clearCustomerSession,
  getCart,
  getCustomerSession,
  getFinance,
  getOrders,
  getProducts,
  getReviews,
  getSettings,
  getSuppliers,
  saveCart,
  saveCustomerSession,
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
  cart: CartItem[];
  customerSession: CustomerSession | null;
  setProducts: (p: Product[]) => void;
  setOrders: (o: Order[]) => void;
  setFinance: (f: FinanceRecord[]) => void;
  setSuppliers: (s: Supplier[]) => void;
  setSettings: (s: Settings) => void;
  setReviews: (r: Review[]) => void;
  setCart: (items: CartItem[]) => void;
  setCustomerSession: (session: CustomerSession | null) => void;
  addOrderToStore: (order: Order) => void;
  refresh: () => void;
  backendActor: BackendActorWithOrders | null;
  refreshOrdersFromBackend: () => Promise<void>;
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
  const [cart, setCartState] = useState<CartItem[]>(() => getCart());
  const [customerSession, setCustomerSessionState] =
    useState<CustomerSession | null>(() => getCustomerSession());

  const { actor, isFetching } = useActor();
  const backendActor = getBackendActor(actor);

  // Load all orders from backend on mount / actor change
  useEffect(() => {
    if (!actor || isFetching) return;
    const ba = getBackendActor(actor);
    if (!ba) return;
    ba.getOrders()
      .then((backendOrders) => {
        const converted = backendOrders.map(orderFromBackend);
        setOrdersState(converted);
        saveOrders(converted);
      })
      .catch((err) => {
        console.error(
          "Failed to load orders from backend, using localStorage:",
          err,
        );
      });
  }, [actor, isFetching]);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === "tdg_products") setProductsState(getProducts());
      if (e.key === "tdg_orders") setOrdersState(getOrders());
      if (e.key === "tdg_finance") setFinanceState(getFinance());
      if (e.key === "tdg_suppliers") setSuppliersState(getSuppliers());
      if (e.key === "tdg_settings") setSettingsState(getSettings());
      if (e.key === "tdg_reviews") setReviewsState(getReviews());
      if (e.key === "tdg_cart") setCartState(getCart());
      if (e.key === "tdg_customer")
        setCustomerSessionState(getCustomerSession());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Apply brand colors as CSS variables whenever settings change
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--tdg-bg", settings.colorBg || "#f5f5f5");
    root.style.setProperty("--tdg-dark", settings.colorDark || "#212121");
    root.style.setProperty("--tdg-medium", settings.colorMedium || "#333533");
    root.style.setProperty("--tdg-light", settings.colorLight || "#D6D6D6");
    root.style.setProperty("--tdg-amber", settings.colorAmber || "#FED100");
    root.style.setProperty("--tdg-yellow", settings.colorYellow || "#FFEE32");
  }, [settings]);

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

  const setCart = useCallback((items: CartItem[]) => {
    if (items.length === 0) {
      clearCart();
    } else {
      saveCart(items);
    }
    setCartState(items);
  }, []);

  const setCustomerSession = useCallback((session: CustomerSession | null) => {
    if (session) {
      saveCustomerSession(session);
    } else {
      clearCustomerSession();
    }
    setCustomerSessionState(session);
  }, []);

  const addOrderToStore = useCallback((order: Order) => {
    setOrdersState((prev) => {
      const updated = [...prev, order];
      saveOrders(updated);
      return updated;
    });
  }, []);

  const refreshOrdersFromBackend = useCallback(async () => {
    if (!actor) return;
    const ba = getBackendActor(actor);
    if (!ba) return;
    try {
      const backendOrders = await ba.getOrders();
      const converted = backendOrders.map(orderFromBackend);
      setOrdersState(converted);
      saveOrders(converted);
    } catch (err) {
      console.error("Failed to refresh orders from backend:", err);
    }
  }, [actor]);

  const refresh = useCallback(() => {
    setProductsState(getProducts());
    setOrdersState(getOrders());
    setFinanceState(getFinance());
    setSuppliersState(getSuppliers());
    setSettingsState(getSettings());
    setReviewsState(getReviews());
    setCartState(getCart());
    setCustomerSessionState(getCustomerSession());
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
        cart,
        customerSession,
        setProducts,
        setOrders,
        setFinance,
        setSuppliers,
        setSettings,
        setReviews,
        setCart,
        setCustomerSession,
        addOrderToStore,
        refresh,
        backendActor,
        refreshOrdersFromBackend,
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
