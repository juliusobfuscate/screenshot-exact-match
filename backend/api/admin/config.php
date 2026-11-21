<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once __DIR__ . '/../../includes/config.php';
require_once __DIR__ . '/../../includes/functions.php';

// Handle OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Verify admin token from headers
$headers = apache_request_headers();
$auth_header = $headers['Authorization'] ?? '';
$token = str_replace('Bearer ', '', $auth_header);

if (!authenticate_admin($token)) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized.']);
    exit;
}

// Handle GET
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $settings = get_settings();
        echo json_encode([
            'success' => true,
            'data' => [
                'admin_email' => $settings['admin_email'],
                'admin_token' => '********' // Don't return actual token
            ]
        ]);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
// Handle POST (update config)
elif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Invalid JSON data');
        }

        $email = sanitize_input($data['admin_email'] ?? '');
        $new_token = $data['admin_token'] ?? null;

        // Get current settings
        $settings = get_settings();
        $current_token = $settings['admin_token'];

        // If updating email
        if ($email && !empty($email)) {
            if (!validate_email($email)) {
                echo json_encode(['success' => false, 'message' => 'Invalid email address.']);
                exit;
            }
            // Update email
            update_settings($email, $current_token);
        }

        // If updating token
        if ($new_token && !empty($new_token)) {
            if (strlen($new_token) < 8) {
                echo json_encode(['success' => false, 'message' => 'Token must be at least 8 characters.']);
                exit;
            }
            // Update token
            update_settings($settings['admin_email'], $new_token);
        }

        echo json_encode(['success' => true, 'message' => 'Configuration updated successfully.']);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
}
?>