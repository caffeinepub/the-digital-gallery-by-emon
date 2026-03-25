import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";

interface ImageLightboxProps {
  open: boolean;
  src: string;
  name: string;
  onClose: () => void;
}

export function ImageLightbox({
  open,
  src,
  name,
  onClose,
}: ImageLightboxProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 flex items-center justify-center p-4"
          style={{ zIndex: 99999, background: "rgba(0,0,0,0.92)" }}
          onClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full w-10 h-10 flex items-center justify-center transition-colors"
            style={{ zIndex: 100000 }}
          >
            <X size={20} />
          </button>
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="flex flex-col items-center gap-3 max-w-[90vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={src}
              alt={name}
              className="rounded-2xl shadow-2xl object-contain"
              style={{ maxWidth: "90vw", maxHeight: "80vh" }}
            />
            <span className="text-white font-semibold text-base tracking-wide drop-shadow">
              {name}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
