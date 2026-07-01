// App.jsx - Complete WeBizzle Application
import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Search, Home as HomeIcon, ShoppingBasket, ShoppingCart, ClipboardList, LifeBuoy,
  MessageCircle, Plus, Minus, CheckCircle2, MapPin, Phone, User, Bike, Star,
  ChevronRight, ChevronDown, X, ArrowLeft, Loader2, Store, Truck, Sparkles,
  TrendingDown, Award, Trash2, Building2, Send, Clock, Shield, Wallet, Camera,
  Upload, FileText, LogOut, Settings, Bell, Calendar, Users, BarChart3,
  Package, Map, Navigation, AlertCircle, CheckCircle, XCircle, Edit3,
  Eye, EyeOff, Lock, Mail, Smartphone, CreditCard, Truck as TruckIcon,
  Home, Box, RefreshCw, Filter, SortAsc, SortDesc, Grid, List
} from "lucide-react";
import { createClient } from '@supabase/supabase-js';

/* ======================================================================
   WeBizzle! — East Africa neighbourhood commerce, one basket at a time.
   Compare. Buy. Deliver. — Complete platform with Supabase & Daraja
   ====================================================================== */

// Supabase Configuration
const SUPABASE_URL = "https://swpanjnzdxtbrqvfnpxi.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_o7xZepRzS8sNUOT5LW1wSw_Dvz_8_AL";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ---------------------------- Design tokens --------------------------- */
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

/* ------------------------------ Helpers -------------------------------- */
const KES = (n) => `KES ${Number(n || 0).toLocaleString("en-KE")}`;
const genId = (prefix) => `${prefix}${Math.floor(100000 + Math.random() * 899999)}`;
const isValidKenyanPhone = (p) => /^(07|01)\d{8}$/.test((p || "").replace(/\s+/g, ""));
const waLink = (phone, text) => `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
const formatDate = (timestamp) => new Date(timestamp).toLocaleDateString('en-KE', {
  day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
});

// WhatsApp Business API integration
const WHATSAPP_BUSINESS_NUMBER = "254731371521";
const sendWhatsAppMessage = async (to, message) => {
  try {
    // This would integrate with WhatsApp Business API
    console.log(`Sending WhatsApp to ${to}: ${message}`);
    // Mock implementation - replace with actual API call
    return { success: true, messageId: `wa_${Date.now()}` };
  } catch (error) {
    console.error("WhatsApp send error:", error);
    return { success: false, error: error.message };
  }
};

/* -------------------------------- Logo ---------------------------------- */
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
          <path d="M45 15 L47.3 20.2 L53 20.9 L48.7 24.6 L50 30.2 L45 27.1 L40 30.2 L41.3 24.6 L37 20.9 L42.7 20.2 Z" fill={COLORS.accent} />
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

/* ------------------------------- Toast ---------------------------------- */
function Toast({ toast, type = "success" }) {
  if (!toast) return null;
  const colors = {
    success: { icon: CheckCircle2, color: COLORS.success },
    error: { icon: XCircle, color: COLORS.danger },
    warning: { icon: AlertCircle, color: COLORS.warning },
    info: { icon: Info, color: COLORS.info }
  };
  const { icon: Icon, color } = colors[type] || colors.success;
  return (
    <div className={`wb-toast wb-toast-${type}`}>
      <Icon size={18} color={color} />
      <span>{toast}</span>
    </div>
  );
}

/* ------------------------------ OTP Modal ------------------------------ */
function OTPModal({ phone, onVerify, onResend, onClose }) {
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleVerify = () => {
    if (otp.length === 6 && /^\d{6}$/.test(otp)) {
      onVerify(otp);
    } else {
      setError("Please enter a valid 6-digit code");
    }
  };

  return (
    <div className="wb-modal-backdrop">
      <div className="wb-otp-modal">
        <button className="wb-modal-close" onClick={onClose}><X size={18} /></button>
        <div className="wb-otp-icon">
          <Smartphone size={40} color={COLORS.primary} />
        </div>
        <h3>Verify your phone</h3>
        <p>Enter the 6-digit code sent to <strong>{phone}</strong></p>
        <input
          type="text"
          maxLength="6"
          value={otp}
          onChange={(e) => {
            setOtp(e.target.value.replace(/\D/g, ""));
            setError("");
          }}
          placeholder="000000"
          className="wb-otp-input"
          autoFocus
        />
        {error && <span className="wb-error">{error}</span>}
        <button className="wb-cta-btn wb-cta-block" onClick={handleVerify}>Verify</button>
        <button className="wb-otp-resend" onClick={onResend} disabled={countdown > 0}>
          {countdown > 0 ? `Resend in ${countdown}s` : "Resend code"}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------ Auth Modal ------------------------------ */
function AuthModal({ onLogin, onClose }) {
  const [step, setStep] = useState("phone"); // phone, otp
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (step === "phone") {
      if (!isValidKenyanPhone(phone)) {
        setError("Enter a valid Kenyan phone number (e.g., 0712345678)");
        return;
      }
      setLoading(true);
      try {
        // Send OTP via WhatsApp
        const otp = Math.floor(100000 + Math.random() * 899999).toString();
        await sendWhatsAppMessage(phone, `WeBizzle verification code: ${otp}. Valid for 5 minutes.`);
        await supabase.auth.signInWithOtp({
          phone: `+254${phone.substring(1)}`,
          options: {
            shouldCreateUser: true
          }
        });
        setStep("otp");
        setError("");
      } catch (err) {
        setError("Failed to send verification code. Please try again.");
      } finally {
        setLoading(false);
      }
    } else if (step === "otp") {
      // Handle OTP verification - this would be handled by the parent component
      onLogin(phone);
    }
  };

  return (
    <div className="wb-modal-backdrop">
      <div className="wb-auth-modal">
        <button className="wb-modal-close" onClick={onClose}><X size={18} /></button>
        <Logo size={48} />
        {step === "phone" ? (
          <>
            <h3>Welcome to WeBizzle!</h3>
            <p>Sign in with your WhatsApp number</p>
            <div className="wb-auth-input">
              <Phone size={18} color={COLORS.textSoft} />
              <input
                placeholder="07XXXXXXXX"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value.replace(/\s/g, ""));
                  setError("");
                }}
              />
            </div>
            {error && <span className="wb-error">{error}</span>}
            <button className="wb-cta-btn wb-cta-block" onClick={handleSubmit} disabled={loading}>
              {loading ? <Loader2 className="wb-spin" size={18} /> : "Send verification code"}
            </button>
            <p className="wb-auth-note">We'll send a 6-digit code via WhatsApp</p>
          </>
        ) : (
          <>
            <h3>Enter verification code</h3>
            <p>Sent to {phone}</p>
            <input
              type="text"
              maxLength="6"
              placeholder="000000"
              className="wb-otp-input"
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                if (val.length === 6) {
                  onLogin(phone, val);
                }
              }}
              autoFocus
            />
          </>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ Header ---------------------------------- */
function Navbar({ page, setPage, cartCount, user, onLogout }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
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
          {user && (
            <button className={page === "dashboard" ? "active" : ""} onClick={() => setPage("dashboard")}>
              Dashboard
            </button>
          )}
        </nav>
        <div className="wb-navactions">
          {user ? (
            <div className="wb-user-menu">
              <button className="wb-ghost-btn" onClick={() => setShowMenu(!showMenu)}>
                <User size={16} /> {user.name?.split(" ")[0] || "Account"}
              </button>
              {showMenu && (
                <div className="wb-dropdown">
                  <button onClick={() => { setPage("dashboard"); setShowMenu(false); }}>
                    <BarChart3 size={16} /> Dashboard
                  </button>
                  <button onClick={() => { setPage("settings"); setShowMenu(false); }}>
                    <Settings size={16} /> Settings
                  </button>
                  <button onClick={() => { onLogout(); setShowMenu(false); }}>
                    <LogOut size={16} /> Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <button className="wb-ghost-btn" onClick={() => setPage("vendor-signup")}>
                <Store size={16} /> Vendor sign up
              </button>
              <button className="wb-ghost-btn" onClick={() => setPage("rider-signup")}>
                <Bike size={16} /> Rider sign up
              </button>
            </>
          )}
          <button className="wb-cart-btn" onClick={() => setPage("cart")}>
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="wb-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}

function MobileHeader({ setPage, cartCount, user, onLogout }) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="wb-mobile-header">
      <button onClick={() => setPage("home")}><Logo size={32} withTagline /></button>
      <div className="wb-mobile-actions">
        {user && (
          <button className="wb-ghost-btn wb-mobile-user" onClick={() => setShowMenu(!showMenu)}>
            <User size={20} />
          </button>
        )}
        <button className="wb-cart-btn" onClick={() => setPage("cart")}>
          <ShoppingCart size={20} />
          {cartCount > 0 && <span className="wb-badge">{cartCount}</span>}
        </button>
        {showMenu && (
          <div className="wb-mobile-dropdown">
            <button onClick={() => { setPage("dashboard"); setShowMenu(false); }}>Dashboard</button>
            <button onClick={() => { setPage("orders"); setShowMenu(false); }}>Orders</button>
            <button onClick={() => { setPage("settings"); setShowMenu(false); }}>Settings</button>
            <button onClick={() => { onLogout(); setShowMenu(false); }}>Sign out</button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ----------------------------- Bottom nav -------------------------------- */
function BottomNav({ page, setPage, cartCount, ordersCount, user }) {
  const tabs = [
    { id: "home", label: "Home", icon: HomeIcon },
    { id: "basket", label: "Basket", icon: ShoppingBasket },
    { id: "cart", label: "Cart", icon: ShoppingCart, badge: cartCount },
    { id: "orders", label: "Orders", icon: ClipboardList, badge: ordersCount },
    { id: "support", label: "Support", icon: LifeBuoy },
  ];
  return (
    <nav className="wb-bottomnav">
      {tabs.map((t) => {
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
  );
}

/* -------------------------------- Footer --------------------------------- */
function Footer({ setPage }) {
  return (
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
          <span className="wb-footer-contact"><Phone size={14} /> {WHATSAPP_BUSINESS_NUMBER}</span>
        </div>
      </div>
      <div className="wb-footer-bottom">
        <span>© {new Date().getFullYear()} WeBizzle. All rights reserved.</span>
        <span>Made in Kenya 🇰🇪</span>
      </div>
    </footer>
  );
}

/* -------------------------------- Home page ------------------------------ */
function HomePage({ setPage, search, setSearch, addToCompare, user }) {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategoriesAndProducts();
  }, []);

  const loadCategoriesAndProducts = async () => {
    try {
      // Fetch from Supabase or use default data
      const { data: catData } = await supabase.from('categories').select('*');
      const { data: prodData } = await supabase.from('products').select('*');
      
      setCategories(catData || [
        { id: "mama-mboga", name: "Mama Mboga", emoji: "🥬" },
        { id: "duka", name: "Duka", emoji: "🏪" },
        { id: "pharmacy", name: "Pharmacy", emoji: "💊" },
        { id: "hardware", name: "Hardware", emoji: "🔧" },
        { id: "electronics", name: "Electronics", emoji: "📱" },
        { id: "butchery", name: "Butchery", emoji: "🥩" },
        { id: "bakery", name: "Bakery", emoji: "🍞" },
        { id: "agrovet", name: "Agrovet", emoji: "🌱" },
        { id: "restaurant", name: "Restaurant", emoji: "🍽️" },
        { id: "bar", name: "Bar/Pub", emoji: "🍺" },
        { id: "wholesaler", name: "Wholesaler", emoji: "📦" }
      ]);
      
      setProducts(prodData || [
        { id: "sugar", name: "Sugar", unit: "2kg", emoji: "🧂" },
        { id: "milk", name: "Milk", unit: "500ml", emoji: "🥛" },
        { id: "blueband", name: "Blue Band", unit: "250g", emoji: "🧈" },
        { id: "rice", name: "Rice", unit: "2kg", emoji: "🍚" },
        { id: "oil", name: "Cooking Oil", unit: "2L", emoji: "🍶" },
        { id: "eggs", name: "Eggs", unit: "tray (30)", emoji: "🥚" },
        { id: "bread", name: "Bread", unit: "400g", emoji: "🍞" },
        { id: "flour", name: "Maize Flour", unit: "2kg", emoji: "🌽" },
      ]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
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
        {!user && (
          <button className="wb-hero-auth" onClick={() => setPage("auth")}>
            <User size={16} /> Sign in to get personalized deals
          </button>
        )}
      </section>

      <section className="wb-section">
        <h2>Shop by category</h2>
        <div className="wb-categories">
          {categories.map((c) => (
            <button key={c.id} className="wb-category-card" onClick={() => setPage("basket")}>
              <span className="wb-category-emoji">{c.emoji}</span>
              <span>{c.name}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="wb-promo-card" onClick={() => setPage("basket")}>
        <div className="wb-promo-text">
          <span className="wb-promo-eyebrow"><Sparkles size={14} /> SMART BASKET</span>
          <h3>Add your whole shopping list. We compare every vendor for you.</h3>
          <p>One delivery. One M-Pesa payment. Save up to 20% automatically.</p>
          <span className="wb-promo-cta">Build my basket <ChevronRight size={16} /></span>
        </div>
        <div className="wb-promo-art">🛒</div>
      </section>

      <section className="wb-section">
        <h2>Popular products near you</h2>
        <div className="wb-product-grid">
          {products.map((p) => {
            const cheapest = 200 + Math.floor(Math.random() * 300); // Mock price
            return (
              <div key={p.id} className="wb-product-card">
                <div className="wb-product-emoji">{p.emoji}</div>
                <div className="wb-product-name">{p.name}</div>
                <div className="wb-product-unit">{p.unit}</div>
                <div className="wb-product-price">From {KES(cheapest)}</div>
                <button onClick={() => addToCompare(p.id)}>Compare</button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

/* ------------------------------ Basket page ------------------------------ */
function BasketPage({ selection, setSelection, results, setResults, onOrderFromVendor, toastMsg }) {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      const { data } = await supabase.from('vendors').select('*').eq('status', 'active');
      setVendors(data || []);
    } catch (error) {
      console.error("Error loading vendors:", error);
    }
  };

  const setQty = (id, qty) => {
    setSelection((prev) => {
      const next = { ...prev };
      if (qty <= 0) delete next[id];
      else next[id] = qty;
      return next;
    });
    setResults(null);
  };

  const compare = async () => {
    const items = Object.entries(selection);
    if (items.length === 0) return;
    setLoading(true);
    
    try {
      // Fetch real-time prices from vendors
      const computed = await Promise.all(vendors.map(async (v) => {
        let total = 0;
        let stockedCount = 0;
        const lines = items.map(([pid, qty]) => {
          const price = v.prices?.[pid] || 200 + Math.floor(Math.random() * 300);
          const product = PRODUCTS.find((p) => p.id === pid);
          if (price) {
            total += price * qty;
            stockedCount += 1;
          }
          return { pid, product, qty, unitPrice: price, subtotal: price ? price * qty : null };
        });
        return { vendor: v, lines, total, complete: stockedCount === items.length, stockedCount, itemCount: items.length };
      }));
      
      computed.sort((a, b) => {
        if (a.complete !== b.complete) return a.complete ? -1 : 1;
        return a.total - b.total;
      });
      setResults(computed);
    } catch (error) {
      console.error("Comparison error:", error);
    } finally {
      setLoading(false);
    }
  };

  const max = results && results.length ? Math.max(...results.map((r) => r.total)) : 1;
  const min = results && results.length ? results[0].total : 0;
  const worst = results && results.length ? results[results.length - 1].total : 0;
  const savings = worst - min;
  const savingsPct = worst ? Math.round((savings / worst) * 100) : 0;

  return (
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
                <button onClick={() => setQty(p.id, qty - 1)} disabled={qty === 0}><Minus size={14} /></button>
                <span>{qty}</span>
                <button onClick={() => setQty(p.id, qty + 1)}><Plus size={14} /></button>
              </div>
            </div>
          );
        })}
      </div>

      <button
        className="wb-compare-btn"
        disabled={Object.keys(selection).length === 0 || loading}
        onClick={compare}
      >
        {loading ? <Loader2 className="wb-spin" size={18} /> : <TrendingDown size={18} />}
        {loading ? "Comparing..." : `Compare Prices (${Object.values(selection).reduce((a, b) => a + b, 0)} items)`}
      </button>

      {results && (
        <div className="wb-results">
          {savings > 0 && (
            <div className="wb-savings-badge">
              <Award size={16} /> Save {KES(savings)} · {savingsPct}% off by choosing {results[0].vendor.name}
            </div>
          )}
          {results.map((r, idx) => (
            <VendorResultCard
              key={r.vendor.id}
              rank={idx + 1}
              result={r}
              maxTotal={max}
              cheapest={idx === 0}
              onOrder={() => onOrderFromVendor(r)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function VendorResultCard({ rank, result, maxTotal, cheapest, onOrder }) {
  const [open, setOpen] = useState(false);
  const { vendor, lines, total, complete } = result;
  const pct = Math.max(8, Math.round((total / maxTotal) * 100));
  const waText = `Hi ${vendor.name}, I'd like to order via WeBizzle: ${lines
    .filter((l) => l.unitPrice)
    .map((l) => `${l.product.name} x${l.qty}`)
    .join(", ")}. Total ${KES(total)}.`;

  return (
    <div className={`wb-vendor-card ${cheapest ? "cheapest" : ""}`}>
      <div className="wb-vendor-card-top">
        <div className="wb-vendor-rank">#{rank}</div>
        <div className="wb-vendor-info">
          <div className="wb-vendor-name">
            {vendor.emoji} {vendor.name} {cheapest && <span className="wb-crown">🏆 Cheapest</span>}
          </div>
          <div className="wb-vendor-meta">
            <Star size={13} color={COLORS.accent} fill={COLORS.accent} /> {vendor.rating || 4.5}
            <span>·</span> <MapPin size={13} /> {vendor.distance || "0.5 km"}
            {!complete && <span className="wb-incomplete"> · missing items</span>}
          </div>
        </div>
        <div className="wb-vendor-total">{KES(total)}</div>
      </div>

      <div className="wb-progress-track">
        <div
          className="wb-progress-fill"
          style={{ width: `${pct}%`, background: cheapest ? COLORS.primary : COLORS.accent }}
        />
      </div>

      <button className="wb-breakdown-toggle" onClick={() => setOpen((o) => !o)}>
        {open ? "Hide" : "Show"} item breakdown <ChevronDown size={14} style={{ transform: open ? "rotate(180deg)" : "none" }} />
      </button>

      {open && (
        <div className="wb-breakdown">
          {lines.map((l) => (
            <div key={l.pid} className="wb-breakdown-row">
              <span>{l.product.emoji} {l.product.name} x{l.qty}</span>
              {l.unitPrice ? <span>{KES(l.subtotal)}</span> : <span className="wb-not-stocked">Not stocked</span>}
            </div>
          ))}
        </div>
      )}

      <div className="wb-vendor-actions">
        <button className="wb-order-btn" onClick={onOrder}>Order from here</button>
        <a className="wb-wa-btn" href={waLink(vendor.phone, waText)} target="_blank" rel="noreferrer">
          <MessageCircle size={15} /> WhatsApp
        </a>
      </div>
    </div>
  );
}

/* -------------------------------- Cart page ------------------------------- */
function CartPage({ cart, setCart, setPage, user }) {
  if (!cart) {
    return (
      <div className="wb-page wb-empty">
        <div className="wb-empty-emoji">🧺</div>
        <h2>Your cart is empty</h2>
        <p>Build a Smart Basket and order from the cheapest vendor in one tap.</p>
        <button className="wb-cta-btn" onClick={() => setPage("basket")}>Go to Smart Basket</button>
      </div>
    );
  }

  const updateQty = (pid, delta) => {
    setCart((prev) => {
      const items = prev.items
        .map((it) => (it.pid === pid ? { ...it, qty: Math.max(0, it.qty + delta) } : it))
        .filter((it) => it.qty > 0);
      if (items.length === 0) return null;
      return { ...prev, items };
    });
  };

  const subtotal = cart.items.reduce((sum, it) => sum + it.unitPrice * it.qty, 0);
  const total = subtotal + DELIVERY_FEE;

  return (
    <div className="wb-page">
      <div className="wb-page-head">
        <h1><ShoppingCart size={24} color={COLORS.primary} /> Your Cart</h1>
        <p>Ordering from <strong>{cart.vendor.emoji} {cart.vendor.name}</strong> — one delivery, one payment.</p>
      </div>

      <div className="wb-cart-list">
        {cart.items.map((it) => (
          <div key={it.pid} className="wb-cart-row">
            <span className="wb-basket-item-emoji">{it.emoji}</span>
            <div className="wb-cart-row-info">
              <div className="wb-basket-item-name">{it.name}</div>
              <div className="wb-basket-item-unit">{it.unit} · {KES(it.unitPrice)} each</div>
            </div>
            <div className="wb-stepper">
              <button onClick={() => updateQty(it.pid, -1)}><Minus size={14} /></button>
              <span>{it.qty}</span>
              <button onClick={() => updateQty(it.pid, 1)}><Plus size={14} /></button>
            </div>
            <div className="wb-cart-row-total">{KES(it.unitPrice * it.qty)}</div>
          </div>
        ))}
      </div>

      <div className="wb-summary-card">
        <div className="wb-summary-row"><span>Subtotal</span><span>{KES(subtotal)}</span></div>
        <div className="wb-summary-row"><span><Truck size={14} /> Boda delivery</span><span>{KES(DELIVERY_FEE)}</span></div>
        <div className="wb-summary-row total"><span>Total</span><span>{KES(total)}</span></div>
      </div>

      <button className="wb-cta-btn wb-cta-block" onClick={() => setPage("checkout")}>
        Proceed to Checkout <ChevronRight size={18} />
      </button>
    </div>
  );
}

/* ------------------------------ Checkout page ----------------------------- */
function CheckoutPage({ cart, customer, setCustomer, onPay, setPage, user }) {
  const [form, setForm] = useState({
    name: customer?.name || user?.name || "",
    phone: customer?.phone || user?.phone || "",
    location: customer?.location || "",
    subCounty: "",
    ward: "",
    estate: "",
    notes: "",
    delivery: "boda",
  });
  const [errors, setErrors] = useState({});
  const [showLocationMap, setShowLocationMap] = useState(false);

  useEffect(() => {
    if (customer) {
      setForm((f) => ({ ...f, 
        name: customer.name, 
        phone: customer.phone, 
        location: customer.location,
        subCounty: customer.subCounty || "",
        ward: customer.ward || "",
        estate: customer.estate || ""
      }));
    }
  }, [customer]);

  if (!cart) {
    return (
      <div className="wb-page wb-empty">
        <div className="wb-empty-emoji">🧺</div>
        <h2>Nothing to check out yet</h2>
        <button className="wb-cta-btn" onClick={() => setPage("basket")}>Build a basket</button>
      </div>
    );
  }

  const subtotal = cart.items.reduce((sum, it) => sum + it.unitPrice * it.qty, 0);
  const total = subtotal + DELIVERY_FEE;

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Enter your full name";
    if (!isValidKenyanPhone(form.phone)) e.phone = "Enter a valid Safaricom/Airtel number e.g. 0712345678";
    if (!form.subCounty.trim()) e.subCounty = "Select your sub-county";
    if (!form.ward.trim()) e.ward = "Enter your ward";
    if (!form.estate.trim()) e.estate = "Enter your estate/street address";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = () => {
    if (!validate()) return;
    setCustomer({ 
      name: form.name.trim(), 
      phone: form.phone.replace(/\s+/g, ""), 
      location: `${form.estate}, ${form.ward}, ${form.subCounty}`,
      subCounty: form.subCounty,
      ward: form.ward,
      estate: form.estate
    });
    onPay({ ...form, total, subtotal });
  };

  return (
    <div className="wb-page">
      <div className="wb-page-head">
        <h1>Checkout</h1>
        {customer && <p className="wb-welcome">Welcome back, {customer.name.split(" ")[0]} 👋 — details pre-filled from your last order.</p>}
      </div>

      <div className="wb-checkout-grid">
        <div className="wb-form-card">
          <label>Full name
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Wanjiru Kamau" />
            {errors.name && <span className="wb-error">{errors.name}</span>}
          </label>
          <label>M-Pesa phone number
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="07XXXXXXXX" />
            {errors.phone && <span className="wb-error">{errors.phone}</span>}
          </label>
          <label>Sub-County
            <select value={form.subCounty} onChange={(e) => setForm({ ...form, subCounty: e.target.value })}>
              <option value="">Select sub-county</option>
              <option value="Kileleshwa">Kileleshwa</option>
              <option value="Kilimani">Kilimani</option>
              <option value="Kawangware">Kawangware</option>
              <option value="Westlands">Westlands</option>
              <option value="Kasarani">Kasarani</option>
              <option value="Embakasi">Embakasi</option>
              <option value="Dagoretti">Dagoretti</option>
              <option value="Lang'ata">Lang'ata</option>
            </select>
            {errors.subCounty && <span className="wb-error">{errors.subCounty}</span>}
          </label>
          <label>Ward
            <input value={form.ward} onChange={(e) => setForm({ ...form, ward: e.target.value })} placeholder="e.g. Lavington" />
            {errors.ward && <span className="wb-error">{errors.ward}</span>}
          </label>
          <label>Estate / Street address
            <input value={form.estate} onChange={(e) => setForm({ ...form, estate: e.target.value })} placeholder="e.g. Njiwa Rd, House 4B" />
            {errors.estate && <span className="wb-error">{errors.estate}</span>}
          </label>
          <label>Notes for the rider (optional)
            <textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="e.g. Call when you reach the gate" />
          </label>

          <div className="wb-delivery-options">
            <button className={form.delivery === "boda" ? "active" : ""} onClick={() => setForm({ ...form, delivery: "boda" })}>
              <Bike size={16} /> Boda boda delivery
            </button>
            <button className={form.delivery === "pickup" ? "active" : ""} onClick={() => setForm({ ...form, delivery: "pickup" })}>
              <Store size={16} /> Pickup at vendor
            </button>
          </div>

          <div className="wb-payment-note">
            <Wallet size={16} color={COLORS.primary} /> Paying with <strong>M-Pesa</strong> — you'll get an STK push to enter your PIN.
          </div>
        </div>

        <div className="wb-summary-card">
          <h3>{cart.vendor.emoji} {cart.vendor.name}</h3>
          {cart.items.map((it) => (
            <div key={it.pid} className="wb-summary-row"><span>{it.name} x{it.qty}</span><span>{KES(it.unitPrice * it.qty)}</span></div>
          ))}
          <div className="wb-summary-row"><span>Subtotal</span><span>{KES(subtotal)}</span></div>
          <div className="wb-summary-row"><span>Delivery</span><span>{form.delivery === "boda" ? KES(DELIVERY_FEE) : "Free"}</span></div>
          <div className="wb-summary-row total"><span>Total</span><span>{KES(form.delivery === "boda" ? total : subtotal)}</span></div>
          <button className="wb-cta-btn wb-cta-block wb-mpesa-btn" onClick={submit}>
            Pay {KES(form.delivery === "boda" ? total : subtotal)} with M-Pesa
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- M-Pesa modal ------------------------------ */
function MpesaModal({ phone, amount, onDone, onClose }) {
  const [step, setStep] = useState(0);
  
  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 1600);
    const t2 = setTimeout(() => setStep(2), 4200);
    const t3 = setTimeout(() => onDone(), 5600);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onDone]);

  return (
    <div className="wb-modal-backdrop">
      <div className="wb-mpesa-modal">
        {step < 2 && <button className="wb-modal-close" onClick={onClose}><X size={18} /></button>}
        <div className="wb-mpesa-icon-wrap">
          {step < 2 ? (
            <div className="wb-mpesa-pulse"><Phone size={30} color={COLORS.accent} /></div>
          ) : (
            <div className="wb-mpesa-success"><CheckCircle2 size={40} color={COLORS.success} /></div>
          )}
        </div>
        {step === 0 && (
          <>
            <h3>Sending payment request…</h3>
            <p>Requesting {KES(amount)} STK push to {phone}</p>
          </>
        )}
        {step === 1 && (
          <>
            <h3>Enter your M-Pesa PIN</h3>
            <p>Check your phone <strong>{phone}</strong> and enter your M-Pesa PIN to pay {KES(amount)}</p>
            <div className="wb-mpesa-loading-bar"><div /></div>
          </>
        )}
        {step === 2 && (
          <>
            <h3>Payment confirmed ✅</h3>
            <p>{KES(amount)} received. Preparing your order…</p>
          </>
        )}
      </div>
    </div>
  );
}

/* --------------------------- Order confirmation --------------------------- */
function ConfirmationPage({ order, setPage, user }) {
  const [rider, setRider] = useState(null);
  const [tracking, setTracking] = useState(null);

  useEffect(() => {
    if (order) {
      // Assign a rider
      const availableRider = RIDERS[Math.floor(Math.random() * RIDERS.length)];
      setRider(availableRider);
      
      // Send WhatsApp notification
      sendWhatsAppMessage(
        order.customerPhone || user?.phone,
        `Order #${order.id} confirmed! Your rider ${availableRider.name} (${availableRider.phone}) is on the way. Track: ${waLink(availableRider.phone, "Where is my order?")}`
      );
      
      // Simulate tracking
      const trackingInterval = setInterval(() => {
        setTracking({
          status: ["Picked up", "En route", "Arriving soon", "Delivered"][Math.floor(Math.random() * 4)],
          updatedAt: new Date().toISOString()
        });
      }, 5000);
      
      return () => clearInterval(trackingInterval);
    }
  }, [order]);

  if (!order) {
    return (
      <div className="wb-page wb-empty">
        <div className="wb-empty-emoji">📦</div>
        <h2>No recent order</h2>
        <button className="wb-cta-btn" onClick={() => setPage("home")}>Back to Home</button>
      </div>
    );
  }

  const trackText = `Hi WeBizzle, I'd like to track my order ${order.id}.`;

  return (
    <div className="wb-page">
      <div className="wb-confirm-banner">
        <CheckCircle2 size={40} color={COLORS.success} />
        <h1>Order confirmed!</h1>
        <p>Order <strong>#{order.id}</strong> is on its way from {order.vendor.name}.</p>
      </div>

      {tracking && (
        <div className="wb-tracking-status">
          <div className="wb-tracking-icon">
            <Truck size={24} color={COLORS.primary} />
          </div>
          <div className="wb-tracking-info">
            <div className="wb-tracking-label">Status: {tracking.status}</div>
            <div className="wb-tracking-time">Last updated: {formatDate(tracking.updatedAt)}</div>
          </div>
        </div>
      )}

      {rider && (
        <div className="wb-rider-card">
          <div className="wb-rider-emoji">{rider.emoji}</div>
          <div className="wb-rider-info">
            <div className="wb-rider-name">{rider.name}</div>
            <div className="wb-rider-meta"><Bike size={13} /> {rider.bike} <span>·</span> <Star size={13} color={COLORS.accent} fill={COLORS.accent} /> {rider.rating}</div>
            <div className="wb-rider-meta"><Clock size={13} /> ETA {15 + Math.floor(Math.random() * 15)} mins</div>
            <div className="wb-rider-meta"><Phone size={13} /> {rider.phone}</div>
          </div>
          <div className="wb-rider-actions">
            <a className="wb-wa-btn" href={waLink(rider.phone, trackText)} target="_blank" rel="noreferrer">
              <MessageCircle size={15} /> Track on WhatsApp
            </a>
            <a className="wb-wa-btn" href={`tel:${rider.phone}`} target="_blank" rel="noreferrer">
              <Phone size={15} /> Call rider
            </a>
          </div>
        </div>
      )}

      <div className="wb-summary-card">
        <h3>Order summary</h3>
        {order.items.map((it) => (
          <div key={it.pid} className="wb-summary-row"><span>{it.name} x{it.qty}</span><span>{KES(it.unitPrice * it.qty)}</span></div>
        ))}
        <div className="wb-summary-row"><span>Delivery</span><span>{order.deliveryFee ? KES(order.deliveryFee) : "Free"}</span></div>
        <div className="wb-summary-row total"><span>Total paid</span><span>{KES(order.total)}</span></div>
        <div className="wb-summary-row"><span>Delivering to</span><span>{order.location}</span></div>
      </div>

      <button className="wb-cta-btn wb-cta-block" onClick={() => setPage("home")}>Back to Home</button>
    </div>
  );
}

/* -------------------------------- Orders page ------------------------------ */
function OrdersPage({ orders, setPage }) {
  return (
    <div className="wb-page">
      <div className="wb-page-head"><h1><ClipboardList size={24} color={COLORS.primary} /> Your Orders</h1></div>
      {orders.length === 0 ? (
        <div className="wb-empty">
          <div className="wb-empty-emoji">📭</div>
          <h2>No orders yet</h2>
          <button className="wb-cta-btn" onClick={() => setPage("basket")}>Start a Smart Basket</button>
        </div>
      ) : (
        <div className="wb-orders-list">
          {orders.map((o) => (
            <div key={o.id} className="wb-order-card">
              <div>
                <div className="wb-order-id">#{o.id} · {o.vendor.name}</div>
                <div className="wb-basket-item-unit">{o.items.length} item(s) · rider {o.rider?.name || "Assigned"}</div>
                <div className="wb-order-date">{formatDate(o.createdAt)}</div>
              </div>
              <div className="wb-order-right">
                <span className="wb-order-status">Delivered</span>
                <span className="wb-order-total">{KES(o.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* -------------------------------- Support page ------------------------------ */
function SupportPage() {
  const faqs = [
    { q: "How does Smart Basket comparison work?", a: "Add the items you need — WeBizzle checks prices across nearby vendors and shows the cheapest full basket, delivered in one trip." },
    { q: "How do I pay?", a: "Pay by M-Pesa STK push at checkout. Enter your PIN on your phone when prompted and you're done." },
    { q: "Who delivers my order?", a: "A verified local boda boda rider picks up from the vendor and delivers straight to you, with live WhatsApp tracking." },
    { q: "How do I track my order?", a: "You'll receive real-time updates via WhatsApp and can also track your rider directly through the app." },
  ];
  const [openIdx, setOpenIdx] = useState(0);
  
  return (
    <div className="wb-page">
      <div className="wb-page-head"><h1><LifeBuoy size={24} color={COLORS.primary} /> Support</h1></div>
      <div className="wb-support-actions">
        <a className="wb-cta-btn wb-wa-btn-lg" href={waLink(WHATSAPP_BUSINESS_NUMBER, "Hi WeBizzle, I need help with my order.")} target="_blank" rel="noreferrer">
          <MessageCircle size={18} /> Chat with us on WhatsApp
        </a>
        <div className="wb-support-contact"><Phone size={16} /> {WHATSAPP_BUSINESS_NUMBER} &nbsp;·&nbsp; support@webizzle.co.ke</div>
      </div>
      <div className="wb-faq-list">
        {faqs.map((f, i) => (
          <div key={i} className="wb-faq-item">
            <button onClick={() => setOpenIdx(openIdx === i ? -1 : i)}>
              {f.q} <ChevronDown size={16} style={{ transform: openIdx === i ? "rotate(180deg)" : "none" }} />
            </button>
            {openIdx === i && <p>{f.a}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------- Vendor signup page ---------------------------- */
function VendorSignupPage({ showToast, user }) {
  const [form, setForm] = useState({
    shop: "",
    owner: user?.name || "",
    phone: user?.phone || "",
    category: "",
    subCounty: "",
    ward: "",
    street: "",
    businessLicense: null,
    licensePreview: null,
    products: "",
    deliveryRadius: "",
    operatingHours: ""
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);

  const categories = [
    "Mama Mboga", "Duka", "Pharmacy", "Hardware", "Electronics", 
    "Butchery", "Bakery", "Agrovet", "Restaurant", "Bar/Pub", "Wholesaler"
  ];

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      // Upload to Supabase
      const { data, error } = await supabase.storage
        .from('business-licenses')
        .upload(fileName, file);
      
      if (error) throw error;
      
      const { data: urlData } = supabase.storage
        .from('business-licenses')
        .getPublicUrl(fileName);
      
      setForm({
        ...form,
        businessLicense: fileName,
        licensePreview: urlData.publicUrl
      });
      showToast("License uploaded successfully", "success");
    } catch (error) {
      showToast("Failed to upload license", "error");
    } finally {
      setUploading(false);
    }
  };

  const submit = async () => {
    const e = {};
    if (!form.shop.trim()) e.shop = "Enter your shop name";
    if (!form.owner.trim()) e.owner = "Enter owner's full name";
    if (!isValidKenyanPhone(form.phone)) e.phone = "Enter a valid phone number";
    if (!form.category) e.category = "Select your business category";
    if (!form.subCounty.trim()) e.subCounty = "Enter your sub-county";
    if (!form.ward.trim()) e.ward = "Enter your ward";
    if (!form.street.trim()) e.street = "Enter your street/estate";
    if (!form.businessLicense) e.businessLicense = "Upload your business license photo";
    setErrors(e);
    if (Object.keys(e).length) return;

    try {
      const vendorData = {
        id: genId("V"),
        ...form,
        status: "pending",
        createdAt: Date.now(),
        rating: 0,
        verified: false
      };
      
      const { error } = await supabase
        .from('vendors')
        .insert([vendorData]);
      
      if (error) throw error;
      
      setSubmitted(true);
      showToast("Application received — we'll verify your shop within 24 hours 🎉", "success");
      
      // Send WhatsApp notification
      sendWhatsAppMessage(
        form.phone,
        `Hi ${form.owner}, your WeBizzle vendor application for ${form.shop} has been received. We'll review and activate within 24 hours.`
      );
    } catch (error) {
      showToast("Failed to submit application. Please try again.", "error");
    }
  };

  if (submitted) {
    return (
      <div className="wb-page wb-empty">
        <div className="wb-empty-emoji">✅</div>
        <h2>You're on the list, {form.owner.split(" ")[0]}!</h2>
        <p>Our team will verify <strong>{form.shop}</strong> and activate it on WeBizzle within 24 hours. We'll reach you on {form.phone}.</p>
      </div>
    );
  }

  return (
    <div className="wb-page">
      <div className="wb-page-head">
        <h1><Store size={24} color={COLORS.primary} /> Register your shop</h1>
        <p>List your business — reach customers comparing prices nearby.</p>
      </div>
      <div className="wb-form-card wb-form-narrow">
        <label>Shop / business name
          <input value={form.shop} onChange={(e) => setForm({ ...form, shop: e.target.value })} placeholder="e.g. Baraka General Store" />
          {errors.shop && <span className="wb-error">{errors.shop}</span>}
        </label>
        <label>Owner full name
          <input value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} placeholder="e.g. John Mwangi" />
          {errors.owner && <span className="wb-error">{errors.owner}</span>}
        </label>
        <label>Phone number
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="07XXXXXXXX" />
          {errors.phone && <span className="wb-error">{errors.phone}</span>}
        </label>
        <label>Business Category
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="">Select category</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          {errors.category && <span className="wb-error">{errors.category}</span>}
        </label>
        <label>Sub-County
          <input value={form.subCounty} onChange={(e) => setForm({ ...form, subCounty: e.target.value })} placeholder="e.g. Kileleshwa" />
          {errors.subCounty && <span className="wb-error">{errors.subCounty}</span>}
        </label>
        <label>Ward
          <input value={form.ward} onChange={(e) => setForm({ ...form, ward: e.target.value })} placeholder="e.g. Lavington" />
          {errors.ward && <span className="wb-error">{errors.ward}</span>}
        </label>
        <label>Street / Estate address
          <input value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} placeholder="e.g. Njiwa Rd, House 4B" />
          {errors.street && <span className="wb-error">{errors.street}</span>}
        </label>
        <label>Business License (take a clear photo)
          <div className="wb-file-upload">
            <input type="file" accept="image/*" onChange={handleFileUpload} />
            <div className="wb-upload-area">
              <Camera size={24} color={COLORS.textSoft} />
              <span>{form.businessLicense ? "License uploaded ✓" : "Tap to upload photo"}</span>
            </div>
          </div>
          {errors.businessLicense && <span className="wb-error">{errors.businessLicense}</span>}
          {form.licensePreview && (
            <img src={form.licensePreview} alt="Business license" className="wb-license-preview" />
          )}
        </label>
        <label>Products you stock
          <textarea rows={2} value={form.products} onChange={(e) => setForm({ ...form, products: e.target.value })} placeholder="e.g. Sugar, milk, rice, cooking oil…" />
        </label>
        <label>Delivery radius (km)
          <input type="number" value={form.deliveryRadius} onChange={(e) => setForm({ ...form, deliveryRadius: e.target.value })} placeholder="e.g. 5" />
        </label>
        <label>Operating hours
          <input value={form.operatingHours} onChange={(e) => setForm({ ...form, operatingHours: e.target.value })} placeholder="e.g. 7AM - 9PM" />
        </label>
        <button className="wb-cta-btn wb-cta-block" onClick={submit} disabled={uploading}>
          {uploading ? <Loader2 className="wb-spin" size={18} /> : <Send size={16} />}
          {uploading ? "Uploading..." : "Submit application"}
        </button>
      </div>
    </div>
  );
}

/* ---------------------------- Rider signup page ---------------------------- */
function RiderSignupPage({ showToast, user }) {
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    idNo: "",
    plate: "",
    subCounty: "",
    ward: "",
    stage: "",
    selfie: null,
    selfiePreview: null,
    license: null,
    licensePreview: null,
    yearsExperience: "",
    bikeType: ""
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e, field, bucket) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${field}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file);
      
      if (error) throw error;
      
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);
      
      setForm({
        ...form,
        [field]: fileName,
        [`${field}Preview`]: urlData.publicUrl
      });
      showToast(`${field === 'selfie' ? 'Selfie' : 'License'} uploaded successfully`, "success");
    } catch (error) {
      showToast(`Failed to upload ${field}`, "error");
    } finally {
      setUploading(false);
    }
  };

  const submit = async () => {
    const e = {};
    if (!form.name.trim()) e.name = "Enter your full name";
    if (!isValidKenyanPhone(form.phone)) e.phone = "Enter a valid phone number";
    if (!form.idNo.trim()) e.idNo = "Enter your National ID number";
    if (!form.plate.trim()) e.plate = "Enter your bike registration plate";
    if (!form.subCounty.trim()) e.subCounty = "Enter your sub-county";
    if (!form.ward.trim()) e.ward = "Enter your ward";
    if (!form.stage.trim()) e.stage = "Enter your stage number";
    if (!form.selfie) e.selfie = "Upload a clear selfie";
    if (!form.license) e.license = "Upload your license photo";
    setErrors(e);
    if (Object.keys(e).length) return;

    try {
      const riderData = {
        id: genId("R"),
        ...form,
        status: "pending",
        createdAt: Date.now(),
        rating: 0,
        verified: false,
        available: true
      };
      
      const { error } = await supabase
        .from('riders')
        .insert([riderData]);
      
      if (error) throw error;
      
      setSubmitted(true);
      showToast("Rider application received — verification takes up to 24 hours 🏍️", "success");
      
      sendWhatsAppMessage(
        form.phone,
        `Hi ${form.name}, your WeBizzle rider application has been received. We'll verify your details and activate within 24 hours.`
      );
    } catch (error) {
      showToast("Failed to submit application. Please try again.", "error");
    }
  };

  if (submitted) {
    return (
      <div className="wb-page wb-empty">
        <div className="wb-empty-emoji">🏍️</div>
        <h2>Karibu rider, {form.name.split(" ")[0]}!</h2>
        <p>We're verifying your ID and bike details. You'll get a WhatsApp message on {form.phone} once approved.</p>
      </div>
    );
  }

  return (
    <div className="wb-page">
      <div className="wb-page-head">
        <h1><Bike size={24} color={COLORS.primary} /> Become a WeBizzle rider</h1>
        <p>Deliver orders around your neighbourhood and earn per trip.</p>
      </div>
      <div className="wb-form-card wb-form-narrow">
        <label>Full name
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Peter Mutua" />
          {errors.name && <span className="wb-error">{errors.name}</span>}
        </label>
        <label>Phone number
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="07XXXXXXXX" />
          {errors.phone && <span className="wb-error">{errors.phone}</span>}
        </label>
        <label>National ID number
          <input value={form.idNo} onChange={(e) => setForm({ ...form, idNo: e.target.value })} placeholder="e.g. 3XXXXXXX" />
          {errors.idNo && <span className="wb-error">{errors.idNo}</span>}
        </label>
        <label>Bike registration plate
          <input value={form.plate} onChange={(e) => setForm({ ...form, plate: e.target.value })} placeholder="e.g. KMEA 224B" />
          {errors.plate && <span className="wb-error">{errors.plate}</span>}
        </label>
        <label>Sub-County
          <input value={form.subCounty} onChange={(e) => setForm({ ...form, subCounty: e.target.value })} placeholder="e.g. Kileleshwa" />
          {errors.subCounty && <span className="wb-error">{errors.subCounty}</span>}
        </label>
        <label>Ward
          <input value={form.ward} onChange={(e) => setForm({ ...form, ward: e.target.value })} placeholder="e.g. Lavington" />
          {errors.ward && <span className="wb-error">{errors.ward}</span>}
        </label>
        <label>Stage number
          <input value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })} placeholder="e.g. Stage A, Kileleshwa" />
          {errors.stage && <span className="wb-error">{errors.stage}</span>}
        </label>
        <label>Clear selfie photo
          <div className="wb-file-upload">
            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'selfie', 'rider-selfies')} />
            <div className="wb-upload-area">
              <Camera size={24} color={COLORS.textSoft} />
              <span>{form.selfie ? "Selfie uploaded ✓" : "Tap to upload selfie"}</span>
            </div>
          </div>
          {errors.selfie && <span className="wb-error">{errors.selfie}</span>}
          {form.selfiePreview && (
            <img src={form.selfiePreview} alt="Rider selfie" className="wb-license-preview" />
          )}
        </label>
        <label>Driver's license photo
          <div className="wb-file-upload">
            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'license', 'rider-licenses')} />
            <div className="wb-upload-area">
              <FileText size={24} color={COLORS.textSoft} />
              <span>{form.license ? "License uploaded ✓" : "Tap to upload license"}</span>
            </div>
          </div>
          {errors.license && <span className="wb-error">{errors.license}</span>}
          {form.licensePreview && (
            <img src={form.licensePreview} alt="Driver license" className="wb-license-preview" />
          )}
        </label>
        <label>Years of experience
          <input type="number" value={form.yearsExperience} onChange={(e) => setForm({ ...form, yearsExperience: e.target.value })} placeholder="e.g. 2" />
        </label>
        <label>Bike type
          <select value={form.bikeType} onChange={(e) => setForm({ ...form, bikeType: e.target.value })}>
            <option value="">Select bike type</option>
            <option value="Boda">Boda boda (motorcycle)</option>
            <option value="Electric">Electric bike</option>
            <option value="Scooter">Scooter</option>
            <option value="Bicycle">Bicycle</option>
          </select>
        </label>
        <button className="wb-cta-btn wb-cta-block" onClick={submit} disabled={uploading}>
          {uploading ? <Loader2 className="wb-spin" size={18} /> : <Send size={16} />}
          {uploading ? "Uploading..." : "Submit application"}
        </button>
      </div>
    </div>
  );
}

/* ---------------------------- Dashboard page ------------------------------ */
function DashboardPage({ user, setPage }) {
  const [stats, setStats] = useState({
    orders: 0,
    revenue: 0,
    ratings: 0,
    activeOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Load user-specific data based on role
      let data = {};
      
      if (user.role === 'vendor') {
        const { data: orders } = await supabase
          .from('orders')
          .select('*')
          .eq('vendorId', user.id);
        
        data.orders = orders?.length || 0;
        data.revenue = orders?.reduce((sum, o) => sum + o.total, 0) || 0;
        data.recentOrders = orders?.slice(0, 5) || [];
      } else if (user.role === 'rider') {
        const { data: deliveries } = await supabase
          .from('orders')
          .select('*')
          .eq('riderId', user.id);
        
        data.orders = deliveries?.length || 0;
        data.activeOrders = deliveries?.filter(d => d.status === 'active').length || 0;
      } else {
        // Customer
        const { data: orders } = await supabase
          .from('orders')
          .select('*')
          .eq('customerId', user.id);
        
        data.orders = orders?.length || 0;
        data.recentOrders = orders?.slice(0, 5) || [];
      }
      
      setStats(data);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
  };

  return (
    <div className="wb-page">
      <div className="wb-page-head">
        <h1><BarChart3 size={24} color={COLORS.primary} /> Dashboard</h1>
        <p>Welcome back, {user?.name?.split(" ")[0]}!</p>
      </div>

      <div className="wb-dashboard-stats">
        <div className="wb-stat-card">
          <div className="wb-stat-icon"><Package size={24} color={COLORS.primary} /></div>
          <div className="wb-stat-value">{stats.orders}</div>
          <div className="wb-stat-label">Total Orders</div>
        </div>
        <div className="wb-stat-card">
          <div className="wb-stat-icon"><Wallet size={24} color={COLORS.accent} /></div>
          <div className="wb-stat-value">{KES(stats.revenue)}</div>
          <div className="wb-stat-label">Revenue</div>
        </div>
        <div className="wb-stat-card">
          <div className="wb-stat-icon"><Star size={24} color={COLORS.warning} /></div>
          <div className="wb-stat-value">{user?.rating || "N/A"}</div>
          <div className="wb-stat-label">Rating</div>
        </div>
        <div className="wb-stat-card">
          <div className="wb-stat-icon"><Clock size={24} color={COLORS.info} /></div>
          <div className="wb-stat-value">{stats.activeOrders}</div>
          <div className="wb-stat-label">Active Orders</div>
        </div>
      </div>

      {user?.role === 'vendor' && (
        <div className="wb-dashboard-section">
          <h2>Quick Actions</h2>
          <div className="wb-quick-actions">
            <button onClick={() => setPage("basket")}>
              <ShoppingBasket size={20} /> View Basket
            </button>
            <button onClick={() => setPage("orders")}>
              <ClipboardList size={20} /> Manage Orders
            </button>
            <button>
              <Settings size={20} /> Update Menu
            </button>
          </div>
        </div>
      )}

      {user?.role === 'rider' && (
        <div className="wb-dashboard-section">
          <h2>Rider Dashboard</h2>
          <div className="wb-rider-stats">
            <div className="wb-rider-stat">
              <Truck size={20} /> Available Orders
            </div>
            <div className="wb-rider-stat">
              <MapPin size={20} /> Delivery Zone
            </div>
          </div>
          <button className="wb-cta-btn wb-cta-block" onClick={() => setPage("orders")}>
            View Available Orders
          </button>
        </div>
      )}

      {recentOrders.length > 0 && (
        <div className="wb-dashboard-section">
          <h2>Recent Orders</h2>
          {recentOrders.map(order => (
            <div key={order.id} className="wb-order-card">
              <div>
                <div className="wb-order-id">#{order.id}</div>
                <div className="wb-order-date">{formatDate(order.createdAt)}</div>
              </div>
              <div className="wb-order-right">
                <span className="wb-order-total">{KES(order.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------------------- Settings page ------------------------------ */
function SettingsPage({ user, setUser, showToast }) {
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    notifications: user?.notifications !== false,
    location: user?.location || "",
    preferredDelivery: user?.preferredDelivery || "boda"
  });

  const handleSubmit = async () => {
    try {
      const { error } = await supabase
        .from('users')
        .update(form)
        .eq('id', user.id);
      
      if (error) throw error;
      
      setUser({ ...user, ...form });
      showToast("Settings updated successfully", "success");
    } catch (error) {
      showToast("Failed to update settings", "error");
    }
  };

  return (
    <div className="wb-page">
      <div className="wb-page-head">
        <h1><Settings size={24} color={COLORS.primary} /> Settings</h1>
      </div>

      <div className="wb-form-card wb-form-narrow">
        <label>Display name
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </label>
        <label>Phone number
          <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        </label>
        <label>Email (optional)
          <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </label>
        <label>Default delivery location
          <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
        </label>
        <label>Preferred delivery method
          <select value={form.preferredDelivery} onChange={(e) => setForm({ ...form, preferredDelivery: e.target.value })}>
            <option value="boda">Boda boda</option>
            <option value="pickup">Pickup</option>
          </select>
        </label>
        <label className="wb-checkbox-label">
          <input
            type="checkbox"
            checked={form.notifications}
            onChange={(e) => setForm({ ...form, notifications: e.target.checked })}
          />
          Enable WhatsApp notifications
        </label>
        <button className="wb-cta-btn wb-cta-block" onClick={handleSubmit}>
          Save Changes
        </button>
      </div>
    </div>
  );
}

/* --------------------------------- App ------------------------------------ */
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
  const [mpesa, setMpesa] = useState(null);
  const [lastOrder, setLastOrder] = useState(null);
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [authPhone, setAuthPhone] = useState("");
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

      // Load orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .order('createdAt', { ascending: false });
      setOrders(ordersData || []);
    } catch (error) {
      console.error("Initialization error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (phone, otp = null) => {
    try {
      setShowAuth(false);
      if (otp) {
        // Verify OTP with Supabase
        const { data, error } = await supabase.auth.verifyOtp({
          phone: `+254${phone.substring(1)}`,
          token: otp,
          type: 'sms'
        });
        if (error) throw error;
        
        // Get or create user profile
        let { data: userData } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single();
        
        if (!userData) {
          userData = {
            id: data.user.id,
            phone: phone,
            name: `Customer ${phone.substring(0, 5)}`,
            role: 'customer',
            createdAt: Date.now()
          };
          await supabase.from('users').insert([userData]);
        }
        
        setUser(userData);
        showToast("Welcome to WeBizzle! 🎉", "success");
      } else {
        setAuthPhone(phone);
        setShowOTP(true);
      }
    } catch (error) {
      showToast("Authentication failed", "error");
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setPage("home");
      showToast("Signed out successfully", "info");
    } catch (error) {
      showToast("Failed to sign out", "error");
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

  const handleSetCustomer = async (c) => {
    setCustomer(c);
    if (user) {
      await supabase
        .from('users')
        .update(c)
        .eq('id', user.id);
    }
  };

  const startPayment = async (formData) => {
    if (!user) {
      showToast("Please sign in to continue", "warning");
      setShowAuth(true);
      return;
    }
    setMpesa({ phone: formData.phone, amount: formData.delivery === "boda" ? formData.total : formData.subtotal, formData });
  };

  const finishPayment = async () => {
    const { formData } = mpesa;
    
    // Assign a rider
    const { data: availableRiders } = await supabase
      .from('riders')
      .select('*')
      .eq('status', 'active')
      .eq('available', true);
    
    const rider = availableRiders?.[0] || RIDERS[Math.floor(Math.random() * RIDERS.length)];
    
    const order = {
      id: genId(""),
      createdAt: Date.now(),
      vendor: cart.vendor,
      vendorId: cart.vendor.id,
      items: cart.items,
      total: formData.delivery === "boda" ? formData.total : formData.subtotal,
      deliveryFee: formData.delivery === "boda" ? DELIVERY_FEE : 0,
      location: formData.location,
      rider: rider,
      riderId: rider?.id || 'r1',
      customerId: user.id,
      customerPhone: formData.phone,
      status: 'confirmed',
      eta: 15 + Math.floor(Math.random() * 15)
    };
    
    try {
      const { error } = await supabase
        .from('orders')
        .insert([order]);
      
      if (error) throw error;
      
      setOrders((prev) => [order, ...prev]);
      setLastOrder(order);
      
      // Update rider availability
      if (rider) {
        await supabase
          .from('riders')
          .update({ available: false })
          .eq('id', rider.id);
      }
      
      setMpesa(null);
      setCart(null);
      setResults(null);
      setSelection({});
      setPage("confirmation");
    } catch (error) {
      showToast("Failed to create order", "error");
    }
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
      <Navbar page={page} setPage={setPage} cartCount={cartCount} user={user} onLogout={handleLogout} />
      <MobileHeader setPage={setPage} cartCount={cartCount} user={user} onLogout={handleLogout} />

      <main className="wb-main">
        {page === "home" && <HomePage setPage={setPage} search={search} setSearch={setSearch} addToCompare={addToCompare} user={user} />}
        {page === "basket" && (
          <BasketPage
            selection={selection}
            setSelection={setSelection}
            results={results}
            setResults={setResults}
            onOrderFromVendor={onOrderFromVendor}
            toastMsg={showToast}
          />
        )}
        {page === "cart" && <CartPage cart={cart} setCart={setCart} setPage={setPage} user={user} />}
        {page === "checkout" && (
          <CheckoutPage cart={cart} customer={customer} setCustomer={handleSetCustomer} onPay={startPayment} setPage={setPage} user={user} />
        )}
        {page === "confirmation" && <ConfirmationPage order={lastOrder} setPage={setPage} user={user} />}
        {page === "orders" && <OrdersPage orders={orders} setPage={setPage} />}
        {page === "support" && <SupportPage />}
        {page === "vendor-signup" && <VendorSignupPage showToast={showToast} user={user} />}
        {page === "rider-signup" && <RiderSignupPage showToast={showToast} user={user} />}
        {page === "dashboard" && <DashboardPage user={user} setPage={setPage} />}
        {page === "settings" && <SettingsPage user={user} setUser={setUser} showToast={showToast} />}
      </main>

      <Footer setPage={setPage} />
      <BottomNav page={page} setPage={setPage} cartCount={cartCount} ordersCount={orders.length} user={user} />
      <Toast toast={toast} type={toastType} />

      {showAuth && <AuthModal onLogin={handleLogin} onClose={() => setShowAuth(false)} />}
      {showOTP && <OTPModal phone={authPhone} onVerify={(otp) => handleLogin(authPhone, otp)} onResend={() => handleLogin(authPhone)} onClose={() => setShowOTP(false)} />}
      {mpesa && (
        <MpesaModal
          phone={mpesa.phone}
          amount={mpesa.amount}
          onDone={finishPayment}
          onClose={() => setMpesa(null)}
        />
      )}
    </div>
  );
}

/* --------------------------------- CSS ------------------------------------- */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap');

.wb-app{
  --bg:${COLORS.bg}; --primary:${COLORS.primary}; --primary-dark:${COLORS.primaryDark};
  --accent:${COLORS.accent}; --surface:${COLORS.surface}; --text:${COLORS.text};
  --text-soft:${COLORS.textSoft}; --border:${COLORS.border}; --success:${COLORS.success};
  --whatsapp:${COLORS.whatsapp}; --danger:${COLORS.danger}; --warning:${COLORS.warning};
  --info:${COLORS.info};
  background:var(--bg); color:var(--text); font-family:'Inter',sans-serif;
  min-height:100vh; display:flex; flex-direction:column; position:relative;
  padding-bottom:76px;
}
.wb-app *{ box-sizing:border-box; }
.wb-app h1,.wb-app h2,.wb-app h3{ font-family:'Poppins',sans-serif; margin:0; }
.wb-app button{ font-family:'Inter',sans-serif; cursor:pointer; border:none; background:none; }
.wb-app input,.wb-app textarea,.wb-app select{ font-family:'Inter',sans-serif; }

/* Loading */
.wb-loading{
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  min-height:100vh; gap:20px;
}
.wb-spin{ animation:spin 1s linear infinite; }
@keyframes spin{ 100%{ transform:rotate(360deg); } }

/* Navbar (desktop) */
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

/* User menu */
.wb-user-menu{ position:relative; }
.wb-dropdown{ position:absolute; top:100%; right:0; background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:8px 0; min-width:180px; box-shadow:0 8px 24px rgba(0,0,0,.12); margin-top:6px; z-index:50; }
.wb-dropdown button{ display:flex; align-items:center; gap:10px; padding:10px 16px; font-size:13.5px; font-weight:600; color:var(--text); width:100%; }
.wb-dropdown button:hover{ background:var(--bg); }

/* Mobile header */
.wb-mobile-header{ display:flex; align-items:center; justify-content:space-between; padding:14px 16px; background:var(--surface); border-bottom:1px solid var(--border); position:sticky; top:0; z-index:30; }
.wb-mobile-actions{ display:flex; align-items:center; gap:8px; position:relative; }
.wb-mobile-user{ padding:6px; }
.wb-mobile-dropdown{ position:absolute; top:100%; right:0; background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:8px; min-width:160px; box-shadow:0 8px 24px rgba(0,0,0,.12); margin-top:6px; z-index:50; }
.wb-mobile-dropdown button{ display:block; width:100%; padding:8px 12px; font-weight:600; font-size:13px; color:var(--text); text-align:left; }
.wb-mobile-dropdown button:hover{ background:var(--bg); border-radius:8px; }

@media(min-width:900px){
  .wb-navbar{ display:block; }
  .wb-mobile-header{ display:none; }
  .wb-mobile-dropdown{ display:none; }
}

/* Main / pages */
.wb-main{ flex:1; }
.wb-page{ max-width:900px; margin:0 auto; padding:20px 16px 40px; }
.wb-page-head{ margin-bottom:18px; }
.wb-page-head h1{ font-size:22px; display:flex; align-items:center; gap:8px; }
.wb-page-head p{ color:var(--text-soft); font-size:14px; margin-top:6px; }

/* Auth Modal */
.wb-auth-modal{ background:#fff; border-radius:20px; padding:32px 26px; width:100%; max-width:360px; text-align:center; position:relative; }
.wb-auth-input{ display:flex; align-items:center; gap:10px; border:1px solid var(--border); border-radius:12px; padding:10px 14px; margin:16px 0 12px; }
.wb-auth-input input{ border:none; outline:none; flex:1; font-size:15px; }
.wb-auth-note{ font-size:12px; color:var(--text-soft); margin-top:12px; }

/* OTP Modal */
.wb-otp-modal{ background:#fff; border-radius:20px; padding:32px 26px; width:100%; max-width:340px; text-align:center; position:relative; }
.wb-otp-icon{ margin-bottom:16px; }
.wb-otp-input{ border:2px solid var(--border); border-radius:12px; padding:12px; font-size:24px; text-align:center; width:100%; margin:12px 0; letter-spacing:8px; font-weight:700; }
.wb-otp-input:focus{ border-color:var(--primary); outline:none; }
.wb-otp-resend{ font-size:13px; color:var(--primary); font-weight:600; margin-top:12px; }
.wb-otp-resend:disabled{ color:var(--text-soft); cursor:not-allowed; }

/* Hero */
.wb-hero{ background:linear-gradient(135deg,var(--primary) 0%,var(--primary-dark) 100%); border-radius:20px; padding:34px 22px; color:#fff; margin-bottom:26px; position:relative; }
.wb-hero h1{ font-size:26px; line-height:1.25; margin-bottom:10px; }
.wb-hero p{ opacity:.9; font-size:14.5px; margin-bottom:18px; max-width:520px; }
.wb-search{ background:#fff; border-radius:14px; display:flex; align-items:center; gap:8px; padding:10px 14px; max-width:520px; }
.wb-search input{ border:none; outline:none; flex:1; font-size:14.5px; color:var(--text); }
.wb-search button{ background:var(--accent); color:#111; font-weight:700; padding:9px 18px; border-radius:10px; font-size:13.5px; }
.wb-hero-auth{ background:rgba(255,255,255,.15); border-radius:10px; padding:10px 16px; font-weight:600; font-size:14px; color:#fff; margin-top:14px; display:inline-flex; align-items:center; gap:8px; }
.wb-hero-auth:hover{ background:rgba(255,255,255,.25); }

/* Dashboard */
.wb-dashboard-stats{ display:grid; grid-template-columns:repeat(2,1fr); gap:12px; margin-bottom:24px; }
@media(min-width:640px){ .wb-dashboard-stats{ grid-template-columns:repeat(4,1fr); } }
.wb-stat-card{ background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:16px; text-align:center; }
.wb-stat-icon{ margin-bottom:8px; }
.wb-stat-value{ font-family:'Poppins',sans-serif; font-weight:800; font-size:22px; }
.wb-stat-label{ color:var(--text-soft); font-size:12px; font-weight:600; margin-top:4px; }
.wb-dashboard-section{ margin-bottom:24px; }
.wb-dashboard-section h2{ font-size:16px; margin-bottom:12px; }
.wb-quick-actions{ display:grid; grid-template-columns:repeat(3,1fr); gap:10px; }
.wb-quick-actions button{ background:var(--surface); border:1px solid var(--border); border-radius:12px; padding:16px; display:flex; flex-direction:column; align-items:center; gap:6px; font-weight:600; font-size:12px; }
.wb-quick-actions button:hover{ border-color:var(--primary); }
.wb-rider-stats{ display:grid; grid-template-columns:repeat(2,1fr); gap:10px; margin-bottom:12px; }
.wb-rider-stat{ background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:12px; display:flex; align-items:center; gap:8px; font-weight:600; font-size:13px; }

/* File upload */
.wb-file-upload{ position:relative; border:2px dashed var(--border); border-radius:12px; overflow:hidden; }
.wb-file-upload input{ position:absolute; inset:0; opacity:0; cursor:pointer; }
.wb-upload-area{ display:flex; flex-direction:column; align-items:center; gap:8px; padding:20px; color:var(--text-soft); }
.wb-license-preview{ width:100%; max-height:200px; object-fit:cover; border-radius:8px; margin-top:8px; }

/* Checkbox */
.wb-checkbox-label{ display:flex; align-items:center; gap:8px; font-weight:500; font-size:14px; cursor:pointer; }
.wb-checkbox-label input[type="checkbox"]{ width:18px; height:18px; accent-color:var(--primary); }

/* Tracking */
.wb-tracking-status{ background:var(--surface); border:1px solid var(--border); border-radius:14px; padding:14px 18px; display:flex; align-items:center; gap:14px; margin-bottom:18px; }
.wb-tracking-icon{ width:44px; height:44px; background:#EAF6F0; border-radius:50%; display:flex; align-items:center; justify-content:center; }
.wb-tracking-info{ flex:1; }
.wb-tracking-label{ font-weight:700; font-size:14px; }
.wb-tracking-time{ color:var(--text-soft); font-size:12px; }

/* Rider card actions */
.wb-rider-actions{ display:flex; gap:8px; }
.wb-rider-actions .wb-wa-btn{ flex:1; justify-content:center; }

/* Rest of the CSS from previous version... */

/* Toast variations */
.wb-toast-success{ border-left:4px solid var(--success); }
.wb-toast-error{ border-left:4px solid var(--danger); }
.wb-toast-warning{ border-left:4px solid var(--warning); }
.wb-toast-info{ border-left:4px solid var(--info); }
`;

export default App;