import type { Metadata } from 'next';
import { ClientProviders } from '@/components/ClientProviders';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tiketux Go - Sistem Manajemen Tiket Shuttle & Travel',
  description: 'Platform pemesanan tiket travel dan shuttle eksekutif dengan pemilihan kursi interaktif, e-tiket QR Code, pembayaran QRIS/Transfer, dan dashboard admin manajemen armada.',
  openGraph: {
    title: 'Tiketux Go - Sistem Manajemen Tiket Shuttle & Travel',
    description: 'Platform pemesanan tiket travel dan shuttle eksekutif dengan pemilihan kursi interaktif, e-tiket QR Code, pembayaran QRIS/Transfer, dan dashboard admin manajemen armada.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tiketux Go - Sistem Manajemen Tiket Shuttle & Travel',
    description: 'Platform pemesanan tiket travel dan shuttle eksekutif dengan pemilihan kursi interaktif, e-tiket QR Code, pembayaran QRIS/Transfer, dan dashboard admin manajemen armada.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning className="min-h-screen bg-white text-[#1e2430]">
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}