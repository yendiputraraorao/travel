<x-filament-panels::page>
    <div class="tkx-dashboard">
        <div class="tkx-scanner-grid">
            <div class="tkx-card tkx-panel tkx-camera-card" x-data="{ active: true }">
                <div class="tkx-camera-title">
                    <span class="tkx-camera-title-left">
                        <x-filament::icon icon="heroicon-o-qr-code" />
                        <span>Kamera Deteksi QR Code</span>
                    </span>

                    <button type="button" class="tkx-camera-toggle" x-on:click="active = ! active">
                        <span x-show="active">Jeda Kamera</span>
                        <span x-show="! active">Aktifkan Kamera</span>
                    </button>
                </div>

                <div class="tkx-camera">
                    <span class="tkx-camera-corner is-tl"></span>
                    <span class="tkx-camera-corner is-tr"></span>
                    <span class="tkx-camera-corner is-bl"></span>
                    <span class="tkx-camera-corner is-br"></span>

                    <span class="tkx-camera-beam" x-show="active"></span>

                    <div class="tkx-camera-body">
                        <x-filament::icon icon="heroicon-o-qr-code" />
                        <p>Arahkan QR Code Tiket Penumpang ke Area Kamera</p>
                        <small>Kamera membaca secara otomatis &amp; instan</small>
                    </div>
                </div>

                <span class="tkx-camera-hint">
                    <x-filament::icon icon="heroicon-o-speaker-wave" />
                    <span>Suara beep konfirmasi aktif saat tiket terdeteksi.</span>
                </span>
            </div>

            <div class="tkx-dashboard">
                <div class="tkx-card tkx-panel">
                    <div class="tkx-panel-header">
                        <div>
                            <h4 class="tkx-panel-title">Cek Tiket Penumpang</h4>
                            <p class="tkx-panel-sub">
                                Masukkan kode tiket dari e-ticket atau hasil scan QR penumpang.
                            </p>
                        </div>

                        <span class="tkx-badge tkx-badge-success">
                            <span class="tkx-live-dot"></span>
                            Scanner Siap Melayani
                        </span>
                    </div>

                    <form wire:submit.prevent="search" class="tkx-scan-form">
                        <div>
                            <label class="tkx-form-label" for="ticket-code">Kode Tiket</label>

                            <div class="tkx-input-row">
                                <input
                                    id="ticket-code"
                                    type="text"
                                    wire:model="code"
                                    class="tkx-input"
                                    placeholder="Contoh: TKX-8921B atau paste nilai QR"
                                    autocomplete="off"
                                    spellcheck="false"
                                    oninput="this.value = this.value.toUpperCase()"
                                />

                                <button type="submit" class="tkx-btn tkx-btn-primary" wire:loading.attr="disabled" wire:target="search">
                                    <x-filament::icon icon="heroicon-o-magnifying-glass" />
                                    <span wire:loading.remove wire:target="search">Periksa Tiket</span>
                                    <span wire:loading wire:target="search">Memeriksa...</span>
                                </button>
                            </div>

                            @error('code')
                                <span class="tkx-error">{{ $message }}</span>
                            @enderror
                        </div>

                        <div class="tkx-quick-picks">
                            <span class="tkx-quick-picks-label">
                                Simulasi Cepat (Pilih Tiket Penumpang Siap Berangkat):
                            </span>

                            <div class="tkx-quick-pick-row">
                                @forelse ($this->quickPicks as $quickPick)
                                    <button
                                        type="button"
                                        class="tkx-quick-pick"
                                        wire:click="selectQuickPick('{{ $quickPick->booking_code }}')"
                                    >
                                        <span>{{ $quickPick->booking_code }}</span>
                                        <small>({{ $quickPick->passenger_name }} - K{{ $quickPick->seat_number }})</small>
                                    </button>
                                @empty
                                    <span class="tkx-muted tkx-small" style="font-style: italic;">
                                        Semua penumpang sudah boarding atau belum ada tiket baru.
                                    </span>
                                @endforelse
                            </div>
                        </div>
                    </form>
                </div>

                @if ($result)
                    @php
                        $statusClass = match ($result['status']) {
                            'VALID' => 'is-valid',
                            'ALREADY_BOARDED' => 'is-warning',
                            default => 'is-invalid',
                        };
                        $icon = match ($result['status']) {
                            'VALID' => 'heroicon-o-check-circle',
                            'ALREADY_BOARDED' => 'heroicon-o-exclamation-triangle',
                            default => 'heroicon-o-x-circle',
                        };
                    @endphp

                    <div class="tkx-scan-result {{ $statusClass }}">
                        <div class="tkx-scan-result-head">
                            <span class="tkx-scan-result-icon">
                                <x-filament::icon :icon="$icon" />
                            </span>

                            <div style="flex: 1;">
                                <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 0.75rem; flex-wrap: wrap;">
                                    <h4 class="tkx-scan-result-title">{{ $result['title'] }}</h4>
                                    <span class="tkx-badge {{ $result['status'] === 'VALID' ? 'tkx-badge-success' : ($result['status'] === 'ALREADY_BOARDED' ? 'tkx-badge-warning' : 'tkx-badge-danger') }}">
                                        {{ $result['status'] }}
                                    </span>
                                </div>

                                <p class="tkx-scan-result-message">{{ $result['message'] }}</p>

                                @if (! empty($result['booking_code']))
                                    <div class="tkx-result-grid">
                                        <div class="tkx-result-item">
                                            <p class="tkx-result-label">Penumpang</p>
                                            <p class="tkx-result-value">{{ $result['passenger_name'] }}</p>
                                            <span class="tkx-muted tkx-small">{{ $result['passenger_phone'] }}</span>
                                        </div>

                                        <div class="tkx-result-item">
                                            <p class="tkx-result-label">Nomor Kursi</p>
                                            <p class="tkx-result-value tkx-text-primary">
                                                Kursi {{ $result['seat_number'] }}
                                            </p>
                                        </div>

                                        <div class="tkx-result-item">
                                            <p class="tkx-result-label">Rute Perjalanan</p>
                                            <p class="tkx-result-value">
                                                {{ $result['departure_city'] }} &rarr; {{ $result['arrival_city'] }}
                                            </p>
                                            <span class="tkx-muted tkx-small">
                                                {{ $result['departure_time'] }} WIB
                                                @if ($result['departure_date'])
                                                    &bull; {{ $result['departure_date'] }}
                                                @endif
                                            </span>
                                        </div>

                                        <div class="tkx-result-item">
                                            <p class="tkx-result-label">Armada</p>
                                            <p class="tkx-result-value">{{ $result['vehicle_name'] }}</p>
                                            <span class="tkx-mono tkx-small tkx-text-primary">{{ $result['vehicle_plate'] }}</span>
                                        </div>

                                        <div class="tkx-result-item">
                                            <p class="tkx-result-label">Driver</p>
                                            <p class="tkx-result-value">{{ $result['driver_name'] ?: '-' }}</p>
                                        </div>

                                        <div class="tkx-result-item">
                                            <p class="tkx-result-label">Total Pembayaran</p>
                                            <p class="tkx-result-value">
                                                Rp {{ number_format($result['total_price'], 0, ',', '.') }}
                                            </p>
                                            <span class="tkx-badge {{ $result['payment_status'] === 'PAID' ? 'tkx-badge-success' : 'tkx-badge-danger' }}">
                                                {{ $result['payment_status'] === 'PAID' ? 'Lunas' : 'Belum Lunas' }}
                                            </span>
                                        </div>
                                    </div>
                                @endif

                                <div class="tkx-scanner-actions">
                                    @if (($result['status'] ?? null) === 'VALID')
                                        <button
                                            type="button"
                                            class="tkx-btn tkx-btn-accent"
                                            wire:click="processBoarding"
                                            wire:loading.attr="disabled"
                                            wire:target="processBoarding"
                                        >
                                            <x-filament::icon icon="heroicon-o-shield-check" />
                                            <span wire:loading.remove wire:target="processBoarding">
                                                Verifikasi &amp; Izinkan Penumpang Naik Mobil
                                            </span>
                                            <span wire:loading wire:target="processBoarding">Memproses...</span>
                                        </button>
                                    @elseif (($result['status'] ?? null) === 'ALREADY_BOARDED')
                                        <span class="tkx-badge tkx-badge-warning">
                                            <x-filament::icon icon="heroicon-o-check-circle" />
                                            Boarding selesai
                                            @if (! empty($result['boarded_at']))
                                                &bull; {{ $result['boarded_at'] }}
                                            @endif
                                        </span>
                                    @elseif (! empty($result['booking_code']))
                                        <span class="tkx-badge tkx-badge-danger">
                                            <x-filament::icon icon="heroicon-o-exclamation-triangle" />
                                            Tiket belum lunas, boarding tidak dapat diproses
                                        </span>
                                    @endif

                                    <button type="button" class="tkx-btn tkx-btn-ghost" wire:click="resetScan">
                                        Cari Tiket Lain
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                @endif

                @if ($successMessage)
                    <div class="tkx-success-banner">
                        <x-filament::icon icon="heroicon-o-check-circle" />
                        <span>{{ $successMessage }}</span>
                    </div>
                @endif

                @if (count($recentScans) > 0)
                    <div class="tkx-card tkx-panel">
                        <div class="tkx-panel-header">
                            <h4 class="tkx-panel-title">Aktivitas Boarding Terakhir Sesi Ini</h4>
                        </div>

                        <div class="tkx-recent-scans" style="margin-top: 0;">
                            @foreach ($recentScans as $scan)
                                <div class="tkx-recent-scan" wire:key="recent-{{ $loop->index }}">
                                    <div class="tkx-recent-scan-left">
                                        <span class="tkx-recent-scan-check">&check;</span>
                                        <div>
                                            <strong>{{ $scan['passenger_name'] }}</strong>
                                            <span class="tkx-muted tkx-small">
                                                Kursi {{ $scan['seat_number'] }} &bull; {{ $scan['vehicle_plate'] }}
                                                &bull; {{ $scan['booking_code'] }}
                                            </span>
                                        </div>
                                    </div>

                                    <time>{{ $scan['time'] }}</time>
                                </div>
                            @endforeach
                        </div>
                    </div>
                @endif
            </div>
        </div>
    </div>

    @push('scripts')
        <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.4/dist/confetti.browser.min.js"></script>
        <script>
            window.tkxPlayBeep = function (success) {
                try {
                    const AudioCtx = window.AudioContext || window.webkitAudioContext;

                    if (! AudioCtx) {
                        return;
                    }

                    const context = new AudioCtx();
                    const oscillator = context.createOscillator();
                    const gain = context.createGain();

                    oscillator.connect(gain);
                    gain.connect(context.destination);
                    oscillator.frequency.setValueAtTime(success ? 880 : 330, context.currentTime);
                    gain.gain.setValueAtTime(0.15, context.currentTime);
                    oscillator.start();
                    oscillator.stop(context.currentTime + (success ? 0.2 : 0.4));
                } catch (error) {
                    // Audio may be restricted by the browser.
                }
            };

            document.addEventListener('livewire:init', function () {
                Livewire.on('tkx-scan', function (event) {
                    const payload = Array.isArray(event) ? event[0] : event;
                    window.tkxPlayBeep(Boolean(payload && payload.valid));
                });

                Livewire.on('tkx-boarding', function () {
                    if (typeof window.confetti === 'function') {
                        window.confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
                    }
                });
            });
        </script>
    @endpush
</x-filament-panels::page>
