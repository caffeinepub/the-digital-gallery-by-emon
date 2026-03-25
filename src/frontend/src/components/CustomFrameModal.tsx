import { Eye, X } from "lucide-react";
import React from "react";
import { useEffect, useMemo, useState } from "react";
import { useData } from "../lib/DataContext";
import type { FrameOption } from "../lib/data";
import { playClick } from "../lib/sounds";
import { ImageLightbox } from "./ImageLightbox";

interface CustomFrameModalProps {
  open: boolean;
  onClose: () => void;
}

function isBlackWhiteSelected(name: string): boolean {
  return /black|white/i.test(name);
}

function OptionPhotoCard({
  option,
  selected,
  onSelect,
  emoji,
  disabled,
}: {
  option: FrameOption;
  selected: boolean;
  onSelect: () => void;
  emoji?: string;
  disabled?: boolean;
}) {
  const [lightbox, setLightbox] = React.useState(false);
  const [showTooltip, setShowTooltip] = React.useState(false);
  return (
    <>
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            if (disabled) return;
            playClick();
            onSelect();
          }}
          onMouseEnter={() => disabled && setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className={`relative rounded-xl border-2 overflow-hidden transition-all flex flex-col items-center focus:outline-none group w-full ${
            disabled
              ? "border-gray-200 opacity-60 cursor-not-allowed"
              : selected
                ? "border-[#FED100] scale-[1.04]"
                : "border-gray-200 hover:border-[#FED100]/60 hover:scale-[1.02]"
          }`}
          style={{
            minWidth: 130,
            boxShadow:
              !disabled && selected
                ? "0 0 0 3px #FED100, 0 4px 12px rgba(254,209,0,0.3)"
                : "0 1px 3px rgba(0,0,0,0.06)",
            transition: "all 0.18s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          {option.image ? (
            <div className="relative w-full">
              <img
                src={option.image}
                alt={option.name}
                className="w-full object-cover"
                style={{ height: 140 }}
              />
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightbox(true);
                  }}
                  className="absolute bottom-0 inset-x-0 flex items-center justify-center gap-1 bg-black/60 text-white text-xs py-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Eye size={12} /> View
                </button>
              )}
              {disabled && (
                <div className="absolute inset-0 bg-gray-400/40 flex items-center justify-center">
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Not Available
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div
              className="w-full flex items-center justify-center bg-gray-100 text-gray-400 text-3xl relative"
              style={{ height: 140 }}
            >
              {emoji || "🖼️"}
              {disabled && (
                <div className="absolute inset-0 bg-gray-400/40 flex items-center justify-center">
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Not Available
                  </span>
                </div>
              )}
            </div>
          )}
          <div
            className={`px-2 py-1.5 text-center w-full ${
              disabled ? "bg-gray-100" : selected ? "bg-[#FED100]/20" : ""
            }`}
          >
            <span
              className={`text-sm font-semibold ${
                disabled
                  ? "text-gray-400"
                  : selected
                    ? "text-[#7a6600]"
                    : "text-gray-700"
              }`}
            >
              {option.name}
            </span>
            {(option.addonPrice ?? 0) > 0 && !disabled && (
              <div className="text-xs text-[#b38b00] font-medium">
                +₹{option.addonPrice}
              </div>
            )}
            {disabled && (
              <div className="text-[10px] text-red-500 font-medium">
                ❌ Not with B&W
              </div>
            )}
          </div>
          {selected && !disabled && (
            <span className="absolute top-2 right-2 bg-[#FED100] rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold text-[#212121] shadow">
              ✓
            </span>
          )}
        </button>
        {showTooltip && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-50 pointer-events-none">
            Not available with Black/White colour
          </div>
        )}
      </div>
      {option.image && !disabled && (
        <ImageLightbox
          open={lightbox}
          src={option.image}
          name={option.name}
          onClose={() => setLightbox(false)}
        />
      )}
    </>
  );
}

export default function CustomFrameModal({
  open,
  onClose,
}: CustomFrameModalProps) {
  const { cart, setCart, settings } = useData();
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [unit, setUnit] = useState("inch");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [addPrinting, setAddPrinting] = useState(false);

  const woodOptions: FrameOption[] = settings.frameWoodOptions || [
    { id: "fw1", name: "Teak", addonPrice: 0 },
    { id: "fw2", name: "Mango", addonPrice: 0 },
    { id: "fw3", name: "Pine", addonPrice: 0 },
    { id: "fw4", name: "MDF", addonPrice: 0 },
    { id: "fw5", name: "Bamboo", addonPrice: 0 },
  ];
  const designOptions: FrameOption[] = settings.frameDesignOptions || [
    { id: "fd1", name: "Classic", addonPrice: 0 },
    { id: "fd2", name: "Modern", addonPrice: 0 },
    { id: "fd3", name: "Rustic", addonPrice: 0 },
    { id: "fd4", name: "Royal", addonPrice: 0 },
    { id: "fd5", name: "Minimal", addonPrice: 0 },
  ];
  const styleOptions: FrameOption[] = settings.frameStyleOptions || [
    { id: "fs1", name: "Single Border", addonPrice: 0 },
    { id: "fs2", name: "Double Border", addonPrice: 0 },
    { id: "fs3", name: "Shadow Box", addonPrice: 0 },
    { id: "fs4", name: "Floating", addonPrice: 0 },
    { id: "fs5", name: "Ornate", addonPrice: 0 },
  ];
  const printingOptions: FrameOption[] = settings.framePrintingOptions || [
    { id: "fp1", name: "Matte Print", addonPrice: 200 },
    { id: "fp2", name: "Glossy Print", addonPrice: 250 },
    { id: "fp3", name: "Canvas Print", addonPrice: 350 },
  ];
  const colourOptions: FrameOption[] = settings.frameColourOptions || [
    { id: "fc1", name: "Natural Brown", addonPrice: 0 },
    { id: "fc2", name: "Black / White", addonPrice: 0 },
    { id: "fc3", name: "Golden", addonPrice: 50 },
    { id: "fc4", name: "Matte Black", addonPrice: 30 },
  ];

  const [material, setMaterial] = useState(woodOptions[0]?.name || "");
  const [design, setDesign] = useState(designOptions[0]?.name || "");
  const [style, setStyle] = useState(styleOptions[0]?.name || "");
  const [printing, setPrinting] = useState(printingOptions[0]?.name || "");
  const [colour, setColour] = useState(colourOptions[0]?.name || "");

  const isBW = isBlackWhiteSelected(colour);

  // Auto-deselect incompatible options when B&W is selected
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional - only run when isBW changes
  useEffect(() => {
    if (!isBW) return;
    const selDesign = designOptions.find((o) => o.name === design);
    if (selDesign?.blackWhiteIncompatible) setDesign("");
    const selStyle = styleOptions.find((o) => o.name === style);
    if (selStyle?.blackWhiteIncompatible) setStyle("");
    const selPrint = printingOptions.find((o) => o.name === printing);
    if (selPrint?.blackWhiteIncompatible) setPrinting("");
  }, [isBW]);

  useEffect(() => {
    if (woodOptions.length > 0) setMaterial(woodOptions[0].name);
  }, [woodOptions.length, woodOptions[0]?.name]); // eslint-disable-line

  useEffect(() => {
    if (designOptions.length > 0) setDesign(designOptions[0].name);
  }, [designOptions.length, designOptions[0]?.name]); // eslint-disable-line

  useEffect(() => {
    if (styleOptions.length > 0) setStyle(styleOptions[0].name);
  }, [styleOptions.length, styleOptions[0]?.name]); // eslint-disable-line

  useEffect(() => {
    if (printingOptions.length > 0) setPrinting(printingOptions[0].name);
  }, [printingOptions.length, printingOptions[0]?.name]); // eslint-disable-line

  useEffect(() => {
    if (colourOptions.length > 0) setColour(colourOptions[0].name);
  }, [colourOptions.length, colourOptions[0]?.name]); // eslint-disable-line

  const baseRateCm = (settings as any).customFrameBaseRateCm ?? 3;
  const baseRateInch = (settings as any).customFrameBaseRateInch ?? 50;
  const baseRateFt = (settings as any).customFrameBaseRateFt ?? 500;

  const livePrice = useMemo(() => {
    const w = Number.parseFloat(width);
    const h = Number.parseFloat(height);
    if (!w || !h || w <= 0 || h <= 0) return null;
    let baseRate = 0;
    if (unit === "cm") baseRate = baseRateCm;
    else if (unit === "inch") baseRate = baseRateInch;
    else if (unit === "ft") baseRate = baseRateFt;
    const sizePrice = w * h * baseRate;
    const selMat = woodOptions.find((o) => o.name === material);
    const selDes = designOptions.find((o) => o.name === design);
    const selSty = styleOptions.find((o) => o.name === style);
    const selPrint = printingOptions.find((o) => o.name === printing);
    const selCol = colourOptions.find((o) => o.name === colour);
    const matAddon = selMat?.addonPrice ?? 0;
    const desAddon =
      !isBW || !selDes?.blackWhiteIncompatible ? (selDes?.addonPrice ?? 0) : 0;
    const styAddon =
      !isBW || !selSty?.blackWhiteIncompatible ? (selSty?.addonPrice ?? 0) : 0;
    const printAddon =
      addPrinting && (!isBW || !selPrint?.blackWhiteIncompatible)
        ? (selPrint?.addonPrice ?? 0)
        : 0;
    const colAddon = selCol?.addonPrice ?? 0;
    return Math.ceil(
      sizePrice + matAddon + desAddon + styAddon + printAddon + colAddon,
    );
  }, [
    width,
    height,
    unit,
    material,
    design,
    style,
    printing,
    colour,
    addPrinting,
    isBW,
    baseRateCm,
    baseRateInch,
    baseRateFt,
    woodOptions,
    designOptions,
    styleOptions,
    printingOptions,
    colourOptions,
  ]);

  function handleAdd() {
    if (!width || !height) return;
    const printingLabel = addPrinting ? `, ${printing}` : "";
    const colourLabel = colour ? `, ${colour}` : "";
    const label = `Custom Frame (${width}×${height} ${unit}, ${material}, ${design}, ${style}${printingLabel}${colourLabel})`;
    const finalPrice = livePrice ?? 999;
    const existing = cart.find(
      (c) => c.productId === "custom-frame" && c.productName === label,
    );
    if (existing) {
      setCart(
        cart.map((c) =>
          c.productName === label ? { ...c, quantity: c.quantity + qty } : c,
        ),
      );
    } else {
      setCart([
        ...cart,
        {
          productId: `custom-${Date.now()}`,
          productName: label,
          size: `${width}×${height} ${unit}`,
          price: finalPrice,
          mrp: finalPrice,
          quantity: qty,
          frameColour: colour,
        },
      ]);
    }
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto"
      data-ocid="custom_frame.modal"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-4 relative">
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="font-bold text-xl text-[#212121]">
              Custom Frame Order
            </h2>
            <p className="text-gray-500 text-sm">
              Specify your exact dimensions and style
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              playClick();
              onClose();
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            data-ocid="custom_frame.close_button"
          >
            <X size={22} />
          </button>
        </div>

        <div className="p-6 space-y-7">
          {/* Dimensions */}
          <div>
            <div className="text-sm font-semibold text-[#212121] mb-3">
              📐 Frame Dimensions *
            </div>
            <div className="flex flex-col gap-3">
              {/* Row 1: Unit selector */}
              <div>
                <p className="text-xs text-gray-500 block mb-2">Select Unit</p>
                <div className="flex gap-2">
                  {["cm", "inch", "ft"].map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => {
                        playClick();
                        setUnit(u);
                      }}
                      className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${unit === u ? "border-[#FED100] bg-[#FED100]/10 text-[#212121]" : "border-gray-200 text-gray-500 hover:border-[#FED100]/50"}`}
                      data-ocid={`custom_frame.unit_${u}.toggle`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>
              {/* Row 2: Width × Height */}
              <div className="flex gap-3 items-center">
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  placeholder="Width"
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FED100] focus:ring-2 focus:ring-[#FED100]/20"
                  data-ocid="custom_frame.width.input"
                />
                <span className="text-gray-400 font-bold text-lg">×</span>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="Height"
                  className="flex-1 border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FED100] focus:ring-2 focus:ring-[#FED100]/20"
                  data-ocid="custom_frame.height.input"
                />
              </div>
            </div>
          </div>

          {/* Wood Colour — horizontal chips like Flipkart/Meesho */}
          {woodOptions.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-semibold text-[#212121]">
                  🪵 Wood Colour:
                </span>
                <span className="text-sm text-[#b38b00] font-medium">
                  {material || (
                    <span className="text-gray-400 font-normal text-sm">
                      Select one
                    </span>
                  )}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {woodOptions.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      playClick();
                      setMaterial(material === opt.name ? "" : opt.name);
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 text-sm font-medium transition-all ${
                      material === opt.name
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
            </div>
          )}

          {/* Frame Colour */}
          <div>
            <div className="text-sm font-semibold text-[#212121] mb-3">
              🎨 Frame Colour <span className="text-red-500">*</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {colourOptions.map((opt) => (
                <OptionPhotoCard
                  key={opt.id}
                  option={opt}
                  selected={colour === opt.name}
                  onSelect={() => {
                    setColour(opt.name);
                  }}
                  emoji="🎨"
                />
              ))}
            </div>
            {isBW && (
              <p className="text-xs text-amber-600 mt-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
                ℹ️ Some options may not be available with Black/White colour
              </p>
            )}
          </div>

          {/* Frame Design */}
          <div>
            <div className="text-sm font-semibold text-[#212121] mb-3">
              🎨 Frame Design
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {designOptions.map((opt) => {
                const incompatible = isBW && opt.blackWhiteIncompatible;
                return (
                  <OptionPhotoCard
                    key={opt.id}
                    option={opt}
                    selected={design === opt.name}
                    onSelect={() => !incompatible && setDesign(opt.name)}
                    emoji="🎨"
                    disabled={incompatible}
                  />
                );
              })}
            </div>
          </div>

          {/* Frame Style */}
          <div>
            <div className="text-sm font-semibold text-[#212121] mb-3">
              ✨ Frame Style
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {styleOptions.map((opt) => {
                const incompatible = isBW && opt.blackWhiteIncompatible;
                return (
                  <OptionPhotoCard
                    key={opt.id}
                    option={opt}
                    selected={style === opt.name}
                    onSelect={() => !incompatible && setStyle(opt.name)}
                    emoji="✨"
                    disabled={incompatible}
                  />
                );
              })}
            </div>
          </div>

          {/* Printing Service */}
          <div className="border border-gray-200 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm font-semibold text-[#212121]">
                  🖨️ Add Printing Service?
                </div>
                <div className="text-xs text-gray-500">
                  Get your photo printed professionally
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setAddPrinting((v) => !v);
                }}
                className={`relative inline-flex h-7 w-13 items-center rounded-full transition-colors ${
                  addPrinting ? "bg-[#FED100]" : "bg-gray-200"
                }`}
                style={{ width: 52 }}
                data-ocid="custom_frame.printing.toggle"
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                    addPrinting ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            {addPrinting && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                {printingOptions.map((opt) => {
                  const incompatible = isBW && opt.blackWhiteIncompatible;
                  return (
                    <OptionPhotoCard
                      key={opt.id}
                      option={opt}
                      selected={printing === opt.name}
                      onSelect={() => !incompatible && setPrinting(opt.name)}
                      emoji="🖨️"
                      disabled={incompatible}
                    />
                  );
                })}
              </div>
            )}
          </div>

          {/* Quantity */}
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-[#212121]">Quantity</div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setQty((q) => Math.max(1, q - 1));
                }}
                className="w-10 h-10 rounded-xl border border-gray-300 flex items-center justify-center hover:border-[#FED100] text-xl font-bold transition-colors"
              >
                −
              </button>
              <span className="text-xl font-bold w-10 text-center">{qty}</span>
              <button
                type="button"
                onClick={() => {
                  playClick();
                  setQty((q) => Math.min(10, q + 1));
                }}
                className="w-10 h-10 rounded-xl border border-gray-300 flex items-center justify-center hover:border-[#FED100] text-xl font-bold transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Live Price */}
          <div className="bg-[#FED100]/10 border border-[#FED100]/40 rounded-2xl p-4">
            {livePrice !== null ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#7a6600]">
                    Estimated Price
                  </span>
                  <span
                    className="text-2xl font-bold text-[#212121]"
                    style={{ transition: "all 0.3s ease" }}
                  >
                    ₹{livePrice}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Per frame · Final price may vary slightly
                </p>
              </>
            ) : (
              <>
                <p className="text-sm font-semibold text-[#7a6600]">
                  Enter dimensions to see price
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  Price calculated from size + selected options
                </p>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6">
          <button
            type="button"
            onClick={() => {
              playClick();
              handleAdd();
            }}
            disabled={!width || !height || added}
            className="w-full bg-[#FED100] hover:bg-[#e6bc00] disabled:opacity-60 text-[#212121] font-bold py-4 rounded-xl transition-colors text-base"
            data-ocid="custom_frame.add_to_cart.button"
          >
            {added
              ? "✓ Added to Cart!"
              : `Add Custom Frame to Cart${livePrice ? ` — ₹${livePrice}` : ""}`}
          </button>
        </div>
      </div>
    </div>
  );
}
