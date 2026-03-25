import {
  Download,
  Edit2,
  Image,
  LayoutDashboard,
  Lock,
  LogOut,
  MessageCircle,
  MessageSquare,
  Minus,
  Package,
  Plus,
  Save,
  Settings,
  ShoppingBag,
  Star,
  Tag,
  Trash2,
  TrendingUp,
  Upload,
  Users,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useData } from "../lib/DataContext";
import {
  type Banner,
  type FinanceRecord,
  type Order,
  type Product,
  type Review,
  STATUS_LABELS,
  type Settings as SettingsType,
  type Supplier,
  backupData,
} from "../lib/data";

function compressImage(
  file: File,
  maxWidth = 800,
  quality = 0.7,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = Math.min(1, maxWidth / img.width);
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target!.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

type Tab =
  | "dashboard"
  | "orders"
  | "inventory"
  | "products"
  | "finance"
  | "suppliers"
  | "reviews"
  | "settings"
  | "about_me";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [tab, setTab] = useState<Tab>("dashboard");
  const {
    products,
    orders,
    finance,
    suppliers,
    settings,
    reviews,
    setProducts,
    setOrders,
    setFinance,
    setSuppliers,
    setSettings,
    setReviews,
  } = useData();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function login() {
    const s = settings;
    if (password === s.adminPassword) {
      setAuthed(true);
      setError("");
    } else setError("Incorrect password. Please try again.");
  }

  if (!authed) {
    return (
      <div className="min-h-screen bg-[#212121] flex items-center justify-center px-4 font-inter">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-8">
          <div className="text-center mb-6">
            <div className="w-14 h-14 bg-[#FED100] rounded-xl flex items-center justify-center mx-auto mb-3">
              <Lock size={24} className="text-[#212121]" />
            </div>
            <h1 className="font-playfair text-2xl font-bold text-[#212121]">
              Admin Login
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              The Digital Gallery by Emon
            </p>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            placeholder="Enter admin password"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-3 focus:outline-none focus:border-[#FED100]"
          />
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          <button
            type="button"
            onClick={login}
            className="w-full bg-[#FED100] text-[#212121] py-3 rounded-lg font-bold hover:bg-[#e6bc00]"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  const totalRevenue = orders
    .filter((o) => o.advancePaid)
    .reduce((sum, o) => sum + o.advanceAmount, 0);
  const pendingOrders = orders.filter((o) =>
    ["pending", "advance_confirmed", "processing"].includes(o.status),
  ).length;
  const lowStock = products.filter((p) => p.stock < 10).length;

  const NAV_ITEMS = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "orders", label: "Orders", icon: ShoppingBag },
    { key: "inventory", label: "Inventory", icon: Package },
    { key: "products", label: "Products", icon: Tag },
    { key: "finance", label: "Finance", icon: TrendingUp },
    { key: "suppliers", label: "Suppliers", icon: Users },
    { key: "reviews", label: "Reviews", icon: MessageSquare },
    { key: "settings", label: "Settings", icon: Settings },
    { key: "about_me", label: "About Me", icon: Users },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50 font-inter flex">
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-56 bg-[#212121] text-white flex flex-col transition-transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:relative md:flex`}
      >
        <div className="p-4 border-b border-[#333]">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#FED100] rounded flex items-center justify-center font-bold text-sm text-[#212121]">
              {settings.logoText}
            </div>
            <div className="text-sm font-semibold leading-tight">
              Admin Panel
              <br />
              <span className="text-gray-500 text-xs font-normal">TDG</span>
            </div>
          </div>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
            <button
              type="button"
              key={key}
              onClick={() => {
                setTab(key);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                tab === key
                  ? "bg-[#FED100] text-[#212121] font-bold"
                  : "text-gray-400 hover:text-white hover:bg-[#2a2c2a]"
              }`}
            >
              <Icon size={18} /> {label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-[#333]">
          <button
            type="button"
            onClick={backupData}
            className="w-full flex items-center gap-2 text-gray-400 hover:text-white text-sm py-2"
          >
            <Download size={16} /> Backup Data
          </button>
          <button
            type="button"
            onClick={() => setAuthed(false)}
            className="w-full flex items-center gap-2 text-gray-400 hover:text-white text-sm py-2"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black/50 z-20 md:hidden cursor-default"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}

      <div className="flex-1 min-w-0">
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-1"
          >
            <LayoutDashboard size={20} />
          </button>
          <h2 className="font-semibold text-gray-900 capitalize">{tab}</h2>
          <button
            type="button"
            onClick={backupData}
            className="flex items-center gap-1.5 text-sm text-[#b38b00] font-medium hover:underline"
          >
            <Download size={16} /> Backup
          </button>
        </div>

        <div className="p-4 md:p-6">
          {tab === "dashboard" && (
            <DashboardTab
              orders={orders}
              totalRevenue={totalRevenue}
              pendingOrders={pendingOrders}
              lowStock={lowStock}
            />
          )}
          {tab === "orders" && (
            <OrdersTab
              orders={orders}
              settings={settings}
              onSave={(u) => {
                setOrders(u);
              }}
            />
          )}
          {tab === "inventory" && (
            <InventoryTab
              products={products}
              onSave={(u) => {
                setProducts(u);
              }}
            />
          )}
          {tab === "products" && (
            <ProductsTab
              products={products}
              settings={settings}
              onSave={(u) => {
                setProducts(u);
              }}
              onSaveSettings={(u) => {
                setSettings(u);
              }}
            />
          )}
          {tab === "finance" && (
            <FinanceTab
              records={finance}
              onSave={(u) => {
                setFinance(u);
              }}
            />
          )}
          {tab === "suppliers" && (
            <SuppliersTab
              suppliers={suppliers}
              onSave={(u) => {
                setSuppliers(u);
              }}
            />
          )}
          {tab === "reviews" && (
            <ReviewsTab reviews={reviews} onSave={setReviews} />
          )}
          {tab === "settings" && (
            <SettingsTab
              settings={settings}
              onSave={(u) => {
                setSettings(u);
              }}
            />
          )}
          {tab === "about_me" && (
            <AboutMeTab
              settings={settings}
              onSave={(u) => {
                setSettings(u);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function DashboardTab({
  orders,
  totalRevenue,
  pendingOrders,
  lowStock,
}: {
  orders: Order[];
  totalRevenue: number;
  pendingOrders: number;
  lowStock: number;
}) {
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          {
            label: "Total Orders",
            value: orders.length,
            color: "text-[#b38b00]",
          },
          { label: "Pending", value: pendingOrders, color: "text-yellow-600" },
          {
            label: "Revenue (Advances)",
            value: `₹${totalRevenue}`,
            color: "text-green-600",
          },
          { label: "Low Stock Items", value: lowStock, color: "text-red-600" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm"
          >
            <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <h3 className="font-semibold text-sm mb-3">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b">
                <th className="pb-2 pr-4">Order ID</th>
                <th className="pb-2 pr-4">Customer</th>
                <th className="pb-2 pr-4">Product</th>
                <th className="pb-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders
                .slice(-5)
                .reverse()
                .map((o) => (
                  <tr key={o.id} className="border-b last:border-0">
                    <td className="py-2 pr-4 font-mono text-xs text-[#b38b00] font-bold">
                      {o.id}
                    </td>
                    <td className="py-2 pr-4">{o.customerName}</td>
                    <td className="py-2 pr-4 text-xs text-gray-600">
                      {o.productName}
                    </td>
                    <td className="py-2">
                      <span className="bg-[#FED100]/20 text-[#7a6600] text-xs px-2 py-0.5 rounded-full">
                        {STATUS_LABELS[o.status]}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function OrdersTab({
  orders,
  settings,
  onSave,
}: { orders: Order[]; settings: SettingsType; onSave: (o: Order[]) => void }) {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  function updateOrder(id: string, changes: Partial<Order>) {
    onSave(orders.map((o) => (o.id === id ? { ...o, ...changes } : o)));
  }

  function deleteOrder(id: string) {
    if (window.confirm("Delete this order? This cannot be undone.")) {
      onSave(orders.filter((o) => o.id !== id));
    }
  }

  function clearAllOrders() {
    if (window.confirm("Clear ALL orders? This cannot be undone.")) {
      onSave([]);
    }
  }

  const filtered = orders
    .filter((o) => filter === "all" || o.status === filter)
    .filter(
      (o) =>
        !search ||
        o.id.toLowerCase().includes(search.toLowerCase()) ||
        o.customerName.toLowerCase().includes(search.toLowerCase()) ||
        o.phone.includes(search),
    );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <input
          type="text"
          placeholder="Search by Order ID, name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded px-3 py-1.5 text-sm focus:outline-none flex-1 min-w-48"
          data-ocid="orders.search_input"
        />
        <button
          type="button"
          onClick={clearAllOrders}
          className="flex items-center gap-1 border border-red-300 text-red-500 px-3 py-1.5 rounded text-xs font-semibold hover:bg-red-50 transition-colors whitespace-nowrap"
          data-ocid="orders.clear_all.button"
        >
          <Trash2 size={13} /> Clear All Orders
        </button>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          "all",
          "pending",
          "advance_confirmed",
          "processing",
          "ready",
          "delivered",
          "cancelled",
        ].map((s) => (
          <button
            type="button"
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded-full text-xs font-medium ${filter === s ? "bg-[#FED100] text-[#212121] font-bold" : "bg-white border text-gray-600 hover:border-[#FED100]"}`}
          >
            {s === "all" ? "All" : STATUS_LABELS[s as Order["status"]]}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-xl border border-gray-100 p-4"
          >
            <div className="flex flex-wrap gap-2 justify-between items-start mb-3">
              <div>
                <div className="font-mono text-xs text-[#b38b00] font-bold">
                  {order.id}
                </div>
                <div className="font-semibold text-sm mt-0.5">
                  {order.customerName} &bull; {order.phone}
                </div>
                <div className="text-xs text-gray-500">
                  {order.productName} &bull; {order.thickness} &bull;{" "}
                  {order.pickupCity}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-[#b38b00]">₹{order.price}</div>
                <div className="text-xs text-gray-400">
                  {new Date(order.createdAt).toLocaleDateString("en-IN")}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <div className="text-xs text-gray-400 block mb-1">Status</div>
                <select
                  value={order.status}
                  onChange={(e) =>
                    updateOrder(order.id, {
                      status: e.target.value as Order["status"],
                    })
                  }
                  className="w-full text-xs border rounded px-2 py-1.5 focus:outline-none"
                >
                  {(Object.keys(STATUS_LABELS) as Order["status"][]).map(
                    (s) => (
                      <option key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </option>
                    ),
                  )}
                </select>
              </div>
              <div>
                <div className="text-xs text-gray-400 block mb-1">
                  Delivery Charge (₹)
                </div>
                <input
                  type="number"
                  value={order.deliveryCharge}
                  onChange={(e) =>
                    updateOrder(order.id, {
                      deliveryCharge: Number(e.target.value),
                    })
                  }
                  className="w-full text-xs border rounded px-2 py-1.5 focus:outline-none"
                />
              </div>
              <div>
                <div className="text-xs text-gray-400 block mb-1">
                  Expected Delivery
                </div>
                <input
                  type="text"
                  value={order.expectedDelivery}
                  onChange={(e) =>
                    updateOrder(order.id, { expectedDelivery: e.target.value })
                  }
                  className="w-full text-xs border rounded px-2 py-1.5 focus:outline-none"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={order.advancePaid}
                    onChange={(e) =>
                      updateOrder(order.id, { advancePaid: e.target.checked })
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-xs text-gray-600">
                    Advance Paid (₹{order.advanceAmount})
                  </span>
                </label>
              </div>
            </div>
            {order.notes !== undefined && (
              <div className="mt-2">
                <input
                  type="text"
                  value={order.notes}
                  placeholder="Admin notes..."
                  onChange={(e) =>
                    updateOrder(order.id, { notes: e.target.value })
                  }
                  className="w-full text-xs border rounded px-2 py-1.5 focus:outline-none text-gray-600"
                />
              </div>
            )}
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  const s = settings;
                  const tmpl = (
                    s?.whatsappTemplate ||
                    "Namaste [Customer Name]!\nOrder [Product Name] x[Quantity] confirmed.\nTotal: \u20b9[Net] | Advance: \u20b9[Advance] | Balance: \u20b9[Balance]"
                  )
                    .replace("[Customer Name]", order.customerName)
                    .replace("[Product Name]", order.productName)
                    .replace("[Quantity]", String(order.quantity || 1))
                    .replace("[Net]", String(order.price))
                    .replace("[Advance]", String(order.advanceAmount))
                    .replace(
                      "[Balance]",
                      String(order.price - order.advanceAmount),
                    );
                  window.open(
                    `https://wa.me/91${order.phone}?text=${encodeURIComponent(tmpl)}`,
                    "_blank",
                  );
                }}
                className="flex items-center gap-1.5 text-xs bg-green-50 border border-green-200 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors"
                data-ocid={"orders.whatsapp.button"}
              >
                <MessageCircle size={13} /> Send WhatsApp
              </button>
              <button
                type="button"
                onClick={() => deleteOrder(order.id)}
                className="flex items-center gap-1.5 text-xs bg-red-50 border border-red-200 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors"
                data-ocid={"orders.delete_button"}
              >
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-10 text-gray-400">No orders found</div>
        )}
      </div>
    </div>
  );
}

function InventoryTab({
  products,
  onSave,
}: { products: Product[]; onSave: (p: Product[]) => void }) {
  function update(id: string, changes: Partial<Product>) {
    onSave(products.map((p) => (p.id === id ? { ...p, ...changes } : p)));
  }
  return (
    <div className="space-y-3">
      {products.map((p) => (
        <div
          key={p.id}
          className={`bg-white rounded-xl border p-4 ${!p.active ? "opacity-60" : "border-gray-100"}`}
        >
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div>
              <div className="font-semibold text-sm">
                {p.name} {p.size}
              </div>
              <div className="text-xs text-gray-400 capitalize">
                {p.category}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <div className="text-xs text-gray-400 mb-1">MRP</div>
                <input
                  type="number"
                  value={p.mrp}
                  onChange={(e) =>
                    update(p.id, { mrp: Number(e.target.value) })
                  }
                  className="w-20 text-sm border rounded px-2 py-1 focus:outline-none"
                />
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Price</div>
                <input
                  type="number"
                  value={p.price}
                  onChange={(e) =>
                    update(p.id, { price: Number(e.target.value) })
                  }
                  className="w-20 text-sm border rounded px-2 py-1 focus:outline-none"
                />
              </div>
              <div>
                <div className="text-xs text-gray-400 mb-1">Stock</div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      update(p.id, { stock: Math.max(0, p.stock - 1) })
                    }
                    className="w-7 h-7 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                  >
                    <Minus size={12} />
                  </button>
                  <span
                    className={`w-10 text-center text-sm font-semibold ${p.stock < 10 ? "text-red-600" : "text-gray-900"}`}
                  >
                    {p.stock}
                  </span>
                  <button
                    type="button"
                    onClick={() => update(p.id, { stock: p.stock + 1 })}
                    className="w-7 h-7 rounded bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={p.active}
                  onChange={(e) => update(p.id, { active: e.target.checked })}
                  className="w-4 h-4"
                />
                <span className="text-xs text-gray-600">Active</span>
              </label>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ProductsTab({
  products,
  settings,
  onSave,
  onSaveSettings,
}: {
  products: Product[];
  settings: SettingsType;
  onSave: (p: Product[]) => void;
  onSaveSettings: (s: SettingsType) => void;
}) {
  const [editId, setEditId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newCat, setNewCat] = useState("");
  const [form, setForm] = useState<Partial<Product>>({});

  const EMPTY: Partial<Product> = {
    name: "",
    category: settings.categories?.[0] || "canvas",
    size: "",
    mrp: 0,
    price: 0,
    stock: 50,
    active: true,
    description: "",
    images: [],
  };

  function startEdit(p: Product) {
    setEditId(p.id);
    setForm({ ...p });
    setShowAdd(false);
  }

  function startAdd() {
    setForm({ ...EMPTY });
    setEditId(null);
    setShowAdd(true);
  }

  function saveProduct() {
    if (!form.name || !form.size) return;
    if (showAdd) {
      const newP: Product = {
        id: `p${Date.now()}`,
        name: form.name || "",
        category: form.category || "canvas",
        size: form.size || "",
        mrp: form.mrp || 0,
        price: form.price || 0,
        stock: form.stock || 50,
        active: form.active !== false,
        description: form.description || "",
        image: form.images?.[0] || form.image,
        images: form.images || (form.image ? [form.image] : []),
        highlights: form.highlights || [],
      };
      onSave([...products, newP]);
    } else if (editId) {
      onSave(
        products.map((p) =>
          p.id === editId ? ({ ...p, ...form } as Product) : p,
        ),
      );
    }
    setEditId(null);
    setShowAdd(false);
    setForm({});
  }

  function deleteProduct(id: string) {
    if (window.confirm("Delete this product?")) {
      onSave(products.filter((p) => p.id !== id));
    }
  }

  function addCategory() {
    if (!newCat.trim()) return;
    const cats = [...(settings.categories || []), newCat.trim().toLowerCase()];
    onSaveSettings({ ...settings, categories: cats });
    setNewCat("");
  }

  function removeCategory(cat: string) {
    onSaveSettings({
      ...settings,
      categories: (settings.categories || []).filter((c) => c !== cat),
    });
  }

  const categories = settings.categories || ["canvas", "collage", "special"];

  return (
    <div>
      {/* Category Manager */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-5">
        <h3 className="font-semibold text-sm mb-3">Manage Categories</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {categories.map((cat) => (
            <span
              key={cat}
              className="flex items-center gap-1 bg-[#FED100]/20 text-[#7a6600] text-xs px-3 py-1.5 rounded-full capitalize font-medium"
            >
              {cat}
              <button
                type="button"
                onClick={() => removeCategory(cat)}
                className="ml-1 text-red-400 hover:text-red-600"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            placeholder="New category name"
            onKeyDown={(e) => e.key === "Enter" && addCategory()}
            className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none"
          />
          <button
            type="button"
            onClick={addCategory}
            className="bg-[#FED100] text-[#212121] px-4 py-2 rounded text-sm font-bold hover:bg-[#e6bc00]"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Product Form */}
      {(showAdd || editId) && (
        <div className="bg-white rounded-xl border-2 border-[#FED100] p-5 mb-5">
          <h3 className="font-semibold text-sm mb-4">
            {showAdd ? "Add New Product" : "Edit Product"}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="col-span-2 md:col-span-1">
              <div className="text-xs text-gray-500 block mb-1">
                Product Name *
              </div>
              <input
                value={form.name || ""}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none"
                placeholder="e.g. Photo Frame"
              />
            </div>
            <div>
              <div className="text-xs text-gray-500 block mb-1">Category *</div>
              <select
                value={form.category || ""}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <div className="text-xs text-gray-500 block mb-1">Size *</div>
              <input
                value={form.size || ""}
                onChange={(e) => setForm({ ...form, size: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none"
                placeholder='e.g. 8x10"'
              />
            </div>
            <div>
              <div className="text-xs text-gray-500 block mb-1">MRP (₹)</div>
              <input
                type="number"
                value={form.mrp || ""}
                onChange={(e) =>
                  setForm({ ...form, mrp: Number(e.target.value) })
                }
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none"
              />
            </div>
            <div>
              <div className="text-xs text-gray-500 block mb-1">
                Selling Price (₹)
              </div>
              <input
                type="number"
                value={form.price || ""}
                onChange={(e) =>
                  setForm({ ...form, price: Number(e.target.value) })
                }
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none"
              />
            </div>
            <div>
              <div className="text-xs text-gray-500 block mb-1">Stock</div>
              <input
                type="number"
                value={form.stock ?? ""}
                onChange={(e) =>
                  setForm({ ...form, stock: Number(e.target.value) })
                }
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none"
              />
            </div>
            <div className="col-span-2">
              <div className="text-xs text-gray-500 block mb-1">
                Description
              </div>
              <input
                value={form.description || ""}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none"
              />
            </div>
            <div className="col-span-2 md:col-span-3">
              <div className="text-xs text-gray-500 block mb-1">
                Product Highlights (max 6 bullet points)
              </div>
              <div className="space-y-2">
                {(form.highlights || []).map((h: string, hi: number) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: static list
                  <div key={hi} className="flex gap-2 items-center">
                    <span className="text-[#FED100] text-sm">✓</span>
                    <input
                      value={h}
                      onChange={(e) => {
                        const updated = [...(form.highlights || [])];
                        updated[hi] = e.target.value;
                        setForm({ ...form, highlights: updated });
                      }}
                      className="flex-1 border rounded px-3 py-1.5 text-xs focus:outline-none focus:border-[#FED100]"
                      placeholder="e.g. Premium quality wood frame"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const updated = (form.highlights || []).filter(
                          (_: string, i: number) => i !== hi,
                        );
                        setForm({ ...form, highlights: updated });
                      }}
                      className="text-red-400 hover:text-red-600"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
                {(form.highlights || []).length < 6 && (
                  <button
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        highlights: [...(form.highlights || []), ""],
                      })
                    }
                    className="text-xs text-[#b38b00] hover:underline flex items-center gap-1"
                  >
                    <Plus size={12} /> Add Highlight
                  </button>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.active !== false}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="w-4 h-4"
                id="prod-active"
              />
              <label
                htmlFor="prod-active"
                className="text-sm text-gray-600 cursor-pointer"
              >
                Active (visible to customers)
              </label>
            </div>
            <div className="col-span-2 md:col-span-3">
              <div className="text-xs text-gray-500 block mb-2">
                Product Images (up to 5 slots, auto-compressed, JPG/PNG/WEBP)
              </div>
              <div className="flex flex-wrap gap-3">
                {[0, 1, 2, 3, 4].map((slotIdx) => {
                  const imgs = form.images || [];
                  const slotImg = imgs[slotIdx];
                  return (
                    <div
                      key={slotIdx}
                      className="flex flex-col items-center gap-1"
                    >
                      {slotImg ? (
                        <div className="relative">
                          <img
                            src={slotImg}
                            alt={`Slot ${slotIdx + 1}`}
                            className="w-16 h-16 object-cover rounded border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newImgs = [...(form.images || [])];
                              newImgs.splice(slotIdx, 1);
                              setForm({
                                ...form,
                                images: newImgs,
                                image: newImgs[0],
                              });
                            }}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center"
                          >
                            <X size={8} />
                          </button>
                        </div>
                      ) : (
                        <label className="cursor-pointer w-16 h-16 border-2 border-dashed border-gray-300 rounded flex items-center justify-center hover:border-[#FED100] transition-colors">
                          <Upload size={14} className="text-gray-400" />
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              compressImage(file).then((compressed) => {
                                const newImgs = [...(form.images || [])];
                                newImgs[slotIdx] = compressed;
                                setForm({
                                  ...form,
                                  images: newImgs,
                                  image: newImgs[0],
                                });
                              });
                            }}
                          />
                        </label>
                      )}
                      <span className="text-xs text-gray-400">
                        {slotIdx === 0 ? "Main" : `#${slotIdx + 1}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={saveProduct}
              className="bg-[#FED100] text-[#212121] px-5 py-2 rounded-lg text-sm font-bold hover:bg-[#e6bc00] flex items-center gap-2"
            >
              <Save size={15} /> Save Product
            </button>
            <button
              type="button"
              onClick={() => {
                setEditId(null);
                setShowAdd(false);
                setForm({});
              }}
              className="border border-gray-300 px-5 py-2 rounded-lg text-sm hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">All Products ({products.length})</h3>
        <button
          type="button"
          onClick={startAdd}
          className="flex items-center gap-2 bg-[#FED100] text-[#212121] px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#e6bc00]"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="space-y-2">
        {products.map((p) => (
          <div
            key={p.id}
            className={`bg-white rounded-xl border p-4 flex items-center justify-between gap-3 ${!p.active ? "opacity-60" : "border-gray-100"}`}
          >
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm">
                {p.name} {p.size}
              </div>
              <div className="text-xs text-gray-400 capitalize">
                {p.category} &bull; MRP ₹{p.mrp} &bull; Price ₹{p.price} &bull;
                Stock: {p.stock}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">
                {p.description}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${p.active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-400"}`}
              >
                {p.active ? "Active" : "Off"}
              </span>
              <button
                type="button"
                onClick={() => startEdit(p)}
                className="p-1.5 text-[#b38b00] hover:bg-yellow-50 rounded"
              >
                <Edit2 size={15} />
              </button>
              <button
                type="button"
                onClick={() => deleteProduct(p.id)}
                className="p-1.5 text-red-400 hover:bg-red-50 rounded"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FinanceTab({
  records,
  onSave,
}: { records: FinanceRecord[]; onSave: (r: FinanceRecord[]) => void }) {
  const [form, setForm] = useState({
    month: new Date().toLocaleString("default", { month: "long" }),
    year: new Date().getFullYear(),
    sales: 0,
    discounts: 0,
    investments: 0,
  });

  function addRecord() {
    onSave([...records, { ...form, id: `fin${Date.now()}` }]);
    setForm({ ...form, sales: 0, discounts: 0, investments: 0 });
  }

  const totalSales = records.reduce((s, r) => s + r.sales, 0);
  const totalInv = records.reduce((s, r) => s + r.investments, 0);
  const netProfit = totalSales - totalInv;

  return (
    <div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="text-xs text-gray-400">Total Sales</div>
          <div className="text-xl font-bold text-green-600">₹{totalSales}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="text-xs text-gray-400">Total Investment</div>
          <div className="text-xl font-bold text-red-500">₹{totalInv}</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="text-xs text-gray-400">Net Profit</div>
          <div
            className={`text-xl font-bold ${netProfit >= 0 ? "text-[#b38b00]" : "text-red-600"}`}
          >
            ₹{netProfit}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
        <h3 className="font-semibold text-sm mb-3">Add Monthly Record</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <input
            type="text"
            placeholder="Month"
            value={form.month}
            onChange={(e) => setForm({ ...form, month: e.target.value })}
            className="border rounded px-3 py-2 text-sm focus:outline-none"
          />
          <input
            type="number"
            placeholder="Year"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
            className="border rounded px-3 py-2 text-sm focus:outline-none"
          />
          <input
            type="number"
            placeholder="Sales (₹)"
            value={form.sales || ""}
            onChange={(e) =>
              setForm({ ...form, sales: Number(e.target.value) })
            }
            className="border rounded px-3 py-2 text-sm focus:outline-none"
          />
          <input
            type="number"
            placeholder="Discounts (₹)"
            value={form.discounts || ""}
            onChange={(e) =>
              setForm({ ...form, discounts: Number(e.target.value) })
            }
            className="border rounded px-3 py-2 text-sm focus:outline-none"
          />
          <input
            type="number"
            placeholder="Investments (₹)"
            value={form.investments || ""}
            onChange={(e) =>
              setForm({ ...form, investments: Number(e.target.value) })
            }
            className="border rounded px-3 py-2 text-sm focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={addRecord}
          className="mt-3 bg-[#FED100] text-[#212121] px-5 py-2 rounded-lg text-sm font-bold hover:bg-[#e6bc00]"
        >
          Add Record
        </button>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-400 text-xs">
            <tr>
              <th className="text-left p-3">Month</th>
              <th className="text-right p-3">Sales</th>
              <th className="text-right p-3">Discounts</th>
              <th className="text-right p-3">Investments</th>
              <th className="text-right p-3">Net Profit</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-3 font-medium">
                  {r.month} {r.year}
                </td>
                <td className="p-3 text-right text-green-600">₹{r.sales}</td>
                <td className="p-3 text-right text-yellow-600">
                  ₹{r.discounts}
                </td>
                <td className="p-3 text-right text-red-500">
                  ₹{r.investments}
                </td>
                <td
                  className={`p-3 text-right font-bold ${r.sales - r.investments >= 0 ? "text-[#b38b00]" : "text-red-600"}`}
                >
                  ₹{r.sales - r.investments}
                </td>
                <td className="p-3">
                  <button
                    type="button"
                    onClick={() => onSave(records.filter((x) => x.id !== r.id))}
                    className="text-red-400 hover:text-red-600"
                  >
                    <X size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SuppliersTab({
  suppliers,
  onSave,
}: { suppliers: Supplier[]; onSave: (s: Supplier[]) => void }) {
  const [newName, setNewName] = useState("");
  const [newContact, setNewContact] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [txType, setTxType] = useState<"purchase" | "payment">("purchase");

  function addSupplier() {
    if (!newName) return;
    onSave([
      ...suppliers,
      {
        id: `sup${Date.now()}`,
        name: newName,
        contact: newContact,
        totalPurchased: 0,
        totalPaid: 0,
        transactions: [],
      },
    ]);
    setNewName("");
    setNewContact("");
  }

  function addTransaction() {
    const amt = Number(amount);
    if (!selected || !amt) return;
    onSave(
      suppliers.map((s) => {
        if (s.id !== selected) return s;
        return {
          ...s,
          totalPurchased:
            txType === "purchase" ? s.totalPurchased + amt : s.totalPurchased,
          totalPaid: txType === "payment" ? s.totalPaid + amt : s.totalPaid,
          transactions: [
            ...s.transactions,
            {
              date: new Date().toLocaleDateString("en-IN"),
              type: txType,
              amount: amt,
              note,
            },
          ],
        };
      }),
    );
    setAmount("");
    setNote("");
  }

  return (
    <div>
      <div className="bg-white rounded-xl border border-gray-100 p-4 mb-4">
        <h3 className="font-semibold text-sm mb-3">Add Supplier</h3>
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            placeholder="Supplier name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="border rounded px-3 py-2 text-sm focus:outline-none flex-1 min-w-32"
          />
          <input
            type="text"
            placeholder="Contact"
            value={newContact}
            onChange={(e) => setNewContact(e.target.value)}
            className="border rounded px-3 py-2 text-sm focus:outline-none flex-1 min-w-32"
          />
          <button
            type="button"
            onClick={addSupplier}
            className="bg-[#FED100] text-[#212121] px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#e6bc00]"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {suppliers.map((s) => (
          <button
            type="button"
            key={s.id}
            className={`bg-white rounded-xl border p-4 cursor-pointer text-left w-full ${selected === s.id ? "border-[#FED100]" : "border-gray-100 hover:border-gray-300"}`}
            onClick={() => setSelected(selected === s.id ? null : s.id)}
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="font-semibold">{s.name}</div>
                <div className="text-xs text-gray-500">{s.contact}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">Balance</div>
                <div
                  className={`font-bold ${s.totalPurchased - s.totalPaid > 0 ? "text-red-500" : "text-green-600"}`}
                >
                  ₹{s.totalPurchased - s.totalPaid}
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-2 text-xs text-gray-500">
              <span>Purchased: ₹{s.totalPurchased}</span>
              <span>Paid: ₹{s.totalPaid}</span>
            </div>
            {selected === s.id && (
              <div
                className="mt-3 border-t pt-3"
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              >
                <div className="flex flex-wrap gap-2 mb-2">
                  <select
                    value={txType}
                    onChange={(e) =>
                      setTxType(e.target.value as "purchase" | "payment")
                    }
                    className="border rounded px-2 py-1.5 text-xs"
                  >
                    <option value="purchase">Purchase</option>
                    <option value="payment">Payment</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="border rounded px-2 py-1.5 text-xs w-24"
                  />
                  <input
                    type="text"
                    placeholder="Note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className="border rounded px-2 py-1.5 text-xs flex-1 min-w-24"
                  />
                  <button
                    type="button"
                    onClick={addTransaction}
                    className="bg-[#FED100] text-[#212121] px-3 py-1.5 rounded text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
                <div className="max-h-32 overflow-y-auto space-y-1">
                  {s.transactions
                    .slice()
                    .reverse()
                    .map((tx, i) => (
                      <div
                        key={`tx-${i}-${tx.type}`}
                        className="flex justify-between text-xs py-1 border-b last:border-0"
                      >
                        <span
                          className={
                            tx.type === "purchase"
                              ? "text-red-500"
                              : "text-green-600"
                          }
                        >
                          {tx.type}
                          {tx.note && ` - ${tx.note}`}
                        </span>
                        <span className="font-medium">
                          ₹{tx.amount}{" "}
                          <span className="text-gray-400">{tx.date}</span>
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

function SettingsTab({
  settings,
  onSave,
}: { settings: SettingsType; onSave: (s: SettingsType) => void }) {
  const [form, setForm] = useState(settings);
  const [saved, setSaved] = useState(false);
  const [newBanner, setNewBanner] = useState("");
  const [newCity, setNewCity] = useState("");

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  function save() {
    onSave(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function updateAdvancedBanner(id: string, changes: Partial<Banner>) {
    setForm({
      ...form,
      advancedBanners: (form.advancedBanners || []).map((b) =>
        b.id === id ? { ...b, ...changes } : b,
      ),
    });
  }

  function addAdvancedBanner() {
    const nb: Banner = {
      id: `ab${Date.now()}`,
      text: "New banner text",
      type: "ticker",
      bgColor: "#FED100",
      textColor: "#212121",
      active: true,
    };
    setForm({
      ...form,
      advancedBanners: [...(form.advancedBanners || []), nb],
    });
  }

  function removeAdvancedBanner(id: string) {
    setForm({
      ...form,
      advancedBanners: (form.advancedBanners || []).filter((b) => b.id !== id),
    });
  }

  return (
    <div className="space-y-6">
      {/* Theme */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="font-semibold mb-4">Theme</h3>
        <div className="flex gap-3">
          {(["light", "dark"] as const).map((t) => (
            <button
              type="button"
              key={t}
              onClick={() => setForm({ ...form, theme: t })}
              className={`flex-1 py-3 rounded-lg border-2 font-semibold text-sm capitalize transition-colors ${
                form.theme === t
                  ? "border-[#FED100] bg-[#FED100]/10 text-[#7a6600]"
                  : "border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              {t === "light" ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Theme will apply when saved and page is refreshed.
        </p>
      </div>

      {/* Brand Colors */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="font-semibold mb-1">Brand Colors</h3>
        <p className="text-xs text-gray-400 mb-4">
          Customize the site color palette. Changes apply instantly after
          saving.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {(
            [
              { key: "colorBg", label: "Background", default: "#f5f5f5" },
              { key: "colorDark", label: "Dark Text", default: "#212121" },
              { key: "colorMedium", label: "Medium Dark", default: "#333533" },
              { key: "colorLight", label: "Light Gray", default: "#D6D6D6" },
              { key: "colorAmber", label: "Amber/Gold", default: "#FED100" },
              {
                key: "colorYellow",
                label: "Bright Yellow",
                default: "#FFEE32",
              },
            ] as const
          ).map(({ key, label, default: def }) => (
            <div key={key}>
              <label className="text-xs text-gray-500 block mb-1 cursor-pointer">
                {label}
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="color"
                    value={
                      (form as unknown as Record<string, string>)[key] || def
                    }
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                    className="w-10 h-10 rounded border border-gray-200 cursor-pointer"
                  />
                  <span className="text-xs font-mono text-gray-500">
                    {(form as unknown as Record<string, string>)[key] || def}
                  </span>
                </div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Identity */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="font-semibold mb-4">Store Identity</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: "storeName", label: "Store Name" },
            { key: "logoText", label: "Logo Text" },
            { key: "whatsapp", label: "WhatsApp Number" },
            { key: "upiId", label: "UPI ID" },
            { key: "bankName", label: "Bank Name" },
            { key: "accountNumber", label: "Account Number" },
            { key: "ifsc", label: "IFSC Code" },
            { key: "accountName", label: "Account Name" },
          ].map(({ key, label }) => (
            <div key={key}>
              <div className="text-xs text-gray-500 block mb-1">{label}</div>
              <input
                value={(form as unknown as Record<string, string>)[key] || ""}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-[#FED100]"
              />
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Payment Details Visibility
          </div>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <div className="font-medium text-sm">
                Show UPI Details to customers
              </div>
              <div className="text-xs text-gray-400">
                Display UPI ID in the payment popup
              </div>
            </div>
            <input
              type="checkbox"
              checked={form.showUpiDetails !== false}
              onChange={(e) =>
                setForm({ ...form, showUpiDetails: e.target.checked })
              }
              className="w-4 h-4"
            />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <div className="font-medium text-sm">
                Show Bank Transfer Details to customers
              </div>
              <div className="text-xs text-gray-400">
                Display bank name, A/C number and IFSC in the payment popup
              </div>
            </div>
            <input
              type="checkbox"
              checked={form.showBankDetails !== false}
              onChange={(e) =>
                setForm({ ...form, showBankDetails: e.target.checked })
              }
              className="w-4 h-4"
            />
          </label>
        </div>
      </div>

      {/* Announcement Bar */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Announcement Bar (Top of Site)</h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.announcementBarEnabled}
              onChange={(e) =>
                setForm({ ...form, announcementBarEnabled: e.target.checked })
              }
              className="w-4 h-4"
            />
            <span className="text-sm">
              {form.announcementBarEnabled ? "Enabled" : "Disabled"}
            </span>
          </label>
        </div>
        <input
          value={form.announcementBar || ""}
          onChange={(e) =>
            setForm({ ...form, announcementBar: e.target.value })
          }
          className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-[#FED100]"
          placeholder="e.g. Free Shipping on orders above ₹999"
        />
      </div>

      {/* Ticker Banners */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Ticker Banners (Below Navbar)</h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.bannersEnabled}
              onChange={(e) =>
                setForm({ ...form, bannersEnabled: e.target.checked })
              }
              className="w-4 h-4"
            />
            <span className="text-sm">
              {form.bannersEnabled ? "Enabled" : "Disabled"}
            </span>
          </label>
        </div>
        <div className="space-y-2 mb-3">
          {form.bannerTexts.map((b, i) => (
            <div
              key={`banner-text-${b.slice(0, 10)}-${i}`}
              className="flex gap-2"
            >
              <input
                value={b}
                onChange={(e) =>
                  setForm({
                    ...form,
                    bannerTexts: form.bannerTexts.map((x, j) =>
                      j === i ? e.target.value : x,
                    ),
                  })
                }
                className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none"
              />
              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    bannerTexts: form.bannerTexts.filter((_, j) => j !== i),
                  })
                }
                className="text-red-400 hover:text-red-600 p-2"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={newBanner}
            onChange={(e) => setNewBanner(e.target.value)}
            placeholder="New banner text"
            className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none"
          />
          <button
            type="button"
            onClick={() => {
              if (newBanner) {
                setForm({
                  ...form,
                  bannerTexts: [...form.bannerTexts, newBanner],
                });
                setNewBanner("");
              }
            }}
            className="bg-[#FED100] text-[#212121] px-4 py-2 rounded text-sm font-bold"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Advanced Banners / Ad Placements */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Advanced Banners &amp; Ads</h3>
          <button
            type="button"
            onClick={addAdvancedBanner}
            className="flex items-center gap-1 bg-[#FED100] text-[#212121] px-3 py-1.5 rounded text-xs font-bold hover:bg-[#e6bc00]"
          >
            <Plus size={14} /> Add Banner
          </button>
        </div>
        <div className="text-xs text-gray-400 mb-3">
          Types: <b>ticker</b> = below navbar, <b>hero</b> = above hero section,{" "}
          <b>midpage</b> = middle of page, <b>popup_strip</b> = inside popup
        </div>
        <div className="space-y-3">
          {(form.advancedBanners || []).map((b) => (
            <div key={b.id} className="border rounded-lg p-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
                <input
                  value={b.text}
                  onChange={(e) =>
                    updateAdvancedBanner(b.id, { text: e.target.value })
                  }
                  className="col-span-2 border rounded px-2 py-1.5 text-xs focus:outline-none"
                  placeholder="Banner text"
                />
                <select
                  value={b.type}
                  onChange={(e) =>
                    updateAdvancedBanner(b.id, {
                      type: e.target.value as Banner["type"],
                    })
                  }
                  className="border rounded px-2 py-1.5 text-xs"
                >
                  <option value="ticker">Ticker</option>
                  <option value="hero">Hero (top)</option>
                  <option value="midpage">Mid-Page</option>
                  <option value="popup_strip">Popup Strip</option>
                </select>
                <div className="flex gap-1 items-center">
                  <input
                    type="color"
                    value={b.bgColor}
                    onChange={(e) =>
                      updateAdvancedBanner(b.id, { bgColor: e.target.value })
                    }
                    className="w-8 h-8 border rounded cursor-pointer"
                    title="Background color"
                  />
                  <input
                    type="color"
                    value={b.textColor}
                    onChange={(e) =>
                      updateAdvancedBanner(b.id, { textColor: e.target.value })
                    }
                    className="w-8 h-8 border rounded cursor-pointer"
                    title="Text color"
                  />
                  <label className="flex items-center gap-1 cursor-pointer ml-1">
                    <input
                      type="checkbox"
                      checked={b.active}
                      onChange={(e) =>
                        updateAdvancedBanner(b.id, { active: e.target.checked })
                      }
                      className="w-3 h-3"
                    />
                    <span className="text-xs">{b.active ? "On" : "Off"}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => removeAdvancedBanner(b.id)}
                    className="ml-auto text-red-400 hover:text-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
              <div
                className="rounded text-xs px-3 py-1.5 font-medium"
                style={{ backgroundColor: b.bgColor, color: b.textColor }}
              >
                Preview: {b.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mid-Page Ad */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Mid-Page Ad Section</h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.midPageAdEnabled}
              onChange={(e) =>
                setForm({ ...form, midPageAdEnabled: e.target.checked })
              }
              className="w-4 h-4"
            />
            <span className="text-sm">
              {form.midPageAdEnabled ? "Enabled" : "Disabled"}
            </span>
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-gray-500 block mb-1">Headline</div>
            <input
              value={form.midPageAdText || ""}
              onChange={(e) =>
                setForm({ ...form, midPageAdText: e.target.value })
              }
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none"
            />
          </div>
          <div>
            <div className="text-xs text-gray-500 block mb-1">Subtext</div>
            <input
              value={form.midPageAdSubtext || ""}
              onChange={(e) =>
                setForm({ ...form, midPageAdSubtext: e.target.value })
              }
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none"
            />
          </div>
          <div>
            <div className="text-xs text-gray-500 block mb-1">
              Background Color
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={form.midPageAdBg || "#FED100"}
                onChange={(e) =>
                  setForm({ ...form, midPageAdBg: e.target.value })
                }
                className="w-10 h-10 border rounded cursor-pointer"
              />
              <input
                value={form.midPageAdBg || ""}
                onChange={(e) =>
                  setForm({ ...form, midPageAdBg: e.target.value })
                }
                className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Popup Settings */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Entrance Popup</h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.popupEnabled}
              onChange={(e) =>
                setForm({ ...form, popupEnabled: e.target.checked })
              }
              className="w-4 h-4"
            />
            <span className="text-sm">
              {form.popupEnabled ? "Enabled" : "Disabled"}
            </span>
          </label>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <div className="text-xs text-gray-500 block mb-1">Headline</div>
            <input
              value={form.popupText}
              onChange={(e) => setForm({ ...form, popupText: e.target.value })}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none"
            />
          </div>
          <div>
            <div className="text-xs text-gray-500 block mb-1">Subtext</div>
            <input
              value={form.popupSubtext}
              onChange={(e) =>
                setForm({ ...form, popupSubtext: e.target.value })
              }
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none"
            />
          </div>
          <div>
            <div className="text-xs text-gray-500 block mb-1">Coupon Code</div>
            <input
              value={form.popupCode}
              onChange={(e) => setForm({ ...form, popupCode: e.target.value })}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none"
            />
          </div>
        </div>
        {/* Popup Banner Image Upload */}
        <div className="mt-4">
          <div className="text-xs text-gray-500 block mb-2 font-medium">
            Popup Banner Image (1:1 square, JPG/PNG)
          </div>
          <div className="flex items-start gap-4">
            {form.popupImage ? (
              <div className="relative">
                <img
                  src={form.popupImage}
                  alt="Popup preview"
                  className="w-32 h-32 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => setForm({ ...form, popupImage: undefined })}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                >
                  ×
                </button>
              </div>
            ) : (
              <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400 text-xs text-center">
                No image
              </div>
            )}
            <div>
              <label className="cursor-pointer inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm px-4 py-2 rounded-lg">
                <Upload size={14} /> Upload Image
                <input
                  type="file"
                  accept="image/jpeg,image/png"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) =>
                      setForm({
                        ...form,
                        popupImage: ev.target?.result as string,
                      });
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
              <p className="text-xs text-gray-400 mt-1">
                1:1 square, JPG/PNG, max 2MB
              </p>
              <p className="text-xs text-gray-400">
                When set, image replaces the icon in the popup
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pickup Cities */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="font-semibold mb-4">Pickup Cities</h3>
        <div className="flex flex-wrap gap-2 mb-3">
          {(form.pickupCities || []).map((city) => (
            <span
              key={city}
              className="flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full"
            >
              {city}
              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    pickupCities: (form.pickupCities || []).filter(
                      (c) => c !== city,
                    ),
                  })
                }
                className="text-red-400 hover:text-red-600 ml-1"
              >
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={newCity}
            onChange={(e) => setNewCity(e.target.value)}
            placeholder="Add city"
            onKeyDown={(e) => {
              if (e.key === "Enter" && newCity) {
                setForm({
                  ...form,
                  pickupCities: [...(form.pickupCities || []), newCity],
                });
                setNewCity("");
              }
            }}
            className="flex-1 border rounded px-3 py-2 text-sm focus:outline-none"
          />
          <button
            type="button"
            onClick={() => {
              if (newCity) {
                setForm({
                  ...form,
                  pickupCities: [...(form.pickupCities || []), newCity],
                });
                setNewCity("");
              }
            }}
            className="bg-[#FED100] text-[#212121] px-4 py-2 rounded text-sm font-bold"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>

      {/* Feature toggles */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="font-semibold mb-4">Feature Toggles</h3>
        <div className="space-y-3">
          {[
            {
              key: "trackingEnabled",
              label: "Order Tracking",
              desc: "Allow customers to track orders by Order ID",
            },
          ].map(({ key, label, desc }) => (
            <label
              key={key}
              className="flex items-center justify-between cursor-pointer"
            >
              <div>
                <div className="font-medium text-sm">{label}</div>
                <div className="text-xs text-gray-400">{desc}</div>
              </div>
              <input
                type="checkbox"
                checked={form[key as keyof SettingsType] as boolean}
                onChange={(e) => setForm({ ...form, [key]: e.target.checked })}
                className="w-4 h-4"
              />
            </label>
          ))}
        </div>
      </div>

      {/* Logo & Branding */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="font-semibold mb-1 flex items-center gap-2">
          <Image size={16} /> Logo &amp; Branding
        </h3>
        <p className="text-xs text-gray-400 mb-4">
          This image will appear in the navbar instead of the logo text
        </p>
        <div className="flex items-center gap-4 flex-wrap">
          <label className="cursor-pointer flex items-center gap-2 bg-gray-50 border border-dashed border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-600 hover:border-[#FED100] transition-colors">
            <Upload size={14} /> Upload Logo (JPG/PNG)
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (file.size > 600000) {
                  alert("Image too large (max ~500KB)");
                  return;
                }
                const reader = new FileReader();
                reader.onload = () =>
                  setForm({ ...form, logoImage: reader.result as string });
                reader.readAsDataURL(file);
              }}
            />
          </label>
          {form.logoImage && (
            <>
              <img
                src={form.logoImage}
                alt="Logo preview"
                className="object-contain rounded border border-gray-200"
                style={{ maxHeight: 100 }}
              />
              <button
                type="button"
                onClick={() => setForm({ ...form, logoImage: undefined })}
                className="text-red-400 hover:text-red-600 text-xs"
              >
                Remove
              </button>
            </>
          )}
        </div>
      </div>

      {/* Payment QR Code */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="font-semibold mb-1 flex items-center gap-2">
          <Image size={16} /> Payment QR Code
        </h3>
        <p className="text-xs text-gray-400 mb-4">
          This QR code will be shown in the payment popup
        </p>
        <div className="flex items-center gap-4 flex-wrap">
          <label className="cursor-pointer flex items-center gap-2 bg-gray-50 border border-dashed border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-600 hover:border-[#FED100] transition-colors">
            <Upload size={14} /> Upload QR Code (JPG/PNG)
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if (file.size > 600000) {
                  alert("Image too large (max ~500KB)");
                  return;
                }
                const reader = new FileReader();
                reader.onload = () =>
                  setForm({ ...form, qrCodeImage: reader.result as string });
                reader.readAsDataURL(file);
              }}
            />
          </label>
          {form.qrCodeImage && (
            <>
              <img
                src={form.qrCodeImage}
                alt="QR Code preview"
                className="object-contain rounded border border-gray-200"
                style={{ maxHeight: 150 }}
              />
              <button
                type="button"
                onClick={() => setForm({ ...form, qrCodeImage: undefined })}
                className="text-red-400 hover:text-red-600 text-xs"
              >
                Remove
              </button>
            </>
          )}
        </div>
      </div>

      {/* Header Slideshow */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Image size={16} /> Header Slideshow
          </h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.heroSlideshowEnabled || false}
              onChange={(e) =>
                setForm({ ...form, heroSlideshowEnabled: e.target.checked })
              }
              className="w-4 h-4"
            />
            <span className="text-sm">
              {form.heroSlideshowEnabled ? "Enabled" : "Disabled"}
            </span>
          </label>
        </div>
        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-1">Slide Interval</div>
          <select
            value={form.heroSlideshowInterval || 4000}
            onChange={(e) =>
              setForm({
                ...form,
                heroSlideshowInterval: Number(e.target.value),
              })
            }
            className="border rounded px-3 py-2 text-sm focus:outline-none"
          >
            <option value={2000}>2 seconds</option>
            <option value={4000}>4 seconds</option>
            <option value={6000}>6 seconds</option>
            <option value={8000}>8 seconds</option>
          </select>
        </div>
        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-1">Transition Effect</div>
          <select
            value={form.heroSlideshowTransition || "crossfade"}
            onChange={(e) =>
              setForm({
                ...form,
                heroSlideshowTransition: e.target.value as
                  | "crossfade"
                  | "slide",
              })
            }
            className="border rounded px-3 py-2 text-sm focus:outline-none"
          >
            <option value="crossfade">Crossfade</option>
            <option value="slide">Slide (Left to Right)</option>
          </select>
        </div>
        <div className="mb-3">
          <div className="text-xs text-gray-400 mb-2">
            Up to 5 banners · 1200x628 px · Max 2MB each
          </div>
          <label
            className={`cursor-pointer inline-flex items-center gap-2 bg-[#FED100]/10 border border-[#FED100]/40 text-[#7a6600] rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#FED100]/20 transition-colors ${(form.heroSlideshow || []).length >= 5 ? "opacity-50 pointer-events-none" : ""}`}
          >
            <Upload size={14} />{" "}
            {(form.heroSlideshow || []).length >= 5
              ? "Max 5 banners reached"
              : "Upload Slide Image"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                if ((form.heroSlideshow || []).length >= 5) {
                  alert("Maximum 5 banners allowed. Remove one first.");
                  return;
                }
                if (file.size > 2000000) {
                  alert("Image too large (max 2MB per slide)");
                  return;
                }
                const reader = new FileReader();
                reader.onload = () => {
                  const newSlide = {
                    id: `slide${Date.now()}`,
                    image: reader.result as string,
                  };
                  setForm({
                    ...form,
                    heroSlideshow: [...(form.heroSlideshow || []), newSlide],
                  });
                };
                reader.readAsDataURL(file);
              }}
            />
          </label>
        </div>
        {(form.heroSlideshow || []).length === 0 && (
          <p className="text-xs text-gray-400">
            No slides added yet. Upload images above.
          </p>
        )}
        <div className="flex flex-wrap gap-3 mt-2">
          {(form.heroSlideshow || []).map((slide, idx) => (
            <div key={slide.id} className="relative group">
              <img
                src={slide.image}
                alt={`Slide ${idx + 1}`}
                className="h-16 w-24 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    heroSlideshow: (form.heroSlideshow || []).filter(
                      (s) => s.id !== slide.id,
                    ),
                  })
                }
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={10} />
              </button>
              <div className="text-xs text-center text-gray-400 mt-0.5">
                #{idx + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Password */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="font-semibold mb-4">Admin Password</h3>
        <input
          type="password"
          value={form.adminPassword}
          onChange={(e) => setForm({ ...form, adminPassword: e.target.value })}
          className="w-full border rounded px-3 py-2 text-sm focus:outline-none max-w-xs"
        />
      </div>

      {/* Hero Header Texts */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="font-semibold mb-1">Hero Header Texts</h3>
        <p className="text-xs text-gray-400 mb-4">
          Customize the text displayed in the homepage hero section.
        </p>
        <div className="space-y-3">
          {[
            {
              key: "heroBadgeText",
              label: "Badge Text (small yellow label)",
              placeholder: "Premium Photo Frames",
            },
            {
              key: "heroHeading",
              label: "Heading Line 1",
              placeholder: "Transform Your",
            },
            {
              key: "heroHeadingAccent",
              label: "Heading Accent (shown in yellow)",
              placeholder: "Memories",
            },
            {
              key: "heroCtaText",
              label: "Primary Button Text",
              placeholder: "Shop Custom Frames",
            },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <div className="text-xs text-gray-500 mb-1">{label}</div>
              <input
                value={(form as unknown as Record<string, string>)[key] || ""}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-[#FED100]"
                placeholder={placeholder}
              />
            </div>
          ))}
          <div>
            <div className="text-xs text-gray-500 mb-1">
              Subtext (paragraph below heading)
            </div>
            <textarea
              value={form.heroSubtext || ""}
              onChange={(e) =>
                setForm({ ...form, heroSubtext: e.target.value })
              }
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-[#FED100] resize-none"
              rows={2}
              placeholder="High quality photo frames, collages & more..."
            />
          </div>
        </div>
      </div>

      {/* About Us */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="font-semibold mb-3">About Us (Homepage)</h3>
        <textarea
          value={form.aboutUs || ""}
          onChange={(e) => setForm({ ...form, aboutUs: e.target.value })}
          className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-[#FED100] resize-none"
          rows={4}
          placeholder="Write about your store..."
        />
      </div>

      {/* WhatsApp Template */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="font-semibold mb-1">
          WhatsApp Order Confirmation Template
        </h3>
        <p className="text-xs text-gray-400 mb-3">
          Variables: [Customer Name], [Product Name], [Quantity], [Net],
          [Advance], [Balance]
        </p>
        <textarea
          value={form.whatsappTemplate || ""}
          onChange={(e) =>
            setForm({ ...form, whatsappTemplate: e.target.value })
          }
          className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-[#FED100] resize-none font-mono"
          rows={7}
        />
      </div>

      {/* Delivery Locations */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">Delivery Locations & Charges</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              Customers select their location at checkout. Set charges manually.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const newLoc = {
                id: `loc${Date.now()}`,
                name: "New Location",
                charge: 100,
              };
              setForm({
                ...form,
                deliveryLocations: [...(form.deliveryLocations || []), newLoc],
              });
            }}
            className="flex items-center gap-1 bg-[#FED100] text-[#212121] px-3 py-1.5 rounded text-xs font-bold hover:bg-[#e6bc00]"
            data-ocid="settings.add_location.button"
          >
            <Plus size={14} /> Add Location
          </button>
        </div>
        <div className="space-y-3">
          {(form.deliveryLocations || []).map((loc, li) => (
            <div
              key={loc.id}
              className="border rounded-lg p-3 flex gap-3 items-end"
            >
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-1">Location Name</div>
                <input
                  value={loc.name}
                  onChange={(e) => {
                    const locs = [...(form.deliveryLocations || [])];
                    locs[li] = { ...loc, name: e.target.value };
                    setForm({ ...form, deliveryLocations: locs });
                  }}
                  className="w-full border rounded px-2 py-1.5 text-sm focus:outline-none"
                  placeholder="e.g. Local (within city)"
                  data-ocid={`settings.location_name.input.${li + 1}`}
                />
              </div>
              <div className="w-32">
                <div className="text-xs text-gray-500 mb-1">Charge (₹)</div>
                <input
                  type="number"
                  value={loc.charge}
                  onChange={(e) => {
                    const locs = [...(form.deliveryLocations || [])];
                    locs[li] = { ...loc, charge: Number(e.target.value) };
                    setForm({ ...form, deliveryLocations: locs });
                  }}
                  className="w-full border rounded px-2 py-1.5 text-sm focus:outline-none"
                  placeholder="0 = Free"
                  data-ocid={`settings.location_charge.input.${li + 1}`}
                />
              </div>
              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    deliveryLocations: (form.deliveryLocations || []).filter(
                      (_, i) => i !== li,
                    ),
                  })
                }
                className="p-2 text-red-400 hover:text-red-600"
                data-ocid={`settings.delete_location.button.${li + 1}`}
              >
                <X size={16} />
              </button>
            </div>
          ))}
          {(!form.deliveryLocations || form.deliveryLocations.length === 0) && (
            <p className="text-xs text-gray-400">
              No locations defined. Add a location above.
            </p>
          )}
        </div>
      </div>

      {/* Flash Sale Timer */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Flash Sale Timer</h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.offerTimerEnabled !== false}
              onChange={(e) =>
                setForm({ ...form, offerTimerEnabled: e.target.checked })
              }
              className="w-4 h-4"
            />
            <span className="text-sm">
              {form.offerTimerEnabled !== false ? "Timer ON" : "Timer OFF"}
            </span>
          </label>
        </div>
        <div>
          <div className="text-xs text-gray-500 block mb-1">
            Timer Label Text
          </div>
          <input
            value={form.offerTimerText || "Flash Sale ends in:"}
            onChange={(e) =>
              setForm({ ...form, offerTimerText: e.target.value })
            }
            placeholder="Flash Sale ends in:"
            className="w-full max-w-xs border rounded px-3 py-2 text-sm focus:outline-none focus:border-[#FED100]"
          />
        </div>
      </div>

      {/* Our Work Gallery */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Image size={16} /> Our Work Gallery
        </h3>
        <p className="text-xs text-gray-400 mb-4">
          Upload photos of completed frames to show on the homepage and About
          page (max 20 photos).
        </p>
        <div className="flex flex-wrap gap-3 mb-3">
          {((form as any).ourWorkPhotos || []).map(
            (photo: string, idx: number) => (
              <div key={String(idx)} className="relative group">
                <img
                  src={photo}
                  alt="Work"
                  className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => {
                    const photos = [...((form as any).ourWorkPhotos || [])];
                    photos.splice(idx, 1);
                    setForm({ ...form, ourWorkPhotos: photos } as any);
                  }}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ),
          )}
          {((form as any).ourWorkPhotos || []).length < 20 && (
            <label className="w-20 h-20 bg-[#FED100]/10 border-2 border-dashed border-[#FED100] rounded-lg flex flex-col items-center justify-center text-xs text-[#b38b00] cursor-pointer hover:bg-[#FED100]/20">
              <Upload size={16} className="mb-1" />
              Add Photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 600000) {
                    alert("Image too large (max ~500KB)");
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = () => {
                    const photos = [...((form as any).ourWorkPhotos || [])];
                    photos.push(reader.result as string);
                    setForm({ ...form, ourWorkPhotos: photos } as any);
                  };
                  reader.readAsDataURL(file);
                }}
              />
            </label>
          )}
        </div>
      </div>

      {/* Custom Frame Pricing */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="font-semibold mb-4">
          Custom Frame Pricing (Base Rates)
        </h3>
        <p className="text-xs text-gray-400 mb-4">
          Price per square unit. Final price = (W × H × rate) + add-on prices.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="rate-cm"
              className="text-xs text-gray-500 block mb-1"
            >
              ₹ per cm²
            </label>
            <input
              id="rate-cm"
              type="number"
              min="0"
              step="0.5"
              value={(form as any).customFrameBaseRateCm ?? 3}
              onChange={(e) =>
                setForm({
                  ...form,
                  customFrameBaseRateCm: Number(e.target.value),
                } as any)
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#FED100]"
            />
          </div>
          <div>
            <label
              htmlFor="rate-inch"
              className="text-xs text-gray-500 block mb-1"
            >
              ₹ per inch²
            </label>
            <input
              id="rate-inch"
              type="number"
              min="0"
              step="1"
              value={(form as any).customFrameBaseRateInch ?? 50}
              onChange={(e) =>
                setForm({
                  ...form,
                  customFrameBaseRateInch: Number(e.target.value),
                } as any)
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#FED100]"
            />
          </div>
          <div>
            <label
              htmlFor="rate-ft"
              className="text-xs text-gray-500 block mb-1"
            >
              ₹ per ft²
            </label>
            <input
              id="rate-ft"
              type="number"
              min="0"
              step="5"
              value={(form as any).customFrameBaseRateFt ?? 500}
              onChange={(e) =>
                setForm({
                  ...form,
                  customFrameBaseRateFt: Number(e.target.value),
                } as any)
              }
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#FED100]"
            />
          </div>
        </div>
      </div>

      {/* Custom Frame Options */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h3 className="font-semibold mb-4">
          Custom Frame Options (Photo Cards)
        </h3>
        <p className="text-xs text-gray-400 mb-4">
          Upload photos for each option. Set add-on price for each. These appear
          in the custom frame modal.
        </p>

        {/* Helper component for option list */}
        {(
          [
            "frameWoodOptions",
            "frameDesignOptions",
            "frameStyleOptions",
            "framePrintingOptions",
            "frameColourOptions",
          ] as const
        ).map((key) => {
          const labels: Record<string, string> = {
            frameWoodOptions: "🎨 Wood Colour",
            frameDesignOptions: "🎨 Frame Designs",
            frameStyleOptions: "✨ Frame Styles",
            framePrintingOptions: "🖨️ Printing Services",
            frameColourOptions: "🎨 Frame Colours",
          };
          const emojis: Record<string, string> = {
            frameWoodOptions: "🪵",
            frameDesignOptions: "🎨",
            frameStyleOptions: "✨",
            framePrintingOptions: "🖨️",
            frameColourOptions: "🎨",
          };
          const newNames: Record<string, string> = {
            frameWoodOptions: "New Wood",
            frameDesignOptions: "New Design",
            frameStyleOptions: "New Style",
            framePrintingOptions: "New Print",
            frameColourOptions: "New Colour",
          };
          const idPfx: Record<string, string> = {
            frameWoodOptions: "fw",
            frameDesignOptions: "fd",
            frameStyleOptions: "fs",
            framePrintingOptions: "fp",
            frameColourOptions: "fc",
          };
          const opts = ((form as any)[key] || []) as Array<{
            id: string;
            name: string;
            image?: string;
            addonPrice?: number;
          }>;
          return (
            <div key={key} className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                {labels[key]}
              </h4>
              <div className="flex flex-wrap gap-3 mb-2">
                {opts.map((opt, idx) => (
                  <div
                    key={opt.id}
                    className="flex flex-col items-center gap-1 group w-20"
                  >
                    <label className="cursor-pointer relative">
                      {opt.image ? (
                        <img
                          src={opt.image}
                          alt={opt.name}
                          className="w-16 h-16 object-cover rounded-lg border-2 border-gray-200"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-xl">
                          {emojis[key]}
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            const updated = [...opts];
                            updated[idx] = {
                              ...opt,
                              image: ev.target?.result as string,
                            };
                            setForm({ ...form, [key]: updated } as any);
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                      <span className="absolute -top-1 -right-1 bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
                        📷
                      </span>
                    </label>
                    <input
                      value={opt.name}
                      onChange={(e) => {
                        const updated = [...opts];
                        updated[idx] = { ...opt, name: e.target.value };
                        setForm({ ...form, [key]: updated } as any);
                      }}
                      className="w-16 text-xs border rounded px-1 py-0.5 text-center focus:outline-none focus:border-[#FED100]"
                      placeholder="Name"
                    />
                    <div className="flex items-center gap-0.5">
                      <span className="text-[10px] text-gray-400">+₹</span>
                      <input
                        type="number"
                        min="0"
                        value={opt.addonPrice ?? 0}
                        onChange={(e) => {
                          const updated = [...opts];
                          updated[idx] = {
                            ...opt,
                            addonPrice: Number(e.target.value),
                          };
                          setForm({ ...form, [key]: updated } as any);
                        }}
                        className="w-12 text-xs border rounded px-1 py-0.5 text-center focus:outline-none focus:border-[#FED100]"
                      />
                    </div>
                    {key !== "frameWoodOptions" &&
                      key !== "frameColourOptions" && (
                        <label className="flex items-center gap-1 cursor-pointer mt-0.5">
                          <input
                            type="checkbox"
                            checked={
                              (opt as any).blackWhiteIncompatible || false
                            }
                            onChange={(e) => {
                              const updated = [...opts];
                              updated[idx] = {
                                ...opt,
                                blackWhiteIncompatible: e.target.checked,
                              } as any;
                              setForm({ ...form, [key]: updated } as any);
                            }}
                            className="w-3 h-3"
                          />
                          <span className="text-[9px] text-red-500 leading-tight">
                            ❌ Not with B&W
                          </span>
                        </label>
                      )}
                    <button
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          [key]: opts.filter((_, i) => i !== idx),
                        } as any)
                      }
                      className="text-red-400 hover:text-red-600 text-xs"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    const updated = [
                      ...opts,
                      {
                        id: `${idPfx[key]}${Date.now()}`,
                        name: newNames[key],
                        addonPrice: 0,
                      },
                    ];
                    setForm({ ...form, [key]: updated } as any);
                  }}
                  className="w-16 h-16 bg-[#FED100]/20 border-2 border-dashed border-[#FED100] rounded-lg flex items-center justify-center text-2xl hover:bg-[#FED100]/30"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={save}
        className="flex items-center gap-2 bg-[#FED100] text-[#212121] px-6 py-3 rounded-lg font-bold hover:bg-[#e6bc00]"
      >
        <Save size={16} /> {saved ? "Saved!" : "Save All Settings"}
      </button>
    </div>
  );
}

function ReviewsTab({
  reviews,
  onSave,
}: { reviews: Review[]; onSave: (r: Review[]) => void }) {
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Review>>({});

  const EMPTY: Partial<Review> = {
    name: "",
    rating: 5,
    text: "",
    image: undefined,
    date: new Date().toISOString().split("T")[0],
    active: true,
  };

  function openAdd() {
    setForm({ ...EMPTY });
    setEditId(null);
    setShowModal(true);
  }

  function openEdit(r: Review) {
    setForm({ ...r });
    setEditId(r.id);
    setShowModal(true);
  }

  function saveReview() {
    if (!form.name || !form.text) return;
    if (editId) {
      onSave(
        reviews.map((r) =>
          r.id === editId ? ({ ...r, ...form } as Review) : r,
        ),
      );
    } else {
      const newR: Review = {
        id: `rev${Date.now()}`,
        name: form.name || "",
        rating: form.rating || 5,
        text: form.text || "",
        image: form.image,
        date: form.date || new Date().toISOString().split("T")[0],
        active: form.active !== false,
      };
      onSave([...reviews, newR]);
    }
    setShowModal(false);
    setEditId(null);
    setForm({});
  }

  function deleteReview(id: string) {
    if (window.confirm("Delete this review?")) {
      onSave(reviews.filter((r) => r.id !== id));
    }
  }

  function toggleActive(id: string, active: boolean) {
    onSave(reviews.map((r) => (r.id === id ? { ...r, active } : r)));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">All Reviews ({reviews.length})</h3>
        <button
          type="button"
          onClick={openAdd}
          data-ocid="reviews.open_modal_button"
          className="flex items-center gap-2 bg-[#FED100] text-[#212121] px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#e6bc00]"
        >
          <Plus size={16} /> Add Review
        </button>
      </div>

      {reviews.length === 0 && (
        <div
          data-ocid="reviews.empty_state"
          className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-400"
        >
          <MessageSquare size={32} className="mx-auto mb-2 opacity-30" />
          <p>No reviews yet. Add your first review above.</p>
        </div>
      )}

      <div className="space-y-3">
        {reviews.map((r, idx) => (
          <div
            key={r.id}
            data-ocid={`reviews.item.${idx + 1}`}
            className={`bg-white rounded-xl border p-4 flex items-start gap-3 ${!r.active ? "opacity-60" : "border-gray-100"}`}
          >
            {r.image && (
              <img
                src={r.image}
                alt="review"
                className="w-14 h-14 object-cover rounded-lg border border-gray-200 flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm">{r.name}</span>
                <span className="text-[#FED100] text-sm">
                  {Array.from({ length: r.rating }, (_, i) => (
                    <Star
                      key={`star-${r.id}-${i}`}
                      size={12}
                      fill="#FED100"
                      className="inline"
                    />
                  ))}
                </span>
                <span className="text-xs text-gray-400">{r.date}</span>
              </div>
              <p className="text-xs text-gray-600 line-clamp-2">{r.text}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <label className="flex items-center gap-1 cursor-pointer text-xs text-gray-500">
                <input
                  type="checkbox"
                  checked={r.active}
                  onChange={(e) => toggleActive(r.id, e.target.checked)}
                  className="w-3 h-3"
                  data-ocid={`reviews.checkbox.${idx + 1}`}
                />
                Active
              </label>
              <button
                type="button"
                onClick={() => openEdit(r)}
                data-ocid={`reviews.edit_button.${idx + 1}`}
                className="p-1.5 text-[#b38b00] hover:bg-yellow-50 rounded"
              >
                <Edit2 size={15} />
              </button>
              <button
                type="button"
                onClick={() => deleteReview(r.id)}
                data-ocid={`reviews.delete_button.${idx + 1}`}
                className="p-1.5 text-red-400 hover:bg-red-50 rounded"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          data-ocid="reviews.modal"
        >
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-semibold text-lg font-playfair">
                {editId ? "Edit Review" : "Add Review"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setForm({});
                }}
                data-ocid="reviews.close_button"
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="rev-name"
                  className="text-xs text-gray-500 block mb-1"
                >
                  Customer Name *
                </label>
                <input
                  id="rev-name"
                  value={form.name || ""}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  data-ocid="reviews.input"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#FED100]"
                  placeholder="e.g. Priya S."
                />
              </div>
              <div>
                <div className="text-xs text-gray-500 block mb-2">Rating *</div>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setForm({ ...form, rating: n })}
                      className={`w-9 h-9 rounded-lg border-2 flex items-center justify-center transition-colors ${(form.rating || 5) >= n ? "border-[#FED100] bg-[#FED100]/10 text-[#b38b00]" : "border-gray-200 text-gray-300"}`}
                    >
                      <Star
                        size={16}
                        fill={(form.rating || 5) >= n ? "#FED100" : "none"}
                      />
                    </button>
                  ))}
                  <span className="text-sm text-gray-500 self-center">
                    {form.rating || 5}/5
                  </span>
                </div>
              </div>
              <div>
                <label
                  htmlFor="rev-text"
                  className="text-xs text-gray-500 block mb-1"
                >
                  Review Text *
                </label>
                <textarea
                  id="rev-text"
                  value={form.text || ""}
                  onChange={(e) => setForm({ ...form, text: e.target.value })}
                  data-ocid="reviews.textarea"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#FED100] resize-none"
                  rows={3}
                  placeholder="Customer's review..."
                />
              </div>
              <div>
                <div className="text-xs text-gray-500 block mb-1">
                  Upload Photo / SMS Screenshot (JPG/PNG)
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <label
                    className="cursor-pointer flex items-center gap-2 bg-gray-50 border border-dashed border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-600 hover:border-[#FED100] transition-colors"
                    data-ocid="reviews.upload_button"
                  >
                    <Upload size={14} /> Upload photo/SMS screenshot
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (file.size > 1500000) {
                          alert("Image too large (max ~1.5MB)");
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = () =>
                          setForm({ ...form, image: reader.result as string });
                        reader.readAsDataURL(file);
                      }}
                    />
                  </label>
                  {form.image && (
                    <>
                      <img
                        src={form.image}
                        alt="Preview"
                        className="h-16 object-contain rounded border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, image: undefined })}
                        className="text-red-400 hover:text-red-600 text-xs"
                      >
                        Remove
                      </button>
                    </>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="rev-date"
                    className="text-xs text-gray-500 block mb-1"
                  >
                    Date
                  </label>
                  <input
                    id="rev-date"
                    type="date"
                    value={form.date || ""}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#FED100]"
                  />
                </div>
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      checked={form.active !== false}
                      onChange={(e) =>
                        setForm({ ...form, active: e.target.checked })
                      }
                      className="w-4 h-4"
                    />
                    Active (visible to customers)
                  </label>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={saveReview}
                data-ocid="reviews.save_button"
                className="flex-1 bg-[#FED100] text-[#212121] py-3 rounded-lg font-bold hover:bg-[#e6bc00] flex items-center justify-center gap-2"
              >
                <Save size={15} /> {editId ? "Update Review" : "Add Review"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setForm({});
                }}
                data-ocid="reviews.cancel_button"
                className="border border-gray-300 px-5 py-3 rounded-lg text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AboutMeTab({
  settings,
  onSave,
}: { settings: SettingsType; onSave: (s: SettingsType) => void }) {
  const [form, setForm] = useState(
    settings.aboutMe || {
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
  );
  const [saved, setSaved] = useState(false);

  function save() {
    onSave({ ...settings, aboutMe: form });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const profileSrc = form.profilePhoto || settings.logoImage || "";

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Profile Photo */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h3 className="font-semibold mb-4">Profile Photo</h3>
        <div className="flex items-center gap-5 flex-wrap">
          {profileSrc ? (
            <img
              src={profileSrc}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-[#FED100] shadow"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-[#FED100] flex items-center justify-center text-[#212121] font-bold text-2xl border-4 border-[#FED100]/40 shadow">
              {settings.logoText || "TDG"}
            </div>
          )}
          <div className="flex flex-col gap-2">
            <label className="cursor-pointer flex items-center gap-2 bg-gray-50 border border-dashed border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-600 hover:border-[#FED100] transition-colors">
              <Upload size={14} /> Upload Profile Photo
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 2000000) {
                    alert("Image too large. Max 2MB.");
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = () =>
                    setForm({ ...form, profilePhoto: reader.result as string });
                  reader.readAsDataURL(file);
                }}
              />
            </label>
            {form.profilePhoto && (
              <button
                type="button"
                onClick={() => setForm({ ...form, profilePhoto: "" })}
                className="text-red-400 hover:text-red-600 text-xs text-left"
              >
                Remove photo (use store logo)
              </button>
            )}
            {!form.profilePhoto && (
              <p className="text-xs text-gray-400">
                No photo uploaded — store logo is used as fallback.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* About Me Content */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h3 className="font-semibold">About Me Content</h3>
        <div>
          <label
            htmlFor="aboutme-tagline"
            className="text-xs text-gray-500 block mb-1"
          >
            Tagline / Short Subtitle
          </label>
          <input
            id="aboutme-tagline"
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-[#FED100]"
            placeholder="e.g. Artist & Photographer based in Assam"
            data-ocid="about_me.tagline.input"
          />
        </div>
        <div>
          <label
            htmlFor="aboutme-bio"
            className="text-xs text-gray-500 block mb-1"
          >
            Bio (main description)
          </label>
          <textarea
            id="aboutme-bio"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-[#FED100] resize-none"
            rows={5}
            placeholder="Tell your story, your passion for photography and art..."
            data-ocid="about_me.bio.textarea"
          />
        </div>
        <div>
          <label
            htmlFor="aboutme-exp"
            className="text-xs text-gray-500 block mb-1"
          >
            Experience / Journey
          </label>
          <textarea
            id="aboutme-exp"
            value={form.experience}
            onChange={(e) => setForm({ ...form, experience: e.target.value })}
            className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-[#FED100] resize-none"
            rows={4}
            placeholder="Your journey, achievements, how many years of experience..."
            data-ocid="about_me.experience.textarea"
          />
        </div>
      </div>

      {/* Personal Social Media */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-3">
        <h3 className="font-semibold">Personal Social Media</h3>
        {[
          {
            key: "personalInstagram",
            label: "Instagram Username",
            placeholder: "@yourhandle",
          },
          {
            key: "personalFacebook",
            label: "Facebook URL",
            placeholder: "https://facebook.com/...",
          },
          {
            key: "personalYoutube",
            label: "YouTube URL",
            placeholder: "https://youtube.com/...",
          },
          {
            key: "personalWhatsapp",
            label: "WhatsApp Number",
            placeholder: "9876543210",
          },
        ].map(({ key, label, placeholder }) => (
          <div key={key}>
            <label
              htmlFor={`aboutme-${key}`}
              className="text-xs text-gray-500 block mb-1"
            >
              {label}
            </label>
            <input
              id={`aboutme-${key}`}
              value={(form as Record<string, string>)[key] || ""}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-[#FED100]"
              placeholder={placeholder}
              data-ocid={`about_me.${key}.input`}
            />
          </div>
        ))}
      </div>

      {/* Business Social Media */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-3">
        <h3 className="font-semibold">Business Social Media</h3>
        {[
          {
            key: "businessInstagram",
            label: "Instagram Username",
            placeholder: "@yourbusiness",
          },
          {
            key: "businessFacebook",
            label: "Facebook URL",
            placeholder: "https://facebook.com/...",
          },
          {
            key: "businessYoutube",
            label: "YouTube URL",
            placeholder: "https://youtube.com/...",
          },
          {
            key: "businessWhatsapp",
            label: "WhatsApp Number",
            placeholder: "9876543210",
          },
        ].map(({ key, label, placeholder }) => (
          <div key={key}>
            <label
              htmlFor={`aboutme-${key}`}
              className="text-xs text-gray-500 block mb-1"
            >
              {label}
            </label>
            <input
              id={`aboutme-${key}`}
              value={(form as Record<string, string>)[key] || ""}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:border-[#FED100]"
              placeholder={placeholder}
              data-ocid={`about_me.${key}.input`}
            />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={save}
        className="flex items-center gap-2 bg-[#FED100] text-[#212121] px-6 py-3 rounded-lg font-bold hover:bg-[#e6bc00]"
        data-ocid="about_me.save_button"
      >
        <Save size={16} /> {saved ? "Saved!" : "Save About Me"}
      </button>
    </div>
  );
}
