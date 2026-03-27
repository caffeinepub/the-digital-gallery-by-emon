import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle,
  ChevronRight,
  Package,
  Palette,
  Truck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import CustomFrameModal from "../components/CustomFrameModal";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import OwnerShowcase from "../components/OwnerShowcase";
import ProductCard from "../components/ProductCard";
import { useData } from "../lib/DataContext";
import { playClick } from "../lib/sounds";

const FALLBACK_TESTIMONIALS = [
  {
    name: "Priya S.",
    city: "Bongaigaon",
    text: "Amazing quality! The photo frame looked exactly like the preview. Very happy with the purchase.",
    rating: 5,
    image: undefined as string | undefined,
  },
  {
    name: "Rahul D.",
    city: "Kokrajhar",
    text: "Fast delivery, great packaging, and the print quality is excellent. Will order again!",
    rating: 5,
    image: undefined as string | undefined,
  },
  {
    name: "Anjali M.",
    city: "Barpeta Road",
    text: "The collage turned out beautifully. Perfect gift for my parents anniversary.",
    rating: 5,
    image: undefined as string | undefined,
  },
];

export default function HomePage() {
  const { products: allProducts, settings, reviews, orders } = useData();
  const today = new Date().toDateString();
  const todayOrderCount = orders.filter(
    (o) => new Date(o.createdAt).toDateString() === today,
  ).length;
  const [filter, setFilter] = useState("all");
  const [bannerIdx, setBannerIdx] = useState(0);
  const [slideIdx, setSlideIdx] = useState(0);
  const [countdown, setCountdown] = useState({ h: 2, m: 45, s: 18 });
  const [customFrameOpen, setCustomFrameOpen] = useState(false);
  const navigate = useNavigate();
  const bannerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const slideRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isDark = settings.theme === "dark";

  const bg = isDark ? "bg-[#1a1a1a]" : "bg-[var(--tdg-bg)]";
  const tileBg = isDark ? "bg-[#2a2c2a]" : "bg-[#333533]";
  const text = isDark ? "text-white" : "text-[var(--tdg-dark)]";
  const subText = isDark ? "text-gray-400" : "text-[#555]";

  useEffect(() => {
    if (!settings.bannersEnabled || settings.bannerTexts.length === 0) return;
    bannerRef.current = setInterval(() => {
      setBannerIdx((i) => (i + 1) % settings.bannerTexts.length);
    }, 3000);
    return () => {
      if (bannerRef.current) clearInterval(bannerRef.current);
    };
  }, [settings.bannersEnabled, settings.bannerTexts.length]);

  const slides = settings.heroSlideshow || [];
  const slideshowActive = settings.heroSlideshowEnabled && slides.length > 0;
  const slideInterval = settings.heroSlideshowInterval || 4000;
  const slideTransition = settings.heroSlideshowTransition || "crossfade";

  useEffect(() => {
    if (!slideshowActive || slides.length < 2) return;
    slideRef.current = setInterval(() => {
      setSlideIdx((i) => (i + 1) % slides.length);
    }, slideInterval);
    return () => {
      if (slideRef.current) clearInterval(slideRef.current);
    };
  }, [slideshowActive, slides.length, slideInterval]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) {
          s = 59;
          m--;
        }
        if (m < 0) {
          m = 59;
          h--;
        }
        if (h < 0) {
          h = 2;
          m = 45;
          s = 18;
        }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const products = allProducts.filter((p) => p.active);
  const adminCats =
    settings.categories && settings.categories.length > 0
      ? settings.categories
      : Array.from(new Set(products.map((p) => p.category)));
  const allCategories = ["all", ...adminCats];
  const filtered = products.filter(
    (p) => filter === "all" || p.category === filter,
  );
  const pad = (n: number) => String(n).padStart(2, "0");

  const heroAdBanner = settings.advancedBanners?.find(
    (b) => b.type === "hero" && b.active,
  );
  const midPageAd = settings.advancedBanners?.find(
    (b) => b.type === "midpage" && b.active,
  );

  const activeReviews = reviews.filter((r) => r.active);
  const displayReviews =
    activeReviews.length > 0
      ? activeReviews.map((r) => ({
          name: r.name,
          city: "",
          text: r.text,
          rating: r.rating,
          image: r.image,
        }))
      : FALLBACK_TESTIMONIALS;

  return (
    <div className={`min-h-screen ${bg} font-inter`}>
      <Navbar />

      {/* Ticker banner */}
      {settings.bannersEnabled && settings.bannerTexts.length > 0 && (
        <div className="bg-[var(--tdg-dark)] text-[var(--tdg-amber)] text-sm py-2 overflow-hidden">
          <div className="text-center font-medium transition-all duration-500">
            {settings.bannerTexts[bannerIdx]}
          </div>
        </div>
      )}

      {/* Hero Ad Banner */}
      {heroAdBanner && (
        <div
          className="text-center py-3 px-4 font-semibold text-sm"
          style={{
            backgroundColor: heroAdBanner.bgColor,
            color: heroAdBanner.textColor,
          }}
        >
          {heroAdBanner.text}
        </div>
      )}

      {/* Hero */}
      <section
        className="bg-[var(--tdg-dark)] text-white relative"
        style={{ height: "60vh", minHeight: "300px", maxHeight: "600px" }}
      >
        {/* Slideshow background — fixed coverage, no cropping */}
        {slideshowActive ? (
          <div className="absolute inset-0" style={{ overflow: "hidden" }}>
            {slideTransition === "crossfade" ? (
              slides.map((slide, i) => (
                <div
                  key={slide.id}
                  className="absolute inset-0"
                  style={{
                    opacity: i === slideIdx ? 1 : 0,
                    transition: "opacity 1s ease-in-out",
                    willChange: "opacity",
                  }}
                >
                  <img
                    src={slide.image}
                    alt={slide.caption || `Slide ${i + 1}`}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      objectPosition: "center",
                      display: "block",
                    }}
                  />
                  <div className="absolute inset-0 bg-black/50" />
                </div>
              ))
            ) : (
              <div
                className="absolute inset-0 flex"
                style={{
                  width: `${slides.length * 100}%`,
                  transform: `translateX(-${(slideIdx / slides.length) * 100}%)`,
                  transition: "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
                  willChange: "transform",
                }}
              >
                {slides.map((slide, i) => (
                  <div
                    key={slide.id}
                    className="relative flex-shrink-0"
                    style={{ width: `${100 / slides.length}%`, height: "100%" }}
                  >
                    <img
                      src={slide.image}
                      alt={slide.caption || `Slide ${i + 1}`}
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                        display: "block",
                      }}
                    />
                    <div className="absolute inset-0 bg-black/50" />
                  </div>
                ))}
              </div>
            )}
            {/* Dot indicators */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
              {slides.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setSlideIdx(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${i === slideIdx ? "bg-[var(--tdg-amber)] w-4" : "w-2 bg-white/50 hover:bg-white/80"}`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[#212121] to-[#333533]" />
        )}

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full py-8">
            <p className="text-[var(--tdg-amber)] text-sm font-semibold uppercase tracking-widest mb-3">
              {settings.heroBadgeText || "Premium Photo Frames"}
            </p>
            <h1 className="font-playfair text-4xl md:text-5xl font-bold leading-tight mb-4">
              {settings.heroHeading || "Transform Your"}
              <br />
              <span className="text-[var(--tdg-amber)]">
                {settings.heroHeadingAccent || "Memories"}
              </span>{" "}
              Into Art
            </h1>
            <p className="text-gray-300 text-base md:text-lg mb-6 max-w-md">
              {settings.heroSubtext ||
                "High quality photo frames, collages & more. Delivered to your doorstep in just 3-4 days."}
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("products")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="bg-[var(--tdg-amber)] hover:bg-[#e6bc00] text-[var(--tdg-dark)] font-bold px-7 py-3 rounded-lg transition-colors uppercase tracking-wide text-sm"
              >
                Shop Regular Frames
              </button>
              <button
                type="button"
                onClick={() => setCustomFrameOpen(true)}
                className="border border-[var(--tdg-amber)] text-[var(--tdg-amber)] hover:bg-[var(--tdg-amber)]/10 font-semibold px-7 py-3 rounded-lg transition-colors text-sm"
                data-ocid="hero.custom_frame.button"
              >
                🗒️ Order Custom Size
              </button>
            </div>
            {todayOrderCount > 0 && (
              <div className="mt-4 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0" />
                <span className="text-sm text-white/80">
                  <strong className="text-[var(--tdg-amber)]">
                    {todayOrderCount}
                  </strong>{" "}
                  orders placed today
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Feature tiles */}
      <section className={tileBg}>
        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: "🎁",
              title: "30% OFF",
              sub: `Use code ${settings.popupCode}`,
            },
            {
              icon: "🎨",
              title: "Create Yours",
              sub: "Upload any photo, any size",
            },
            { icon: "🚚", title: "Fast Delivery", sub: "3-4 Working Days" },
          ].map((tile) => (
            <div
              key={tile.title}
              className="text-center text-white p-6 rounded-xl bg-[var(--tdg-dark)] border border-[#333]"
            >
              <div className="text-3xl mb-2">{tile.icon}</div>
              <div className="font-playfair font-semibold text-lg">
                {tile.title}
              </div>
              <div className="text-gray-400 text-sm mt-1">{tile.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Products */}
      <section id="products" className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <p className="text-[var(--tdg-amber)] text-sm font-semibold uppercase tracking-widest mb-2">
            Our Collection
          </p>
          <h2
            className={`font-playfair text-3xl md:text-4xl font-bold ${text}`}
          >
            {filter === "all"
              ? "All Products"
              : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Collection`}
          </h2>
          <p className={`${subText} mt-2`}>
            Choose from our wide range of sizes and styles
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {allCategories.map((f) => (
            <button
              type="button"
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors capitalize ${
                filter === f
                  ? "bg-[var(--tdg-amber)] text-[var(--tdg-dark)] font-bold"
                  : `${isDark ? "bg-[#2a2c2a] text-gray-300 border border-[#444]" : "bg-white text-[#333533] border border-[var(--tdg-light)]"} hover:border-[var(--tdg-amber)]`
              }`}
            >
              {f === "all"
                ? "All Products"
                : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Custom Frame Section */}
      <section className={`${isDark ? "bg-[#1e1e1e]" : "bg-white"} py-12`}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-8">
            <p className="text-[var(--tdg-amber)] text-sm font-semibold uppercase tracking-widest mb-2">
              What Would You Like?
            </p>
            <h2 className={`font-playfair text-3xl font-bold ${text}`}>
              Choose Your Frame Type
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Regular Frames Card */}
            <div
              className={`rounded-2xl border-2 p-8 flex flex-col items-center text-center ${
                isDark
                  ? "border-[#333] bg-[#252525]"
                  : "border-[var(--tdg-light)] bg-[#f9f9f9]"
              }`}
            >
              <div className="text-5xl mb-4">🖼️</div>
              <h3 className={`font-playfair text-2xl font-bold ${text} mb-2`}>
                Our Regular Frames
              </h3>
              <p className={`${subText} text-sm mb-6`}>
                Browse our curated collection of premium photo frames in
                standard sizes. Fast delivery, quality guaranteed.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {["4×6 inch", "5×7 inch", "A4", "12×16 inch", "18×24 inch"].map(
                  (s) => (
                    <span
                      key={s}
                      className="text-xs bg-[var(--tdg-amber)]/20 text-[#7a6600] font-medium px-3 py-1 rounded-full"
                    >
                      {s}
                    </span>
                  ),
                )}
              </div>
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("products")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="w-full bg-[var(--tdg-amber)] hover:bg-[#e6bc00] text-[var(--tdg-dark)] font-bold py-3.5 rounded-xl transition-colors text-sm uppercase tracking-wide"
                data-ocid="home.shop_regular.button"
              >
                🛒 Shop Regular Frames
              </button>
            </div>

            {/* Custom Frame Card */}
            <div
              className={`rounded-2xl border-2 p-8 flex flex-col items-center text-center ${
                isDark
                  ? "border-[var(--tdg-amber)]/30 bg-[#252525]"
                  : "border-[var(--tdg-amber)]/40 bg-[#fffef0]"
              }`}
            >
              <div className="text-5xl mb-4">🗒️</div>
              <h3 className={`font-playfair text-2xl font-bold ${text} mb-2`}>
                Custom Size Frame
              </h3>
              <p className={`${subText} text-sm mb-6`}>
                Don't see your size? Order any dimension with your choice of
                wood material, design, and style. Fully personalised.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                {[
                  "Any Size",
                  "cm / inch / ft",
                  "Premium Wood",
                  "Your Style",
                ].map((s) => (
                  <span
                    key={s}
                    className="text-xs bg-[var(--tdg-dark)]/10 text-[#333] font-medium px-3 py-1 rounded-full"
                  >
                    {s}
                  </span>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setCustomFrameOpen(true)}
                className="w-full border-2 border-[var(--tdg-amber)] text-[var(--tdg-dark)] bg-white hover:bg-[var(--tdg-amber)]/10 font-bold py-3.5 rounded-xl transition-colors text-sm uppercase tracking-wide"
                data-ocid="custom_frame.open_modal_button"
              >
                🗒️ Order Custom Size
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Mid-page Ad Banner */}
      {settings.midPageAdEnabled && (
        <section
          className="py-12 px-4 text-center"
          style={{ backgroundColor: settings.midPageAdBg || "#FED100" }}
        >
          <h3 className="font-playfair text-2xl font-bold text-[var(--tdg-dark)] mb-2">
            {settings.midPageAdText}
          </h3>
          <p className="text-[#333533] mb-4">{settings.midPageAdSubtext}</p>
          <button
            type="button"
            onClick={() =>
              document
                .getElementById("products")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="bg-[var(--tdg-dark)] text-white font-semibold px-8 py-3 rounded-lg hover:bg-[#333] transition-colors"
          >
            Shop Now
          </button>
        </section>
      )}

      {midPageAd && (
        <div
          className="py-4 px-4 text-center font-semibold text-sm"
          style={{
            backgroundColor: midPageAd.bgColor,
            color: midPageAd.textColor,
          }}
        >
          {midPageAd.text}
        </div>
      )}

      {/* Urgency band */}
      {settings.offerTimerEnabled !== false && (
        <section className="bg-[var(--tdg-dark)] text-white py-5">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-lg font-semibold">
              ⏰ {settings.offerTimerText || "Flash Sale ends in:"}{" "}
              <span className="text-[var(--tdg-amber)] font-mono">
                {pad(countdown.h)}:{pad(countdown.m)}:{pad(countdown.s)}
              </span>
            </p>
          </div>
        </section>
      )}

      {/* How it works */}
      <section
        id="how-it-works"
        className={`${isDark ? "bg-[#1e1e1e]" : "bg-white"} py-16`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-[var(--tdg-amber)] text-sm font-semibold uppercase tracking-widest mb-2">
              Process
            </p>
            <h2
              className={`font-playfair text-3xl md:text-4xl font-bold ${text}`}
            >
              How It Works
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                icon: Package,
                step: "01",
                title: "Choose Size",
                desc: "Select your canvas size and style",
              },
              {
                icon: Palette,
                step: "02",
                title: "Upload Photo",
                desc: "Send us your favorite photo",
              },
              {
                icon: CheckCircle,
                step: "03",
                title: "We Print",
                desc: "Premium printing with quality check",
              },
              {
                icon: Truck,
                step: "04",
                title: "We Deliver",
                desc: "Receive your print in 3-4 working days",
              },
            ].map(({ icon: Icon, step, title, desc }) => (
              <div key={step} className="text-center">
                <div className="w-14 h-14 bg-[var(--tdg-amber)]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[var(--tdg-amber)]/30">
                  <Icon size={24} className="text-[var(--tdg-amber)]" />
                </div>
                <div className="text-gray-500 text-xs font-mono mb-1">
                  STEP {step}
                </div>
                <div className="font-playfair font-semibold text-lg mb-1">
                  {title}
                </div>
                <div className="text-gray-400 text-sm">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <p className="text-[var(--tdg-amber)] text-sm font-semibold uppercase tracking-widest mb-2">
            Reviews
          </p>
          <h2
            className={`font-playfair text-3xl md:text-4xl font-bold ${text}`}
          >
            What Our Customers Say
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayReviews.map((t, idx) => {
            const reviewKey = `review-${t.name}-${idx}`;
            return (
              <div
                key={reviewKey}
                className={`${isDark ? "bg-[#2a2c2a] border-[#444]" : "bg-white border-[var(--tdg-light)]"} rounded-xl p-6 shadow-sm border`}
              >
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }, (_, i) => i + 1).map(
                    (n) => (
                      <span
                        key={`star-${n}`}
                        className="text-[var(--tdg-amber)]"
                      >
                        &#9733;
                      </span>
                    ),
                  )}
                </div>
                <p
                  className={`${isDark ? "text-gray-300" : "text-[#333533]"} text-sm leading-relaxed mb-4`}
                >
                  &ldquo;{t.text}&rdquo;
                </p>
                {t.image && (
                  <img
                    src={t.image}
                    alt="Customer review"
                    className="w-full rounded-lg mb-4 max-h-48 object-cover"
                  />
                )}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[var(--tdg-amber)] rounded-full flex items-center justify-center text-[var(--tdg-dark)] font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className={`font-semibold text-sm ${text}`}>
                      {t.name}
                    </div>
                    {t.city && (
                      <div className="text-xs text-gray-500">{t.city}</div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Our Work Gallery */}
      {(settings as any).ourWorkPhotos &&
        (settings as any).ourWorkPhotos.length > 0 && (
          <section
            className="py-14 max-w-7xl mx-auto px-4"
            data-ocid="home.our_work.section"
          >
            <div className="text-center mb-8">
              <h2 className="font-playfair text-3xl font-bold text-[var(--tdg-dark)]">
                Our Work
              </h2>
              <p className="text-gray-500 mt-2">Real frames, real memories</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {((settings as any).ourWorkPhotos as string[]).map(
                (photo: string, idx: number) => (
                  <div
                    key={String(idx)}
                    className="rounded-2xl overflow-hidden border border-[var(--tdg-light)] shadow-sm aspect-square hover:shadow-md transition-shadow"
                  >
                    <img
                      src={photo}
                      alt="Our work"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ),
              )}
            </div>
          </section>
        )}

      <OwnerShowcase />

      {/* Track CTA */}
      <section className="bg-[var(--tdg-amber)] py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="font-playfair text-2xl font-bold text-[var(--tdg-dark)] mb-2">
            Already Ordered?
          </h3>
          <p className="text-[#333533] mb-4">
            Track your order with your Order ID
          </p>
          <button
            type="button"
            onClick={() => navigate({ to: "/track" })}
            className="bg-[var(--tdg-dark)] text-white font-semibold px-8 py-3 rounded-lg hover:bg-[#333] transition-colors flex items-center gap-2 mx-auto"
          >
            Track My Order <ChevronRight size={18} />
          </button>
        </div>
      </section>

      <Footer />

      {/* Custom Frame Modal */}
      <CustomFrameModal
        open={customFrameOpen}
        onClose={() => setCustomFrameOpen(false)}
      />
    </div>
  );
}
