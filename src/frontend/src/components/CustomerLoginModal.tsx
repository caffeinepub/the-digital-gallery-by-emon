import { X } from "lucide-react";
import { useState } from "react";
import { useData } from "../lib/DataContext";

interface CustomerLoginModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CustomerLoginModal({
  open,
  onClose,
}: CustomerLoginModalProps) {
  const { setCustomerSession } = useData();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  function handleLogin() {
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    setCustomerSession({ name: name.trim(), phone });
    setName("");
    setPhone("");
    setError("");
    onClose();
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      data-ocid="customer_login.modal"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-bold text-lg text-[#212121] font-playfair">
            Login to Your Account
          </h2>
          <button
            type="button"
            onClick={onClose}
            data-ocid="customer_login.close_button"
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="login-name"
              className="text-xs text-gray-500 block mb-1"
            >
              Your Name *
            </label>
            <input
              id="login-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priya Sharma"
              data-ocid="customer_login.input"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#FED100]"
            />
          </div>
          <div>
            <label
              htmlFor="login-phone"
              className="text-xs text-gray-500 block mb-1"
            >
              Mobile Number *
            </label>
            <input
              id="login-phone"
              type="tel"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              placeholder="10-digit mobile number"
              data-ocid="customer_login.input"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#FED100]"
            />
          </div>
          {error && <p className="text-red-500 text-xs">{error}</p>}
          <button
            type="button"
            onClick={handleLogin}
            data-ocid="customer_login.submit_button"
            className="w-full bg-[#FED100] text-[#212121] font-bold py-3 rounded-lg hover:bg-[#e6bc00] transition-colors"
          >
            Login
          </button>
          <p className="text-xs text-gray-400 text-center">
            No password needed — just your name &amp; phone to view your orders.
          </p>
        </div>
      </div>
    </div>
  );
}
