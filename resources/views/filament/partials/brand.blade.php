@php
    $settings = \App\Services\AppSettingService::getAll();
    $branding = $settings['branding'] ?? [];
    $general = $settings['general'] ?? [];
    $company = $settings['company'] ?? [];
    $logoLight = $branding['logo_light'] ?? null;
    $primaryColor = $branding['primary_color'] ?? '#2563eb';
    $appName = $general['app_name'] ?? 'Tiketux';
    $appTagline = $general['app_tagline'] ?? 'Perjalanan Nyaman, Tiba Tepat Waktu';
    $companyName = $company['company_name'] ?? 'Boy Wisata Executive';
@endphp

<span class="tkx-brand" style="--brand-primary: {{ $primaryColor }};">
    @if($logoLight)
        <img src="{{ asset($logoLight) }}" alt="{{ $appName }} Admin" class="tkx-brand-mark" />
    @else
        <div class="tkx-brand-mark tkx-brand-mark-fallback" style="background-color: {{ $primaryColor }};">
            <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
        </div>
    @endif
    <span class="tkx-brand-text">
        <span class="tkx-brand-name">{{ $appName }}<span class="tkx-brand-accent">Admin</span></span>
        <span class="tkx-brand-sub">{{ $companyName }} - Shuttle Operations Panel</span>
    </span>
</span>