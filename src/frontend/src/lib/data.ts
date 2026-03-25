// Data models and localStorage helpers

export interface Product {
  id: string;
  name: string;
  category: string;
  size: string;
  mrp: number;
  price: number;
  stock: number;
  active: boolean;
  description: string;
  image?: string; // base64 data URL (legacy, first image)
  images?: string[]; // up to 5 base64 data URLs
  highlights?: string[];
}

export interface CartItem {
  productId: string;
  productName: string;
  size: string;
  price: number;
  mrp: number;
  quantity: number;
  image?: string;
  frameColour?: string;
}

export interface CustomerSession {
  name: string;
  phone: string;
}

export interface ShippingZone {
  id: string;
  name: string;
  pincodePrefixes: string[];
  charge: number;
}

export interface DeliveryLocation {
  id: string;
  name: string;
  charge: number;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  productId: string;
  productName: string;
  size: string;
  thickness: string;
  quantity: number;
  price: number;
  advanceAmount: number;
  advancePaid: boolean;
  deliveryCharge: number;
  shippingZone?: string;
  pincode?: string;
  pickupCity: string;
  photoRef: string;
  status:
    | "pending"
    | "advance_confirmed"
    | "processing"
    | "ready"
    | "delivered"
    | "cancelled";
  expectedDelivery: string;
  createdAt: string;
  cancelledAt?: string;
  notes: string;
  frameColour?: string;
}

export interface FinanceRecord {
  id: string;
  month: string;
  year: number;
  sales: number;
  discounts: number;
  investments: number;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  totalPurchased: number;
  totalPaid: number;
  transactions: {
    date: string;
    type: "purchase" | "payment";
    amount: number;
    note: string;
  }[];
}

export interface Banner {
  id: string;
  text: string;
  type: "ticker" | "hero" | "midpage" | "popup_strip";
  bgColor: string;
  textColor: string;
  active: boolean;
  link?: string;
}

export interface Review {
  id: string;
  name: string;
  rating: number; // 1-5
  text: string;
  image?: string; // base64 - photo or SMS screenshot
  date: string;
  active: boolean;
}

export interface FrameOption {
  id: string;
  name: string;
  image?: string;
  addonPrice?: number;
  blackWhiteIncompatible?: boolean;
}

export interface Settings {
  storeName: string;
  adminPassword: string;
  whatsapp: string;
  upiId: string;
  bankName: string;
  accountNumber: string;
  ifsc: string;
  accountName: string;
  popupEnabled: boolean;
  popupText: string;
  popupSubtext: string;
  popupCode: string;
  popupImage?: string;
  bannersEnabled: boolean;
  bannerTexts: string[];
  advancedBanners: Banner[];
  trackingEnabled: boolean;
  logoText: string;
  logoImage?: string;
  qrCodeImage?: string;
  heroSlideshowEnabled?: boolean;
  heroSlideshowInterval?: number;
  heroSlideshow?: { id: string; image: string; caption?: string }[];
  heroSlideshowTransition?: "crossfade" | "slide";
  theme: "light" | "dark";
  categories: string[];
  pickupCities: string[];
  announcementBar: string;
  announcementBarEnabled: boolean;
  midPageAdEnabled: boolean;
  midPageAdText: string;
  midPageAdSubtext: string;
  midPageAdBg: string;
  showBankDetails?: boolean;
  showUpiDetails?: boolean;
  shippingZones?: ShippingZone[];
  deliveryLocations: DeliveryLocation[];
  whatsappTemplate?: string;
  aboutUs?: string;
  heroBadgeText: string;
  heroHeading: string;
  heroHeadingAccent: string;
  heroSubtext: string;
  heroCtaText: string;
  aboutMe: {
    bio: string;
    tagline: string;
    experience: string;
    profilePhoto: string;
    personalInstagram: string;
    personalFacebook: string;
    personalYoutube: string;
    personalWhatsapp: string;
    businessInstagram: string;
    businessFacebook: string;
    businessYoutube: string;
    businessWhatsapp: string;
  };
  offerTimerEnabled?: boolean;
  offerTimerText?: string;
  frameWoodOptions?: FrameOption[];
  frameDesignOptions?: FrameOption[];
  frameStyleOptions?: FrameOption[];
  framePrintingOptions?: FrameOption[];
  frameColourOptions?: FrameOption[];
  ourWorkPhotos?: string[];
  customFrameBaseRateCm?: number;
  customFrameBaseRateInch?: number;
  customFrameBaseRateFt?: number;
}

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: 'Photo Frame 4x6"',
    category: "canvas",
    size: '4x6"',
    mrp: 199,
    price: 149,
    stock: 50,
    active: true,
    description: "Premium photo frame 4x6 inches | 1 Inch thick",
  },
  {
    id: "p2",
    name: 'Photo Frame 4x6" (1.5 Inch)',
    category: "canvas",
    size: '4x6"',
    mrp: 249,
    price: 179,
    stock: 50,
    active: true,
    description: "Premium photo frame 4x6 inches | 1.5 Inch thick",
  },
  {
    id: "p3",
    name: 'Photo Frame 5x7"',
    category: "canvas",
    size: '5x7"',
    mrp: 299,
    price: 199,
    stock: 50,
    active: true,
    description: "Premium photo frame 5x7 inches | 1 Inch thick",
  },
  {
    id: "p4",
    name: 'Photo Frame 5x7" (1.5 Inch)',
    category: "canvas",
    size: '5x7"',
    mrp: 299,
    price: 219,
    stock: 50,
    active: true,
    description: "Premium photo frame 5x7 inches | 1.5 Inch thick",
  },
  {
    id: "p5",
    name: 'Photo Frame 6x8"',
    category: "canvas",
    size: '6x8"',
    mrp: 349,
    price: 249,
    stock: 40,
    active: true,
    description: "Premium photo frame 6x8 inches | 1 Inch thick",
  },
  {
    id: "p6",
    name: 'Photo Frame 6x8" (1.5 Inch)',
    category: "canvas",
    size: '6x8"',
    mrp: 399,
    price: 279,
    stock: 40,
    active: true,
    description: "Premium photo frame 6x8 inches | 1.5 Inch thick",
  },
  {
    id: "p7",
    name: "Photo Frame A4",
    category: "canvas",
    size: "A4",
    mrp: 399,
    price: 299,
    stock: 40,
    active: true,
    description: "Premium photo frame A4 size | 1 Inch thick",
  },
  {
    id: "p8",
    name: "Photo Frame A4 (1.5 Inch)",
    category: "canvas",
    size: "A4",
    mrp: 449,
    price: 349,
    stock: 40,
    active: true,
    description: "Premium photo frame A4 size | 1.5 Inch thick",
  },
  {
    id: "p9",
    name: "Photo Frame A4 Mount",
    category: "mount",
    size: "A4",
    mrp: 649,
    price: 499,
    stock: 30,
    active: true,
    description: "Premium photo frame A4 with mount | 1 Inch thick",
  },
  {
    id: "p10",
    name: "Photo Frame A4 Mount (1.5 Inch)",
    category: "mount",
    size: "A4",
    mrp: 749,
    price: 599,
    stock: 30,
    active: true,
    description: "Premium photo frame A4 with mount | 1.5 Inch thick",
  },
  {
    id: "p11",
    name: 'Photo Frame 12x16"',
    category: "canvas",
    size: '12x16"',
    mrp: 1199,
    price: 899,
    stock: 25,
    active: true,
    description: "Premium photo frame 12x16 inches | 1 Inch thick",
  },
  {
    id: "p12",
    name: 'Photo Frame 12x16" (1.5 Inch)',
    category: "canvas",
    size: '12x16"',
    mrp: 1399,
    price: 1099,
    stock: 25,
    active: true,
    description: "Premium photo frame 12x16 inches | 1.5 Inch thick",
  },
  {
    id: "p13",
    name: 'Photo Frame 12x18"',
    category: "canvas",
    size: '12x18"',
    mrp: 1499,
    price: 1199,
    stock: 20,
    active: true,
    description: "Premium photo frame 12x18 inches | 1 Inch thick",
  },
  {
    id: "p14",
    name: 'Photo Frame 12x18" (1.5 Inch)',
    category: "canvas",
    size: '12x18"',
    mrp: 1699,
    price: 1299,
    stock: 20,
    active: true,
    description: "Premium photo frame 12x18 inches | 1.5 Inch thick",
  },
  {
    id: "p15",
    name: 'Photo Frame 12x18" Mount',
    category: "mount",
    size: '12x18"',
    mrp: 1799,
    price: 1399,
    stock: 20,
    active: true,
    description: "Premium photo frame 12x18 with mount | 1 Inch thick",
  },
  {
    id: "p16",
    name: 'Photo Frame 12x18" Mount (1.5 Inch)',
    category: "mount",
    size: '12x18"',
    mrp: 1999,
    price: 1599,
    stock: 20,
    active: true,
    description: "Premium photo frame 12x18 with mount | 1.5 Inch thick",
  },
  {
    id: "p17",
    name: 'Photo Frame 18x24"',
    category: "canvas",
    size: '18x24"',
    mrp: 2399,
    price: 1899,
    stock: 15,
    active: true,
    description: "Premium photo frame 18x24 inches | 1 Inch thick",
  },
  {
    id: "p18",
    name: 'Photo Frame 18x24" (1.5 Inch)',
    category: "canvas",
    size: '18x24"',
    mrp: 2799,
    price: 2199,
    stock: 15,
    active: true,
    description: "Premium photo frame 18x24 inches | 1.5 Inch thick",
  },
  {
    id: "p19",
    name: 'Photo Frame 18x24" Mount',
    category: "mount",
    size: '18x24"',
    mrp: 2899,
    price: 2299,
    stock: 15,
    active: true,
    description: "Premium photo frame 18x24 with mount | 1 Inch thick",
  },
  {
    id: "p20",
    name: 'Photo Frame 18x24" Mount (1.5 Inch)',
    category: "mount",
    size: '18x24"',
    mrp: 3299,
    price: 2599,
    stock: 15,
    active: true,
    description: "Premium photo frame 18x24 with mount | 1.5 Inch thick",
  },
];

const DEFAULT_SETTINGS: Settings = {
  storeName: "The Digital Gallery by Emon",
  adminPassword: "Emon2026",
  whatsapp: "9365246096",
  upiId: "digitalgallery@upi",
  bankName: "State Bank of India",
  accountNumber: "XXXXXXXXXXXX",
  ifsc: "SBIN0000000",
  accountName: "The Digital Gallery by Emon",
  popupEnabled: false,
  popupText: "30% OFF ON ALL COLLAGES",
  popupSubtext: "Limited time offer. Grab it now!",
  popupCode: "TDGSALE25",
  popupImage: undefined,
  bannersEnabled: true,
  bannerTexts: [
    "🎉 30% OFF on all Collages | Code: TDGSALE25",
    "🚀 Fast Delivery in 3-4 Working Days",
    "📦 Free Shipping on orders above ₹999",
    "✅ 100% Refund if delivery not feasible in your area",
  ],
  advancedBanners: [
    {
      id: "ab1",
      text: "🔥 MEGA SALE: Up to 30% OFF on all photo frames!",
      type: "hero",
      bgColor: "#FED100",
      textColor: "#212121",
      active: true,
    },
    {
      id: "ab2",
      text: "📸 Gift your memories | Free delivery above ₹999",
      type: "midpage",
      bgColor: "#212121",
      textColor: "#FED100",
      active: true,
    },
    {
      id: "ab3",
      text: "🎁 Use code TDGSALE25 for 30% OFF",
      type: "popup_strip",
      bgColor: "#FED100",
      textColor: "#212121",
      active: true,
    },
  ],
  trackingEnabled: true,
  logoText: "TDG",
  logoImage: undefined,
  qrCodeImage: undefined,
  heroSlideshowEnabled: false,
  heroSlideshowInterval: 4000,
  heroSlideshow: [],
  heroSlideshowTransition: "crossfade",
  theme: "light",
  categories: ["canvas", "mount"],
  pickupCities: ["Basugaon", "Kokrajhar", "Bongaigaon", "Barpeta Road"],
  announcementBar:
    "Free Shipping on orders above ₹999 | Use code TDGSALE25 for 30% OFF",
  announcementBarEnabled: true,
  midPageAdEnabled: true,
  midPageAdText: "🎁 Create the perfect gift!",
  midPageAdSubtext: "Premium photo frames delivered to your door in 3-4 days.",
  midPageAdBg: "#FED100",
  showBankDetails: true,
  showUpiDetails: true,
  shippingZones: [
    {
      id: "z1",
      name: "Local (Assam)",
      pincodePrefixes: ["781", "783", "784", "785", "786"],
      charge: 50,
    },
    {
      id: "z2",
      name: "North East India",
      pincodePrefixes: [
        "787",
        "788",
        "790",
        "791",
        "792",
        "793",
        "794",
        "795",
        "796",
        "797",
        "798",
        "799",
      ],
      charge: 80,
    },
    { id: "z3", name: "Rest of India", pincodePrefixes: [], charge: 120 },
  ],
  deliveryLocations: [
    { id: "loc1", name: "Local (within city)", charge: 0 },
    { id: "loc2", name: "Within Assam", charge: 50 },
    { id: "loc3", name: "Other States", charge: 100 },
  ],
  whatsappTemplate:
    "Namaste [Customer Name]! 🙏\nYour order with The Digital Gallery is CONFIRMED! ✅\n📦 Item: [Product Name] | 🔢 Qty: [Quantity]\n💰 Total: ₹[Net] | 💵 Advance: ₹[Advance] | 💳 Balance: ₹[Balance]\n📍 Action Required: To coordinate pickup, please share your Live Location in this chat once ready.\nLeave a Photo Review on our site for a special discount! 📸⭐️\n— The Digital Gallery by Emon",
  aboutUs:
    "The Digital Gallery by Emon is a premium photo frame studio based in Assam. We turn your cherished memories into beautiful wall art. Every frame is crafted with care and delivered to your doorstep in 3-4 working days.",
  heroBadgeText: "Premium Photo Frames",
  heroHeading: "Transform Your",
  heroHeadingAccent: "Memories",
  heroSubtext:
    "High quality photo frames, collages & more. Delivered to your doorstep in just 3-4 days.",
  heroCtaText: "Shop Custom Frames",
  aboutMe: {
    bio: "",
    tagline: "",
    experience: "",
    profilePhoto: "",
    personalInstagram: "",
    personalFacebook: "",
    personalYoutube: "",
    personalWhatsapp: "",
    businessInstagram: "",
    businessFacebook: "",
    businessYoutube: "",
    businessWhatsapp: "",
  },
  offerTimerEnabled: true,
  offerTimerText: "Flash Sale ends in:",
  frameWoodOptions: [
    { id: "fw1", name: "Teak", addonPrice: 200 },
    { id: "fw2", name: "Mango", addonPrice: 150 },
    { id: "fw3", name: "Pine", addonPrice: 100 },
    { id: "fw4", name: "MDF", addonPrice: 0 },
    { id: "fw5", name: "Bamboo", addonPrice: 120 },
  ],
  frameDesignOptions: [
    { id: "fd1", name: "Classic", addonPrice: 0 },
    { id: "fd2", name: "Modern", addonPrice: 50 },
    { id: "fd3", name: "Rustic", addonPrice: 80 },
    { id: "fd4", name: "Royal", addonPrice: 150 },
    { id: "fd5", name: "Minimal", addonPrice: 30 },
  ],
  frameStyleOptions: [
    { id: "fs1", name: "Single Border", addonPrice: 0 },
    { id: "fs2", name: "Double Border", addonPrice: 50 },
    { id: "fs3", name: "Shadow Box", addonPrice: 100 },
    { id: "fs4", name: "Floating", addonPrice: 80 },
    { id: "fs5", name: "Ornate", addonPrice: 120 },
  ],
  framePrintingOptions: [
    { id: "fp1", name: "Matte Print", addonPrice: 200 },
    { id: "fp2", name: "Glossy Print", addonPrice: 250 },
    { id: "fp3", name: "Canvas Print", addonPrice: 350 },
  ],
  frameColourOptions: [
    { id: "fc1", name: "Natural Brown", addonPrice: 0 },
    { id: "fc2", name: "Black / White", addonPrice: 0 },
    { id: "fc3", name: "Golden", addonPrice: 50 },
    { id: "fc4", name: "Matte Black", addonPrice: 30 },
  ],
  ourWorkPhotos: [],
  customFrameBaseRateCm: 3,
  customFrameBaseRateInch: 50,
  customFrameBaseRateFt: 500,
};

export function getProducts(): Product[] {
  const version = localStorage.getItem("tdg_products_version");
  if (version !== "v4") {
    localStorage.setItem("tdg_products", JSON.stringify(DEFAULT_PRODUCTS));
    localStorage.setItem("tdg_products_version", "v4");
    return DEFAULT_PRODUCTS;
  }
  const raw = localStorage.getItem("tdg_products");
  if (raw) return JSON.parse(raw);
  localStorage.setItem("tdg_products", JSON.stringify(DEFAULT_PRODUCTS));
  return DEFAULT_PRODUCTS;
}

export function saveProducts(products: Product[]) {
  try {
    localStorage.setItem("tdg_products", JSON.stringify(products));
  } catch (_e) {
    alert(
      "Storage full: images are too large. Please use smaller photos (under 200KB each) or remove some product images.",
    );
  }
}

export function getOrders(): Order[] {
  const raw = localStorage.getItem("tdg_orders");
  return raw ? JSON.parse(raw) : [];
}

export function saveOrders(orders: Order[]) {
  localStorage.setItem("tdg_orders", JSON.stringify(orders));
}

export function addOrder(order: Omit<Order, "id" | "createdAt">): Order {
  const orders = getOrders();
  const now = Date.now();
  const newOrder: Order = {
    ...order,
    id: `TDG${now.toString().slice(-6)}`,
    createdAt: new Date().toISOString(),
  };
  orders.push(newOrder);
  saveOrders(orders);
  return newOrder;
}

export function getFinance(): FinanceRecord[] {
  const raw = localStorage.getItem("tdg_finance");
  return raw ? JSON.parse(raw) : [];
}

export function saveFinance(records: FinanceRecord[]) {
  localStorage.setItem("tdg_finance", JSON.stringify(records));
}

export function getSuppliers(): Supplier[] {
  const raw = localStorage.getItem("tdg_suppliers");
  return raw ? JSON.parse(raw) : [];
}

export function saveSuppliers(suppliers: Supplier[]) {
  localStorage.setItem("tdg_suppliers", JSON.stringify(suppliers));
}

export function getSettings(): Settings {
  const raw = localStorage.getItem("tdg_settings");
  if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  localStorage.setItem("tdg_settings", JSON.stringify(DEFAULT_SETTINGS));
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: Settings) {
  localStorage.setItem("tdg_settings", JSON.stringify(settings));
}

export function getReviews(): Review[] {
  const raw = localStorage.getItem("tdg_reviews");
  return raw ? JSON.parse(raw) : [];
}

export function saveReviews(reviews: Review[]) {
  localStorage.setItem("tdg_reviews", JSON.stringify(reviews));
}

// Cart helpers
export function getCart(): CartItem[] {
  const raw = localStorage.getItem("tdg_cart");
  return raw ? JSON.parse(raw) : [];
}

export function saveCart(items: CartItem[]) {
  localStorage.setItem("tdg_cart", JSON.stringify(items));
}

export function clearCart() {
  localStorage.removeItem("tdg_cart");
}

// Customer session
export function getCustomerSession(): CustomerSession | null {
  const raw = localStorage.getItem("tdg_customer");
  return raw ? JSON.parse(raw) : null;
}

export function saveCustomerSession(session: CustomerSession) {
  localStorage.setItem("tdg_customer", JSON.stringify(session));
}

export function clearCustomerSession() {
  localStorage.removeItem("tdg_customer");
}

export function backupData() {
  const data = {
    products: getProducts(),
    orders: getOrders(),
    finance: getFinance(),
    suppliers: getSuppliers(),
    settings: getSettings(),
    reviews: getReviews(),
    exportedAt: new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `tdg-backup-${new Date().toISOString().split("T")[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export const STATUS_LABELS: Record<Order["status"], string> = {
  pending: "Order Placed",
  advance_confirmed: "Advance Confirmed",
  processing: "Processing",
  ready: "Ready for Pickup",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const PICKUP_CITIES = [
  "Basugaon",
  "Kokrajhar",
  "Bongaigaon",
  "Barpeta Road",
];

export function getShippingCharge(
  pincode: string,
  zones: ShippingZone[],
): { zone: ShippingZone | null; charge: number } {
  const prefix6 = pincode.slice(0, 6);
  const prefix3 = pincode.slice(0, 3);
  for (const zone of zones) {
    if (zone.pincodePrefixes.length === 0) continue;
    if (
      zone.pincodePrefixes.some(
        (p) => prefix6.startsWith(p) || prefix3.startsWith(p),
      )
    ) {
      return { zone, charge: zone.charge };
    }
  }
  const fallback =
    zones.find((z) => z.pincodePrefixes.length === 0) ||
    zones[zones.length - 1];
  return { zone: fallback || null, charge: fallback?.charge ?? 0 };
}

export function canCancelOrder(order: Order): boolean {
  if (order.status === "cancelled" || order.status === "delivered")
    return false;
  const created = new Date(order.createdAt).getTime();
  const now = Date.now();
  return now - created < 60 * 60 * 1000; // 60 minutes
}

export function getOrderDisplayStatus(order: Order): string {
  if (order.status === "cancelled") return "Cancelled";
  if (order.status === "delivered") return "Delivered";
  const created = new Date(order.createdAt).getTime();
  const now = Date.now();
  if (now - created >= 60 * 60 * 1000 && order.status === "pending") {
    return "Artist is Designing";
  }
  return STATUS_LABELS[order.status] || order.status;
}
