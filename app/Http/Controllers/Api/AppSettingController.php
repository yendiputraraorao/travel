<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AppSetting;
use App\Services\AppSettingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class AppSettingController extends Controller
{
    public function index(Request $request)
    {
        $category = $request->query('category');

        if ($category) {
            return response()->json([
                'success' => true,
                'data' => AppSettingService::getCategory($category),
            ]);
        }

        return response()->json([
            'success' => true,
            'data' => AppSettingService::getAll(),
        ]);
    }

    public function show(Request $request, string $category, string $key)
    {
        $setting = AppSettingService::getSettingMetadata($category, $key);

        if (!$setting) {
            return response()->json([
                'success' => false,
                'message' => 'Setting not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $setting,
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'category' => 'required|string|in:' . implode(',', array_keys(AppSetting::getCategories())),
            'key' => 'required|string|max:100',
            'label' => 'required|string|max:255',
            'value' => 'nullable',
            'type' => 'required|string|in:' . implode(',', array_keys(AppSetting::getTypes())),
            'options' => 'nullable|array',
            'description' => 'nullable|string',
            'sort_order' => 'nullable|integer',
            'is_visible' => 'boolean',
            'is_encrypted' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $setting = AppSetting::create(array_merge($validator->validated(), [
            'id' => \Illuminate\Support\Str::uuid()->toString(),
        ]));

        return response()->json([
            'success' => true,
            'message' => 'Setting created successfully',
            'data' => $setting,
        ], 201);
    }

    public function update(Request $request, string $category, string $key)
    {
        $setting = AppSetting::where('category', $category)
            ->where('key', $key)
            ->first();

        if (!$setting) {
            return response()->json([
                'success' => false,
                'message' => 'Setting not found',
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'label' => 'sometimes|string|max:255',
            'value' => 'nullable',
            'type' => 'sometimes|string|in:' . implode(',', array_keys(AppSetting::getTypes())),
            'options' => 'nullable|array',
            'description' => 'nullable|string',
            'sort_order' => 'sometimes|integer',
            'is_visible' => 'sometimes|boolean',
            'is_encrypted' => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $setting->update($validator->validated());

        return response()->json([
            'success' => true,
            'message' => 'Setting updated successfully',
            'data' => $setting,
        ]);
    }

    public function destroy(string $category, string $key)
    {
        $setting = AppSetting::where('category', $category)
            ->where('key', $key)
            ->first();

        if (!$setting) {
            return response()->json([
                'success' => false,
                'message' => 'Setting not found',
            ], 404);
        }

        $setting->delete();

        return response()->json([
            'success' => true,
            'message' => 'Setting deleted successfully',
        ]);
    }

    public function uploadImage(Request $request, string $category, string $key)
    {
        $request->validate([
            'file' => 'required|image|max:10240', // 10MB max
        ]);

        $file = $request->file('file');
        $url = AppSettingService::uploadImage($category, $key, $file);

        return response()->json([
            'success' => true,
            'message' => 'Image uploaded successfully',
            'data' => [
                'url' => $url,
            ],
        ]);
    }

    public function deleteImage(string $category, string $key)
    {
        AppSettingService::deleteImage($category, $key);

        return response()->json([
            'success' => true,
            'message' => 'Image deleted successfully',
        ]);
    }

    public function seedDefaults()
    {
        AppSettingService::seedDefaults();

        return response()->json([
            'success' => true,
            'message' => 'Default settings seeded successfully',
        ]);
    }

    public function clearCache()
    {
        AppSettingService::clearCache();

        return response()->json([
            'success' => true,
            'message' => 'Cache cleared successfully',
        ]);
    }

    public function testSmtp(Request $request)
    {
        $request->validate([
            'test_email' => 'required|email',
        ]);

        try {
            $config = AppSettingService::getCategory('email');

            config([
                'mail.mailers.smtp.host' => $config['smtp_host'] ?? 'mailpit',
                'mail.mailers.smtp.port' => $config['smtp_port'] ?? 1025,
                'mail.mailers.smtp.username' => $config['smtp_username'] ?? null,
                'mail.mailers.smtp.password' => $config['smtp_password'] ?? null,
                'mail.mailers.smtp.encryption' => $config['smtp_encryption'] ?? 'tls',
                'mail.from.address' => $config['sender_email'] ?? 'noreply@example.com',
                'mail.from.name' => $config['sender_name'] ?? 'Tiketux Go',
            ]);

            Mail::raw('This is a test email from Tiketux Go App Configuration.', function ($message) use ($request, $config) {
                $message->to($request->test_email)
                    ->subject('Test Email - Tiketux Go')
                    ->from($config['sender_email'] ?? 'noreply@example.com', $config['sender_name'] ?? 'Tiketux Go');
            });

            return response()->json([
                'success' => true,
                'message' => 'Test email sent successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to send test email: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function testSmtpConnection()
    {
        try {
            $config = AppSettingService::getCategory('email');

            $host = $config['smtp_host'] ?? 'mailpit';
            $port = $config['smtp_port'] ?? 1025;
            $encryption = $config['smtp_encryption'] ?? 'tls';
            $username = $config['smtp_username'] ?? null;
            $password = $config['smtp_password'] ?? null;

            // Use fsockopen to test raw SMTP connection
            $connection = @fsockopen($host, $port, $errno, $errstr, 10);
            
            if (!$connection) {
                return response()->json([
                    'success' => false,
                    'message' => 'SMTP connection failed: ' . $errstr . ' (Code: ' . $errno . ')',
                ], 500);
            }
            
            // Read server greeting
            $response = fgets($connection, 512);
            if (strpos($response, '220') !== 0) {
                fclose($connection);
                return response()->json([
                    'success' => false,
                    'message' => 'SMTP server did not respond with 220: ' . trim($response),
                ], 500);
            }
            
            // Send EHLO
            fwrite($connection, "EHLO localhost\r\n");
            $response = '';
            while (($line = fgets($connection, 512)) !== false) {
                $response .= $line;
                if (substr($line, 3, 1) === ' ') break;
            }
            
            if (strpos($response, '250') !== 0) {
                fclose($connection);
                return response()->json([
                    'success' => false,
                    'message' => 'EHLO failed: ' . trim($response),
                ], 500);
            }
            
            // Test STARTTLS if encryption is TLS
            if ($encryption === 'tls') {
                fwrite($connection, "STARTTLS\r\n");
                $response = fgets($connection, 512);
                if (strpos($response, '220') !== 0) {
                    fclose($connection);
                    return response()->json([
                        'success' => false,
                        'message' => 'STARTTLS failed: ' . trim($response),
                    ], 500);
                }
                
                // Upgrade to SSL
                $cryptoMethod = STREAM_CRYPTO_METHOD_TLS_CLIENT;
                if (!stream_socket_enable_crypto($connection, true, $cryptoMethod)) {
                    fclose($connection);
                    return response()->json([
                        'success' => false,
                        'message' => 'Failed to enable TLS encryption',
                    ], 500);
                }
            }
            
            // Test AUTH if username provided
            if ($username && $password) {
                fwrite($connection, "AUTH LOGIN\r\n");
                $response = fgets($connection, 512);
                if (strpos($response, '334') !== 0) {
                    fclose($connection);
                    return response()->json([
                        'success' => false,
                        'message' => 'AUTH LOGIN failed: ' . trim($response),
                    ], 500);
                }
                
                fwrite($connection, base64_encode($username) . "\r\n");
                $response = fgets($connection, 512);
                if (strpos($response, '334') !== 0) {
                    fclose($connection);
                    return response()->json([
                        'success' => false,
                        'message' => 'Username authentication failed: ' . trim($response),
                    ], 500);
                }
                
                fwrite($connection, base64_encode($password) . "\r\n");
                $response = fgets($connection, 512);
                if (strpos($response, '235') !== 0) {
                    fclose($connection);
                    return response()->json([
                        'success' => false,
                        'message' => 'Password authentication failed: ' . trim($response),
                    ], 500);
                }
            }
            
            // Send QUIT
            fwrite($connection, "QUIT\r\n");
            fgets($connection, 512);
            fclose($connection);
            
            return response()->json([
                'success' => true,
                'message' => 'SMTP connection successful',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'SMTP connection failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function getCategories()
    {
        return response()->json([
            'success' => true,
            'data' => AppSettingService::getCategories(),
        ]);
    }

    public function getTypes()
    {
        return response()->json([
            'success' => true,
            'data' => AppSettingService::getTypes(),
        ]);
    }

    public function backup(Request $request)
    {
        try {
            $settings = AppSetting::all()->toArray();

            $filename = 'app_settings_backup_' . now()->format('Y-m-d_H-i-s') . '.json';
            $path = 'backups/' . $filename;

            Storage::disk('local')->put($path, json_encode($settings, JSON_PRETTY_PRINT));

            return response()->json([
                'success' => true,
                'message' => 'Backup created successfully',
                'data' => [
                    'filename' => $filename,
                    'path' => $path,
                    'count' => count($settings),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Backup failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function restore(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:json',
        ]);

        try {
            $content = file_get_contents($request->file('file')->getRealPath());
            $settings = json_decode($content, true);

            if (!is_array($settings)) {
                throw new \Exception('Invalid backup file format');
            }

            $restored = 0;
            foreach ($settings as $settingData) {
                if (isset($settingData['category'], $settingData['key'])) {
                    AppSetting::updateOrCreate(
                        ['category' => $settingData['category'], 'key' => $settingData['key']],
                        $settingData
                    );
                    $restored++;
                }
            }

            AppSettingService::clearCache();

            return response()->json([
                'success' => true,
                'message' => 'Settings restored successfully',
                'data' => [
                    'restored' => $restored,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Restore failed: ' . $e->getMessage(),
            ], 500);
        }
    }
}