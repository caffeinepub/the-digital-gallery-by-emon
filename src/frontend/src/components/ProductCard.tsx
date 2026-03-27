import { useNavigate } from "@tanstack/react-router";
import { ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";
import { useData } from "../lib/DataContext";
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
  const navigate = useNavigate();
  const { cart, setCart } = useData();
  const displayImage = product.images?.[0] || product.image;
  const idx = Number.parseInt(product.id.replace("p", "")) % GRADIENTS.length;
  const save = product.mrp - product.price;

  function addToCart() {
    const existing = cart.find((c) => c.productId === product.id);
    if (existing) {
      setCart(
        cart.map((c) =>
          c.productId === product.id ? { ...c, quantity: c.quantity + 1 } : c,
        ),
      );
    } else {
      setCart([
        ...cart,
        {
          productId: product.id,
          productName: product.name,
          size: product.size,
          price: product.price,
          mrp: product.mrp,
          quantity: 1,
          image: displayImage,
        },
      ]);
    }
    toast.success(`${product.name} added to cart!`, { duration: 2000 });
  }

  return (
    <div className="bg-white rounded-xl border border-[var(--tdg-light)] shadow-sm hover:shadow-md transition-shadow group overflow-hidden flex flex-col">
      <button
        type="button"
        className="relative w-full"
        onClick={() => navigate({ to: `/product/${product.id}` })}
      >
        <div
          className={`bg-gradient-to-br ${GRADIENTS[idx]} h-48 flex items-center justify-center relative overflow-hidden`}
        >
          {displayImage ? (
            <img
              src={displayImage}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="text-center">
              <div className="font-playfair text-2xl font-bold text-[#333533]">
                {product.size}
              </div>
              <div className="text-[#333533] text-sm mt-1 opacity-70">
                {product.category === "canvas"
                  ? "Photo Frame"
                  : product.category === "collage"
                    ? "Collage"
                    : "Special"}
              </div>
            </div>
          )}
          <div className="absolute top-2 left-2">
            <span className="bg-[var(--tdg-yellow)] text-[var(--tdg-dark)] text-xs px-2 py-0.5 rounded-full font-bold">
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
      </button>

      <div className="p-4 flex flex-col flex-1">
        <button
          type="button"
          onClick={() => navigate({ to: `/product/${product.id}` })}
          className="text-left"
        >
          <h3 className="font-semibold text-[var(--tdg-dark)] text-sm leading-tight hover:text-[#b38b00] transition-colors">
            {product.name}
          </h3>
        </button>
        <div className="flex items-center gap-1 mt-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={`star-${n}`}
              size={12}
              className={
                n <= 4
                  ? "fill-[#FED100] text-[var(--tdg-amber)]"
                  : "fill-gray-200 text-gray-200"
              }
            />
          ))}
          <span className="text-xs text-gray-400 ml-1">(4.5)</span>
        </div>
        <div className="mt-2">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-[var(--tdg-dark)]">
              &#x20b9;{product.price}
            </span>
            <span className="text-sm text-gray-400 line-through">
              &#x20b9;{product.mrp}
            </span>
          </div>
          <span className="inline-block bg-[var(--tdg-yellow)]/40 text-[#7a6600] text-xs px-2 py-0.5 rounded mt-0.5 font-medium">
            Save &#x20b9;{save}
          </span>
        </div>
        <button
          type="button"
          onClick={addToCart}
          data-ocid="product.add_to_cart.button"
          className="mt-auto pt-3 w-full bg-[var(--tdg-amber)] hover:bg-[#e6bc00] text-[var(--tdg-dark)] font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <ShoppingCart size={16} /> Add to Cart
        </button>
      </div>
    </div>
  );
}
