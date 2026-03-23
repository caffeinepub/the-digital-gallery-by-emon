import { useNavigate } from "@tanstack/react-router";
import { Clock, MessageCircle, Package, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import CustomerLoginModal from "../components/CustomerLoginModal";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useData } from "../lib/DataContext";
import {
  STATUS_LABELS,
  canCancelOrder,
  getOrderDisplayStatus,
} from "../lib/data";

function useCountdown(createdAt: string) {
  const [remaining, setRemaining] = useState(0);
  useEffect(() => {
    function calc() {
      const created = new Date(createdAt).getTime();
      const deadline = created + 60 * 60 * 1000;
      const diff = Math.max(0, deadline - Date.now());
      setRemaining(diff);
    }
    calc();
    const id = setInterval(calc, 1000);
    return () => clearInterval(id);
  }, [createdAt]);
  const m = Math.floor(remaining / 60000);
  const s = Math.floor((remaining % 60000) / 1000);
  return { remaining, display: `${m}:${String(s).padStart(2, "0")}` };
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  advance_confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700",
  ready: "bg-green-100 text-green-700",
  delivered: "bg-gray-100 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
};

function OrderCard({
  order,
  onCancel,
  whatsapp,
}: {
  order: import("../lib/data").Order;
  onCancel: (id: string) => void;
  whatsapp: string;
}) {
  const { remaining, display } = useCountdown(order.createdAt);
  const cancellable = canCancelOrder(order);
  const displayStatus = getOrderDisplayStatus(order);

  function requestRefund() {
    const text = encodeURIComponent(
      `Hi, I want to request a REFUND for Order ID: ${order.id}\nProduct: ${order.productName}\nTotal Paid: ₹${order.advanceAmount}`,
    );
    window.open(`https://wa.me/91${whatsapp}?text=${text}`, "_blank");
  }

  return (
    <div className="bg-white rounded-xl border border-[#D6D6D6] p-4 md:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
        <div>
          <p className="font-mono text-sm font-bold text-[#b38b00]">
            {order.id}
          </p>
          <p className="font-semibold text-[#212121] text-sm mt-0.5">
            {order.productName}
          </p>
          <p className="text-xs text-gray-500">
            Qty: {order.quantity || 1} &bull; Size: {order.size} &bull;{" "}
            {order.pickupCity}
          </p>
        </div>
        <div className="text-right">
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-semibold ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-600"}`}
          >
            {displayStatus}
          </span>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(order.createdAt).toLocaleDateString("en-IN")}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-[#f0f0f0] pt-3">
        <div>
          <p className="text-xs text-gray-500">
            Total:{" "}
            <span className="font-semibold text-[#212121]">₹{order.price}</span>
          </p>
          <p className="text-xs text-gray-500">
            Advance Paid:{" "}
            <span className="font-semibold text-[#212121]">
              ₹{order.advanceAmount}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {cancellable && (
            <div className="flex items-center gap-1 text-orange-500 text-xs">
              <Clock size={12} />
              <span>{display} left to cancel</span>
            </div>
          )}
          <button
            type="button"
            onClick={requestRefund}
            className="flex items-center gap-1.5 text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:border-[#FED100] transition-colors"
            data-ocid="orders.refund.button"
          >
            <MessageCircle size={12} /> Refund
          </button>
          {cancellable && remaining > 0 && (
            <button
              type="button"
              onClick={() => onCancel(order.id)}
              className="flex items-center gap-1.5 text-xs border border-red-200 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
              data-ocid="orders.cancel.button"
            >
              <XCircle size={12} /> Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MyOrdersPage() {
  const { customerSession, orders, setOrders, settings } = useData();
  const navigate = useNavigate();
  const [loginOpen, setLoginOpen] = useState(false);

  const myOrders = customerSession
    ? orders
        .filter((o) => o.phone === customerSession.phone)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
    : [];

  function cancelOrder(id: string) {
    if (!window.confirm("Cancel this order? This cannot be undone.")) return;
    setOrders(
      orders.map((o) =>
        o.id === id
          ? {
              ...o,
              status: "cancelled" as const,
              cancelledAt: new Date().toISOString(),
            }
          : o,
      ),
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-inter">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-playfair text-2xl md:text-3xl font-bold text-[#212121] flex items-center gap-2">
            <Package size={28} /> My Orders
          </h1>
          {customerSession && (
            <p className="text-sm text-gray-500">
              Logged in as{" "}
              <span className="font-semibold">{customerSession.name}</span>
            </p>
          )}
        </div>

        {!customerSession ? (
          <div
            className="bg-white rounded-2xl border border-[#D6D6D6] p-12 text-center"
            data-ocid="orders.login.panel"
          >
            <Package size={48} className="mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-semibold text-[#212121] mb-2">
              Login to View Your Orders
            </h2>
            <p className="text-gray-500 mb-6">
              Enter your name and phone number to see your order history.
            </p>
            <button
              type="button"
              onClick={() => setLoginOpen(true)}
              className="bg-[#FED100] text-[#212121] font-bold px-8 py-3 rounded-xl hover:bg-[#e6bc00] transition-colors"
              data-ocid="orders.login.button"
            >
              Login to View Orders
            </button>
          </div>
        ) : myOrders.length === 0 ? (
          <div
            className="bg-white rounded-2xl border border-[#D6D6D6] p-12 text-center"
            data-ocid="orders.empty_state"
          >
            <Package size={48} className="mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-semibold text-[#212121] mb-2">
              No Orders Yet
            </h2>
            <p className="text-gray-500 mb-6">
              Start shopping to see your orders here.
            </p>
            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              className="bg-[#FED100] text-[#212121] font-bold px-8 py-3 rounded-xl hover:bg-[#e6bc00]"
              data-ocid="orders.shop.button"
            >
              Shop Now
            </button>
          </div>
        ) : (
          <div className="space-y-4" data-ocid="orders.list">
            {myOrders.map((order, idx) => (
              <div key={order.id} data-ocid={`orders.item.${idx + 1}`}>
                <OrderCard
                  order={order}
                  onCancel={cancelOrder}
                  whatsapp={settings.whatsapp}
                />
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
      <CustomerLoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
      />
    </div>
  );
}
