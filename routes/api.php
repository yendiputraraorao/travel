<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PoolController;
use App\Http\Controllers\Api\VehicleController;
use App\Http\Controllers\Api\DriverController;
use App\Http\Controllers\Api\ScheduleController;
use App\Http\Controllers\Api\VoucherController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\AppSettingController;
use App\Http\Controllers\Api\AuthController;

Route::post('login', [AuthController::class, 'login']);
Route::post('register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('me', [AuthController::class, 'me']);
    Route::post('logout', [AuthController::class, 'logout']);
});

Route::apiResources([
    'pools' => PoolController::class,
    'vehicles' => VehicleController::class,
    'drivers' => DriverController::class,
    'schedules' => ScheduleController::class,
    'vouchers' => VoucherController::class,
    'bookings' => BookingController::class,
    'users' => UserController::class,
]);

Route::post('bookings/validate-ticket', [BookingController::class, 'validateTicket']);
Route::post('bookings/process-boarding', [BookingController::class, 'processBoarding']);
Route::get('bookings/find', [BookingController::class, 'find']);

// App Settings Routes
Route::prefix('settings')->group(function () {
    Route::get('/', [AppSettingController::class, 'index']);
    Route::get('/categories', [AppSettingController::class, 'getCategories']);
    Route::get('/types', [AppSettingController::class, 'getTypes']);
    Route::post('/seed-defaults', [AppSettingController::class, 'seedDefaults']);
    Route::post('/clear-cache', [AppSettingController::class, 'clearCache']);
    Route::post('/test-smtp', [AppSettingController::class, 'testSmtp']);
    Route::post('/test-smtp-connection', [AppSettingController::class, 'testSmtpConnection']);
    Route::post('/backup', [AppSettingController::class, 'backup']);
    Route::post('/restore', [AppSettingController::class, 'restore']);

    Route::get('/{category}/{key}', [AppSettingController::class, 'show']);
    Route::post('/', [AppSettingController::class, 'store']);
    Route::put('/{category}/{key}', [AppSettingController::class, 'update']);
    Route::delete('/{category}/{key}', [AppSettingController::class, 'destroy']);

    Route::post('/{category}/{key}/upload-image', [AppSettingController::class, 'uploadImage']);
    Route::delete('/{category}/{key}/delete-image', [AppSettingController::class, 'deleteImage']);
});