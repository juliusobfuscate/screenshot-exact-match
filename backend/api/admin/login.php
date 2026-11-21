<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once __DIR__ . '/../../includes/config.php';
require_once __DIR__ . '/../../includes/functions.php';

// Handle OPTIONS
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

        $token = $data['token'] ?? '';
        $email = sanitize_input($data['email'] ?? '');

        // Verify token
        if (!authenticate_admin($token)) {
            echo json_encode(['success' => false, 'message' => 'Invalid token.']);
            exit;
        }

        // Verify email (optional, but recommended)
        $settings = get_settings();
        if ($email !== $settings['admin_email']) {
            echo json_encode(['success' => false, 'message' => 'Invalid email.']);
            exit;
        }

        // Generate session token (for future requests)
        $session_token = bin2hex(random_bytes(32));

        echo json_encode([
            'success' => true,
            'message' => 'Admin authentication successful.',
            'token' => $session_token,
            'admin_email' => $settings['admin_email']
        ]);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
}
?>