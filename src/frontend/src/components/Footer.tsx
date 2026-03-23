import { Link } from "@tanstack/react-router";
import { getSettings } from "../lib/data";

export default function Footer() {
  const settings = getSettings();
  return (
    <footer className="bg-[#212121] text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-10 h-10 bg-[#FED100] rounded flex items-center justify-center font-bold text-lg text-[#212121]">
                TDG
              </div>
              <span className="font-playfair text-lg font-semibold">
                {settings.storeName}
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Premium custom canvas prints &amp; collages, delivered with love.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <a
                  href="#products"
                  className="hover:text-white transition-colors"
                >
                  Shop
                </a>
              </li>
              <li>
                <Link
                  to="/track"
                  className="hover:text-white transition-colors"
                >
                  Track Order
                </Link>
              </li>
              <li>
                <a
                  href="#how-it-works"
                  className="hover:text-white transition-colors"
                >
                  How It Works
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">
              Help &amp; Support
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>WhatsApp: +91 {settings.whatsapp}</li>
              <li>100% Refund Policy</li>
              <li>3-4 Days Delivery</li>
              <li>Pickup Available</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">
              Pickup Cities
            </h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {(
                settings.pickupCities || [
                  "Basugaon",
                  "Kokrajhar",
                  "Bongaigaon",
                  "Barpeta Road",
                ]
              ).map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-[#333] mt-8 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} {settings.storeName}. All rights
            reserved.
          </p>
          <p className="text-gray-500 text-xs">
            100% Refund within 24 hours if delivery is not feasible in your
            area.
          </p>
        </div>
      </div>
    </footer>
  );
}
