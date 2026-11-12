'use client';

import React from 'react';
import { Bus, Phone, Mail, MapPin, ShieldCheck, Heart } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

export default function Footer() {
  const { getSetting, getSettingValue } = useSettings();

  const companyName = getSetting('company', 'company_name') as string || 'Boy Wisata Executive';
  const companyLegalName = getSetting('company', 'company_legal_name') as string || 'PT Boy Wisata Executive';
  const companyAddress = getSetting('company', 'company_address') as string || '';
  const companyCity = getSetting('company', 'company_city') as string || '';
  const companyProvince = getSetting('company', 'company_province') as string || '';
  const companyPostalCode = getSetting('company', 'company_postal_code') as string || '';
  const companyCountry = getSetting('company', 'company_country') as string || 'Indonesia';
  const companyPhone = getSetting('company', 'company_phone') as string || '';
  const companyWhatsApp = getSetting('company', 'company_whatsapp') as string || '';
  const companyEmail = getSetting('company', 'company_email') as string || '';
  const companyWebsite = getSetting('company', 'company_website') as string || '';
  const companyNpwp = getSetting('company', 'company_npwp') as string || '';
  const supportEmail = getSetting('contact', 'support_email') as string || '';
  const supportPhone = getSetting('contact', 'support_phone') as string || '';
  const whatsappSupport = getSetting('contact', 'whatsapp_support') as string || '';
  const facebookUrl = getSetting('contact', 'facebook_url') as string || '';
  const instagramUrl = getSetting('contact', 'instagram_url') as string || '';
  const youtubeUrl = getSetting('contact', 'youtube_url') as string || '';
  const tiktokUrl = getSetting('contact', 'tiktok_url') as string || '';
  const websiteUrl = getSetting('contact', 'website_url') as string || '';
  const appName = getSetting('general', 'app_name') as string || 'Tiketux';
  const appTagline = getSetting('general', 'app_tagline') as string || 'Perjalanan Nyaman, Tiba Tepat Waktu';
  const appDescription = getSetting('general', 'app_description') as string || '';
  const primaryColor = getSetting('branding', 'primary_color') as string || '#2563eb';
  const logoLight = getSetting('branding', 'logo_light') as string || '';
  const copyrightText = getSetting('seo', 'meta_title') as string || `${appName} Go - Sistem Manajemen Tiket Shuttle & Travel`;

  const brandStyle = primaryColor ? { backgroundColor: primaryColor } : {};

  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              {logoLight ? (
                <img
                  src={logoLight}
                  alt={appName}
                  className="w-8 h-8 rounded-lg object-contain"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg text-white flex items-center justify-center font-bold" style={brandStyle}>
                  <Bus className="w-4 h-4 text-white" />
                </div>
              )}
              <span className="text-lg font-bold text-white tracking-tight">
                {appName}<span className="text-[#ff9142]">Go</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {appDescription || 'Layanan pemesanan tiket shuttle dan travel eksekutif antar kota dengan pemilihan kursi interaktif, e-tiket QR boarding, dan pembayaran instan.'}
            </p>
            <div className="flex items-center gap-2 text-slate-300 font-semibold pt-1">
              <ShieldCheck className="w-4 h-4 text-[#3b9cf6]" />
              <span>Tiket Resmi & Terverifikasi</span>
            </div>
          </div>

          {/* Company Info */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-sm mb-3">Informasi Perusahaan</h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li className="font-medium">{companyName}</li>
              {companyLegalName && <li>{companyLegalName}</li>}
              {companyAddress && <li>{companyAddress}</li>}
              {companyCity && companyProvince && (
                <li>{companyCity}, {companyProvince} {companyPostalCode ? ` ${companyPostalCode}` : ''}</li>
              )}
              {companyCountry && <li>{companyCountry}</li>}
              {companyNpwp && <li className="truncate">NPWP: {companyNpwp}</li>}
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-sm mb-3">Kontak & Bantuan</h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              {companyPhone && (
                <li className="flex items-start gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#3b9cf6] shrink-0 mt-0.5" />
                  <span>{companyPhone}</span>
                </li>
              )}
              {companyWhatsApp && (
                <li className="flex items-start gap-1.5">
                  <span className="w-3.5 h-3.5 shrink-0 mt-0.5">💬</span>
                  <a href={`https://wa.me/${companyWhatsApp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#25d366] transition-colors">
                    {companyWhatsApp}
                  </a>
                </li>
              )}
              {companyEmail && (
                <li className="flex items-start gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#3b9cf6] shrink-0 mt-0.5" />
                  <a href={`mailto:${companyEmail}`} className="hover:text-[#2563eb] transition-colors">
                    {companyEmail}
                  </a>
                </li>
              )}
              {supportEmail && (
                <li className="flex items-start gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-[#3b9cf6] shrink-0 mt-0.5" />
                  <a href={`mailto:${supportEmail}`} className="hover:text-[#2563eb] transition-colors">
                    Support: {supportEmail}
                  </a>
                </li>
              )}
              {supportPhone && (
                <li className="flex items-start gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#3b9cf6] shrink-0 mt-0.5" />
                  <span>CS: {supportPhone}</span>
                </li>
              )}
              {whatsappSupport && (
                <li className="flex items-start gap-1.5">
                  <span className="w-3.5 h-3.5 shrink-0 mt-0.5">💬</span>
                  <a href={`https://wa.me/${whatsappSupport.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-[#25d366] transition-colors">
                    WhatsApp CS
                  </a>
                </li>
              )}
            </ul>
          </div>

          {/* Social Media */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-sm mb-3">Media Sosial</h4>
            <div className="flex flex-wrap gap-2">
              {facebookUrl && (
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 hover:text-white text-xs transition-colors">
                  📘 Facebook
                </a>
              )}
              {instagramUrl && (
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 hover:text-white text-xs transition-colors">
                  📷 Instagram
                </a>
              )}
              {youtubeUrl && (
                <a href={youtubeUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 hover:text-white text-xs transition-colors">
                  ▶️ YouTube
                </a>
              )}
              {tiktokUrl && (
                <a href={tiktokUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 hover:text-white text-xs transition-colors">
                  🎵 TikTok
                </a>
              )}
              {websiteUrl && (
                <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 hover:text-white text-xs transition-colors">
                  🌐 Website
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom line */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} {appName} Go — Hak Cipta Dilindungi Undang-Undang.</p>
          <p className="flex items-center gap-1">
            Dibangun dengan cinta untuk kenyamanan perjalanan masyarakat Indonesia.
          </p>
        </div>
      </div>
    </footer>
  );
}