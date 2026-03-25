import { Toaster } from "@/components/ui/sonner";
import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { useState } from "react";
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
    <DataProvider>
      {showLoading && (
        <LoadingScreen
          onDone={handleLoadDone}
          logoImage={settings.logoImage}
          storeName={settings.storeName}
        />
      )}
      <RouterProvider router={router} />
      <Toaster richColors position="top-center" />
    </DataProvider>
  );
}
