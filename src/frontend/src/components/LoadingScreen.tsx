import { useEffect, useState } from "react";

interface LoadingScreenProps {
  onDone: () => void;
  logoImage?: string;
  storeName?: string;
}

export default function LoadingScreen({
  onDone,
  logoImage,
  storeName,
}: LoadingScreenProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDone, 400);
    }, 2500);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white overflow-hidden"
      style={{
        transition: "opacity 0.4s ease",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "all" : "none",
      }}
    >
      {/* Center content */}
      <div
        className="flex flex-col items-center justify-center flex-1"
        style={{
          animation: "tdg-fadein 0.6s ease forwards",
        }}
      >
        {/* Logo */}
        <div className="mb-6 relative">
          {logoImage ? (
            <img
              src={logoImage}
              alt="Store Logo"
              className="w-24 h-24 object-contain rounded-2xl shadow-lg"
              style={{
                animation:
                  "tdg-scale-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
              }}
            />
          ) : (
            <div
              className="w-24 h-24 rounded-2xl flex items-center justify-center shadow-lg"
              style={{
                background: "#FED100",
                animation:
                  "tdg-scale-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
              }}
            >
              <span className="font-bold text-3xl text-[#212121]">TDG</span>
            </div>
          )}
        </div>

        {/* Gift + Frame icons */}
        <div
          className="flex items-center gap-3 mb-4"
          style={{ animation: "tdg-fadein 0.6s 0.3s ease both" }}
        >
          <span className="text-4xl" role="img" aria-label="gift">
            🎁
          </span>
          <span className="text-3xl text-[#D6D6D6]">✦</span>
          <span className="text-4xl" role="img" aria-label="frame">
            🖼️
          </span>
        </div>

        {/* Tagline */}
        <p
          className="font-semibold text-[#212121] text-lg tracking-wide text-center px-4"
          style={{ animation: "tdg-fadein 0.6s 0.5s ease both" }}
        >
          {storeName || "The Digital Gallery by Emon"}
        </p>
        <p
          className="text-[#b38b00] text-sm mt-1 tracking-widest uppercase"
          style={{ animation: "tdg-fadein 0.6s 0.7s ease both" }}
        >
          Premium Photo Frames
        </p>
      </div>

      {/* Animated waves at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-40 overflow-hidden">
        <svg
          viewBox="0 0 1440 160"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="absolute bottom-0 w-full"
          style={{ height: "160px" }}
          aria-hidden="true"
          role="presentation"
        >
          {/* Wave 3 - back */}
          <path
            d="M0,80 C360,140 720,20 1080,80 C1260,110 1380,60 1440,80 L1440,160 L0,160 Z"
            fill="#FFEE32"
            opacity="0.4"
            style={{ animation: "tdg-wave 4s ease-in-out infinite alternate" }}
          />
          {/* Wave 2 - mid */}
          <path
            d="M0,100 C240,60 480,140 720,100 C960,60 1200,140 1440,100 L1440,160 L0,160 Z"
            fill="#FED100"
            opacity="0.6"
            style={{
              animation: "tdg-wave 3s ease-in-out infinite alternate-reverse",
            }}
          />
          {/* Wave 1 - front */}
          <path
            d="M0,120 C180,90 360,150 540,120 C720,90 900,150 1080,120 C1260,90 1380,140 1440,120 L1440,160 L0,160 Z"
            fill="#FED100"
            style={{
              animation: "tdg-wave 2.5s ease-in-out infinite alternate",
            }}
          />
        </svg>
      </div>

      <style>{`
        @keyframes tdg-fadein {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes tdg-scale-in {
          from { opacity: 0; transform: scale(0.7); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes tdg-wave {
          from { transform: translateX(-15px); }
          to { transform: translateX(15px); }
        }
      `}</style>
    </div>
  );
}
