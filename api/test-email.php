<?php
/**
 * Email Test Script
 * Tests if PHP mail() function is working on the server
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$result = [
    'success' => false,
    'message' => '',
    'diagnostics' => []
];

// Check mail function
$result['diagnostics']['mail_function_exists'] = function_exists('mail');
$result['diagnostics']['sendmail_path'] = ini_get('sendmail_path') ?: 'not set';
$result['diagnostics']['smtp_server'] = ini_get('SMTP') ?: 'not set';
$result['diagnostics']['smtp_port'] = ini_get('smtp_port') ?: 'not set';

// Test email configuration
$to = 'contact@incorvix.nl';
$subject = 'Test Email from Incorvix Server';
$message = "This is a test email to verify that PHP mail() function is working.\n\nServer time: " . date('Y-m-d H:i:s');
$headers = "From: contact@incorvix.nl\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Actually send test email
    if (function_exists('mail')) {
        $lastError = error_get_last();
        $mailSent = @mail($to, $subject, $message, $headers);
        $currentError = error_get_last();
        
        if ($mailSent) {
            $result['success'] = true;
            $result['message'] = 'Test email sent successfully! Check inbox at ' . $to;
        } else {
            $result['success'] = false;
            $result['message'] = 'Email send returned FALSE';
            if ($currentError && $currentError !== $lastError) {
                $result['error'] = $currentError['message'];
            }
        }
    } else {
        $result['success'] = false;
        $result['message'] = 'PHP mail() function is not available';
    }
} else {
    // Just return diagnostics
    $result['message'] = 'Email diagnostics. Send POST request to actually test email sending.';
    $result['usage'] = 'Send POST request to this file to send a test email';
}

echo json_encode($result, JSON_PRETTY_PRINT);
?>

