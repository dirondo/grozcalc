

CREATE TABLE IF NOT EXISTS Users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS User_Profiles (
    profile_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    weight REAL NOT NULL,           
    height REAL NOT NULL,           
    age INTEGER NOT NULL,
    calorie_target INTEGER NOT NULL DEFAULT 2200,
    protein_target INTEGER NOT NULL DEFAULT 140,  
    fat_target INTEGER NOT NULL DEFAULT 70,       
    carbs_target INTEGER NOT NULL DEFAULT 220,    
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Products (
    product_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    store VARCHAR(50) NOT NULL,     
    price REAL NOT NULL,            
    calories REAL NOT NULL,         
    protein REAL NOT NULL,          
    fat REAL NOT NULL,              
    carbs REAL NOT NULL,            
    quality_badge VARCHAR(50) NOT NULL DEFAULT 'Neitrāls' 
        CHECK (quality_badge IN ('Ļoti ieteicams', 'Neitrāls', 'Neieteicams')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS Daily_Logs (
    log_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    log_date DATE NOT NULL,
    total_calories REAL DEFAULT 0,
    total_protein REAL DEFAULT 0,
    total_fat REAL DEFAULT 0,
    total_carbs REAL DEFAULT 0,
    UNIQUE(user_id, log_date),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Log_Items (
    item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    log_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    meal_type VARCHAR(50) DEFAULT 'Dienas uzturs', 
    quantity_grams REAL NOT NULL CHECK (quantity_grams > 0),
    item_calories REAL NOT NULL,
    item_protein REAL NOT NULL,
    item_fat REAL NOT NULL,
    item_carbs REAL NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (log_id) REFERENCES Daily_Logs(log_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS Blacklist (
    blacklist_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    reason VARCHAR(255),
    added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES Products(product_id) ON DELETE CASCADE
);

INSERT OR IGNORE INTO Users (user_id, email, password_hash, role) VALUES 
(1, 'lietotajs@grozcalc.lv', 'scrypt_hashed_password_123', 'user'),
(2, 'admin_deniss@grozcalc.lv', 'scrypt_hashed_admin_pass', 'admin');

INSERT OR IGNORE INTO User_Profiles (profile_id, user_id, name, weight, height, age, calorie_target, protein_target, fat_target, carbs_target) VALUES 
(1, 1, 'Daniils', 76.5, 182, 21, 2200, 140, 70, 220),
(2, 2, 'Deniss (Admin)', 80.0, 185, 22, 2400, 150, 75, 240);

INSERT OR IGNORE INTO Products (product_id, name, brand, store, price, calories, protein, fat, carbs, quality_badge) VALUES
(1, 'Valmieras biezpiens 0.5%', 'Valmiera', 'Rimi', 1.39, 80.0, 16.0, 0.5, 3.0, 'Ļoti ieteicams'),
(2, 'Baltais Vājpiena Biezpiens 0.5%', 'Baltais', 'Rimi', 1.29, 78.0, 16.5, 0.5, 2.0, 'Ļoti ieteicams'),
(3, 'Hanzas Maiznīca Tostmaize', 'Hanzas Maiznīca', 'Rimi', 1.15, 250.0, 8.0, 2.0, 50.0, 'Neitrāls'),
(4, 'Saldā biezpiena masa ar rozīnēm', 'Kārums', 'Maxima', 1.89, 310.0, 9.0, 14.0, 36.0, 'Neieteicams'),
(5, 'Šokolādes sieriņš Kārums', 'Kārums', 'Maxima', 0.55, 380.0, 8.2, 22.0, 36.0, 'Neitrāls'),
(6, 'Pilnpiena Biezpiens 9%', 'Valmiera', 'Rimi', 1.59, 154.0, 16.0, 9.0, 2.5, 'Ļoti ieteicams'),
(7, 'Alma piens 2.5%', 'Alma', 'Maxima', 1.19, 54.0, 3.2, 2.5, 4.7, 'Ļoti ieteicams'),
(8, 'Forevers Vistas krūtiņas fileja', 'Forevers', 'Rimi', 5.99, 115.0, 23.5, 1.5, 0.0, 'Ļoti ieteicams'),
(9, 'Well Done Olas M 10gb', 'Well Done', 'Maxima', 1.79, 143.0, 12.6, 9.5, 0.7, 'Ļoti ieteicams'),
(10, 'Selga Klasiskie cepumi', 'Selga', 'Maxima', 0.89, 440.0, 7.5, 14.0, 70.0, 'Neieteicams'),
(11, 'Lāču Īstā Rudzu maize', 'Lāči', 'Rimi', 2.19, 215.0, 6.2, 1.2, 44.0, 'Ļoti ieteicams'),
(12, 'Trikāta Siers Krievijas 50%', 'Trikāta', 'Maxima', 2.49, 345.0, 24.0, 28.0, 0.0, 'Neitrāls');

INSERT OR IGNORE INTO Daily_Logs (log_id, user_id, log_date, total_calories, total_protein, total_fat, total_carbs) VALUES
(1, 1, DATE('now'), 285.0, 37.0, 2.0, 31.0);

INSERT OR IGNORE INTO Log_Items (item_id, log_id, product_id, meal_type, quantity_grams, item_calories, item_protein, item_fat, item_carbs) VALUES
(1, 1, 1, 'Pusdienas', 200, 160.0, 32.0, 1.0, 6.0),
(2, 1, 3, 'Pusdienas', 50, 125.0, 4.0, 1.0, 25.0);

INSERT OR IGNORE INTO Blacklist (blacklist_id, user_id, product_id, reason, added_date) VALUES
(1, 1, 4, 'Augsts cukura daudzums (24g uz 100g)', CURRENT_TIMESTAMP);
