import { Tag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getSettings } from "../lib/data";

export default function EntrancePopup() {
  const [visible, setVisible] = useState(false);
  const settings = getSettings();

  useEffect(() => {
    if (!settings.popupEnabled) return;
    const seen = sessionStorage.getItem("tdg_popup_seen");
    if (seen) return;
    const timer = setTimeout(() => {
      setVisible(true);
      sessionStorage.setItem("tdg_popup_seen", "1");
    }, 2000);
    return () => clearTimeout(timer);
  }, [settings.popupEnabled]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-[#212121] text-white text-center py-6 px-8 relative">
          <button
            type="button"
            onClick={() => setVisible(false)}
            className="absolute top-3 right-3 text-white/60 hover:text-white"
          >
            <X size={20} />
          </button>
          <Tag size={32} className="mx-auto mb-3 text-[#FED100]" />
          <p className="text-xs uppercase tracking-widest text-gray-400 mb-1">
            Special Offer
          </p>
          <h2 className="font-playfair text-3xl font-bold mb-2">
            {settings.popupText}
          </h2>
          <p className="text-gray-300 text-sm">{settings.popupSubtext}</p>
        </div>
        <div className="p-6 text-center">
          <p className="text-sm text-gray-600 mb-3">Use code at checkout:</p>
          <div className="inline-block bg-[#FFEE32]/30 border-2 border-dashed border-[#FED100] rounded-lg px-6 py-3">
            <span className="font-mono font-bold text-xl text-[#b38b00] tracking-widest">
              {settings.popupCode}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setVisible(false)}
            className="mt-5 w-full bg-[#FED100] hover:bg-[#e6bc00] text-[#212121] font-semibold py-3 rounded-lg transition-colors"
          >
            Shop Now
          </button>
          <button
            type="button"
            onClick={() => setVisible(false)}
            className="mt-2 text-xs text-gray-400 hover:text-gray-600"
          >
            No thanks, I'll pay full price
          </button>
        </div>
      </div>
    </div>
  );
}
