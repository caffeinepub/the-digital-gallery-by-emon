import { useNavigate, useParams } from "@tanstack/react-router";
import {
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingCart,
  Star,
  X,
  ZoomIn,
} from "lucide-react";
import React from "react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import CustomFrameModal from "../components/CustomFrameModal";
import Footer from "../components/Footer";
import { ImageLightbox } from "../components/ImageLightbox";
import Navbar from "../components/Navbar";
import { useData } from "../lib/DataContext";
import { playClick, playError } from "../lib/sounds";

function isBlackWhiteSelected(name: string): boolean {
  return /black|white/i.test(name);
}

export default function ProductDetailPage() {
  const { productId } = useParams({ from: "/product/$productId" });
  const { products, cart, setCart, reviews, settings } = useData();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === productId);

  const [imgIdx, setImgIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [customFrameOpen, setCustomFrameOpen] = useState(false);
  const [lightboxSrc, setLightboxSrc] = React.useState<string | null>(null);
  const [lightboxName, setLightboxName] = React.useState("");
  const [frameCustomMaterial, setFrameCustomMaterial] = useState("");
  const [frameCustomDesign, setFrameCustomDesign] = useState("");
  const [frameCustomStyle, setFrameCustomStyle] = useState("");
  const [frameCustomColour, setFrameCustomColour] = useState("");
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);
  const [frameErrors, setFrameErrors] = useState<{
    material?: string;
    design?: string;
    style?: string;
    colour?: string;
  }>({});
  const [stickyBarVisible, setStickyBarVisible] = useState(false);
  const addToCartRef = useRef<HTMLButtonElement>(null);

  const woodOpts = settings.frameWoodOptions || [];
  const designOpts = settings.frameDesignOptions || [];
  const styleOpts = settings.frameStyleOptions || [];
  const colourOpts = settings.frameColourOptions || [];

  const isBW = isBlackWhiteSelected(frameCustomColour);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional - only run when isBW changes
  useEffect(() => {
    if (!isBW) return;
    const selDesign = designOpts.find((o) => o.name === frameCustomDesign);
    if (selDesign?.blackWhiteIncompatible) setFrameCustomDesign("");
    const selStyle = styleOpts.find((o) => o.name === frameCustomStyle);
    if (selStyle?.blackWhiteIncompatible) setFrameCustomStyle("");
  }, [isBW]);

  // Sticky bar via IntersectionObserver
  useEffect(() => {
    if (!addToCartRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setStickyBarVisible(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(addToCartRef.current);
    return () => observer.disconnect();
  }, []);

  const frameAddon =
    (woodOpts.find((o) => o.name === frameCustomMaterial)?.addonPrice ?? 0) +
    (designOpts.find((o) => o.name === frameCustomDesign)?.addonPrice ?? 0) +
    (styleOpts.find((o) => o.name === frameCustomStyle)?.addonPrice ?? 0) +
    (colourOpts.find((o) => o.name === frameCustomColour)?.addonPrice ?? 0);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#f5f5f5]">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <p className="text-gray-500">Product not found.</p>
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="mt-4 text-[#b38b00] hover:underline"
          >
            Back to Home
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const images =
    product.images && product.images.length > 0
      ? product.images
      : product.image
        ? [product.image]
        : [];
  const save = product.mrp - product.price;
  const activeReviews = reviews.filter((r) => r.active);
  const isDark = settings.theme === "dark";

  function addToCart() {
    if (!product) return;
    const hasAnyFrameOpts =
      woodOpts.length > 0 ||
      designOpts.length > 0 ||
      styleOpts.length > 0 ||
      colourOpts.length > 0;
    if (hasAnyFrameOpts) {
      const errors: {
        material?: string;
        design?: string;
        style?: string;
        colour?: string;
      } = {};
      if (woodOpts.length > 0 && !frameCustomMaterial)
        errors.material = "Please select a wood colour.";
      if (designOpts.length > 0 && !frameCustomDesign)
        errors.design = "Please select a frame design.";
      if (styleOpts.length > 0 && !frameCustomStyle)
        errors.style = "Please select a frame style.";
      if (colourOpts.length > 0 && !frameCustomColour)
        errors.colour = "Please select a frame colour.";
      if (Object.keys(errors).length > 0) {
        setFrameErrors(errors);
        playError();
        document
          .getElementById("frame-selection-section")
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
    }
    setFrameErrors({});
    const existing = cart.find((c) => c.productId === product.id);
    const displayImage = images[0];
    const finalPrice = product.price + frameAddon;
    const frameNote =
      frameCustomMaterial ||
      frameCustomDesign ||
      frameCustomStyle ||
      frameCustomColour
        ? ` [${[frameCustomMaterial, frameCustomDesign, frameCustomStyle, frameCustomColour].filter(Boolean).join(", ")}]`
        : "";
    if (existing) {
      setCart(
        cart.map((c) =>
          c.productId === product.id ? { ...c, quantity: c.quantity + qty } : c,
        ),
      );
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          productName: product.name + frameNote,
          size: product.size,
          price: finalPrice,
          mrp: product.mrp,
          quantity: qty,
          image: displayImage,
          frameColour: frameCustomColour,
        },
      ]);
    }
    toast.success(`${product.name} (x${qty}) added to cart!`);
    navigate({ to: "/cart" });
  }

  return (
    <div
      className={`min-h-screen ${
        isDark ? "bg-[#1a1a1a]" : "bg-[#f5f5f5]"
      } font-inter`}
    >
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="hover:text-[#b38b00]"
          >
            Home
          </button>
          <span>/</span>
          <span className="text-[#212121] font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Image slideshow */}
          <div>
            <div className="relative bg-white rounded-2xl border border-[#D6D6D6] overflow-hidden aspect-square">
              {images.length > 0 ? (
                <img
                  src={images[imgIdx]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-yellow-100">
                  <div className="text-center">
                    <div className="font-playfair text-4xl font-bold text-[#333533]">
                      {product.size}
                    </div>
                    <div className="text-gray-500 mt-2">Photo Frame</div>
                  </div>
                </div>
              )}
              {images.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    setZoomOpen(true);
                  }}
                  className="absolute top-3 right-3 bg-white/80 hover:bg-white rounded-lg p-2 shadow transition-colors"
                  data-ocid="product_detail.zoom.button"
                >
                  <ZoomIn size={18} className="text-[#212121]" />
                </button>
              )}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      setImgIdx((i) => Math.max(0, i - 1));
                    }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playClick();
                      setImgIdx((i) => Math.min(images.length - 1, i + 1));
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 mt-3">
                {images.map((img, i) => (
                  <button
                    key={`thumb-${img.slice(-20)}-${i}`}
                    type="button"
                    onClick={() => {
                      playClick();
                      setImgIdx(i);
                    }}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                      i === imgIdx ? "border-[#FED100]" : "border-transparent"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`View ${i + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info */}
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#b38b00] bg-[#FED100]/20 px-3 py-1 rounded-full">
              {product.category}
            </span>
            <h1 className="font-playfair text-2xl md:text-3xl font-bold text-[#212121] mt-3 mb-1">
              {product.name}
            </h1>
            <p className="text-gray-500 text-sm mb-4">{product.description}</p>

            <div className="flex items-center gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  size={16}
                  className={
                    n <= 4
                      ? "fill-[#FED100] text-[#FED100]"
                      : "fill-gray-200 text-gray-200"
                  }
                />
              ))}
              <span className="text-sm text-gray-500 ml-1">
                4.5 ({activeReviews.length || 12} reviews)
              </span>
            </div>

            {/* Product Highlights */}
            {product.highlights && product.highlights.length > 0 && (
              <div className="mb-4 bg-green-50/60 border border-green-100 rounded-xl px-4 py-3">
                <div className="text-xs font-semibold text-green-800 mb-2 uppercase tracking-wide">
                  Why You'll Love It
                </div>
                <ul className="space-y-1">
                  {product.highlights.map((h) => (
                    <li
                      key={h}
                      className="flex items-start gap-2 text-sm text-gray-700"
                    >
                      <CheckCircle
                        size={14}
                        className="text-green-500 mt-0.5 flex-shrink-0"
                      />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-white rounded-xl border border-[#D6D6D6] p-4 mb-4">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-[#212121]">
                  &#x20b9;{product.price + frameAddon}
                </span>
                <span className="text-lg text-gray-400 line-through">
                  &#x20b9;{product.mrp}
                </span>
              </div>
              {frameAddon > 0 && (
                <p className="text-xs text-[#b38b00] mt-1">
                  Includes &#x20b9;{frameAddon} frame customization add-on
                </p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className="bg-[#FFEE32] text-[#7a6600] text-sm px-3 py-0.5 rounded-full font-bold">
                  Save &#x20b9;{save} ({Math.round((save / product.mrp) * 100)}%
                  OFF)
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                Inclusive of all taxes
              </p>
            </div>

            {/* Wood Colour — Flipkart/Meesho style horizontal chips */}
            {woodOpts.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-semibold text-[#212121]">
                    Wood Colour:
                  </span>
                  <span className="text-sm text-[#b38b00] font-medium">
                    {frameCustomMaterial || (
                      <span className="text-gray-400 font-normal">
                        Select one
                      </span>
                    )}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {woodOpts.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        playClick();
                        setFrameCustomMaterial(
                          frameCustomMaterial === opt.name ? "" : opt.name,
                        );
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 text-sm font-medium transition-all ${
                        frameCustomMaterial === opt.name
                          ? "border-[#FED100] bg-[#FED100]/10 text-[#212121] shadow-sm"
                          : "border-gray-300 text-gray-600 hover:border-[#FED100]/60"
                      }`}
                    >
                      {opt.image && (
                        <img
                          src={opt.image}
                          alt={opt.name}
                          className="w-5 h-5 rounded-full object-cover border border-gray-200"
                        />
                      )}
                      {opt.name}
                      {(opt.addonPrice ?? 0) > 0 && (
                        <span className="text-[10px] text-[#b38b00]">
                          +₹{opt.addonPrice}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
                {frameErrors.material && (
                  <p
                    className="text-red-500 text-xs mt-1"
                    data-ocid="product_detail.frame_material.error_state"
                  >
                    {frameErrors.material}
                  </p>
                )}
              </div>
            )}

            <div className="mb-4">
              <div className="text-sm font-medium text-[#212121] mb-2">
                Quantity:
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    setQty((q) => Math.max(1, q - 1));
                  }}
                  className="w-10 h-10 rounded-lg border border-[#D6D6D6] flex items-center justify-center hover:border-[#FED100] transition-colors"
                  data-ocid="product_detail.qty_decrease.button"
                >
                  <Minus size={16} />
                </button>
                <span className="text-lg font-bold w-8 text-center">{qty}</span>
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    setQty((q) => Math.min(10, q + 1));
                  }}
                  className="w-10 h-10 rounded-lg border border-[#D6D6D6] flex items-center justify-center hover:border-[#FED100] transition-colors"
                  data-ocid="product_detail.qty_increase.button"
                >
                  <Plus size={16} />
                </button>
                <span className="text-sm text-gray-400">Max 10</span>
              </div>
            </div>

            {/* Mandatory Frame Customization */}
            {(designOpts.length > 0 ||
              styleOpts.length > 0 ||
              colourOpts.length > 0) && (
              <div
                id="frame-selection-section"
                className="mb-4 border-2 border-[#FED100] rounded-xl overflow-hidden"
              >
                <div className="w-full flex items-center justify-between px-4 py-3 bg-[#FED100]/10 text-sm font-semibold text-[#212121]">
                  <span>
                    🖼️ Frame Customization{" "}
                    <span className="text-red-500">*</span>
                  </span>
                  <span className="text-xs font-normal text-gray-500">
                    Required before adding to cart
                  </span>
                </div>
                <div className="p-4 space-y-4">
                  {/* Frame Colour Selection */}
                  {colourOpts.length > 0 && (
                    <>
                      <div>
                        <div className="text-xs font-semibold text-gray-600 mb-2">
                          Frame Colour
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {colourOpts.map((opt) => (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => {
                                playClick();
                                setFrameCustomColour(
                                  frameCustomColour === opt.name
                                    ? ""
                                    : opt.name,
                                );
                              }}
                              className={`flex flex-col items-center rounded-xl border-2 overflow-hidden transition-all ${
                                frameCustomColour === opt.name
                                  ? "border-[#FED100] shadow-md scale-[1.03]"
                                  : "border-gray-200 hover:border-[#FED100]/60"
                              }`}
                              style={{ minWidth: 110 }}
                            >
                              {opt.image ? (
                                <div className="relative w-full group/img">
                                  <img
                                    src={opt.image}
                                    alt={opt.name}
                                    className="w-full object-cover"
                                    style={{ height: 110 }}
                                  />
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setLightboxSrc(opt.image ?? null);
                                      setLightboxName(opt.name);
                                    }}
                                    className="absolute bottom-0 inset-x-0 flex items-center justify-center gap-1 bg-black/60 text-white text-xs py-1.5 opacity-0 group-hover/img:opacity-100 transition-opacity"
                                  >
                                    👁 View
                                  </button>
                                </div>
                              ) : (
                                <div
                                  className="w-full bg-gray-100 flex items-center justify-center text-xs text-gray-500"
                                  style={{ height: 110 }}
                                >
                                  Colour
                                </div>
                              )}
                              <span className="text-xs font-medium px-1 py-1 text-center">
                                {opt.name}
                              </span>
                              {(opt.addonPrice ?? 0) > 0 && (
                                <span className="text-[10px] text-[#b38b00] pb-1">
                                  +&#x20b9;{opt.addonPrice}
                                </span>
                              )}
                            </button>
                          ))}
                        </div>
                        {isBW && (
                          <p className="text-xs text-amber-600 mt-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                            ℹ️ Some options may not be available with Black/White
                            colour
                          </p>
                        )}
                      </div>
                      {frameErrors.colour && (
                        <p
                          className="text-red-500 text-xs mt-1"
                          data-ocid="product_detail.frame_colour.error_state"
                        >
                          {frameErrors.colour}
                        </p>
                      )}
                    </>
                  )}

                  {designOpts.length > 0 && (
                    <>
                      <div>
                        <div className="text-xs font-semibold text-gray-600 mb-2">
                          Frame Design
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {designOpts.map((opt) => {
                            const incompatible =
                              isBW && opt.blackWhiteIncompatible;
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                disabled={incompatible}
                                onClick={() => {
                                  if (incompatible) return;
                                  playClick();
                                  setFrameCustomDesign(
                                    frameCustomDesign === opt.name
                                      ? ""
                                      : opt.name,
                                  );
                                }}
                                title={
                                  incompatible
                                    ? "Not available with Black/White colour"
                                    : undefined
                                }
                                className={`flex flex-col items-center rounded-xl border-2 overflow-hidden transition-all ${
                                  incompatible
                                    ? "border-gray-200 opacity-50 cursor-not-allowed"
                                    : frameCustomDesign === opt.name
                                      ? "border-[#FED100] shadow-md scale-[1.03]"
                                      : "border-gray-200 hover:border-[#FED100]/60"
                                }`}
                                style={{ minWidth: 110 }}
                              >
                                {opt.image ? (
                                  <div className="relative w-full group/img">
                                    <img
                                      src={opt.image}
                                      alt={opt.name}
                                      className="w-full object-cover"
                                      style={{ height: 110 }}
                                    />
                                    {incompatible && (
                                      <div className="absolute inset-0 bg-gray-400/50 flex items-center justify-center">
                                        <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                                          Not Available
                                        </span>
                                      </div>
                                    )}
                                    {!incompatible && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setLightboxSrc(opt.image ?? null);
                                          setLightboxName(opt.name);
                                        }}
                                        className="absolute bottom-0 inset-x-0 flex items-center justify-center gap-1 bg-black/60 text-white text-xs py-1.5 opacity-0 group-hover/img:opacity-100 transition-opacity"
                                      >
                                        👁 View
                                      </button>
                                    )}
                                  </div>
                                ) : (
                                  <div
                                    className="w-full bg-gray-100 flex items-center justify-center text-xs text-gray-500 relative"
                                    style={{ height: 110 }}
                                  >
                                    Design
                                    {incompatible && (
                                      <div className="absolute inset-0 bg-gray-400/50 flex items-center justify-center">
                                        <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                                          Not Available
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                )}
                                <span
                                  className={`text-xs font-medium px-1 py-1 text-center ${incompatible ? "text-gray-400" : ""}`}
                                >
                                  {opt.name}
                                </span>
                                {(opt.addonPrice ?? 0) > 0 && !incompatible && (
                                  <span className="text-[10px] text-[#b38b00] pb-1">
                                    +&#x20b9;{opt.addonPrice}
                                  </span>
                                )}
                                {incompatible && (
                                  <span className="text-[9px] text-red-500 pb-1">
                                    ❌ Not with B&W
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      {frameErrors.design && (
                        <p
                          className="text-red-500 text-xs mt-1"
                          data-ocid="product_detail.frame_design.error_state"
                        >
                          {frameErrors.design}
                        </p>
                      )}
                    </>
                  )}
                  {styleOpts.length > 0 && (
                    <>
                      <div>
                        <div className="text-xs font-semibold text-gray-600 mb-2">
                          Frame Style
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                          {styleOpts.map((opt) => {
                            const incompatible =
                              isBW && opt.blackWhiteIncompatible;
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                disabled={incompatible}
                                onClick={() => {
                                  if (incompatible) return;
                                  playClick();
                                  setFrameCustomStyle(
                                    frameCustomStyle === opt.name
                                      ? ""
                                      : opt.name,
                                  );
                                }}
                                title={
                                  incompatible
                                    ? "Not available with Black/White colour"
                                    : undefined
                                }
                                className={`flex flex-col items-center rounded-xl border-2 overflow-hidden transition-all ${
                                  incompatible
                                    ? "border-gray-200 opacity-50 cursor-not-allowed"
                                    : frameCustomStyle === opt.name
                                      ? "border-[#FED100] shadow-md scale-[1.03]"
                                      : "border-gray-200 hover:border-[#FED100]/60"
                                }`}
                                style={{ minWidth: 110 }}
                              >
                                {opt.image ? (
                                  <div className="relative w-full group/img">
                                    <img
                                      src={opt.image}
                                      alt={opt.name}
                                      className="w-full object-cover"
                                      style={{ height: 110 }}
                                    />
                                    {incompatible && (
                                      <div className="absolute inset-0 bg-gray-400/50 flex items-center justify-center">
                                        <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                                          Not Available
                                        </span>
                                      </div>
                                    )}
                                    {!incompatible && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setLightboxSrc(opt.image ?? null);
                                          setLightboxName(opt.name);
                                        }}
                                        className="absolute bottom-0 inset-x-0 flex items-center justify-center gap-1 bg-black/60 text-white text-xs py-1.5 opacity-0 group-hover/img:opacity-100 transition-opacity"
                                      >
                                        👁 View
                                      </button>
                                    )}
                                  </div>
                                ) : (
                                  <div
                                    className="w-full bg-gray-100 flex items-center justify-center text-xs text-gray-500 relative"
                                    style={{ height: 110 }}
                                  >
                                    Style
                                    {incompatible && (
                                      <div className="absolute inset-0 bg-gray-400/50 flex items-center justify-center">
                                        <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                                          Not Available
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                )}
                                <span
                                  className={`text-xs font-medium px-1 py-1 text-center ${incompatible ? "text-gray-400" : ""}`}
                                >
                                  {opt.name}
                                </span>
                                {(opt.addonPrice ?? 0) > 0 && !incompatible && (
                                  <span className="text-[10px] text-[#b38b00] pb-1">
                                    +&#x20b9;{opt.addonPrice}
                                  </span>
                                )}
                                {incompatible && (
                                  <span className="text-[9px] text-red-500 pb-1">
                                    ❌ Not with B&W
                                  </span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      {frameErrors.style && (
                        <p
                          className="text-red-500 text-xs mt-1"
                          data-ocid="product_detail.frame_style.error_state"
                        >
                          {frameErrors.style}
                        </p>
                      )}
                    </>
                  )}
                  {frameAddon > 0 && (
                    <div className="bg-[#FED100]/10 border border-[#FED100]/30 rounded-xl p-3">
                      <span className="text-sm font-semibold text-[#7a6600]">
                        Frame Add-on: +&#x20b9;{frameAddon}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            <button
              ref={addToCartRef}
              type="button"
              onClick={() => {
                playClick();
                addToCart();
              }}
              data-ocid="product_detail.add_to_cart.button"
              className="w-full bg-[#FED100] hover:bg-[#e6bc00] text-[#212121] font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-base mb-3"
            >
              <ShoppingCart size={20} /> Add to Cart &amp; Proceed
            </button>

            <button
              type="button"
              onClick={() => {
                playClick();
                setCustomFrameOpen(true);
              }}
              data-ocid="product_detail.custom_frame.button"
              className="w-full border-2 border-[#FED100] text-[#212121] font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm hover:bg-[#FED100]/10 mb-4"
            >
              Need a Custom Size? Order Custom Frame
            </button>

            <div className="flex flex-wrap gap-2">
              {[
                { icon: "\u2713", label: "Verified Artist" },
                { icon: "\ud83d\udd12", label: "Secure UPI" },
                { icon: "\u2713", label: "Quality Checked" },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="flex items-center gap-1.5 bg-green-50 border border-green-200 text-green-700 text-xs px-3 py-1.5 rounded-full"
                >
                  <ShieldCheck size={12} />
                  <span>
                    {badge.icon} {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <section className="mb-12">
          <h2 className="font-playfair text-2xl font-bold text-[#212121] mb-6">
            Customer Reviews
          </h2>
          {activeReviews.length === 0 ? (
            <div
              className="bg-white rounded-xl border border-[#D6D6D6] p-8 text-center text-gray-400"
              data-ocid="product_detail.reviews.empty_state"
            >
              <Star size={32} className="mx-auto mb-2 opacity-30" />
              <p>No reviews yet. Be the first to review!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeReviews.map((review, idx) => (
                <div
                  key={review.id}
                  className="bg-white rounded-xl border border-[#D6D6D6] p-4"
                  data-ocid={`product_detail.reviews.item.${idx + 1}`}
                >
                  <div className="flex items-start gap-3">
                    {review.image && (
                      <img
                        src={review.image}
                        alt="review"
                        className="w-14 h-14 object-cover rounded-lg flex-shrink-0 border border-gray-200"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">
                          {review.name}
                        </span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <Star
                              key={n}
                              size={12}
                              className={
                                n <= review.rating
                                  ? "fill-[#FED100] text-[#FED100]"
                                  : "fill-gray-200 text-gray-200"
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{review.text}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {review.date}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />

      {zoomOpen && images.length > 0 && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setZoomOpen(false)}
          onKeyDown={(e) => {
            if (e.key === "Escape") setZoomOpen(false);
          }}
          data-ocid="product_detail.zoom.modal"
          aria-hidden="false"
        >
          <button
            type="button"
            onClick={() => setZoomOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            data-ocid="product_detail.zoom.close_button"
          >
            <X size={28} />
          </button>
          <img
            src={images[imgIdx]}
            alt="Zoomed"
            className="max-w-full max-h-full object-contain rounded-lg"
          />
        </div>
      )}

      {lightboxSrc && (
        <ImageLightbox
          open={!!lightboxSrc}
          src={lightboxSrc}
          name={lightboxName}
          onClose={() => setLightboxSrc(null)}
        />
      )}
      <CustomFrameModal
        open={customFrameOpen}
        onClose={() => setCustomFrameOpen(false)}
      />

      {/* Lightbox for full view */}
      {lightboxImg && (
        <div
          className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxImg(null)}
          onKeyDown={(e) => e.key === "Escape" && setLightboxImg(null)}
          tabIndex={-1}
          data-ocid="product_detail.lightbox.modal"
        >
          <img
            src={lightboxImg}
            alt="Full view"
            className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain"
          />
          <button
            type="button"
            onClick={() => setLightboxImg(null)}
            className="absolute top-4 right-4 text-white bg-black/50 rounded-full w-10 h-10 flex items-center justify-center text-xl hover:bg-black/70"
            data-ocid="product_detail.lightbox.close_button"
          >
            ✕
          </button>
        </div>
      )}

      {/* Sticky Add-to-Cart bar on mobile */}
      {stickyBarVisible && (
        <div
          className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-[#D6D6D6] px-4 py-3 flex items-center gap-3 shadow-lg"
          style={{ animation: "slideUp 0.25s ease" }}
        >
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-700 truncate">
              {product.name}
            </div>
            <div className="text-base font-bold text-[#212121]">
              ₹{product.price + frameAddon}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              playClick();
              addToCart();
            }}
            className="bg-[#FED100] hover:bg-[#e6bc00] text-[#212121] font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm flex-shrink-0"
            data-ocid="product_detail.sticky_add_to_cart.button"
          >
            <ShoppingCart size={16} /> Add to Cart
          </button>
        </div>
      )}
      <style>
        {
          "@keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }"
        }
      </style>
    </div>
  );
}
