import { useNavigate } from "@tanstack/react-router";
import { ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import type { Product } from "../lib/data";

interface ProductCardProps {
  product: Product;
}

const GRADIENTS = [
  "from-blue-50 to-indigo-100",
  "from-rose-50 to-pink-100",
  "from-amber-50 to-yellow-100",
  "from-green-50 to-emerald-100",
  "from-purple-50 to-violet-100",
  "from-cyan-50 to-sky-100",
];

export default function ProductCard({ product }: ProductCardProps) {
  const [thickness, setThickness] = useState<'1"' | '1.5"'>('1"');
  const navigate = useNavigate();
  const extra = thickness === '1.5"' ? 200 : 0;
  const finalPrice = product.price + extra;
  const save = product.mrp - finalPrice;
  const idx = Number.parseInt(product.id.replace("p", "")) % GRADIENTS.length;

  return (
    <div className="bg-white rounded-xl border border-[#D6D6D6] shadow-sm hover:shadow-md transition-shadow group overflow-hidden flex flex-col">
      <div
        className={`bg-gradient-to-br ${GRADIENTS[idx]} h-48 flex items-center justify-center relative overflow-hidden`}
      >
        <div className="text-center">
          <div className="font-playfair text-2xl font-bold text-[#333533]">
            {product.size}
          </div>
          <div className="text-[#333533] text-sm mt-1 opacity-70">
            {product.category === "canvas"
              ? "Canvas Print"
              : product.category === "collage"
                ? "Collage"
                : "Special"}
          </div>
        </div>
        <div className="absolute top-2 left-2">
          <span className="bg-[#FFEE32] text-[#212121] text-xs px-2 py-0.5 rounded-full font-bold">
            {Math.round((save / product.mrp) * 100)}% OFF
          </span>
        </div>
        {product.stock < 10 && (
          <div className="absolute top-2 right-2">
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
              Low Stock
            </span>
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-[#212121] text-sm leading-tight">
          {product.name} {product.size}
        </h3>
        <div className="flex items-center gap-1 mt-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={`star-${n}`}
              size={12}
              className={
                n <= 4
                  ? "fill-[#FED100] text-[#FED100]"
                  : "fill-gray-200 text-gray-200"
              }
            />
          ))}
          <span className="text-xs text-gray-400 ml-1">(4.5)</span>
        </div>

        <div className="mt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-[#212121]">
              &#x20b9;{finalPrice}
            </span>
            <span className="text-sm text-gray-400 line-through">
              &#x20b9;{product.mrp + extra}
            </span>
          </div>
          <span className="inline-block bg-[#FFEE32]/40 text-[#7a6600] text-xs px-2 py-0.5 rounded mt-0.5 font-medium">
            Save &#x20b9;{save}
          </span>
        </div>

        <div className="mt-3">
          <div className="text-xs text-gray-500 mb-1 block">Thickness:</div>
          <select
            value={thickness}
            onChange={(e) => setThickness(e.target.value as '1"' | '1.5"')}
            className="w-full text-sm border border-[#D6D6D6] rounded px-2 py-1.5 focus:outline-none focus:border-[#FED100]"
          >
            <option value='1"'>1 inch</option>
            <option value='1.5"'>1.5 inch (+&#x20b9;200)</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate({ to: `/order/${product.id}`, search: { thickness } })
          }
          className="mt-auto pt-3 w-full bg-[#FED100] hover:bg-[#e6bc00] text-[#212121] font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <ShoppingCart size={16} /> Order Now
        </button>
      </div>
    </div>
  );
}
