import { useNavigate, useParams } from "@tanstack/react-router";
import { CheckCircle, Copy, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useData } from "../lib/DataContext";
import { type Product, addOrder } from "../lib/data";

const STEPS = ["Size & Style", "Upload Photo", "Your Details", "Payment"];

export default function OrderPage() {
  const { productId } = useParams({ strict: false }) as { productId: string };
  const searchParams = new URLSearchParams(window.location.search);
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [product, setProduct] = useState<Product | null>(null);
  const [thickness, setThickness] = useState(
    searchParams.get("thickness") || '1"',
  );
  const [photoRef, setPhotoRef] = useState("");
  const [whatsappLater, setWhatsappLater] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [showPayment, setShowPayment] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [copied, setCopied] = useState(false);
  const { settings, products: allProducts, addOrderToStore } = useData();
  const pickupCities = settings.pickupCities || [
    "Basugaon",
    "Kokrajhar",
    "Bongaigaon",
    "Barpeta Road",
  ];

  useEffect(() => {
    const p = allProducts.find((x) => x.id === productId);
    if (p) setProduct(p);
  }, [productId, allProducts]);

  if (!product)
    return (
      <div className="flex items-center justify-center h-screen">
        Product not found
      </div>
    );

  const extra = thickness === '1.5"' ? 200 : 0;
  const price = product.price + extra;
  const advance = Math.ceil(price * 0.3);

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) setPhotoRef(file.name);
  }

  function placeOrder() {
    const today = new Date();
    today.setDate(today.getDate() + 4);
    const deliveryDate = today.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const order = addOrder({
      customerName,
      phone,
      productId: product!.id,
      productName: `${product!.name} ${product!.size}`,
      size: product!.size,
      thickness,
      quantity: 1,
      price,
      advanceAmount: advance,
      advancePaid: false,
      deliveryCharge: 0,
      pickupCity: city,
      photoRef: whatsappLater ? "whatsapp_later" : photoRef,
      status: "pending",
      expectedDelivery: deliveryDate,
      notes: "",
    });
    addOrderToStore(order);
    setOrderId(order.id);
    setStep(4);
  }

  if (step === 4) {
    return (
      <div className="min-h-screen bg-[#f5f5f5] font-inter">
        <Navbar />
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <div className="bg-white rounded-2xl shadow-sm border border-[#D6D6D6] p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h2 className="font-playfair text-2xl font-bold text-[#212121] mb-2">
              Order Placed!
            </h2>
            <p className="text-gray-600 mb-4">
              Your order has been received. Please complete the 30% advance
              payment.
            </p>
            <div className="bg-[#FFEE32]/20 rounded-lg p-4 mb-4">
              <div className="text-sm text-gray-500 mb-1">Your Order ID</div>
              <div className="font-mono font-bold text-2xl text-[#212121]">
                {orderId}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Save this ID to track your order
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-6">
              <div className="flex justify-between py-1 border-b">
                <span>Product</span>
                <span className="font-medium">
                  {product.name} {product.size}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span>Total</span>
                <span className="font-medium">&#x20b9;{price}</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span>Advance (30%)</span>
                <span className="font-bold text-[#b38b00]">
                  &#x20b9;{advance}
                </span>
              </div>
              <div className="flex justify-between py-1">
                <span>Estimated Delivery</span>
                <span className="font-medium">
                  {new Date(Date.now() + 4 * 86400000).toLocaleDateString(
                    "en-IN",
                    { day: "numeric", month: "long" },
                  )}
                </span>
              </div>
            </div>
            <div className="bg-[#FED100]/10 border border-[#FED100] rounded-lg p-4 mb-4 text-left">
              <div className="font-semibold text-sm text-gray-800 mb-2">
                Pay &#x20b9;{advance} advance to:
              </div>
              <div className="text-sm space-y-1">
                {settings.showUpiDetails !== false && (
                  <div>
                    <span className="text-gray-500">UPI:</span>{" "}
                    <span className="font-mono font-semibold text-[#b38b00]">
                      {settings.upiId}
                    </span>
                  </div>
                )}
                {settings.showBankDetails !== false && (
                  <>
                    <div>
                      <span className="text-gray-500">Account Name:</span>{" "}
                      {settings.accountName}
                    </div>
                    <div>
                      <span className="text-gray-500">Bank:</span>{" "}
                      {settings.bankName}
                    </div>
                    <div>
                      <span className="text-gray-500">A/C No:</span>{" "}
                      {settings.accountNumber}
                    </div>
                    <div>
                      <span className="text-gray-500">IFSC:</span>{" "}
                      {settings.ifsc}
                    </div>
                  </>
                )}
              </div>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              &#x1F6E1;&#xFE0F; 100% Refund within 24 hours if delivery is not
              feasible in your area
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(orderId);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="flex-1 flex items-center justify-center gap-2 border border-gray-300 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50"
              >
                <Copy size={16} /> {copied ? "Copied!" : "Copy Order ID"}
              </button>
              <button
                type="button"
                onClick={() => navigate({ to: "/track" })}
                className="flex-1 bg-[#FED100] text-[#212121] rounded-lg py-2.5 text-sm font-bold hover:bg-[#e6bc00]"
              >
                Track Order
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] font-inter">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="flex items-center gap-2 mb-8 overflow-x-auto">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-shrink-0">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  i < step
                    ? "bg-green-500 text-white"
                    : i === step
                      ? "bg-[#FED100] text-[#212121]"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {i < step ? <CheckCircle size={16} /> : i + 1}
              </div>
              <span
                className={`text-sm ${i === step ? "text-[#b38b00] font-medium" : "text-gray-400"} hidden sm:block`}
              >
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <div className="w-6 h-0.5 bg-gray-200" />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#D6D6D6] p-6">
          {step === 0 && (
            <div>
              <h2 className="font-playfair text-xl font-bold text-[#212121] mb-4">
                Select Size &amp; Style
              </h2>
              <div className="bg-[#FFEE32]/20 rounded-lg p-4 mb-4">
                <div className="font-semibold text-[#212121]">
                  {product.name} {product.size}
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  {product.description}
                </div>
              </div>
              <div className="mb-4">
                <div className="block text-sm font-medium mb-2">Thickness</div>
                <div className="grid grid-cols-2 gap-3">
                  {(['1"', '1.5"'] as const).map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setThickness(t)}
                      className={`border-2 rounded-lg p-4 text-center transition-colors ${thickness === t ? "border-[#FED100] bg-[#FED100]/10" : "border-[#D6D6D6] hover:border-gray-300"}`}
                    >
                      <div className="font-semibold">{t} thick</div>
                      {t === '1.5"' && (
                        <div className="text-xs text-gray-500 mt-1">
                          +&#x20b9;200
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Price</span>
                  <span className="font-bold text-[#212121] text-lg">
                    &#x20b9;{price}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-600">30% Advance Required</span>
                  <span className="font-semibold text-[#b38b00]">
                    &#x20b9;{advance}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full bg-[#FED100] text-[#212121] py-3 rounded-lg font-bold hover:bg-[#e6bc00]"
              >
                Continue
              </button>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 className="font-playfair text-xl font-bold text-[#212121] mb-4">
                Upload Your Photo
              </h2>
              <button
                type="button"
                className="border-2 border-dashed border-[#D6D6D6] rounded-xl p-10 text-center cursor-pointer hover:border-[#FED100] transition-colors mb-4 w-full"
                onClick={() => document.getElementById("photo-input")?.click()}
              >
                <Upload size={32} className="mx-auto mb-2 text-gray-400" />
                {photoRef ? (
                  <p className="text-green-600 font-medium">{photoRef}</p>
                ) : (
                  <p className="text-gray-500">Click to upload your photo</p>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  JPG, PNG, WEBP accepted
                </p>
              </button>
              <input
                id="photo-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
              <label className="flex items-center gap-3 cursor-pointer mb-6">
                <input
                  type="checkbox"
                  checked={whatsappLater}
                  onChange={(e) => setWhatsappLater(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">
                  I'll send my photo on WhatsApp later (+91 {settings.whatsapp})
                </span>
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(0)}
                  className="flex-1 border border-[#D6D6D6] py-3 rounded-lg font-medium hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!photoRef && !whatsappLater}
                  className="flex-1 bg-[#FED100] text-[#212121] py-3 rounded-lg font-bold hover:bg-[#e6bc00] disabled:opacity-50"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="font-playfair text-xl font-bold text-[#212121] mb-4">
                Your Details
              </h2>
              <div className="space-y-4 mb-6">
                <div>
                  <div className="block text-sm font-medium mb-1">
                    Full Name *
                  </div>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full border border-[#D6D6D6] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#FED100]"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <div className="block text-sm font-medium mb-1">
                    Phone Number *
                  </div>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-[#D6D6D6] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#FED100]"
                    placeholder="10-digit mobile number"
                    maxLength={10}
                  />
                </div>
                <div>
                  <div className="block text-sm font-medium mb-1">
                    Pickup City *
                  </div>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border border-[#D6D6D6] rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#FED100]"
                  >
                    <option value="">Select your city</option>
                    {pickupCities.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 border border-[#D6D6D6] py-3 rounded-lg font-medium hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  disabled={!customerName || phone.length < 10 || !city}
                  className="flex-1 bg-[#FED100] text-[#212121] py-3 rounded-lg font-bold hover:bg-[#e6bc00] disabled:opacity-50"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="font-playfair text-xl font-bold text-[#212121] mb-4">
                Order Summary
              </h2>
              <div className="space-y-2 text-sm mb-4">
                {[
                  ["Product", `${product.name} ${product.size}`],
                  ["Thickness", thickness],
                  ["Photo", whatsappLater ? "Via WhatsApp" : photoRef],
                  ["Customer", customerName],
                  ["Phone", phone],
                  ["Pickup City", city],
                  ["Total Price", `\u20b9${price}`],
                  ["30% Advance", `\u20b9${advance}`],
                ].map(([k, v]) => (
                  <div
                    key={k}
                    className="flex justify-between py-2 border-b last:border-0"
                  >
                    <span className="text-gray-500">{k}</span>
                    <span
                      className={`font-medium ${k === "30% Advance" ? "text-[#b38b00] font-bold" : k === "Total Price" ? "text-[#212121] font-bold text-lg" : ""}`}
                    >
                      {v}
                    </span>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setShowPayment(true)}
                className="w-full border-2 border-[#FED100] text-[#b38b00] py-3 rounded-lg font-semibold hover:bg-[#FED100]/10 mb-3"
              >
                View Payment Details
              </button>
              {showPayment && (
                <div className="bg-[#FED100]/10 border border-[#FED100] rounded-lg p-4 mb-4 text-sm">
                  <div className="font-semibold mb-2">
                    Pay &#x20b9;{advance} via:
                  </div>
                  <div className="space-y-1">
                    {settings.showUpiDetails !== false && (
                      <div>
                        <span className="text-gray-500">UPI ID:</span>{" "}
                        <span className="font-mono font-bold text-[#b38b00]">
                          {settings.upiId}
                        </span>
                      </div>
                    )}
                    {settings.showBankDetails !== false && (
                      <>
                        <div>
                          <span className="text-gray-500">Bank:</span>{" "}
                          {settings.bankName}
                        </div>
                        <div>
                          <span className="text-gray-500">A/C:</span>{" "}
                          {settings.accountNumber}
                        </div>
                        <div>
                          <span className="text-gray-500">IFSC:</span>{" "}
                          {settings.ifsc}
                        </div>
                      </>
                    )}
                  </div>
                  {settings.qrCodeImage && (
                    <div className="mt-4 text-center">
                      <p className="text-xs text-gray-500 mb-2 font-medium">
                        Scan QR to Pay
                      </p>
                      <img
                        src={settings.qrCodeImage}
                        alt="Payment QR Code"
                        className="mx-auto rounded-lg border border-[#FED100]/40"
                        style={{ maxWidth: 200 }}
                      />
                    </div>
                  )}
                </div>
              )}
              <p className="text-xs text-gray-500 text-center mb-4">
                &#x1F6E1;&#xFE0F; 100% Refund within 24 hours if delivery is not
                feasible in your area
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex-1 border border-[#D6D6D6] py-3 rounded-lg font-medium hover:bg-gray-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={placeOrder}
                  className="flex-1 bg-[#FED100] text-[#212121] py-3 rounded-lg font-bold hover:bg-[#e6bc00]"
                >
                  Place Order
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
