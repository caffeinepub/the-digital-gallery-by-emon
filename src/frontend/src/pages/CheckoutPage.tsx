import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ShieldCheck,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import SwipeConfirmButton from "../components/SwipeConfirmButton";
import { useData } from "../lib/DataContext";
import { addOrder } from "../lib/data";
import { playClick } from "../lib/sounds";

const UPI_APPS = [
  {
    name: "PhonePe",
    color: "#5f259f",
    textColor: "white",
    icon: "P",
    logo: "/assets/uploads/screenshot_20260325-163521.google-019d24b2-e5b4-74fb-9660-0f556232b583-4.png",
    getLink: (upiId: string, amount: number) =>
      `phonepe://pay?pa=${upiId}&pn=TheDigitalGallery&am=${amount}&cu=INR`,
  },
  {
    name: "GPay",
    color: "#4285F4",
    textColor: "white",
    icon: "G",
    logo: "/assets/uploads/screenshot_20260325-163122.google-019d24b2-e643-7628-8074-07e1a45f0614-5.png",
    getLink: (upiId: string, amount: number) =>
      `tez://upi/pay?pa=${upiId}&pn=TheDigitalGallery&am=${amount}&cu=INR`,
  },
  {
    name: "Paytm",
    color: "#00BAF2",
    textColor: "white",
    icon: "P",
    logo: "/assets/uploads/screenshot_20260325-162938.google-019d24b2-e6ea-7067-9b7e-f982469a5017-6.png",
    getLink: (upiId: string, amount: number) =>
      `paytmmp://pay?pa=${upiId}&pn=TheDigitalGallery&am=${amount}&cu=INR`,
  },
  {
    name: "Amazon Pay",
    color: "#FF9900",
    textColor: "white",
    icon: "A",
    logo: "/assets/uploads/screenshot_20260325-171223.google-019d24d1-44cc-7211-b160-7b1f059b2ec4-1.png",
    getLink: (upiId: string, amount: number) =>
      `upi://pay?pa=${upiId}&pn=TheDigitalGallery&am=${amount}&cu=INR&tn=AmazonPay`,
  },
  {
    name: "BHIM",
    color: "#0e5eaa",
    textColor: "white",
    icon: "B",
    logo: "/assets/uploads/bhim-019d24b2-d62b-753e-900f-1a9a32dee591-2.jpg",
    getLink: (upiId: string, amount: number) =>
      `upi://pay?pa=${upiId}&pn=TheDigitalGallery&am=${amount}&cu=INR`,
  },
  {
    name: "FamPay",
    color: "#FFCA28",
    textColor: "#212121",
    icon: "F",
    logo: "/assets/uploads/f798301b915d88b373c26cb5e05cb672-019d24b2-d6cb-71f8-bdcb-a3715ac1c080-3.jpg",
    getLink: (upiId: string, amount: number) =>
      `upi://pay?pa=${upiId}&pn=TheDigitalGallery&am=${amount}&cu=INR&tn=FamPay`,
  },
  {
    name: "CRED",
    color: "#1a1a2e",
    textColor: "white",
    icon: "C",
    logo: "",
    getLink: (upiId: string, amount: number) =>
      `upi://pay?pa=${upiId}&pn=TheDigitalGallery&am=${amount}&cu=INR&tn=CRED`,
  },
  {
    name: "Navi UPI",
    color: "#00a046",
    textColor: "white",
    icon: "N",
    logo: "/assets/uploads/icon-019d24b2-d617-766e-b73e-34734fc202cc-1.png",
    getLink: (upiId: string, amount: number) =>
      `upi://pay?pa=${upiId}&pn=TheDigitalGallery&am=${amount}&cu=INR&tn=Navi`,
  },
  {
    name: "Airtel Pay",
    color: "#e40000",
    textColor: "white",
    icon: "A",
    logo: "/assets/uploads/screenshot_20260325-171328.google-019d24d1-45ff-750f-9061-ceb313a6a772-2.png",
    getLink: (upiId: string, amount: number) =>
      `upi://pay?pa=${upiId}&pn=TheDigitalGallery&am=${amount}&cu=INR&tn=Airtel`,
  },
  {
    name: "Any UPI App",
    color: "#FED100",
    textColor: "#212121",
    icon: "₹",
    logo: "",
    getLink: (upiId: string, amount: number) =>
      `upi://pay?pa=${upiId}&pn=TheDigitalGallery&am=${amount}&cu=INR`,
  },
];

const QR_TIMER_SECONDS = 179;

function QrCodeSection({ qrImage }: { qrImage: string }) {
  const [revealed, setRevealed] = useState(true);
  const [timeLeft, setTimeLeft] = useState(QR_TIMER_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    setTimeLeft(QR_TIMER_SECONDS);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setRevealed(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  function revealQr() {
    playClick();
    setRevealed(true);
    startTimer();
  }

  if (!revealed) {
    return (
      <div className="flex flex-col items-center gap-3 py-4">
        <div className="w-44 h-44 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50">
          <span className="text-3xl mb-2">🔒</span>
          <p className="text-xs text-gray-400 text-center px-4">
            QR code hidden for security
          </p>
        </div>
        <button
          type="button"
          onClick={revealQr}
          className="flex items-center gap-2 bg-[#FED100] text-[#212121] font-bold px-5 py-2.5 rounded-xl hover:bg-[#e6bc00] transition-colors text-sm"
          data-ocid="checkout.reveal_qr.button"
        >
          <RefreshCw size={14} /> Tap to reveal QR
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <img
          src={qrImage}
          alt="Payment QR"
          className="w-44 h-44 object-contain rounded-xl border border-gray-200 mb-2"
        />
        {/* Countdown badge */}
        <div
          className="absolute -top-2 -right-2 rounded-full px-2 py-0.5 text-xs font-bold text-white shadow-md"
          style={{
            background: timeLeft <= 15 ? "#e53e3e" : "#dd6b20",
            minWidth: "52px",
            textAlign: "center",
          }}
        >
          {timeLeft}s
        </div>
      </div>
      <p className="text-xs text-gray-500 text-center mb-1">
        Open any UPI App &amp; scan to pay
      </p>
      <p className="text-[10px] text-orange-500 font-medium mb-2">
        QR expires in {timeLeft}s
      </p>
      {/* Small app logos row */}
      <div className="flex gap-2 items-center">
        {UPI_APPS.slice(0, 4).map((app) =>
          app.logo ? (
            <img
              key={app.name}
              src={app.logo}
              alt={app.name}
              className="w-7 h-7 rounded-lg object-contain border border-gray-100"
            />
          ) : (
            <div
              key={app.name}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
              style={{ background: app.color }}
            >
              {app.icon}
            </div>
          ),
        )}
        <span className="text-xs text-gray-400">+ more</span>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const { cart, setCart, settings, customerSession, addOrderToStore } =
    useData();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [name, setName] = useState(customerSession?.name || "");
  const [phone, setPhone] = useState(customerSession?.phone || "");
  const [selectedLocationId, setSelectedLocationId] = useState(
    settings.deliveryLocations?.[0]?.id || "",
  );
  const [pickupCity, setPickupCity] = useState(
    settings.pickupCities?.[0] || "",
  );
  const [stepError, setStepError] = useState("");
  const [isPlacing, setIsPlacing] = useState(false);

  const deliveryLocations = settings.deliveryLocations || [];
  const selectedLocation =
    deliveryLocations.find((l) => l.id === selectedLocationId) ||
    deliveryLocations[0];
  const shippingCharge = selectedLocation?.charge ?? 0;
  const locationName = selectedLocation?.name || "Standard";

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const total = subtotal + shippingCharge;
  const advance = Math.ceil(total * 0.3);

  const [paymentDone, setPaymentDone] = useState(false);
  const [placedOrderIds, setPlacedOrderIds] = useState<string[]>([]);

  const upiId = settings.upiId || "digitalgallery@upi";
  const adminWa = settings.whatsapp || "9365246096";

  function validateStep1() {
    if (!name.trim()) {
      setStepError("Please enter your name.");
      return false;
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setStepError("Enter a valid 10-digit mobile number.");
      return false;
    }
    if (!selectedLocationId) {
      setStepError("Please select a delivery location.");
      return false;
    }
    if (!pickupCity) {
      setStepError("Please select a pickup city.");
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
        shippingZone: locationName,
        pincode: "",
        pickupCity,
        photoRef: "via WhatsApp",
        status: "pending",
        expectedDelivery: new Date(
          Date.now() + 4 * 24 * 60 * 60 * 1000,
        ).toLocaleDateString("en-IN"),
        notes: "",
        frameColour: item.frameColour,
      });
      addOrderToStore(newOrder);
      ids.push(newOrder.id);
    }
    setPlacedOrderIds(ids);
    const orderSummary = cart
      .map(
        (i) =>
          `${i.productName} x${i.quantity} ₹${i.price * i.quantity}${i.frameColour ? ` [${i.frameColour}]` : ""}`,
      )
      .join(", ");
    const waText = encodeURIComponent(
      `🚨 NEW ORDER ALERT!\nCustomer: ${name}\nPhone: ${phone}\nLocation: ${locationName}\nItems: ${orderSummary}\nTotal: ₹${total}\nAdvance: ₹${advance}\nOrder IDs: ${ids.join(", ")}`,
    );
    window.open(`https://wa.me/91${adminWa}?text=${waText}`, "_blank");
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
            onClick={() => {
              playClick();
              navigate({ to: "/" });
            }}
            className="bg-[#FED100] text-[#212121] font-bold px-8 py-3 rounded-lg hover:bg-[#e6bc00]"
          >
            Shop Now
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  if (paymentDone) {
    const orderText = encodeURIComponent(
      `Hi, I have placed order ${placedOrderIds.join(", ")}. Here is my photo:`,
    );
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
              Thank you! Your photo frames are on their way to being created.
            </p>
            <div className="bg-[#FED100]/10 border border-[#FED100]/30 rounded-xl p-4 mb-4">
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
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-5">
              <p className="text-sm font-semibold text-green-800 mb-1">
                📸 Send your photo via WhatsApp
              </p>
              <p className="text-xs text-green-700 mb-3">
                Send the photo you want printed along with your Order ID
              </p>
              <a
                href={`https://wa.me/91${adminWa}?text=${orderText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors text-sm"
                data-ocid="checkout.whatsapp_photo.button"
              >
                Send Photo on WhatsApp
              </a>
            </div>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => {
                  playClick();
                  navigate({ to: "/my-orders" });
                }}
                className="w-full bg-[#FED100] text-[#212121] font-bold py-3 rounded-xl hover:bg-[#e6bc00]"
                data-ocid="checkout.view_orders.button"
              >
                View My Orders
              </button>
              <button
                type="button"
                onClick={() => {
                  playClick();
                  navigate({ to: "/" });
                }}
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

        <div className="flex items-center gap-2 mb-8">
          {["Address", "Summary", "Payment"].map((label, i) => (
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
                  htmlFor="checkout-location"
                  className="text-xs text-gray-500 block mb-1"
                >
                  Delivery Location *
                </label>
                <select
                  id="checkout-location"
                  value={selectedLocationId}
                  onChange={(e) => {
                    playClick();
                    setSelectedLocationId(e.target.value);
                  }}
                  data-ocid="checkout.location.select"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#FED100] relative z-10 bg-white"
                >
                  <option value="">-- Select location --</option>
                  {deliveryLocations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}{" "}
                      {loc.charge === 0
                        ? "(Free Delivery)"
                        : `(+₹${loc.charge})`}
                    </option>
                  ))}
                </select>
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
                  onChange={(e) => {
                    playClick();
                    setPickupCity(e.target.value);
                  }}
                  data-ocid="checkout.city.select"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#FED100] relative z-10 bg-white"
                >
                  {(settings.pickupCities || []).map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="border border-green-200 bg-green-50 rounded-xl p-4 mb-4">
              <p className="text-sm font-semibold text-green-800 mb-1">
                📸 Send your photo via WhatsApp after ordering
              </p>
              <p className="text-xs text-green-700">
                After placing your order, you'll get a WhatsApp button to send
                your photo directly to us
              </p>
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
                playClick();
                if (validateStep1()) setStep(2);
              }}
              className="w-full bg-[#FED100] text-[#212121] font-bold py-3.5 rounded-xl hover:bg-[#e6bc00] transition-colors flex items-center justify-center gap-2"
              data-ocid="checkout.next_step.button"
            >
              Continue to Summary <ChevronRight size={18} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div
            className="bg-white rounded-2xl border border-[#D6D6D6] p-6"
            data-ocid="checkout.shipping.panel"
          >
            <h2 className="font-bold text-lg text-[#212121] mb-5">
              Order Summary
            </h2>
            <div className="bg-[#f5f5f5] rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500">
                  Delivery Location:
                </span>
                <span className="text-sm font-semibold text-[#212121]">
                  {locationName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Delivery Charge:</span>
                <span className="text-sm font-semibold text-[#212121]">
                  {shippingCharge === 0 ? "Free" : `₹${shippingCharge}`}
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
                    {item.frameColour && (
                      <span className="ml-1 text-[#b38b00] text-xs">
                        [{item.frameColour}]
                      </span>
                    )}
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
                <span className="text-gray-500">Delivery</span>
                <span>
                  {shippingCharge === 0 ? "Free" : `₹${shippingCharge}`}
                </span>
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
                onClick={() => {
                  playClick();
                  setStep(1);
                }}
                className="flex items-center gap-1 border border-[#D6D6D6] text-[#212121] font-medium py-3 px-5 rounded-xl hover:border-[#FED100]"
                data-ocid="checkout.prev_step.button"
              >
                <ChevronLeft size={16} /> Back
              </button>
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setStep(3);
                }}
                className="flex-1 bg-[#FED100] text-[#212121] font-bold py-3.5 rounded-xl hover:bg-[#e6bc00] transition-colors flex items-center justify-center gap-2"
                data-ocid="checkout.proceed_payment.button"
              >
                Proceed to Payment <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            data-ocid="checkout.payment.modal"
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[92vh] overflow-y-auto relative">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <div>
                  <h2 className="font-bold text-lg text-[#212121]">
                    Pay ₹{advance} Advance
                  </h2>
                  <p className="text-xs text-gray-500">
                    Complete 30% advance to confirm your order
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    setStep(2);
                  }}
                  className="text-gray-400 hover:text-gray-600 p-1"
                  data-ocid="checkout.payment.close_button"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-5">
                {/* All UPI Options */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-base font-bold text-[#212121]">
                      💳 All UPI Options
                    </span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {UPI_APPS.map((app) => (
                      <a
                        key={app.name}
                        href={app.getLink(upiId, advance)}
                        onClick={() => playClick()}
                        className="flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-sm transition-all bg-white"
                        data-ocid={`checkout.${app.name.toLowerCase().replace(/\s+/g, "_")}.button`}
                      >
                        {app.logo ? (
                          <img
                            src={app.logo}
                            alt={app.name}
                            className="w-14 h-14 object-contain rounded-xl"
                          />
                        ) : (
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-bold shadow-sm flex-shrink-0"
                            style={{
                              background: app.color,
                              color: app.textColor,
                            }}
                          >
                            {app.icon}
                          </div>
                        )}
                        <span className="text-[10px] font-medium text-gray-600 text-center leading-tight">
                          {app.name}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-gray-200" />
                  <span className="text-xs text-gray-400 font-medium">OR</span>
                  <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* QR Code section */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-bold text-[#212121]">
                      📱 Scan QR Code
                    </span>
                  </div>
                  {settings.qrCodeImage ? (
                    <QrCodeSection qrImage={settings.qrCodeImage} />
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-4 text-center">
                      <p className="text-sm text-gray-400">
                        UPI ID:{" "}
                        <span className="font-mono font-bold text-[#212121]">
                          {upiId}
                        </span>
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          playClick();
                          navigator.clipboard?.writeText(upiId);
                        }}
                        className="text-xs text-[#b38b00] hover:underline mt-1"
                      >
                        Copy UPI ID
                      </button>
                    </div>
                  )}
                </div>

                {settings.showBankDetails !== false && (
                  <>
                    <div className="flex items-center gap-3 my-4">
                      <div className="flex-1 h-px bg-gray-200" />
                      <span className="text-xs text-gray-400 font-medium">
                        OR
                      </span>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>
                    <div className="bg-gray-50 rounded-xl p-4 mb-4 text-sm">
                      <p className="font-semibold text-[#212121] mb-2">
                        Bank Transfer
                      </p>
                      <div className="space-y-1 text-gray-600 text-xs">
                        <p>
                          Bank:{" "}
                          <span className="font-medium">
                            {settings.bankName}
                          </span>
                        </p>
                        <p>
                          A/C:{" "}
                          <span className="font-medium">
                            {settings.accountNumber}
                          </span>
                        </p>
                        <p>
                          IFSC:{" "}
                          <span className="font-medium">{settings.ifsc}</span>
                        </p>
                        <p>
                          Name:{" "}
                          <span className="font-medium">
                            {settings.accountName}
                          </span>
                        </p>
                      </div>
                    </div>
                  </>
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

                {/* Swipe to confirm */}
                <SwipeConfirmButton
                  onConfirm={confirmOrder}
                  disabled={isPlacing}
                  label="Swipe to Confirm Order →"
                />
                <p className="text-xs text-gray-400 text-center mt-2">
                  Swipe right after completing payment
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
