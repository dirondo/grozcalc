

const INITIAL_DATABASE = {
  Users: [
    { user_id: 1, email: "lietotajs@grozcalc.lv", password_hash: "hash_user123", role: "user", created_at: "2026-05-01 10:00:00" },
    { user_id: 2, email: "admin_deniss@grozcalc.lv", password_hash: "hash_admin456", role: "admin", created_at: "2026-05-01 10:00:00" }
  ],
  User_Profiles: [
    { profile_id: 1, user_id: 1, name: "Daniils", weight: 76.5, height: 182, age: 21, calorie_target: 2200, protein_target: 140, fat_target: 70, carbs_target: 220 },
    { profile_id: 2, user_id: 2, name: "Deniss (Admin)", weight: 80.0, height: 185, age: 22, calorie_target: 2400, protein_target: 150, fat_target: 75, carbs_target: 240 }
  ],
  Products: [
    { product_id: 1, name: "Valmieras biezpiens 0.5%", brand: "Valmiera", store: "Rimi", price: 1.39, calories: 80.0, protein: 16.0, fat: 0.5, carbs: 3.0, quality_badge: "Ļoti ieteicams" },
    { product_id: 2, name: "Baltais Vājpiena Biezpiens 0.5%", brand: "Baltais", store: "Rimi", price: 1.29, calories: 78.0, protein: 16.5, fat: 0.5, carbs: 2.0, quality_badge: "Ļoti ieteicams" },
    { product_id: 3, name: "Hanzas Maiznīca Tostmaize", brand: "Hanzas Maiznīca", store: "Rimi", price: 1.15, calories: 250.0, protein: 8.0, fat: 2.0, carbs: 50.0, quality_badge: "Neitrāls" },
    { product_id: 4, name: "Saldā biezpiena masa ar rozīnēm", brand: "Kārums", store: "Maxima", price: 1.89, calories: 310.0, protein: 9.0, fat: 14.0, carbs: 36.0, quality_badge: "Neieteicams" },
    { product_id: 5, name: "Šokolādes sieriņš Kārums", brand: "Kārums", store: "Maxima", price: 0.55, calories: 380.0, protein: 8.2, fat: 22.0, carbs: 36.0, quality_badge: "Neitrāls" },
    { product_id: 6, name: "Pilnpiena Biezpiens 9%", brand: "Valmiera", store: "Rimi", price: 1.59, calories: 154.0, protein: 16.0, fat: 9.0, carbs: 2.5, quality_badge: "Ļoti ieteicams" },
    { product_id: 7, name: "Alma piens 2.5%", brand: "Alma", store: "Maxima", price: 1.19, calories: 54.0, protein: 3.2, fat: 2.5, carbs: 4.7, quality_badge: "Ļoti ieteicams" },
    { product_id: 8, name: "Forevers Vistas krūtiņas fileja", brand: "Forevers", store: "Rimi", price: 5.99, calories: 115.0, protein: 23.5, fat: 1.5, carbs: 0.0, quality_badge: "Ļoti ieteicams" },
    { product_id: 9, name: "Well Done Olas M 10gb", brand: "Well Done", store: "Maxima", price: 1.79, calories: 143.0, protein: 12.6, fat: 9.5, carbs: 0.7, quality_badge: "Ļoti ieteicams" },
    { product_id: 10, name: "Selga Klasiskie cepumi", brand: "Selga", store: "Maxima", price: 0.89, calories: 440.0, protein: 7.5, fat: 14.0, carbs: 70.0, quality_badge: "Neieteicams" },
    { product_id: 11, name: "Lāču Īstā Rudzu maize", brand: "Lāči", store: "Rimi", price: 2.19, calories: 215.0, protein: 6.2, fat: 1.2, carbs: 44.0, quality_badge: "Ļoti ieteicams" },
    { product_id: 12, name: "Trikāta Siers Krievijas 50%", brand: "Trikāta", store: "Maxima", price: 2.49, calories: 345.0, protein: 24.0, fat: 28.0, carbs: 0.0, quality_badge: "Neitrāls" }
  ],
  Daily_Logs: [
    { log_id: 1, user_id: 1, log_date: getTodayDateString(), total_calories: 285.0, total_protein: 36.0, total_fat: 2.0, total_carbs: 31.0 }
  ],
  Log_Items: [
    { item_id: 1, log_id: 1, product_id: 1, meal_type: "Pusdienas", quantity_grams: 200, item_calories: 160.0, item_protein: 32.0, item_fat: 1.0, item_carbs: 6.0 },
    { item_id: 2, log_id: 1, product_id: 3, meal_type: "Pusdienas", quantity_grams: 50, item_calories: 125.0, item_protein: 4.0, item_fat: 1.0, item_carbs: 25.0 }
  ],
  Blacklist: [
    { blacklist_id: 1, user_id: 1, product_id: 4, reason: "Augsts cukura daudzums (24g uz 100g)", added_date: "2026-05-20 14:32:00" }
  ]
};

function getTodayDateString(offsetDays = 0) {
  const d = new Date();
  if (offsetDays !== 0) {
    d.setDate(d.getDate() + offsetDays);
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatDisplayDate(dateStr) {
  const [y, m, d] = dateStr.split('-');
  const monthsLV = ["Janvāris", "Februāris", "Marts", "Aprīlis", "Maijs", "Jūnijs", "Jūlijs", "Augusts", "Septembris", "Oktobris", "Novembris", "Decembris"];
  const monthIdx = parseInt(m, 10) - 1;
  return `${parseInt(d, 10)}. ${monthsLV[monthIdx]}`;
}

let currentUserId = parseInt(localStorage.getItem("grozcalc_active_user_id") || "1", 10);
let selectedDate = getTodayDateString();
let catalogSearchQuery = "";
let catalogStoreFilter = "Visi";
let catalogBadgeFilter = "Visi";
let catalogShowBlacklist = false;

class GrozCalcDB {
  constructor() {
    this.storageKey = "grozcalc_prototype_database_v2";
    this.isServerConnected = false;
    this.load();
  }

  load() {
    
    const raw = localStorage.getItem(this.storageKey);
    if (raw) {
      try {
        this.data = JSON.parse(raw);
      } catch (e) {
        console.error("Neizdevās nolasīt datus no localStorage:", e);
        this.data = JSON.parse(JSON.stringify(INITIAL_DATABASE));
      }
    } else {
      this.data = JSON.parse(JSON.stringify(INITIAL_DATABASE));
      this.saveLocal();
    }

    this.ensureTodayLog();

if (window.location.protocol.startsWith('http')) {
      fetch('/api/database')
        .then(res => {
          if (res.ok) return res.json();
          throw new Error('Serveris neatbild');
        })
        .then(serverData => {
          if (serverData && serverData.Products && serverData.Daily_Logs) {
            this.data = serverData;
            this.isServerConnected = true;
            this.saveLocal();
            this.ensureTodayLog();
            renderAll();
            console.log("Dati veiksmīgi sinhronizēti no servera database.json!");
          }
        })
        .catch(err => {
          console.log("Darbojas bez tiešā servera API (tiek izmantota localStorage)");
        });
    }
  }

  saveLocal() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.data));
    } catch (e) {
      console.error("Kļūda saglabājot localStorage:", e);
    }
  }

  save() {
    
    this.saveLocal();

if (window.location.protocol.startsWith('http')) {
      fetch('/api/database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.data)
      }).then(res => {
        if (res.ok) {
          this.isServerConnected = true;
          console.log("Dati automātiski saglabāti failā database.json!");
        }
      }).catch(err => {
        console.warn("Neizdevās nosūtīt datus uz servera /api/database:", err);
      });
    }
  }

  reset() {
    localStorage.removeItem(this.storageKey);
    this.data = JSON.parse(JSON.stringify(INITIAL_DATABASE));
    this.save();
  }

  ensureTodayLog() {
    if (!this.data || !this.data.Daily_Logs) return;
    const today = getTodayDateString();
    const uid = currentUserId || 1;
    let log = this.data.Daily_Logs.find(l => l.user_id === uid && l.log_date === today);
    if (!log) {
      const newLogId = this.getNextId("Daily_Logs", "log_id");
      this.data.Daily_Logs.push({
        log_id: newLogId,
        user_id: uid,
        log_date: today,
        total_calories: 0,
        total_protein: 0,
        total_fat: 0,
        total_carbs: 0
      });
      this.saveLocal();
    }
  }

  getNextId(table, idField) {
    if (!this.data[table] || this.data[table].length === 0) return 1;
    return Math.max(...this.data[table].map(item => item[idField] || 0)) + 1;
  }
}

const db = new GrozCalcDB();
let currentUser = db.data.Users.find(u => u.user_id === currentUserId) || db.data.Users[0];

const I18N = {
  lv: {
    app_subtitle: "Grozu kaloriju kalkulators",
    role_user: "Lietotājs: Daniils",
    role_admin: "Administrators: Deniss",
    tab_diary: "Dienasgrāmata",
    tab_catalog: "Produktu meklēšana",
    tab_admin: "Vadības panelis",
    tab_analytics: "Analītika",
    tab_blacklist: "Melnais saraksts",
    tab_profile: "Profils & Dati",
    goal_card_title: "Dienas kaloriju mērķis",
    consumed: "Uzņemts",
    remaining: "Atlicis",
    protein: "Olbaltumvielas",
    fat: "Tauki",
    carbs: "Ogļhidrāti",
    search_placeholder: "Meklēt produktu pēc nosaukuma vai zīmola...",
    store_all: "Visi veikali",
    badge_all: "Visi kvalitātes zīmogi",
    add_to_cart: "Grozā",
    badge_good: "Ļoti ieteicams",
    badge_neutral: "Neitrāls",
    badge_bad: "Neieteicams",
    admin_title: "Administratora vadības panelis",
    btn_add_product: "+ Pievienot jaunu produktu",
    sync_btn: "Sinhronizēt Rimi / Maxima datus",
    save: "Saglabāt",
    cancel: "Atcelt"
  },
  en: {
    app_subtitle: "Grocery Calorie Calculator",
    role_user: "User: Daniils",
    role_admin: "Administrator: Deniss",
    tab_diary: "Daily Diary",
    tab_catalog: "Product Catalog",
    tab_admin: "Admin Panel",
    tab_analytics: "Analytics",
    tab_blacklist: "Blacklist",
    tab_profile: "Profile & Data",
    goal_card_title: "Daily Calorie Goal",
    consumed: "Consumed",
    remaining: "Remaining",
    protein: "Protein",
    fat: "Fat",
    carbs: "Carbs",
    search_placeholder: "Search product by name or brand...",
    store_all: "All Stores",
    badge_all: "All Quality Badges",
    add_to_cart: "Add to Log",
    badge_good: "Highly Recommended",
    badge_neutral: "Neutral",
    badge_bad: "Not Recommended",
    admin_title: "Administrator Management Panel",
    btn_add_product: "+ Add New Product",
    sync_btn: "Sync Rimi / Maxima Data",
    save: "Save",
    cancel: "Cancel"
  }
};

function t(key) {
  return I18N[currentLang][key] || key;
}

function showToast(message, type = "info") {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  let icon = "ℹ️";
  if (type === "success") icon = "✅";
  if (type === "error") icon = "⚠️";
  toast.innerHTML = `<span>${icon}</span> <div>${message}</div>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(50px)";
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

function addProductToDailyLog(productId, quantityGrams, mealType = "Pusdienas") {
  productId = parseInt(productId, 10);
  quantityGrams = parseFloat(quantityGrams);

const product = db.data.Products.find(p => p.product_id === productId);
  if (!product) {
    showToast("Izvēlētais produkts nav atrasts katalogā", "error");
    return false;
  }

if (isNaN(quantityGrams) || quantityGrams <= 0) {
    showToast("Daudzumam jābūt pozitīvam skaitlim (gramos)", "error");
    return false;
  }

let log = db.data.Daily_Logs.find(l => l.user_id === currentUser.user_id && l.log_date === selectedDate);
  if (!log) {
    const newLogId = db.getNextId("Daily_Logs", "log_id");
    log = {
      log_id: newLogId,
      user_id: currentUser.user_id,
      log_date: selectedDate,
      total_calories: 0,
      total_protein: 0,
      total_fat: 0,
      total_carbs: 0
    };
    db.data.Daily_Logs.push(log);
  }

const multiplier = quantityGrams / 100.0;
  const item_calories = Math.round((product.calories * multiplier) * 10) / 10;
  const item_protein = Math.round((product.protein * multiplier) * 10) / 10;
  const item_fat = Math.round((product.fat * multiplier) * 10) / 10;
  const item_carbs = Math.round((product.carbs * multiplier) * 10) / 10;

const newItemId = db.getNextId("Log_Items", "item_id");
  const logItem = {
    item_id: newItemId,
    log_id: log.log_id,
    product_id: product.product_id,
    meal_type: mealType,
    quantity_grams: quantityGrams,
    item_calories,
    item_protein,
    item_fat,
    item_carbs,
    created_at: new Date().toISOString()
  };

  db.data.Log_Items.push(logItem);

recalculateDailyLogTotals(log.log_id);

  db.save();
  showToast(`Pievienots: ${product.name} (${quantityGrams}g, ${item_calories} kcal)`, "success");
  renderAll();
  return true;
}

function recalculateDailyLogTotals(logId) {
  const log = db.data.Daily_Logs.find(l => l.log_id === logId);
  if (!log) return;

  const items = db.data.Log_Items.filter(i => i.log_id === logId);
  let totalCal = 0;
  let totalProt = 0;
  let totalFat = 0;
  let totalCarb = 0;

  items.forEach(item => {
    totalCal += item.item_calories;
    totalProt += item.item_protein;
    totalFat += item.item_fat;
    totalCarb += item.item_carbs;
  });

  log.total_calories = Math.round(totalCal * 10) / 10;
  log.total_protein = Math.round(totalProt * 10) / 10;
  log.total_fat = Math.round(totalFat * 10) / 10;
  log.total_carbs = Math.round(totalCarb * 10) / 10;
}

function deleteLogItem(itemId) {
  itemId = parseInt(itemId, 10);
  const index = db.data.Log_Items.findIndex(i => i.item_id === itemId);
  if (index === -1) return;

  const item = db.data.Log_Items[index];
  const logId = item.log_id;
  db.data.Log_Items.splice(index, 1);

  recalculateDailyLogTotals(logId);
  db.save();
  showToast("Produkts dzēsts no dienas uzskaites", "info");
  renderAll();
}

function editLogItemGrams(itemId, newGrams) {
  itemId = parseInt(itemId, 10);
  newGrams = parseFloat(newGrams);

  if (isNaN(newGrams) || newGrams <= 0) {
    showToast("Daudzumam jābūt pozitīvam skaitlim (gramos)", "error");
    return false;
  }

  const item = db.data.Log_Items.find(i => i.item_id === itemId);
  if (!item) return false;

  const product = db.data.Products.find(p => p.product_id === item.product_id);
  if (!product) return false;

  const multiplier = newGrams / 100.0;
  item.quantity_grams = newGrams;
  item.item_calories = Math.round((product.calories * multiplier) * 10) / 10;
  item.item_protein = Math.round((product.protein * multiplier) * 10) / 10;
  item.item_fat = Math.round((product.fat * multiplier) * 10) / 10;
  item.item_carbs = Math.round((product.carbs * multiplier) * 10) / 10;

  recalculateDailyLogTotals(item.log_id);
  db.save();
  showToast("Porcijas daudzums atjaunināts", "success");
  renderAll();
  return true;
}

function addToBlacklist(productId, reason = "Nevēlama pārtikas vienība") {
  productId = parseInt(productId, 10);
  const exists = db.data.Blacklist.some(b => b.user_id === currentUser.user_id && b.product_id === productId);

  if (exists) {
    showToast("Produkts jau ir Jūsu melnajā sarakstā", "error");
    return false;
  }

  const newId = db.getNextId("Blacklist", "blacklist_id");
  db.data.Blacklist.push({
    blacklist_id: newId,
    user_id: currentUser.user_id,
    product_id: productId,
    reason: reason.trim() || "Bloķēts pēc lietotāja ieskatiem",
    added_date: new Date().toISOString().replace('T', ' ').substring(0, 19)
  });

  db.save();
  showToast("Produkts pievienots melnajam sarakstam", "success");
  renderAll();
  return true;
}

function removeFromBlacklist(productId) {
  productId = parseInt(productId, 10);
  const index = db.data.Blacklist.findIndex(b => b.user_id === currentUser.user_id && b.product_id === productId);
  if (index !== -1) {
    db.data.Blacklist.splice(index, 1);
    db.save();
    showToast("Produkts noņemts no melnā saraksta", "info");
    renderAll();
  }
}

function saveProductAdmin(productData, editProductId = null) {
  
  if (currentUser.role !== 'admin') {
    showToast("Piekļuve liegta: Nepietiekamas tiesības", "error");
    return false;
  }

const name = (productData.name || "").trim();
  const brand = (productData.brand || "").trim();
  const store = (productData.store || "Rimi").trim();
  const price = parseFloat(productData.price);
  const calories = parseFloat(productData.calories);
  const protein = parseFloat(productData.protein);
  const fat = parseFloat(productData.fat);
  const carbs = parseFloat(productData.carbs);
  const quality_badge = productData.quality_badge || "Neitrāls";

  if (!name || !brand || isNaN(price) || isNaN(calories) || isNaN(protein) || isNaN(fat) || isNaN(carbs)) {
    showToast("Uzturvērtību parametri nav korekti (visi lauki obligāti)", "error");
    return false;
  }

  if (calories < 0 || protein < 0 || fat < 0 || carbs < 0 || price < 0) {
    showToast("Uzturvērtību parametri nedrīkst būt negatīvi", "error");
    return false;
  }

const existing = db.data.Products.find(p => 
    p.name.toLowerCase() === name.toLowerCase() && 
    p.brand.toLowerCase() === brand.toLowerCase() &&
    (!editProductId || p.product_id !== editProductId)
  );

  if (existing && !editProductId) {
    
    if (confirm(`Produkts "${name}" (${brand}) jau eksistē! Vai vēlaties atjaunināt tā uzturvērtības un cenu?`)) {
      existing.price = price;
      existing.calories = calories;
      existing.protein = protein;
      existing.fat = fat;
      existing.carbs = carbs;
      existing.quality_badge = quality_badge;
      existing.store = store;
      db.save();
      showToast(`Atjaunināts produkts: ${name}`, "success");
      renderAll();
      return true;
    }
    return false;
  }

  if (editProductId) {
    
    const item = db.data.Products.find(p => p.product_id === editProductId);
    if (item) {
      item.name = name;
      item.brand = brand;
      item.store = store;
      item.price = price;
      item.calories = calories;
      item.protein = protein;
      item.fat = fat;
      item.carbs = carbs;
      item.quality_badge = quality_badge;
      db.save();
      showToast(`Produkts "${name}" veiksmīgi rediģēts`, "success");
      renderAll();
      return true;
    }
  } else {
    
    const newId = db.getNextId("Products", "product_id");
    db.data.Products.push({
      product_id: newId,
      name,
      brand,
      store,
      price,
      calories,
      protein,
      fat,
      carbs,
      quality_badge,
      created_at: new Date().toISOString()
    });
    db.save();
    showToast(`Izveidots jauns produkts: ${name}`, "success");
    renderAll();
    return true;
  }
}

function deleteProductAdmin(productId) {
  if (currentUser.role !== 'admin') {
    showToast("Piekļuve liegta: Nepietiekamas tiesības", "error");
    return;
  }

  productId = parseInt(productId, 10);
  const isUsedInLogs = db.data.Log_Items.some(i => i.product_id === productId);

  if (isUsedInLogs) {
    if (!confirm("Uzmanību: Šis produkts jau ir reģistrēts lietotāju dienasgrāmatā (ON DELETE RESTRICT). Dzēšot šo produktu, tas tiks noņemts arī no vēsturiskajiem ierakstiem. Vai tiešām turpināt?")) {
      return;
    }
    db.data.Log_Items = db.data.Log_Items.filter(i => i.product_id !== productId);
  }

  db.data.Products = db.data.Products.filter(p => p.product_id !== productId);
  db.data.Blacklist = db.data.Blacklist.filter(b => b.product_id !== productId);
  db.save();
  showToast("Produkts veiksmīgi izdzēsts no datubāzes", "info");
  renderAll();
  saveDatabaseToFile();
}

function triggerScraperSync() {
  showToast("Notiek savienojums ar Rimi un Maxima datu avotiem...", "info");
  
  setTimeout(() => {
    
    const mockUpdates = [
      { name: "Valmieras biezpiens 0.5%", brand: "Valmiera", store: "Rimi", price: 1.45, calories: 80.0, protein: 16.0, fat: 0.5, carbs: 3.0, quality_badge: "Ļoti ieteicams" },
      { name: "Baltais Grieķu Jogurts 10%", brand: "Baltais", store: "Rimi", price: 1.89, calories: 120.0, protein: 9.5, fat: 10.0, carbs: 3.8, quality_badge: "Ļoti ieteicams" },
      { name: "Maxima Favorit Auzu pārslas", brand: "Favorit", store: "Maxima", price: 0.99, calories: 365.0, protein: 13.0, fat: 7.0, carbs: 62.0, quality_badge: "Ļoti ieteicams" }
    ];

    let updatedCount = 0;
    let addedCount = 0;

    mockUpdates.forEach(item => {
      const existing = db.data.Products.find(p => p.name.toLowerCase() === item.name.toLowerCase() && p.brand.toLowerCase() === item.brand.toLowerCase());
      if (existing) {
        existing.price = item.price; 
        updatedCount++;
      } else {
        const newId = db.getNextId("Products", "product_id");
        db.data.Products.push({
          product_id: newId,
          ...item,
          created_at: new Date().toISOString()
        });
        addedCount++;
      }
    });

    db.save();
    showToast(`Sinhronizācija pabeigta! Atjaunināti: ${updatedCount}, Pievienoti jauni: ${addedCount}`, "success");
    renderAll();
    saveDatabaseToFile();
  }, 1000);
}

function renderAll() {
  renderHeaderAndProfile();
  renderDailyDiary();
  renderCatalog();
  renderAdminPanel();
  renderAnalytics();
  renderBlacklist();
  renderProfileSettings();
}

function renderHeaderAndProfile() {
  const profile = db.data.User_Profiles.find(p => p.user_id === currentUser.user_id) || {
    name: currentUser.role === 'admin' ? "Deniss (Admin)" : "Daniils",
    calorie_target: 2200
  };

  const userRoleEl = document.getElementById("current-user-role-text");
  if (userRoleEl) {
    userRoleEl.textContent = `${profile.name} [${currentUser.role.toUpperCase()}]`;
  }

const adminTab = document.getElementById("nav-admin-tab");
  if (adminTab) {
    adminTab.style.display = (currentUser.role === 'admin') ? "flex" : "none";
  }

const adminSaveJsonBtn = document.getElementById("admin-save-json-btn");
  if (adminSaveJsonBtn) {
    adminSaveJsonBtn.style.display = (currentUser.role === 'admin') ? "inline-flex" : "none";
  }

  const adminDbToolsCard = document.getElementById("admin-db-tools-card");
  if (adminDbToolsCard) {
    adminDbToolsCard.style.display = (currentUser.role === 'admin') ? "block" : "none";
  }
}

function renderDailyDiary() {
  const profile = db.data.User_Profiles.find(p => p.user_id === currentUser.user_id) || {
    calorie_target: 2200,
    protein_target: 140,
    fat_target: 70,
    carbs_target: 220
  };

let log = db.data.Daily_Logs.find(l => l.user_id === currentUser.user_id && l.log_date === selectedDate);
  if (!log) {
    log = { total_calories: 0, total_protein: 0, total_fat: 0, total_carbs: 0 };
  }

const dateBadge = document.getElementById("current-diary-date-badge");
  if (dateBadge) {
    dateBadge.textContent = formatDisplayDate(selectedDate);
  }

const goalTargetEl = document.getElementById("diary-goal-target");
  const consumedEl = document.getElementById("diary-consumed-kcal");
  const remainingEl = document.getElementById("diary-remaining-kcal");
  const progressBar = document.getElementById("diary-progress-fill");

  const target = profile.calorie_target;
  const consumed = Math.round(log.total_calories);
  const remaining = Math.max(0, target - consumed);
  const pct = Math.min(100, Math.round((consumed / target) * 100));

  if (goalTargetEl) goalTargetEl.textContent = `${target} kcal`;
  if (consumedEl) consumedEl.textContent = `${consumed} kcal`;
  if (remainingEl) remainingEl.textContent = `${remaining} kcal`;
  if (progressBar) {
    progressBar.style.width = `${pct}%`;
    if (consumed > target) {
      progressBar.classList.add("over-target");
    } else {
      progressBar.classList.remove("over-target");
    }
  }

const pVal = document.getElementById("macro-protein-val");
  const fVal = document.getElementById("macro-fat-val");
  const cVal = document.getElementById("macro-carbs-val");
  const pBar = document.getElementById("macro-protein-bar");
  const fBar = document.getElementById("macro-fat-bar");
  const cBar = document.getElementById("macro-carbs-bar");

  if (pVal) pVal.textContent = `${Math.round(log.total_protein)}g / ${profile.protein_target}g`;
  if (fVal) fVal.textContent = `${Math.round(log.total_fat)}g / ${profile.fat_target}g`;
  if (cVal) cVal.textContent = `${Math.round(log.total_carbs)}g / ${profile.carbs_target}g`;

  if (pBar) pBar.style.width = `${Math.min(100, (log.total_protein / profile.protein_target) * 100)}%`;
  if (fBar) fBar.style.width = `${Math.min(100, (log.total_fat / profile.fat_target) * 100)}%`;
  if (cBar) cBar.style.width = `${Math.min(100, (log.total_carbs / profile.carbs_target) * 100)}%`;

const itemsContainer = document.getElementById("diary-items-list");
  if (!itemsContainer) return;

  const currentLogId = log.log_id;
  const dayItems = currentLogId ? db.data.Log_Items.filter(i => i.log_id === currentLogId) : [];

  if (dayItems.length === 0) {
    itemsContainer.innerHTML = `
      <div style="text-align:center; padding: 30px; color: var(--text-muted); border: 2px dashed var(--border); border-radius: var(--radius-md);">
        <p style="font-size: 1.1rem; margin-bottom: 8px;">🍽️ Šajā dienā vēl nav pievienotu produktu</p>
        <p style="font-size: 0.85rem; margin-bottom: 16px;">Izvēlieties produktus no veikalu kataloga vai meklēšanas</p>
        <button class="btn-primary" onclick="switchTab('catalog')">🔍 Atvērt produktu katalogu</button>
      </div>
    `;
    return;
  }

  itemsContainer.innerHTML = dayItems.map(item => {
    const product = db.data.Products.find(p => p.product_id === item.product_id) || {
      name: "Nezināms produkts",
      brand: "-",
      store: "Rimi",
      quality_badge: "Neitrāls"
    };

    let badgeClass = "badge-yellow";
    if (product.quality_badge === "Ļoti ieteicams") badgeClass = "badge-green";
    if (product.quality_badge === "Neieteicams") badgeClass = "badge-red";

    return `
      <div class="log-item-row">
        <div class="log-item-main">
          <div class="log-item-name">
            <span>${product.name}</span>
            <span class="store-tag ${product.store.toLowerCase()}">${product.store}</span>
            <span class="quality-badge ${badgeClass}">${product.quality_badge}</span>
          </div>
          <div class="log-item-sub">
            ${product.brand} • <b>${item.quantity_grams}g</b> • Olb: ${item.item_protein}g | T: ${item.item_fat}g | Ogļh: ${item.item_carbs}g
          </div>
        </div>
        <div class="log-item-right">
          <span class="item-kcal-bold">${Math.round(item.item_calories)} kcal</span>
          <button class="btn-icon" title="Labot porcijas svaru" onclick="promptEditGrams(${item.item_id}, ${item.quantity_grams})">✏️</button>
          <button class="btn-icon" title="Dzēst ierakstu" onclick="deleteLogItem(${item.item_id})">🗑️</button>
        </div>
      </div>
    `;
  }).join('');
}

function renderCatalog() {
  const container = document.getElementById("catalog-products-grid");
  if (!container) return;

  const userBlacklistIds = new Set(
    db.data.Blacklist
      .filter(b => b.user_id === currentUser.user_id)
      .map(b => b.product_id)
  );

const filtered = db.data.Products.filter(p => {
    
    if (catalogSearchQuery) {
      const q = catalogSearchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchBrand = p.brand.toLowerCase().includes(q);
      if (!matchName && !matchBrand) return false;
    }
    
    if (catalogStoreFilter !== "Visi" && p.store !== catalogStoreFilter) {
      return false;
    }
    
    if (catalogBadgeFilter !== "Visi" && p.quality_badge !== catalogBadgeFilter) {
      return false;
    }
    
    const isBlocked = userBlacklistIds.has(p.product_id);
    if (isBlocked && !catalogShowBlacklist) {
      return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--text-muted);">
        <p style="font-size: 1.2rem;">🔍 Pēc norādītajiem kritērijiem neviens produkts netika atrasts.</p>
        <p style="font-size: 0.85rem; margin-top: 6px;">Mēģiniet mainīt meklēšanas frāzi vai veikala filtru.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(p => {
    const isBlocked = userBlacklistIds.has(p.product_id);
    let badgeClass = "badge-yellow";
    if (p.quality_badge === "Ļoti ieteicams") badgeClass = "badge-green";
    if (p.quality_badge === "Neieteicams") badgeClass = "badge-red";

    return `
      <div class="product-card ${isBlocked ? 'is-blacklisted' : ''}">
        <div class="product-card-top">
          <div class="product-meta-row">
            <span class="store-tag ${p.store.toLowerCase()}">${p.store}</span>
            <span class="quality-badge ${badgeClass}">${p.quality_badge}</span>
          </div>
          <h3 class="product-title">${p.name}</h3>
          <p class="product-brand">${p.brand} ${isBlocked ? '<span style="color:#C62828; font-weight:700;">(Melnajā sarakstā)</span>' : ''}</p>
          
          <div class="product-nutrients-pill">
            <div>
              <div class="nutrient-stat-val">${p.calories}</div>
              <div class="nutrient-stat-lbl">kcal/100g</div>
            </div>
            <div>
              <div class="nutrient-stat-val">${p.protein}g</div>
              <div class="nutrient-stat-lbl">Olb.</div>
            </div>
            <div>
              <div class="nutrient-stat-val">${p.fat}g</div>
              <div class="nutrient-stat-lbl">Tauki</div>
            </div>
            <div>
              <div class="nutrient-stat-val">${p.carbs}g</div>
              <div class="nutrient-stat-lbl">Ogļh.</div>
            </div>
          </div>
        </div>

        <div class="product-card-actions">
          <div class="product-price">€${p.price.toFixed(2)}</div>
          <div style="display: flex; gap: 8px; align-items: center;">
            ${isBlocked ? `
              <button class="btn-blacklist-toggle" onclick="removeFromBlacklist(${p.product_id})" title="Noņemt no melnā saraksta">
                ✅ Atbloķēt
              </button>
            ` : `
              <button class="btn-blacklist-toggle" onclick="openBlacklistModal(${p.product_id}, '${escapeHtml(p.name)}')" title="Pievienot melnajam sarakstam">
                🚫 Bloķēt
              </button>
            `}
            <button class="btn-add-log" onclick="openAddToCartModal(${p.product_id})">
              [ + Grozā ]
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderAdminPanel() {
  const container = document.getElementById("admin-products-table-body");
  if (!container) return;

  if (currentUser.role !== 'admin') {
    container.innerHTML = `
      <tr>
        <td colspan="8" style="text-align: center; color: #C62828; padding: 20px;">
          Piekļuve liegta: Tikai sistēmas administratoriem ir pieeja šim modulim.
        </td>
      </tr>
    `;
    return;
  }

  container.innerHTML = db.data.Products.map(p => {
    let badgeClass = "badge-yellow";
    if (p.quality_badge === "Ļoti ieteicams") badgeClass = "badge-green";
    if (p.quality_badge === "Neieteicams") badgeClass = "badge-red";

    return `
      <tr>
        <td><b>#${p.product_id}</b></td>
        <td><b>${p.name}</b></td>
        <td>${p.brand}</td>
        <td><span class="store-tag ${p.store.toLowerCase()}">${p.store}</span></td>
        <td><b>${p.calories}</b></td>
        <td>${p.protein}g / ${p.fat}g / ${p.carbs}g</td>
        <td><span class="quality-badge ${badgeClass}">${p.quality_badge}</span></td>
        <td>
          <div class="action-buttons-group">
            <button class="btn-action-edit" onclick="openEditProductModal(${p.product_id})">Labot</button>
            <button class="btn-action-delete" onclick="deleteProductAdmin(${p.product_id})">Dzēst</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function renderAnalytics() {
  const container = document.getElementById("analytics-summary-view");
  if (!container) return;

  const profile = db.data.User_Profiles.find(p => p.user_id === currentUser.user_id) || { calorie_target: 2200 };

const days = [];
  for (let i = 6; i >= 0; i--) {
    const dStr = getTodayDateString(-i);
    const log = db.data.Daily_Logs.find(l => l.user_id === currentUser.user_id && l.log_date === dStr);
    days.push({
      date: dStr,
      displayDate: formatDisplayDate(dStr),
      calories: log ? Math.round(log.total_calories) : 0,
      protein: log ? Math.round(log.total_protein) : 0,
      fat: log ? Math.round(log.total_fat) : 0,
      carbs: log ? Math.round(log.total_carbs) : 0
    });
  }

const maxCal = Math.max(profile.calorie_target * 1.2, ...days.map(d => d.calories), 100);

const chartBars = days.map((d, index) => {
    const barHeight = Math.min(100, Math.round((d.calories / maxCal) * 100));
    const isToday = d.date === getTodayDateString();
    const isOver = d.calories > profile.calorie_target;
    const barColor = isOver ? "#EF5350" : (isToday ? "#00897B" : "#4DB6AC");

    return `
      <div style="flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8px;">
        <span style="font-size: 0.72rem; font-weight: 700; color: var(--text-main);">${d.calories}</span>
        <div style="width: 100%; max-width: 40px; height: 140px; background: #EEF2F6; border-radius: 6px; display: flex; align-items: flex-end; overflow: hidden;">
          <div style="width: 100%; height: ${barHeight}%; background: ${barColor}; transition: height 0.5s ease; border-radius: 4px;"></div>
        </div>
        <span style="font-size: 0.72rem; color: var(--text-muted);">${d.displayDate.split('.')[0]}</span>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="card">
      <div class="card-header-flex">
        <h3 class="card-title">📊 Iknedēļas kaloriju uzņemšanas tendence</h3>
        <span style="font-size: 0.85rem; color: var(--primary-dark); font-weight: 600;">Mērķa robeža: ${profile.calorie_target} kcal</span>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: flex-end; padding: 20px 0 10px; gap: 10px;">
        ${chartBars}
      </div>
      <div style="display: flex; justify-content: center; gap: 20px; font-size: 0.78rem; margin-top: 15px; color: var(--text-muted);">
        <div><span style="display:inline-block; width:10px; height:10px; background:#4DB6AC; border-radius:2px; margin-right:4px;"></span> Vēsturiskās dienas</div>
        <div><span style="display:inline-block; width:10px; height:10px; background:#00897B; border-radius:2px; margin-right:4px;"></span> Šodiena</div>
        <div><span style="display:inline-block; width:10px; height:10px; background:#EF5350; border-radius:2px; margin-right:4px;"></span> Pārsniegts mērķis</div>
      </div>
    </div>
  `;
}

function renderBlacklist() {
  const container = document.getElementById("blacklist-items-container");
  if (!container) return;

  const userBlacklist = db.data.Blacklist.filter(b => b.user_id === currentUser.user_id);

  if (userBlacklist.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 30px; color: var(--text-muted);">
        <p style="font-size: 1.1rem; margin-bottom: 6px;">🟢 Melnais saraksts ir tukšs</p>
        <p style="font-size: 0.85rem;">Jūs varat pievienot nevēlamus produktus no kataloga, lai tie netiktu iekļauti meklēšanā.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = userBlacklist.map(b => {
    const p = db.data.Products.find(prod => prod.product_id === b.product_id) || { name: "Nezināms produkts", brand: "-" };
    return `
      <div class="log-item-row" style="border-left: 4px solid #C62828;">
        <div class="log-item-main">
          <div class="log-item-name">
            <span>🚫 ${p.name} (${p.brand})</span>
          </div>
          <div class="log-item-sub">
            <b>Iemesls:</b> ${b.reason} • <i>Pievienots: ${b.added_date}</i>
          </div>
        </div>
        <button class="btn-secondary" style="color: #C62828; border-color: #EF9A9A;" onclick="removeFromBlacklist(${b.product_id})">
          Noņemt no saraksta
        </button>
      </div>
    `;
  }).join('');
}

function renderProfileSettings() {
  const profile = db.data.User_Profiles.find(p => p.user_id === currentUser.user_id);
  if (!profile) return;

  const nameInput = document.getElementById("profile-name-input");
  const weightInput = document.getElementById("profile-weight-input");
  const heightInput = document.getElementById("profile-height-input");
  const ageInput = document.getElementById("profile-age-input");
  const targetInput = document.getElementById("profile-target-input");

  if (nameInput) nameInput.value = profile.name;
  if (weightInput) weightInput.value = profile.weight;
  if (heightInput) heightInput.value = profile.height;
  if (ageInput) ageInput.value = profile.age;
  if (targetInput) targetInput.value = profile.calorie_target;
}

let activeAddProductId = null;
function openAddToCartModal(productId) {
  activeAddProductId = productId;
  const product = db.data.Products.find(p => p.product_id === productId);
  if (!product) return;

  document.getElementById("modal-add-product-name").textContent = product.name;
  document.getElementById("modal-add-product-macros").textContent = `${product.calories} kcal/100g (Olb: ${product.protein}g, T: ${product.fat}g, Ogļh: ${product.carbs}g)`;
  document.getElementById("modal-add-grams-input").value = 100;
  calculateModalPreview();

  document.getElementById("add-to-cart-modal").classList.add("open");
}

function calculateModalPreview() {
  if (!activeAddProductId) return;
  const product = db.data.Products.find(p => p.product_id === activeAddProductId);
  const grams = parseFloat(document.getElementById("modal-add-grams-input").value) || 0;
  const multiplier = grams / 100.0;
  const cal = Math.round((product.calories * multiplier) * 10) / 10;
  const prot = Math.round((product.protein * multiplier) * 10) / 10;

  document.getElementById("modal-add-preview-text").textContent = `Kopā: ${cal} kcal (Olb: ${prot}g)`;
}

function confirmAddToCart() {
  const grams = document.getElementById("modal-add-grams-input").value;
  const mealType = document.getElementById("modal-add-meal-select").value;
  if (addProductToDailyLog(activeAddProductId, grams, mealType)) {
    closeModals();
  }
}

function promptEditGrams(itemId, currentGrams) {
  const newGrams = prompt("Ievadiet jauno porcijas svaru gramos:", currentGrams);
  if (newGrams !== null) {
    editLogItemGrams(itemId, newGrams);
  }
}

let activeBlacklistProductId = null;
function openBlacklistModal(productId, productName) {
  activeBlacklistProductId = productId;
  document.getElementById("blacklist-modal-product-name").textContent = productName;
  document.getElementById("blacklist-modal-reason").value = "Nevēlama pārtikas vienība / alerģija";
  document.getElementById("blacklist-modal").classList.add("open");
}

function confirmAddToBlacklist() {
  const reason = document.getElementById("blacklist-modal-reason").value;
  if (addToBlacklist(activeBlacklistProductId, reason)) {
    closeModals();
  }
}

let activeEditProductId = null;
function openAddProductModal() {
  activeEditProductId = null;
  document.getElementById("product-modal-title").textContent = "Pievienot jaunu produktu katalogā";
  document.getElementById("product-form").reset();
  document.getElementById("admin-product-modal").classList.add("open");
}

function openEditProductModal(productId) {
  activeEditProductId = productId;
  const p = db.data.Products.find(item => item.product_id === productId);
  if (!p) return;

  document.getElementById("product-modal-title").textContent = `Labot produktu #${p.product_id}`;
  document.getElementById("admin-prod-name").value = p.name;
  document.getElementById("admin-prod-brand").value = p.brand;
  document.getElementById("admin-prod-store").value = p.store;
  document.getElementById("admin-prod-price").value = p.price;
  document.getElementById("admin-prod-calories").value = p.calories;
  document.getElementById("admin-prod-protein").value = p.protein;
  document.getElementById("admin-prod-fat").value = p.fat;
  document.getElementById("admin-prod-carbs").value = p.carbs;
  document.getElementById("admin-prod-badge").value = p.quality_badge;

  document.getElementById("admin-product-modal").classList.add("open");
}

function submitAdminProductForm(e) {
  e.preventDefault();
  const productData = {
    name: document.getElementById("admin-prod-name").value,
    brand: document.getElementById("admin-prod-brand").value,
    store: document.getElementById("admin-prod-store").value,
    price: document.getElementById("admin-prod-price").value,
    calories: document.getElementById("admin-prod-calories").value,
    protein: document.getElementById("admin-prod-protein").value,
    fat: document.getElementById("admin-prod-fat").value,
    carbs: document.getElementById("admin-prod-carbs").value,
    quality_badge: document.getElementById("admin-prod-badge").value
  };

  if (saveProductAdmin(productData, activeEditProductId)) {
    closeModals();
    saveDatabaseToFile();
  }
}

function closeModals() {
  document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("open"));
}

function switchTab(tabName) {
  document.querySelectorAll(".nav-tab").forEach(tab => {
    tab.classList.toggle("active", tab.dataset.tab === tabName);
  });
  document.querySelectorAll(".page-section").forEach(sec => {
    sec.classList.toggle("active", sec.id === `section-${tabName}`);
  });
  if (tabName === "analytics") {
    renderAnalytics();
  }
}

function switchUserRole(role) {
  if (role === 'admin') {
    currentUser = db.data.Users.find(u => u.role === 'admin') || db.data.Users[1];
    localStorage.setItem("grozcalc_active_user_id", String(currentUser.user_id));
    showToast("Pārslēgts uz Administratora lomu (Deniss)", "info");
  } else {
    currentUser = db.data.Users.find(u => u.role === 'user') || db.data.Users[0];
    localStorage.setItem("grozcalc_active_user_id", String(currentUser.user_id));
    showToast("Pārslēgts uz Lietotāja lomu (Daniils)", "info");
    
    const activeSection = document.querySelector(".page-section.active");
    if (activeSection && activeSection.id === "section-admin") {
      switchTab("diary");
    }
  }
  renderAll();
}

function changeDate(daysOffset) {
  const cur = new Date(selectedDate);
  cur.setDate(cur.getDate() + daysOffset);
  const y = cur.getFullYear();
  const m = String(cur.getMonth() + 1).padStart(2, '0');
  const d = String(cur.getDate()).padStart(2, '0');
  selectedDate = `${y}-${m}-${d}`;
  renderDailyDiary();
}

function saveUserProfile(e) {
  e.preventDefault();
  const profile = db.data.User_Profiles.find(p => p.user_id === currentUser.user_id);
  if (!profile) return;

  profile.name = document.getElementById("profile-name-input").value;
  profile.weight = parseFloat(document.getElementById("profile-weight-input").value) || profile.weight;
  profile.height = parseFloat(document.getElementById("profile-height-input").value) || profile.height;
  profile.age = parseInt(document.getElementById("profile-age-input").value, 10) || profile.age;
  profile.calorie_target = parseInt(document.getElementById("profile-target-input").value, 10) || profile.calorie_target;

  db.save();
  showToast("Profila dati un mērķi saglabāti!", "success");
  renderAll();
}

async function saveDatabaseToFile() {
  const jsonStr = JSON.stringify(db.data, null, 2);

if (window.location.protocol.startsWith('http')) {
    try {
      const res = await fetch('/api/database', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonStr
      });
      if (res.ok) {
        showToast("💾 Fails database.json veiksmīgi atjaunināts diskā!", "success");
        return true;
      }
    } catch (e) {
      console.warn("Servera API nav sasniedzams:", e);
    }
  }

if ('showSaveFilePicker' in window) {
    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: 'database.json',
        types: [{
          description: 'JSON Datubāzes fails',
          accept: { 'application/json': ['.json'] }
        }]
      });
      const writable = await handle.createWritable();
      await writable.write(jsonStr);
      await writable.close();
      showToast("💾 Fails database.json veiksmīgi pārrakstīts diskā!", "success");
      return true;
    } catch (e) {
      if (e.name === 'AbortError') return false;
    }
  }

const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'database.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast("📥 Lejupielādēts atjaunināts database.json fails!", "success");
  return true;
}

function exportDatabaseJSON() {
  saveDatabaseToFile();
}

function importDatabaseJSON(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (imported.Products && imported.Daily_Logs) {
        db.data = imported;
        db.save();
        showToast("Dati veiksmīgi importēti!", "success");
        renderAll();
      } else {
        showToast("Nederīgs datu faila formāts", "error");
      }
    } catch (err) {
      showToast("Kļūda parsējot JSON failu", "error");
    }
  };
  reader.readAsText(file);
}

function escapeHtml(text) {
  return text.replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

document.addEventListener("DOMContentLoaded", () => {
  
  const roleSelect = document.getElementById("user-role-selector");
  if (roleSelect) {
    roleSelect.value = currentUser.role;
  }

  renderAll();

const searchInput = document.getElementById("catalog-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      catalogSearchQuery = e.target.value.trim();
      renderCatalog();
    });
  }

  const storeSelect = document.getElementById("catalog-store-select");
  if (storeSelect) {
    storeSelect.addEventListener("change", (e) => {
      catalogStoreFilter = e.target.value;
      renderCatalog();
    });
  }

  const badgeSelect = document.getElementById("catalog-badge-select");
  if (badgeSelect) {
    badgeSelect.addEventListener("change", (e) => {
      catalogBadgeFilter = e.target.value;
      renderCatalog();
    });
  }

  const blacklistCheckbox = document.getElementById("catalog-show-blacklist-check");
  if (blacklistCheckbox) {
    blacklistCheckbox.addEventListener("change", (e) => {
      catalogShowBlacklist = e.target.checked;
      renderCatalog();
    });
  }

const gramsInput = document.getElementById("modal-add-grams-input");
  if (gramsInput) {
    gramsInput.addEventListener("input", calculateModalPreview);
  }
});
