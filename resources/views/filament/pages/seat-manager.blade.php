<x-filament-panels::page>
    <div class="tkx-dashboard">
        <div class="tkx-card tkx-panel tkx-seat-toolbar">
            <div>
                <span class="tkx-eyebrow">Konfigurasi Kabin</span>
                <h3 class="tkx-seat-heading">Denah Kursi &amp; Ketersediaan Armada</h3>
                <p class="tkx-panel-sub">
                    Klik kursi untuk memblokir atau membuka kursi dari pemesanan publik.
                </p>
            </div>

            <div class="tkx-seat-selector">
                <label for="schedule-select" class="tkx-form-label">Pilih Jadwal</label>
                <select id="schedule-select" wire:model.live="scheduleId" class="tkx-input">
                    @foreach ($this->schedules as $scheduleOption)
                        <option value="{{ $scheduleOption->id }}">
                            {{ $scheduleOption->departure_time }} - {{ $scheduleOption->vehicle_name }}
                            ({{ $scheduleOption->departure_city }} &rarr; {{ $scheduleOption->arrival_city }})
                        </option>
                    @endforeach
                </select>
            </div>
        </div>

        @php
            $schedule = $this->schedule;
            $bookedSeats = $schedule?->booked_seats ?? [];
            $blockedSeats = $schedule?->blocked_seats ?? [];
            $passengers = $this->bookedPassengers;
            $freeSeats = $schedule
                ? max(0, $schedule->total_seats - count($bookedSeats) - count($blockedSeats))
                : 0;
        @endphp

        @if ($schedule)
            <div class="tkx-seat-layout-grid">
                <div class="tkx-card tkx-panel">
                    <div class="tkx-panel-header">
                        <div>
                            <h4 class="tkx-panel-title">{{ $schedule->vehicle_name }}</h4>
                            <p class="tkx-panel-sub">
                                Plat <span class="tkx-mono">{{ $schedule->plate_number }}</span>
                                &bull; {{ $schedule->departure_time }} WIB
                            </p>
                        </div>
                        <span class="tkx-badge tkx-badge-info">
                            Kapasitas {{ $schedule->total_seats }} Kursi
                        </span>
                    </div>

                    <div class="tkx-cockpit">
                        <span class="tkx-cockpit-door">Pintu Penumpang</span>
                        <span class="tkx-cockpit-driver">Sopir (Driver)</span>
                    </div>

                    <div class="tkx-seat-rows">
                        @foreach ($this->layoutRows as $row)
                            <div class="tkx-seat-row" wire:key="row-{{ $schedule->id }}-{{ $loop->index }}">
                                <span class="tkx-seat-row-label">{{ $row['label'] }}</span>

                                <div class="tkx-seat-row-seats">
                                    @foreach ($row['seats'] as $seat)
                                        @php
                                            $isBooked = in_array($seat, $bookedSeats, true);
                                            $isBlocked = in_array($seat, $blockedSeats, true);
                                        @endphp

                                        <div class="tkx-seat-item">
                                            <button
                                                type="button"
                                                wire:click="toggleSeat('{{ $seat }}')"
                                                class="tkx-seat {{ $isBooked ? 'is-booked' : ($isBlocked ? 'is-blocked' : '') }}"
                                                title="{{ $isBooked ? 'Sudah dipesan' : ($isBlocked ? 'Diblokir oleh admin' : 'Tersedia, klik untuk memblokir') }}"
                                            >
                                                <x-filament::icon icon="heroicon-o-user" />
                                                <span>{{ $seat }}</span>

                                                @if ($isBooked)
                                                    <span class="tkx-seat-mark">
                                                        <x-filament::icon icon="heroicon-s-check-circle" />
                                                    </span>
                                                @elseif ($isBlocked)
                                                    <span class="tkx-seat-mark">
                                                        <x-filament::icon icon="heroicon-s-lock-closed" />
                                                    </span>
                                                @endif
                                            </button>

                                            <span class="tkx-seat-caption">
                                                {{ $isBooked ? 'Terisi' : ($isBlocked ? 'Diblokir' : 'Buka') }}
                                            </span>
                                        </div>
                                    @endforeach
                                </div>
                            </div>
                        @endforeach
                    </div>

                    <div class="tkx-seat-legend">
                        <div class="tkx-seat-legend-item">
                            <span class="tkx-seat-swatch"></span>
                            <span>Tersedia</span>
                        </div>
                        <div class="tkx-seat-legend-item">
                            <span class="tkx-seat-swatch is-booked"></span>
                            <span class="tkx-text-primary">Terisi Penumpang</span>
                        </div>
                        <div class="tkx-seat-legend-item">
                            <span class="tkx-seat-swatch is-blocked"></span>
                            <span class="tkx-blocked-text">Diblokir Offline</span>
                        </div>
                    </div>
                </div>

                <div class="tkx-seat-side">
                    <div class="tkx-card tkx-panel">
                        <h4 class="tkx-panel-title">Petunjuk Pengelolaan Kursi</h4>
                        <p class="tkx-panel-sub tkx-seat-help">
                            Blokir kursi untuk kebutuhan operasional seperti kursi rusak, jarak fisik,
                            atau titipan paket berharga. Kursi yang sudah dipesan penumpang tidak dapat diblokir.
                        </p>

                        <div class="tkx-seat-stats">
                            <div class="tkx-seat-stat">
                                <span>Kursi Terisi Penumpang</span>
                                <strong class="tkx-text-primary">{{ count($bookedSeats) }} Kursi</strong>
                            </div>
                            <div class="tkx-seat-stat">
                                <span>Kursi Diblokir Admin</span>
                                <strong class="tkx-blocked-text">{{ count($blockedSeats) }} Kursi</strong>
                            </div>
                            <div class="tkx-seat-stat">
                                <span>Kursi Bebas Tersedia</span>
                                <strong class="tkx-free-text">{{ $freeSeats }} Kursi</strong>
                            </div>
                        </div>
                    </div>

                    <div class="tkx-card tkx-panel">
                        <h4 class="tkx-panel-title">Daftar Kursi Terisi Penumpang</h4>

                        @if (count($bookedSeats) === 0)
                            <div class="tkx-empty" style="margin-top: 0.75rem;">
                                Belum ada kursi yang dipesan pada jadwal ini.
                            </div>
                        @else
                            <div class="tkx-booked-seats">
                                @foreach ($bookedSeats as $seat)
                                    <div class="tkx-booked-seat">
                                        <div class="tkx-booked-seat-id">{{ $seat }}</div>
                                        <div>
                                            <span class="tkx-strong">Kursi Nomor {{ $seat }}</span>
                                            <span class="tkx-muted tkx-small">
                                                {{ $passengers[$seat] ?? 'Penumpang' }}
                                            </span>
                                        </div>
                                        <span class="tkx-badge tkx-badge-success">Lunas</span>
                                    </div>
                                @endforeach
                            </div>
                        @endif
                    </div>
                </div>
            </div>
        @else
            <div class="tkx-empty">
                Belum ada jadwal. Tambahkan jadwal terlebih dahulu di menu Jadwal &amp; Rute.
            </div>
        @endif
    </div>
</x-filament-panels::page>
