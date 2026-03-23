import {
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import AdminPage from "./pages/AdminPage";
import HomePage from "./pages/HomePage";
import OrderPage from "./pages/OrderPage";
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

const routeTree = rootRoute.addChildren([
  homeRoute,
  trackRoute,
  orderRoute,
  adminRoute,
]);
const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
