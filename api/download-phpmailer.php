<?php
/**
 * PHPMailer Downloader Script
 * Downloads PHPMailer from GitHub and extracts it
 * 
 * Run this script once to download PHPMailer:
 * php download-phpmailer.php
 */

$vendorDir = __DIR__ . '/vendor';
$phpmailerDir = $vendorDir . '/PHPMailer';

// Create directories
if (!is_dir($vendorDir)) {
    mkdir($vendorDir, 0755, true);
}

echo "Downloading PHPMailer...\n";

// Download PHPMailer zip from GitHub
$zipUrl = 'https://github.com/PHPMailer/PHPMailer/archive/refs/heads/master.zip';
$zipFile = $vendorDir . '/phpmailer-master.zip';

// Download file
echo "Fetching from GitHub...\n";
$zipContent = @file_get_contents($zipUrl);

if ($zipContent === false) {
    echo "ERROR: Could not download PHPMailer from GitHub.\n";
    echo "Please download manually:\n";
    echo "1. Visit: https://github.com/PHPMailer/PHPMailer\n";
    echo "2. Download ZIP file\n";
    echo "3. Extract PHPMailer-master folder\n";
    echo "4. Copy src/ folder contents to: api/vendor/PHPMailer/\n";
    exit(1);
}

// Save zip file
file_put_contents($zipFile, $zipContent);
echo "Downloaded zip file.\n";

// Check if ZipArchive is available
if (!class_exists('ZipArchive')) {
    echo "ERROR: ZipArchive class not available.\n";
    echo "Please extract manually:\n";
    echo "1. Extract: $zipFile\n";
    echo "2. Copy PHPMailer-master/src/* to: $phpmailerDir/\n";
    exit(1);
}

// Extract zip
$zip = new ZipArchive;
if ($zip->open($zipFile) === TRUE) {
    // Extract to vendor directory
    $zip->extractTo($vendorDir);
    $zip->close();
    echo "Extracted zip file.\n";
    
    // Move src folder contents to PHPMailer directory
    $extractedDir = $vendorDir . '/PHPMailer-master/src';
    if (is_dir($extractedDir)) {
        if (!is_dir($phpmailerDir)) {
            mkdir($phpmailerDir, 0755, true);
        }
        
        // Copy files
        $files = ['PHPMailer.php', 'SMTP.php', 'Exception.php'];
        foreach ($files as $file) {
            $source = $extractedDir . '/' . $file;
            $dest = $phpmailerDir . '/' . $file;
            if (file_exists($source)) {
                copy($source, $dest);
                echo "Copied: $file\n";
            }
        }
        
        // Clean up
        unlink($zipFile);
        // Remove extracted directory
        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($vendorDir . '/PHPMailer-master', RecursiveDirectoryIterator::SKIP_DOTS),
            RecursiveIteratorIterator::CHILD_FIRST
        );
        foreach ($iterator as $path) {
            $path->isDir() ? rmdir($path->getPathname()) : unlink($path->getPathname());
        }
        rmdir($vendorDir . '/PHPMailer-master');
        echo "Cleaned up.\n";
    }
    
    echo "\n✅ PHPMailer installed successfully!\n";
    echo "Location: $phpmailerDir\n";
} else {
    echo "ERROR: Could not extract zip file.\n";
    exit(1);
}
?>

