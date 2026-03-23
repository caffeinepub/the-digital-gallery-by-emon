import { useNavigate } from "@tanstack/react-router";
import {
  CheckCircle,
  ChevronRight,
  Package,
  Palette,
  Truck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ProductCard from "../components/ProductCard";
import { useData } from "../lib/DataContext";

const FALLBACK_TESTIMONIALS = [
  {
    name: "Priya S.",
    city: "Bongaigaon",
    text: "Amazing quality! The canvas print looked exactly like the preview. Very happy with the purchase.",
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
  const navigate = useNavigate();
  const bannerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const slideRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isDark = settings.theme === "dark";

  const bg = isDark ? "bg-[#1a1a1a]" : "bg-[#f5f5f5]";
  const heroSectionBg = isDark ? "bg-[#212121]" : "bg-[#212121]";
  const tileBg = isDark ? "bg-[#2a2c2a]" : "bg-[#333533]";
  const text = isDark ? "text-white" : "text-[#212121]";
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

  // Slideshow interval
  const slides = settings.heroSlideshow || [];
  const slideshowActive = settings.heroSlideshowEnabled && slides.length > 0;
  const slideInterval = settings.heroSlideshowInterval || 4000;

  // biome-ignore lint/correctness/useExhaustiveDependencies: cleanup only effect
  useEffect(() => {
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
  const allCategories = [
    "all",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];
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

  // Reviews: use dynamic reviews if any active exist, else fallback
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
        <div className="bg-[#212121] text-[#FED100] text-sm py-2 overflow-hidden">
          <div className="text-center font-medium transition-all duration-500">
            {settings.bannerTexts[bannerIdx]}
          </div>
        </div>
      )}

      {/* Hero Ad Banner */}
      {heroAdBanner && (
        <div
          className="text-center py-3 px-4 font-semibold text-sm cursor-pointer hover:opacity-90 transition-opacity"
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
        className={`${heroSectionBg} text-white relative overflow-hidden`}
        style={{ minHeight: slideshowActive ? "420px" : undefined }}
      >
        {/* Slideshow background */}
        {slideshowActive && (
          <div className="absolute inset-0">
            {slides.map((slide, i) => (
              <div
                key={slide.id}
                className="absolute inset-0 transition-opacity duration-1000"
                style={{ opacity: i === slideIdx ? 1 : 0 }}
              >
                <img
                  src={slide.image}
                  alt={slide.caption || "Slide"}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
              </div>
            ))}
            {/* Dot indicators */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
              {slides.map((slide, i) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setSlideIdx(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === slideIdx
                      ? "bg-[#FED100] w-4"
                      : "bg-white/50 hover:bg-white/80"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-24 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <p className="text-[#FED100] text-sm font-semibold uppercase tracking-widest mb-3">
              Premium Canvas Prints
            </p>
            <h1 className="font-playfair text-4xl md:text-6xl font-bold leading-tight mb-4">
              Transform Your
              <br />
              <span className="text-[#FED100]">Memories</span> Into Art
            </h1>
            <p className="text-gray-300 text-lg mb-8 max-w-md">
              High quality canvas prints, collages &amp; more. Delivered to your
              doorstep in just 3-4 days.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("products")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="bg-[#FED100] hover:bg-[#e6bc00] text-[#212121] font-bold px-8 py-3 rounded-lg transition-colors uppercase tracking-wide text-sm"
              >
                Shop Custom Prints
              </button>
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="border border-gray-500 text-white hover:border-[#FED100] hover:text-[#FED100] font-semibold px-8 py-3 rounded-lg transition-colors uppercase tracking-wide text-sm"
              >
                How It Works
              </button>
            </div>
            {todayOrderCount > 0 && (
              <div className="mt-5 flex items-center gap-2">
                <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0" />
                <span className="text-sm text-white/80">
                  <strong className="text-[#FED100]">{todayOrderCount}</strong>{" "}
                  orders placed today
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Feature tiles */}
      <section className={`${tileBg}`}>
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
              className="text-center text-white p-6 rounded-xl bg-[#212121] border border-[#333]"
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
          <p className="text-[#FED100] text-sm font-semibold uppercase tracking-widest mb-2">
            Our Collection
          </p>
          <h2
            className={`font-playfair text-3xl md:text-4xl font-bold ${text}`}
          >
            Premium Canvas Prints
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
                  ? "bg-[#FED100] text-[#212121] font-bold"
                  : `${
                      isDark
                        ? "bg-[#2a2c2a] text-gray-300 border border-[#444]"
                        : "bg-white text-[#333533] border border-[#D6D6D6]"
                    } hover:border-[#FED100]`
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

      {/* Mid-page Ad Banner */}
      {settings.midPageAdEnabled && (
        <section
          className="py-12 px-4 text-center"
          style={{ backgroundColor: settings.midPageAdBg || "#FED100" }}
        >
          <h3 className="font-playfair text-2xl font-bold text-[#212121] mb-2">
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
            className="bg-[#212121] text-white font-semibold px-8 py-3 rounded-lg hover:bg-[#333] transition-colors"
          >
            Shop Now
          </button>
        </section>
      )}

      {/* Dynamic mid-page ad from advanced banners */}
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
      <section className="bg-[#212121] text-white py-5">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-lg font-semibold">
            ⏰ Flash Sale ends in:{" "}
            <span className="text-[#FED100] font-mono">
              {pad(countdown.h)}:{pad(countdown.m)}:{pad(countdown.s)}
            </span>
          </p>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className={`${isDark ? "bg-[#1e1e1e]" : "bg-white"} py-16`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-[#FED100] text-sm font-semibold uppercase tracking-widest mb-2">
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
                <div className="w-14 h-14 bg-[#FED100]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#FED100]/30">
                  <Icon size={24} className="text-[#FED100]" />
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
          <p className="text-[#FED100] text-sm font-semibold uppercase tracking-widest mb-2">
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
                className={`${
                  isDark
                    ? "bg-[#2a2c2a] border-[#444]"
                    : "bg-white border-[#D6D6D6]"
                } rounded-xl p-6 shadow-sm border`}
              >
                <div className="flex gap-1 mb-3">
                  {Array.from({ length: t.rating }, (_, i) => i + 1).map(
                    (n) => (
                      <span key={`star-${n}`} className="text-[#FED100]">
                        &#9733;
                      </span>
                    ),
                  )}
                </div>
                <p
                  className={`${
                    isDark ? "text-gray-300" : "text-[#333533]"
                  } text-sm leading-relaxed mb-4`}
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
                  <div className="w-9 h-9 bg-[#FED100] rounded-full flex items-center justify-center text-[#212121] font-bold text-sm">
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

      {/* Track CTA */}
      <section className="bg-[#FED100] py-10">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="font-playfair text-2xl font-bold text-[#212121] mb-2">
            Already Ordered?
          </h3>
          <p className="text-[#333533] mb-4">
            Track your order with your Order ID
          </p>
          <button
            type="button"
            onClick={() => navigate({ to: "/track" })}
            className="bg-[#212121] text-white font-semibold px-8 py-3 rounded-lg hover:bg-[#333] transition-colors flex items-center gap-2 mx-auto"
          >
            Track My Order <ChevronRight size={18} />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
