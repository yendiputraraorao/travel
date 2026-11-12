'use client';

import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

export default function WhatsAppFloatingButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendWA = (e: React.FormEvent) => {
    e.preventDefault();
    const text = encodeURIComponent(message || 'Halo Tiketux Go, saya butuh informasi jadwal shuttle.');
    window.open(`https://wa.me/6281234567890?text=${text}`, '_blank');
    setIsOpen(false);
    setMessage('');
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {isOpen && (
        <div className="mb-3 w-80 bg-white rounded-2xl shadow-soft-panel border border-[#e5e7eb] overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="bg-[#0f5d4a] text-white p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-white" />
              <div>
                <h4 className="font-bold text-xs">Customer Support Tiketux</h4>
                <p className="text-[10px] text-emerald-100">Siap membantu 24/7</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSendWA} className="p-3.5 space-y-2.5">
            <p className="text-xs text-[#6b7280]">
              Ada kendala pemesanan, tiket, atau jadwal travel? Tanyakan langsung pada tim kami:
            </p>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ketik pertanyaanmu di sini..."
              className="w-full text-xs p-2.5 rounded-xl border border-[#e5e7eb] focus:outline-none focus:ring-2 focus:ring-[#0f5d4a]/20 resize-none"
            />
            <button
              type="submit"
              className="w-full py-2 bg-[#0f5d4a] hover:bg-[#0c4a3b] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim via WhatsApp</span>
            </button>
          </form>
        </div>
      )}

      {/* Floating Pill Button per DESIGN.md: --c-whatsapp (#0f5d4a), white text 600 13px */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0f5d4a] hover:bg-[#0c4a3b] text-white font-semibold text-[13px] rounded-full shadow-lg hover:shadow-xl transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#0f5d4a]/30 active:scale-95"
      >
        <MessageCircle className="w-4 h-4 text-white" />
        <span>Bantuan WhatsApp</span>
      </button>
    </div>
  );
}
