import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  X,
} from "lucide-react";
import { useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useData } from "../lib/DataContext";
import { addOrder, getShippingCharge } from "../lib/data";

function playSuccessChime() {
  try {
    const ctx = new (
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext
    )();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(523.25, ctx.currentTime);
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15);
    osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.6);
  } catch (_e) {
    // ignore audio errors
  }
}

export default function CheckoutPage() {
  const { cart, setCart, settings, customerSession, addOrderToStore } =
    useData();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Step 1 - Address
  const [name, setName] = useState(customerSession?.name || "");
  const [phone, setPhone] = useState(customerSession?.phone || "");
  const [pincode, setPincode] = useState("");
  const [pickupCity, setPickupCity] = useState(
    settings.pickupCities?.[0] || "",
  );
  const [photoFile, setPhotoFile] = useState<string | null>(null);
  const [photoLater, setPhotoLater] = useState(false);
  const [stepError, setStepError] = useState("");

  // Step 2 - Shipping
  const shippingZones = settings.shippingZones || [];
  const shippingResult = getShippingCharge(pincode, shippingZones);
  const shippingCharge = shippingResult.charge;
  const shippingZoneName = shippingResult.zone?.name || "Standard";
  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const total = subtotal + shippingCharge;
  const advance = Math.ceil(total * 0.3);

  // Step 3 - Payment
  const [paymentDone, setPaymentDone] = useState(false);
  const [placedOrderIds, setPlacedOrderIds] = useState<string[]>([]);
  const [isPlacing, setIsPlacing] = useState(false);

  const upiId = settings.upiId || "digitalgallery@upi";

  function validateStep1() {
    if (!name.trim()) {
      setStepError("Please enter your name.");
      return false;
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setStepError("Enter a valid 10-digit mobile number.");
      return false;
    }
    if (!/^\d{6}$/.test(pincode)) {
      setStepError("Enter a valid 6-digit pincode.");
      return false;
    }
    if (!pickupCity) {
      setStepError("Please select a pickup city.");
      return false;
    }
    if (!photoFile && !photoLater) {
      setStepError(
        "Please upload your photo or check 'I'll send on WhatsApp later'.",
      );
      return false;
    }
    setStepError("");
    return true;
  }

  function confirmOrder() {
    if (isPlacing) return;
    setIsPlacing(true);
    const ids: string[] = [];
    for (const item of cart) {
      const newOrder = addOrder({
        customerName: name,
        phone,
        productId: item.productId,
        productName: item.productName,
        size: item.size,
        thickness: "1 inch",
        quantity: item.quantity,
        price: item.price * item.quantity,
        advanceAmount: Math.ceil(item.price * item.quantity * 0.3),
        advancePaid: true,
        deliveryCharge: shippingCharge,
        shippingZone: shippingZoneName,
        pincode,
        pickupCity,
        photoRef: photoFile || "WhatsApp",
        status: "pending",
        expectedDelivery: new Date(
          Date.now() + 4 * 24 * 60 * 60 * 1000,
        ).toLocaleDateString("en-IN"),
        notes: "",
      });
      addOrderToStore(newOrder);
      ids.push(newOrder.id);
    }
    setPlacedOrderIds(ids);

    // WhatsApp alert to admin
    const orderSummary = cart
      .map((i) => `${i.productName} x${i.quantity} ₹${i.price * i.quantity}`)
      .join(", ");
    const waText = encodeURIComponent(
      `🚨 NEW ORDER ALERT!\nCustomer: ${name}\nPhone: ${phone}\nPincode: ${pincode}\nItems: ${orderSummary}\nTotal: ₹${total}\nAdvance: ₹${advance}\nOrder IDs: ${ids.join(", ")}`,
    );
    window.open(
      `https://wa.me/91${settings.whatsapp}?text=${waText}`,
      "_blank",
    );

    // Chime & haptic
    playSuccessChime();
    navigator.vibrate?.([200, 100, 200]);

    setCart([]);
    setIsPlacing(false);
    setPaymentDone(true);
  }

  if (cart.length === 0 && !paymentDone) {
    return (
      <div className="min-h-screen bg-[#f5f5f5]">
        <Navbar />
        <div className="max-w-xl mx-auto px-4 py-20 text-center">
          <p className="text-gray-500 mb-4">Your cart is empty.</p>
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="bg-[#FED100] text-[#212121] font-bold px-8 py-3 rounded-lg hover:bg-[#e6bc00]"
          >
            Shop Now
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // Success screen
  if (paymentDone) {
    return (
      <div className="min-h-screen bg-[#f5f5f5]">
        <Navbar />
        <main
          className="max-w-xl mx-auto px-4 py-16 text-center"
          data-ocid="checkout.success_state"
        >
          <div className="bg-white rounded-2xl border border-[#D6D6D6] p-10 shadow-sm">
            <CheckCircle size={56} className="mx-auto mb-4 text-green-500" />
            <h1 className="font-playfair text-3xl font-bold text-[#212121] mb-2">
              Order Confirmed! 🎉
            </h1>
            <p className="text-gray-500 mb-4">
              Thank you for your order! Your canvas prints are on their way to
              being created.
            </p>
            <div className="bg-[#FED100]/10 border border-[#FED100]/30 rounded-xl p-4 mb-6">
              <p className="text-sm font-semibold text-[#7a6600] mb-2">
                Your Order IDs:
              </p>
              {placedOrderIds.map((id) => (
                <p
                  key={id}
                  className="font-mono font-bold text-[#212121] text-lg"
                >
                  {id}
                </p>
              ))}
            </div>
            <p className="text-xs text-gray-400 mb-6">
              Admin has been notified via WhatsApp. Save your Order IDs to track
              your order.
            </p>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => navigate({ to: "/my-orders" })}
                className="w-full bg-[#FED100] text-[#212121] font-bold py-3 rounded-xl hover:bg-[#e6bc00]"
                data-ocid="checkout.view_orders.button"
              >
                View My Orders
              </button>
              <button
                type="button"
                onClick={() => navigate({ to: "/" })}
                className="w-full border border-[#D6D6D6] text-[#212121] font-medium py-3 rounded-xl hover:border-[#FED100]"
                data-ocid="checkout.continue_shopping.button"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-inter">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="font-playfair text-2xl md:text-3xl font-bold text-[#212121] mb-6">
          Checkout
        </h1>

        {/* Progress indicator */}
        <div className="flex items-center gap-2 mb-8">
          {["Address", "Shipping", "Payment"].map((label, i) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors ${
                  step > i + 1
                    ? "bg-green-500 text-white"
                    : step === i + 1
                      ? "bg-[#FED100] text-[#212121]"
                      : "bg-gray-200 text-gray-400"
                }`}
              >
                {step > i + 1 ? "✓" : i + 1}
              </div>
              <span
                className={`text-xs font-medium ${step === i + 1 ? "text-[#212121]" : "text-gray-400"}`}
              >
                {label}
              </span>
              {i < 2 && <div className="flex-1 h-px bg-gray-200" />}
            </div>
          ))}
        </div>

        {/* Step 1: Address */}
        {step === 1 && (
          <div
            className="bg-white rounded-2xl border border-[#D6D6D6] p-6"
            data-ocid="checkout.address.panel"
          >
            <h2 className="font-bold text-lg text-[#212121] mb-5">
              Delivery Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="checkout-name"
                  className="text-xs text-gray-500 block mb-1"
                >
                  Full Name *
                </label>
                <input
                  id="checkout-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  data-ocid="checkout.name.input"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#FED100]"
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label
                  htmlFor="checkout-phone"
                  className="text-xs text-gray-500 block mb-1"
                >
                  Phone Number *
                </label>
                <input
                  id="checkout-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                  }
                  data-ocid="checkout.phone.input"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#FED100]"
                  placeholder="10-digit mobile number"
                />
              </div>
              <div>
                <label
                  htmlFor="checkout-pincode"
                  className="text-xs text-gray-500 block mb-1"
                >
                  Pincode *
                </label>
                <input
                  id="checkout-pincode"
                  type="text"
                  value={pincode}
                  onChange={(e) =>
                    setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  data-ocid="checkout.pincode.input"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#FED100]"
                  placeholder="6-digit pincode"
                />
              </div>
              <div>
                <label
                  htmlFor="checkout-city"
                  className="text-xs text-gray-500 block mb-1"
                >
                  Pickup City *
                </label>
                <select
                  id="checkout-city"
                  value={pickupCity}
                  onChange={(e) => setPickupCity(e.target.value)}
                  data-ocid="checkout.city.select"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#FED100]"
                >
                  {(settings.pickupCities || []).map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Photo upload */}
            <div className="border border-dashed border-gray-300 rounded-xl p-4 mb-4">
              <p className="text-sm font-medium text-[#212121] mb-3">
                Upload Your Photo *
              </p>
              <div className="flex flex-col gap-2">
                <label className="cursor-pointer inline-flex items-center gap-2 bg-gray-50 border border-gray-200 text-gray-600 rounded-lg px-4 py-2 text-sm hover:border-[#FED100] transition-colors w-fit">
                  📸 Upload Photo (JPG/PNG)
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      if (file.size > 2000000) {
                        setStepError("Photo too large. Max 2MB.");
                        return;
                      }
                      const reader = new FileReader();
                      reader.onload = () => {
                        setPhotoFile(reader.result as string);
                        setPhotoLater(false);
                      };
                      reader.readAsDataURL(file);
                    }}
                    data-ocid="checkout.photo.upload_button"
                  />
                </label>
                {photoFile && (
                  <p className="text-xs text-green-600 font-medium">
                    ✓ Photo uploaded
                  </p>
                )}
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={photoLater}
                    onChange={(e) => {
                      setPhotoLater(e.target.checked);
                      if (e.target.checked) setPhotoFile(null);
                    }}
                    className="w-4 h-4"
                    data-ocid="checkout.photo_later.checkbox"
                  />
                  I'll send my photo on WhatsApp later
                </label>
              </div>
            </div>

            {stepError && (
              <p
                className="text-red-500 text-sm mb-3"
                data-ocid="checkout.step1.error_state"
              >
                {stepError}
              </p>
            )}

            <button
              type="button"
              onClick={() => {
                if (validateStep1()) setStep(2);
              }}
              className="w-full bg-[#FED100] text-[#212121] font-bold py-3.5 rounded-xl hover:bg-[#e6bc00] transition-colors flex items-center justify-center gap-2"
              data-ocid="checkout.next_step.button"
            >
              Continue to Shipping <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Step 2: Shipping */}
        {step === 2 && (
          <div
            className="bg-white rounded-2xl border border-[#D6D6D6] p-6"
            data-ocid="checkout.shipping.panel"
          >
            <h2 className="font-bold text-lg text-[#212121] mb-5">
              Order Summary & Shipping
            </h2>

            <div className="bg-[#f5f5f5] rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Shipping Zone:</span>
                <span className="text-sm font-semibold text-[#212121]">
                  {shippingZoneName}
                </span>
              </div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">Shipping Charge:</span>
                <span className="text-sm font-semibold text-[#212121]">
                  ₹{shippingCharge}
                </span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {cart.map((item) => (
                <div
                  key={item.productId}
                  className="flex justify-between text-sm"
                >
                  <span className="text-gray-600">
                    {item.productName} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-[#D6D6D6] pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  Shipping ({shippingZoneName})
                </span>
                <span>₹{shippingCharge}</span>
              </div>
              <div className="flex justify-between font-bold text-[#212121]">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
              <div className="bg-[#FED100]/20 border border-[#FED100]/40 rounded-lg p-3 mt-2">
                <div className="flex justify-between">
                  <span className="font-semibold text-[#7a6600]">
                    30% Advance to Pay
                  </span>
                  <span className="font-bold text-[#212121] text-lg">
                    ₹{advance}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Balance ₹{total - advance} to be paid on delivery
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex items-center gap-1 border border-[#D6D6D6] text-[#212121] font-medium py-3 px-5 rounded-xl hover:border-[#FED100]"
                data-ocid="checkout.prev_step.button"
              >
                <ChevronLeft size={16} /> Back
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                className="flex-1 bg-[#FED100] text-[#212121] font-bold py-3.5 rounded-xl hover:bg-[#e6bc00] transition-colors flex items-center justify-center gap-2"
                data-ocid="checkout.proceed_payment.button"
              >
                Proceed to Payment <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Payment Modal */}
        {step === 3 && (
          <div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            data-ocid="checkout.payment.modal"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 relative">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="absolute top-4 left-4 text-gray-400 hover:text-gray-600"
                data-ocid="checkout.payment.close_button"
              >
                <X size={20} />
              </button>
              <div className="text-center mb-5 pt-2">
                <h2 className="font-playfair text-2xl font-bold text-[#212121]">
                  Pay ₹{advance} Advance
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  Complete your 30% advance payment to confirm your order
                </p>
              </div>

              {settings.qrCodeImage && (
                <div className="flex justify-center mb-4">
                  <img
                    src={settings.qrCodeImage}
                    alt="Payment QR"
                    className="w-48 h-48 object-contain rounded-xl border border-gray-200"
                  />
                </div>
              )}

              {settings.showUpiDetails !== false && (
                <div className="bg-[#f5f5f5] rounded-xl p-4 mb-4">
                  <p className="text-xs text-gray-500 mb-1">UPI ID</p>
                  <div className="flex items-center justify-between">
                    <p className="font-mono font-bold text-[#212121]">
                      {upiId}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(upiId);
                      }}
                      className="text-xs text-[#b38b00] hover:underline"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              )}

              {/* UPI deep links */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <a
                  href={`phonepe://pay?pa=${upiId}&pn=TheDigitalGallery&am=${advance}&tn=TDGOrder`}
                  className="bg-purple-600 text-white font-bold py-3 rounded-xl text-center text-sm flex items-center justify-center gap-2 hover:bg-purple-700"
                  data-ocid="checkout.phonepe.button"
                >
                  📱 PhonePe
                </a>
                <a
                  href={`tez://upi/pay?pa=${upiId}&pn=TheDigitalGallery&am=${advance}&tn=TDGOrder`}
                  className="bg-blue-500 text-white font-bold py-3 rounded-xl text-center text-sm flex items-center justify-center gap-2 hover:bg-blue-600"
                  data-ocid="checkout.gpay.button"
                >
                  💳 GPay
                </a>
              </div>

              {settings.showBankDetails !== false && (
                <div className="bg-gray-50 rounded-xl p-4 mb-4 text-sm">
                  <p className="font-semibold text-[#212121] mb-2">
                    Bank Transfer
                  </p>
                  <div className="space-y-1 text-gray-600 text-xs">
                    <p>
                      Bank:{" "}
                      <span className="font-medium">{settings.bankName}</span>
                    </p>
                    <p>
                      A/C:{" "}
                      <span className="font-medium">
                        {settings.accountNumber}
                      </span>
                    </p>
                    <p>
                      IFSC: <span className="font-medium">{settings.ifsc}</span>
                    </p>
                    <p>
                      Name:{" "}
                      <span className="font-medium">
                        {settings.accountName}
                      </span>
                    </p>
                  </div>
                </div>
              )}

              {/* Trust badges */}
              <div className="flex justify-center gap-2 flex-wrap mb-4">
                {[
                  "✓ Verified Artist",
                  "🔒 Secure UPI",
                  "✓ Quality Checked",
                ].map((b) => (
                  <span
                    key={b}
                    className="flex items-center gap-1 text-green-700 bg-green-50 border border-green-200 text-xs px-3 py-1.5 rounded-full"
                  >
                    <ShieldCheck size={11} /> {b}
                  </span>
                ))}
              </div>

              <button
                type="button"
                onClick={confirmOrder}
                disabled={isPlacing}
                className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-base"
                data-ocid="checkout.confirm_order.button"
              >
                <CheckCircle size={20} />
                {isPlacing ? "Placing Order..." : "I've Paid – Confirm Order"}
              </button>
              <p className="text-xs text-gray-400 text-center mt-2">
                By confirming, you agree that advance payment has been sent
              </p>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
