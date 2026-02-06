<?php
/**
 * Sendmail.php - Career Application Form Handler
 * 
 * This script handles career application form submissions and sends emails with CV attachments.
 * Uses PHP's built-in mail() function with proper MIME formatting for attachments.
 * Works perfectly on Hostinger shared hosting.
 * 
 * Form Fields Required:
 * - name (required)
 * - email (required)
 * - position (required)
 * - cv (file upload, required)
 */

// Disable error display to prevent output before headers
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Configuration
$recipientEmail = 'contact@incorvix.nl';
$fromEmail = 'noreply@incorvix.com';
$fromName = 'Incorvix Website';

// Check if form was submitted via POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    showError('Invalid request method. Please submit the form properly.');
    exit;
}

// Collect and sanitize form data
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$position = isset($_POST['position']) ? trim($_POST['position']) : '';

// Validate required fields
if (empty($name)) {
    showError('Please enter your full name.');
    exit;
}

if (empty($email)) {
    showError('Please enter your email address.');
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    showError('Please enter a valid email address.');
    exit;
}

if (empty($position)) {
    showError('Please select a position.');
    exit;
}

// Handle CV file upload
$cvFileName = '';
$cvFileContent = null;
$cvFileSize = 0;
$cvFileType = '';
$fileExt = '';
$savedFilePath = null; // To store temporary file path for cleanup

if (isset($_FILES['cv']) && $_FILES['cv']['error'] === UPLOAD_ERR_OK) {
    $cvFile = $_FILES['cv'];
    $cvFileName = $cvFile['name'];
    $cvFileSize = $cvFile['size'];
    $cvTmpPath = $cvFile['tmp_name'];
    $cvFileType = $cvFile['type'];
    
    // Get file extension
    $fileExt = strtolower(pathinfo($cvFileName, PATHINFO_EXTENSION));
    $allowedExts = ['pdf', 'doc'];
    
    // Validate file type (only PDF and DOC allowed)
    if (!in_array($fileExt, $allowedExts)) {
        showError('Invalid file type. Only PDF and DOC files are allowed.');
        exit;
    }
    
    // Validate file size (max 10MB)
    $maxSize = 10 * 1024 * 1024; // 10MB
    if ($cvFileSize > $maxSize) {
        showError('File size exceeds 10MB limit. Please upload a smaller file.');
        exit;
    }
    
    // Create uploads directory if it doesn't exist
    $uploadDir = __DIR__ . '/uploads/';
    if (!is_dir($uploadDir)) {
        @mkdir($uploadDir, 0755, true);
    }
    
    // Generate unique filename to avoid conflicts
    $uniqueFileName = time() . '_' . uniqid() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $cvFileName);
    $savedFilePath = $uploadDir . $uniqueFileName;
    
    // Save file temporarily before attaching
    if (!move_uploaded_file($cvTmpPath, $savedFilePath)) {
        // If move_uploaded_file fails, try copy as fallback
        if (!@copy($cvTmpPath, $savedFilePath)) {
            showError('Failed to save uploaded file. Please try again.');
            exit;
        }
    }
    
    // Verify file was saved and is readable
    if (!file_exists($savedFilePath) || !is_readable($savedFilePath)) {
        showError('Failed to access uploaded file. Please try again.');
        exit;
    }
    
    // Read file content for attachment from saved location
    $cvFileContent = @file_get_contents($savedFilePath);
    if ($cvFileContent === false || empty($cvFileContent)) {
        // Clean up saved file
        @unlink($savedFilePath);
        showError('Failed to read uploaded file. Please try again.');
        exit;
    }
} else {
    // Handle upload errors
    if (isset($_FILES['cv'])) {
        $uploadError = $_FILES['cv']['error'];
        if ($uploadError === UPLOAD_ERR_INI_SIZE || $uploadError === UPLOAD_ERR_FORM_SIZE) {
            showError('File is too large. Maximum size is 10MB.');
        } elseif ($uploadError === UPLOAD_ERR_PARTIAL) {
            showError('File was only partially uploaded. Please try again.');
        } elseif ($uploadError === UPLOAD_ERR_NO_FILE) {
            showError('Please upload your CV.');
        } else {
            showError('File upload error occurred. Please try again.');
        }
    } else {
        showError('Please upload your CV.');
    }
    exit;
}

// Map position values to display names
$positionNames = [
    'sap-consultant' => 'SAP Consultant',
    'frontend-developer' => 'Frontend Developer',
    'project-manager' => 'Project Manager',
    'other' => 'Other'
];
$positionDisplay = isset($positionNames[$position]) ? $positionNames[$position] : ucfirst(str_replace('-', ' ', $position));

// Create email subject (as per requirement: "New Job Application - [Position Name]")
$subject = 'New Job Application - ' . $positionDisplay;

// Create email body in HTML format
$emailBody = '<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 20px auto; padding: 0; background-color: #ffffff; }
        .header { background-color: #04adea; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f8f9fa; padding: 20px; }
        .field { margin-bottom: 15px; padding: 10px 0; border-bottom: 1px solid #e0e0e0; }
        .field:last-child { border-bottom: none; }
        .label { font-weight: bold; color: #555; display: inline-block; min-width: 140px; }
        .value { color: #333; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2 style="margin: 0;">New Job Application</h2>
        </div>
        <div class="content">
            <h3 style="color: #04adea; margin-top: 0;">Applicant Details:</h3>
            
            <div class="field">
                <span class="label">Name:</span>
                <span class="value">' . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . '</span>
            </div>
            
            <div class="field">
                <span class="label">Email:</span>
                <span class="value">' . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . '</span>
            </div>
            
            <div class="field">
                <span class="label">Position Applied:</span>
                <span class="value">' . htmlspecialchars($positionDisplay, ENT_QUOTES, 'UTF-8') . '</span>
            </div>
            
            <div class="field">
                <span class="label">CV File:</span>
                <span class="value">' . htmlspecialchars($cvFileName, ENT_QUOTES, 'UTF-8') . ' (' . number_format($cvFileSize / 1024, 2) . ' KB)</span>
            </div>
        </div>
    </div>
</body>
</html>';

// Determine MIME type for attachment
if (empty($cvFileType)) {
    if ($fileExt === 'pdf') {
        $cvFileType = 'application/pdf';
    } elseif ($fileExt === 'doc') {
        $cvFileType = 'application/msword';
    } else {
        $cvFileType = 'application/octet-stream';
    }
}

// Generate unique boundary for multipart message
$boundary = '----=_NextPart_' . md5(time() . uniqid(rand(), true));

// Prepare email headers
$headers = "MIME-Version: 1.0\r\n";
$headers .= "From: " . $fromName . " <" . $fromEmail . ">\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
$headers .= "Content-Type: multipart/mixed; boundary=\"" . $boundary . "\"\r\n";

// Build multipart message body
$message = "";

// Add HTML email body part
$message .= "--" . $boundary . "\r\n";
$message .= "Content-Type: text/html; charset=UTF-8\r\n";
$message .= "Content-Transfer-Encoding: 7bit\r\n";
$message .= "\r\n";
$message .= $emailBody . "\r\n";
$message .= "\r\n";

// Add CV file attachment
$message .= "--" . $boundary . "\r\n";
$message .= "Content-Type: " . $cvFileType . "; name=\"" . $cvFileName . "\"\r\n";
$message .= "Content-Transfer-Encoding: base64\r\n";
$message .= "Content-Disposition: attachment; filename=\"" . $cvFileName . "\"\r\n";
$message .= "\r\n";
$message .= chunk_split(base64_encode($cvFileContent), 76, "\r\n");
$message .= "\r\n";

// Close multipart message
$message .= "--" . $boundary . "--\r\n";

// Send email using PHP mail() function
$mailSent = @mail($recipientEmail, $subject, $message, $headers);

// Clean up temporary file after sending (whether success or failure)
if (isset($savedFilePath) && file_exists($savedFilePath)) {
    @unlink($savedFilePath);
}

if ($mailSent) {
    showSuccess();
} else {
    showError('Something went wrong. Please try again later.');
}

/**
 * Display success message
 */
function showSuccess() {
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Submitted Successfully</title>
        <link rel="stylesheet" href="assets/css/style.css">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            body {
                font-family: Arial, sans-serif;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                background-color: #f3f4f6;
            }
        </style>
    </head>
    <body>
        <div class="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
            <div class="text-center">
                <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Thank You!</h2>
                <p class="text-lg text-gray-700 mb-6">Your application has been submitted successfully.</p>
                <p class="text-sm text-gray-600 mb-6">We'll review your CV and get back to you soon.</p>
                <a href="careers.html" class="inline-block bg-[#04adea] hover:bg-[#0394c7] text-white px-6 py-3 rounded-lg font-medium transition-colors">
                    Return to Careers Page
                </a>
            </div>
        </div>
    </body>
    </html>
    <?php
    exit;
}

/**
 * Display error message
 */
function showError($errorMessage) {
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error - Application Submission</title>
        <link rel="stylesheet" href="assets/css/style.css">
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            body {
                font-family: Arial, sans-serif;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                background-color: #f3f4f6;
            }
        </style>
    </head>
    <body>
        <div class="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
            <div class="text-center">
                <div class="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </div>
                <h2 class="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
                <p class="text-lg text-gray-700 mb-6">Something went wrong. Please try again later.</p>
                <p class="text-sm text-gray-500 mb-6"><?php echo htmlspecialchars($errorMessage, ENT_QUOTES, 'UTF-8'); ?></p>
                <a href="careers.html" class="inline-block bg-[#04adea] hover:bg-[#0394c7] text-white px-6 py-3 rounded-lg font-medium transition-colors">
                    Go Back
                </a>
            </div>
        </div>
    </body>
    </html>
    <?php
    exit;
}
?>
