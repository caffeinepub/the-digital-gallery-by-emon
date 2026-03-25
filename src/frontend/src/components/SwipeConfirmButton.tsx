import { useEffect, useRef, useState } from "react";
import { playSuccess } from "../lib/sounds";

interface SwipeConfirmButtonProps {
  onConfirm: () => void;
  disabled?: boolean;
  label?: string;
}

export default function SwipeConfirmButton({
  onConfirm,
  disabled,
  label,
}: SwipeConfirmButtonProps) {
  const [thumbX, setThumbX] = useState(0);
  const [confirmed, setConfirmed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef(0);
  const currentXRef = useRef(0);
  const confirmedRef = useRef(false);
  const rafRef = useRef<number>(0);

  const THUMB_W = 60;

  useEffect(() => {
    if (disabled) {
      confirmedRef.current = false;
      setConfirmed(false);
      setThumbX(0);
    }
  }, [disabled]);

  function getMaxSlide() {
    const trackW = trackRef.current?.offsetWidth ?? 300;
    return Math.max(0, trackW - THUMB_W - 8);
  }

  function handlePointerDown(e: React.PointerEvent) {
    if (disabled || confirmedRef.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    e.preventDefault();
    const maxSlide = getMaxSlide();
    startXRef.current = e.clientX - thumbX * maxSlide;
    setDragging(true);
  }

  function handlePointerMove(e: React.PointerEvent) {
    if (!dragging || confirmedRef.current) return;
    e.preventDefault();
    const raw = e.clientX;
    currentXRef.current = raw;
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const maxSlide = getMaxSlide();
      const delta = currentXRef.current - startXRef.current;
      const pct = Math.max(0, Math.min(1, delta / maxSlide));
      setThumbX(pct);
      if (pct >= 0.92 && !confirmedRef.current) {
        confirmedRef.current = true;
        setConfirmed(true);
        setThumbX(1);
        setDragging(false);
        playSuccess();
        navigator.vibrate?.([100, 50, 100]);
        setTimeout(onConfirm, 600);
      }
    });
  }

  function handlePointerUp() {
    if (confirmedRef.current) return;
    cancelAnimationFrame(rafRef.current);
    setDragging(false);
    setThumbX(0);
  }

  const maxSlide = trackRef.current ? getMaxSlide() : 240;
  const thumbPx = thumbX * maxSlide + 4;
  const fillPct = thumbX * 100;

  return (
    <div
      ref={trackRef}
      className={`relative h-16 rounded-2xl overflow-hidden select-none ${
        disabled
          ? "opacity-60 cursor-not-allowed"
          : "cursor-grab active:cursor-grabbing"
      }`}
      style={{ background: "#e8e8e8" }}
      data-ocid="checkout.swipe_confirm.button"
    >
      {/* Fill */}
      <div
        className="absolute inset-y-0 left-0 rounded-2xl"
        style={{
          width: `${fillPct}%`,
          backgroundColor: confirmed ? "#22c55e" : "#FED100",
          transition: dragging
            ? "none"
            : "width 0.35s ease, background-color 0.3s",
        }}
      />

      {/* Label — padded so it never overlaps the thumb */}
      <div
        className="absolute inset-0 flex items-center pointer-events-none"
        style={{ paddingLeft: THUMB_W + 16 }}
      >
        <span
          className="text-sm font-bold text-[#555] transition-opacity duration-200"
          style={{ opacity: confirmed ? 0 : Math.max(0, 1 - fillPct / 60) }}
        >
          {label || "Swipe to Confirm Order →"}
        </span>
        {confirmed && (
          <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white">
            ✓ Order Confirmed!
          </span>
        )}
      </div>

      {/* Thumb */}
      {!confirmed && (
        <div
          className="absolute top-2 bottom-2 rounded-xl bg-[#212121] flex items-center justify-center shadow-lg touch-none"
          style={{
            width: THUMB_W,
            left: thumbPx,
            transition: dragging
              ? "none"
              : "left 0.35s cubic-bezier(0.25, 1, 0.5, 1)",
            cursor: disabled ? "not-allowed" : "grab",
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="w-6 h-6 text-[#FED100]"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </div>
      )}
    </div>
  );
}
