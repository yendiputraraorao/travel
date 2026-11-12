@php
    $settings = \App\Services\AppSettingService::getAll();
    $branding = $settings['branding'] ?? [];
    $general = $settings['general'] ?? [];
    $seo = $settings['seo'] ?? [];

    $primaryColor = $branding['primary_color'] ?? '#2563eb';
    $secondaryColor = $branding['secondary_color'] ?? '#1e2430';
    $accentColor = $branding['accent_color'] ?? '#2563eb';
    $backgroundColor = $branding['background_color'] ?? '#ffffff';
    $sidebarColor = $branding['sidebar_color'] ?? '#1e2430';
    $favicon = $branding['favicon'] ?? null;
    $metaTitle = $seo['meta_title'] ?? 'Tiketux Go - Sistem Manajemen Tiket Shuttle & Travel';
    $metaDescription = $seo['meta_description'] ?? 'Platform pemesanan tiket travel dan shuttle eksekutif dengan pemilihan kursi interaktif, e-tiket QR Code, pembayaran QRIS/Transfer, dan dashboard admin manajemen armada.';
@endphp

<link
    rel="stylesheet"
    href="{{ asset('css/filament-admin.css') }}?v={{ filemtime(public_path('css/filament-admin.css')) }}"
/>

@if($favicon)
    <link rel="icon" href="{{ asset($favicon) }}" type="image/x-icon" />
    <link rel="shortcut icon" href="{{ asset($favicon) }}" type="image/x-icon" />
@else
    <link rel="icon" href="{{ asset('images/tiketux-admin-mark.svg') }}" type="image/svg+xml" />
@endif

<meta name="theme-color" content="{{ $primaryColor }}" />
<meta name="application-name" content="{{ config('app.name') }}" />

<style>
    :root {
        --color-primary: {{ $primaryColor }};
        --color-primary-50: {{ \Illuminate\Support\Str::of($primaryColor)->ltrim('#')->toString() }};
        --color-secondary: {{ $secondaryColor }};
        --color-accent: {{ $accentColor }};
        --color-background: {{ $backgroundColor }};
        --color-sidebar: {{ $sidebarColor }};
    }

    /* Dynamic primary color overrides for Filament components */
    .fi-primary-50 { background-color: {{ $primaryColor }}1a !important; }
    .fi-primary-100 { background-color: {{ $primaryColor }}33 !important; }
    .fi-primary-200 { background-color: {{ $primaryColor }}4d !important; }
    .fi-primary-300 { background-color: {{ $primaryColor }}66 !important; }
    .fi-primary-400 { background-color: {{ $primaryColor }}80 !important; }
    .fi-primary-500 { background-color: {{ $primaryColor }} !important; }
    .fi-primary-600 { background-color: {{ $primaryColor }}cc !important; }
    .fi-primary-700 { background-color: {{ $primaryColor }}e6 !important; }
    .fi-primary-800 { background-color: {{ $primaryColor }}f2 !important; }
    .fi-primary-900 { background-color: {{ $primaryColor }}ff !important; }

    /* Text colors */
    .fi-text-primary { color: {{ $primaryColor }} !important; }
    .fi-text-secondary { color: {{ $secondaryColor }} !important; }
    .fi-text-accent { color: {{ $accentColor }} !important; }

    /* Border colors */
    .fi-border-primary { border-color: {{ $primaryColor }} !important; }
    .fi-border-secondary { border-color: {{ $secondaryColor }} !important; }

    /* Focus rings */
    .fi-focus-ring-primary:focus { --tw-ring-color: {{ $primaryColor }} !important; }
    .fi-focus-ring-primary:focus-visible { --tw-ring-color: {{ $primaryColor }} !important; }

    /* Buttons */
    .fi-btn-primary { background-color: {{ $primaryColor }} !important; }
    .fi-btn-primary:hover { background-color: {{ $primaryColor }}cc !important; }
    .fi-btn-primary:focus { box-shadow: 0 0 0 3px {{ $primaryColor }}4d !important; }

    /* Sidebar */
    .fi-sidebar { background-color: {{ $sidebarColor }} !important; }
    .fi-sidebar-item:hover { background-color: {{ $primaryColor }}1a !important; }
    .fi-sidebar-item-active { background-color: {{ $primaryColor }}1a !important; }

    /* Header */
    .fi-header { background-color: {{ $backgroundColor }} !important; }

    /* Body */
    .fi-body { background-color: {{ $backgroundColor }} !important; }
</style>