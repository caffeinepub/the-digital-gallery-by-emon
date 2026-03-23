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
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  productId: string;
  productName: string;
  size: string;
  thickness: string;
  price: number;
  advanceAmount: number;
  advancePaid: boolean;
  deliveryCharge: number;
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
  notes: string;
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
  bannersEnabled: boolean;
  bannerTexts: string[];
  advancedBanners: Banner[];
  trackingEnabled: boolean;
  logoText: string;
  theme: "light" | "dark";
  categories: string[];
  pickupCities: string[];
  announcementBar: string;
  announcementBarEnabled: boolean;
  midPageAdEnabled: boolean;
  midPageAdText: string;
  midPageAdSubtext: string;
  midPageAdBg: string;
}

const DEFAULT_PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Canvas Print",
    category: "canvas",
    size: '4x6"',
    mrp: 599,
    price: 419,
    stock: 50,
    active: true,
    description: "Premium canvas print 4x6 inches",
  },
  {
    id: "p2",
    name: "Canvas Print",
    category: "canvas",
    size: '5x7"',
    mrp: 799,
    price: 559,
    stock: 50,
    active: true,
    description: "Premium canvas print 5x7 inches",
  },
  {
    id: "p3",
    name: "Canvas Print",
    category: "canvas",
    size: '8x10"',
    mrp: 1199,
    price: 839,
    stock: 40,
    active: true,
    description: "Premium canvas print 8x10 inches",
  },
  {
    id: "p4",
    name: "Canvas Print",
    category: "canvas",
    size: '10x12"',
    mrp: 1499,
    price: 1049,
    stock: 40,
    active: true,
    description: "Premium canvas print 10x12 inches",
  },
  {
    id: "p5",
    name: "Canvas Print",
    category: "canvas",
    size: '12x16"',
    mrp: 1999,
    price: 1399,
    stock: 30,
    active: true,
    description: "Premium canvas print 12x16 inches",
  },
  {
    id: "p6",
    name: "Canvas Print",
    category: "canvas",
    size: '12x18"',
    mrp: 2199,
    price: 1539,
    stock: 30,
    active: true,
    description: "Premium canvas print 12x18 inches",
  },
  {
    id: "p7",
    name: "Canvas Print",
    category: "canvas",
    size: '14x18"',
    mrp: 2499,
    price: 1749,
    stock: 25,
    active: true,
    description: "Premium canvas print 14x18 inches",
  },
  {
    id: "p8",
    name: "Canvas Print",
    category: "canvas",
    size: '16x20"',
    mrp: 2999,
    price: 2099,
    stock: 25,
    active: true,
    description: "Premium canvas print 16x20 inches",
  },
  {
    id: "p9",
    name: "Canvas Print",
    category: "canvas",
    size: '18x24"',
    mrp: 3999,
    price: 2799,
    stock: 20,
    active: true,
    description: "Premium canvas print 18x24 inches",
  },
  {
    id: "p10",
    name: "Collage (3-in-1)",
    category: "collage",
    size: '4x6"',
    mrp: 899,
    price: 629,
    stock: 40,
    active: true,
    description: "Beautiful 3-photo collage",
  },
  {
    id: "p11",
    name: "Collage (4-in-1)",
    category: "collage",
    size: '6x8"',
    mrp: 1299,
    price: 909,
    stock: 35,
    active: true,
    description: "Beautiful 4-photo collage",
  },
  {
    id: "p12",
    name: "Collage (6-in-1)",
    category: "collage",
    size: '8x10"',
    mrp: 1799,
    price: 1259,
    stock: 30,
    active: true,
    description: "Beautiful 6-photo collage",
  },
  {
    id: "p13",
    name: "Collage (9-in-1)",
    category: "collage",
    size: '12x16"',
    mrp: 2499,
    price: 1749,
    stock: 25,
    active: true,
    description: "Beautiful 9-photo collage",
  },
  {
    id: "p14",
    name: "Custom Name Board",
    category: "special",
    size: '12x18"',
    mrp: 1599,
    price: 1119,
    stock: 20,
    active: true,
    description: "Personalized name board with photo",
  },
  {
    id: "p15",
    name: "Wedding Special",
    category: "special",
    size: '18x24"',
    mrp: 4999,
    price: 3499,
    stock: 15,
    active: true,
    description: "Premium wedding canvas print",
  },
];

const DEFAULT_SETTINGS: Settings = {
  storeName: "The Digital Gallery by Emon",
  adminPassword: "Emon2026",
  whatsapp: "9999999999",
  upiId: "digitalgallery@upi",
  bankName: "State Bank of India",
  accountNumber: "XXXXXXXXXXXX",
  ifsc: "SBIN0000000",
  accountName: "The Digital Gallery by Emon",
  popupEnabled: true,
  popupText: "30% OFF ON ALL COLLAGES",
  popupSubtext: "Limited time offer. Grab it now!",
  popupCode: "TDGSALE25",
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
      text: "🔥 MEGA SALE: Up to 30% OFF on all canvas prints!",
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
  theme: "light",
  categories: ["canvas", "collage", "special"],
  pickupCities: ["Basugaon", "Kokrajhar", "Bongaigaon", "Barpeta Road"],
  announcementBar:
    "Free Shipping on orders above ₹999 | Use code TDGSALE25 for 30% OFF",
  announcementBarEnabled: true,
  midPageAdEnabled: true,
  midPageAdText: "🎁 Create the perfect gift!",
  midPageAdSubtext: "Premium canvas prints delivered to your door in 3-4 days.",
  midPageAdBg: "#FED100",
};

export function getProducts(): Product[] {
  const raw = localStorage.getItem("tdg_products");
  if (raw) return JSON.parse(raw);
  localStorage.setItem("tdg_products", JSON.stringify(DEFAULT_PRODUCTS));
  return DEFAULT_PRODUCTS;
}

export function saveProducts(products: Product[]) {
  localStorage.setItem("tdg_products", JSON.stringify(products));
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

export function backupData() {
  const data = {
    products: getProducts(),
    orders: getOrders(),
    finance: getFinance(),
    suppliers: getSuppliers(),
    settings: getSettings(),
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
