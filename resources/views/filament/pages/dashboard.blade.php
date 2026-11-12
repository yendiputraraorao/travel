<x-filament-panels::page>
    <div class="tkx-dashboard">
        <div class="tkx-kpi-grid">
            <div class="tkx-card tkx-kpi">
                <div>
                    <span class="tkx-kpi-label">Pendapatan Tiket Hari Ini</span>
                    <h3 class="tkx-kpi-value tkx-text-primary">
                        Rp {{ number_format($totalRevenue, 0, ',', '.') }}
                    </h3>
                    <span class="tkx-kpi-meta">
                        <x-filament::icon icon="heroicon-o-arrow-trending-up" />
                        +{{ $paidBookingsCount }} Tiket Lunas
                    </span>
                </div>
                <div class="tkx-kpi-icon">
                    <x-filament::icon icon="heroicon-o-banknotes" />
                </div>
            </div>

            <div class="tkx-card tkx-kpi">
                <div>
                    <span class="tkx-kpi-label">Total Pemesanan Tiket</span>
                    <h3 class="tkx-kpi-value">
                        {{ $bookingsCount }} <small>Pemesanan</small>
                    </h3>
                    <span class="tkx-kpi-meta is-info">
                        {{ $readyToBoardCount }} Menunggu Boarding
                    </span>
                </div>
                <div class="tkx-kpi-icon">
                    <x-filament::icon icon="heroicon-o-ticket" />
                </div>
            </div>

            <div class="tkx-card tkx-kpi">
                <div>
                    <span class="tkx-kpi-label">Tingkat Okupansi Armada</span>
                    <h3 class="tkx-kpi-value">{{ $occupancyRate }}%</h3>
                    <span class="tkx-kpi-meta is-muted">
                        {{ $totalBookedSeats }} dari {{ $totalCapacity }} Kursi Terisi
                    </span>
                </div>
                <div class="tkx-kpi-icon is-indigo">
                    <x-filament::icon icon="heroicon-o-users" />
                </div>
            </div>

            <div class="tkx-card tkx-kpi">
                <div>
                    <span class="tkx-kpi-label">Armada Beroperasi</span>
                    <h3 class="tkx-kpi-value">
                        {{ $activeFleetCount }} <small>Unit</small>
                    </h3>
                    <span class="tkx-kpi-meta">
                        {{ $schedulesCount }} Jadwal Aktif
                    </span>
                </div>
                <div class="tkx-kpi-icon">
                    <x-filament::icon icon="heroicon-o-truck" />
                </div>
            </div>
        </div>

        <div class="tkx-banner">
            <div>
                <span class="tkx-banner-tag">Operasional Keberangkatan</span>
                <h3>Scanner QR Tiket Penumpang di Pintu Masuk Mobil</h3>
                <p>
                    Periksa dan scan QR Code pada tiket calon penumpang sebelum mereka naik mobil
                    untuk mencegah tiket palsu atau salah jadwal.
                </p>
            </div>

            <a href="{{ \App\Filament\Pages\BoardingScanner::getUrl() }}" class="tkx-banner-button">
                <x-filament::icon icon="heroicon-o-qr-code" />
                <span>Buka QR Scanner Boarding</span>
            </a>
        </div>

        <div class="tkx-content-grid">
            <div class="tkx-card tkx-panel">
                <div class="tkx-panel-header">
                    <div>
                        <h4 class="tkx-panel-title">Pemesanan Tiket Terkini</h4>
                        <p class="tkx-panel-sub">
                            Daftar tiket terbaru yang dipesan calon penumpang
                        </p>
                    </div>
                    <a href="{{ $bookingIndexUrl }}" class="tkx-link">
                        <span>Lihat Semua</span>
                        <x-filament::icon icon="heroicon-o-arrow-top-right-on-square" />
                    </a>
                </div>

                @if ($bookings->isEmpty())
                    <div class="tkx-empty">Belum ada pemesanan tiket.</div>
                @else
                    <div class="tkx-table-wrap">
                        <table class="tkx-table">
                            <thead>
                                <tr>
                                    <th>Kode Tiket</th>
                                    <th>Penumpang</th>
                                    <th>Rute &amp; Kursi</th>
                                    <th>Total Bayar</th>
                                    <th>Status Boarding</th>
                                    <th style="text-align: right;">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                @foreach ($bookings as $booking)
                                    <tr>
                                        <td class="tkx-code">{{ $booking->booking_code }}</td>
                                        <td>
                                            <span class="tkx-strong">{{ $booking->passenger_name }}</span>
                                            <span class="tkx-muted tkx-small">
                                                {{ $booking->passenger_phone }}
                                            </span>
                                        </td>
                                        <td>
                                            <span class="tkx-strong">
                                                {{ $booking->departure_city }} &rarr; {{ $booking->arrival_city }}
                                            </span>
                                            <span class="tkx-muted tkx-small">
                                                Kursi <strong class="tkx-text-primary">{{ $booking->seat_number }}</strong>
                                                &bull; {{ $booking->departure_time }} WIB
                                            </span>
                                        </td>
                                        <td>
                                            <span class="tkx-strong">
                                                Rp {{ number_format((int) $booking->total_price, 0, ',', '.') }}
                                            </span>
                                        </td>
                                        <td>
                                            @if ($booking->boarding_status === 'SUDAH_BOARDING')
                                                <span class="tkx-badge tkx-badge-success">
                                                    <x-filament::icon icon="heroicon-o-check-circle" />
                                                    Boarded
                                                </span>
                                            @else
                                                <span class="tkx-badge tkx-badge-warning">
                                                    <x-filament::icon icon="heroicon-o-clock" />
                                                    Belum Boarding
                                                </span>
                                            @endif
                                        </td>
                                        <td style="text-align: right;">
                                            <a
                                                href="{{ \App\Filament\Resources\BookingResource::getUrl('edit', ['record' => $booking]) }}"
                                                class="tkx-detail-btn"
                                            >
                                                Detail Tiket
                                            </a>
                                        </td>
                                    </tr>
                                @endforeach
                            </tbody>
                        </table>
                    </div>
                @endif
            </div>

            <div class="tkx-card tkx-panel">
                <div class="tkx-panel-header">
                    <h4 class="tkx-panel-title">Armada &amp; Driver Aktif</h4>
                    <a href="{{ $vehicleIndexUrl }}" class="tkx-link">Kelola Mobil</a>
                </div>

                @if ($vehicles->isEmpty())
                    <div class="tkx-empty">Belum ada data armada.</div>
                @else
                    <div class="tkx-vehicle-list">
                        @foreach ($vehicles as $vehicle)
                            @php
                                $statusClass = match ($vehicle->status) {
                                    'Aktif' => 'tkx-badge-success',
                                    'Dalam Perjalanan' => 'tkx-badge-info',
                                    default => 'tkx-badge-warning',
                                };
                            @endphp

                            <div class="tkx-vehicle">
                                <div>
                                    <h5 class="tkx-vehicle-name">{{ $vehicle->name }}</h5>
                                    <p class="tkx-vehicle-meta">
                                        Plat: <span class="tkx-mono">{{ $vehicle->plate_number }}</span>
                                    </p>
                                    <p class="tkx-vehicle-meta">Driver: {{ $vehicle->driver_name }}</p>
                                </div>

                                <span class="tkx-badge {{ $statusClass }}">
                                    {{ $vehicle->status }}
                                </span>
                            </div>
                        @endforeach
                    </div>
                @endif
            </div>
        </div>
    </div>
</x-filament-panels::page>
