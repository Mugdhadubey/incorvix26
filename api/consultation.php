<?php
/**
 * Consultation Form Handler
 * Handles consultation form submissions and sends emails via SMTP
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
$required = ['firstName', 'lastName', 'email', 'company', 'service', 'message'];
foreach ($required as $field) {
    if (!isset($input[$field]) || empty(trim($input[$field]))) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => "Missing required field: $field"]);
        exit;
    }
}

$firstName = trim($input['firstName']);
$lastName = trim($input['lastName']);
$email = trim($input['email']);
$company = trim($input['company']);
$service = trim($input['service']);
$message = trim($input['message']);

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid email format']);
    exit;
}

// Email configuration
$to = 'contact@incorvix.nl';
$subject = 'New Consultation Request from ' . $firstName . ' ' . $lastName;
$fromEmail = 'contact@incorvix.nl';
$fromName = 'Incorvix Website';

// Create email body
$emailBody = "
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; }
        .header { background-color: #04adea; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .message-box { background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #04adea; }
    </style>
</head>
<body>
    <div class='header'>
        <h2>New Consultation Request</h2>
    </div>
    <div class='content'>
        <h3>Client Details:</h3>
        <p><strong>Name:</strong> " . htmlspecialchars($firstName . ' ' . $lastName) . "</p>
        <p><strong>Email:</strong> " . htmlspecialchars($email) . "</p>
        <p><strong>Company:</strong> " . htmlspecialchars($company) . "</p>
        <p><strong>Service Interest:</strong> " . htmlspecialchars($service) . "</p>
        <p><strong>Message:</strong></p>
        <div class='message-box'>
            " . nl2br(htmlspecialchars($message)) . "
        </div>
    </div>
    <p style='color: #666; font-size: 14px;'>
        This consultation request was submitted from the Incorvix website.
    </p>
</body>
</html>
";

// Email headers
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
$headers .= "From: $fromName <$fromEmail>" . "\r\n";
$headers .= "Reply-To: $email" . "\r\n";

// Send email
$mailSent = mail($to, $subject, $emailBody, $headers);

if ($mailSent) {
    // Send auto-reply to customer
    $customerName = $firstName . ' ' . $lastName;
    $autoReplySubject = "Thank you for contacting Incorvix - We'll be in touch soon!";
    $autoReplyBody = "
    <html>
    <body style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
        <div style='background-color: #04adea; color: white; padding: 20px; text-align: center;'>
            <h2>Thank You for Your Consultation Request!</h2>
        </div>
        <div style='padding: 20px;'>
            <p>Dear $customerName,</p>
            <p>Thank you for your interest in our SAP solutions. We have received your consultation request and our team will get back to you within 24 hours.</p>
            <p>We look forward to helping you transform your business with innovative SAP technology.</p>
            <p>If you have any urgent inquiries, please feel free to contact us directly at <strong>contact@incorvix.nl</strong></p>
            <p>Best regards,<br>The Incorvix Team</p>
        </div>
    </body>
    </html>
    ";
    
    $autoReplyHeaders = "MIME-Version: 1.0" . "\r\n";
    $autoReplyHeaders .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $autoReplyHeaders .= "From: $fromName <$fromEmail>" . "\r\n";
    
    mail($email, $autoReplySubject, $autoReplyBody, $autoReplyHeaders);
    
    echo json_encode([
        'success' => true,
        'message' => 'Thank you for your consultation request! We\'ll get back to you within 24 hours.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Failed to send consultation request. Please try again later.'
    ]);
}
?>

