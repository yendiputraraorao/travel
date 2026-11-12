<?php

require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

// Create a temporary file for testing
$tempFile = tempnam(sys_get_temp_dir(), 'test_');
file_put_contents($tempFile, 'test image content');

$file = new UploadedFile(
    $tempFile,
    'test_image.png',
    'image/png',
    null,
    true
);

$path = $file->store('settings/branding', 'public');
echo "Stored path: " . $path . PHP_EOL;

$url = Storage::disk('public')->url($path);
echo "Generated URL: " . $url . PHP_EOL;

// Clean up
Storage::disk('public')->delete($path);
unlink($tempFile);

echo "Test completed successfully!" . PHP_EOL;