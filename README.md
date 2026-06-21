# CardVerse — Web AR Interactive Business Card

CardVerse adalah aplikasi web Augmented Reality (AR) berbasis *Image Tracking* untuk kartu nama interaktif. Proyek ini menggunakan **MindAR.js** dan **Three.js** tanpa memerlukan instalasi framework atau bundler (murni Vanilla JS, HTML5, CSS3).

## 🚀 Fitur Utama
- **Web-Based AR**: Akses langsung melalui browser tanpa instalasi aplikasi tambahan.
- **Multi-Target Tracking**: Mendukung 3 kartu nama unik sekaligus.
- **Glassmorphism Design**: Tampilan antarmuka modern dengan *dark theme* dan *glowing effects*.
- **Interactive Overlay**: Panel sosial media yang muncul secara interaktif saat kartu dideteksi.

---

## 🛠️ Cara Setup & Menghasilkan File `targets.mind`

Agar AR dapat berjalan, sistem memerlukan file referensi pola (marker). Anda perlu men-generate file `targets.mind` menggunakan MindAR Compiler.

1. Siapkan 3 foto/gambar desain kartu nama dalam format `.jpg` atau `.png`.
   - **Penting:** Urutan gambar akan menentukan siapa yang dideteksi!
     - Gambar ke-1 (Index 0): Agustian Putra Sukarya
     - Gambar ke-2 (Index 1): Bayu Syabana
     - Gambar ke-3 (Index 2): Sayyid Abdurrasyad
2. Buka **[MindAR Image Compiler](https://hiukim.github.io/mind-ar-js-doc/tools/compile)** di browser Anda.
3. Klik tombol **Drop images here or click to select**, lalu pilih ketiga gambar kartu nama tersebut (pastikan urutannya benar sesuai poin 1).
4. Klik tombol **Start**.
5. Tunggu proses kompilasi selesai (mungkin memakan waktu beberapa saat).
6. Setelah selesai, klik **Download** untuk mengunduh file hasil kompilasi.
7. Ganti nama file tersebut menjadi `targets.mind`.
8. Pindahkan file `targets.mind` ke dalam folder `assets/` di proyek ini. Struktur akhirnya akan menjadi: `assets/targets.mind`.

---

## 💻 Cara Test Lokal dengan HTTPS

Karena mengakses kamera web mensyaratkan koneksi yang aman (Secure Context), Anda wajib menggunakan HTTPS atau menjalankannya lewat `localhost` saat melakukan testing.

### Opsi 1: Menggunakan Live Server di VSCode (Paling Mudah)
1. Install ekstensi **Live Server** di Visual Studio Code.
2. Buka folder `CardVerse` di VSCode.
3. Klik kanan pada file `index.html` dan pilih **Open with Live Server**.
4. Browser akan otomatis membuka `http://localhost:5500`. (Kamera dapat diakses melalui localhost).

### Opsi 2: Menggunakan Python HTTP Server
Jika Anda memiliki Python terinstal di komputer:
1. Buka terminal/command prompt.
2. Navigasikan ke dalam folder proyek: `cd path/to/CardVerse`
3. Jalankan server:
   - Python 3: `python -m http.server 8000`
   - Python 2: `python -m SimpleHTTPServer 8000`
4. Buka browser dan akses: `http://localhost:8000`

### Test di HP via Jaringan Lokal (Membutuhkan HTTPS)
Jika Anda ingin mengetes langsung dari kamera HP dengan mengakses IP komputer Anda (misalnya `http://192.168.x.x:8000`), kamera **tidak akan berfungsi** karena bukan HTTPS/localhost. 

Solusinya: Gunakan **ngrok** atau **localtunnel** untuk membuat tunnel HTTPS:
```bash
npx localtunnel --port 5500
```
*(Asumsi server lokal berjalan di port 5500)*. Anda akan mendapatkan URL HTTPS yang aman dibuka di HP.

---

## 🌍 Cara Deploy ke Netlify

Untuk mengonlinekan proyek agar dapat diakses oleh siapa saja:

1. Buat akun atau login di **[Netlify](https://app.netlify.com/)**.
2. Masuk ke halaman Dashboard / Team.
3. Cari menu **Sites** > **Add new site** > **Deploy manually**.
4. Drag-and-drop seluruh folder `CardVerse` (yang berisi `index.html`, `js/`, `css/`, `assets/`, dll.) ke dalam area drop yang disediakan.
5. Tunggu proses upload selesai.
6. Proyek Anda kini live! Netlify akan memberikan URL acak dengan HTTPS secara otomatis (misalnya `https://cool-site-1234.netlify.app`).
7. (Opsional) Anda dapat mengubah nama URL di menu *Site Settings* > *Change site name*.

---

## 📂 Struktur Proyek

```text
CardVerse/
├── index.html          # Landing page (Beranda)
├── ar.html             # AR Viewer page (Kamera Layar Penuh)
├── css/
│   ├── style.css       # Global styles & Landing Page
│   └── ar.css          # AR Viewer specific UI styles
├── js/
│   ├── config.js       # Data konfigurasi 3 user dan tema
│   ├── landing.js      # Animasi, canvas avatar generator untuk Landing Page
│   ├── overlay-ui.js   # Script untuk membangun AR panel & Name Card 3D Canvas
│   └── ar-main.js      # MindAR & Three.js initialization, logic AR states
├── assets/
│   └── targets.mind    # FILE INI HARUS DIGENERATE (MindAR tracking file)
└── README.md           # Dokumentasi (File ini)
```

**Selamat Mencoba!**
