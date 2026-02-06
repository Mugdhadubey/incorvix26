<?php
/**
 * Career/Job Application Form Handler
 * Handles career application submissions and sends emails with CV attachment
 * Uses PHPMailer if available, falls back to PHP mail()
 */

// Turn off error display to prevent HTML in JSON response
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Try to load PHPMailer
$usePHPMailer = false;
$phpmailerPath = __DIR__ . '/vendor/PHPMailer';
if (is_dir($phpmailerPath)) {
    // Try autoloader first
    if (file_exists($phpmailerPath . '/PHPMailer.php')) {
        try {
            require_once $phpmailerPath . '/PHPMailer.php';
            require_once $phpmailerPath . '/SMTP.php';
            require_once $phpmailerPath . '/Exception.php';
            
            if (class_exists('PHPMailer\PHPMailer\PHPMailer')) {
                $usePHPMailer = true;
                @logError("PHPMailer loaded successfully");
            } else {
                @logError("PHPMailer files loaded but class not found");
            }
        } catch (Exception $e) {
            @logError("Error loading PHPMailer: " . $e->getMessage());
        }
    } else {
        @logError("PHPMailer directory exists but PHPMailer.php not found at: " . $phpmailerPath . '/PHPMailer.php');
    }
} else {
    @logError("PHPMailer directory not found at: $phpmailerPath - will use PHP mail() fallback");
}

// Set headers first
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError(405, 'Method not allowed. Only POST requests are accepted.');
}

// Error logging function
function logError($message) {
    @error_log("Career Form Error: " . $message);
}

// Function to send JSON error response
function sendError($code, $message, $debug = null) {
    http_response_code($code);
    $response = ['success' => false, 'error' => $message];
    if ($debug !== null) {
        $response['debug'] = $debug;
    }
    echo json_encode($response);
    exit;
}

// Debug: Log request method and content type
// Only log in error_log, don't output to avoid breaking JSON response
@logError("Request Method: " . $_SERVER['REQUEST_METHOD']);
@logError("Content Type: " . ($_SERVER['CONTENT_TYPE'] ?? 'not set'));

// For multipart/form-data, $_POST should contain all form fields except files
// $_FILES contains file uploads
$postDataRaw = $_POST;
$filesRaw = $_FILES;

@logError("POST data (raw): " . json_encode($postDataRaw));
@logError("FILES data (raw): " . json_encode($filesRaw));
@logError("POST keys count: " . count($postDataRaw));
@logError("POST keys: " . implode(', ', array_keys($postDataRaw)));
@logError("FILES keys: " . implode(', ', array_keys($filesRaw)));

// Get form data (multipart/form-data from FormData)
// For multipart/form-data, text fields come in $_POST, files in $_FILES
$name = isset($postDataRaw['name']) ? trim($postDataRaw['name']) : '';
$email = isset($postDataRaw['email']) ? trim($postDataRaw['email']) : '';
$phone = isset($postDataRaw['phone']) ? trim($postDataRaw['phone']) : '';
$position = isset($postDataRaw['position']) ? trim($postDataRaw['position']) : '';
$experience = isset($postDataRaw['experience']) ? trim($postDataRaw['experience']) : '';
$message = isset($postDataRaw['message']) ? trim($postDataRaw['message']) : '';

// Debug: Log what we extracted
@logError("Extracted values - Name: '" . ($name ?: 'empty') . "', Email: '" . ($email ?: 'empty') . "', Position: '" . ($position ?: 'empty') . "'");
@logError("Name length: " . strlen($name) . ", Email length: " . strlen($email) . ", Position length: " . strlen($position));

// Validate required fields
if (empty($name) || empty($email) || empty($position)) {
    $postData = [
        'name' => $name ?: 'empty',
        'email' => $email ?: 'empty',
        'position' => $position ?: 'empty',
        'phone' => $phone ?: 'empty',
        'experience' => $experience ?: 'empty',
        'message' => $message ?: 'empty'
    ];
    
    logError("Missing required fields - Name: " . ($name ? 'set' : 'empty') . ", Email: " . ($email ? 'set' : 'empty') . ", Position: " . ($position ? 'set' : 'empty'));
    logError("POST data received: " . json_encode($postData));
    logError("POST keys: " . implode(', ', array_keys($_POST)));
    logError("FILES keys: " . implode(', ', array_keys($_FILES)));
    logError("Content-Type: " . ($_SERVER['CONTENT_TYPE'] ?? 'not set'));
    
    // Enhanced debugging for 400 error
    $debugInfo = [
        'name' => $name ? 'set (' . strlen($name) . ' chars): ' . substr($name, 0, 50) : 'missing',
        'email' => $email ? 'set (' . strlen($email) . ' chars): ' . substr($email, 0, 50) : 'missing',
        'position' => $position ? 'set (' . strlen($position) . ' chars): ' . substr($position, 0, 50) : 'missing',
        'received_data' => $postData,
        'post_raw_count' => count($_POST),
        'post_keys' => array_keys($_POST),
        'post_values' => array_map(function($v) { return is_string($v) ? substr($v, 0, 50) : $v; }, $_POST),
        'files_keys' => array_keys($_FILES),
        'files_cv' => isset($_FILES['cv']) ? [
            'name' => $_FILES['cv']['name'] ?? 'not set',
            'size' => $_FILES['cv']['size'] ?? 'not set',
            'error' => $_FILES['cv']['error'] ?? 'not set',
            'type' => $_FILES['cv']['type'] ?? 'not set'
        ] : 'cv file not in $_FILES',
        'content_type' => $_SERVER['CONTENT_TYPE'] ?? 'not set',
        'request_method' => $_SERVER['REQUEST_METHOD'] ?? 'not set',
        'content_length' => $_SERVER['CONTENT_LENGTH'] ?? 'not set',
        'php_input_size' => strlen(@file_get_contents('php://input'))
    ];
    
    @logError("400 Error Debug: " . json_encode($debugInfo));
    
    sendError(400, 'Missing required fields: name, email, and position are required', $debugInfo);
}

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    sendError(400, 'Invalid email format');
}

// Handle CV file upload
$cvFileName = 'No CV uploaded';
$cvFilePath = null;
$cvFileSize = 0;

// Check for CV file upload - more comprehensive check
$cvFileUploaded = false;
if (isset($_FILES['cv'])) {
    $cvUploadError = $_FILES['cv']['error'];
    @logError("CV file in $_FILES - Error code: $cvUploadError");
    
    if ($cvUploadError === UPLOAD_ERR_OK) {
        $cvFileUploaded = true;
        $cvFile = $_FILES['cv'];
        $cvFileName = $cvFile['name'];
        $cvFileSize = $cvFile['size'];
        $cvTmpPath = $cvFile['tmp_name'];
        
        @logError("CV file upload OK - Name: $cvFileName, Size: $cvFileSize bytes, Tmp: $cvTmpPath");
        
        // Validate file type - Only PDF and DOC allowed
        $allowedTypes = ['application/pdf', 'application/msword'];
        $fileType = $cvFile['type'];
        
        // Also check by extension - Only PDF and DOC (not DOCX)
        $fileExt = strtolower(pathinfo($cvFileName, PATHINFO_EXTENSION));
        $allowedExts = ['pdf', 'doc'];
        
        if (!in_array($fileExt, $allowedExts)) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Invalid file type. Only PDF and DOC files are allowed.']);
            exit;
        }
        
        // Double check by MIME type if extension check passed
        if (!in_array($fileType, $allowedTypes) && $fileExt !== 'pdf' && $fileExt !== 'doc') {
            logError("Warning: File type mismatch - Extension: $fileExt, MIME: $fileType");
        }
        
        // Validate file size (max 10MB)
        $maxSize = 10 * 1024 * 1024; // 10MB
        if ($cvFileSize > $maxSize) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'File size exceeds 10MB limit.']);
            exit;
        }
        
        // Save uploaded file temporarily - always save to ensure file is accessible
        $uploadDir = __DIR__ . '/uploads/';
        if (!is_dir($uploadDir)) {
            @mkdir($uploadDir, 0755, true);
        }
        
        $uniqueFileName = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $cvFileName);
        $cvFilePath = $uploadDir . $uniqueFileName;
        
        // Always try to move the file to a permanent location for email attachment
        if (move_uploaded_file($cvTmpPath, $cvFilePath)) {
            logError("CV file saved to: $cvFilePath");
            // Verify file is readable
            if (!is_readable($cvFilePath)) {
                @chmod($cvFilePath, 0644);
            }
        } else {
            // If move fails, try to copy instead
            if (@copy($cvTmpPath, $cvFilePath)) {
                logError("CV file copied to: $cvFilePath");
                @chmod($cvFilePath, 0644);
            } else {
                // Last resort - use temp file directly (may get deleted before email sends)
                logError("Warning: Using temp file directly - may be deleted: $cvTmpPath");
                $cvFilePath = $cvTmpPath;
            }
        }
        
        // Verify file exists and is readable before proceeding
        if (!file_exists($cvFilePath) || !is_readable($cvFilePath)) {
            logError("Error: CV file not accessible at: $cvFilePath");
            $cvFilePath = null;
        } else {
            // Verify file was saved correctly by checking size
            $savedFileSize = filesize($cvFilePath);
            if ($savedFileSize !== $cvFileSize) {
                logError("Warning: File size mismatch - Original: {$cvFileSize} bytes, Saved: {$savedFileSize} bytes");
            } else {
                logError("CV file verified - Saved successfully: $cvFileName ({$cvFileSize} bytes)");
            }
        }
    } else {
        // File upload error other than "no file"
        $uploadErrorMsg = 'Upload error code: ' . $cvUploadError;
        if ($cvUploadError === UPLOAD_ERR_INI_SIZE) {
            $uploadErrorMsg .= ' (File exceeds upload_max_filesize)';
        } elseif ($cvUploadError === UPLOAD_ERR_FORM_SIZE) {
            $uploadErrorMsg .= ' (File exceeds MAX_FILE_SIZE)';
        } elseif ($cvUploadError === UPLOAD_ERR_PARTIAL) {
            $uploadErrorMsg .= ' (File was only partially uploaded)';
        } elseif ($cvUploadError === UPLOAD_ERR_NO_TMP_DIR) {
            $uploadErrorMsg .= ' (Missing temporary folder)';
        } elseif ($cvUploadError === UPLOAD_ERR_CANT_WRITE) {
            $uploadErrorMsg .= ' (Failed to write file to disk)';
        } elseif ($cvUploadError === UPLOAD_ERR_EXTENSION) {
            $uploadErrorMsg .= ' (PHP extension stopped the file upload)';
        }
        logError("CV file upload error (non-blocking): $uploadErrorMsg");
        // Don't block form submission if CV upload fails - continue without CV
    }
}

// Email configuration
$to = 'contact@incorvix.nl';
$subject = 'New Job Application from ' . $name . ' - Position: ' . $position;
$fromEmail = 'contact@incorvix.nl';
$fromName = 'Incorvix Website';

// Get position display name
$positionNames = [
    'sap-consultant' => 'SAP Consultant',
    'frontend-developer' => 'Frontend Developer',
    'project-manager' => 'Project Manager',
    'other' => 'Other'
];
$positionDisplay = $positionNames[$position] ?? ucfirst(str_replace('-', ' ', $position));

// Create email body
$emailBody = "
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; }
        .header { background-color: #04adea; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .message-box { background-color: white; padding: 15px; border-radius: 4px; border-left: 4px solid #04adea; }
        .field-row { margin-bottom: 10px; }
        .field-label { font-weight: bold; color: #333; }
    </style>
</head>
<body>
    <div class='header'>
        <h2>New Job Application</h2>
    </div>
    <div class='content'>
        <h3>Applicant Details:</h3>
        <div class='field-row'>
            <span class='field-label'>Name:</span> " . htmlspecialchars($name) . "
        </div>
        <div class='field-row'>
            <span class='field-label'>Email:</span> " . htmlspecialchars($email) . "
        </div>
        <div class='field-row'>
            <span class='field-label'>Phone:</span> " . htmlspecialchars($phone ?: 'Not provided') . "
        </div>
        <div class='field-row'>
            <span class='field-label'>Position Applied:</span> " . htmlspecialchars($positionDisplay) . "
        </div>
        <div class='field-row'>
            <span class='field-label'>Experience:</span> " . htmlspecialchars($experience ?: 'Not specified') . "
        </div>
        <div class='field-row'>
            <span class='field-label'>CV File:</span> " . htmlspecialchars($cvFileName) . " (" . number_format($cvFileSize / 1024, 2) . " KB)
        </div>";

if ($message) {
    $emailBody .= "
        <div class='field-row' style='margin-top: 15px;'>
            <span class='field-label'>Cover Letter / Message:</span>
            <div class='message-box' style='margin-top: 10px;'>
                " . nl2br(htmlspecialchars($message)) . "
            </div>
        </div>";
}

$emailBody .= "
    </div>
    <p style='color: #666; font-size: 14px;'>
        This job application was submitted from the Incorvix website careers page.
        <br>The CV file is attached to this email.
    </p>
</body>
</html>
";

// Email headers
$boundary = "----=_NextPart_" . md5(time() . rand());
$boundaryAlt = "----=_NextPart_Alt_" . md5(time() . rand() + 1);

$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "From: $fromName <$fromEmail>" . "\r\n";
$headers .= "Reply-To: $email" . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

// Build email message with proper multipart structure
$emailMessage = "";

// Start multipart/mixed
if ($cvFilePath && file_exists($cvFilePath)) {
    $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"" . "\r\n";
    
    // Multipart boundary start
    $emailMessage .= "--$boundary\r\n";
    
    // HTML body part (multipart/alternative)
    $emailMessage .= "Content-Type: multipart/alternative; boundary=\"$boundaryAlt\"" . "\r\n\r\n";
    
    // Text part
    $emailMessage .= "--$boundaryAlt\r\n";
    $emailMessage .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $emailMessage .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
    $emailMessage .= strip_tags($emailBody) . "\r\n\r\n";
    
    // HTML part
    $emailMessage .= "--$boundaryAlt\r\n";
    $emailMessage .= "Content-Type: text/html; charset=UTF-8\r\n";
    $emailMessage .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
    $emailMessage .= $emailBody . "\r\n\r\n";
    
    // Close alternative boundary
    $emailMessage .= "--$boundaryAlt--\r\n\r\n";
    
    // Attach CV file
    $fileContent = @file_get_contents($cvFilePath);
    if ($fileContent === false) {
        logError("Failed to read CV file: $cvFilePath");
        // Continue without attachment if file can't be read
    } else {
        $fileBase64 = base64_encode($fileContent);
        $fileSize = strlen($fileContent);
        
        // Detect MIME type based on extension if mime_content_type fails
        $fileExt = strtolower(pathinfo($cvFileName, PATHINFO_EXTENSION));
        $mimeTypes = [
            'pdf' => 'application/pdf',
            'doc' => 'application/msword',
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];
        $fileMimeType = function_exists('mime_content_type') ? @mime_content_type($cvFilePath) : false;
        if (!$fileMimeType || !in_array($fileMimeType, $mimeTypes)) {
            $fileMimeType = $mimeTypes[$fileExt] ?? 'application/octet-stream';
        }
        
        logError("Attaching CV file: $cvFileName (Size: $fileSize bytes, MIME: $fileMimeType)");
        
        // Attachment part
        $emailMessage .= "--$boundary\r\n";
        $emailMessage .= "Content-Type: $fileMimeType; name=\"" . addslashes($cvFileName) . "\"\r\n";
        $emailMessage .= "Content-Transfer-Encoding: base64\r\n";
        $emailMessage .= "Content-Disposition: attachment; filename=\"" . addslashes($cvFileName) . "\"\r\n";
        $emailMessage .= "Content-Description: CV Attachment\r\n\r\n";
        
        // Add base64 encoded file in chunks (76 chars per line as per RFC)
        $emailMessage .= chunk_split($fileBase64, 76, "\r\n");
        $emailMessage .= "\r\n";
    }
    
    // Close multipart boundary
    $emailMessage .= "--$boundary--\r\n";
} else {
    // No attachment - simple HTML email
    $headers .= "Content-Type: text/html; charset=UTF-8" . "\r\n";
    $emailMessage = $emailBody;
    logError("CV file not available for attachment");
}

// Send email
$mailSent = false;
$mailError = '';

// SMTP Configuration
$smtpHost = 'server126.yourhosting.nl';
$smtpPort = 465;
$smtpUser = 'contact@incorvix.nl';
$smtpPassword = 'Sanket#01';
$smtpSecure = 'ssl'; // 'ssl' for port 465, 'tls' for port 587

if ($usePHPMailer) {
    // Use PHPMailer with SMTP
    try {
        $mail = new PHPMailer\PHPMailer\PHPMailer(true);
        
        // Server settings
        $mail->isSMTP();
        $mail->Host = $smtpHost;
        $mail->SMTPAuth = true;
        $mail->Username = $smtpUser;
        $mail->Password = $smtpPassword;
        $mail->SMTPSecure = $smtpSecure; // SSL/TLS
        $mail->Port = $smtpPort;
        $mail->CharSet = 'UTF-8';
        
        // Enable verbose debug output (temporarily enable for debugging)
        $mail->SMTPDebug = 2; // 0 = no output, 1 = errors and messages, 2 = verbose
        $mail->Debugoutput = function($str, $level) {
            @logError("PHPMailer Debug Level $level: " . trim($str));
        };
        
        logError("PHPMailer initialized - Attempting SMTP connection to: $smtpHost:$smtpPort");
        
        // Recipients
        $mail->setFrom($fromEmail, $fromName);
        $mail->addAddress($to);
        $mail->addReplyTo($email, $name);
        
        // Content
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $emailBody;
        $mail->AltBody = strip_tags($emailBody);
        
        // Attach CV file if available - with error handling that doesn't stop email
        $attachmentAdded = false;
        $attachmentError = '';
        
        if ($cvFilePath && file_exists($cvFilePath) && is_readable($cvFilePath)) {
            try {
                // Verify file is not empty
                $fileSize = filesize($cvFilePath);
                if ($fileSize === false || $fileSize == 0) {
                    $attachmentError = "CV file is empty or cannot read file size";
                    logError("Warning: " . $attachmentError);
                } else {
                    // Attach the file
                    $attachmentResult = $mail->addAttachment($cvFilePath, $cvFileName);
                    if ($attachmentResult) {
                        $attachmentAdded = true;
                        logError("✅ CV file attached successfully: $cvFileName (Size: " . number_format($fileSize / 1024, 2) . " KB, Path: $cvFilePath)");
                    } else {
                        $attachmentError = "PHPMailer addAttachment() returned false";
                        logError("Warning: " . $attachmentError . " for file: $cvFilePath");
                    }
                }
            } catch (Exception $attachException) {
                $attachmentError = "Exception attaching CV: " . $attachException->getMessage();
                logError("❌ Error attaching CV file: " . $attachmentError);
                // Don't throw - continue to send email without attachment
            } catch (Error $attachError) {
                $attachmentError = "Fatal error attaching CV: " . $attachError->getMessage();
                logError("❌ Fatal error attaching CV file: " . $attachmentError);
                // Don't throw - continue to send email without attachment
            }
        } else {
            if ($cvFilePath) {
                $attachmentError = "CV file not accessible - exists: " . (file_exists($cvFilePath) ? 'yes' : 'no') . ", readable: " . (is_readable($cvFilePath) ? 'yes' : 'no') . ", path: $cvFilePath";
            } else {
                $attachmentError = "No CV file uploaded or file path is null";
            }
            logError("⚠️ Warning: " . $attachmentError);
        }
        
        // Send email (ALWAYS send, even if attachment failed)
        logError("Attempting to send email via PHPMailer...");
        try {
            $sendResult = $mail->send();
            logError("PHPMailer send() returned: " . ($sendResult ? 'TRUE' : 'FALSE'));
            
            if ($sendResult) {
                $mailSent = true;
                
                if ($attachmentAdded) {
                    logError("✅ Email sent successfully via PHPMailer WITH CV attachment ($cvFileName) to: $to");
                } else {
                    logError("✅ Email sent successfully via PHPMailer to: $to (CV attachment not included: " . ($attachmentError ?: 'no file uploaded') . ")");
                }
            } else {
                $mailError = "PHPMailer send() returned false. ErrorInfo: " . $mail->ErrorInfo;
                logError("❌ Email send failed: " . $mailError);
                
                // Log additional SMTP error details if available
                if (method_exists($mail, 'getSMTPInstance')) {
                    try {
                        $smtp = $mail->getSMTPInstance();
                        if ($smtp && method_exists($smtp, 'getError')) {
                            $smtpError = $smtp->getError();
                            if ($smtpError) {
                                logError("SMTP Error details: " . json_encode($smtpError));
                                $mailError .= " | SMTP: " . json_encode($smtpError);
                            }
                        }
                    } catch (Exception $e) {
                        logError("Could not get SMTP error details: " . $e->getMessage());
                    }
                }
                
                $mailSent = false;
            }
        } catch (PHPMailer\PHPMailer\Exception $sendException) {
            $mailError = "PHPMailer Exception during send: " . $mail->ErrorInfo;
            logError("❌ Email send exception: " . $mailError);
            $mailSent = false;
        } catch (Exception $sendException) {
            $mailError = "General Exception during send: " . $sendException->getMessage();
            logError("❌ Email send general exception: " . $mailError);
            $mailSent = false;
        }
        
    } catch (PHPMailer\PHPMailer\Exception $e) {
        $mailError = "PHPMailer Error: " . $mail->ErrorInfo;
        logError("PHPMailer exception: " . $mailError);
        $mailSent = false;
        
        // Log attachment status if available
        if (isset($attachmentError) && $attachmentError) {
            logError("Attachment error (before email failure): " . $attachmentError);
        }
    } catch (Exception $e) {
        $mailError = "Exception: " . $e->getMessage();
        logError("General exception: " . $mailError);
        $mailSent = false;
        
        // Log attachment status if available
        if (isset($attachmentError) && $attachmentError) {
            logError("Attachment error (before email failure): " . $attachmentError);
        }
    }
} else {
    // Fallback to PHP mail() function
    logError("PHPMailer not available, using PHP mail()");
    
    if (!function_exists('mail')) {
        logError("ERROR: PHP mail() function is not available on this server");
        $mailError = "PHP mail() function is not enabled on server";
    } else {
        // Get last error before sending
        $lastError = error_get_last();
        
        // Try to send email
        try {
            $mailSent = @mail($to, $subject, $emailMessage, $headers);
            
            // Check for errors after sending
            $currentError = error_get_last();
            if ($currentError && $currentError !== $lastError) {
                logError("Mail error detected: " . $currentError['message']);
                $mailError = $currentError['message'];
            }
            
            if ($mailSent) {
                logError("Email sent successfully via PHP mail() to: $to");
            } else {
                logError("Email send returned FALSE - mail may have failed silently");
                $mailError = "Email send function returned false - check server configuration";
            }
        } catch (Exception $e) {
            logError("Email send exception: " . $e->getMessage());
            $mailError = $e->getMessage();
            $mailSent = false;
        }
        
        // Additional diagnostics
        $sendmailPath = ini_get('sendmail_path');
        $smtp = ini_get('SMTP');
        $smtpPort = ini_get('smtp_port');
        
        logError("Mail configuration - sendmail_path: " . ($sendmailPath ?: 'not set'));
        logError("Mail configuration - SMTP: " . ($smtp ?: 'not set'));
        logError("Mail configuration - smtp_port: " . ($smtpPort ?: 'not set'));
    }
}

if ($mailSent) {
    logError("✅ Main email sent successfully! Proceeding with auto-reply...");
    // Send auto-reply to applicant (without attachment)
    $autoReplySubject = "Thank you for your application - Incorvix";
    $autoReplyBody = "
    <html>
    <body style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
        <div style='background-color: #04adea; color: white; padding: 20px; text-align: center;'>
            <h2>Thank You for Your Application!</h2>
        </div>
        <div style='padding: 20px;'>
            <p>Dear $name,</p>
            <p>Thank you for your interest in joining the Incorvix team. We have successfully received your application for the position of <strong>$positionDisplay</strong>.</p>
            <p>Our HR team will review your application and CV. If your profile matches our requirements, we will contact you within the next few business days.</p>
            <p>We appreciate your interest in becoming part of our dynamic team and helping us transform businesses through innovative SAP solutions.</p>
            <p>If you have any questions about your application, please feel free to contact us at <strong>contact@incorvix.nl</strong></p>
            <p>Best regards,<br>The Incorvix HR Team</p>
        </div>
    </body>
    </html>
    ";
    
    // Send auto-reply
    if ($usePHPMailer) {
        try {
            $autoReplyMail = new PHPMailer\PHPMailer\PHPMailer(true);
            $autoReplyMail->isSMTP();
            $autoReplyMail->Host = $smtpHost;
            $autoReplyMail->SMTPAuth = true;
            $autoReplyMail->Username = $smtpUser;
            $autoReplyMail->Password = $smtpPassword;
            $autoReplyMail->SMTPSecure = $smtpSecure;
            $autoReplyMail->Port = $smtpPort;
            $autoReplyMail->CharSet = 'UTF-8';
            $autoReplyMail->SMTPDebug = 0;
            
            $autoReplyMail->setFrom($fromEmail, $fromName);
            $autoReplyMail->addAddress($email, $name);
            $autoReplyMail->isHTML(true);
            $autoReplyMail->Subject = $autoReplySubject;
            $autoReplyMail->Body = $autoReplyBody;
            $autoReplyMail->AltBody = strip_tags($autoReplyBody);
            
            $autoReplyMail->send();
            logError("Auto-reply sent via PHPMailer to: $email");
        } catch (Exception $e) {
            logError("Failed to send auto-reply: " . $e->getMessage());
        }
    } else {
        $autoReplyHeaders = "MIME-Version: 1.0" . "\r\n";
        $autoReplyHeaders .= "Content-type:text/html;charset=UTF-8" . "\r\n";
        $autoReplyHeaders .= "From: $fromName <$fromEmail>" . "\r\n";
        @mail($email, $autoReplySubject, $autoReplyBody, $autoReplyHeaders);
    }
    
    // Clean up uploaded file after sending
    if ($cvFilePath && file_exists($cvFilePath) && strpos($cvFilePath, __DIR__ . '/uploads/') === 0) {
        @unlink($cvFilePath);
        logError("Cleaned up CV file after successful email send");
    }
    
    // Prepare response with attachment status and email details
    $responseData = [
        'success' => true,
        'message' => 'Thank you for your application! We\'ll review your CV and get back to you soon.',
        'email_sent' => true,
        'email_to' => $to
    ];
    
    // Include attachment status in response (for debugging)
    if (isset($attachmentAdded) && !$attachmentAdded && isset($attachmentError)) {
        $responseData['attachment_warning'] = $attachmentError;
        $responseData['attachment_status'] = 'failed: ' . $attachmentError;
        logError("⚠️ Email sent successfully but CV attachment failed: " . $attachmentError);
    } elseif (isset($attachmentAdded) && $attachmentAdded) {
        $responseData['attachment_status'] = 'success';
        $responseData['attachment_name'] = $cvFileName;
        logError("✅ Email sent successfully WITH CV attachment: $cvFileName");
    } else {
        $responseData['attachment_status'] = 'no_file_uploaded';
        logError("✅ Email sent successfully (no CV file uploaded)");
    }
    
    // Add method used for sending
    $responseData['email_method'] = $usePHPMailer ? 'PHPMailer (SMTP)' : 'PHP mail()';
    
    echo json_encode($responseData);
    logError("✅ SUCCESS: Career form submission completed successfully! Email sent to: $to");
} else {
    // Email failed to send
    logError("❌ FAILED to send email. Error: " . ($mailError ?: 'Unknown error'));
    
    // Clean up uploaded file on error
    if ($cvFilePath && file_exists($cvFilePath) && strpos($cvFilePath, __DIR__ . '/uploads/') === 0) {
        @unlink($cvFilePath);
        logError("Cleaned up CV file after email failure");
    }
    
    // Return detailed error
    $errorMessage = 'Failed to send email. ';
    if ($mailError) {
        $errorMessage .= 'Error: ' . $mailError;
    } else {
        $errorMessage .= 'Please check server configuration or contact support.';
    }
    
    $errorDebug = [
        'mail_error' => $mailError ?: 'Unknown',
        'phpmailer_available' => $usePHPMailer,
        'attachment_status' => isset($attachmentAdded) ? ($attachmentAdded ? 'attached' : ($attachmentError ?: 'not attached')) : 'unknown',
    ];
    
    if (isset($debugInfo)) {
        $errorDebug['validation_debug'] = $debugInfo;
    }
    
    sendError(500, $errorMessage, $errorDebug);
}
?>
