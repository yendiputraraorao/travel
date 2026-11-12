<?php

require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$url = Storage::disk('public')->url('settings/branding/test.png');
echo 'URL: ' . $url . PHP_EOL;