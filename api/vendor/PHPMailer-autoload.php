<?php
/**
 * PHPMailer Autoloader
 * Simple autoloader for PHPMailer classes
 */

// PHPMailer namespace
namespace PHPMailer\PHPMailer;

// Class autoloader
spl_autoload_register(function ($class) {
    // Only handle PHPMailer classes
    if (strpos($class, 'PHPMailer\\PHPMailer\\') !== 0) {
        return;
    }
    
    // Remove namespace prefix
    $class = str_replace('PHPMailer\\PHPMailer\\', '', $class);
    
    // Map class to file
    $classMap = [
        'PHPMailer' => 'PHPMailer.php',
        'SMTP' => 'SMTP.php',
        'Exception' => 'Exception.php'
    ];
    
    if (isset($classMap[$class])) {
        $file = __DIR__ . '/' . $classMap[$class];
        if (file_exists($file)) {
            require_once $file;
        }
    }
});

