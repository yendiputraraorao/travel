<?php

use App\Services\AppSettingService;

if (!function_exists('setting')) {
    /**
     * Get a setting value by category and key.
     *
     * @param string $category
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    function setting(string $category, string $key, mixed $default = null): mixed
    {
        return AppSettingService::get($category, $key, $default);
    }
}

if (!function_exists('settings')) {
    /**
     * Get all settings for a category.
     *
     * @param string $category
     * @return array
     */
    function settings(string $category): array
    {
        return AppSettingService::getCategory($category);
    }
}

if (!function_exists('all_settings')) {
    /**
     * Get all settings grouped by category.
     *
     * @return array
     */
    function all_settings(): array
    {
        return AppSettingService::getAll();
    }
}

if (!function_exists('app_name')) {
    /**
     * Get the application name.
     */
    function app_name(): string
    {
        return AppSettingService::getAppName();
    }
}

if (!function_exists('app_title')) {
    /**
     * Get the application title.
     */
    function app_title(): string
    {
        return AppSettingService::getAppTitle();
    }
}

if (!function_exists('app_description')) {
    /**
     * Get the application description.
     */
    function app_description(): string
    {
        return AppSettingService::getAppDescription();
    }
}

if (!function_exists('app_tagline')) {
    /**
     * Get the application tagline.
     */
    function app_tagline(): string
    {
        return AppSettingService::getAppTagline();
    }
}

if (!function_exists('app_version')) {
    /**
     * Get the application version.
     */
    function app_version(): string
    {
        return AppSettingService::getAppVersion();
    }
}

if (!function_exists('logo_light')) {
    /**
     * Get the light mode logo URL.
     */
    function logo_light(): ?string
    {
        return AppSettingService::getLogoLight();
    }
}

if (!function_exists('logo_dark')) {
    /**
     * Get the dark mode logo URL.
     */
    function logo_dark(): ?string
    {
        return AppSettingService::getLogoDark();
    }
}

if (!function_exists('login_logo')) {
    /**
     * Get the login page logo URL.
     */
    function login_logo(): ?string
    {
        return AppSettingService::getLoginLogo();
    }
}

if (!function_exists('favicon')) {
    /**
     * Get the favicon URL.
     */
    function favicon(): ?string
    {
        return AppSettingService::getFavicon();
    }
}

if (!function_exists('app_icon')) {
    /**
     * Get the app icon URL.
     */
    function app_icon(): ?string
    {
        return AppSettingService::getAppIcon();
    }
}

if (!function_exists('primary_color')) {
    /**
     * Get the primary brand color.
     */
    function primary_color(): string
    {
        return AppSettingService::getPrimaryColor();
    }
}

if (!function_exists('secondary_color')) {
    /**
     * Get the secondary brand color.
     */
    function secondary_color(): string
    {
        return AppSettingService::getSecondaryColor();
    }
}

if (!function_exists('accent_color')) {
    /**
     * Get the accent color.
     */
    function accent_color(): string
    {
        return AppSettingService::getAccentColor();
    }
}

if (!function_exists('background_color')) {
    /**
     * Get the background color.
     */
    function background_color(): string
    {
        return AppSettingService::getBackgroundColor();
    }
}

if (!function_exists('sidebar_color')) {
    /**
     * Get the sidebar color.
     */
    function sidebar_color(): string
    {
        return AppSettingService::getSidebarColor();
    }
}

if (!function_exists('default_theme')) {
    /**
     * Get the default theme.
     */
    function default_theme(): string
    {
        return AppSettingService::getDefaultTheme();
    }
}

if (!function_exists('login_background_image')) {
    /**
     * Get the login background image URL.
     */
    function login_background_image(): ?string
    {
        return AppSettingService::getLoginBackgroundImage();
    }
}

if (!function_exists('company_name')) {
    /**
     * Get the company name.
     */
    function company_name(): string
    {
        return AppSettingService::getCompanyName();
    }
}

if (!function_exists('company_legal_name')) {
    /**
     * Get the company legal name.
     */
    function company_legal_name(): string
    {
        return AppSettingService::getCompanyLegalName();
    }
}

if (!function_exists('company_logo')) {
    /**
     * Get the company logo URL.
     */
    function company_logo(): ?string
    {
        return AppSettingService::getCompanyLogo();
    }
}

if (!function_exists('company_address')) {
    /**
     * Get the company address.
     */
    function company_address(): string
    {
        return AppSettingService::getCompanyAddress();
    }
}

if (!function_exists('company_phone')) {
    /**
     * Get the company phone.
     */
    function company_phone(): string
    {
        return AppSettingService::getCompanyPhone();
    }
}

if (!function_exists('company_whatsapp')) {
    /**
     * Get the company WhatsApp.
     */
    function company_whatsapp(): string
    {
        return AppSettingService::getCompanyWhatsApp();
    }
}

if (!function_exists('company_email')) {
    /**
     * Get the company email.
     */
    function company_email(): string
    {
        return AppSettingService::getCompanyEmail();
    }
}

if (!function_exists('company_website')) {
    /**
     * Get the company website.
     */
    function company_website(): string
    {
        return AppSettingService::getCompanyWebsite();
    }
}

if (!function_exists('company_npwp')) {
    /**
     * Get the company NPWP.
     */
    function company_npwp(): string
    {
        return AppSettingService::getCompanyNpwp();
    }
}

if (!function_exists('support_email')) {
    /**
     * Get the support email.
     */
    function support_email(): string
    {
        return AppSettingService::getSupportEmail();
    }
}

if (!function_exists('support_phone')) {
    /**
     * Get the support phone.
     */
    function support_phone(): string
    {
        return AppSettingService::getSupportPhone();
    }
}

if (!function_exists('whatsapp_support')) {
    /**
     * Get the WhatsApp support number.
     */
    function whatsapp_support(): string
    {
        return AppSettingService::getWhatsAppSupport();
    }
}

if (!function_exists('default_language')) {
    /**
     * Get the default language.
     */
    function default_language(): string
    {
        return AppSettingService::getDefaultLanguage();
    }
}

if (!function_exists('default_timezone')) {
    /**
     * Get the default timezone.
     */
    function default_timezone(): string
    {
        return AppSettingService::getDefaultTimezone();
    }
}

if (!function_exists('date_format')) {
    /**
     * Get the date format.
     */
    function date_format(): string
    {
        return AppSettingService::getDateFormat();
    }
}

if (!function_exists('time_format')) {
    /**
     * Get the time format.
     */
    function time_format(): string
    {
        return AppSettingService::getTimeFormat();
    }
}

if (!function_exists('currency_symbol')) {
    /**
     * Get the currency symbol.
     */
    function currency_symbol(): string
    {
        return AppSettingService::getCurrencySymbol();
    }
}

if (!function_exists('currency_code')) {
    /**
     * Get the currency code.
     */
    function currency_code(): string
    {
        return AppSettingService::getCurrencyCode();
    }
}

if (!function_exists('format_currency')) {
    /**
     * Format a number as currency.
     */
    function format_currency(float $amount, int $decimals = 0): string
    {
        return AppSettingService::formatCurrency($amount, $decimals);
    }
}

if (!function_exists('format_date')) {
    /**
     * Format a date string.
     */
    function format_date(string $date, ?string $format = null): string
    {
        return AppSettingService::formatDate($date, $format);
    }
}

if (!function_exists('format_time')) {
    /**
     * Format a time string.
     */
    function format_time(string $time, ?string $format = null): string
    {
        return AppSettingService::formatTime($time, $format);
    }
}

if (!function_exists('format_datetime')) {
    /**
     * Format a datetime string.
     */
    function format_datetime(string $datetime, ?string $dateFormat = null, ?string $timeFormat = null): string
    {
        return AppSettingService::formatDateTime($datetime, $dateFormat, $timeFormat);
    }
}

if (!function_exists('is_maintenance_mode')) {
    /**
     * Check if maintenance mode is enabled.
     */
    function is_maintenance_mode(): bool
    {
        return AppSettingService::isMaintenanceMode();
    }
}

if (!function_exists('maintenance_message')) {
    /**
     * Get the maintenance message.
     */
    function maintenance_message(): string
    {
        return AppSettingService::getMaintenanceMessage();
    }
}