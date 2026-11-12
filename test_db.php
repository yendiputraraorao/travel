<?php

require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

$setting = App\Models\AppSetting::where('category', 'branding')
    ->where('key', 'logo_light')
    ->first();

if ($setting) {
    echo "ID: " . $setting->id . PHP_EOL;
    echo "Category: " . $setting->category . PHP_EOL;
    echo "Key: " . $setting->key . PHP_EOL;
    echo "Value: " . $setting->value . PHP_EOL;
    echo "Decrypted: " . $setting->decrypted_value . PHP_EOL;
    echo "Display: " . $setting->display_value . PHP_EOL;
} else {
    echo "Setting not found" . PHP_EOL;
}