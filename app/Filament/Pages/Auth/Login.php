<?php

namespace App\Filament\Pages\Auth;

use App\Services\AppSettingService;
use Filament\Facades\Filament;
use Filament\Http\Responses\Auth\Contracts\LoginResponse;
use Filament\Pages\Auth\Login as BaseLogin;
use Filament\Forms\Components\Component;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Form;
use Illuminate\Contracts\Support\Htmlable;

class Login extends BaseLogin
{
    public function mount(): void
    {
        if (Filament::auth()->check()) {
            redirect()->intended(Filament::getUrl());
        }
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                $this->getEmailFormComponent(),
                $this->getPasswordFormComponent(),
                $this->getRememberFormComponent(),
            ])
            ->statePath('data');
    }

    protected function getLoginFormComponent(): Component
    {
        $loginLogo = AppSettingService::getLoginLogo();
        $appName = AppSettingService::getAppName();
        $appTagline = AppSettingService::getAppTagline();
        $backgroundImage = AppSettingService::getLoginBackgroundImage();
        $primaryColor = AppSettingService::getPrimaryColor();
        $secondaryColor = AppSettingService::getSecondaryColor();

        return Section::make()
            ->schema([
                Grid::make(1)->schema([
                    // Logo
                    $loginLogo
                        ? \Filament\Forms\Components\Placeholder::make('logo')
                            ->content(fn () => <<<HTML
                                <div class="flex justify-center mb-6">
                                    <img src="{$loginLogo}" alt="{$appName}" class="h-20 w-auto" />
                                </div>
                                HTML)
                        : null,

                    // App Name & Tagline
                    \Filament\Forms\Components\Placeholder::make('branding')
                        ->content(fn () => <<<HTML
                            <div class="text-center mb-8">
                                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{$appName}</h1>
                                <p class="text-gray-600 dark:text-gray-400 mt-1">{$appTagline}</p>
                            </div>
                            HTML),

                    // Login Form Fields
                    $this->getEmailFormComponent(),
                    $this->getPasswordFormComponent(),
                    $this->getRememberFormComponent(),
                ]),
            ])
            ->columns(1)
            ->collapsible(false);
    }

    public function getHeading(): string
    {
        return AppSettingService::getAppName();
    }

    public function getSubheading(): string
    {
        return AppSettingService::getAppTagline();
    }
}