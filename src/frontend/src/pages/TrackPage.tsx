import { CheckCircle, Package, Search } from "lucide-react";
import { useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useData } from "../lib/DataContext";
import { type Order, STATUS_LABELS } from "../lib/data";

const STATUS_STEPS: Order["status"][] = [
  "pending",
  "advance_confirmed",
  "processing",
  "ready",
  "delivered",
];

export default function TrackPage() {
  const [query, setQuery] = useState("");
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  const { settings, orders: allOrders } = useData();

  function search() {
    const all = allOrders;
    const q = query.trim().toUpperCase();
    const found = all.find(
      (o) => o.id.toUpperCase() === q || o.phone === query.trim(),
    );
    setOrder(found ?? null);
  }

  function getStepIndex(status: Order["status"]) {
    return STATUS_STEPS.indexOf(status);
  }

  const isDark = settings.theme === "dark";
  const bg = isDark ? "bg-[#1a1a1a]" : "bg-[#f5f5f5]";
  const card = isDark
    ? "bg-[#2a2c2a] border-[#444]"
    : "bg-white border-gray-100";
  const text = isDark ? "text-white" : "text-[#212121]";
  const sub = isDark ? "text-gray-400" : "text-gray-500";
  const inp = isDark
    ? "bg-[#333] border-[#555] text-white placeholder-gray-500"
    : "bg-white border-gray-300 text-[#212121]";

  if (!settings.trackingEnabled) {
    return (
      <div className={`min-h-screen ${bg} font-inter`}>
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-20 text-center">
          <Package size={48} className="mx-auto mb-4 text-gray-300" />
          <h2 className={`font-playfair text-2xl font-bold ${text}`}>
            Order tracking is temporarily unavailable
          </h2>
          <p className={`${sub} mt-2`}>
            Please contact us on WhatsApp: +91 {settings.whatsapp}
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bg} font-inter`}>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <p className="text-[#FED100] text-sm font-semibold uppercase tracking-widest mb-2">
            Order Tracking
          </p>
          <h1 className={`font-playfair text-3xl font-bold ${text}`}>
            Track Your Order
          </h1>
          <p className={`${sub} mt-2`}>
            Enter your Order ID (e.g. TDG123456) to track your order status
          </p>
        </div>

        <div className={`rounded-2xl shadow-sm border ${card} p-6 mb-6`}>
          <div className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter Order ID (e.g. TDG123456)"
              className={`flex-1 border rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#FED100] ${inp}`}
              onKeyDown={(e) => e.key === "Enter" && search()}
            />
            <button
              type="button"
              onClick={search}
              className="bg-[#FED100] text-[#212121] px-6 py-2.5 rounded-lg font-semibold hover:bg-[#e6bc00] flex items-center gap-2"
            >
              <Search size={16} /> Track
            </button>
          </div>
        </div>

        {order === null && (
          <div className="text-center py-10">
            <Package size={40} className="mx-auto mb-3 text-gray-300" />
            <p className={sub}>
              No order found with that ID. Please check and try again.
            </p>
          </div>
        )}

        {order && (
          <div className={`rounded-2xl shadow-sm border ${card} p-6`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="font-mono text-sm text-[#FED100] font-bold">
                  {order.id}
                </div>
                <div className={`font-semibold mt-1 ${text}`}>
                  {order.productName}
                </div>
                <div className={`text-sm ${sub}`}>
                  {order.thickness} &bull; {order.pickupCity}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-[#FED100]">
                  &#x20b9;{order.price}
                </div>
                <div className={`text-xs mt-1 ${sub}`}>
                  {new Date(order.createdAt).toLocaleDateString("en-IN")}
                </div>
              </div>
            </div>

            {order.status !== "cancelled" && (
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  {STATUS_STEPS.map((s, i) => {
                    const current = getStepIndex(order.status);
                    const done = i <= current;
                    return (
                      <div
                        key={s}
                        className="flex flex-col items-center flex-1"
                      >
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs mb-1 ${done ? "bg-[#FED100] text-[#212121]" : isDark ? "bg-[#444] text-gray-500" : "bg-gray-200 text-gray-400"}`}
                        >
                          {done ? <CheckCircle size={14} /> : i + 1}
                        </div>
                        <div
                          className={`text-xs text-center leading-tight hidden sm:block ${done ? "text-[#FED100] font-medium" : sub}`}
                        >
                          {STATUS_LABELS[s]}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="relative h-1.5 bg-gray-200 rounded-full mt-2">
                  <div
                    className="absolute left-0 top-0 h-full bg-[#FED100] rounded-full transition-all"
                    style={{
                      width: `${(getStepIndex(order.status) / (STATUS_STEPS.length - 1)) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-sm mt-3">
              <div
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  order.status === "delivered"
                    ? "bg-green-100 text-green-700"
                    : order.status === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : "bg-[#FED100]/20 text-[#b38b00]"
                }`}
              >
                {STATUS_LABELS[order.status]}
              </div>
              {order.status !== "delivered" && order.status !== "cancelled" && (
                <div className={`text-xs ${sub}`}>
                  Est. Delivery: {order.expectedDelivery}
                </div>
              )}
            </div>

            {!order.advancePaid && order.status !== "cancelled" && (
              <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                &#9888;&#65039; Advance payment pending. Your order will be
                processed after payment confirmation.
              </div>
            )}

            <div
              className={`mt-4 pt-4 border-t ${isDark ? "border-[#444]" : "border-gray-100"} text-sm grid grid-cols-2 gap-2 ${sub}`}
            >
              <div>
                <span className="font-medium">Customer:</span>{" "}
                {order.customerName}
              </div>
              <div>
                <span className="font-medium">Phone:</span> {order.phone}
              </div>
              <div>
                <span className="font-medium">Advance:</span> &#x20b9;
                {order.advanceAmount}{" "}
                {order.advancePaid ? "(Paid ✓)" : "(Pending)"}
              </div>
              {order.deliveryCharge > 0 && (
                <div>
                  <span className="font-medium">Delivery:</span> &#x20b9;
                  {order.deliveryCharge}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
