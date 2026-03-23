import { Link, useNavigate } from "@tanstack/react-router";
import {
  LogIn,
  LogOut,
  Menu,
  Package,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";
import { useState } from "react";
import { useData } from "../lib/DataContext";
import CustomerLoginModal from "./CustomerLoginModal";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const { settings, cart, customerSession, setCustomerSession } = useData();
  const navigate = useNavigate();
  const isDark = settings.theme === "dark";

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <header className="sticky top-0 z-50">
        {settings.announcementBarEnabled && settings.announcementBar && (
          <div className="bg-[#FED100] text-[#212121] text-xs text-center py-2 px-4 font-medium">
            {settings.announcementBar}
          </div>
        )}

        <nav
          className={`${isDark ? "bg-[#212121]" : "bg-[#212121]"} text-white`}
        >
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              {settings.logoImage ? (
                <img
                  src={settings.logoImage}
                  alt="logo"
                  className="h-10 max-w-[120px] object-contain"
                />
              ) : (
                <div className="w-10 h-10 bg-[#FED100] rounded flex items-center justify-center font-bold text-lg font-playfair text-[#212121]">
                  {settings.logoText}
                </div>
              )}
              <span className="font-playfair text-lg font-semibold hidden sm:block leading-tight">
                The Digital Gallery
                <br />
                <span className="text-gray-400 text-xs font-normal">
                  by Emon
                </span>
              </span>
            </Link>

            <div className="hidden lg:flex items-center gap-6 text-sm">
              <Link
                to="/"
                className="hover:text-[#FED100] transition-colors"
                data-ocid="nav.link"
              >
                Home
              </Link>
              <button
                type="button"
                className="hover:text-[#FED100] transition-colors"
                onClick={() =>
                  document
                    .getElementById("products")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Canvas Prints
              </button>
              <button
                type="button"
                className="hover:text-[#FED100] transition-colors"
                onClick={() =>
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                How It Works
              </button>
              <Link
                to="/track"
                className="hover:text-[#FED100] transition-colors"
                data-ocid="nav.track.link"
              >
                Track Order
              </Link>
              {customerSession && (
                <Link
                  to="/my-orders"
                  className="hover:text-[#FED100] transition-colors flex items-center gap-1"
                  data-ocid="nav.my_orders.link"
                >
                  <Package size={14} /> My Orders
                </Link>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate({ to: "/track" })}
                className="hidden sm:flex items-center gap-1 text-xs text-gray-400 hover:text-[#FED100] transition-colors"
              >
                <Search size={16} />
                <span>Track</span>
              </button>

              {/* Cart icon */}
              <button
                type="button"
                onClick={() => navigate({ to: "/cart" })}
                className="relative p-1 hover:text-[#FED100] transition-colors"
                data-ocid="nav.cart.button"
              >
                <ShoppingCart size={20} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FED100] text-[#212121] text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Login/Logout */}
              {customerSession ? (
                <button
                  type="button"
                  onClick={() => setCustomerSession(null)}
                  className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#FED100] transition-colors"
                  data-ocid="nav.logout.button"
                >
                  <LogOut size={14} />
                  <span className="hidden md:inline">
                    {customerSession.name.split(" ")[0]}
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setLoginOpen(true)}
                  className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400 hover:text-[#FED100] transition-colors"
                  data-ocid="nav.login.button"
                >
                  <LogIn size={14} />
                  <span>Login</span>
                </button>
              )}

              <button
                type="button"
                className="lg:hidden p-1"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {menuOpen && (
            <div className="lg:hidden bg-[#1a1a1a] border-t border-[#333] px-4 py-3 space-y-3 text-sm">
              <Link
                to="/"
                className="block hover:text-[#FED100]"
                onClick={() => setMenuOpen(false)}
                data-ocid="mobile_nav.home.link"
              >
                Home
              </Link>
              <button
                type="button"
                className="block hover:text-[#FED100] text-left w-full"
                onClick={() => {
                  document
                    .getElementById("products")
                    ?.scrollIntoView({ behavior: "smooth" });
                  setMenuOpen(false);
                }}
              >
                Canvas Prints
              </button>
              <button
                type="button"
                className="block hover:text-[#FED100] text-left w-full"
                onClick={() => {
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" });
                  setMenuOpen(false);
                }}
              >
                How It Works
              </button>
              <Link
                to="/track"
                className="block hover:text-[#FED100]"
                onClick={() => setMenuOpen(false)}
                data-ocid="mobile_nav.track.link"
              >
                Track Order
              </Link>
              {customerSession && (
                <Link
                  to="/my-orders"
                  className="block hover:text-[#FED100] flex items-center gap-1"
                  onClick={() => setMenuOpen(false)}
                  data-ocid="mobile_nav.my_orders.link"
                >
                  <Package size={14} /> My Orders
                </Link>
              )}
              <button
                type="button"
                onClick={() => {
                  navigate({ to: "/cart" });
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 hover:text-[#FED100] w-full"
                data-ocid="mobile_nav.cart.button"
              >
                <ShoppingCart size={14} /> Cart{" "}
                {cartCount > 0 && `(${cartCount})`}
              </button>
              {customerSession ? (
                <button
                  type="button"
                  onClick={() => {
                    setCustomerSession(null);
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 hover:text-[#FED100] w-full"
                  data-ocid="mobile_nav.logout.button"
                >
                  <LogOut size={14} /> Logout (
                  {customerSession.name.split(" ")[0]})
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setLoginOpen(true);
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-2 hover:text-[#FED100] w-full"
                  data-ocid="mobile_nav.login.button"
                >
                  <LogIn size={14} /> Login
                </button>
              )}
            </div>
          )}
        </nav>
      </header>
      <CustomerLoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
      />
    </>
  );
}
