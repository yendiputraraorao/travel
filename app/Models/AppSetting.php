<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Str;

class AppSetting extends Model
{
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'category',
        'key',
        'label',
        'value',
        'type',
        'options',
        'description',
        'sort_order',
        'is_visible',
        'is_encrypted',
    ];

    protected $casts = [
        'options' => 'array',
        'is_visible' => 'boolean',
        'is_encrypted' => 'boolean',
        'sort_order' => 'integer',
    ];

    protected static function booted(): void
    {
        static::saving(function ($setting) {
            if (empty($setting->id)) {
                $setting->id = Str::uuid()->toString();
            }

            if ($setting->is_encrypted && $setting->value && !Str::startsWith($setting->value, 'encrypted:')) {
                $setting->value = 'encrypted:' . Crypt::encryptString($setting->value);
            }
        });

        static::saved(function () {
            \App\Services\AppSettingService::clearCache();
        });

        static::deleted(function () {
            \App\Services\AppSettingService::clearCache();
        });
    }

    public function getDecryptedValueAttribute(): mixed
    {
        if ($this->is_encrypted && $this->value && Str::startsWith($this->value, 'encrypted:')) {
            try {
                return Crypt::decryptString(Str::after($this->value, 'encrypted:'));
            } catch (\Exception) {
                return null;
            }
        }

        return $this->value;
    }

    public function getRawValueAttribute(): mixed
    {
        return $this->value;
    }

    public function getDisplayValueAttribute(): mixed
    {
        if ($this->is_encrypted) {
            return '••••••••';
        }

        return $this->decrypted_value;
    }

    public static function getCategories(): array
    {
        return [
            'general' => 'General Settings',
            'branding' => 'Branding & Appearance',
            'company' => 'Company Information',
            'contact' => 'Contact & Social Media',
            'localization' => 'Localization Settings',
            'email' => 'Email Configuration',
            'notification' => 'Notification Settings',
            'security' => 'Security Settings',
            'system' => 'System Settings',
            'seo' => 'SEO & Metadata',
            'integration' => 'Integration Settings',
            'backup' => 'Backup & Maintenance',
        ];
    }

    public static function getTypes(): array
    {
        return [
            'text' => 'Text Input',
            'textarea' => 'Textarea',
            'boolean' => 'Toggle (Boolean)',
            'select' => 'Select Dropdown',
            'color' => 'Color Picker',
            'image' => 'Image Upload',
            'file' => 'File Upload',
            'json' => 'JSON Editor',
            'password' => 'Password (Encrypted)',
            'number' => 'Number Input',
            'email' => 'Email Input',
            'url' => 'URL Input',
        ];
    }

    public static function getDefaultSettings(): array
    {
        return [
            // General Settings
            ['category' => 'general', 'key' => 'app_name', 'label' => 'Application Name', 'value' => 'Tiketux Go', 'type' => 'text', 'sort_order' => 1, 'description' => 'Name of the application'],
            ['category' => 'general', 'key' => 'app_title', 'label' => 'Application Title', 'value' => 'Sistem Manajemen Tiket Shuttle & Travel', 'type' => 'text', 'sort_order' => 2, 'description' => 'Full title of the application'],
            ['category' => 'general', 'key' => 'app_description', 'label' => 'Application Description', 'value' => 'Platform pemesanan tiket travel dan shuttle eksekutif', 'type' => 'textarea', 'sort_order' => 3, 'description' => 'Brief description of the application'],
            ['category' => 'general', 'key' => 'app_tagline', 'label' => 'Application Tagline', 'value' => 'Perjalanan Nyaman, Tiba Tepat Waktu', 'type' => 'text', 'sort_order' => 4, 'description' => 'Tagline or slogan'],
            ['category' => 'general', 'key' => 'app_version', 'label' => 'Application Version', 'value' => '1.0.0', 'type' => 'text', 'sort_order' => 5, 'description' => 'Current version of the application'],
            ['category' => 'general', 'key' => 'default_language', 'label' => 'Default Language', 'value' => 'id', 'type' => 'select', 'options' => json_encode(['id' => 'Indonesian', 'en' => 'English']), 'sort_order' => 6, 'description' => 'Default application language'],
            ['category' => 'general', 'key' => 'default_timezone', 'label' => 'Default Timezone', 'value' => 'Asia/Jakarta', 'type' => 'select', 'options' => json_encode(['Asia/Jakarta' => 'WIB (UTC+7)', 'Asia/Makassar' => 'WITA (UTC+8)', 'Asia/Jayapura' => 'WIT (UTC+9)']), 'sort_order' => 7, 'description' => 'Default timezone'],
            ['category' => 'general', 'key' => 'date_format', 'label' => 'Date Format', 'value' => 'd/m/Y', 'type' => 'select', 'options' => json_encode(['d/m/Y' => 'DD/MM/YYYY', 'Y-m-d' => 'YYYY-MM-DD', 'd F Y' => 'DD Month YYYY']), 'sort_order' => 8, 'description' => 'Default date format'],
            ['category' => 'general', 'key' => 'time_format', 'label' => 'Time Format', 'value' => 'H:i', 'type' => 'select', 'options' => json_encode(['H:i' => '24-hour (HH:MM)', 'h:i A' => '12-hour (HH:MM AM/PM)']), 'sort_order' => 9, 'description' => 'Default time format'],
            ['category' => 'general', 'key' => 'default_currency', 'label' => 'Default Currency', 'value' => 'IDR', 'type' => 'select', 'options' => json_encode(['IDR' => 'Indonesian Rupiah (IDR)']), 'sort_order' => 10, 'description' => 'Default currency code'],
            ['category' => 'general', 'key' => 'currency_symbol', 'label' => 'Currency Symbol', 'value' => 'Rp', 'type' => 'text', 'sort_order' => 11, 'description' => 'Currency symbol for display'],

            // Branding & Appearance
            ['category' => 'branding', 'key' => 'logo_light', 'label' => 'Application Logo (Light Mode)', 'value' => null, 'type' => 'image', 'sort_order' => 1, 'description' => 'Logo for light mode'],
            ['category' => 'branding', 'key' => 'logo_dark', 'label' => 'Application Logo (Dark Mode)', 'value' => null, 'type' => 'image', 'sort_order' => 2, 'description' => 'Logo for dark mode'],
            ['category' => 'branding', 'key' => 'login_logo', 'label' => 'Login Page Logo', 'value' => null, 'type' => 'image', 'sort_order' => 3, 'description' => 'Logo on login page'],
            ['category' => 'branding', 'key' => 'favicon', 'label' => 'Application Favicon', 'value' => null, 'type' => 'image', 'sort_order' => 4, 'description' => 'Favicon (32x32 or 16x16)'],
            ['category' => 'branding', 'key' => 'app_icon', 'label' => 'Application Icon', 'value' => null, 'type' => 'image', 'sort_order' => 5, 'description' => 'PWA/App icon (192x192)'],
            ['category' => 'branding', 'key' => 'primary_color', 'label' => 'Primary Color', 'value' => '#f97316', 'type' => 'color', 'sort_order' => 6, 'description' => 'Primary brand color'],
            ['category' => 'branding', 'key' => 'secondary_color', 'label' => 'Secondary Color', 'value' => '#1e2430', 'type' => 'color', 'sort_order' => 7, 'description' => 'Secondary brand color'],
            ['category' => 'branding', 'key' => 'accent_color', 'label' => 'Accent Color', 'value' => '#2563eb', 'type' => 'color', 'sort_order' => 8, 'description' => 'Accent color for highlights'],
            ['category' => 'branding', 'key' => 'background_color', 'label' => 'Background Color', 'value' => '#ffffff', 'type' => 'color', 'sort_order' => 9, 'description' => 'Default background color'],
            ['category' => 'branding', 'key' => 'sidebar_color', 'label' => 'Sidebar Color', 'value' => '#1e2430', 'type' => 'color', 'sort_order' => 10, 'description' => 'Sidebar background color'],
            ['category' => 'branding', 'key' => 'default_theme', 'label' => 'Default Theme', 'value' => 'light', 'type' => 'select', 'options' => json_encode(['light' => 'Light', 'dark' => 'Dark', 'system' => 'System']), 'sort_order' => 11, 'description' => 'Default theme mode'],
            ['category' => 'branding', 'key' => 'login_background_image', 'label' => 'Login Page Background Image', 'value' => null, 'type' => 'image', 'sort_order' => 12, 'description' => 'Background image for login page'],

            // Company Information
            ['category' => 'company', 'key' => 'company_name', 'label' => 'Company Name', 'value' => 'Boy Wisata Executive', 'type' => 'text', 'sort_order' => 1, 'description' => 'Display name of the company'],
            ['category' => 'company', 'key' => 'company_legal_name', 'label' => 'Company Legal Name', 'value' => 'PT Boy Wisata Executive', 'type' => 'text', 'sort_order' => 2, 'description' => 'Legal registered name'],
            ['category' => 'company', 'key' => 'company_logo', 'label' => 'Company Logo', 'value' => null, 'type' => 'image', 'sort_order' => 3, 'description' => 'Company logo for documents'],
            ['category' => 'company', 'key' => 'company_address', 'label' => 'Company Address', 'value' => 'Jl. Raya Bogor No. 123, Jakarta Timur', 'type' => 'textarea', 'sort_order' => 4, 'description' => 'Full company address'],
            ['category' => 'company', 'key' => 'company_province', 'label' => 'Province', 'value' => 'DKI Jakarta', 'type' => 'text', 'sort_order' => 5, 'description' => 'Province'],
            ['category' => 'company', 'key' => 'company_city', 'label' => 'City / Regency', 'value' => 'Jakarta Timur', 'type' => 'text', 'sort_order' => 6, 'description' => 'City or regency'],
            ['category' => 'company', 'key' => 'company_district', 'label' => 'District', 'value' => 'Makasar', 'type' => 'text', 'sort_order' => 7, 'description' => 'District'],
            ['category' => 'company', 'key' => 'company_postal_code', 'label' => 'Postal Code', 'value' => '13620', 'type' => 'text', 'sort_order' => 8, 'description' => 'Postal code'],
            ['category' => 'company', 'key' => 'company_country', 'label' => 'Country', 'value' => 'Indonesia', 'type' => 'text', 'sort_order' => 9, 'description' => 'Country'],
            ['category' => 'company', 'key' => 'company_phone', 'label' => 'Phone Number', 'value' => '+62 21 1234 5678', 'type' => 'text', 'sort_order' => 10, 'description' => 'Company phone number'],
            ['category' => 'company', 'key' => 'company_whatsapp', 'label' => 'WhatsApp Number', 'value' => '+62 812 3456 7890', 'type' => 'text', 'sort_order' => 11, 'description' => 'WhatsApp number with country code'],
            ['category' => 'company', 'key' => 'company_email', 'label' => 'Email Address', 'value' => 'info@boywisata.com', 'type' => 'email', 'sort_order' => 12, 'description' => 'Company email address'],
            ['category' => 'company', 'key' => 'company_website', 'label' => 'Website', 'value' => 'https://boywisata.com', 'type' => 'url', 'sort_order' => 13, 'description' => 'Company website URL'],
            ['category' => 'company', 'key' => 'company_npwp', 'label' => 'Tax Identification Number (NPWP)', 'value' => '01.234.567.8-901.000', 'type' => 'text', 'sort_order' => 14, 'description' => 'NPWP for invoices'],

            // Contact & Social Media
            ['category' => 'contact', 'key' => 'support_email', 'label' => 'Support Email', 'value' => 'support@boywisata.com', 'type' => 'email', 'sort_order' => 1, 'description' => 'Customer support email'],
            ['category' => 'contact', 'key' => 'support_phone', 'label' => 'Support Phone', 'value' => '+62 21 1234 5678', 'type' => 'text', 'sort_order' => 2, 'description' => 'Customer support phone'],
            ['category' => 'contact', 'key' => 'whatsapp_support', 'label' => 'WhatsApp Support', 'value' => '+62 812 3456 7890', 'type' => 'text', 'sort_order' => 3, 'description' => 'WhatsApp support number'],
            ['category' => 'contact', 'key' => 'facebook_url', 'label' => 'Facebook URL', 'value' => 'https://facebook.com/boywisata', 'type' => 'url', 'sort_order' => 4, 'description' => 'Facebook page URL'],
            ['category' => 'contact', 'key' => 'instagram_url', 'label' => 'Instagram URL', 'value' => 'https://instagram.com/boywisata', 'type' => 'url', 'sort_order' => 5, 'description' => 'Instagram profile URL'],
            ['category' => 'contact', 'key' => 'youtube_url', 'label' => 'YouTube URL', 'value' => 'https://youtube.com/@boywisata', 'type' => 'url', 'sort_order' => 6, 'description' => 'YouTube channel URL'],
            ['category' => 'contact', 'key' => 'tiktok_url', 'label' => 'TikTok URL', 'value' => 'https://tiktok.com/@boywisata', 'type' => 'url', 'sort_order' => 7, 'description' => 'TikTok profile URL'],
            ['category' => 'contact', 'key' => 'website_url', 'label' => 'Website URL', 'value' => 'https://boywisata.com', 'type' => 'url', 'sort_order' => 8, 'description' => 'Main website URL'],

            // Localization Settings
            ['category' => 'localization', 'key' => 'app_language', 'label' => 'Application Language', 'value' => 'id', 'type' => 'select', 'options' => json_encode(['id' => 'Indonesian', 'en' => 'English']), 'sort_order' => 1, 'description' => 'Default application language'],
            ['category' => 'localization', 'key' => 'available_languages', 'label' => 'Available Languages', 'value' => '["id","en"]', 'type' => 'json', 'sort_order' => 2, 'description' => 'List of available languages'],
            ['category' => 'localization', 'key' => 'default_timezone', 'label' => 'Default Timezone', 'value' => 'Asia/Jakarta', 'type' => 'select', 'options' => json_encode(['Asia/Jakarta' => 'WIB (UTC+7)', 'Asia/Makassar' => 'WITA (UTC+8)', 'Asia/Jayapura' => 'WIT (UTC+9)']), 'sort_order' => 3, 'description' => 'Default timezone'],
            ['category' => 'localization', 'key' => 'date_format', 'label' => 'Date Format', 'value' => 'd/m/Y', 'type' => 'select', 'options' => json_encode(['d/m/Y' => 'DD/MM/YYYY', 'Y-m-d' => 'YYYY-MM-DD', 'd F Y' => 'DD Month YYYY']), 'sort_order' => 4, 'description' => 'Date format'],
            ['category' => 'localization', 'key' => 'time_format', 'label' => 'Time Format', 'value' => 'H:i', 'type' => 'select', 'options' => json_encode(['H:i' => '24-hour (HH:MM)', 'h:i A' => '12-hour (HH:MM AM/PM)']), 'sort_order' => 5, 'description' => 'Time format'],
            ['category' => 'localization', 'key' => 'number_format', 'label' => 'Number Format', 'value' => 'id_ID', 'type' => 'select', 'options' => json_encode(['id_ID' => 'Indonesian (1.234,56)', 'en_US' => 'US (1,234.56)']), 'sort_order' => 6, 'description' => 'Number format locale'],
            ['category' => 'localization', 'key' => 'default_currency', 'label' => 'Default Currency', 'value' => 'IDR', 'type' => 'select', 'options' => json_encode(['IDR' => 'Indonesian Rupiah (IDR)']), 'sort_order' => 7, 'description' => 'Default currency'],
            ['category' => 'localization', 'key' => 'currency_symbol', 'label' => 'Currency Symbol', 'value' => 'Rp', 'type' => 'text', 'sort_order' => 8, 'description' => 'Currency symbol'],
            ['category' => 'localization', 'key' => 'first_day_of_week', 'label' => 'First Day of Week', 'value' => '1', 'type' => 'select', 'options' => json_encode(['0' => 'Sunday', '1' => 'Monday', '6' => 'Saturday']), 'sort_order' => 9, 'description' => 'First day of week (0=Sun, 1=Mon, 6=Sat)'],

            // Email Configuration
            ['category' => 'email', 'key' => 'smtp_host', 'label' => 'SMTP Host', 'value' => 'mailpit', 'type' => 'text', 'sort_order' => 1, 'description' => 'SMTP server hostname'],
            ['category' => 'email', 'key' => 'smtp_port', 'label' => 'SMTP Port', 'value' => '1025', 'type' => 'number', 'sort_order' => 2, 'description' => 'SMTP server port'],
            ['category' => 'email', 'key' => 'smtp_username', 'label' => 'SMTP Username', 'value' => null, 'type' => 'text', 'sort_order' => 3, 'description' => 'SMTP authentication username'],
            ['category' => 'email', 'key' => 'smtp_password', 'label' => 'SMTP Password', 'value' => null, 'type' => 'password', 'is_encrypted' => true, 'sort_order' => 4, 'description' => 'SMTP authentication password'],
            ['category' => 'email', 'key' => 'smtp_encryption', 'label' => 'SMTP Encryption', 'value' => 'tls', 'type' => 'select', 'options' => json_encode(['tls' => 'TLS', 'ssl' => 'SSL', 'none' => 'None']), 'sort_order' => 5, 'description' => 'SMTP encryption method'],
            ['category' => 'email', 'key' => 'sender_name', 'label' => 'Sender Name', 'value' => 'Tiketux Go', 'type' => 'text', 'sort_order' => 6, 'description' => 'Default sender name for emails'],
            ['category' => 'email', 'key' => 'sender_email', 'label' => 'Sender Email', 'value' => 'noreply@boywisata.com', 'type' => 'email', 'sort_order' => 7, 'description' => 'Default sender email address'],
            ['category' => 'email', 'key' => 'reply_to_email', 'label' => 'Reply-To Email', 'value' => 'support@boywisata.com', 'type' => 'email', 'sort_order' => 8, 'description' => 'Reply-to email address'],

            // Notification Settings
            ['category' => 'notification', 'key' => 'email_enabled', 'label' => 'Email Notification', 'value' => true, 'type' => 'boolean', 'sort_order' => 1, 'description' => 'Enable email notifications'],
            ['category' => 'notification', 'key' => 'whatsapp_enabled', 'label' => 'WhatsApp Notification', 'value' => false, 'type' => 'boolean', 'sort_order' => 2, 'description' => 'Enable WhatsApp notifications'],
            ['category' => 'notification', 'key' => 'in_app_enabled', 'label' => 'In-App Notification', 'value' => true, 'type' => 'boolean', 'sort_order' => 3, 'description' => 'Enable in-app notifications'],
            ['category' => 'notification', 'key' => 'booking_confirmation', 'label' => 'Booking Confirmation', 'value' => true, 'type' => 'boolean', 'sort_order' => 4, 'description' => 'Send booking confirmation notifications'],
            ['category' => 'notification', 'key' => 'payment_confirmation', 'label' => 'Payment Confirmation', 'value' => true, 'type' => 'boolean', 'sort_order' => 5, 'description' => 'Send payment confirmation notifications'],
            ['category' => 'notification', 'key' => 'ticket_issued', 'label' => 'Ticket Issued Notification', 'value' => true, 'type' => 'boolean', 'sort_order' => 6, 'description' => 'Send ticket issued notifications'],
            ['category' => 'notification', 'key' => 'trip_reminder', 'label' => 'Trip Reminder', 'value' => true, 'type' => 'boolean', 'sort_order' => 7, 'description' => 'Send trip reminder notifications'],
            ['category' => 'notification', 'key' => 'booking_cancellation', 'label' => 'Booking Cancellation', 'value' => true, 'type' => 'boolean', 'sort_order' => 8, 'description' => 'Send booking cancellation notifications'],
            ['category' => 'notification', 'key' => 'schedule_changes', 'label' => 'Schedule Changes', 'value' => true, 'type' => 'boolean', 'sort_order' => 9, 'description' => 'Send schedule change notifications'],
            ['category' => 'notification', 'key' => 'payment_reminder', 'label' => 'Payment Reminder', 'value' => true, 'type' => 'boolean', 'sort_order' => 10, 'description' => 'Send payment reminder notifications'],

            // Security Settings
            ['category' => 'security', 'key' => 'session_timeout', 'label' => 'Session Timeout (minutes)', 'value' => '120', 'type' => 'number', 'sort_order' => 1, 'description' => 'Session timeout in minutes'],
            ['category' => 'security', 'key' => 'min_password_length', 'label' => 'Minimum Password Length', 'value' => '8', 'type' => 'number', 'sort_order' => 2, 'description' => 'Minimum password length'],
            ['category' => 'security', 'key' => 'password_complexity', 'label' => 'Password Complexity', 'value' => true, 'type' => 'boolean', 'sort_order' => 3, 'description' => 'Require complex passwords'],
            ['category' => 'security', 'key' => 'max_login_attempts', 'label' => 'Maximum Login Attempts', 'value' => '5', 'type' => 'number', 'sort_order' => 4, 'description' => 'Max failed login attempts before lockout'],
            ['category' => 'security', 'key' => 'two_factor_auth', 'label' => 'Two-Factor Authentication', 'value' => false, 'type' => 'boolean', 'sort_order' => 5, 'description' => 'Enable 2FA for admin users'],
            ['category' => 'security', 'key' => 'enable_captcha', 'label' => 'Enable CAPTCHA', 'value' => false, 'type' => 'boolean', 'sort_order' => 6, 'description' => 'Enable CAPTCHA on login'],
            ['category' => 'security', 'key' => 'force_https', 'label' => 'Force HTTPS', 'value' => true, 'type' => 'boolean', 'sort_order' => 7, 'description' => 'Force HTTPS connections'],
            ['category' => 'security', 'key' => 'login_notification', 'label' => 'Login Notification', 'value' => true, 'type' => 'boolean', 'sort_order' => 8, 'description' => 'Send notification on new login'],
            ['category' => 'security', 'key' => 'password_expiration', 'label' => 'Password Expiration (days)', 'value' => '90', 'type' => 'number', 'sort_order' => 9, 'description' => 'Password expiration in days (0 to disable)'],

            // System Settings
            ['category' => 'system', 'key' => 'maintenance_mode', 'label' => 'Maintenance Mode', 'value' => false, 'type' => 'boolean', 'sort_order' => 1, 'description' => 'Enable maintenance mode'],
            ['category' => 'system', 'key' => 'maintenance_message', 'label' => 'Maintenance Message', 'value' => 'System is under maintenance. Please try again later.', 'type' => 'textarea', 'sort_order' => 2, 'description' => 'Message shown during maintenance'],
            ['category' => 'system', 'key' => 'enable_customer_registration', 'label' => 'Enable Customer Registration', 'value' => true, 'type' => 'boolean', 'sort_order' => 3, 'description' => 'Allow customers to register'],
            ['category' => 'system', 'key' => 'enable_customer_verification', 'label' => 'Enable Customer Verification', 'value' => false, 'type' => 'boolean', 'sort_order' => 4, 'description' => 'Require email verification for customers'],
            ['category' => 'system', 'key' => 'max_file_upload_size', 'label' => 'Maximum File Upload Size (MB)', 'value' => '10', 'type' => 'number', 'sort_order' => 5, 'description' => 'Maximum file upload size in MB'],
            ['category' => 'system', 'key' => 'allowed_file_extensions', 'label' => 'Allowed File Extensions', 'value' => 'jpg,jpeg,png,gif,webp,pdf,doc,docx,xls,xlsx', 'type' => 'text', 'sort_order' => 6, 'description' => 'Comma-separated allowed file extensions'],
            ['category' => 'system', 'key' => 'enable_audit_log', 'label' => 'Enable Audit Log', 'value' => true, 'type' => 'boolean', 'sort_order' => 7, 'description' => 'Enable audit logging'],
            ['category' => 'system', 'key' => 'enable_application_cache', 'label' => 'Enable Application Cache', 'value' => true, 'type' => 'boolean', 'sort_order' => 8, 'description' => 'Enable application caching'],

            // SEO & Metadata
            ['category' => 'seo', 'key' => 'meta_title', 'label' => 'Meta Title', 'value' => 'Tiketux Go - Sistem Manajemen Tiket Shuttle & Travel', 'type' => 'text', 'sort_order' => 1, 'description' => 'Default meta title for public pages'],
            ['category' => 'seo', 'key' => 'meta_description', 'label' => 'Meta Description', 'value' => 'Platform pemesanan tiket travel dan shuttle eksekutif dengan pemilihan kursi interaktif, e-tiket QR Code, pembayaran QRIS/Transfer, dan dashboard admin manajemen armada.', 'type' => 'textarea', 'sort_order' => 2, 'description' => 'Default meta description'],
            ['category' => 'seo', 'key' => 'meta_keywords', 'label' => 'Meta Keywords', 'value' => 'tiket, travel, shuttle, pemesanan, tiket online, boy wisata', 'type' => 'text', 'sort_order' => 3, 'description' => 'Meta keywords for SEO'],
            ['category' => 'seo', 'key' => 'og_image', 'label' => 'Open Graph Image', 'value' => null, 'type' => 'image', 'sort_order' => 4, 'description' => 'Default Open Graph image for social sharing'],
            ['category' => 'seo', 'key' => 'social_sharing_image', 'label' => 'Social Sharing Image', 'value' => null, 'type' => 'image', 'sort_order' => 5, 'description' => 'Default social sharing image'],
            ['category' => 'seo', 'key' => 'search_engine_indexing', 'label' => 'Search Engine Indexing', 'value' => true, 'type' => 'boolean', 'sort_order' => 6, 'description' => 'Allow search engines to index public pages'],

            // Integration Settings
            ['category' => 'integration', 'key' => 'google_maps_api_key', 'label' => 'Google Maps API Key', 'value' => null, 'type' => 'password', 'is_encrypted' => true, 'sort_order' => 1, 'description' => 'Google Maps API key'],
            ['category' => 'integration', 'key' => 'whatsapp_api_token', 'label' => 'WhatsApp API Token', 'value' => null, 'type' => 'password', 'is_encrypted' => true, 'sort_order' => 2, 'description' => 'WhatsApp Business API token'],
            ['category' => 'integration', 'key' => 'whatsapp_phone_number_id', 'label' => 'WhatsApp Phone Number ID', 'value' => null, 'type' => 'text', 'sort_order' => 3, 'description' => 'WhatsApp Business phone number ID'],
            ['category' => 'integration', 'key' => 'payment_gateway', 'label' => 'Payment Gateway', 'value' => 'midtrans', 'type' => 'select', 'options' => json_encode(['midtrans' => 'Midtrans', 'xendit' => 'Xendit', 'tripay' => 'Tripay', 'manual' => 'Manual Transfer']), 'sort_order' => 4, 'description' => 'Payment gateway provider'],
            ['category' => 'integration', 'key' => 'payment_gateway_config', 'label' => 'Payment Gateway Configuration', 'value' => '{}', 'type' => 'json', 'sort_order' => 5, 'description' => 'Payment gateway specific configuration (JSON)'],
            ['category' => 'integration', 'key' => 'cloud_storage', 'label' => 'Cloud Storage', 'value' => 'local', 'type' => 'select', 'options' => json_encode(['local' => 'Local Storage', 's3' => 'AWS S3', 'gcs' => 'Google Cloud Storage', 'wasabi' => 'Wasabi']), 'sort_order' => 6, 'description' => 'Cloud storage provider'],
            ['category' => 'integration', 'key' => 'cloud_storage_config', 'label' => 'Cloud Storage Configuration', 'value' => '{}', 'type' => 'json', 'sort_order' => 7, 'description' => 'Cloud storage configuration (JSON)'],
            ['category' => 'integration', 'key' => 'third_party_api', 'label' => 'Third-Party API Configuration', 'value' => '{}', 'type' => 'json', 'sort_order' => 8, 'description' => 'Third-party API configurations (JSON)'],
            ['category' => 'integration', 'key' => 'webhook_config', 'label' => 'Webhook Configuration', 'value' => '{}', 'type' => 'json', 'sort_order' => 9, 'description' => 'Webhook URLs and secrets (JSON)'],

            // Backup & Maintenance
            ['category' => 'backup', 'key' => 'auto_backup_enabled', 'label' => 'Automatic Backup Enabled', 'value' => false, 'type' => 'boolean', 'sort_order' => 1, 'description' => 'Enable automatic database backups'],
            ['category' => 'backup', 'key' => 'backup_schedule', 'label' => 'Backup Schedule (Cron)', 'value' => '0 2 * * *', 'type' => 'text', 'sort_order' => 2, 'description' => 'Cron expression for automatic backup'],
            ['category' => 'backup', 'key' => 'backup_retention_days', 'label' => 'Backup Retention (days)', 'value' => '30', 'type' => 'number', 'sort_order' => 3, 'description' => 'Number of days to keep backups'],
            ['category' => 'backup', 'key' => 'backup_storage', 'label' => 'Backup Storage', 'value' => 'local', 'type' => 'select', 'options' => json_encode(['local' => 'Local Storage', 's3' => 'AWS S3', 'gcs' => 'Google Cloud Storage']), 'sort_order' => 4, 'description' => 'Where to store backups'],
            ['category' => 'backup', 'key' => 'backup_storage_config', 'label' => 'Backup Storage Configuration', 'value' => '{}', 'type' => 'json', 'sort_order' => 5, 'description' => 'Backup storage configuration (JSON)'],
        ];
    }

    public static function seedDefaults(): void
    {
        foreach (self::getDefaultSettings() as $setting) {
            self::firstOrCreate(
                ['category' => $setting['category'], 'key' => $setting['key']],
                array_merge($setting, [
                    'id' => Str::uuid()->toString(),
                    'label' => $setting['label'],
                    'value' => $setting['value'] ?? null,
                    'type' => $setting['type'] ?? 'text',
                    'options' => isset($setting['options']) ? json_decode($setting['options'], true) : null,
                    'description' => $setting['description'] ?? null,
                    'sort_order' => $setting['sort_order'] ?? 0,
                    'is_visible' => true,
                    'is_encrypted' => $setting['is_encrypted'] ?? false,
                ])
            );
        }
    }
};