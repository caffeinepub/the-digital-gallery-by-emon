import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useData } from "../lib/DataContext";
import { playClick, playSuccess } from "../lib/sounds";

interface CustomerLoginModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CustomerLoginModal({
  open,
  onClose,
}: CustomerLoginModalProps) {
  const { setCustomerSession } = useData();

  // Step 1 state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  // Step 2 state
  const [step, setStep] = useState<1 | 2>(1);
  const [captchaQuestion, setCaptchaQuestion] = useState<{
    q: string;
    a: number;
  } | null>(null);
  const [captchaInput, setCaptchaInput] = useState("");
  const [captchaError, setCaptchaError] = useState("");

  // Reset when modal opens/closes
  useEffect(() => {
    if (!open) {
      setStep(1);
      setName("");
      setPhone("");
      setError("");
      setCaptchaQuestion(null);
      setCaptchaInput("");
      setCaptchaError("");
    }
  }, [open]);

  function generateCaptcha() {
    const a = Math.floor(Math.random() * 12) + 1;
    const b = Math.floor(Math.random() * 12) + 1;
    const isAdd = Math.random() > 0.4;
    if (isAdd) return { q: `What is ${a} + ${b}?`, a: a + b };
    const big = Math.max(a, b);
    const small = Math.min(a, b);
    return { q: `What is ${big} - ${small}?`, a: big - small };
  }

  function proceedToStep2() {
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!/^[6-9]\d{9}$/.test(phone)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    setError("");
    setCaptchaQuestion(generateCaptcha());
    setCaptchaInput("");
    setCaptchaError("");
    setStep(2);
    playClick();
  }

  function verifyCaptcha() {
    if (!captchaQuestion) return;
    const val = Number.parseInt(captchaInput.trim(), 10);
    if (Number.isNaN(val) || val !== captchaQuestion.a) {
      setCaptchaError("Incorrect answer, please try again.");
      setCaptchaInput("");
      setCaptchaQuestion(generateCaptcha());
      return;
    }
    playSuccess();
    setCustomerSession({ name: name.trim(), phone });
    onClose();
  }

  if (!open) return null;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
      data-ocid="customer_login.modal"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-bold text-lg text-[#212121] font-playfair">
              {step === 1 ? "Login to Your Account" : "Quick Verification"}
            </h2>
            {step === 2 && (
              <p className="text-xs text-gray-500 mt-0.5">
                OTP sent to +91{phone}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={() => {
              playClick();
              onClose();
            }}
            data-ocid="customer_login.close_button"
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Step 1: Name + Phone */}
        {step === 1 && (
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
                onKeyDown={(e) => e.key === "Enter" && proceedToStep2()}
                placeholder="e.g. Priya Sharma"
                data-ocid="customer_login.name.input"
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
                onKeyDown={(e) => e.key === "Enter" && proceedToStep2()}
                placeholder="10-digit mobile number"
                data-ocid="customer_login.phone.input"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#FED100]"
              />
            </div>
            {error && (
              <p
                className="text-red-500 text-xs"
                data-ocid="customer_login.error_state"
              >
                {error}
              </p>
            )}
            <button
              type="button"
              onClick={proceedToStep2}
              data-ocid="customer_login.continue.button"
              className="w-full bg-[#FED100] text-[#212121] font-bold py-3 rounded-lg hover:bg-[#e6bc00] transition-colors"
            >
              Continue
            </button>
            <p className="text-xs text-gray-400 text-center">
              Enter your details to access your orders.
            </p>
          </div>
        )}

        {/* Step 2: CAPTCHA verification */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="bg-[#FED100]/10 border border-[#FED100]/40 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">
                Solve this to continue
              </p>
              <p className="text-2xl font-bold text-[#212121]">
                {captchaQuestion?.q}
              </p>
            </div>

            <div>
              <label
                htmlFor="captcha-input"
                className="text-xs text-gray-500 block mb-1"
              >
                Your Answer
              </label>
              <input
                id="captcha-input"
                type="number"
                value={captchaInput}
                onChange={(e) => {
                  setCaptchaInput(e.target.value);
                  setCaptchaError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && verifyCaptcha()}
                placeholder="Type the answer"
                data-ocid="customer_login.captcha.input"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#FED100] focus:ring-2 focus:ring-[#FED100]/20 text-center text-xl font-bold"
              />
            </div>

            {captchaError && (
              <p
                className="text-red-500 text-xs text-center"
                data-ocid="customer_login.captcha.error_state"
              >
                {captchaError}
              </p>
            )}

            <button
              type="button"
              onClick={() => {
                playClick();
                verifyCaptcha();
              }}
              data-ocid="customer_login.verify_captcha.button"
              className="w-full bg-[#FED100] text-[#212121] font-bold py-3 rounded-lg hover:bg-[#e6bc00] transition-colors"
            >
              Verify &amp; Login
            </button>

            <button
              type="button"
              onClick={() => {
                playClick();
                setStep(1);
                setCaptchaInput("");
                setCaptchaError("");
              }}
              className="w-full text-xs text-gray-400 hover:text-gray-600 py-1"
              data-ocid="customer_login.back.button"
            >
              &larr; Change phone number
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
