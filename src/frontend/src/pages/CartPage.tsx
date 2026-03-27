import { useNavigate } from "@tanstack/react-router";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useData } from "../lib/DataContext";

export default function CartPage() {
  const { cart, setCart, settings } = useData();
  const navigate = useNavigate();
  const isDark = settings.theme === "dark";

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  function updateQty(productId: string, delta: number) {
    setCart(
      cart
        .map((c) =>
          c.productId === productId
            ? { ...c, quantity: Math.max(0, c.quantity + delta) }
            : c,
        )
        .filter((c) => c.quantity > 0),
    );
  }

  function removeItem(productId: string) {
    setCart(cart.filter((c) => c.productId !== productId));
  }

  return (
    <div
      className={`min-h-screen ${isDark ? "bg-[#1a1a1a]" : "bg-[var(--tdg-bg)]"} font-inter`}
    >
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="font-playfair text-2xl md:text-3xl font-bold text-[var(--tdg-dark)] mb-6">
          Your Cart
        </h1>

        {cart.length === 0 ? (
          <div
            className="bg-white rounded-2xl border border-[var(--tdg-light)] p-16 text-center"
            data-ocid="cart.empty_state"
          >
            <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
            <h2 className="text-xl font-semibold text-gray-500 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-400 mb-6">
              Add some beautiful photo frames to get started.
            </p>
            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              className="bg-[var(--tdg-amber)] text-[var(--tdg-dark)] font-bold px-8 py-3 rounded-lg hover:bg-[#e6bc00] transition-colors"
              data-ocid="cart.continue_shopping.button"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-3" data-ocid="cart.list">
              {cart.map((item, idx) => (
                <div
                  key={item.productId}
                  className="bg-white rounded-xl border border-[var(--tdg-light)] p-4 flex gap-4"
                  data-ocid={`cart.item.${idx + 1}`}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.productName}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0 border border-gray-100"
                    />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-amber-50 to-yellow-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                      <span className="text-[#333533] font-bold text-xs">
                        {item.size}
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[var(--tdg-dark)] text-sm">
                      {item.productName}
                    </h3>
                    <p className="text-xs text-gray-500">{item.size}</p>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-bold text-[var(--tdg-dark)]">
                        &#x20b9;{item.price}
                      </span>
                      <span className="text-xs text-gray-400 line-through">
                        &#x20b9;{item.mrp}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        type="button"
                        onClick={() => updateQty(item.productId, -1)}
                        className="w-7 h-7 rounded border border-[var(--tdg-light)] flex items-center justify-center hover:border-[var(--tdg-amber)]"
                        data-ocid={`cart.qty_decrease.button.${idx + 1}`}
                      >
                        <Minus size={12} />
                      </button>
                      <span className="font-bold text-sm w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQty(item.productId, 1)}
                        className="w-7 h-7 rounded border border-[var(--tdg-light)] flex items-center justify-center hover:border-[var(--tdg-amber)]"
                        data-ocid={`cart.qty_increase.button.${idx + 1}`}
                      >
                        <Plus size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId)}
                        className="ml-auto text-red-400 hover:text-red-600 p-1"
                        data-ocid={`cart.delete_button.${idx + 1}`}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-[var(--tdg-light)] p-5 sticky top-24">
                <h2 className="font-bold text-lg text-[var(--tdg-dark)] mb-4">
                  Order Summary
                </h2>
                <div className="space-y-2 text-sm mb-4">
                  {cart.map((item) => (
                    <div
                      key={item.productId}
                      className="flex justify-between text-gray-600"
                    >
                      <span>
                        {item.productName} × {item.quantity}
                      </span>
                      <span>&#x20b9;{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[var(--tdg-light)] pt-3 mb-4">
                  <div className="flex justify-between font-bold text-[var(--tdg-dark)]">
                    <span>Subtotal</span>
                    <span>&#x20b9;{subtotal}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    + Shipping calculated at checkout
                  </p>
                  {(() => {
                    const d = new Date();
                    d.setDate(d.getDate() + 4);
                    const label = d.toLocaleDateString("en-IN", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    });
                    return (
                      <p className="text-xs text-green-700 font-medium mt-1 flex items-center gap-1">
                        🚚{" "}
                        <span>
                          Delivered by{" "}
                          <span className="font-semibold">{label}</span>
                        </span>
                      </p>
                    );
                  })()}
                </div>
                <button
                  type="button"
                  onClick={() => navigate({ to: "/checkout" })}
                  className="w-full bg-[var(--tdg-amber)] hover:bg-[#e6bc00] text-[var(--tdg-dark)] font-bold py-3.5 rounded-xl transition-colors text-base"
                  data-ocid="cart.checkout.button"
                >
                  Proceed to Checkout
                </button>
                <button
                  type="button"
                  onClick={() => navigate({ to: "/" })}
                  className="w-full mt-2 text-center text-sm text-gray-500 hover:text-[#b38b00] transition-colors py-2"
                  data-ocid="cart.continue_shopping.button"
                >
                  ← Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
