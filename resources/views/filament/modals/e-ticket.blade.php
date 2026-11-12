@php
    $isPaid = $booking->payment_status === 'PAID';
    $isBoarded = $booking->boarding_status === 'SUDAH_BOARDING';
@endphp

<div class="tkx-eticket">
    <div class="tkx-eticket-stripe"></div>

    <div class="tkx-eticket-header">
        <div>
            <div class="tkx-eticket-brand">
                Tiketux<span>Go</span>
                <small>Tiket Resmi Perjalanan Shuttle Antar Kota</small>
            </div>
        </div>

        <div class="tkx-eticket-code">
            <span>Kode Booking Tiket</span>
            <strong>{{ $booking->booking_code }}</strong>
        </div>
    </div>

    <div class="tkx-eticket-body">
        <div class="tkx-eticket-qr">
            <div
                class="tkx-eticket-qr-box"
                x-data="{
                    init() {
                        const renderQr = () => {
                            if (! window.QRCode || ! this.$refs.qr) {
                                return;
                            }

                            this.$refs.qr.innerHTML = '';
                            new window.QRCode(this.$refs.qr, {
                                text: @js($booking->qr_value ?: $booking->booking_code),
                                width: 132,
                                height: 132,
                                colorDark: '#1e2430',
                                colorLight: '#ffffff',
                                correctLevel: window.QRCode.CorrectLevel.H,
                            });
                        };

                        if (window.QRCode) {
                            renderQr();
                            return;
                        }

                        const script = document.createElement('script');
                        script.src = 'https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js';
                        script.onload = renderQr;
                        document.head.appendChild(script);
                    },
                }"
                x-init="init()"
            >
                <div x-ref="qr"></div>
            </div>

            <span>Scan Sebelum Naik Mobil</span>
            <span style="font-size: 0.5625rem; font-weight: 500; letter-spacing: 0; text-transform: none; color: var(--tkx-muted);">
                Verifikasi Driver / Petugas
            </span>
        </div>

        <div class="tkx-eticket-grid">
            <div class="tkx-eticket-item">
                <span>Nama Penumpang</span>
                <strong>{{ $booking->passenger_name }}</strong>
                <small>{{ $booking->passenger_phone }}</small>
            </div>

            <div class="tkx-eticket-item">
                <span>Nomor Kursi</span>
                <strong class="tkx-text-primary">Kursi {{ $booking->seat_number }}</strong>
                <small>{{ $booking->vehicle_name }} • {{ $booking->vehicle_plate }}</small>
            </div>

            <div class="tkx-eticket-item">
                <span>Rute Perjalanan</span>
                <strong>{{ $booking->departure_city }} → {{ $booking->arrival_city }}</strong>
                <small>{{ $booking->departure_pool }} → {{ $booking->arrival_pool }}</small>
            </div>

            <div class="tkx-eticket-item">
                <span>Jadwal Keberangkatan</span>
                <strong>
                    {{ $booking->departure_date?->format('d M Y') ?? '-' }}
                    • {{ $booking->departure_time }} WIB
                </strong>
                <small>Tiba {{ $booking->arrival_time }} WIB</small>
            </div>

            <div class="tkx-eticket-item">
                <span>Armada & Driver</span>
                <strong>{{ $booking->vehicle_name }}</strong>
                <small>{{ $booking->vehicle_plate }} • {{ $booking->driver_name }}</small>
            </div>

            <div class="tkx-eticket-item">
                <span>Pembayaran</span>
                <strong>Rp {{ number_format((int) $booking->total_price, 0, ',', '.') }}</strong>
                <small>
                    Via {{ $booking->payment_method }} •
                    {{ $isPaid ? 'LUNAS' : 'BELUM LUNAS' }}
                </small>
            </div>

            <div class="tkx-eticket-item">
                <span>Status Boarding</span>
                <strong>
                    <span class="tkx-badge {{ $isBoarded ? 'tkx-badge-success' : 'tkx-badge-warning' }}">
                        {{ $isBoarded ? 'Sudah Boarding' : 'Belum Boarding' }}
                    </span>
                </strong>
                @if ($booking->boarded_at)
                    <small>{{ $booking->boarded_at }} • {{ $booking->boarded_by }}</small>
                @endif
            </div>

            <div class="tkx-eticket-item">
                <span>Waktu Pemesanan</span>
                <strong>{{ $booking->booked_at }}</strong>
                <small>ID Tiket: <span class="tkx-mono">{{ $booking->id }}</span></small>
            </div>
        </div>
    </div>

    <div class="tkx-eticket-footer">
        <p>
            Tunjukkan e-tiket ini beserta identitas diri saat boarding.
            Tiket sah hanya jika status pembayaran lunas dan QR berhasil diverifikasi petugas.
        </p>

        <div class="tkx-eticket-actions">
            <button type="button" class="tkx-btn tkx-btn-primary" x-on:click="window.print()">
                <x-filament::icon icon="heroicon-o-printer" />
                <span>Cetak Tiket</span>
            </button>
        </div>
    </div>
</div>
