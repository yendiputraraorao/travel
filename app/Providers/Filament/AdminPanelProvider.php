<?php

namespace App\Providers\Filament;

use App\Filament\Pages\Auth\Login;
use Filament\Http\Middleware\Authenticate;
use Filament\Http\Middleware\DisableBladeIconComponents;
use Filament\Http\Middleware\DispatchServingFilamentEvent;
use Filament\Panel;
use Filament\PanelProvider;
use Filament\Support\Colors\Color;
use Filament\Support\Enums\MaxWidth;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Session\Middleware\AuthenticateSession;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\View\Middleware\ShareErrorsFromSession;

class AdminPanelProvider extends PanelProvider
{
    public function panel(Panel $panel): Panel
    {
        return $panel
            ->default()
            ->id('admin')
            ->path('admin')
            ->login(Login::class)
            ->brandName(fn () => \App\Services\AppSettingService::getAppName() . ' Admin')
            ->brandLogo(fn () => view('filament.partials.brand'))
            ->brandLogoHeight('2.25rem')
            ->favicon(fn () => \App\Services\AppSettingService::getFavicon() ?? asset('images/tiketux-admin-mark.svg'))
            ->font(
                'Plus Jakarta Sans',
                'https://fonts.bunny.net/css?family=plus-jakarta-sans:400,500,600,700,800&display=swap',
            )
            ->colors([
                'primary' => Color::hex(\App\Services\AppSettingService::getPrimaryColor()),
                'secondary' => Color::hex(\App\Services\AppSettingService::getSecondaryColor()),
            ])
            ->darkMode(false)
            ->sidebarWidth('17rem')
            ->maxContentWidth(MaxWidth::SevenExtraLarge)
            ->renderHook('panels::head.end', fn () => view('filament.partials.theme-head'))
            ->discoverResources(in: app_path('Filament/Resources'), for: 'App\\Filament\\Resources')
            ->discoverPages(in: app_path('Filament/Pages'), for: 'App\\Filament\\Pages')
            ->discoverWidgets(in: app_path('Filament/Widgets'), for: 'App\\Filament\\Widgets')
            ->middleware([
                EncryptCookies::class,
                AddQueuedCookiesToResponse::class,
                StartSession::class,
                AuthenticateSession::class,
                ShareErrorsFromSession::class,
                VerifyCsrfToken::class,
                SubstituteBindings::class,
                DisableBladeIconComponents::class,
                DispatchServingFilamentEvent::class,
            ])
            ->authMiddleware([
                Authenticate::class,
            ]);
    }
}
