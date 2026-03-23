import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, ShoppingCart, X } from "lucide-react";
import { useState } from "react";
import { useData } from "../lib/DataContext";

interface NavbarProps {
  cartCount?: number;
}

export default function Navbar({ cartCount = 0 }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { settings } = useData();
  const navigate = useNavigate();
  const isDark = settings.theme === "dark";

  const navBg = isDark ? "bg-[#212121]" : "bg-[#212121]";
  const announceBg = isDark ? "bg-[#FED100]" : "bg-[#FED100]";

  return (
    <header className="sticky top-0 z-50">
      {settings.announcementBarEnabled && settings.announcementBar && (
        <div
          className={`${announceBg} text-[#212121] text-xs text-center py-2 px-4 font-medium`}
        >
          {settings.announcementBar}
        </div>
      )}

      <nav className={`${navBg} text-white`}>
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
              <span className="text-gray-400 text-xs font-normal">by Emon</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-6 text-sm">
            <Link to="/" className="hover:text-[#FED100] transition-colors">
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
                  .getElementById("products")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Collages
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
            >
              Track Order
            </Link>
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
            <button type="button" onClick={() => {}} className="relative p-1">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#FED100] text-[#212121] text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </button>
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
                  .getElementById("products")
                  ?.scrollIntoView({ behavior: "smooth" });
                setMenuOpen(false);
              }}
            >
              Collages
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
            >
              Track Order
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
