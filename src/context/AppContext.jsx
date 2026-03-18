import { createContext, useState, useReducer, useEffect, useCallback } from "react";
import { T } from "../data/translations";
import { initProducts, LOW_STOCK_THRESHOLD } from "../data/products";
import { mockOrders } from "../data/orders";
import { DEFAULT_BIZ, getSOCIALS } from "../data/business";
import { initScheduledPosts } from "../data/scheduledPosts";
import { fmt } from "../utils/helpers";
import * as api from "../api/client";

function cartR(s, a) {
  switch (a.type) {
    case "ADD": {
      const e = s.find((i) => i.id === a.p.id || i._id === a.p._id);
      return e
        ? s.map((i) => ((i.id === a.p.id || i._id === a.p._id) ? { ...i, qty: i.qty + a.q } : i))
        : [...s, { ...a.p, qty: a.q }];
    }
    case "REMOVE":
      return s.filter((_, i) => i !== a.i);
    case "INC":
      return s.map((x, i) => (i === a.i ? { ...x, qty: x.qty + 1 } : x));
    case "DEC":
      return s.map((x, i) =>
        i === a.i ? { ...x, qty: Math.max(1, x.qty - 1) } : x
      );
    case "CLEAR":
      return [];
    default:
      return s;
  }
}

export const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState("mn");
  const [page, setPage] = useState("home");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showProductModal, setShowProductModal] = useState(null);
  const [cart, dc] = useReducer(cartR, []);
  const [wishIds, setWishIds] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [products, setProducts] = useState(initProducts);
  const [searchQ, setSearchQ] = useState("");
  const [selModel, setSelModel] = useState(null);
  const [selCat, setSelCat] = useState(null);
  const [sortBy, setSortBy] = useState("default");
  const [user, setUser] = useState(null);
  const [adminView, setAdminView] = useState(false);
  const [adminTab, setAdminTab] = useState("overview");
  const [orders, setOrders] = useState(mockOrders);
  const [checkoutStep, setCheckoutStep] = useState(0);
  const [showCheckout, setShowCheckout] = useState(false);
  const [payMethod, setPayMethod] = useState("qpay");
  const [deliveryMethod, setDeliveryMethod] = useState("ub");
  const [deliveryForm, setDeliveryForm] = useState({
    district: "",
    khoroo: "",
    building: "",
    apartment: "",
    note: "",
    phone2: "",
  });
  const [modalQty, setModalQty] = useState(1);
  const [checkoutForm, setCheckoutForm] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [schedulerOn, setSchedulerOn] = useState(true);
  const [scheduledPosts, setScheduledPosts] = useState(initScheduledPosts);
  const [stockAlerts, setStockAlerts] = useState([]);
  const [showShareModal, setShowShareModal] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotifs, setShowNotifs] = useState(false);
  const [BIZ, setBIZ] = useState(DEFAULT_BIZ);
  const SOCIALS = getSOCIALS(BIZ);

  // Advice feature
  const [adviceModel, setAdviceModel] = useState("");
  const [adviceText, setAdviceText] = useState("");
  const [adviceFiles, setAdviceFiles] = useState([]);
  const [adviceLoading, setAdviceLoading] = useState(false);
  const [adviceHistory, setAdviceHistory] = useState([
    {
      id: 1,
      model: "Орон сууц",
      question: "Халаалт муу ажиллаж байна, юу хийх вэ?",
      answer:
        "Радиаторын агаар гаргах хэрэгтэй. Агаар хангалттай гарсан бол халаалтын шугамын даралт шалгах хэрэгтэй.",
      cost: "30,000-80,000₮",
      urgency: "high",
      date: "2026-02-26",
      files: [],
    },
    {
      id: 2,
      model: "Орон сууц",
      question: "Цахилгааны утас хуучирсан, солих уу?",
      answer:
        "Хуучин утас аюулгүй байдлын шаардлага хангахгүй бол солих хэрэгтэй. Мэргэжлийн цахилгаанчин дуудаж шалгуулаарай.",
      cost: "50,000-200,000₮",
      urgency: "med",
      date: "2026-02-25",
      files: [],
    },
    {
      id: 3,
      model: "Орон сууц",
      question: "Усны хоолой алдаж байна",
      answer:
        "Хоолойн холболтыг шалгаж, хэрэгтэй бол сантехникч дуудна уу. Түр зуур усны голын вентиль хаагаарай.",
      cost: "20,000-100,000₮",
      urgency: "high",
      date: "2026-02-24",
      files: [],
    },
  ]);

  // --- API data loading on mount ---
  useEffect(() => {
    // Load products from API
    api.fetchProducts()
      .then((data) => {
        setProducts(data);
        const lowStock = data.filter((p) => p.stock <= LOW_STOCK_THRESHOLD && p.stock > 0);
        setStockAlerts(lowStock);
        setNotifications(
          data
            .filter((p) => p.stock <= LOW_STOCK_THRESHOLD)
            .map((p, i) => ({ id: i, product: p, read: false, time: "Өнөөдөр" }))
        );
      })
      .catch(() => {
        // Fallback to mock data
        setStockAlerts(initProducts.filter((p) => p.stock <= LOW_STOCK_THRESHOLD && p.stock > 0));
        setNotifications(
          initProducts
            .filter((p) => p.stock <= LOW_STOCK_THRESHOLD)
            .map((p, i) => ({ id: i, product: p, read: false, time: "Өнөөдөр" }))
        );
      });

    // Load settings from API
    api.fetchSettings()
      .then((data) => { if (data && data.name) setBIZ(data); })
      .catch(() => {});

    // Restore JWT session
    const token = localStorage.getItem('token');
    if (token) {
      api.getMe()
        .then((u) => setUser(u))
        .catch(() => { api.setToken(null); });
    }
  }, []);

  // --- Async action helpers ---
  const loginUser = useCallback(async (email, password) => {
    const { token, user: u } = await api.login(email, password);
    api.setToken(token);
    setUser(u);
    return u;
  }, []);

  const registerUser = useCallback(async (name, email, password) => {
    const { token, user: u } = await api.register(name, email, password);
    api.setToken(token);
    setUser(u);
    return u;
  }, []);

  const logoutUser = useCallback(() => {
    api.setToken(null);
    setUser(null);
    setAdminView(false);
  }, []);

  const placeOrderAPI = useCallback(async (orderData) => {
    const order = await api.placeOrder(orderData);
    return order;
  }, []);

  const fetchOrdersAPI = useCallback(async () => {
    const data = await api.fetchOrders();
    setOrders(data);
    return data;
  }, []);

  const updateOrderStatusAPI = useCallback(async (id, status) => {
    const updated = await api.updateOrderStatus(id, status);
    setOrders((prev) => prev.map((o) => (o._id === id ? updated : o)));
    return updated;
  }, []);

  const saveSettingsAPI = useCallback(async (settings) => {
    const saved = await api.saveSettings(settings);
    setBIZ(saved);
    return saved;
  }, []);

  const refreshProducts = useCallback(async () => {
    const data = await api.fetchProducts();
    setProducts(data);
    return data;
  }, []);

  const t = T[lang];
  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const deliveryFee =
    deliveryMethod === "pickup"
      ? 0
      : deliveryMethod === "express"
      ? 15000
      : deliveryMethod === "province"
      ? 15000
      : deliveryMethod === "courier"
      ? 20000
      : cartTotal >= 100000
      ? 0
      : 5000;
  const grandTotal = cartTotal + deliveryFee;
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    document.title = t.brand;
    if (!document.getElementById("shield-fonts")) {
      const link = document.createElement("link");
      link.id = "shield-fonts";
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&family=Bebas+Neue&family=Oswald:wght@400;500;600;700&display=swap";
      document.head.appendChild(link);
    }
    if (BIZ.fbPixelId && !document.getElementById("fb-pixel")) {
      const s = document.createElement("script");
      s.id = "fb-pixel";
      s.innerHTML = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${BIZ.fbPixelId}');fbq('track','PageView');`;
      document.head.appendChild(s);
    }
    const setMeta = (prop, content) => {
      let m = document.querySelector(`meta[property="${prop}"]`);
      if (!m) {
        m = document.createElement("meta");
        m.setAttribute("property", prop);
        document.head.appendChild(m);
      }
      m.setAttribute("content", content);
    };
    setMeta("og:title", BIZ.name);
    setMeta(
      "og:description",
      "Сууц Өмчлөгчдийн Холбоо — Орон сууцны засвар үйлчилгээ. ☎️ " +
        BIZ.phone
    );
    setMeta("og:type", "website");
    setMeta("og:url", BIZ.facebook || "");
  }, [t.brand, BIZ.fbPixelId, BIZ.phone, BIZ.facebook]);

  const addToast = useCallback((m) => {
    const id = Date.now();
    setToasts((p) => [...p, { id, m }]);
    setTimeout(() => setToasts((p) => p.filter((x) => x.id !== id)), 2500);
  }, []);

  const navTo = (p) => {
    setPage(p);
    setShowCheckout(false);
    setMobileMenu(false);
    window.scrollTo(0, 0);
  };

  const filtered = products
    .filter((p) => {
      const n = lang === "mn" ? p.name.mn : p.name.en;
      return (
        n.toLowerCase().includes(searchQ.toLowerCase()) &&
        (!selModel || p.model === selModel) &&
        (!selCat || p.cat === selCat)
      );
    })
    .sort((a, b) => {
      if (sortBy === "priceLow") return a.price - b.price;
      if (sortBy === "priceHigh") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "name")
        return (lang === "mn" ? a.name.mn : a.name.en).localeCompare(
          lang === "mn" ? b.name.mn : b.name.en
        );
      return 0;
    });

  // Style helpers
  const bg = dark ? "bg-gray-900" : "bg-gray-50";
  const tx = dark ? "text-gray-100" : "text-gray-900";
  const txS = dark ? "text-gray-400" : "text-gray-500";
  const cd = dark ? "bg-gray-800" : "bg-white";
  const bd = dark ? "border-gray-700" : "border-gray-200";
  const inp = dark
    ? "bg-gray-700 text-gray-100 border-gray-600"
    : "bg-white text-gray-900 border-gray-300";
  const hdr = dark
    ? "bg-gray-800/95 backdrop-blur"
    : "bg-white/95 backdrop-blur";
  const aL = dark ? "bg-amber-500/20" : "bg-amber-50";

  const value = {
    dark, setDark, lang, setLang, page, setPage,
    mobileMenu, setMobileMenu, showCart, setShowCart,
    showAuth, setShowAuth, showProductModal, setShowProductModal,
    cart, dc, wishIds, setWishIds, toasts, setToasts,
    products, setProducts, searchQ, setSearchQ, selModel, setSelModel,
    selCat, setSelCat, sortBy, setSortBy,
    user, setUser, adminView, setAdminView, adminTab, setAdminTab,
    orders, setOrders, checkoutStep, setCheckoutStep,
    showCheckout, setShowCheckout, payMethod, setPayMethod,
    deliveryMethod, setDeliveryMethod, deliveryForm, setDeliveryForm,
    modalQty, setModalQty, checkoutForm, setCheckoutForm,
    schedulerOn, setSchedulerOn, scheduledPosts, setScheduledPosts,
    stockAlerts, showShareModal, setShowShareModal,
    notifications, setNotifications, showNotifs, setShowNotifs,
    BIZ, setBIZ, SOCIALS,
    adviceModel, setAdviceModel, adviceText, setAdviceText,
    adviceFiles, setAdviceFiles, adviceLoading, setAdviceLoading,
    adviceHistory, setAdviceHistory,
    t, cartTotal, cartCount, deliveryFee, grandTotal, unreadCount,
    fmt, addToast, navTo, filtered,
    bg, tx, txS, cd, bd, inp, hdr, aL,
    // API action helpers
    loginUser, registerUser, logoutUser,
    placeOrderAPI, fetchOrdersAPI, updateOrderStatusAPI,
    saveSettingsAPI, refreshProducts,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
