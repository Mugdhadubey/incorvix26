<?php
/**
 * Contact Form Handler with PHPMailer SMTP Support
 * Handles contact form submissions and sends emails via SMTP
 * 
 * REQUIREMENT: Install PHPMailer via Composer or download manually
 * Composer: composer require phpmailer/phpmailer
 * Or download: https://github.com/PHPMailer/PHPMailer
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Load PHPMailer (adjust path as needed)
// Option 1: If using Composer
// require_once __DIR__ . '/vendor/autoload.php';

// Option 2: If using manual installation
// require_once __DIR__ . '/vendor/PHPMailer/src/PHPMailer.php';
// require_once __DIR__ . '/vendor/PHPMailer/src/SMTP.php';
// require_once __DIR__ . '/vendor/PHPMailer/src/Exception.php';

// Check if PHPMailer is available
$usePHPMailer = class_exists('PHPMailer\PHPMailer\PHPMailer');

if ($usePHPMailer) {
    use PHPMailer\PHPMailer\PHPMailer;
    use PHPMailer\PHPMailer\Exception;
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate required fields
if (!isset($input['name']) || !isset($input['email']) || !isset($input['message'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing required fields: name, email, and message are required']);
    exit;
}

$name = trim($input['name']);
$email = trim($input['email']);
$message = trim($input['message']);

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid email format']);
    exit;
}

// Email configuration
$to = 'contact@incorvix.nl';
$subject = 'New Contact Form Submission from ' . $name;
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
        <h2>New Contact Form Submission</h2>
    </div>
    <div class='content'>
        <h3>Contact Details:</h3>
        <p><strong>Name:</strong> " . htmlspecialchars($name) . "</p>
        <p><strong>Email:</strong> " . htmlspecialchars($email) . "</p>
        <p><strong>Message:</strong></p>
        <div class='message-box'>
            " . nl2br(htmlspecialchars($message)) . "
        </div>
    </div>
    <p style='color: #666; font-size: 14px;'>
        This message was submitted from the Incorvix website contact form.
    </p>
</body>
</html>
";

$mailSent = false;
$errorMessage = '';

if ($usePHPMailer) {
    // Use PHPMailer with SMTP
    try {
        $mail = new PHPMailer(true);
        
        // SMTP Configuration
        $mail->isSMTP();
        $mail->Host = 'server126.yourhosting.nl';
        $mail->SMTPAuth = true;
        $mail->Username = 'contact@incorvix.nl';
        $mail->Password = 'Sanket#01';
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // SSL/TLS
        $mail->Port = 465;
        
        // Email settings
        $mail->setFrom($fromEmail, $fromName);
        $mail->addAddress($to);
        $mail->addReplyTo($email, $name);
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $emailBody;
        $mail->AltBody = strip_tags($emailBody);
        
        $mail->send();
        $mailSent = true;
        
        // Send auto-reply
        $autoReply = new PHPMailer(true);
        $autoReply->isSMTP();
        $autoReply->Host = 'server126.yourhosting.nl';
        $autoReply->SMTPAuth = true;
        $autoReply->Username = 'contact@incorvix.nl';
        $autoReply->Password = 'Sanket#01';
        $autoReply->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $autoReply->Port = 465;
        
        $autoReply->setFrom($fromEmail, $fromName);
        $autoReply->addAddress($email);
        $autoReply->isHTML(true);
        $autoReply->Subject = "Thank you for contacting Incorvix - We'll be in touch soon!";
        $autoReply->Body = "
        <html>
        <body style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
            <div style='background-color: #04adea; color: white; padding: 20px; text-align: center;'>
                <h2>Thank You for Contacting Incorvix!</h2>
            </div>
            <div style='padding: 20px;'>
                <p>Dear $name,</p>
                <p>Thank you for reaching out to us. We have received your message and our team will get back to you within 24 hours.</p>
                <p>If you have any urgent inquiries, please feel free to contact us directly at <strong>contact@incorvix.nl</strong></p>
                <p>Best regards,<br>The Incorvix Team</p>
            </div>
        </body>
        </html>
        ";
        
        $autoReply->send();
        
    } catch (Exception $e) {
        $errorMessage = "PHPMailer Error: {$mail->ErrorInfo}";
    }
} else {
    // Fallback to basic PHP mail()
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: $fromName <$fromEmail>" . "\r\n";
    $headers .= "Reply-To: $email" . "\r\n";
    
    $mailSent = mail($to, $subject, $emailBody, $headers);
    
    if ($mailSent) {
        // Send auto-reply
        $autoReplySubject = "Thank you for contacting Incorvix - We'll be in touch soon!";
        $autoReplyBody = "
        <html>
        <body style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
            <div style='background-color: #04adea; color: white; padding: 20px; text-align: center;'>
                <h2>Thank You for Contacting Incorvix!</h2>
            </div>
            <div style='padding: 20px;'>
                <p>Dear $name,</p>
                <p>Thank you for reaching out to us. We have received your message and our team will get back to you within 24 hours.</p>
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
    }
}

if ($mailSent) {
    echo json_encode([
        'success' => true,
        'message' => 'Thank you for your message! We\'ll get back to you within 24 hours.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $errorMessage ?: 'Failed to send email. Please try again later.'
    ]);
}
?>

