<?php
/**
 * Simple PHPMailer Download Script
 * Downloads PHPMailer files directly from GitHub
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

$vendorDir = __DIR__ . '/vendor/PHPMailer';
if (!is_dir($vendorDir)) {
    mkdir($vendorDir, 0755, true);
}

echo "<h1>PHPMailer Downloader</h1>";
echo "<p>Downloading PHPMailer files...</p>";

// Files to download
$files = [
    'PHPMailer.php' => 'https://raw.githubusercontent.com/PHPMailer/PHPMailer/master/src/PHPMailer.php',
    'SMTP.php' => 'https://raw.githubusercontent.com/PHPMailer/PHPMailer/master/src/SMTP.php',
    'Exception.php' => 'https://raw.githubusercontent.com/PHPMailer/PHPMailer/master/src/Exception.php'
];

$success = 0;
$errors = [];

foreach ($files as $filename => $url) {
    $filepath = $vendorDir . '/' . $filename;
    
    echo "<p>Downloading $filename...</p>";
    
    $content = @file_get_contents($url);
    
    if ($content === false) {
        $error = error_get_last();
        echo "<p style='color:red'>ERROR downloading $filename: " . ($error['message'] ?? 'Unknown error') . "</p>";
        $errors[] = $filename;
        continue;
    }
    
    if (file_put_contents($filepath, $content) === false) {
        echo "<p style='color:red'>ERROR saving $filename</p>";
        $errors[] = $filename;
        continue;
    }
    
    echo "<p style='color:green'>✅ Downloaded: $filename</p>";
    $success++;
}

echo "<hr>";
echo "<h2>Summary</h2>";
echo "<p>Successfully downloaded: $success / " . count($files) . " files</p>";

if (empty($errors)) {
    echo "<p style='color:green; font-weight:bold'>✅ PHPMailer installed successfully!</p>";
    echo "<p>Location: <code>$vendorDir</code></p>";
    echo "<p><strong>You can now delete this file for security.</strong></p>";
} else {
    echo "<p style='color:red; font-weight:bold'>❌ Some files failed to download:</p>";
    echo "<ul>";
    foreach ($errors as $file) {
        echo "<li>$file</li>";
    }
    echo "</ul>";
    echo "<p>Please download manually from: <a href='https://github.com/PHPMailer/PHPMailer' target='_blank'>GitHub</a></p>";
}
?>

