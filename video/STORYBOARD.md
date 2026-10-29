# Kelana — explainer v2 · 60 s · 120 BPM (1 beat = 0.5 s)

Fokus: alur website. Hook → alur wisatawan (landing → susun itinerary → drag & drop → forum → booking)
→ masalah pemandu → alur mitra (daftar 1–4 → dashboard) → end card.

Halaman memakai export Figma dari repo apa adanya (supaya tampilannya persis desainmu).
Bagian yang bergerak (kartu yang di-drag, tile pilihan, slider, ketikan, bubble chat, bar grafik,
tombol Terima) dibangun ulang sebagai layer vektor atau potongan (sprite) dari export yang sama.
Benang merah: setiap klik membuka layar berikutnya lewat lingkaran yang tumbuh dari titik klik.

| t (s) | Layar | Yang terjadi | Caption |
|---|---|---|---|
| 0.0–2.0 | Hook | "Mau / liburan, / malah / bingung?" naik per ketukan | – |
| 2.5–4.0 | Hook | "Ujung-ujungnya / malah / gajadi / liburan?", lalu "liburan?" dicoret | – |
| 4.5–5.5 | Hook | "Dibuat gampang / di [logo KELANA] aja!" | – |
| 6.0 | Landing | Logo terbang ke logo navbar, landing page terbuka dari logo | Landing page · Beranda |
| 7.0–13.0 | Landing | Scroll per ketukan: Destinasi hidden gem → Itinerary unggulan → Tentang Kelana → Apa yang bikin beda → Review → CTA → Footer | nama tiap bagian |
| 13.5–14.0 | Landing | Kursor klik "Buat itinerary" di footer | |
| 14.0 | Susun 1 | Terbuka dari link | Susun itinerary · 1 Dasar |
| 14.6–15.4 | Susun 1 | Mengetik "Labuan Bajo, Nusa Tenggara Timur" | |
| 15.5 | Susun 1 | Klik "Pasangan" | |
| 16.5–17.4 | Susun 1 | Geser slider budget Rp 9,00 jt → Rp 5,00 jt | |
| 18.5 | Susun 2 | Klik "Lanjut ke minat" | Susun itinerary · 2 Minat |
| 19.5 / 20.0 / 20.5 | Susun 2 | Klik Pemandangan alam, Sunrise & sunset, Snorkeling Laut; chip Ringkasan muncul satu per satu | |
| 21.0 | Susun 2 | Klik tempo "Seimbang 4–5 aktivitas sehari" | |
| 23.0 | Susun 3 | Klik "Susun rencana saya" | Susun itinerary · 3 Rencana siap |
| 23.5–25.0 | Susun 3 | Bar estimasi biaya terisi per pos, total naik ke Rp 4,85 jt | |
| 25.5–26.5 | Susun 3 | Kamera ke kartu jadwal + peringatan jadwal mustahil | Jadwal nggak sesuai? Drag & drop aja |
| 27.0–28.2 | Susun 3 | Drag kartu Manta Point ke tab "Hari 3" | |
| 28.5–29.0 | Susun 3 | Kartu di bawahnya naik, peringatan terlipat, "4 aktivitas" → "3 aktivitas" | |
| 31.0 | Forum | Klik "Selesai & simpan rencana" | Forum · Ngobrol bareng traveler |
| 32.5–34.6 | Forum | Klik kolom pesan, mengetik pesan | |
| 35.0 | Forum | Kirim, bubble "Kamu" muncul, chat naik | |
| 36.0–37.0 | Forum | "Joevans Rafa sedang mengetik…", lalu balasannya muncul | |
| 39.0 | Booking | Klik "Booking" di navbar | Booking · Pemandu lokal terverifikasi |
| 41.0 | Booking | Klik pemandu Rihana Komeng, kartu "Booking berhasil!" terbuka | |
| 44.0 | Masalah | "Susah ketemu wisatawan, pendapatan ikut turun." + garis turun | – |
| 46.0–47.5 | Masalah | "Lewat Kelana Mitra, langsung terhubung ke wisatawan." + garis naik | – |
| 48.0 | Mitra 1 | Klik "Pemandu wisata" | Daftar mitra · 1 Tipe |
| 49.5 | Mitra 2 | Mengetik "Komodo Sail by Yanto" | Daftar mitra · 2 Data |
| 50.5 | Mitra 3 | Unggah KTP | Daftar mitra · 3 Verifikasi |
| 51.5 | Mitra 4 | Klik "Selesai & kirim" | Daftar mitra · 4 Layanan |
| 52.5 | Dashboard | Kartu statistik, bar pendapatan tumbuh | Dashboard mitra |
| 54.5–55.5 | Dashboard | Booking masuk, klik "Terima" → "Diterima" | |
| 57.0–60.0 | End | Logo KELANA, "Rencana liburan beres, pemandu lokal terhubung.", tombol "Mulai dari Jelajah →", "Gratis, tanpa perlu daftar dulu." | – |

Musik: 120 BPM, kick tiap ketukan, hit di tiap pergantian layar. Bagian masalah (44–48) dibuat redup
(bass dan arpeggio berhenti), lalu riser masuk ke hit terbesar di 48.0 saat beralih ke sisi mitra.
