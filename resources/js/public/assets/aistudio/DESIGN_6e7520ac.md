# DESIGN.md — Pedoman Tema Visual (gaya Tiketux)

Dokumen ini adalah **aturan baku** bagi AI saat membuat desain UI (HTML, Blade, React, Tailwind, dll).
Baca seluruhnya sebelum menulis kode atau membuat mockup.

> **Ruang lingkup:** dokumen ini hanya mengatur **tema** (warna, tipografi, bentuk, bayangan, gaya komponen, nada bahasa).
> Dokumen ini **tidak mengatur tata letak**. Susunan halaman, jumlah kolom, dan urutan section ditentukan oleh kebutuhan proyek, bukan oleh dokumen ini.

> **Catatan akurasi:** nilai di bawah diestimasi dari screenshot, bukan dari CSS asli. Kalau pemilik proyek memberi nilai yang berbeda, nilai dari pemilik proyek yang berlaku.

---

## 1. Karakter Tema

Satu kalimat: **ramah, cerah, dan promo-sentris, dengan aksi yang selalu jelas.**

| Sifat | Artinya dalam desain |
|---|---|
| Ramah | Sudut membulat, bayangan lembut, bahasa santai |
| Cerah | Dasar putih dan biru muda, biru royal sebagai warna aksi |
| Fokus aksi | Setiap layar punya satu aksi utama yang paling menonjol |
| Hemat dan menggoda | Elemen promo (badge diskon, voucher, harga coret) tampil jelas dan mudah dipindai |
| Terpercaya | Rapi, kontras cukup, tidak ramai, tidak norak |

Hindari kesan: gelap dan dramatis, korporat kaku, minimalis dingin, atau penuh dekorasi.

---

## 2. Design Tokens

Selalu pakai token. **Jangan menulis hex langsung di komponen.**

### 2.1 Warna

| Token | Hex | Peran |
|---|---|---|
| `--c-primary` | `#2563eb` | Semua aksi utama: tombol utama, link aktif, panah carousel, harga akhir |
| `--c-primary-hover` | `#1d4fd8` | Hover/pressed tombol utama |
| `--c-primary-soft` | `#eff6ff` | Latar chip aktif, tombol sekunder, latar lekukan voucher |
| `--c-primary-ring` | `#bfdbfe` | Border chip aktif, cincin fokus |
| `--c-accent` | `#ff9142` | **Hanya** untuk satu aksi pencarian/konversi paling penting per layar, tombol swap, dan aksen logo |
| `--c-accent-hover` | `#f27d28` | Hover tombol aksen |
| `--c-sky-1` / `--c-sky-2` | `#3b9cf6` / `#2b86ee` | Gradasi banner promo |
| `--c-sky-bg` | `#eaf4ff` | Latar section promo (gradasi ke putih) |
| `--c-danger` | `#e11d2e` | Badge persen diskon, error |
| `--c-whatsapp` | `#0f5d4a` | Tombol chat melayang |
| `--c-text` | `#1e2430` | Teks utama (bukan hitam murni) |
| `--c-text-muted` | `#6b7280` | Teks sekunder, label, deskripsi |
| `--c-border` | `#e5e7eb` | Border input dan kartu |
| `--c-surface` | `#ffffff` | Permukaan kartu dan panel |
| `--c-step-bg` | `#eceefe` | Lingkaran nomor langkah |

**Aturan penggunaan warna**

1. Biru = "tekan ini untuk lanjut". Oranye = "ini aksi paling penting di layar". Jangan pakai oranye lebih dari satu tombol besar per layar.
2. Merah hanya untuk diskon dan error, bukan dekorasi.
3. Latar halaman putih. Warna masuk lewat banner, badge, dan chip, bukan lewat latar seluruh halaman.
4. Jangan menambah warna di luar tabel ini tanpa alasan kuat. Kalau perlu status (sukses, peringatan), turunkan dari palet yang ada dan tetap cerah.
5. Teks di atas `--c-primary` dan `--c-accent` selalu putih. Pastikan kontras teks isi minimal 4.5:1.

### 2.2 Tipografi

- **Font:** `Plus Jakarta Sans` (fallback: `system-ui, sans-serif`). Satu keluarga untuk semua teks.
- **Bobot:** 400 isi, 500 label/menu, 600 tombol, 700 judul dan harga, 800 hanya untuk angka promo besar.
- **Judul:** tebal (700), `letter-spacing: -0.01em`, `line-height: 1.2`.
- **Isi:** `line-height: 1.6`, warna `--c-text-muted`, panjang baris maksimal sekitar 70 karakter.
- **Skala yang disarankan:** 12 / 13 / 14 / 16 / 18 / 24 / 32 / 40 px. Judul hero boleh sampai 40–48 px.
- **Kapitalisasi:** sentence case ("Cari tiket hari ini"). Hindari ALL CAPS kecuali untuk banner promo bertema event.
- **Judul bergradasi** (`.text-gradient`, biru ke peach) boleh dipakai untuk **satu** judul section per halaman sebagai aksen, bukan di semua judul.

### 2.3 Bentuk (radius)

| Token | Nilai | Dipakai untuk |
|---|---|---|
| `--r-sm` | 8px | Tombol, input |
| `--r-md` | 16px | Kartu, banner, item FAQ |
| `--r-lg` | 24px | Panel sedang |
| `--r-xl` | 32px | Panel pencarian utama / panel hero |
| `--r-pill` | 999px | Chip, tab, search bar, badge orange |

Aturan: **radius mengikuti hierarki.** Elemen yang lebih besar mendapat radius lebih besar. Jangan memakai satu radius yang sama untuk semuanya.

### 2.4 Bayangan

Bayangan selalu **lembut dan bersemburat biru**, bukan abu-abu pekat.

- `--shadow-card`: `0 4px 16px rgba(30, 60, 120, .08)`
- `--shadow-panel`: `0 8px 28px rgba(30, 60, 120, .10)`
- `--shadow-nav`: `0 2px 12px rgba(30, 60, 120, .08)`

Kartu memakai border tipis (`#eef0f4`) **ditambah** bayangan. Jangan menumpuk bayangan tebal.

---

## 3. Spesifikasi Komponen

### Tombol
- **Utama:** latar `--c-primary`, teks putih, radius `--r-sm`, font 600 14px, padding ± 12×18px. Hover ke `--c-primary-hover`.
- **Aksen:** sama, latar `--c-accent`. Satu per layar.
- **Sekunder (soft):** latar `--c-primary-soft`, teks `--c-primary`.
- **Penuh lebar** dipakai di dalam kartu (contoh: tombol "Pilih").
- Fokus keyboard: outline 3px `--c-primary-ring`, offset 2px.
- Label tombol berupa kata kerja yang jelas: "Cari", "Pilih", "Salin Kode", "Masuk".

### Input dan pencarian
- Latar putih, border `--c-border`, radius `--r-sm`, font 500 15px.
- Ikon di sisi kiri (garis tipis, warna biru atau abu).
- Label kecil di atas input, warna `--c-text-muted`, 13px.
- Fokus: border `--c-primary` + cincin 3px `--c-primary-ring`.
- Search bar global berbentuk **pil**, ikon kaca pembesar di kiri, placeholder abu.

### Chip / tab filter
- Bentuk pil, border `--c-border`, latar putih.
- **Aktif:** latar `--c-primary-soft`, border `--c-primary-ring`, teks `--c-primary`, ada titik radio biru di kiri, bayangan biru tipis.

### Kartu
- Latar putih, border `#eef0f4`, radius `--r-md`, `--shadow-card`, padding 16px.
- Isi kartu produk: nama + logo kecil di kiri atas, badge diskon + harga coret + harga akhir di kanan atas, info utama di tengah, tombol penuh lebar di bawah.

### Harga dan diskon
- **Badge diskon:** latar `--c-danger`, teks putih, 11px/700, radius 6px.
- **Harga coret:** abu, `line-through`, 13px.
- **Harga akhir:** `--c-primary`, 700, 18px. Format rupiah dengan titik pemisah ribuan: `Rp. 94.999`.

### Banner promo
- Gradasi `--c-sky-1` → `--c-sky-2`, teks putih tebal, radius `--r-md`.
- Boleh memakai efek cahaya lembut (lingkaran transparan putih) sebagai dekorasi, **maksimal satu banner besar per halaman.**

### Kartu voucher
- Border tipis, radius `--r-md`, garis pemisah **putus-putus** (`2px dashed --c-border`).
- Dua lekukan setengah lingkaran di sisi kiri dan kanan pada garis pemisah (efek tiket).
- Bagian bawah: kolom kode + tombol utama "Salin Kode".

### Langkah bernomor
- Lingkaran 32px, latar `--c-step-bg`, angka biru tebal.
- Judul langkah 600, deskripsi abu 13–14px.
- Pakai **hanya** jika isinya memang berurutan.

### FAQ (accordion)
- Item berbentuk kapsul/kartu: border tipis, bayangan sangat ringan, radius `--r-md`.
- Pertanyaan di kiri, ikon `+` di kanan (berubah jadi `−` saat terbuka).
- Animasi buka-tutup hanya pada tinggi konten, singkat (≤ 200ms).

### Navbar
- Latar putih, `--shadow-nav`. Menu teks 500 `--c-text`.
- Tombol "Masuk" memakai gaya tombol utama. Search bar pil berada di dalam navbar.
- Di atas hero berfoto, navbar boleh transparan dengan teks putih, lalu berubah putih saat di-scroll.

### Tombol chat melayang
- Pil hijau tua `--c-whatsapp`, teks putih 600 13px, ikon WhatsApp di kiri, posisi kanan bawah.

### Ikon dan ilustrasi
- Ikon fungsional: garis tipis (outline), warna biru atau abu.
- Ikon dekoratif di samping judul section: **gaya 3D/emoji yang ceria** (label sale, confetti, tanda tanya, dompet). Satu ikon per judul, ukuran sekitar satu tinggi baris teks.
- Foto latar hero: pemandangan alam yang cerah dan lega, diberi lapisan putih transparan di atas agar teks tetap terbaca.

---

## 4. Nada Bahasa (Copy)

- Santai, akrab, dan langsung. Gunakan "kamu", "ya", "kita", bukan bahasa birokratis.
- Singkat dan spesifik. Tombol dan label menjelaskan apa yang terjadi.
- Contoh nada yang benar: "Tenang, kami punya jawabannya!", "Buruan sebelum kehabisan, promo hanya hari ini!", "Temukan tiket terbaik untuk perjalananmu".
- Urgensi boleh dipakai pada promo (hitung mundur, "hanya hari ini"), tetapi hanya jika memang benar.
- Pesan error: sebut masalahnya dan cara memperbaikinya, tanpa permintaan maaf berlebihan.
- Konsisten: satu aksi, satu nama di seluruh alur ("Cari" tetap "Cari", jangan jadi "Temukan" di tempat lain).

---

## 5. Aturan Tegas (Do & Don't)

**Lakukan**
- Pakai token, bukan nilai mentah.
- Jaga satu titik fokus per layar (biasanya satu tombol utama atau aksen).
- Berikan ruang kosong yang lega di sekitar kartu dan panel.
- Pastikan semua elemen interaktif punya state hover, fokus, dan nonaktif.
- Responsif sampai lebar mobile (~360px). Panel multi-kolom jatuh menjadi satu kolom.
- Hormati `prefers-reduced-motion`.

**Jangan**
- Jangan memakai hitam murni (`#000`) untuk teks. Pakai `--c-text`.
- Jangan memakai bayangan abu-abu pekat atau border tebal.
- Jangan memberi semua elemen radius yang sama.
- Jangan memakai oranye untuk tombol sekunder atau dekorasi.
- Jangan membuat latar halaman gelap atau penuh gradasi.
- Jangan menaruh lebih dari satu judul bergradasi dalam satu halaman.
- Jangan menambahkan animasi masuk di setiap section atau efek hover berlebihan di setiap kartu. Gerak dipakai untuk memberi umpan balik atas aksi pengguna.
- Jangan menyalin tata letak, logo, atau aset gambar milik Tiketux. Dokumen ini hanya meminjam gaya visualnya.

---

## 6. Menerapkan Tema ke Jenis Antarmuka Lain

Tema ini berasal dari situs pemesanan tiket, tetapi prinsipnya bisa dibawa ke jenis aplikasi lain:

- **Dashboard / panel admin:** latar halaman `--c-sky-bg` terang atau putih, sidebar putih dengan item aktif bergaya chip soft, kartu statistik memakai `--shadow-card`, tabel dengan header `--c-primary-soft` dan baris dipisah `--c-border`.
- **Form panjang:** label kecil di atas input, kelompokkan dalam panel `--r-lg`, tombol simpan utama di kanan bawah.
- **Tabel data:** tanpa garis vertikal, baris hover `--c-primary-soft`, aksi per baris berupa tombol soft kecil.
- **Status:** sukses, peringatan, dan info dibuat sebagai badge pil kecil dengan latar pastel dan teks lebih gelap dari warna yang sama.

Dalam semua kasus, **tata letak mengikuti kebutuhan fitur**, sementara warna, tipografi, bentuk, dan nada tetap dari dokumen ini.

---

## 7. Checklist Sebelum Menyerahkan Hasil

- [ ] Semua warna berasal dari token di bagian 2.1.
- [ ] Font Plus Jakarta Sans dimuat, dengan fallback.
- [ ] Hanya ada satu tombol aksen oranye per layar.
- [ ] Radius bertingkat sesuai hierarki (8 / 16 / 24 / 32 / pil).
- [ ] Bayangan lembut bersemburat biru, tidak pekat.
- [ ] Copy santai, singkat, dan konsisten.
- [ ] Kontras teks ≥ 4.5:1 dan fokus keyboard terlihat.
- [ ] Tampilan rapi di mobile.
- [ ] Tidak ada tata letak atau aset yang disalin dari situs sumber.

---

## 8. Cuplikan Siap Pakai

**CSS variables**

```css
:root {
  --c-primary: #2563eb;  --c-primary-hover: #1d4fd8;
  --c-primary-soft: #eff6ff;  --c-primary-ring: #bfdbfe;
  --c-accent: #ff9142;  --c-accent-hover: #f27d28;
  --c-sky-1: #3b9cf6;  --c-sky-2: #2b86ee;  --c-sky-bg: #eaf4ff;
  --c-danger: #e11d2e;  --c-whatsapp: #0f5d4a;
  --c-text: #1e2430;  --c-text-muted: #6b7280;
  --c-border: #e5e7eb;  --c-surface: #ffffff;  --c-step-bg: #eceefe;
  --font: 'Plus Jakarta Sans', system-ui, sans-serif;
  --r-sm: 8px;  --r-md: 16px;  --r-lg: 24px;  --r-xl: 32px;  --r-pill: 999px;
  --shadow-card: 0 4px 16px rgba(30, 60, 120, .08);
  --shadow-panel: 0 8px 28px rgba(30, 60, 120, .10);
  --shadow-nav: 0 2px 12px rgba(30, 60, 120, .08);
}
```

**Instruksi singkat untuk ditempel di awal prompt**

```text
Ikuti DESIGN.md untuk semua keputusan visual: warna, font, radius, bayangan,
gaya komponen, dan nada bahasa. Gunakan token, jangan hex mentah. Tata letak
bebas menyesuaikan kebutuhan fitur. Satu tombol aksen oranye per layar,
sisanya biru. Copy santai dan singkat. Jangan menyalin layout atau aset
dari situs sumber.
```
