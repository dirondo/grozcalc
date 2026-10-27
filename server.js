

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'database.json');

const DEFAULT_DATA = {
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
    { log_id: 1, user_id: 1, log_date: new Date().toISOString().slice(0, 10), total_calories: 285.0, total_protein: 36.0, total_fat: 2.0, total_carbs: 31.0 }
  ],
  Log_Items: [
    { item_id: 1, log_id: 1, product_id: 1, meal_type: "Pusdienas", quantity_grams: 200, item_calories: 160.0, item_protein: 32.0, item_fat: 1.0, item_carbs: 6.0 },
    { item_id: 2, log_id: 1, product_id: 3, meal_type: "Pusdienas", quantity_grams: 50, item_calories: 125.0, item_protein: 4.0, item_fat: 1.0, item_carbs: 25.0 }
  ],
  Blacklist: [
    { blacklist_id: 1, user_id: 1, product_id: 4, reason: "Augsts cukura daudzums (24g uz 100g)", added_date: "2026-05-20 14:32:00" }
  ]
};

function loadDatabase() {
  if (!fs.existsSync(DB_FILE)) {
    saveDatabase(DEFAULT_DATA);
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error("Kļūda lasot datubāzes failu, tiek izmantoti noklusētie dati:", err);
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
}

function saveDatabase(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

const db = loadDatabase();

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.sql': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

const server = http.createServer((req, res) => {
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

const getBody = (callback) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const parsed = body ? JSON.parse(body) : {};
        callback(null, parsed);
      } catch (e) {
        callback(e);
      }
    });
  };

if (req.method === 'GET' && pathname === '/api/database') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(db));
    return;
  }

  if (req.method === 'POST' && pathname === '/api/database') {
    getBody((err, payload) => {
      if (err || !payload || !payload.Products) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Nederīgi datu bāzes dati" }));
        return;
      }
      Object.assign(db, payload);
      saveDatabase(db);
      console.log(`[${new Date().toLocaleTimeString()}] Dati veiksmīgi saglabāti failā database.json`);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: "ok" }));
    });
    return;
  }

if (req.method === 'GET' && pathname === '/api/products') {
    const search = (url.searchParams.get('q') || '').toLowerCase();
    const store = url.searchParams.get('store');
    let results = db.Products;

    if (search) {
      results = results.filter(p => p.name.toLowerCase().includes(search) || p.brand.toLowerCase().includes(search));
    }
    if (store && store !== 'Visi') {
      results = results.filter(p => p.store === store);
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(results));
    return;
  }

if (req.method === 'POST' && pathname === '/api/products') {
    getBody((err, payload) => {
      if (err || !payload.name || !payload.brand) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Uzturvērtību parametri nav korekti" }));
        return;
      }

      const newId = (db.Products.length > 0 ? Math.max(...db.Products.map(p => p.product_id)) : 0) + 1;
      const newProd = {
        product_id: newId,
        name: payload.name,
        brand: payload.brand,
        store: payload.store || 'Rimi',
        price: parseFloat(payload.price) || 0,
        calories: parseFloat(payload.calories) || 0,
        protein: parseFloat(payload.protein) || 0,
        fat: parseFloat(payload.fat) || 0,
        carbs: parseFloat(payload.carbs) || 0,
        quality_badge: payload.quality_badge || 'Neitrāls',
        created_at: new Date().toISOString()
      };

      db.Products.push(newProd);
      saveDatabase(db);

      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newProd));
    });
    return;
  }

if (req.method === 'GET' && pathname.startsWith('/api/logs/')) {
    const date = pathname.replace('/api/logs/', '');
    const log = db.Daily_Logs.find(l => l.log_date === date);
    const items = log ? db.Log_Items.filter(i => i.log_id === log.log_id) : [];

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ log: log || null, items }));
    return;
  }

if (req.method === 'POST' && pathname === '/api/logs/items') {
    getBody((err, payload) => {
      const { product_id, quantity_grams, log_date, meal_type } = payload;
      const product = db.Products.find(p => p.product_id === parseInt(product_id, 10));

      if (!product) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Izvēlētais produkts nav atrasts katalogā" }));
        return;
      }

      const grams = parseFloat(quantity_grams);
      if (isNaN(grams) || grams <= 0) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: "Daudzumam jābūt pozitīvam skaitlim (gramos)" }));
        return;
      }

let log = db.Daily_Logs.find(l => l.log_date === log_date);
      if (!log) {
        const newLogId = (db.Daily_Logs.length > 0 ? Math.max(...db.Daily_Logs.map(l => l.log_id)) : 0) + 1;
        log = {
          log_id: newLogId,
          user_id: 1,
          log_date: log_date,
          total_calories: 0,
          total_protein: 0,
          total_fat: 0,
          total_carbs: 0
        };
        db.Daily_Logs.push(log);
      }

      const mult = grams / 100.0;
      const newItemId = (db.Log_Items.length > 0 ? Math.max(...db.Log_Items.map(i => i.item_id)) : 0) + 1;
      const item = {
        item_id: newItemId,
        log_id: log.log_id,
        product_id: product.product_id,
        meal_type: meal_type || "Pusdienas",
        quantity_grams: grams,
        item_calories: Math.round(product.calories * mult * 10) / 10,
        item_protein: Math.round(product.protein * mult * 10) / 10,
        item_fat: Math.round(product.fat * mult * 10) / 10,
        item_carbs: Math.round(product.carbs * mult * 10) / 10,
        created_at: new Date().toISOString()
      };

      db.Log_Items.push(item);

const allItems = db.Log_Items.filter(i => i.log_id === log.log_id);
      log.total_calories = Math.round(allItems.reduce((sum, i) => sum + i.item_calories, 0) * 10) / 10;
      log.total_protein = Math.round(allItems.reduce((sum, i) => sum + i.item_protein, 0) * 10) / 10;
      log.total_fat = Math.round(allItems.reduce((sum, i) => sum + i.item_fat, 0) * 10) / 10;
      log.total_carbs = Math.round(allItems.reduce((sum, i) => sum + i.item_carbs, 0) * 10) / 10;

      saveDatabase(db);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ item, log }));
    });
    return;
  }

let filePath = path.join(__dirname, pathname === '/' ? 'index.html' : pathname);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end("404 - Fails netika atrasts");
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end("500 - Servera kļūda: " + err.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`GrozCalc Prototipa serveris veiksmīgi palaists!`);
  console.log(`Pārlūkprogrammā atveriet: http://localhost:${PORT}`);
  console.log(`Datu fails: ${DB_FILE}`);
  console.log(`=======================================================`);
});
