<?php

namespace App\Services;

use App\Models\AppSetting;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AppSettingService
{
    protected const CACHE_KEY = 'app_settings';
    protected const CACHE_TTL = 3600; // 1 hour

    public static function get(string $category, string $key, mixed $default = null): mixed
    {
        $settings = self::getCategory($category);
        return $settings[$key] ?? $default;
    }

    public static function getCategory(string $category): array
    {
        $allSettings = self::getAll();
        return $allSettings[$category] ?? [];
    }

    public static function getAll(): array
    {
        return Cache::remember(self::CACHE_KEY, self::CACHE_TTL, function () {
            $settings = AppSetting::where('is_visible', true)
                ->orderBy('category')
                ->orderBy('sort_order')
                ->get();

            $result = [];
            foreach ($settings as $setting) {
                $result[$setting->category][$setting->key] = $setting->decrypted_value;
            }
            return $result;
        });
    }

    public static function getSetting(string $category, string $key): ?AppSetting
    {
        return AppSetting::where('category', $category)
            ->where('key', $key)
            ->first();
    }

    public static function set(string $category, string $key, mixed $value): bool
    {
        $setting = AppSetting::where('category', $category)
            ->where('key', $key)
            ->first();

        if ($setting) {
            $setting->value = $value;
            $setting->save();
        } else {
            $setting = AppSetting::create([
                'id' => Str::uuid()->toString(),
                'category' => $category,
                'key' => $key,
                'label' => ucwords(str_replace('_', ' ', $key)),
                'value' => $value,
                'type' => 'text',
            ]);
        }

        self::clearCache();
        return true;
    }

    public static function setMultiple(array $settings): void
    {
        foreach ($settings as $category => $categorySettings) {
            foreach ($categorySettings as $key => $value) {
                self::set($category, $key, $value);
            }
        }
    }

    public static function uploadImage(string $category, string $key, $file, string $disk = 'public'): string
    {
        $setting = self::getSetting($category, $key);

        // Delete old image if exists
        if ($setting && $setting->value) {
            $oldPath = Str::after($setting->value, '/storage/');
            if (Storage::disk($disk)->exists($oldPath)) {
                Storage::disk($disk)->delete($oldPath);
            }
        }

        // Store new image
        $path = $file->store("settings/{$category}", $disk);
        $url = Storage::disk($disk)->url($path);

        self::set($category, $key, $url);

        return $url;
    }

    public static function deleteImage(string $category, string $key, string $disk = 'public'): bool
    {
        $setting = self::getSetting($category, $key);

        if ($setting && $setting->value) {
            $oldPath = Str::after($setting->value, '/storage/');
            if (Storage::disk($disk)->exists($oldPath)) {
                Storage::disk($disk)->delete($oldPath);
            }
        }

        self::set($category, $key, null);

        return true;
    }

    public static function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY);
    }

    public static function refreshCache(): void
    {
        self::clearCache();
        self::getAll();
    }

    public static function seedDefaults(): void
    {
        AppSetting::seedDefaults();
        self::clearCache();
    }

    public static function getCategories(): array
    {
        return AppSetting::getCategories();
    }

    public static function getTypes(): array
    {
        return AppSetting::getTypes();
    }

    public static function getSettingMetadata(string $category, string $key): ?array
    {
        $setting = self::getSetting($category, $key);
        if (!$setting) {
            return null;
        }

        return [
            'id' => $setting->id,
            'category' => $setting->category,
            'key' => $setting->key,
            'label' => $setting->label,
            'value' => $setting->decrypted_value,
            'type' => $setting->type,
            'options' => $setting->options,
            'description' => $setting->description,
            'sort_order' => $setting->sort_order,
            'is_visible' => $setting->is_visible,
            'is_encrypted' => $setting->is_encrypted,
        ];
    }

    public static function getCategoryMetadata(string $category): array
    {
        $settings = AppSetting::where('category', $category)
            ->where('is_visible', true)
            ->orderBy('sort_order')
            ->get();

        return $settings->map(function ($setting) {
            return [
                'id' => $setting->id,
                'category' => $setting->category,
                'key' => $setting->key,
                'label' => $setting->label,
                'value' => $setting->decrypted_value,
                'type' => $setting->type,
                'options' => $setting->options,
                'description' => $setting->description,
                'sort_order' => $setting->sort_order,
                'is_visible' => $setting->is_visible,
                'is_encrypted' => $setting->is_encrypted,
            ];
        })->toArray();
    }

    // Helper methods for common settings
    public static function getAppName(): string
    {
        return self::get('general', 'app_name', 'Tiketux Go');
    }

    public static function getAppTitle(): string
    {
        return self::get('general', 'app_title', 'Sistem Manajemen Tiket Shuttle & Travel');
    }

    public static function getAppDescription(): string
    {
        return self::get('general', 'app_description', 'Platform pemesanan tiket travel dan shuttle eksekutif');
    }

    public static function getAppTagline(): string
    {
        return self::get('general', 'app_tagline', 'Perjalanan Nyaman, Tiba Tepat Waktu');
    }

    public static function getAppVersion(): string
    {
        return self::get('general', 'app_version', '1.0.0');
    }

    public static function getLogoLight(): ?string
    {
        return self::get('branding', 'logo_light');
    }

    public static function getLogoDark(): ?string
    {
        return self::get('branding', 'logo_dark');
    }

    public static function getLoginLogo(): ?string
    {
        return self::get('branding', 'login_logo');
    }

    public static function getFavicon(): ?string
    {
        return self::get('branding', 'favicon');
    }

    public static function getAppIcon(): ?string
    {
        return self::get('branding', 'app_icon');
    }

    public static function getPrimaryColor(): string
    {
        return self::get('branding', 'primary_color', '#f97316');
    }

    public static function getSecondaryColor(): string
    {
        return self::get('branding', 'secondary_color', '#1e2430');
    }

    public static function getAccentColor(): string
    {
        return self::get('branding', 'accent_color', '#2563eb');
    }

    public static function getBackgroundColor(): string
    {
        return self::get('branding', 'background_color', '#ffffff');
    }

    public static function getSidebarColor(): string
    {
        return self::get('branding', 'sidebar_color', '#1e2430');
    }

    public static function getDefaultTheme(): string
    {
        return self::get('branding', 'default_theme', 'light');
    }

    public static function getLoginBackgroundImage(): ?string
    {
        return self::get('branding', 'login_background_image');
    }

    public static function getCompanyName(): string
    {
        return self::get('company', 'company_name', 'Boy Wisata Executive');
    }

    public static function getCompanyLegalName(): string
    {
        return self::get('company', 'company_legal_name', 'PT Boy Wisata Executive');
    }

    public static function getCompanyLogo(): ?string
    {
        return self::get('company', 'company_logo');
    }

    public static function getCompanyAddress(): string
    {
        return self::get('company', 'company_address', '');
    }

    public static function getCompanyPhone(): string
    {
        return self::get('company', 'company_phone', '');
    }

    public static function getCompanyWhatsApp(): string
    {
        return self::get('company', 'company_whatsapp', '');
    }

    public static function getCompanyEmail(): string
    {
        return self::get('company', 'company_email', '');
    }

    public static function getCompanyWebsite(): string
    {
        return self::get('company', 'company_website', '');
    }

    public static function getCompanyNpwp(): string
    {
        return self::get('company', 'company_npwp', '');
    }

    public static function getSupportEmail(): string
    {
        return self::get('contact', 'support_email', '');
    }

    public static function getSupportPhone(): string
    {
        return self::get('contact', 'support_phone', '');
    }

    public static function getWhatsAppSupport(): string
    {
        return self::get('contact', 'whatsapp_support', '');
    }

    public static function getDefaultLanguage(): string
    {
        return self::get('general', 'default_language', 'id');
    }

    public static function getDefaultTimezone(): string
    {
        return self::get('general', 'default_timezone', 'Asia/Jakarta');
    }

    public static function getDateFormat(): string
    {
        return self::get('general', 'date_format', 'd/m/Y');
    }

    public static function getTimeFormat(): string
    {
        return self::get('general', 'time_format', 'H:i');
    }

    public static function getCurrencySymbol(): string
    {
        return self::get('general', 'currency_symbol', 'Rp');
    }

    public static function getCurrencyCode(): string
    {
        return self::get('general', 'default_currency', 'IDR');
    }

    public static function isMaintenanceMode(): bool
    {
        return self::get('system', 'maintenance_mode', false);
    }

    public static function getMaintenanceMessage(): string
    {
        return self::get('system', 'maintenance_message', 'System is under maintenance. Please try again later.');
    }

    public static function formatCurrency(float $amount, int $decimals = 0): string
    {
        $symbol = self::getCurrencySymbol();
        $formatted = number_format($amount, $decimals, ',', '.');
        return "{$symbol} {$formatted}";
    }

    public static function formatDate(string $date, ?string $format = null): string
    {
        $format = $format ?? self::getDateFormat();
        return \Carbon\Carbon::parse($date)->format($format);
    }

    public static function formatTime(string $time, ?string $format = null): string
    {
        $format = $format ?? self::getTimeFormat();
        return \Carbon\Carbon::parse($time)->format($format);
    }

    public static function formatDateTime(string $datetime, ?string $dateFormat = null, ?string $timeFormat = null): string
    {
        $dateFormat = $dateFormat ?? self::getDateFormat();
        $timeFormat = $timeFormat ?? self::getTimeFormat();
        return \Carbon\Carbon::parse($datetime)->format("{$dateFormat} {$timeFormat}");
    }
}