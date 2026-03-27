import { Toaster } from "@/components/ui/sonner";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Component, type ReactNode, useState } from "react";
import LoadingScreen from "./components/LoadingScreen";
import { DataProvider } from "./lib/DataContext";
import { getSettings } from "./lib/data";
import AboutPage from "./pages/AboutPage";
import AdminPage from "./pages/AdminPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import HomePage from "./pages/HomePage";
import MyOrdersPage from "./pages/MyOrdersPage";
import OrderPage from "./pages/OrderPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import TrackPage from "./pages/TrackPage";

class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("[TDG] Uncaught render error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#f5f5f5",
            fontFamily: "Inter, sans-serif",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: 48,
              marginBottom: 16,
            }}
          >
            🖼️
          </div>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: "#212121",
              marginBottom: 8,
            }}
          >
            Something went wrong
          </h2>
          <p style={{ color: "#555", marginBottom: 24, maxWidth: 400 }}>
            The app encountered an unexpected error. Please refresh the page to
            continue.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              background: "#FED100",
              color: "#212121",
              fontWeight: 700,
              padding: "12px 28px",
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              fontSize: 15,
            }}
          >
            Refresh Page
          </button>
          {this.state.error && (
            <details
              style={{
                marginTop: 24,
                color: "#888",
                fontSize: 12,
                maxWidth: 600,
              }}
            >
              <summary style={{ cursor: "pointer" }}>Error details</summary>
              <pre
                style={{
                  marginTop: 8,
                  textAlign: "left",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-all",
                }}
              >
                {this.state.error.message}
              </pre>
            </details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

const rootRoute = createRootRoute();

const homeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});
const trackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/track",
  component: TrackPage,
});
const orderRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/order/$productId",
  component: OrderPage,
});
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});
const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/cart",
  component: CartPage,
});
const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/checkout",
  component: CheckoutPage,
});
const myOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/my-orders",
  component: MyOrdersPage,
});
const productDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/product/$productId",
  component: ProductDetailPage,
});
const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: AboutPage,
});

const routeTree = rootRoute.addChildren([
  homeRoute,
  trackRoute,
  orderRoute,
  adminRoute,
  cartRoute,
  checkoutRoute,
  myOrdersRoute,
  productDetailRoute,
  aboutRoute,
]);
const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const hasLoaded =
  typeof sessionStorage !== "undefined" &&
  sessionStorage.getItem("tdg_loaded") === "1";

export default function App() {
  const [showLoading, setShowLoading] = useState(!hasLoaded);
  const settings = getSettings();

  function handleLoadDone() {
    sessionStorage.setItem("tdg_loaded", "1");
    setShowLoading(false);
  }

  return (
    <ErrorBoundary>
      <DataProvider>
        {showLoading && (
          <LoadingScreen
            onDone={handleLoadDone}
            logoImage={settings.logoImage}
            storeName={settings.storeName}
          />
        )}
        <ErrorBoundary>
          <RouterProvider router={router} />
        </ErrorBoundary>
        <Toaster richColors position="top-center" />
      </DataProvider>
    </ErrorBoundary>
  );
}
