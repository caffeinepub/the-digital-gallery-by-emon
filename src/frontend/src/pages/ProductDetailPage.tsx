import { useNavigate, useParams } from "@tanstack/react-router";
import {
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
import { useState } from "react";
import { toast } from "sonner";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useData } from "../lib/DataContext";

export default function ProductDetailPage() {
  const { productId } = useParams({ from: "/product/$productId" });
  const { products, cart, setCart, reviews, settings } = useData();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === productId);

  const [imgIdx, setImgIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [zoomOpen, setZoomOpen] = useState(false);

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
            ← Back to Home
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
    const existing = cart.find((c) => c.productId === product.id);
    const displayImage = images[0];
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
          productName: product.name,
          size: product.size,
          price: product.price,
          mrp: product.mrp,
          quantity: qty,
          image: displayImage,
        },
      ]);
    }
    toast.success(`${product.name} (x${qty}) added to cart!`);
    navigate({ to: "/cart" });
  }

  return (
    <div
      className={`min-h-screen ${isDark ? "bg-[#1a1a1a]" : "bg-[#f5f5f5]"} font-inter`}
    >
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
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
                    <div className="text-gray-500 mt-2">Canvas Print</div>
                  </div>
                </div>
              )}
              {/* Zoom button */}
              {images.length > 0 && (
                <button
                  type="button"
                  onClick={() => setZoomOpen(true)}
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
                    onClick={() => setImgIdx((i) => Math.max(0, i - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setImgIdx((i) => Math.min(images.length - 1, i + 1))
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1 shadow"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}
            </div>
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex gap-2 mt-3">
                {images.map((img, i) => (
                  <button
                    key={`thumb-${img.slice(-20)}-${i}`}
                    type="button"
                    onClick={() => setImgIdx(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${i === imgIdx ? "border-[#FED100]" : "border-transparent"}`}
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

            {/* Stars */}
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

            {/* Pricing */}
            <div className="bg-white rounded-xl border border-[#D6D6D6] p-4 mb-4">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-[#212121]">
                  &#x20b9;{product.price}
                </span>
                <span className="text-lg text-gray-400 line-through">
                  &#x20b9;{product.mrp}
                </span>
              </div>
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

            {/* Qty */}
            <div className="mb-4">
              <div className="text-sm font-medium text-[#212121] mb-2">
                Quantity:
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 rounded-lg border border-[#D6D6D6] flex items-center justify-center hover:border-[#FED100] transition-colors"
                  data-ocid="product_detail.qty_decrease.button"
                >
                  <Minus size={16} />
                </button>
                <span className="text-lg font-bold w-8 text-center">{qty}</span>
                <button
                  type="button"
                  onClick={() => setQty((q) => Math.min(10, q + 1))}
                  className="w-10 h-10 rounded-lg border border-[#D6D6D6] flex items-center justify-center hover:border-[#FED100] transition-colors"
                  data-ocid="product_detail.qty_increase.button"
                >
                  <Plus size={16} />
                </button>
                <span className="text-sm text-gray-400">Max 10 per order</span>
              </div>
            </div>

            {/* Add to Cart */}
            <button
              type="button"
              onClick={addToCart}
              data-ocid="product_detail.add_to_cart.button"
              className="w-full bg-[#FED100] hover:bg-[#e6bc00] text-[#212121] font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-base mb-3"
            >
              <ShoppingCart size={20} /> Add to Cart & Proceed
            </button>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2 mt-4">
              {[
                { icon: "✓", label: "Verified Artist" },
                { icon: "🔒", label: "Secure UPI" },
                { icon: "✓", label: "Quality Checked" },
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

      {/* Zoom modal */}
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
    </div>
  );
}
