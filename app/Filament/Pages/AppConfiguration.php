<?php

namespace App\Filament\Pages;

use App\Models\AppSetting;
use App\Services\AppSettingService;
use Filament\Actions\Action as PageAction;
use Filament\Forms;
use Filament\Forms\Components\Actions;
use Filament\Forms\Components\Actions\Action;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\KeyValue;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\Wizard;
use Filament\Forms\Components\Wizard\Step;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Support\Enums\MaxWidth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AppConfiguration extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-cog-6-tooth';

    protected static ?string $navigationLabel = 'Konfigurasi Aplikasi';

    protected static ?int $navigationSort = 20;

    protected static string $view = 'filament.pages.app-configuration';

    protected static ?string $title = 'Konfigurasi Aplikasi';

    protected static ?string $slug = 'app-configuration';

    public ?array $data = [];

    public function mount(): void
    {
        $this->form->fill(AppSettingService::getAll());
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Tabs::make('settings_tabs')
                    ->tabs([
                        // General Settings Tab
                        Forms\Components\Tabs\Tab::make('General')
                            ->icon('heroicon-o-home')
                            ->schema($this->getGeneralSettingsSchema()),

                        // Branding & Appearance Tab
                        Forms\Components\Tabs\Tab::make('Branding')
                            ->icon('heroicon-o-paint-brush')
                            ->schema($this->getBrandingSettingsSchema()),

                        // Company Information Tab
                        Forms\Components\Tabs\Tab::make('Company')
                            ->icon('heroicon-o-building-office')
                            ->schema($this->getCompanySettingsSchema()),

                        // Contact & Social Media Tab
                        Forms\Components\Tabs\Tab::make('Contact')
                            ->icon('heroicon-o-phone')
                            ->schema($this->getContactSettingsSchema()),

                        // Localization Settings Tab
                        Forms\Components\Tabs\Tab::make('Localization')
                            ->icon('heroicon-o-globe-alt')
                            ->schema($this->getLocalizationSettingsSchema()),

                        // Email Configuration Tab
                        Forms\Components\Tabs\Tab::make('Email')
                            ->icon('heroicon-o-envelope')
                            ->schema($this->getEmailSettingsSchema()),

                        // Notification Settings Tab
                        Forms\Components\Tabs\Tab::make('Notifications')
                            ->icon('heroicon-o-bell')
                            ->schema($this->getNotificationSettingsSchema()),

                        // Security Settings Tab
                        Forms\Components\Tabs\Tab::make('Security')
                            ->icon('heroicon-o-shield-check')
                            ->schema($this->getSecuritySettingsSchema()),

                        // System Settings Tab
                        Forms\Components\Tabs\Tab::make('System')
                            ->icon('heroicon-o-cog-6-tooth')
                            ->schema($this->getSystemSettingsSchema()),

                        // SEO & Metadata Tab
                        Forms\Components\Tabs\Tab::make('SEO')
                            ->icon('heroicon-o-magnifying-glass')
                            ->schema($this->getSeoSettingsSchema()),

                        // Integration Settings Tab
                        Forms\Components\Tabs\Tab::make('Integrations')
                            ->icon('heroicon-o-puzzle-piece')
                            ->schema($this->getIntegrationSettingsSchema()),

                        // Backup & Maintenance Tab
                        Forms\Components\Tabs\Tab::make('Backup')
                            ->icon('heroicon-o-arrow-down-tray')
                            ->schema($this->getBackupSettingsSchema()),
                    ])
                    ->columnSpanFull(),
            ])
            ->statePath('data');
    }

    protected function getGeneralSettingsSchema(): array
    {
        return [
            Section::make('Application Identity')
                ->description('Basic information about your application')
                ->schema([
                    Grid::make(2)->schema([
                        TextInput::make('general.app_name')
                            ->label('Application Name')
                            ->required()
                            ->maxLength(100),
                        TextInput::make('general.app_title')
                            ->label('Application Title')
                            ->maxLength(255),
                    ]),
                    Grid::make(2)->schema([
                        TextInput::make('general.app_version')
                            ->label('Application Version')
                            ->maxLength(20),
                        Select::make('general.default_language')
                            ->label('Default Language')
                            ->options(['id' => 'Indonesian', 'en' => 'English'])
                            ->native(false),
                    ]),
                    Textarea::make('general.app_description')
                        ->label('Application Description')
                        ->rows(3),
                    TextInput::make('general.app_tagline')
                        ->label('Application Tagline')
                        ->maxLength(255)
                        ->helperText('Short slogan or tagline'),
                ]),

            Section::make('Regional Settings')
                ->description('Default regional and formatting settings')
                ->schema([
                    Grid::make(3)->schema([
                        Select::make('general.default_timezone')
                            ->label('Default Timezone')
                            ->options([
                                'Asia/Jakarta' => 'WIB (UTC+7)',
                                'Asia/Makassar' => 'WITA (UTC+8)',
                                'Asia/Jayapura' => 'WIT (UTC+9)',
                            ])
                            ->native(false)
                            ->searchable(),
                        Select::make('general.date_format')
                            ->label('Date Format')
                            ->options([
                                'd/m/Y' => 'DD/MM/YYYY (31/12/2024)',
                                'Y-m-d' => 'YYYY-MM-DD (2024-12-31)',
                                'd F Y' => 'DD Month YYYY (31 December 2024)',
                            ])
                            ->native(false),
                        Select::make('general.time_format')
                            ->label('Time Format')
                            ->options([
                                'H:i' => '24-hour (14:30)',
                                'h:i A' => '12-hour (02:30 PM)',
                            ])
                            ->native(false),
                    ]),
                    Grid::make(2)->schema([
                        Select::make('general.default_currency')
                            ->label('Default Currency')
                            ->options(['IDR' => 'Indonesian Rupiah (IDR)'])
                            ->native(false),
                        TextInput::make('general.currency_symbol')
                            ->label('Currency Symbol')
                            ->maxLength(10)
                            ->default('Rp'),
                    ]),
                ]),
        ];
    }

    protected function getBrandingSettingsSchema(): array
    {
        return [
            Section::make('Logos & Icons')
                ->description('Upload logos and icons for different contexts')
                ->schema([
                    Grid::make(2)->schema([
                        FileUpload::make('branding.logo_light')
                            ->label('Logo (Light Mode)')
                            ->image()
                            ->imageEditor()
                            ->directory('settings/branding')
                            ->maxSize(5120)
                            ->acceptedFileTypes(['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'])
                            ->helperText('Used in light theme (recommended: transparent PNG, max 5MB)'),

                        FileUpload::make('branding.logo_dark')
                            ->label('Logo (Dark Mode)')
                            ->image()
                            ->imageEditor()
                            ->directory('settings/branding')
                            ->maxSize(5120)
                            ->acceptedFileTypes(['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'])
                            ->helperText('Used in dark theme (recommended: transparent PNG, max 5MB)'),
                    ]),
                    Grid::make(2)->schema([
                        FileUpload::make('branding.login_logo')
                            ->label('Login Page Logo')
                            ->image()
                            ->imageEditor()
                            ->directory('settings/branding')
                            ->maxSize(5120)
                            ->acceptedFileTypes(['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'])
                            ->helperText('Logo shown on login page'),

                        FileUpload::make('branding.favicon')
                            ->label('Favicon')
                            ->image()
                            ->imageEditor()
                            ->directory('settings/branding')
                            ->maxSize(1024)
                            ->acceptedFileTypes(['image/png', 'image/x-icon', 'image/svg+xml'])
                            ->helperText('Browser tab icon (32x32 or 16x16)'),
                    ]),
                    Grid::make(2)->schema([
                        FileUpload::make('branding.app_icon')
                            ->label('App Icon (PWA)')
                            ->image()
                            ->imageEditor()
                            ->directory('settings/branding')
                            ->maxSize(5120)
                            ->acceptedFileTypes(['image/png', 'image/webp'])
                            ->helperText('PWA/App icon (192x192 or 512x512)'),

                        FileUpload::make('branding.login_background_image')
                            ->label('Login Background Image')
                            ->image()
                            ->imageEditor()
                            ->directory('settings/branding')
                            ->maxSize(10240)
                            ->acceptedFileTypes(['image/png', 'image/jpeg', 'image/webp'])
                            ->helperText('Background for login page (max 10MB)'),
                    ]),
                ]),

            Section::make('Color Scheme')
                ->description('Define your brand colors')
                ->schema([
                    Grid::make(3)->schema([
                        ColorPicker::make('branding.primary_color')
                            ->label('Primary Color')
                            ->default('#f97316')
                            ->helperText('Main brand color (buttons, links, accents)'),
                        ColorPicker::make('branding.secondary_color')
                            ->label('Secondary Color')
                            ->default('#1e2430')
                            ->helperText('Secondary brand color (sidebar, headers)'),
                        ColorPicker::make('branding.accent_color')
                            ->label('Accent Color')
                            ->default('#2563eb')
                            ->helperText('Accent color (highlights, notifications)'),
                    ]),
                    Grid::make(2)->schema([
                        ColorPicker::make('branding.background_color')
                            ->label('Background Color')
                            ->default('#ffffff')
                            ->helperText('Default page background'),
                        ColorPicker::make('branding.sidebar_color')
                            ->label('Sidebar Color')
                            ->default('#1e2430')
                            ->helperText('Sidebar background color'),
                    ]),
                ]),

            Section::make('Theme Settings')
                ->description('Default theme preferences')
                ->schema([
                    Grid::make(2)->schema([
                        Select::make('branding.default_theme')
                            ->label('Default Theme')
                            ->options([
                                'light' => 'Light',
                                'dark' => 'Dark',
                                'system' => 'System Preference',
                            ])
                            ->native(false),
                    ]),
                ]),
        ];
    }

    protected function getCompanySettingsSchema(): array
    {
        return [
            Section::make('Company Identity')
                ->description('Legal and display information for documents')
                ->schema([
                    Grid::make(2)->schema([
                        TextInput::make('company.company_name')
                            ->label('Company Name')
                            ->required()
                            ->maxLength(255)
                            ->helperText('Display name used in UI'),
                        TextInput::make('company.company_legal_name')
                            ->label('Legal Company Name')
                            ->maxLength(255)
                            ->helperText('Legal registered name for contracts'),
                    ]),
                    FileUpload::make('company.company_logo')
                        ->label('Company Logo')
                        ->image()
                        ->imageEditor()
                        ->directory('settings/company')
                        ->maxSize(5120)
                        ->acceptedFileTypes(['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'])
                        ->helperText('Logo for invoices, tickets, and documents'),
                ]),

            Section::make('Address & Contact')
                ->description('Company location and contact details')
                ->schema([
                    Grid::make(2)->schema([
                        TextInput::make('company.company_province')
                            ->label('Province')
                            ->maxLength(100),
                        TextInput::make('company.company_city')
                            ->label('City / Regency')
                            ->maxLength(100),
                    ]),
                    Grid::make(2)->schema([
                        TextInput::make('company.company_district')
                            ->label('District')
                            ->maxLength(100),
                        TextInput::make('company.company_postal_code')
                            ->label('Postal Code')
                            ->maxLength(20),
                    ]),
                    TextInput::make('company.company_country')
                        ->label('Country')
                        ->maxLength(100)
                        ->default('Indonesia'),
                    Textarea::make('company.company_address')
                        ->label('Full Address')
                        ->rows(3)
                        ->helperText('Complete address for documents'),
                ]),

            Section::make('Communication Details')
                ->schema([
                    Grid::make(2)->schema([
                        TextInput::make('company.company_phone')
                            ->label('Phone Number')
                            ->tel()
                            ->maxLength(50)
                            ->helperText('Include country code'),
                        TextInput::make('company.company_whatsapp')
                            ->label('WhatsApp Number')
                            ->tel()
                            ->maxLength(50)
                            ->helperText('With country code (e.g., +6281234567890)'),
                    ]),
                    Grid::make(2)->schema([
                        TextInput::make('company.company_email')
                            ->label('Email Address')
                            ->email()
                            ->maxLength(255),
                        TextInput::make('company.company_website')
                            ->label('Website')
                            ->url()
                            ->maxLength(255),
                    ]),
                    TextInput::make('company.company_npwp')
                        ->label('Tax ID (NPWP)')
                        ->maxLength(50)
                        ->helperText('Format: 01.234.567.8-901.000'),
                ]),
        ];
    }

    protected function getContactSettingsSchema(): array
    {
        return [
            Section::make('Support Channels')
                ->description('Customer support contact information')
                ->schema([
                    Grid::make(2)->schema([
                        TextInput::make('contact.support_email')
                            ->label('Support Email')
                            ->email()
                            ->maxLength(255),
                        TextInput::make('contact.support_phone')
                            ->label('Support Phone')
                            ->tel()
                            ->maxLength(50),
                    ]),
                    TextInput::make('contact.whatsapp_support')
                        ->label('WhatsApp Support')
                        ->tel()
                        ->maxLength(50)
                        ->helperText('With country code for click-to-chat links'),
                ]),

            Section::make('Social Media')
                ->description('Official social media links')
                ->schema([
                    Grid::make(2)->schema([
                        TextInput::make('contact.facebook_url')
                            ->label('Facebook')
                            ->url()
                            ->maxLength(255)
                            ->prefixIcon('heroicon-o-share'),
                        TextInput::make('contact.instagram_url')
                            ->label('Instagram')
                            ->url()
                            ->maxLength(255)
                            ->prefixIcon('heroicon-o-camera'),
                    ]),
                    Grid::make(2)->schema([
                        TextInput::make('contact.youtube_url')
                            ->label('YouTube')
                            ->url()
                            ->maxLength(255)
                            ->prefixIcon('heroicon-o-play'),
                        TextInput::make('contact.tiktok_url')
                            ->label('TikTok')
                            ->url()
                            ->maxLength(255)
                            ->prefixIcon('heroicon-o-musical-note'),
                    ]),
                    TextInput::make('contact.website_url')
                        ->label('Website URL')
                        ->url()
                        ->maxLength(255),
                ]),
        ];
    }

    protected function getLocalizationSettingsSchema(): array
    {
        return [
            Section::make('Language & Region')
                ->schema([
                    Grid::make(2)->schema([
                        Select::make('localization.app_language')
                            ->label('Application Language')
                            ->options(['id' => 'Indonesian', 'en' => 'English'])
                            ->native(false),
                        KeyValue::make('localization.available_languages')
                            ->label('Available Languages')
                            ->keyLabel('Code')
                            ->valueLabel('Name')
                            ->addActionLabel('Add Language')
                            ->helperText('Languages available for users to select')
                            ->afterStateHydrated(self::decodeKeyValueState(...)),
                    ]),
                    Grid::make(2)->schema([
                        Select::make('localization.default_timezone')
                            ->label('Default Timezone')
                            ->options([
                                'Asia/Jakarta' => 'WIB (UTC+7)',
                                'Asia/Makassar' => 'WITA (UTC+8)',
                                'Asia/Jayapura' => 'WIT (UTC+9)',
                            ])
                            ->native(false)
                            ->searchable(),
                        Select::make('localization.number_format')
                            ->label('Number Format')
                            ->options([
                                'id_ID' => 'Indonesian (1.234,56)',
                                'en_US' => 'US (1,234.56)',
                            ])
                            ->native(false),
                    ]),
                ]),

            Section::make('Date & Time Formats')
                ->schema([
                    Grid::make(2)->schema([
                        Select::make('localization.date_format')
                            ->label('Date Format')
                            ->options([
                                'd/m/Y' => 'DD/MM/YYYY',
                                'Y-m-d' => 'YYYY-MM-DD',
                                'd F Y' => 'DD Month YYYY',
                            ])
                            ->native(false),
                        Select::make('localization.time_format')
                            ->label('Time Format')
                            ->options([
                                'H:i' => '24-hour (HH:MM)',
                                'h:i A' => '12-hour (HH:MM AM/PM)',
                            ])
                            ->native(false),
                    ]),
                    Grid::make(2)->schema([
                        Select::make('localization.default_currency')
                            ->label('Default Currency')
                            ->options(['IDR' => 'Indonesian Rupiah (IDR)'])
                            ->native(false),
                        TextInput::make('localization.currency_symbol')
                            ->label('Currency Symbol')
                            ->maxLength(10),
                    ]),
                    Select::make('localization.first_day_of_week')
                        ->label('First Day of Week')
                        ->options([
                            '0' => 'Sunday',
                            '1' => 'Monday',
                            '6' => 'Saturday',
                        ])
                        ->native(false),
                ]),
        ];
    }

    protected function getEmailSettingsSchema(): array
    {
        return [
            Section::make('SMTP Configuration')
                ->description('Configure email delivery settings')
                ->schema([
                    Grid::make(2)->schema([
                        TextInput::make('email.smtp_host')
                            ->label('SMTP Host')
                            ->required()
                            ->maxLength(255),
                        TextInput::make('email.smtp_port')
                            ->label('SMTP Port')
                            ->numeric()
                            ->required()
                            ->default(587),
                    ]),
                    Grid::make(2)->schema([
                        TextInput::make('email.smtp_username')
                            ->label('SMTP Username')
                            ->maxLength(255),
                        TextInput::make('email.smtp_password')
                            ->label('SMTP Password')
                            ->password()
                            ->maxLength(255)
                            ->helperText('Leave blank to keep current password')
                            ->revealable(),
                    ]),
                    Select::make('email.smtp_encryption')
                        ->label('Encryption')
                        ->options([
                            'tls' => 'TLS',
                            'ssl' => 'SSL',
                            'none' => 'None',
                        ])
                        ->native(false)
                        ->default('tls'),
                ]),

            Section::make('Sender Information')
                ->schema([
                    Grid::make(2)->schema([
                        TextInput::make('email.sender_name')
                            ->label('Sender Name')
                            ->required()
                            ->maxLength(255),
                        TextInput::make('email.sender_email')
                            ->label('Sender Email')
                            ->email()
                            ->required()
                            ->maxLength(255),
                    ]),
                    TextInput::make('email.reply_to_email')
                        ->label('Reply-To Email')
                        ->email()
                        ->maxLength(255),
                ]),

            Section::make('Test Email')
                ->schema([
                    Grid::make(2)->schema([
                        TextInput::make('email_test_recipient')
                            ->label('Test Email Recipient')
                            ->email()
                            ->maxLength(255)
                            ->helperText('Email address to send test to'),
                        Actions::make([
                            Action::make('send_test_email')
                        ->label('Send Test Email')
                        ->icon('heroicon-o-paper-airplane')
                        ->color('primary')
                        ->form([
                            TextInput::make('test_email')
                                ->label('Recipient Email')
                                ->email()
                                ->required(),
                        ])
                        ->action(function (array $data) {
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

                            Mail::raw('This is a test email from Tiketux Go App Configuration.', function ($message) use ($data, $config) {
                                $message->to($data['test_email'])
                                    ->subject('Test Email - Tiketux Go')
                                    ->from($config['sender_email'] ?? 'noreply@example.com', $config['sender_name'] ?? 'Tiketux Go');
                            });

                            Notification::make()
                                ->title('Test email sent successfully!')
                                ->success()
                                ->send();
                        })
                        ->requiresConfirmation()
                        ->modalHeading('Send Test Email')
                        ->modalDescription('A test email will be sent to the recipient address.')
                        ->modalSubmitActionLabel('Send'),
                        ]),
                    ]),
                ]),

            Section::make('SMTP Connection Test')
                ->schema([
                    Actions::make([
                        Action::make('test_smtp_connection')
                        ->label('Test SMTP Connection')
                        ->icon('heroicon-o-wifi')
                        ->color('info')
                        ->action(function () {
                            try {
                                $config = AppSettingService::getCategory('email');

                                $host = $config['smtp_host'] ?? 'mailpit';
                                $port = $config['smtp_port'] ?? 1025;
                                $encryption = $config['smtp_encryption'] ?? 'tls';
                                $username = $config['smtp_username'] ?? null;
                                $password = $config['smtp_password'] ?? null;

                                $transport = new \Symfony\Component\Mailer\Transport\Smtp\EsmtpTransport($host, $port);
                                $transport->setEncryption($encryption === 'none' ? null : $encryption);

                                if ($username && $password) {
                                    $transport->setUsername($username);
                                    $transport->setPassword($password);
                                }

                                $mailer = new \Symfony\Component\Mailer\Mailer($transport);
                                $mailer->getTransport()->start();

                                Notification::make()
                                    ->title('SMTP connection successful!')
                                    ->success()
                                    ->send();
                            } catch (\Exception $e) {
                                Notification::make()
                                    ->title('SMTP connection failed: ' . $e->getMessage())
                                    ->danger()
                                    ->send();
                            }
                        })
                        ->requiresConfirmation()
                        ->modalHeading('Test SMTP Connection')
                        ->modalDescription('This will verify the SMTP server connection without sending an email.')
                        ->modalSubmitActionLabel('Test Connection'),
                    ]),
                ]),
        ];
    }

    protected function getNotificationSettingsSchema(): array
    {
        return [
            Section::make('Notification Channels')
                ->description('Enable or disable notification delivery channels')
                ->schema([
                    Grid::make(3)->schema([
                        Toggle::make('notification.email_enabled')
                            ->label('Email Notifications')
                            ->default(true),
                        Toggle::make('notification.whatsapp_enabled')
                            ->label('WhatsApp Notifications')
                            ->default(false),
                        Toggle::make('notification.in_app_enabled')
                            ->label('In-App Notifications')
                            ->default(true),
                    ]),
                ]),

            Section::make('Notification Types')
                ->description('Configure which notifications to send')
                ->schema([
                    Grid::make(2)->schema([
                        Toggle::make('notification.booking_confirmation')
                            ->label('Booking Confirmation')
                            ->default(true),
                        Toggle::make('notification.payment_confirmation')
                            ->label('Payment Confirmation')
                            ->default(true),
                    ]),
                    Grid::make(2)->schema([
                        Toggle::make('notification.ticket_issued')
                            ->label('Ticket Issued')
                            ->default(true),
                        Toggle::make('notification.trip_reminder')
                            ->label('Trip Reminder')
                            ->default(true),
                    ]),
                    Grid::make(2)->schema([
                        Toggle::make('notification.booking_cancellation')
                            ->label('Booking Cancellation')
                            ->default(true),
                        Toggle::make('notification.schedule_changes')
                            ->label('Schedule Changes')
                            ->default(true),
                    ]),
                    Toggle::make('notification.payment_reminder')
                        ->label('Payment Reminder')
                        ->default(true),
                ]),
        ];
    }

    protected function getSecuritySettingsSchema(): array
    {
        return [
            Section::make('Authentication Security')
                ->schema([
                    Grid::make(3)->schema([
                        TextInput::make('security.session_timeout')
                            ->label('Session Timeout (minutes)')
                            ->numeric()
                            ->default(120)
                            ->minValue(5)
                            ->maxValue(1440),
                        TextInput::make('security.min_password_length')
                            ->label('Min Password Length')
                            ->numeric()
                            ->default(8)
                            ->minValue(6)
                            ->maxValue(64),
                        TextInput::make('security.max_login_attempts')
                            ->label('Max Login Attempts')
                            ->numeric()
                            ->default(5)
                            ->minValue(3)
                            ->maxValue(20),
                    ]),
                    Grid::make(3)->schema([
                        Toggle::make('security.password_complexity')
                            ->label('Require Password Complexity')
                            ->default(true),
                        Toggle::make('security.two_factor_auth')
                            ->label('Two-Factor Authentication')
                            ->default(false),
                        Toggle::make('security.enable_captcha')
                            ->label('Enable CAPTCHA')
                            ->default(false),
                    ]),
                    Grid::make(3)->schema([
                        Toggle::make('security.force_https')
                            ->label('Force HTTPS')
                            ->default(true),
                        Toggle::make('security.login_notification')
                            ->label('Login Notification')
                            ->default(true),
                        TextInput::make('security.password_expiration')
                            ->label('Password Expiration (days, 0=disabled)')
                            ->numeric()
                            ->default(90)
                            ->minValue(0)
                            ->maxValue(365),
                    ]),
                ]),
        ];
    }

    protected function getSystemSettingsSchema(): array
    {
        return [
            Section::make('Maintenance Mode')
                ->schema([
                    Toggle::make('system.maintenance_mode')
                        ->label('Enable Maintenance Mode')
                        ->default(false)
                        ->helperText('When enabled, only admins can access the application'),
                    Textarea::make('system.maintenance_message')
                        ->label('Maintenance Message')
                        ->rows(3)
                        ->default('System is under maintenance. Please try again later.')
                        ->visible(fn (Forms\Get $get): bool => $get('system.maintenance_mode')),
                ]),

            Section::make('User Registration')
                ->schema([
                    Grid::make(2)->schema([
                        Toggle::make('system.enable_customer_registration')
                            ->label('Enable Customer Registration')
                            ->default(true),
                        Toggle::make('system.enable_customer_verification')
                            ->label('Require Email Verification')
                            ->default(false),
                    ]),
                ]),

            Section::make('File Uploads')
                ->schema([
                    Grid::make(2)->schema([
                        TextInput::make('system.max_file_upload_size')
                            ->label('Max File Upload Size (MB)')
                            ->numeric()
                            ->default(10)
                            ->minValue(1)
                            ->maxValue(100),
                        TextInput::make('system.allowed_file_extensions')
                            ->label('Allowed Extensions')
                            ->maxLength(255)
                            ->default('jpg,jpeg,png,gif,webp,pdf,doc,docx,xls,xlsx')
                            ->helperText('Comma-separated list'),
                    ]),
                ]),

            Section::make('System Features')
                ->schema([
                    Grid::make(2)->schema([
                        Toggle::make('system.enable_audit_log')
                            ->label('Enable Audit Log')
                            ->default(true),
                        Toggle::make('system.enable_application_cache')
                            ->label('Enable Application Cache')
                            ->default(true),
                    ]),
                ]),
        ];
    }

    protected function getSeoSettingsSchema(): array
    {
        return [
            Section::make('Metadata')
                ->schema([
                    TextInput::make('seo.meta_title')
                        ->label('Meta Title')
                        ->maxLength(60)
                        ->helperText('Recommended: 50-60 characters'),
                    Textarea::make('seo.meta_description')
                        ->label('Meta Description')
                        ->rows(3)
                        ->maxLength(500)
                        ->helperText('Recommended: 150-160 characters'),
                    TextInput::make('seo.meta_keywords')
                        ->label('Meta Keywords')
                        ->maxLength(255)
                        ->helperText('Comma-separated keywords'),
                ]),

            Section::make('Social Sharing')
                ->schema([
                    Grid::make(2)->schema([
                        FileUpload::make('seo.og_image')
                            ->label('Open Graph Image')
                            ->image()
                            ->imageEditor()
                            ->directory('settings/seo')
                            ->maxSize(5120)
                            ->acceptedFileTypes(['image/png', 'image/jpeg', 'image/webp'])
                            ->helperText('1200x630px recommended'),
                        FileUpload::make('seo.social_sharing_image')
                            ->label('Social Sharing Image')
                            ->image()
                            ->imageEditor()
                            ->directory('settings/seo')
                            ->maxSize(5120)
                            ->acceptedFileTypes(['image/png', 'image/jpeg', 'image/webp'])
                            ->helperText('Used for WhatsApp, Twitter, etc.'),
                    ]),
                ]),

            Section::make('Search Engine')
                ->schema([
                    Toggle::make('seo.search_engine_indexing')
                        ->label('Allow Search Engine Indexing')
                        ->default(true)
                        ->helperText('Disable to add noindex to public pages'),
                ]),
        ];
    }

    protected function getIntegrationSettingsSchema(): array
    {
        return [
            Section::make('Maps & Location')
                ->schema([
                    TextInput::make('integration.google_maps_api_key')
                        ->label('Google Maps API Key')
                        ->password()
                        ->revealable()
                        ->maxLength(255)
                        ->helperText('For maps on booking and tracking pages'),
                ]),

            Section::make('WhatsApp Business API')
                ->schema([
                    Grid::make(2)->schema([
                        TextInput::make('integration.whatsapp_phone_number_id')
                            ->label('Phone Number ID')
                            ->maxLength(255),
                        TextInput::make('integration.whatsapp_api_token')
                            ->label('API Token')
                            ->password()
                            ->revealable()
                            ->maxLength(255),
                    ]),
                ]),

            Section::make('Payment Gateway')
                ->schema([
                    Select::make('integration.payment_gateway')
                        ->label('Payment Gateway')
                        ->options([
                            'midtrans' => 'Midtrans',
                            'xendit' => 'Xendit',
                            'tripay' => 'Tripay',
                            'manual' => 'Manual Transfer',
                        ])
                        ->native(false),
                    KeyValue::make('integration.payment_gateway_config')
                        ->label('Gateway Configuration (JSON)')
                        ->keyLabel('Key')
                        ->valueLabel('Value')
                        ->addActionLabel('Add Config')
                        ->helperText('Gateway-specific configuration (e.g., merchant ID, server key)')
                        ->afterStateHydrated(self::decodeKeyValueState(...)),
                ]),

            Section::make('Cloud Storage')
                ->schema([
                    Select::make('integration.cloud_storage')
                        ->label('Storage Provider')
                        ->options([
                            'local' => 'Local Storage',
                            's3' => 'AWS S3',
                            'gcs' => 'Google Cloud Storage',
                            'wasabi' => 'Wasabi',
                        ])
                        ->native(false),
                    KeyValue::make('integration.cloud_storage_config')
                        ->label('Storage Configuration (JSON)')
                        ->keyLabel('Key')
                        ->valueLabel('Value')
                        ->addActionLabel('Add Config')
                        ->helperText('Provider-specific configuration (bucket, region, credentials)')
                        ->afterStateHydrated(self::decodeKeyValueState(...)),
                ]),

            Section::make('Third-Party APIs & Webhooks')
                ->schema([
                    KeyValue::make('integration.third_party_api')
                        ->label('Third-Party APIs (JSON)')
                        ->keyLabel('Key')
                        ->valueLabel('Value')
                        ->addActionLabel('Add API')
                        ->helperText('Configuration for external APIs')
                        ->afterStateHydrated(self::decodeKeyValueState(...)),
                    KeyValue::make('integration.webhook_config')
                        ->label('Webhooks (JSON)')
                        ->keyLabel('Event')
                        ->valueLabel('URL')
                        ->addActionLabel('Add Webhook')
                        ->helperText('Webhook URLs for payment callbacks, etc.')
                        ->afterStateHydrated(self::decodeKeyValueState(...)),
                ]),
        ];
    }

    protected function getBackupSettingsSchema(): array
    {
        return [
            Section::make('Automatic Backup')
                ->schema([
                    Grid::make(2)->schema([
                        Toggle::make('backup.auto_backup_enabled')
                            ->label('Enable Automatic Backup')
                            ->default(false),
                        TextInput::make('backup.backup_schedule')
                            ->label('Backup Schedule (Cron)')
                            ->maxLength(100)
                            ->default('0 2 * * *')
                            ->helperText('Cron expression (e.g., 0 2 * * * = daily at 2 AM)'),
                    ]),
                    Grid::make(2)->schema([
                        TextInput::make('backup.backup_retention_days')
                            ->label('Retention (days)')
                            ->numeric()
                            ->default(30)
                            ->minValue(1)
                            ->maxValue(365),
                        Select::make('backup.backup_storage')
                            ->label('Backup Storage')
                            ->options([
                                'local' => 'Local Storage',
                                's3' => 'AWS S3',
                                'gcs' => 'Google Cloud Storage',
                            ])
                            ->native(false),
                    ]),
                    KeyValue::make('backup.backup_storage_config')
                        ->label('Storage Configuration (JSON)')
                        ->keyLabel('Key')
                        ->valueLabel('Value')
                        ->addActionLabel('Add Config')
                        ->helperText('Storage-specific configuration')
                        ->afterStateHydrated(self::decodeKeyValueState(...)),
                ]),

            Section::make('Manual Actions')
                ->schema([
                    Actions::make([
                        Action::make('create_backup')
                            ->label('Create Backup Now')
                            ->icon('heroicon-o-arrow-down-tray')
                            ->color('primary')
                            ->action(function () {
                                $settings = AppSetting::all()->toArray();
                                $filename = 'app_settings_backup_' . now()->format('Y-m-d_H-i-s') . '.json';
                                $path = storage_path('app/backups/' . $filename);

                                if (!file_exists(dirname($path))) {
                                    mkdir(dirname($path), 0755, true);
                                }

                                file_put_contents($path, json_encode($settings, JSON_PRETTY_PRINT));

                                Notification::make()
                                    ->title('Backup created: ' . $filename)
                                    ->success()
                                    ->send();
                            })
                            ->requiresConfirmation()
                            ->modalHeading('Create Backup')
                            ->modalDescription('This will create a JSON backup of all settings.'),

                        Action::make('clear_cache')
                            ->label('Clear Application Cache')
                            ->icon('heroicon-o-trash')
                            ->color('warning')
                            ->action(function () {
                                \Illuminate\Support\Facades\Artisan::call('cache:clear');
                                \Illuminate\Support\Facades\Artisan::call('config:clear');
                                \Illuminate\Support\Facades\Artisan::call('view:clear');
                                \Illuminate\Support\Facades\Artisan::call('route:clear');

                                AppSettingService::clearCache();

                                Notification::make()
                                    ->title('Application cache cleared')
                                    ->success()
                                    ->send();
                            }),
                    ]),
                    Actions::make([
                        Action::make('clear_temp_files')
                            ->label('Clear Temporary Files')
                            ->icon('heroicon-o-folder-minus')
                            ->color('gray')
                            ->action(function () {
                                $tempPath = storage_path('framework/cache');
                                if (file_exists($tempPath)) {
                                    $files = glob($tempPath . '/*');
                                    foreach ($files as $file) {
                                        if (is_file($file)) {
                                            unlink($file);
                                        }
                                    }
                                }

                                Notification::make()
                                    ->title('Temporary files cleared')
                                    ->success()
                                    ->send();
                            }),

                        Action::make('system_info')
                            ->label('System Information')
                            ->icon('heroicon-o-information-circle')
                            ->color('info')
                            ->url(fn () => route('filament.admin.pages.system-info'), shouldOpenInNewTab: true)
                            ->visible(fn () => class_exists(\App\Filament\Pages\SystemInfo::class)),
                    ]),
                ]),
        ];
    }

    public function save(): void
    {
        $data = $this->form->getState();

        foreach ($data as $category => $settings) {
            if (!is_array($settings)) {
                continue;
            }
            foreach ($settings as $key => $value) {
                if ($key === 'email_test_recipient') {
                    continue;
                }

                $setting = AppSetting::where('category', $category)
                    ->where('key', $key)
                    ->first();

                if ($setting) {
                    $setting->value = is_array($value)
                        ? json_encode($value, JSON_UNESCAPED_UNICODE)
                        : $value;
                    $setting->save();
                }
            }
        }

        AppSettingService::clearCache();

        Notification::make()
            ->title('Settings saved successfully')
            ->success()
            ->send();
    }

    protected static function decodeKeyValueState(\Filament\Forms\Components\KeyValue $component, mixed $state): void
    {
        if (is_string($state)) {
            $decoded = json_decode($state, true);
            $state = is_array($decoded) ? $decoded : [];
        }
        $component->state($state ?? []);
    }

    protected function getFormActions(): array
    {
        return [
            PageAction::make('save')
                ->label('Save Changes')
                ->icon('heroicon-o-check')
                ->color('primary')
                ->submit('save'),

            PageAction::make('reset')
                ->label('Reset to Default')
                ->icon('heroicon-o-arrow-path')
                ->color('warning')
                ->requiresConfirmation()
                ->modalHeading('Reset to Default Settings')
                ->modalDescription('This will restore all settings to their default values. Are you sure?')
                ->action(function () {
                    AppSetting::query()->delete();
                    AppSettingService::seedDefaults();
                    $this->form->fill(AppSettingService::getAll());

                    Notification::make()
                        ->title('Settings reset to defaults')
                        ->success()
                        ->send();
                }),
        ];
    }
}