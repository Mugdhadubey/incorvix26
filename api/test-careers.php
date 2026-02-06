<?php
/**
 * Simple test endpoint to verify PHP and file uploads work
 */
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$response = [
    'success' => true,
    'message' => 'Test endpoint is working',
    'server_info' => [
        'method' => $_SERVER['REQUEST_METHOD'],
        'content_type' => $_SERVER['CONTENT_TYPE'] ?? 'not set',
        'php_version' => phpversion(),
        'post_data' => $_POST,
        'files_data' => $_FILES,
        'post_max_size' => ini_get('post_max_size'),
        'upload_max_filesize' => ini_get('upload_max_filesize'),
        'max_file_uploads' => ini_get('max_file_uploads'),
    ]
];

echo json_encode($response, JSON_PRETTY_PRINT);
?>

