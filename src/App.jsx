import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Search, Home as HomeIcon, ShoppingBasket, ShoppingCart, ClipboardList, LifeBuoy,
  MessageCircle, Plus, Minus, CheckCircle2, MapPin, Phone, User, Bike, Star,
  ChevronRight, ChevronDown, X, ArrowLeft, Loader2, Store, Truck, Sparkles,
  TrendingDown, Award, Trash2, Building2, Send, Clock, Shield, Wallet, Camera,
  Upload, FileText, LogOut, Settings, Bell, Calendar, Users, BarChart3,
  Package, Map, Navigation, AlertCircle, CheckCircle, XCircle, Edit3,
  Eye, EyeOff, Lock, Mail, Smartphone, CreditCard, Truck as TruckIcon,
  Home, Box, RefreshCw, Filter, SortAsc, SortDesc, Grid, List, Info
} from "lucide-react";
import { createClient } from '@supabase/supabase-js';

// Supabase Configuration
const SUPABASE_URL = "https://swpanjnzdxtbrqvfnpxi.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_o7xZepRzS8sNUOT5LW1wSw_Dvz_8_AL";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Design tokens
const COLORS = {
  bg: "#FAFAF8",
  primary: "#0B7A4F",
  primaryDark: "#075C3B",
  accent: "#F4A623",
  surface: "#FFFFFF",
  text: "#111111",
  textSoft: "#6B6B6B",
  border: "#E8E5E0",
  success: "#10B981",
  whatsapp: "#25D366",
  danger: "#D14343",
  warning: "#F59E0B",
  info: "#3B82F6"
};

// Constants
const DELIVERY_FEE = 100;
const WHATSAPP_BUSINESS_NUMBER = "254731371521";

// Helpers
const KES = (n) => `KES ${Number(n || 0).toLocaleString("en-KE")}`;
const genId = (prefix) => `${prefix}${Math.floor(100000 + Math.random() * 899999)}`;
const isValidKenyanPhone = (p) => /^(07|01)\d{8}$/.test((p || "").replace(/\s+/g, ""));
const waLink = (phone, text) => `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

// Mock data
const PRODUCTS = [
  { id: "sugar", name: "Sugar", unit: "2kg", emoji: "🧂" },
  { id: "milk", name: "Milk", unit: "500ml", emoji: "🥛" },
  { id: "blueband", name: "Blue Band", unit: "250g", emoji: "🧈" },
  { id: "rice", name: "Rice", unit: "2kg", emoji: "🍚" },
  { id: "oil", name: "Cooking Oil", unit: "2L", emoji: "🍶" },
  { id: "eggs", name: "Eggs", unit: "tray (30)", emoji: "🥚" },
  { id: "bread", name: "Bread", unit: "400g", emoji: "🍞" },
  { id: "flour", name: "Maize Flour", unit: "2kg", emoji: "🌽" },
];

const RIDERS = [
  { id: "r1", name: "Brian Otieno", bike: "KMEA 224B", phone: "254798765001", rating: 4.9, emoji: "🏍️" },
  { id: "r2", name: "Faith Wanjiru", bike: "KMEB 118K", phone: "254798765002", rating: 4.8, emoji: "🛵" },
];

// Logo Component
function Logo({ size = 40, withWordmark = true, withTagline = false }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="31" fill={COLORS.primary} />
          <path d="M18 26h28l-3.4 18.4a4 4 0 0 1-3.94 3.3H25.34a4 4 0 0 1-3.94-3.3L18 26Z" fill={COLORS.surface} />
          <path d="M23 26c0-6 4-10.5 9-10.5s9 4.5 9 10.5" stroke={COLORS.surface} strokeWidth="3" strokeLinecap="round" />
          <circle cx="27" cy="34" r="2.4" fill={COLORS.accent} />
          <circle cx="37" cy="34" r="2.4" fill={COLORS.accent} />
          <circle cx="32" cy="40" r="2.4" fill={COLORS.accent} />
        </svg>
        {withWordmark && (
          <span style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700, fontSize: size * 0.42, color: COLORS.text, letterSpacing: "-0.02em" }}>
            We<span style={{ color: COLORS.primary }}>Bizzle</span><span style={{ color: COLORS.accent }}>!</span>
          </span>
        )}
      </div>
      {withTagline && (
        <span style={{ fontFamily: "'Inter', sans-serif", fontStyle: "italic", fontSize: 12, color: COLORS.textSoft, marginTop: 2 }}>
          Compare. Buy. Deliver.
        </span>
      )}
    </div>
  );
}

// Toast Component
function Toast({ toast, type = "success" }) {
  if (!toast) return null;
  return (
    <div className={`wb-toast wb-toast-${type}`}>
      <CheckCircle2 size={18} color={type === 'success' ? COLORS.success : COLORS.danger} />
      <span>{toast}</span>
    </div>
  );
}

// Main App Component
export default function App() {
  const [page, setPage] = useState("home");
  const [search, setSearch] = useState("");
  const [selection, setSelection] = useState({});
  const [results, setResults] = useState(null);
  const [cart, setCart] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [toast, setToast] = useState(null);
  const [toastType, setToastType] = useState("success");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const toastTimer = useRef(null);

  const showToast = useCallback((msg, type = "success") => {
    setToast(msg);
    setToastType(type);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setUser(userData);
      }
    } catch (error) {
      console.error("Initialization error:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCompare = (pid) => {
    setSelection((prev) => ({ ...prev, [pid]: prev[pid] ? prev[pid] : 1 }));
    setResults(null);
    setPage("basket");
  };

  const onOrderFromVendor = (result) => {
    const items = result.lines
      .filter((l) => l.unitPrice)
      .map((l) => ({ pid: l.pid, name: l.product.name, unit: l.product.unit, emoji: l.product.emoji, qty: l.qty, unitPrice: l.unitPrice }));
    setCart({ vendor: result.vendor, items });
    showToast(`Added ${result.vendor.name}'s basket to cart`, "success");
    setPage("cart");
  };

  const cartCount = cart ? cart.items.reduce((a, it) => a + it.qty, 0) : 0;

  if (loading) {
    return (
      <div className="wb-app wb-loading">
        <Loader2 className="wb-spin" size={40} color={COLORS.primary} />
        <p>Loading WeBizzle...</p>
      </div>
    );
  }

  return (
    <div className="wb-app">
      <style>{CSS}</style>
      
      {/* Header */}
      <header className="wb-navbar">
        <div className="wb-navbar-inner">
          <button className="wb-logo-btn" onClick={() => setPage("home")}>
            <Logo size={38} withTagline />
          </button>
          <nav className="wb-navlinks">
            <button className={page === "home" ? "active" : ""} onClick={() => setPage("home")}>Home</button>
            <button className={page === "basket" ? "active" : ""} onClick={() => setPage("basket")}>Smart Basket</button>
            <button className={page === "orders" ? "active" : ""} onClick={() => setPage("orders")}>Orders</button>
            <button className={page === "support" ? "active" : ""} onClick={() => setPage("support")}>Support</button>
          </nav>
          <div className="wb-navactions">
            <button className="wb-ghost-btn" onClick={() => setPage("vendor-signup")}>
              <Store size={16} /> Vendor sign up
            </button>
            <button className="wb-ghost-btn" onClick={() => setPage("rider-signup")}>
              <Bike size={16} /> Rider sign up
            </button>
            <button className="wb-cart-btn" onClick={() => setPage("cart")}>
              <ShoppingCart size={20} />
              {cartCount > 0 && <span className="wb-badge">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <div className="wb-mobile-header">
        <button onClick={() => setPage("home")}><Logo size={32} withTagline /></button>
        <div className="wb-mobile-actions">
          <button className="wb-cart-btn" onClick={() => setPage("cart")}>
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="wb-badge">{cartCount}</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="wb-main">
        {page === "home" && (
          <div className="wb-page">
            <section className="wb-hero">
              <h1>Shop your neighbourhood.<br />Pay once with M-Pesa.</h1>
              <p>Compare Mama Mboga, Duka, Pharmacy &amp; more around you — then get it delivered by boda in minutes.</p>
              <div className="wb-search">
                <Search size={18} color={COLORS.textSoft} />
                <input
                  placeholder="Search sugar, milk, paracetamol, cement…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && setPage("basket")}
                />
                <button onClick={() => setPage("basket")}>Search</button>
              </div>
            </section>

            <section className="wb-section">
              <h2>Shop by category</h2>
              <div className="wb-categories">
                {["🥬 Mama Mboga", "🏪 Duka", "💊 Pharmacy", "🔧 Hardware", "📱 Electronics", "🥩 Butchery", "🍞 Bakery", "🌱 Agrovet"].map((c, i) => (
                  <button key={i} className="wb-category-card" onClick={() => setPage("basket")}>
                    <span className="wb-category-emoji">{c.split(' ')[0]}</span>
                    <span>{c.split(' ').slice(1).join(' ')}</span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        )}

        {page === "basket" && (
          <div className="wb-page">
            <div className="wb-page-head">
              <h1><ShoppingBasket size={24} color={COLORS.primary} /> Smart Basket Comparison</h1>
              <p>Build your list once — WeBizzle checks every vendor and finds the cheapest full basket.</p>
            </div>
            
            <div className="wb-basket-builder">
              {PRODUCTS.map((p) => {
                const qty = selection[p.id] || 0;
                return (
                  <div key={p.id} className={`wb-basket-item ${qty ? "active" : ""}`}>
                    <div className="wb-basket-item-info">
                      <span className="wb-basket-item-emoji">{p.emoji}</span>
                      <div>
                        <div className="wb-basket-item-name">{p.name}</div>
                        <div className="wb-basket-item-unit">{p.unit}</div>
                      </div>
                    </div>
                    <div className="wb-stepper">
                      <button onClick={() => {
                        const newSelection = { ...selection };
                        if (qty <= 1) delete newSelection[p.id];
                        else newSelection[p.id] = qty - 1;
                        setSelection(newSelection);
                        setResults(null);
                      }} disabled={qty === 0}><Minus size={14} /></button>
                      <span>{qty}</span>
                      <button onClick={() => {
                        setSelection({ ...selection, [p.id]: qty + 1 });
                        setResults(null);
                      }}><Plus size={14} /></button>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              className="wb-compare-btn"
              disabled={Object.keys(selection).length === 0}
              onClick={() => {
                const items = Object.entries(selection);
                if (items.length === 0) return;
                // Mock comparison results
                const mockResults = [
                  {
                    vendor: { id: "v1", name: "Kamau wa Duka", emoji: "🏪", rating: 4.7, distance: "0.6 km", phone: "254712345001" },
                    lines: items.map(([pid, qty]) => {
                      const product = PRODUCTS.find((p) => p.id === pid);
                      const unitPrice = 200 + Math.floor(Math.random() * 300);
                      return { pid, product, qty, unitPrice, subtotal: unitPrice * qty };
                    }),
                    total: items.reduce((sum, [pid, qty]) => sum + (200 + Math.floor(Math.random() * 300)) * qty, 0),
                    complete: true
                  },
                  {
                    vendor: { id: "v2", name: "Samwest Minimart", emoji: "🏪", rating: 4.5, distance: "1.1 km", phone: "254712345002" },
                    lines: items.map(([pid, qty]) => {
                      const product = PRODUCTS.find((p) => p.id === pid);
                      const unitPrice = 180 + Math.floor(Math.random() * 350);
                      return { pid, product, qty, unitPrice, subtotal: unitPrice * qty };
                    }),
                    total: items.reduce((sum, [pid, qty]) => sum + (180 + Math.floor(Math.random() * 350)) * qty, 0),
                    complete: true
                  }
                ];
                setResults(mockResults);
              }}
            >
              <TrendingDown size={18} /> Compare Prices ({Object.values(selection).reduce((a, b) => a + b, 0)} items)
            </button>

            {results && (
              <div className="wb-results">
                {results.map((r, idx) => (
                  <div key={idx} className={`wb-vendor-card ${idx === 0 ? "cheapest" : ""}`}>
                    <div className="wb-vendor-card-top">
                      <div className="wb-vendor-rank">#{idx + 1}</div>
                      <div className="wb-vendor-info">
                        <div className="wb-vendor-name">
                          {r.vendor.emoji} {r.vendor.name} {idx === 0 && <span className="wb-crown">🏆 Cheapest</span>}
                        </div>
                        <div className="wb-vendor-meta">
                          <Star size={13} color={COLORS.accent} fill={COLORS.accent} /> {r.vendor.rating}
                          <span>·</span> <MapPin size={13} /> {r.vendor.distance}
                        </div>
                      </div>
                      <div className="wb-vendor-total">{KES(r.total)}</div>
                    </div>
                    <div className="wb-vendor-actions">
                      <button className="wb-order-btn" onClick={() => onOrderFromVendor(r)}>
                        Order from here
                      </button>
                      <a className="wb-wa-btn" href={waLink(r.vendor.phone, "Hi, I'd like to order via WeBizzle")} target="_blank" rel="noreferrer">
                        <MessageCircle size={15} /> WhatsApp
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {page === "cart" && cart && (
          <div className="wb-page">
            <div className="wb-page-head">
              <h1><ShoppingCart size={24} color={COLORS.primary} /> Your Cart</h1>
              <p>Ordering from <strong>{cart.vendor.emoji} {cart.vendor.name}</strong> — one delivery, one payment.</p>
            </div>

            <div className="wb-cart-list">
              {cart.items.map((it, idx) => (
                <div key={idx} className="wb-cart-row">
                  <span className="wb-basket-item-emoji">{it.emoji}</span>
                  <div className="wb-cart-row-info">
                    <div className="wb-basket-item-name">{it.name}</div>
                    <div className="wb-basket-item-unit">{it.unit} · {KES(it.unitPrice)} each</div>
                  </div>
                  <div className="wb-cart-row-total">{KES(it.unitPrice * it.qty)}</div>
                </div>
              ))}
            </div>

            <div className="wb-summary-card">
              <div className="wb-summary-row"><span>Subtotal</span><span>{KES(cart.items.reduce((sum, it) => sum + it.unitPrice * it.qty, 0))}</span></div>
              <div className="wb-summary-row"><span><Truck size={14} /> Boda delivery</span><span>{KES(DELIVERY_FEE)}</span></div>
              <div className="wb-summary-row total"><span>Total</span><span>{KES(cart.items.reduce((sum, it) => sum + it.unitPrice * it.qty, 0) + DELIVERY_FEE)}</span></div>
            </div>

            <button className="wb-cta-btn wb-cta-block" onClick={() => setPage("checkout")}>
              Proceed to Checkout <ChevronRight size={18} />
            </button>
          </div>
        )}

        {page === "checkout" && cart && (
          <div className="wb-page">
            <div className="wb-page-head">
              <h1>Checkout</h1>
            </div>
            <div className="wb-checkout-grid">
              <div className="wb-form-card">
                <label>Full name
                  <input placeholder="e.g. Wanjiru Kamau" />
                </label>
                <label>M-Pesa phone number
                  <input placeholder="07XXXXXXXX" />
                </label>
                <label>Delivery location
                  <input placeholder="e.g. Kileleshwa, Njiwa Rd, House 4B" />
                </label>
                <button className="wb-cta-btn wb-cta-block wb-mpesa-btn">
                  Pay with M-Pesa
                </button>
              </div>
            </div>
          </div>
        )}

        {page === "vendor-signup" && (
          <div className="wb-page">
            <div className="wb-page-head">
              <h1><Store size={24} color={COLORS.primary} /> Register your shop</h1>
              <p>List your business — reach customers comparing prices nearby.</p>
            </div>
            <div className="wb-form-card wb-form-narrow">
              <label>Shop / business name
                <input placeholder="e.g. Baraka General Store" />
              </label>
              <label>Owner full name
                <input placeholder="e.g. John Mwangi" />
              </label>
              <label>Phone number
                <input placeholder="07XXXXXXXX" />
              </label>
              <label>Business Category
                <select>
                  <option>Mama Mboga</option>
                  <option>Duka</option>
                  <option>Pharmacy</option>
                  <option>Restaurant</option>
                  <option>Bar/Pub</option>
                  <option>Wholesaler</option>
                </select>
              </label>
              <button className="wb-cta-btn wb-cta-block"><Send size={16} /> Submit application</button>
            </div>
          </div>
        )}

        {page === "rider-signup" && (
          <div className="wb-page">
            <div className="wb-page-head">
              <h1><Bike size={24} color={COLORS.primary} /> Become a WeBizzle rider</h1>
              <p>Deliver orders around your neighbourhood and earn per trip.</p>
            </div>
            <div className="wb-form-card wb-form-narrow">
              <label>Full name
                <input placeholder="e.g. Peter Mutua" />
              </label>
              <label>Phone number
                <input placeholder="07XXXXXXXX" />
              </label>
              <label>Bike registration plate
                <input placeholder="e.g. KMEA 224B" />
              </label>
              <button className="wb-cta-btn wb-cta-block"><Send size={16} /> Submit application</button>
            </div>
          </div>
        )}

        {page === "orders" && (
          <div className="wb-page">
            <div className="wb-page-head"><h1><ClipboardList size={24} color={COLORS.primary} /> Your Orders</h1></div>
            <div className="wb-empty">
              <div className="wb-empty-emoji">📭</div>
              <h2>No orders yet</h2>
              <button className="wb-cta-btn" onClick={() => setPage("basket")}>Start a Smart Basket</button>
            </div>
          </div>
        )}

        {page === "support" && (
          <div className="wb-page">
            <div className="wb-page-head"><h1><LifeBuoy size={24} color={COLORS.primary} /> Support</h1></div>
            <div className="wb-support-actions">
              <a className="wb-cta-btn wb-wa-btn-lg" href={waLink(WHATSAPP_BUSINESS_NUMBER, "Hi WeBizzle, I need help with my order.")} target="_blank" rel="noreferrer">
                <MessageCircle size={18} /> Chat with us on WhatsApp
              </a>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="wb-footer">
        <div className="wb-footer-grid">
          <div>
            <Logo size={30} withTagline />
            <p className="wb-footer-tag">Bei bora, kila wakati — one basket, every vendor, one delivery.</p>
          </div>
          <div>
            <h4>For partners</h4>
            <button onClick={() => setPage("vendor-signup")}><Store size={14} /> Register your shop</button>
            <button onClick={() => setPage("rider-signup")}><Bike size={14} /> Become a rider</button>
          </div>
          <div>
            <h4>Support</h4>
            <button onClick={() => setPage("support")}><LifeBuoy size={14} /> Help centre</button>
            <a href={waLink(WHATSAPP_BUSINESS_NUMBER, "Hi WeBizzle, I need help.")} target="_blank" rel="noreferrer">
              <MessageCircle size={14} /> Chat on WhatsApp
            </a>
          </div>
        </div>
        <div className="wb-footer-bottom">
          <span>© {new Date().getFullYear()} WeBizzle. All rights reserved.</span>
          <span>Made in Kenya 🇰🇪</span>
        </div>
      </footer>

      {/* Bottom Navigation */}
      <nav className="wb-bottomnav">
        {[
          { id: "home", label: "Home", icon: HomeIcon },
          { id: "basket", label: "Basket", icon: ShoppingBasket },
          { id: "cart", label: "Cart", icon: ShoppingCart, badge: cartCount },
          { id: "orders", label: "Orders", icon: ClipboardList },
          { id: "support", label: "Support", icon: LifeBuoy },
        ].map((t) => {
          const Icon = t.icon;
          const active = page === t.id;
          return (
            <button key={t.id} className={`wb-bottomtab ${active ? "active" : ""}`} onClick={() => setPage(t.id)}>
              <span className="wb-bottomtab-icon">
                <Icon size={22} strokeWidth={active ? 2.4 : 1.9} />
                {!!t.badge && <span className="wb-badge wb-badge-nav">{t.badge}</span>}
              </span>
              <span>{t.label}</span>
            </button>
          );
        })}
      </nav>

      <Toast toast={toast} type={toastType} />
    </div>
  );
}

// CSS
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');

.wb-app{
  --bg:${COLORS.bg}; --primary:${COLORS.primary}; --primary-dark:${COLORS.primaryDark};
  --accent:${COLORS.accent}; --surface:${COLORS.surface}; --text:${COLORS.text};
  --text-soft:${COLORS.textSoft}; --border:${COLORS.border}; --success:${COLORS.success};
  --whatsapp:${COLORS.whatsapp}; --danger:${COLORS.danger};
  background:var(--bg); color:var(--text); font-family:'Inter',sans-serif;
  min-height:100vh; display:flex; flex-direction:column; position:relative;
  padding-bottom:76px;
}
.wb-app *{ box-sizing:border-box; }
.wb-app h1,.wb-app h2,.wb-app h3{ font-family:'Poppins',sans-serif; margin:0; }
.wb-app button{ font-family:'Inter',sans-serif; cursor:pointer; border:none; background:none; }

.wb-loading{
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  min-height:100vh; gap:20px;
}
.wb-spin{ animation:spin 1s linear infinite; }
@keyframes spin{ 100%{ transform:rotate(360deg); } }

/* Navbar */
.wb-navbar{ display:none; border-bottom:1px solid var(--border); background:var(--surface); position:sticky; top:0; z-index:30; }
.wb-navbar-inner{ max-width:1180px; margin:0 auto; display:flex; align-items:center; justify-content:space-between; padding:14px 28px; gap:24px; }
.wb-logo-btn{ display:flex; }
.wb-navlinks{ display:flex; gap:6px; flex:1; justify-content:center; }
.wb-navlinks button{ padding:9px 16px; border-radius:10px; font-weight:600; font-size:14.5px; color:var(--text-soft); }
.wb-navlinks button:hover{ background:var(--bg); color:var(--text); }
.wb-navlinks button.active{ color:var(--primary); background:#EAF6F0; }
.wb-navactions{ display:flex; align-items:center; gap:10px; }
.wb-ghost-btn{ display:flex; align-items:center; gap:6px; padding:8px 14px; border:1px solid var(--border); border-radius:10px; font-size:13.5px; font-weight:600; color:var(--text); white-space:nowrap; }
.wb-ghost-btn:hover{ border-color:var(--primary); color:var(--primary); }
.wb-cart-btn{ position:relative; display:flex; align-items:center; justify-content:center; width:40px; height:40px; border-radius:10px; background:var(--bg); color:var(--text); }
.wb-badge{ position:absolute; top:-4px; right:-4px; background:var(--accent); color:#111; font-size:10.5px; font-weight:700; min-width:17px; height:17px; border-radius:9px; display:flex; align-items:center; justify-content:center; padding:0 3px; }

@media(min-width:900px){
  .wb-navbar{ display:block; }
  .wb-mobile-header{ display:none; }
}

/* Mobile header */
.wb-mobile-header{ display:flex; align-items:center; justify-content:space-between; padding:14px 16px; background:var(--surface); border-bottom:1px solid var(--border); position:sticky; top:0; z-index:30; }
.wb-mobile-actions{ display:flex; align-items:center; gap:8px; }

/* Main */
.wb-main{ flex:1; }
.wb-page{ max-width:900px; margin:0 auto; padding:20px 16px 40px; }
.wb-page-head{ margin-bottom:18px; }
.wb-page-head h1{ font-size:22px; display:flex; align-items:center; gap:8px; }
.wb-page-head p{ color:var(--text-soft); font-size:14px; margin-top:6px; }

/* Hero */
.wb-hero{ background:linear-gradient(135deg,var(--primary) 0%,var(--primary-dark) 100%); border-radius:20px; padding:34px 22px; color:#fff; margin-bottom:26px; }
.wb-hero h1{ font-size:26px; line-height:1.25; margin-bottom:10px; }
.wb-hero p{ opacity:.9; font-size:14.5px; margin-bottom:18px; max-width:520px; }
.wb-search{ background:#fff; border-radius:14px; display:flex; align-items:center; gap:8px; padding:10px 14px; max-width:520px; }
.wb-search input{ border:none; outline:none; flex:1; font-size:14.5px; color:var(--text); }
.wb-search button{ background:var(--accent); color:#111; font-weight:700; padding:9px 18px; border-radius:10px; font-size:13.5px; }

.wb-section{ margin-bottom:28px; }
.wb-section h2{ font-size:17px; margin-bottom:14px; }
.wb-categories{ display:grid; grid-template-columns:repeat(4,1fr); gap:10px; }
@media(min-width:640px){ .wb-categories{ grid-template-columns:repeat(8,1fr); } }
.wb-category-card{ background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:14px 6px; display:flex; flex-direction:column; align-items:center; gap:6px; font-size:11.5px; font-weight:600; color:var(--text); }
.wb-category-card:hover{ border-color:var(--primary); transform:translateY(-2px); transition:.15s; }
.wb-category-emoji{ font-size:24px; }

/* Basket */
.wb-basket-builder{ display:flex; flex-direction:column; gap:8px; margin-bottom:16px; }
.wb-basket-item{ background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:10px 14px; display:flex; align-items:center; justify-content:space-between; }
.wb-basket-item.active{ border-color:var(--primary); background:#F3FAF6; }
.wb-basket-item-info{ display:flex; align-items:center; gap:10px; }
.wb-basket-item-emoji{ font-size:22px; }
.wb-basket-item-name{ font-weight:600; font-size:14px; display:flex; align-items:center; gap:6px; }
.wb-basket-item-unit{ color:var(--text-soft); font-size:12px; }
.wb-stepper{ display:flex; align-items:center; gap:10px; background:var(--bg); border-radius:10px; padding:4px 8px; }
.wb-stepper button{ width:24px; height:24px; border-radius:7px; background:var(--surface); border:1px solid var(--border); display:flex; align-items:center; justify-content:center; }
.wb-stepper button:disabled{ opacity:.35; cursor:not-allowed; }
.wb-stepper span{ min-width:16px; text-align:center; font-weight:700; font-size:13.5px; }

.wb-compare-btn{ width:100%; background:var(--primary); color:#fff; font-weight:700; font-size:15px; padding:14px; border-radius:14px; display:flex; align-items:center; justify-content:center; gap:8px; margin-bottom:20px; }
.wb-compare-btn:disabled{ background:#B9CFC4; cursor:not-allowed; }
.wb-compare-btn:not(:disabled):hover{ background:var(--primary-dark); }

.wb-results{ display:flex; flex-direction:column; gap:14px; }
.wb-vendor-card{ background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:16px; }
.wb-vendor-card.cheapest{ border-color:var(--primary); box-shadow:0 0 0 3px #E6F5EC; }
.wb-vendor-card-top{ display:flex; align-items:center; gap:12px; margin-bottom:10px; }
.wb-vendor-rank{ font-family:'Poppins',sans-serif; font-weight:800; font-size:17px; color:var(--text-soft); width:26px; }
.wb-vendor-info{ flex:1; }
.wb-vendor-name{ font-weight:700; font-size:15px; display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
.wb-crown{ background:var(--primary); color:#fff; font-size:10.5px; font-weight:700; padding:2px 8px; border-radius:10px; }
.wb-vendor-meta{ color:var(--text-soft); font-size:12px; display:flex; align-items:center; gap:5px; margin-top:3px; }
.wb-vendor-total{ font-family:'Poppins',sans-serif; font-weight:800; font-size:18px; color:var(--text); }
.wb-vendor-actions{ display:flex; gap:8px; }
.wb-order-btn{ flex:1; background:var(--primary); color:#fff; font-weight:700; font-size:13.5px; padding:11px; border-radius:11px; }
.wb-order-btn:hover{ background:var(--primary-dark); }
.wb-wa-btn{ display:flex; align-items:center; gap:6px; background:var(--whatsapp); color:#fff; font-weight:700; font-size:13.5px; padding:11px 14px; border-radius:11px; text-decoration:none; }

/* Cart */
.wb-cart-list{ display:flex; flex-direction:column; gap:8px; margin-bottom:18px; }
.wb-cart-row{ background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:10px 14px; display:flex; align-items:center; gap:12px; }
.wb-cart-row-info{ flex:1; }
.wb-cart-row-total{ font-weight:700; font-size:13.5px; min-width:70px; text-align:right; }

.wb-summary-card{ background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:16px 18px; margin-bottom:18px; }
.wb-summary-card h3{ font-size:15px; margin-bottom:10px; }
.wb-summary-row{ display:flex; justify-content:space-between; font-size:13.5px; color:var(--text-soft); padding:5px 0; }
.wb-summary-row span:first-child{ display:flex; align-items:center; gap:5px; }
.wb-summary-row.total{ border-top:1px solid var(--border); margin-top:6px; padding-top:10px; font-weight:800; font-size:16px; color:var(--text); }
.wb-summary-row.total span:first-child{ color:var(--text); }

.wb-cta-btn{ background:var(--primary); color:#fff; font-weight:700; font-size:14.5px; padding:13px 20px; border-radius:13px; display:inline-flex; align-items:center; gap:6px; justify-content:center; text-decoration:none; }
.wb-cta-btn:hover{ background:var(--primary-dark); }
.wb-cta-block{ width:100%; }
.wb-mpesa-btn{ background:var(--accent); color:#111; }
.wb-mpesa-btn:hover{ background:#dd9418; }

/* Checkout */
.wb-checkout-grid{ display:grid; grid-template-columns:1fr; gap:18px; }
@media(min-width:800px){ .wb-checkout-grid{ grid-template-columns:1.3fr 1fr; align-items:start; } }
.wb-form-card{ background:var(--surface); border:1px solid var(--border); border-radius:16px; padding:20px; display:flex; flex-direction:column; gap:14px; }
.wb-form-narrow{ max-width:520px; }
.wb-form-card label{ display:flex; flex-direction:column; gap:6px; font-size:13px; font-weight:600; color:var(--text); }
.wb-form-card input,.wb-form-card textarea,.wb-form-card select{ border:1px solid var(--border); border-radius:10px; padding:10px 12px; font-size:14px; color:var(--text); outline:none; }
.wb-form-card input:focus,.wb-form-card textarea:focus,.wb-form-card select:focus{ border-color:var(--primary); }

/* Empty states */
.wb-empty{ text-align:center; padding:60px 20px; display:flex; flex-direction:column; align-items:center; gap:8px; }
.wb-empty-emoji{ font-size:46px; margin-bottom:6px; }
.wb-empty p{ color:var(--text-soft); font-size:13.5px; max-width:340px; margin-bottom:10px; }

/* Support */
.wb-support-actions{ display:flex; flex-direction:column; align-items:flex-start; gap:10px; margin-bottom:22px; }
.wb-wa-btn-lg{ background:var(--whatsapp); }
.wb-wa-btn-lg:hover{ background:#1fb257; }

/* Footer */
.wb-footer{ background:#0F0F0E; color:#D8D6D2; padding:36px 16px 18px; margin-top:20px; }
.wb-footer-grid{ max-width:1000px; margin:0 auto; display:grid; grid-template-columns:1fr; gap:24px; }
@media(min-width:700px){ .wb-footer-grid{ grid-template-columns:1.4fr 1fr 1fr; } }
.wb-footer-tag{ font-size:12.5px; color:#9A9791; margin-top:10px; max-width:260px; }
.wb-footer h4{ color:#fff; font-family:'Poppins',sans-serif; font-size:13.5px; margin-bottom:10px; }
.wb-footer button,.wb-footer a{ display:flex; align-items:center; gap:7px; color:#C7C4BE; font-size:13px; text-decoration:none; padding:5px 0; }
.wb-footer button:hover,.wb-footer a:hover{ color:var(--accent); }
.wb-footer-bottom{ max-width:1000px; margin:24px auto 0; padding-top:16px; border-top:1px solid #262624; display:flex; justify-content:space-between; flex-wrap:wrap; gap:6px; font-size:12px; color:#8B8880; }

/* Bottom nav */
.wb-bottomnav{ position:fixed; bottom:0; left:0; right:0; background:var(--surface); border-top:1px solid var(--border); display:flex; z-index:40; padding:6px 4px 8px; }
@media(min-width:900px){ .wb-bottomnav{ display:none; } .wb-app{ padding-bottom:0; } }
.wb-bottomtab{ flex:1; display:flex; flex-direction:column; align-items:center; gap:2px; font-size:10.5px; font-weight:600; color:var(--text-soft); padding:6px 2px; border-radius:10px; }
.wb-bottomtab.active{ color:var(--primary); }
.wb-bottomtab-icon{ position:relative; }
.wb-badge-nav{ top:-6px; right:-10px; }

/* Toast */
.wb-toast{ position:fixed; bottom:88px; left:50%; transform:translateX(-50%); background:#111; color:#fff; padding:11px 18px; border-radius:12px; font-size:13px; font-weight:600; display:flex; align-items:center; gap:8px; z-index:200; box-shadow:0 8px 24px rgba(0,0,0,.25); max-width:90vw; }
@media(min-width:900px){ .wb-toast{ bottom:24px; } }
`;
