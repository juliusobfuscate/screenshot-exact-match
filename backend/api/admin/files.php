<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

require_once __DIR__ . '/../../includes/config.php';
require_once __DIR__ . '/../../includes/functions.php';

// Handle OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Verify admin token
$headers = apache_request_headers();
$auth_header = $headers['Authorization'] ?? '';
$token = str_replace('Bearer ', '', $auth_header);

if (!authenticate_admin($token)) {
    http_response_code(401);
    echo json_encode(['success' => false, 'message' => 'Unauthorized. Invalid token.']);
    exit;
}

// Handle GET (get all files)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $files = get_files();
        echo json_encode([
            'success' => true,
            'data' => $files
        ]);
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
// Handle POST (add new file)
elif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Invalid JSON data');
        }

        $name = sanitize_input($data['name'] ?? '');
        $type = sanitize_input($data['type'] ?? '');
        $size = sanitize_input($data['size'] ?? '');
        $icon = sanitize_input($data['icon'] ?? '');

        if (empty($name) || empty($type) || empty($size)) {
            echo json_encode(['success' => false, 'message' => 'Name, type, and size are required.']);
            exit;
        }

        $added = add_file($name, $type, $size, $icon);

        if ($added) {
            echo json_encode(['success' => true, 'message' => 'File added successfully.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to add file.']);
        }
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
// Handle PUT (update file)
elif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    try {
        parse_str(file_get_contents('php://input'), $data);

        $id = (int)($data['id'] ?? 0);
        $name = sanitize_input($data['name'] ?? '');
        $type = sanitize_input($data['type'] ?? '');
        $size = sanitize_input($data['size'] ?? '');
        $icon = sanitize_input($data['icon'] ?? '');

        if ($id <= 0) {
            echo json_encode(['success' => false, 'message' => 'Invalid file ID.']);
            exit;
        }

        $updated = update_file($id, $name, $type, $size, $icon);

        if ($updated) {
            echo json_encode(['success' => true, 'message' => 'File updated successfully.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to update file.']);
        }
    } catch (Exception $e) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
// Handle DELETE
elif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    try {
        parse_str(file_get_contents('php://input'), $data);
        $id = (int)($data['id'] ?? 0);

        if ($id <= 0) {
            echo json_encode(['success' => false, 'message' => 'Invalid file ID.']);
            exit;
        }

        $deleted = delete_file($id);

        if ($deleted) {
            echo json_encode(['success' => true, 'message' => 'File deleted successfully.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to delete file.']);
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